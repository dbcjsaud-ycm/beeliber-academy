import { NextRequest, NextResponse } from 'next/server';
import { createReservation } from '@/lib/services/reservation-service';
import { reservationCreateSchema } from '@/lib/validators/reservations';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const parsed = reservationCreateSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: '유효하지 않은 예약 생성 요청입니다.',
          details: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const result = await createReservation(parsed.data);
    if (!result.ok) {
      return NextResponse.json(
        { error: 'error' in result ? result.error : '예약 생성에 실패했습니다.' },
        { status: result.status },
      );
    }

    return NextResponse.json(result.data, { status: result.status });
  } catch (error) {
    console.error('[POST /api/reservations]', error);
    return NextResponse.json({ error: '예약 생성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
