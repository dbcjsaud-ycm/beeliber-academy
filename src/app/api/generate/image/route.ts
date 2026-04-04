import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { resolveAutoModel } from '@/types/models';

// Credit costs per model
const CREDIT_COSTS: Record<string, number> = {
  'flux-1-fast': 5,
  'flux-2-pro': 50,
  'seedream-5-lite': 50,
  'google-imagen-4': 100,
  'gpt': 150,
};

async function generateWithGemini(prompt: string, key: string): Promise<string | null> {
  try {
    // Gemini Imagen 3 (image generation)
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-preview-image-generation:generateContent',
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

async function generateWithOpenAI(
  prompt: string,
  key: string,
  size: string
): Promise<string | null> {
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
        size,
        quality: 'standard',
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

async function generateWithAnthropic(
  prompt: string,
  key: string
): Promise<string | null> {
  // Claude 3 can describe/analyze but not generate images.
  // Use as text fallback only (returns a placeholder).
  try {
    const sdk = await import('@anthropic-ai/sdk');
    const client = new sdk.default({ apiKey: key });
    const msg = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: `이 이미지 프롬프트를 보고 어떤 이미지가 생성될지 한국어로 설명해주세요 (2줄): "${prompt}"`,
        },
      ],
    });
    const text = msg.content[0]?.type === 'text' ? msg.content[0].text : '';
    // Return a placeholder with the description as text
    const encoded = encodeURIComponent(text.slice(0, 60));
    return `https://placehold.co/1024x1024/1a1a2e/a78bfa?text=${encoded}&font=montserrat`;
  } catch {
    return null;
  }
}

// Aspect ratio → OpenAI/Gemini size mapping
function aspectToSize(ratio: string): string {
  const map: Record<string, string> = {
    '1:1': '1024x1024',
    '16:9': '1792x1024',
    '9:16': '1024x1792',
    '4:3': '1024x1024',
  };
  return map[ratio] ?? '1024x1024';
}

export async function POST(req: NextRequest) {
  // ── Auth check ────────────────────────────────────────────────────────
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

  // ── Parse request ─────────────────────────────────────────────────────
  let body: {
    prompt: string;
    modelId?: string;
    negativePrompt?: string;
    aspectRatio?: string;
    references?: unknown[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const { prompt, modelId = 'auto', negativePrompt, aspectRatio = '1:1', references = [] } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ success: false, error: '프롬프트를 입력하세요.' }, { status: 400 });
  }
  if (prompt.length > 4000) {
    return NextResponse.json(
      { success: false, error: '프롬프트는 4000자 이내로 입력하세요.' },
      { status: 400 }
    );
  }

  // ── Model routing ─────────────────────────────────────────────────────
  const resolvedModel =
    modelId === 'auto'
      ? resolveAutoModel(prompt, references.length > 0)
      : modelId;

  const creditsCost = CREDIT_COSTS[resolvedModel] ?? 50;

  // ── Build final prompt ────────────────────────────────────────────────
  const finalPrompt = negativePrompt
    ? `${prompt}. 제외: ${negativePrompt}`
    : prompt;

  const size = aspectToSize(aspectRatio);

  // ── Provider fallback chain ───────────────────────────────────────────
  let imageUrl: string | null = null;
  let usedModel = resolvedModel;

  const geminiKey = process.env.GOOGLE_AI_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  // Route by resolved model
  if (['google-imagen-4', 'flux-2-pro', 'flux-1-fast', 'seedream-5-lite'].includes(resolvedModel) && geminiKey) {
    imageUrl = await generateWithGemini(finalPrompt, geminiKey);
    if (imageUrl) usedModel = 'gemini-imagen';
  }

  if (!imageUrl && (resolvedModel === 'gpt' || !imageUrl) && openaiKey) {
    imageUrl = await generateWithOpenAI(finalPrompt, openaiKey, size);
    if (imageUrl) usedModel = 'dall-e-3';
  }

  if (!imageUrl && geminiKey) {
    imageUrl = await generateWithGemini(finalPrompt, geminiKey);
    if (imageUrl) usedModel = 'gemini-fallback';
  }

  if (!imageUrl && anthropicKey) {
    imageUrl = await generateWithAnthropic(finalPrompt, anthropicKey);
    if (imageUrl) usedModel = 'claude-placeholder';
  }

  if (!imageUrl) {
    // Last resort: descriptive placeholder
    const encoded = encodeURIComponent(finalPrompt.slice(0, 50));
    imageUrl = `https://placehold.co/1024x1024/0f0f1a/6d28d9?text=${encoded}&font=montserrat`;
    usedModel = 'simulation';
  }

  // ── Deduct credits (best-effort) ──────────────────────────────────────────
  const generationId = crypto.randomUUID();
  try {
    await supabase.from('generations').insert({
      id: generationId,
      user_id: user.id,
      model_id: usedModel,
      type: 'image',
      status: 'completed',
      prompt: finalPrompt,
      output_urls: [imageUrl],
      credits_cost: creditsCost,
    });

    await supabase.rpc('deduct_credits', {
      p_user_id: user.id,
      p_amount: creditsCost,
      p_generation_id: generationId,
    });
  } catch {
    // Non-fatal
  }

  return NextResponse.json({
    success: true,
    data: {
      imageUrl,
      model: usedModel,
      resolvedModel,
      creditsCost,
      prompt: finalPrompt,
    },
  });
}
