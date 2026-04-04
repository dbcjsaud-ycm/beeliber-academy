import type {
  ItemTypeCode,
  BranchTypeCode,
  ReservationValidationResult,
  RiskLevel,
  ServiceCode,
} from '@/types/domain';

export interface ValidationInput {
  branchTypeCode: BranchTypeCode;
  serviceCode: ServiceCode;
  itemTypeCodes: ItemTypeCode[];
}

export interface ValidationOutput {
  result: ReservationValidationResult;
  riskLevel: RiskLevel;
  messages: string[];
}

export function evaluateReservationRules(input: ValidationInput): ValidationOutput {
  const messages: string[] = [];
  let riskLevel: RiskLevel = 'low';

  if (input.branchTypeCode === 'PARTNER' && input.serviceCode === 'EXPRESS') {
    return {
      result: 'reservation_rejected',
      riskLevel: 'high',
      messages: ['해당 지점은 이 서비스를 지원하지 않습니다.'],
    };
  }

  if (input.itemTypeCodes.includes('SPECIAL')) {
    riskLevel = 'medium';
    messages.push('특수 항목이 포함되어 수동 검토가 필요합니다.');
    return {
      result: 'manual_review_required',
      riskLevel,
      messages,
    };
  }

  return {
    result: 'reservation_available',
    riskLevel,
    messages: messages.length > 0 ? messages : ['예약 가능합니다.'],
  };
}
