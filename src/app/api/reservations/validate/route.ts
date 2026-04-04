import { NextRequest, NextResponse } from 'next/server';
import { validateReservation } from '@/lib/services/reservation-service';
import { reservationValidateSchema } from '@/lib/validators/reservations';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = reservationValidateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: '유효하지 않은 요청입니다.',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await validateReservation(parsed.data);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('[POST /api/reservations/validate]', error);
    return NextResponse.json({ error: '예약 검증 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
