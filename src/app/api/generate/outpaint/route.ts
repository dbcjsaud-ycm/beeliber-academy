import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

const OUTPAINT_CREDITS = 60;

async function uploadBase64ToStorage(dataUrl: string, userId: string, generationId: string): Promise<string> {
  if (!dataUrl.startsWith('data:')) return dataUrl;
  const [header, b64] = dataUrl.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] ?? 'image/png';
  const ext = mimeType.split('/')[1] ?? 'png';
  const buffer = Buffer.from(b64, 'base64');
  const admin = createAdminClient();
  const { error } = await admin.storage.from('generations').upload(`${userId}/${generationId}.${ext}`, buffer, { contentType: mimeType, upsert: true });
  if (error) return dataUrl;
  const { data: { publicUrl } } = admin.storage.from('generations').getPublicUrl(`${userId}/${generationId}.${ext}`);
  return publicUrl;
}

async function preDeductCredits(
  supabase: SupabaseClient,
  userId: string,
  amount: number,
  generationId: string,
): Promise<boolean> {
  const { error } = await supabase.rpc('deduct_credits', {
    p_user_id: userId,
    p_amount: amount,
    p_generation_id: generationId,
  });
  return !error;
}

function dataUrlToBlob(dataUrl: string): Blob | null {
  try {
    const [header, b64] = dataUrl.split(',');
    const mimeMatch = header.match(/:(.*?);/);
    const mime = mimeMatch?.[1] ?? 'image/png';
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  } catch {
    return null;
  }
}

async function generateWithGemini(
  prompt: string,
  key: string,
  imageUrl?: string,
): Promise<string | null> {
  try {
    const parts: unknown[] = [];

    // Include original image as reference when available
    if (imageUrl?.startsWith('data:')) {
      const [header, b64] = imageUrl.split(',');
      const mimeMatch = header.match(/:(.*?);/);
      const mimeType = mimeMatch?.[1] ?? 'image/png';
      parts.push({ inlineData: { data: b64, mimeType } });
    }

    parts.push({ text: `이 이미지를 자연스럽게 확장해주세요: ${prompt}` });

    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const responseParts = data.candidates?.[0]?.content?.parts ?? [];
    const imgPart = responseParts.find((p: Record<string, unknown>) => p.inlineData);
    if (!imgPart?.inlineData) return null;
    const { data: b64out, mimeType } = imgPart.inlineData;
    return `data:${mimeType ?? 'image/png'};base64,${b64out}`;
  } catch {
    return null;
  }
}

async function generateWithOpenAI(
  prompt: string,
  key: string,
  imageUrl?: string,
): Promise<string | null> {
  try {
    // Use image edit endpoint when original image is available
    if (imageUrl?.startsWith('data:')) {
      const blob = dataUrlToBlob(imageUrl);
      if (blob) {
        const form = new FormData();
        form.append('image', blob, 'image.png');
        form.append('prompt', prompt);
        form.append('n', '1');
        form.append('size', '1024x1024');
        form.append('model', 'dall-e-2');

        const res = await fetch('https://api.openai.com/v1/images/edits', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}` },
          body: form,
        });
        if (res.ok) {
          const data = await res.json();
          return data.data?.[0]?.url ?? null;
        }
      }
    }

    // Fallback: DALL-E 3 generation
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: 'dall-e-3', prompt, n: 1, size: '1024x1024' }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // ── Auth ─────────────────────────────────────────────────────────────────
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let body: {
    imageUrl?: string;
    expandTop?: number;
    expandBottom?: number;
    expandLeft?: number;
    expandRight?: number;
    prompt?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const {
    imageUrl,
    expandTop = 0,
    expandBottom = 0,
    expandLeft = 0,
    expandRight = 0,
    prompt,
  } = body;

  if (!prompt) {
    return NextResponse.json({ success: false, error: '프롬프트를 입력하세요.' }, { status: 400 });
  }
  if (!imageUrl) {
    return NextResponse.json({ success: false, error: '원본 이미지가 필요합니다.' }, { status: 400 });
  }
  if (expandTop + expandBottom + expandLeft + expandRight === 0) {
    return NextResponse.json({ success: false, error: '확장 방향을 지정하세요.' }, { status: 400 });
  }

  // Build context-aware prompt
  const expandDesc = [
    expandTop    > 0 ? `위 ${expandTop}px`    : '',
    expandBottom > 0 ? `아래 ${expandBottom}px` : '',
    expandLeft   > 0 ? `왼쪽 ${expandLeft}px`  : '',
    expandRight  > 0 ? `오른쪽 ${expandRight}px` : '',
  ].filter(Boolean).join(', ');

  const finalPrompt = `${prompt}. 이미지를 ${expandDesc} 방향으로 자연스럽게 확장한 결과물.`;

  // ── Pre-flight credit check ───────────────────────────────────────────────
  const { data: creditAccount } = await supabase
    .from('credit_accounts')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (!creditAccount || creditAccount.balance < OUTPAINT_CREDITS) {
    return NextResponse.json(
      { success: false, error: '크레딧이 부족합니다.', required: OUTPAINT_CREDITS, available: creditAccount?.balance ?? 0 },
      { status: 402 }
    );
  }

  // ── Pre-deduct credits BEFORE generation (prevents race condition) ────────
  const generationId = crypto.randomUUID();
  const deducted = await preDeductCredits(supabase, user.id, OUTPAINT_CREDITS, generationId);
  if (!deducted) {
    return NextResponse.json({ success: false, error: '크레딧이 부족합니다.' }, { status: 402 });
  }

  // ── Provider chain (imageUrl passed to providers for reference) ───────────
  let resultUrl: string | null = null;
  let usedModel = 'simulation';

  const geminiKey = process.env.GOOGLE_AI_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    resultUrl = await generateWithGemini(finalPrompt, geminiKey, imageUrl);
    if (resultUrl) usedModel = 'gemini-outpaint';
  }

  if (!resultUrl && openaiKey) {
    resultUrl = await generateWithOpenAI(finalPrompt, openaiKey, imageUrl);
    if (resultUrl) usedModel = 'dall-e-3-outpaint';
  }

  if (!resultUrl) {
    const encoded = encodeURIComponent(prompt.slice(0, 40));
    resultUrl = `https://placehold.co/1024x1024/0a1a2e/22d3ee?text=${encoded}&font=montserrat`;
    usedModel = 'simulation';
  }

  // ── Upload base64 to Storage (if needed) ─────────────────────────────────
  if (resultUrl.startsWith('data:')) {
    resultUrl = await uploadBase64ToStorage(resultUrl, user.id, generationId);
  }

  // ── Record generation (credits already deducted above) ───────────────────
  try {
    await supabase.from('generations').insert({
      id: generationId,
      user_id: user.id,
      model_id: usedModel,
      type: 'outpaint',
      status: 'completed',
      prompt: finalPrompt,
      output_urls: [resultUrl],
      credits_cost: OUTPAINT_CREDITS,
    });
  } catch {
    // Non-fatal
  }

  return NextResponse.json({
    success: true,
    data: {
      imageUrl: resultUrl,
      model: usedModel,
      creditsCost: OUTPAINT_CREDITS,
      prompt: finalPrompt,
    },
  });
}
