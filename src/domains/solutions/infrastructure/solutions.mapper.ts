import type { SolutionEntity } from '../domain/entities/solution.entity';
import { SolutionStatus } from '../domain/enums/solution-status.enum';
import type {
  SolutionResponseDto,
  PaginatedSolutionsResponseDto,
} from './solutions.dto';

export const solutionsMapper = {
  toEntity(dto: SolutionResponseDto | { data: SolutionResponseDto }): SolutionEntity {
    const raw = (dto && 'data' in dto && dto.data ? dto.data : dto) as SolutionResponseDto;
    if (!raw) {
      return {
        id: '',
        name: '',
        slug: '',
        tagline: '',
        description: '',
        features: [],
        industries: [],
        icon: undefined,
        coverImage: undefined,
        status: SolutionStatus.DRAFT,
        isFeatured: false,
        order: 0,
        seo: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }

    return {
      id: raw.id || '',
      name: raw.name || '',
      slug: raw.slug || '',
      tagline: raw.tagline || '',
      description: raw.description || '',
      features: Array.isArray(raw.features) ? raw.features : [],
      industries: Array.isArray(raw.industries) ? raw.industries : [],
      icon: raw.icon,
      coverImage: raw.coverImage,
      status: (raw.status as SolutionStatus) || SolutionStatus.DRAFT,
      isFeatured: Boolean(raw.isFeatured),
      order: raw.order ?? 0,
      seo: raw.seo,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toEntityList(items: (SolutionResponseDto | SolutionEntity)[]): SolutionEntity[] {
    if (!Array.isArray(items)) return [];
    return items.map((i) => this.toEntity(i as SolutionResponseDto));
  },

  toPaginated(dto: PaginatedSolutionsResponseDto | SolutionResponseDto[]): {
    solutions: SolutionEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(dto)) {
      const solutions = this.toEntityList(dto);
      return {
        solutions,
        total: solutions.length,
        page: 1,
        limit: solutions.length || 20,
        totalPages: 1,
      };
    }

    const data = Array.isArray(dto?.data) ? dto.data : [];
    return {
      solutions: data.map((item) => this.toEntity(item)),
      total: dto?.meta?.pagination?.total ?? data.length,
      page: dto?.meta?.pagination?.page ?? 1,
      limit: dto?.meta?.pagination?.limit ?? 20,
      totalPages: dto?.meta?.pagination?.totalPages ?? 1,
    };
  },
};
