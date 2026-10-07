export const NotificationStatus = {
  PENDING: 'pending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
} as const;

export type NotificationStatus = (typeof NotificationStatus)[keyof typeof NotificationStatus];
export type NotificationStatusValue = NotificationStatus;
