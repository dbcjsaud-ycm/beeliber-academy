import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

// Credit costs
const CREDIT_COSTS: Record<string, number> = {
  'kling-v2-5-pro': 360,
  'kling-v2-5-standard': 180,
  'kling-v2-master': 500,
};

// Generate Kling JWT token
async function getKlingToken(): Promise<string> {
  const accessKey = process.env.KLING_ACCESS_KEY!;
  const secretKey = process.env.KLING_SECRET_KEY!;

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30m')
    .setIssuer(accessKey)
    .sign(new TextEncoder().encode(secretKey));

  return token;
}

function aspectToKling(ratio: string): string {
  const map: Record<string, string> = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
    '3:4': '3:4',
  };
  return map[ratio] ?? '16:9';
}

async function generateKlingVideo(
  prompt: string,
  modelId: string,
  aspectRatio: string,
  duration: '5' | '10',
  startImageUrl?: string
): Promise<{ taskId: string | null; error?: string }> {
  try {
    const token = await getKlingToken();

    const payload: Record<string, unknown> = {
      model_name: modelId,
      prompt,
      aspect_ratio: aspectToKling(aspectRatio),
      duration,
      cfg_scale: 0.5,
    };

    if (startImageUrl) {
      payload.image_url = startImageUrl;
    }

    const endpoint = startImageUrl
      ? 'https://api.klingai.com/v1/videos/image2video'
      : 'https://api.klingai.com/v1/videos/text2video';

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok || data.code !== 0) {
      return { taskId: null, error: data.message ?? `Kling API error ${res.status}` };
    }

    return { taskId: data.data?.task_id ?? null };
  } catch (e) {
    return { taskId: null, error: String(e) };
  }
}

async function pollKlingTask(
  taskId: string,
  isImage2Video: boolean
): Promise<{ videoUrl: string | null; error?: string }> {
  const endpoint = isImage2Video
    ? `https://api.klingai.com/v1/videos/image2video/${taskId}`
    : `https://api.klingai.com/v1/videos/text2video/${taskId}`;

  const maxAttempts = 24; // 2 min max (5s interval)
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 5000));

    const token = await getKlingToken();
    const res = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) continue;
    const data = await res.json();
    if (data.code !== 0) return { videoUrl: null, error: data.message };

    const status = data.data?.task_status;
    if (status === 'succeed') {
      const videoUrl = data.data?.task_result?.videos?.[0]?.url ?? null;
      return { videoUrl };
    }
    if (status === 'failed') {
      return { videoUrl: null, error: data.data?.task_status_msg ?? 'Generation failed' };
    }
    // processing / waiting — keep polling
  }

  return { videoUrl: null, error: 'Timeout waiting for Kling video' };
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
    duration?: '5' | '10';
    startImageUrl?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: '잘못된 요청입니다.' }, { status: 400 });
  }

  const {
    prompt,
    modelId = 'kling-v2-5-pro',
    aspectRatio = '16:9',
    duration = '5',
    startImageUrl,
  } = body;

  if (!prompt || typeof prompt !== 'string') {
    return NextResponse.json({ success: false, error: '프롬프트를 입력하세요.' }, { status: 400 });
  }

  if (!process.env.KLING_ACCESS_KEY || !process.env.KLING_SECRET_KEY) {
    return NextResponse.json(
      { success: false, error: 'Kling API 키가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const resolvedModel = CREDIT_COSTS[modelId] ? modelId : 'kling-v2-5-pro';
  const creditsCost = CREDIT_COSTS[resolvedModel] * (duration === '10' ? 2 : 1);

  // ── Submit task ───────────────────────────────────────────────────────
  const { taskId, error: submitError } = await generateKlingVideo(
    prompt,
    resolvedModel,
    aspectRatio,
    duration,
    startImageUrl
  );

  if (!taskId) {
    return NextResponse.json(
      { success: false, error: submitError ?? '영상 생성 요청 실패' },
      { status: 500 }
    );
  }

  // ── Poll for result ───────────────────────────────────────────────────
  const { videoUrl, error: pollError } = await pollKlingTask(taskId, !!startImageUrl);

  if (!videoUrl) {
    return NextResponse.json(
      { success: false, error: pollError ?? '영상 생성에 실패했습니다.' },
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
