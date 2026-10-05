import { describe, it, expect } from 'vitest';
import { solutionsMapper } from '../solutions.mapper';
import { SolutionStatus } from '../../domain/enums/solution-status.enum';
import type { SolutionResponseDto } from '../solutions.dto';

describe('solutionsMapper', () => {
  it('maps SolutionResponseDto to SolutionEntity', () => {
    const dto: SolutionResponseDto = {
      id: 'sol-1',
      name: 'High-Frequency Real-Time Payments Gateway',
      slug: 'real-time-payments-gateway',
      tagline: 'Sub-millisecond ledger consensus engine',
      description: 'Distributed ledger system built on Raft and PostgreSQL',
      features: ['Idempotent Processing', 'Fraud Anomaly Scoring'],
      industries: ['Fintech', 'Banking'],
      status: SolutionStatus.ACTIVE,
      isFeatured: true,
      order: 1,
    };

    const entity = solutionsMapper.toEntity(dto);
    expect(entity.id).toBe('sol-1');
    expect(entity.name).toBe('High-Frequency Real-Time Payments Gateway');
    expect(entity.industries).toEqual(['Fintech', 'Banking']);
    expect(entity.features).toHaveLength(2);
    expect(entity.status).toBe(SolutionStatus.ACTIVE);
  });

  it('handles null dto gracefully', () => {
    const entity = solutionsMapper.toEntity(null as any);
    expect(entity.id).toBe('');
    expect(entity.features).toEqual([]);
    expect(entity.industries).toEqual([]);
    expect(entity.status).toBe(SolutionStatus.DRAFT);
  });
});
