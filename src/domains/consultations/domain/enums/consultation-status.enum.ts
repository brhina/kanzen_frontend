export const ConsultationStatus = {
  PENDING: 'pending',
  SCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
} as const;

export type ConsultationStatus =
  (typeof ConsultationStatus)[keyof typeof ConsultationStatus];
