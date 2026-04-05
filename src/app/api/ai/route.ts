import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createOpenAIClient, getOpenAIModel } from '@/lib/openai/client';
import { buildLessonSystemPrompt } from '@/lib/openai/prompt-builder';
import { buildStructuredPreview } from '@/lib/format-output';
import { createServerSupabaseClient } from '@/lib/supabase/server';

const RequestSchema = z.object({
  trackSlug: z.string().min(1),
  lessonSlug: z.string().min(1),
  prompt: z.string().min(10),
  inputPayload: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: NextRequest) {
  const authClient = await createServerSupabaseClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const body = RequestSchema.parse(json);

    const systemPrompt = buildLessonSystemPrompt(body.trackSlug, body.lessonSlug);
    const openai = createOpenAIClient();
    const model = getOpenAIModel();

    const inputPayloadText = body.inputPayload
      ? Object.entries(body.inputPayload)
          .map(([key, value]) => `- ${key}: ${value}`)
          .join('\n')
      : '';

    const response = await openai.responses.create({
      model,
      input: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            body.prompt,
            inputPayloadText ? `\n\n[입력 폼 값]\n${inputPayloadText}` : '',
          ]
            .filter(Boolean)
            .join(''),
        },
      ],
    });

    const rawText = response.output_text || '결과를 생성하지 못했습니다.';
    const structured = buildStructuredPreview(rawText);

    return NextResponse.json({
      ok: true,
      provider: 'openai',
      model,
      rawText,
      structured,
    });
  } catch (error) {
    console.error('[POST /api/ai] error', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'INVALID_REQUEST',
          details: error.flatten(),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'AI_GENERATION_FAILED',
      },
      { status: 500 },
    );
  }
}
