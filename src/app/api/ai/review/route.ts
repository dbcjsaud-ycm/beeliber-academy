import { NextRequest, NextResponse } from 'next/server';
import { reviewAiText } from '@/lib/services/ai-policy';
import { getSupabaseServerClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { aiReviewSchema } from '@/lib/validators/ai';

export async function POST(request: NextRequest) {
  const authClient = await createServerSupabaseClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = aiReviewSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '유효하지 않은 AI 검수 요청입니다.', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;
    const review = reviewAiText(payload.generatedText);
    const supabase = getSupabaseServerClient();

    const { data: output, error } = await supabase
      .from('ai_outputs')
      .insert({
        use_case: payload.useCase,
        source_ref: payload.sourceRef || null,
        input_context: payload.inputContext,
        generated_text: payload.generatedText,
        risk_score: review.riskScore,
        policy_passed: review.policyPassed,
        approval_status: review.policyPassed ? 'review_pending' : 'rejected',
      })
      .select('*')
      .single();

    if (error || !output) {
      return NextResponse.json({ error: 'AI 출력 저장에 실패했습니다.' }, { status: 500 });
    }

    await supabase.from('ai_review_logs').insert(
      review.checks.map((check) => ({
        ai_output_id: output.id,
        check_type: check.checkType,
        result: check.result,
        detail: check.detail,
      })),
    );

    return NextResponse.json(
      {
        aiOutputId: output.id,
        policyPassed: review.policyPassed,
        riskScore: review.riskScore,
        checks: review.checks,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/ai/review]', error);
    return NextResponse.json({ error: 'AI 검수 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
