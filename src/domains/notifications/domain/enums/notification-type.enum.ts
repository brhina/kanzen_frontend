export const NotificationType = {
  EMAIL: 'email',
  IN_APP: 'in_app',
  SMS: 'sms',
  PUSH: 'push',
  SYSTEM: 'system',
} as const;

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];
export type NotificationTypeValue = NotificationType;

export const NotificationChannel = {
  EMAIL: 'email',
  IN_APP: 'in_app',
  SMS: 'sms',
  PUSH: 'push',
} as const;

export type NotificationChannel = (typeof NotificationChannel)[keyof typeof NotificationChannel];
export type NotificationChannelValue = NotificationChannel;
