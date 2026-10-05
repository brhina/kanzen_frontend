import type { CaseStudyEntity } from '../domain/entities/case-study.entity';
import { CaseStudyStatus } from '../domain/enums/case-study-status.enum';
import type { CaseStudyResponseDto } from './case-studies.dto';

export interface PaginatedCaseStudiesResponseDto {
  data: CaseStudyResponseDto[];
  meta: {
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class CaseStudyMapper {
  static toEntity(dto: CaseStudyResponseDto): CaseStudyEntity {
    return {
      id: dto.id || dto._id || '',
      title: dto.title || '',
      slug: dto.slug || '',
      client: dto.client || '',
      clientIndustry: dto.clientIndustry || '',
      clientSize: dto.clientSize,
      summary: dto.summary || '',
      challenge: dto.challenge || '',
      approach: dto.approach || '',
      solution: dto.solution || '',
      results: dto.results || '',
      metrics: Array.isArray(dto.metrics)
        ? dto.metrics.map((m) => ({
            label: m.label,
            value: m.value,
            description: m.description,
          }))
        : [],
      coverImage: dto.coverImage || '',
      images: Array.isArray(dto.images) ? dto.images : [],
      videoUrl: dto.videoUrl,
      technologies: Array.isArray(dto.technologies) ? dto.technologies : [],
      servicesUsed: Array.isArray(dto.servicesUsed) ? dto.servicesUsed : [],
      duration: dto.duration,
      teamSize: dto.teamSize,
      testimonialId: dto.testimonialId,
      portfolioItemId: dto.portfolioItemId,
      downloadable: Boolean(dto.downloadable),
      pdfUrl: dto.pdfUrl,
      isFeatured: Boolean(dto.isFeatured),
      status: (dto.status as CaseStudyStatus) || CaseStudyStatus.DRAFT,
      seo: dto.seo
        ? {
            metaTitle: dto.seo.metaTitle,
            metaDescription: dto.seo.metaDescription,
            keywords: Array.isArray(dto.seo.keywords) ? dto.seo.keywords : [],
          }
        : undefined,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt).toISOString() : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt).toISOString() : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt).toISOString() : undefined,
    };
  }

  static toEntityList(dtos: CaseStudyResponseDto[]): CaseStudyEntity[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(CaseStudyMapper.toEntity);
  }

  static toPaginated(
    response: PaginatedCaseStudiesResponseDto | CaseStudyResponseDto[],
  ): {
    items: CaseStudyEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(response)) {
      const items = response.map(CaseStudyMapper.toEntity);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length || 20,
        totalPages: 1,
      };
    }

    const rawList = Array.isArray(response.data) ? response.data : [];
    const items = rawList.map(CaseStudyMapper.toEntity);
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
