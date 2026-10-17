import { describe, it, expect } from 'vitest';
import { ConsultationMapper } from '../consultations.mapper';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import { MeetingType } from '../../domain/enums/meeting-type.enum';
import { ConsultationType } from '../../domain/enums/consultation-type.enum';
import { DeliveryFormat } from '../../domain/enums/delivery-format.enum';
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
    type: ConsultationType.CONSULTATION,
    attendeesCount: 1,
    createdAt: '2026-10-01T10:00:00Z',
  };

  const mockTrainingDto: ConsultationResponseDto = {
    id: 'training-202',
    name: 'Marcus Vance',
    email: 'marcus@apex-fin.tech',
    company: 'Apex Financial',
    projectDescription: 'Kubernetes and ArgoCD GitOps corporate workshop.',
    serviceInterest: ['enterprise-cloud-kubernetes-training'],
    budget: 25000,
    preferredDate: '2026-11-01T14:00:00Z',
    preferredTime: '14:00',
    timezone: 'America/New_York',
    meetingType: MeetingType.VIDEO,
    meetingLink: 'https://meet.google.com/training-lab',
    status: ConsultationStatus.SCHEDULED,
    type: ConsultationType.TRAINING,
    attendeesCount: 20,
    trainingTopic: 'Enterprise Cloud & Kubernetes Engineering Masterclass',
    deliveryFormat: DeliveryFormat.VIRTUAL_INTERACTIVE,
    createdAt: '2026-10-02T10:00:00Z',
  };

  it('maps DTO to ConsultationEntity correctly', () => {
    const entity = ConsultationMapper.toEntity(mockDto);

    expect(entity.id).toBe('consult-101');
    expect(entity.name).toBe('Sarah Johnson');
    expect(entity.email).toBe('sarah@techcorp.com');
    expect(entity.company).toBe('TechCorp Inc.');
    expect(entity.meetingType).toBe(MeetingType.VIDEO);
    expect(entity.status).toBe(ConsultationStatus.SCHEDULED);
    expect(entity.type).toBe(ConsultationType.CONSULTATION);
    expect(entity.attendeesCount).toBe(1);
    expect(entity.meetingLink).toBe('https://meet.google.com/test-room');
  });

  it('maps corporate training DTO to ConsultationEntity correctly', () => {
    const entity = ConsultationMapper.toEntity(mockTrainingDto);

    expect(entity.id).toBe('training-202');
    expect(entity.name).toBe('Marcus Vance');
    expect(entity.company).toBe('Apex Financial');
    expect(entity.type).toBe(ConsultationType.TRAINING);
    expect(entity.attendeesCount).toBe(20);
    expect(entity.trainingTopic).toBe('Enterprise Cloud & Kubernetes Engineering Masterclass');
    expect(entity.deliveryFormat).toBe(DeliveryFormat.VIRTUAL_INTERACTIVE);
    expect(entity.meetingLink).toBe('https://meet.google.com/training-lab');
  });

  it('maps paginated consultations correctly', () => {
    const paginated = ConsultationMapper.toPaginated({
      data: [mockDto, mockTrainingDto],
      meta: {
        pagination: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    });

    expect(paginated.items.length).toBe(2);
    expect(paginated.total).toBe(2);
    expect(paginated.items[0].id).toBe('consult-101');
    expect(paginated.items[1].id).toBe('training-202');
    expect(paginated.items[1].type).toBe(ConsultationType.TRAINING);
  });
});
