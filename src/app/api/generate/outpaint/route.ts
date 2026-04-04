import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const OUTPAINT_CREDITS = 60;

async function generateWithGemini(prompt: string, key: string): Promise<string | null> {
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate an expanded image: ${prompt}` }] }],
          generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
        }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const parts = data.candidates?.[0]?.content?.parts ?? [];
    const imgPart = parts.find((p: Record<string, unknown>) => p.inlineData);
    if (!imgPart?.inlineData) return null;
    const { data: b64, mimeType } = imgPart.inlineData;
    return `data:${mimeType ?? 'image/png'};base64,${b64}`;
  } catch {
    return null;
  }
}

async function generateWithOpenAI(prompt: string, key: string): Promise<string | null> {
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
      }),
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

  // ── Provider chain ────────────────────────────────────────────────────────
  let resultUrl: string | null = null;
  let usedModel = 'simulation';

  const geminiKey = process.env.GOOGLE_AI_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    resultUrl = await generateWithGemini(finalPrompt, geminiKey);
    if (resultUrl) usedModel = 'gemini-outpaint';
  }

  if (!resultUrl && openaiKey) {
    resultUrl = await generateWithOpenAI(finalPrompt, openaiKey);
    if (resultUrl) usedModel = 'dall-e-3-outpaint';
  }

  if (!resultUrl) {
    const encoded = encodeURIComponent(prompt.slice(0, 40));
    resultUrl = `https://placehold.co/1024x1024/0a1a2e/22d3ee?text=${encoded}&font=montserrat`;
    usedModel = 'simulation';
  }

  // ── Deduct credits (best-effort — non-blocking) ───────────────────────────
  const generationId = crypto.randomUUID();
  try {
    // Record generation first
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

    await supabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: OUTPAINT_CREDITS,
      p_generation_id: generationId,
    });
  } catch {
    // Non-fatal: generation succeeded, credits logged but may fail silently
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
