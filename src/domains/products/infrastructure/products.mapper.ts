import type { ProductEntity } from '../domain/entities/product.entity';
import { ProductCategory } from '../domain/enums/product-category.enum';
import { ProductStatus } from '../domain/enums/product-status.enum';
import type {
  ProductResponseDto,
  PaginatedProductsResponseDto,
} from './products.dto';

export const productsMapper = {
  toEntity(dto: ProductResponseDto | { data: ProductResponseDto }): ProductEntity {
    const raw = (dto && 'data' in dto && dto.data ? dto.data : dto) as ProductResponseDto;
    if (!raw) {
      return {
        id: '',
        name: '',
        slug: '',
        tagline: '',
        description: '',
        logo: undefined,
        screenshots: [],
        productUrl: undefined,
        demoUrl: undefined,
        pricingUrl: undefined,
        category: ProductCategory.SAAS,
        techStack: [],
        status: ProductStatus.COMING_SOON,
        isFeatured: false,
        order: 0,
        launchedAt: undefined,
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
      logo: raw.logo,
      screenshots: Array.isArray(raw.screenshots) ? raw.screenshots : [],
      productUrl: raw.productUrl,
      demoUrl: raw.demoUrl,
      pricingUrl: raw.pricingUrl,
      category: (raw.category as ProductCategory) || ProductCategory.SAAS,
      techStack: Array.isArray(raw.techStack) ? raw.techStack : [],
      status: (raw.status as ProductStatus) || ProductStatus.COMING_SOON,
      isFeatured: Boolean(raw.isFeatured),
      order: raw.order ?? 0,
      launchedAt: raw.launchedAt,
      seo: raw.seo,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  toEntityList(items: (ProductResponseDto | ProductEntity)[]): ProductEntity[] {
    if (!Array.isArray(items)) return [];
    return items.map((i) => this.toEntity(i as ProductResponseDto));
  },

  toPaginated(dto: PaginatedProductsResponseDto | ProductResponseDto[]): {
    products: ProductEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(dto)) {
      const products = this.toEntityList(dto);
      return {
        products,
        total: products.length,
        page: 1,
        limit: products.length || 20,
        totalPages: 1,
      };
    }

    const data = Array.isArray(dto?.data) ? dto.data : [];
    return {
      products: data.map((item) => this.toEntity(item)),
      total: dto?.meta?.pagination?.total ?? data.length,
      page: dto?.meta?.pagination?.page ?? 1,
      limit: dto?.meta?.pagination?.limit ?? 20,
      totalPages: dto?.meta?.pagination?.totalPages ?? 1,
    };
  },
};
