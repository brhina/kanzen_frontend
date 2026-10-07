import type { NotificationEntity } from '../domain/entities/notification.entity';
import type { NotificationResponseDto } from './notifications.dto';

export class NotificationMapper {
  static toDomain(dto: NotificationResponseDto): NotificationEntity {
    return {
      id: dto.id,
      userId: dto.userId,
      type: dto.type as any,
      channel: dto.channel as any,
      subject: dto.subject,
      body: dto.body,
      status: dto.status as any,
      templateId: dto.templateId,
      data: dto.data,
      sentAt: dto.sentAt,
      readAt: dto.readAt,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static toDomainList(dtos: NotificationResponseDto[]): NotificationEntity[] {
    return (dtos || []).map((d) => NotificationMapper.toDomain(d));
  }
}
