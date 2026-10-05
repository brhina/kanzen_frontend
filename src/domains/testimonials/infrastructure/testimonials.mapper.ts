import type { TestimonialEntity } from '../domain/entities/testimonial.entity';
import { TestimonialStatus } from '../domain/enums/testimonial-status.enum';
import type { TestimonialResponseDto } from './testimonials.dto';

export interface PaginatedTestimonialsResponseDto {
  data: TestimonialResponseDto[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class TestimonialMapper {
  static toEntity(dto: TestimonialResponseDto): TestimonialEntity {
    return {
      id: dto.id || dto._id || '',
      author: dto.author || '',
      role: dto.role,
      company: dto.company,
      companyLogo: dto.companyLogo,
      avatar: dto.avatar,
      content: dto.content || '',
      rating: typeof dto.rating === 'number' ? dto.rating : 5,
      videoUrl: dto.videoUrl,
      serviceId: dto.serviceId,
      portfolioItemId: dto.portfolioItemId,
      caseStudyId: dto.caseStudyId,
      isFeatured: Boolean(dto.isFeatured),
      isVerified: Boolean(dto.isVerified),
      status: (dto.status as TestimonialStatus) || TestimonialStatus.PENDING,
      order: typeof dto.order === 'number' ? dto.order : 0,
      source: dto.source || 'direct',
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt).toISOString() : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt).toISOString() : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt).toISOString() : undefined,
    };
  }

  static toEntityList(dtos: TestimonialResponseDto[]): TestimonialEntity[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(TestimonialMapper.toEntity);
  }

  static toPaginated(
    response: PaginatedTestimonialsResponseDto | TestimonialResponseDto[],
  ): {
    items: TestimonialEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(response)) {
      const items = response.map(TestimonialMapper.toEntity);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length || 20,
        totalPages: 1,
      };
    }

    const rawList = Array.isArray(response.data) ? response.data : [];
    const items = rawList.map(TestimonialMapper.toEntity);
    const pagination = response.meta?.pagination || {
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
