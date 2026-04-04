import { evaluateReservationRules } from '@/lib/services/rules-engine';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function validateReservation(payload: {
  branchId: string;
  serviceCode: 'STANDARD' | 'EXPRESS';
  items: Array<{ itemTypeCode: 'SMALL' | 'MEDIUM' | 'LARGE' | 'SPECIAL'; quantity: number }>;
}) {
  const supabase = getSupabaseServerClient();

  const { data: branch, error: branchError } = await supabase
    .from('branches')
    .select('id, code, name, branch_types(code)')
    .eq('id', payload.branchId)
    .single();

  if (branchError || !branch) {
    return {
      ok: false,
      status: 404,
      error: '지점을 찾을 수 없습니다.',
    };
  }

  const branchTypes = branch.branch_types as Array<{ code: 'MAIN' | 'PARTNER' }> | { code: 'MAIN' | 'PARTNER' } | null;
  const branchTypeCode = Array.isArray(branchTypes)
    ? (branchTypes[0]?.code ?? 'PARTNER')
    : (branchTypes?.code ?? 'PARTNER');
  const itemTypeCodes = payload.items.map((item) => item.itemTypeCode);

  const result = evaluateReservationRules({
    branchTypeCode,
    serviceCode: payload.serviceCode,
    itemTypeCodes,
  });

  return {
    ok: true,
    status: 200,
    data: result,
  };
}

export async function createReservation(payload: {
  customerId: string;
  customerName: string;
  email?: string;
  phone?: string;
  branchId: string;
  serviceCode: 'STANDARD' | 'EXPRESS';
  scheduledAt: string;
  items: Array<{ itemTypeCode: 'SMALL' | 'MEDIUM' | 'LARGE' | 'SPECIAL'; quantity: number }>;
  notes?: string;
}) {
  const validation = await validateReservation({
    branchId: payload.branchId,
    serviceCode: payload.serviceCode,
    items: payload.items,
  });

  if (!validation.ok || !validation.data) {
    return validation;
  }

  const validationData = validation.data;

  const supabase = getSupabaseServerClient();
  const reservationNo = `RES-${Date.now()}`;
  const status = validationData.result === 'manual_review_required' ? 'manual_review_required' : 'payment_pending';
  const approvalMode = validationData.result === 'manual_review_required' ? 'manual' : 'auto';

  const { data: service } = await supabase
    .from('services')
    .select('id, code')
    .eq('code', payload.serviceCode)
    .single();

  if (!service) {
    return { ok: false, status: 400, error: '서비스 정보를 찾을 수 없습니다.' };
  }

  const { data: reservation, error } = await supabase
    .from('reservations')
    .insert({
      reservation_no: reservationNo,
      customer_id: payload.customerId,
      branch_id: payload.branchId,
      service_id: service.id,
      scheduled_at: payload.scheduledAt,
      status,
      risk_level: validationData.riskLevel,
      approval_mode: approvalMode,
      notes: payload.notes || null,
    })
    .select('*')
    .single();

  if (error || !reservation) {
    return { ok: false, status: 500, error: '예약 생성에 실패했습니다.' };
  }

  await supabase.from('operation_status_logs').insert({
    reservation_id: reservation.id,
    from_status: null,
    to_status: status,
    changed_by: 'system',
    reason: 'reservation_created',
  });

  return {
    ok: true,
    status: 201,
    data: {
      reservationId: reservation.id,
      reservationNo,
      status,
      approvalMode,
      validation: validationData,
    },
  };
}
