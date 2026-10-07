import type { AnalyticsEventEntity } from '../domain/entities/analytics-event.entity';
import type { AnalyticsEventResponseDto } from './analytics.dto';

export class AnalyticsMapper {
  static toDomain(dto: AnalyticsEventResponseDto): AnalyticsEventEntity {
    return {
      id: dto.id,
      type: dto.type,
      sessionId: dto.sessionId,
      userId: dto.userId,
      page: dto.page,
      referrer: dto.referrer,
      source: dto.source,
      medium: dto.medium,
      campaign: dto.campaign,
      device: dto.device,
      browser: dto.browser,
      country: dto.country,
      properties: dto.properties,
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      createdAt: dto.createdAt,
    };
  }

  static toDomainList(dtos: AnalyticsEventResponseDto[]): AnalyticsEventEntity[] {
    return (dtos || []).map((d) => AnalyticsMapper.toDomain(d));
  }
}
