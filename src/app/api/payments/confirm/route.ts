import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, createServerSupabaseClient } from '@/lib/supabase/server';
import { paymentConfirmSchema } from '@/lib/validators/payments';

async function verifyWithTossPayments(
  paymentKey: string,
  orderId: string,
  amount: number,
): Promise<{ ok: true; confirmedAmount: number } | { ok: false; error: string }> {
  const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;
  if (!secretKey) {
    // No secret key configured — skip provider verification (development mode)
    return { ok: true, confirmedAmount: amount };
  }

  const credentials = Buffer.from(`${secretKey}:`).toString('base64');
  const res = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: err.message ?? '결제 승인 실패' };
  }

  const data = await res.json();
  return { ok: true, confirmedAmount: data.totalAmount ?? amount };
}

export async function POST(request: NextRequest) {
  // ── Auth check ─────────────────────────────────────────────────────────
  const authClient = await createServerSupabaseClient();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  try {
    const json = await request.json();
    const parsed = paymentConfirmSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: '유효하지 않은 결제 승인 요청입니다.', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const payload = parsed.data;

    // ── Verify with payment provider ──────────────────────────────────────
    const verification = await verifyWithTossPayments(
      payload.paymentKey,
      payload.reservationId,
      payload.amount,
    );

    if (!verification.ok) {
      return NextResponse.json({ error: verification.error }, { status: 402 });
    }

    // Use the confirmed amount from the provider, not the caller-supplied value
    const confirmedAmount = verification.confirmedAmount;

    const supabase = getSupabaseServerClient();

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
      amount: confirmedAmount,
      paid_at: new Date().toISOString(),
    });

    const nextStatus =
      reservation.approval_mode === 'manual' ? 'manual_review_required' : 'reservation_confirmed';

    await supabase.from('reservations').update({ status: nextStatus }).eq('id', payload.reservationId);

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
        confirmedAmount,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[POST /api/payments/confirm]', error);
    return NextResponse.json({ error: '결제 승인 처리 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
