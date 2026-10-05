import { describe, it, expect } from 'vitest';
import { LeadMapper } from '../leads.mapper';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import type { LeadResponseDto } from '../leads.dto';

describe('LeadMapper', () => {
  const mockDto: LeadResponseDto = {
    id: 'lead-123',
    name: 'Jonathan Sterling',
    email: 'jsterling@aurora-logistics.io',
    phone: '+1 415 555 8920',
    company: 'Aurora Logistics Inc.',
    website: 'https://aurora-logistics.io',
    message: 'Seeking engineering partner.',
    serviceInterest: ['cloud-architecture-devops'],
    budget: 65000,
    budgetCurrency: 'USD',
    timeline: '3 - 6 months',
    source: 'google_search',
    qualificationScore: 85,
    status: LeadStatus.QUALIFIED,
    createdAt: '2026-10-01T12:00:00Z',
    updatedAt: '2026-10-02T12:00:00Z',
  };

  it('maps DTO to LeadEntity correctly', () => {
    const entity = LeadMapper.toEntity(mockDto);

    expect(entity.id).toBe('lead-123');
    expect(entity.name).toBe('Jonathan Sterling');
    expect(entity.email).toBe('jsterling@aurora-logistics.io');
    expect(entity.company).toBe('Aurora Logistics Inc.');
    expect(entity.serviceInterest).toEqual(['cloud-architecture-devops']);
    expect(entity.budget).toBe(65000);
    expect(entity.qualificationScore).toBe(85);
    expect(entity.status).toBe(LeadStatus.QUALIFIED);
  });

  it('handles default values when fields are missing', () => {
    const sparseDto: LeadResponseDto = {
      name: 'Sparse Lead',
      email: 'sparse@example.com',
      serviceInterest: [],
      source: 'website',
      qualificationScore: 0,
      status: LeadStatus.NEW,
    };

    const entity = LeadMapper.toEntity(sparseDto);
    expect(entity.name).toBe('Sparse Lead');
    expect(entity.budget).toBeUndefined();
    expect(entity.budgetCurrency).toBe('USD');
    expect(entity.serviceInterest).toEqual([]);
    expect(entity.status).toBe(LeadStatus.NEW);
  });

  it('maps paginated list response correctly', () => {
    const paginated = LeadMapper.toPaginated({
      data: [mockDto],
      meta: {
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    });

    expect(paginated.items.length).toBe(1);
    expect(paginated.total).toBe(1);
    expect(paginated.items[0].id).toBe('lead-123');
  });
});
