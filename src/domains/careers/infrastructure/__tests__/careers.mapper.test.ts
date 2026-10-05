import { describe, it, expect } from 'vitest';
import { CareersMapper } from '../careers.mapper';
import { JobPostingEntity } from '../../domain/entities/job-posting.entity';
import type { JobPostingDto } from '../careers.dto';

describe('CareersMapper', () => {
  const mockDto: JobPostingDto = {
    id: 'career-123',
    title: 'Staff Distributed Systems Engineer',
    slug: 'staff-distributed-systems-engineer',
    department: 'Engineering',
    type: 'full-time',
    mode: 'remote',
    location: 'Worldwide',
    description: 'Lead architecture for distributed data platform.',
    requirements: ['10+ years engineering', 'Deep Go & Rust knowledge'],
    niceToHave: ['Kubernetes operator authoring'],
    benefits: ['Health coverage', 'Remote stipend'],
    salaryMin: 9000,
    salaryMax: 14000,
    salaryCurrency: 'USD',
    experienceLevel: 'lead',
    technologies: ['Go', 'Rust', 'Kubernetes', 'Kafka'],
    isUrgent: true,
    closingDate: '2026-12-31T23:59:59.000Z',
    status: 'open',
    applicationCount: 15,
    createdAt: '2026-10-01T12:00:00.000Z',
    updatedAt: '2026-10-02T12:00:00.000Z',
  };

  it('maps JobPostingDto to JobPostingEntity correctly', () => {
    const entity = CareersMapper.toEntity(mockDto);

    expect(entity).toBeInstanceOf(JobPostingEntity);
    expect(entity.id).toBe('career-123');
    expect(entity.title).toBe('Staff Distributed Systems Engineer');
    expect(entity.slug).toBe('staff-distributed-systems-engineer');
    expect(entity.department).toBe('Engineering');
    expect(entity.type).toBe('full-time');
    expect(entity.mode).toBe('remote');
    expect(entity.salaryMin).toBe(9000);
    expect(entity.salaryMax).toBe(14000);
    expect(entity.isUrgent).toBe(true);
    expect(entity.closingDate).toEqual(new Date('2026-12-31T23:59:59.000Z'));
    expect(entity.requirements).toHaveLength(2);
    expect(entity.technologies).toContain('Rust');
  });

  it('computes entity helper getters accurately', () => {
    const entity = CareersMapper.toEntity(mockDto);

    expect(entity.salaryRangeFormatted).toBe('USD 9,000 - 14,000');
    expect(entity.isOpen).toBe(true);
    expect(entity.locationDisplay).toBe('Remote (Worldwide)');
  });

  it('maps JobPostingEntity to JobPostingDto correctly', () => {
    const entity = CareersMapper.toEntity(mockDto);
    const dto = CareersMapper.toDto(entity);

    expect(dto.id).toBe('career-123');
    expect(dto.title).toBe(mockDto.title);
    expect(dto.slug).toBe(mockDto.slug);
    expect(dto.department).toBe('Engineering');
    expect(dto.type).toBe('full-time');
    expect(dto.mode).toBe('remote');
    expect(dto.salaryMin).toBe(9000);
    expect(dto.salaryMax).toBe(14000);
    expect(dto.salaryCurrency).toBe('USD');
  });
});
