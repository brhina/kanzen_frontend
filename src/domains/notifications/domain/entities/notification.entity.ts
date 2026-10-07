import type { NotificationTypeValue, NotificationChannelValue } from '../enums/notification-type.enum';
import type { NotificationStatusValue } from '../enums/notification-status.enum';

export interface NotificationEntity {
  id: string;
  userId?: string;
  type: NotificationTypeValue | string;
  channel: NotificationChannelValue | string;
  subject?: string;
  body: string;
  status: NotificationStatusValue | string;
  templateId?: string;
  data?: Record<string, unknown>;
  sentAt?: string | Date;
  readAt?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
