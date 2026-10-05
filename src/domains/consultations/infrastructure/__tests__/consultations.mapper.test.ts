import { describe, it, expect } from 'vitest';
import { ConsultationMapper } from '../consultations.mapper';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import { MeetingType } from '../../domain/enums/meeting-type.enum';
import type { ConsultationResponseDto } from '../consultations.dto';

describe('ConsultationMapper', () => {
  const mockDto: ConsultationResponseDto = {
    id: 'consult-101',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    phone: '+1 415 555 2671',
    company: 'TechCorp Inc.',
    projectDescription: 'Enterprise high-scale platform design.',
    serviceInterest: ['cloud-architecture-devops'],
    budget: 50000,
    preferredDate: '2026-10-18T15:00:00Z',
    preferredTime: '15:00',
    timezone: 'America/New_York',
    meetingType: MeetingType.VIDEO,
    meetingLink: 'https://meet.google.com/test-room',
    status: ConsultationStatus.SCHEDULED,
    createdAt: '2026-10-01T10:00:00Z',
  };

  it('maps DTO to ConsultationEntity correctly', () => {
    const entity = ConsultationMapper.toEntity(mockDto);

    expect(entity.id).toBe('consult-101');
    expect(entity.name).toBe('Sarah Johnson');
    expect(entity.email).toBe('sarah@techcorp.com');
    expect(entity.company).toBe('TechCorp Inc.');
    expect(entity.meetingType).toBe(MeetingType.VIDEO);
    expect(entity.status).toBe(ConsultationStatus.SCHEDULED);
    expect(entity.meetingLink).toBe('https://meet.google.com/test-room');
  });

  it('maps paginated consultations correctly', () => {
    const paginated = ConsultationMapper.toPaginated({
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
    expect(paginated.items[0].id).toBe('consult-101');
  });
});
