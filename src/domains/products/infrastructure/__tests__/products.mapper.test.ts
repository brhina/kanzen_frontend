import { describe, it, expect } from 'vitest';
import { productsMapper } from '../products.mapper';
import { ProductCategory } from '../../domain/enums/product-category.enum';
import { ProductStatus } from '../../domain/enums/product-status.enum';
import type { ProductResponseDto } from '../products.dto';

describe('productsMapper', () => {
  it('maps ProductResponseDto to ProductEntity', () => {
    const dto: ProductResponseDto = {
      id: 'prod-1',
      name: 'Kanzen Sentinel Daemon',
      slug: 'kanzen-sentinel-daemon',
      tagline: 'Autonomous distributed tracing and failure injection agent',
      description: 'Ultra-low overhead eBPF monitoring agent',
      screenshots: ['https://cdn.kanzen.tech/img1.png'],
      category: ProductCategory.TOOL,
      techStack: ['Rust', 'eBPF', 'Tokio'],
      status: ProductStatus.LIVE,
      isFeatured: true,
      demoUrl: 'https://sentinel.kanzen.tech/demo',
    };

    const entity = productsMapper.toEntity(dto);
    expect(entity.id).toBe('prod-1');
    expect(entity.name).toBe('Kanzen Sentinel Daemon');
    expect(entity.category).toBe(ProductCategory.TOOL);
    expect(entity.status).toBe(ProductStatus.LIVE);
    expect(entity.techStack).toEqual(['Rust', 'eBPF', 'Tokio']);
    expect(entity.screenshots).toHaveLength(1);
  });

  it('handles null dto gracefully', () => {
    const entity = productsMapper.toEntity(null as any);
    expect(entity.id).toBe('');
    expect(entity.category).toBe(ProductCategory.SAAS);
    expect(entity.status).toBe(ProductStatus.COMING_SOON);
  });
});
