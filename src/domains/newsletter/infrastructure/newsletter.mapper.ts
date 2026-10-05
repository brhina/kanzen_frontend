import { NewsletterSubscriberEntity } from '../domain/entities/newsletter-subscriber.entity';
import type { NewsletterSubscriberResponseDto } from './newsletter.dto';

export interface PaginatedNewsletterResponseDto {
  data: NewsletterSubscriberResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class NewsletterMapper {
  static toEntity(dto: NewsletterSubscriberResponseDto): NewsletterSubscriberEntity {
    return new NewsletterSubscriberEntity({
      id: dto.id || (dto as unknown as { _id?: string })._id,
      email: dto.email || '',
      firstName: dto.firstName,
      source: dto.source || 'homepage',
      tags: Array.isArray(dto.tags) ? dto.tags : [],
      isConfirmed: Boolean(dto.isConfirmed),
      status: dto.status,
      confirmedAt: dto.confirmedAt ? new Date(dto.confirmedAt) : undefined,
      unsubscribedAt: dto.unsubscribedAt ? new Date(dto.unsubscribedAt) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

  static toEntityList(dtos: NewsletterSubscriberResponseDto[]): NewsletterSubscriberEntity[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(NewsletterMapper.toEntity);
  }

  static toPaginated(
    response: PaginatedNewsletterResponseDto | NewsletterSubscriberResponseDto[],
  ): {
    items: NewsletterSubscriberEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(response)) {
      const items = response.map(NewsletterMapper.toEntity);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length || 20,
        totalPages: 1,
      };
    }

    const rawList = Array.isArray(response?.data) ? response.data : [];
    const items = rawList.map(NewsletterMapper.toEntity);
    const pagination = response?.meta?.pagination || {
      total: items.length,
      page: 1,
      limit: items.length || 20,
      totalPages: 1,
    };

    return {
      items,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
    };
  }
}
