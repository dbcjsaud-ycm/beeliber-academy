export type ReservationValidationResult =
  | 'reservation_available'
  | 'manual_review_required'
  | 'reservation_rejected';

export type RiskLevel = 'low' | 'medium' | 'high';

export type ServiceCode = 'STANDARD' | 'EXPRESS';
export type BranchTypeCode = 'MAIN' | 'PARTNER';
export type ItemTypeCode = 'SMALL' | 'MEDIUM' | 'LARGE' | 'SPECIAL';

export type ReservationStatus =
  | 'lead_created'
  | 'validation_passed'
  | 'manual_review_required'
  | 'rejected'
  | 'payment_pending'
  | 'payment_completed'
  | 'reservation_confirmed'
  | 'cancelled';
