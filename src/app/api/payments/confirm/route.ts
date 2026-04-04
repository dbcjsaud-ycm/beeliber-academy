import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import { paymentConfirmSchema } from '@/lib/validators/payments';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = paymentConfirmSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '유효하지 않은 결제 승인 요청입니다.', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const payload = parsed.data;

    const { data: reservation, error: reservationError } = await supabase
      .from('reservations')
      .select('id, status, approval_mode')
      .eq('id', payload.reservationId)
      .single();

    if (reservationError || !reservation) {
      return NextResponse.json({ error: '예약을 찾을 수 없습니다.' }, { status: 404 });
    }

    await supabase.from('payments').insert({
      reservation_id: payload.reservationId,
      provider: payload.provider,
      payment_key: payload.paymentKey,
      status: 'paid',
      amount: payload.amount,
      paid_at: new Date().toISOString(),
    });

    const nextStatus = reservation.approval_mode === 'manual' ? 'manual_review_required' : 'reservation_confirmed';

    await supabase
      .from('reservations')
      .update({
        status: nextStatus,
      })
      .eq('id', payload.reservationId);

    await supabase.from('operation_status_logs').insert({
      reservation_id: payload.reservationId,
      from_status: reservation.status,
      to_status: nextStatus,
      changed_by: 'system',
      reason: 'payment_confirmed',
    });

    return NextResponse.json(
      {
        reservationId: payload.reservationId,
        paymentStatus: 'paid',
        reservationStatus: nextStatus,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[POST /api/payments/confirm]', error);
    return NextResponse.json({ error: '결제 승인 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
