import type { ServiceEntity } from '../domain/entities/service.entity';
import { ServiceCategory } from '../domain/enums/service-category.enum';
import { ServiceItemStatus } from '../domain/enums/service-status.enum';
import type {
  ServiceItemResponseDto,
  PaginatedServicesResponseDto,
} from './services.dto';

export const servicesMapper = {
  toEntity(dto: ServiceItemResponseDto | { data: ServiceItemResponseDto }): ServiceEntity {
    const raw = (dto && 'data' in dto && dto.data ? dto.data : dto) as ServiceItemResponseDto;
    if (!raw) {
      return {
        id: '',
        name: '',
        slug: '',
        tagline: '',
        description: '',
        shortDescription: '',
        icon: undefined,
        coverImage: undefined,
        category: ServiceCategory.CUSTOM_SOFTWARE,
        features: [],
        deliverables: [],
        technologies: [],
        startingPrice: undefined,
        pricingModel: undefined,
        estimatedTimeline: undefined,
        order: 0,
        isFeatured: false,
        status: ServiceItemStatus.DRAFT,
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
      shortDescription: raw.shortDescription || '',
      icon: raw.icon,
      coverImage: raw.coverImage,
      category: (raw.category as ServiceCategory) || ServiceCategory.CUSTOM_SOFTWARE,
      features: Array.isArray(raw.features) ? raw.features : [],
      deliverables: Array.isArray(raw.deliverables) ? raw.deliverables : [],
      technologies: Array.isArray(raw.technologies) ? raw.technologies : [],
      startingPrice: raw.startingPrice,
      pricingModel: raw.pricingModel,
      estimatedTimeline: raw.estimatedTimeline,
      order: raw.order ?? 0,
      isFeatured: Boolean(raw.isFeatured),
      status: (raw.status as ServiceItemStatus) || ServiceItemStatus.DRAFT,
      seo: raw.seo,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toEntityList(items: (ServiceItemResponseDto | ServiceEntity)[]): ServiceEntity[] {
    if (!Array.isArray(items)) return [];
    return items.map((i) => this.toEntity(i as ServiceItemResponseDto));
  },

  toPaginated(dto: PaginatedServicesResponseDto | ServiceItemResponseDto[]): {
    services: ServiceEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(dto)) {
      const services = this.toEntityList(dto);
      return {
        services,
        total: services.length,
        page: 1,
        limit: services.length || 20,
        totalPages: 1,
      };
    }

    const data = Array.isArray(dto?.data) ? dto.data : [];
    return {
      services: data.map((item) => this.toEntity(item)),
      total: dto?.meta?.pagination?.total ?? data.length,
      page: dto?.meta?.pagination?.page ?? 1,
      limit: dto?.meta?.pagination?.limit ?? 20,
      totalPages: dto?.meta?.pagination?.totalPages ?? 1,
    };
  },
};
