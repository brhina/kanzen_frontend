import { ConsultationEntity } from '../domain/entities/consultation.entity';
import type { ConsultationResponseDto } from './consultations.dto';

export interface PaginatedConsultationResponseDto {
  data: ConsultationResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class ConsultationMapper {
  static toEntity(dto: ConsultationResponseDto): ConsultationEntity {
    return new ConsultationEntity({
      id: dto.id || (dto as unknown as { _id?: string })._id,
      name: dto.name || '',
      email: dto.email || '',
      phone: dto.phone,
      company: dto.company,
      projectDescription: dto.projectDescription || '',
      serviceInterest: Array.isArray(dto.serviceInterest) ? dto.serviceInterest : [],
      budget: typeof dto.budget === 'number' ? dto.budget : undefined,
      preferredDate: dto.preferredDate ? new Date(dto.preferredDate) : undefined,
      preferredTime: dto.preferredTime,
      timezone: dto.timezone || 'UTC',
      meetingType: dto.meetingType,
      meetingLink: dto.meetingLink,
      status: dto.status,
      confirmedAt: dto.confirmedAt ? new Date(dto.confirmedAt) : undefined,
      completedAt: dto.completedAt ? new Date(dto.completedAt) : undefined,
      notes: dto.notes,
      leadId: dto.leadId,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

  static toEntityList(dtos: ConsultationResponseDto[]): ConsultationEntity[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(ConsultationMapper.toEntity);
  }

  static toPaginated(
    response: PaginatedConsultationResponseDto | ConsultationResponseDto[],
  ): {
    items: ConsultationEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(response)) {
      const items = response.map(ConsultationMapper.toEntity);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length || 20,
        totalPages: 1,
      };
    }

    const rawList = Array.isArray(response?.data) ? response.data : [];
    const items = rawList.map(ConsultationMapper.toEntity);
    const pagination = response?.meta?.pagination || {
      total: items.length,
      page: 1,
      limit: items.length || 20,
      totalPages: 1,
    };

    return {
      items,
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: pagination.totalPages,
    };
  }
}
