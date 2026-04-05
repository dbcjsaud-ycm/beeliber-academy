import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Credit costs per model (per generation, regardless of duration)
const CREDIT_COSTS: Record<string, number> = {
  'kling-3': 360,      // 210 base + ~5s * 30/s
  'kling-3-omni': 720, // 210 base + ~5s * 100/s
  'seedance-2': 2550,  // 550 base + ~5s * 400/s
  'wan-2.2': 205,      // 80 base + ~5s * 25/s
};

const MODEL_ENDPOINTS: Record<string, string> = {
  'kling-3': 'fal-ai/kling/v3',
  'kling-3-omni': 'fal-ai/kling/v3-omni',
  'seedance-2': 'fal-ai/seedance-2',
  'wan-2.2': 'fal-ai/wan-video/v2.2/text-to-video',
};

function aspectToFal(ratio: string): string {
  const map: Record<string, string> = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
  };
  return map[ratio] ?? '16:9';
}

async function generateWithFal(
  modelSlug: string,
  prompt: string,
  aspectRatio: string,
  duration: string,
  startImageUrl?: string
): Promise<{ videoUrl: string | null; error?: string }> {
  const falKey = process.env.FAL_KEY;
  if (!falKey) return { videoUrl: null, error: 'FAL_KEY not configured' };

  try {
    const payload: Record<string, unknown> = {
      prompt,
      aspect_ratio: aspectToFal(aspectRatio),
      duration,
    };
    if (startImageUrl) {
      payload.start_image_url = startImageUrl;
    }

    // Submit job
    const submitRes = await fetch(`https://queue.fal.run/${modelSlug}`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return { videoUrl: null, error: `fal submit failed: ${err}` };
    }

    const { request_id } = await submitRes.json();
    if (!request_id) return { videoUrl: null, error: 'No request_id from fal' };

    // Poll for result (up to 2 min)
    const maxAttempts = 24;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(r => setTimeout(r, 5000));

      const statusRes = await fetch(`https://queue.fal.run/${modelSlug}/requests/${request_id}/status`, {
        headers: { 'Authorization': `Key ${falKey}` },
      });

      if (!statusRes.ok) continue;
      const status = await statusRes.json();

      if (status.status === 'COMPLETED') {
        const resultRes = await fetch(`https://queue.fal.run/${modelSlug}/requests/${request_id}`, {
          headers: { 'Authorization': `Key ${falKey}` },
        });
        if (!resultRes.ok) return { videoUrl: null, error: 'Failed to fetch result' };
        const result = await resultRes.json();
        const videoUrl = result.video?.url ?? result.output?.video?.url ?? null;
        return { videoUrl };
      }

      if (status.status === 'FAILED') {
        return { videoUrl: null, error: 'Generation failed on fal' };
      }
    }

    return { videoUrl: null, error: 'Timeout waiting for video generation' };
  } catch (e) {
    return { videoUrl: null, error: String(e) };
  }
}

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────
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

  // ── Parse ─────────────────────────────────────────────────────────────
  let body: {
    prompt: string;
    modelId?: string;
    aspectRatio?: string;
    duration?: string;
    startImageUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const {
    prompt,
    modelId = 'kling-3',
    aspectRatio = '16:9',
    duration = '5s',
    startImageUrl,
  } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ success: false, error: '프롬프트를 입력하세요.' }, { status: 400 });
  }

  const resolvedModel = MODEL_ENDPOINTS[modelId] ? modelId : 'kling-3';
  const modelSlug = MODEL_ENDPOINTS[resolvedModel];
  const creditsCost = CREDIT_COSTS[resolvedModel] ?? 360;

  // ── Generate ──────────────────────────────────────────────────────────
  const { videoUrl, error } = await generateWithFal(
    modelSlug,
    prompt,
    aspectRatio,
    duration,
    startImageUrl
  );

  if (!videoUrl) {
    return NextResponse.json(
      { success: false, error: error ?? '영상 생성에 실패했습니다.' },
      { status: 500 }
    );
  }

  // ── Log + deduct credits ──────────────────────────────────────────────
  const generationId = crypto.randomUUID();
  try {
    await supabase.from('generations').insert({
      id: generationId,
      user_id: user.id,
      model_id: resolvedModel,
      type: 'video',
      status: 'completed',
      prompt,
      output_urls: [videoUrl],
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
      videoUrl,
      model: resolvedModel,
      creditsCost,
      prompt,
    },
  });
}
