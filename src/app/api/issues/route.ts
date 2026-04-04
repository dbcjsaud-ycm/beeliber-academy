import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { issueCreateSchema } from '@/lib/validators/issues';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = issueCreateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '유효하지 않은 이슈 생성 요청입니다.', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const payload = parsed.data;

    const { data: issue, error } = await supabase
      .from('issue_tickets')
      .insert({
        reservation_id: payload.reservationId,
        issue_code: payload.issueCode,
        severity: payload.severity,
        status: 'open',
        title: payload.title,
        description: payload.description || null,
        assigned_to: payload.assignedTo || null,
      })
      .select('*')
      .single();

    if (error || !issue) {
      return NextResponse.json({ error: '이슈 생성에 실패했습니다.' }, { status: 500 });
    }

    await supabase.from('reservations').update({ issue_status: 'issue_open' }).eq('id', payload.reservationId);

    return NextResponse.json(
      {
        issueId: issue.id,
        issueCode: issue.issue_code,
        status: issue.status,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('[POST /api/issues]', error);
    return NextResponse.json({ error: '이슈 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
