import { describe, it, expect } from 'vitest';
import { servicesMapper } from '../services.mapper';
import { ServiceCategory } from '../../domain/enums/service-category.enum';
import { PricingModel } from '../../domain/enums/pricing-model.enum';
import { ServiceItemStatus } from '../../domain/enums/service-status.enum';
import type { ServiceItemResponseDto } from '../services.dto';

describe('servicesMapper', () => {
  it('maps ServiceItemResponseDto to ServiceEntity', () => {
    const dto: ServiceItemResponseDto = {
      id: 'srv-1',
      name: 'Cloud Infrastructure & DevOps',
      slug: 'cloud-infrastructure-devops',
      tagline: 'Automated CI/CD pipelines and multi-cloud resilience',
      description: 'Full architectural deployment on AWS and GCP',
      shortDescription: 'Enterprise cloud DevOps engineering',
      category: ServiceCategory.CLOUD,
      features: ['Terraform IaC', 'Kubernetes Helm Deployments'],
      deliverables: ['Production Cluster', 'Monitoring Grafana Suite'],
      technologies: ['Kubernetes', 'AWS', 'Terraform'],
      startingPrice: 7500,
      pricingModel: PricingModel.FIXED,
      estimatedTimeline: '4-6 weeks',
      order: 1,
      isFeatured: true,
      status: ServiceItemStatus.ACTIVE,
    };

    const entity = servicesMapper.toEntity(dto);
    expect(entity.id).toBe('srv-1');
    expect(entity.name).toBe('Cloud Infrastructure & DevOps');
    expect(entity.category).toBe(ServiceCategory.CLOUD);
    expect(entity.features).toHaveLength(2);
    expect(entity.startingPrice).toBe(7500);
    expect(entity.pricingModel).toBe(PricingModel.FIXED);
    expect(entity.status).toBe(ServiceItemStatus.ACTIVE);
  });

  it('handles null dto gracefully', () => {
    const fallback = servicesMapper.toEntity(null as any);
    expect(fallback.id).toBe('');
    expect(fallback.name).toBe('');
    expect(fallback.category).toBe(ServiceCategory.CUSTOM_SOFTWARE);
    expect(fallback.status).toBe(ServiceItemStatus.DRAFT);
  });
});
