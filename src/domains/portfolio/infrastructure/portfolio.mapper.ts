import type { PortfolioItemEntity } from '../domain/entities/portfolio-item.entity';
import { PortfolioCategory } from '../domain/enums/portfolio-category.enum';
import { PortfolioItemStatus } from '../domain/enums/portfolio-status.enum';
import type { PortfolioItemResponseDto } from './portfolio.dto';
import type { PaginatedPortfolioResponseDto } from './portfolio.api';

export class PortfolioMapper {
  static toEntity(dto: PortfolioItemResponseDto): PortfolioItemEntity {
    return {
      id: dto.id || dto._id || '',
      title: dto.title || '',
      slug: dto.slug || '',
      subtitle: dto.subtitle,
      client: dto.client,
      clientLogo: dto.clientLogo,
      description: dto.description || '',
      challenge: dto.challenge,
      solution: dto.solution,
      results: dto.results,
      coverImage: dto.coverImage || '',
      images: Array.isArray(dto.images) ? dto.images : [],
      videoUrl: dto.videoUrl,
      liveUrl: dto.liveUrl,
      githubUrl: dto.githubUrl,
      category: (dto.category as PortfolioCategory) || PortfolioCategory.WEB,
      services: Array.isArray(dto.services) ? dto.services : [],
      technologies: Array.isArray(dto.technologies) ? dto.technologies : [],
      teamSize: dto.teamSize,
      duration: dto.duration,
      completedAt: dto.completedAt ? new Date(dto.completedAt).toISOString() : undefined,
      isFeatured: Boolean(dto.isFeatured),
      isConfidential: Boolean(dto.isConfidential),
      order: typeof dto.order === 'number' ? dto.order : 0,
      status: (dto.status as PortfolioItemStatus) || PortfolioItemStatus.DRAFT,
      seo: dto.seo
        ? {
            metaTitle: dto.seo.metaTitle,
            metaDescription: dto.seo.metaDescription,
            keywords: Array.isArray(dto.seo.keywords) ? dto.seo.keywords : [],
          }
        : undefined,
      metrics: Array.isArray(dto.metrics)
        ? dto.metrics.map((m) => ({
            label: m.label,
            value: m.value,
            icon: m.icon,
          }))
        : [],
      testimonialId: dto.testimonialId,
      caseStudyId: dto.caseStudyId,
      createdAt: dto.createdAt ? new Date(dto.createdAt).toISOString() : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt).toISOString() : undefined,
    };
  }

  static toEntityList(dtos: PortfolioItemResponseDto[]): PortfolioItemEntity[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(PortfolioMapper.toEntity);
  }

  static toPaginated(
    response: PaginatedPortfolioResponseDto | PortfolioItemResponseDto[],
  ): {
    items: PortfolioItemEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(response)) {
      const items = response.map(PortfolioMapper.toEntity);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length || 20,
        totalPages: 1,
      };
    }

    const rawList = Array.isArray(response.data) ? response.data : [];
    const items = rawList.map(PortfolioMapper.toEntity);
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
