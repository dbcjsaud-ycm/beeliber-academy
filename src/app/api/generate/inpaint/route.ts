import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const INPAINT_CREDITS = 40;

/**
 * Attempt inpainting via OpenAI DALL-E-2 image edit endpoint.
 * Requires: original image + mask (transparent = fill) + prompt.
 * Falls back if API key missing or call fails.
 */
async function inpaintWithOpenAI(
  imageDataUrl: string,
  maskDataUrl: string | null,
  prompt: string,
  key: string
): Promise<string | null> {
  try {
    // Convert data URLs to Blobs for multipart upload
    const imageBlob = dataUrlToBlob(imageDataUrl);
    const maskBlob = maskDataUrl ? dataUrlToBlob(maskDataUrl) : null;

    if (!imageBlob) return null;

    const form = new FormData();
    form.append('image', imageBlob, 'image.png');
    if (maskBlob) form.append('mask', maskBlob, 'mask.png');
    form.append('prompt', prompt);
    form.append('n', '1');
    form.append('size', '1024x1024');
    form.append('model', 'dall-e-2');

    const res = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}` },
      body: form,
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

/**
 * Fallback: generate a new image from the prompt using Gemini.
 */
async function generateWithGemini(prompt: string, key: string): Promise<string | null> {
  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate an image: ${prompt}` }] }],
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

function dataUrlToBlob(dataUrl: string): Blob | null {
  try {
    const [header, data] = dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] ?? 'image/png';
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mime });
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
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
    return NextResponse.json(
      { success: false, error: '로그인이 필요합니다.' },
      { status: 401 }
    );
  }

  // ── Parse ────────────────────────────────────────────────────────────────
  let body: { imageUrl?: string; maskDataUrl?: string | null; prompt?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { imageUrl, maskDataUrl = null, prompt } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ success: false, error: '프롬프트를 입력하세요.' }, { status: 400 });
  }
  if (!imageUrl) {
    return NextResponse.json({ success: false, error: '원본 이미지가 필요합니다.' }, { status: 400 });
  }

  // ── Provider chain ───────────────────────────────────────────────────────
  let resultUrl: string | null = null;
  let usedModel = 'simulation';

  const openaiKey = process.env.OPENAI_API_KEY;
  const geminiKey = process.env.GOOGLE_AI_KEY;

  // 1. Try OpenAI inpainting (DALL-E-2 image edit)
  if (openaiKey && imageUrl.startsWith('data:')) {
    resultUrl = await inpaintWithOpenAI(imageUrl, maskDataUrl, prompt, openaiKey);
    if (resultUrl) usedModel = 'dall-e-2-inpaint';
  }

  // 2. Fallback: Gemini regeneration with context
  if (!resultUrl && geminiKey) {
    const ctxPrompt = `Inpainting result: ${prompt}`;
    resultUrl = await generateWithGemini(ctxPrompt, geminiKey);
    if (resultUrl) usedModel = 'gemini-fallback';
  }

  // 3. Simulation placeholder
  if (!resultUrl) {
    const encoded = encodeURIComponent(prompt.slice(0, 50));
    resultUrl = `https://placehold.co/1024x1024/1a0f2e/a78bfa?text=${encoded}&font=montserrat`;
    usedModel = 'simulation';
  }

  // ── Deduct credits (best-effort) ──────────────────────────────────────────
  const generationId = crypto.randomUUID();
  try {
    await supabase.from('generations').insert({
      id: generationId,
      user_id: user.id,
      model_id: usedModel,
      type: 'inpaint',
      status: 'completed',
      prompt,
      output_urls: [resultUrl],
      credits_cost: INPAINT_CREDITS,
    });

    await supabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: INPAINT_CREDITS,
      p_generation_id: generationId,
    });
  } catch {
    // Non-fatal
  }

  return NextResponse.json({
    success: true,
    data: {
      imageUrl: resultUrl,
      model: usedModel,
      creditsCost: INPAINT_CREDITS,
      prompt,
    },
  });
}
