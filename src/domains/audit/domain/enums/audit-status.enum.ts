export const AuditStatus = {
  SUCCESS: 'success',
  FAILURE: 'failure',
} as const;

export type AuditStatus = (typeof AuditStatus)[keyof typeof AuditStatus];
export type AuditStatusValue = AuditStatus;
