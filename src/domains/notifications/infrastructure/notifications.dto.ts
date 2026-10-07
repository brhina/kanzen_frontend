export interface FilterNotificationsDto {
  type?: string;
  channel?: string;
  status?: string;
  isUnread?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateNotificationDto {
  userId?: string;
  type?: string;
  channel?: string;
  subject?: string;
  body: string;
  templateId?: string;
  data?: Record<string, unknown>;
}

export interface NotificationResponseDto {
  id: string;
  userId?: string;
  type: string;
  channel: string;
  subject?: string;
  body: string;
  status: string;
  templateId?: string;
  data?: Record<string, unknown>;
  sentAt?: string;
  readAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedNotificationsResponseDto {
  data: NotificationResponseDto[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
