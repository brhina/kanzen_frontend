import { LeadEntity } from '../domain/entities/lead.entity';
import type { LeadResponseDto } from './leads.dto';

export interface PaginatedLeadResponseDto {
  data: LeadResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class LeadMapper {
  static toEntity(dto: LeadResponseDto): LeadEntity {
    return new LeadEntity({
      id: dto.id || (dto as unknown as { _id?: string })._id,
      name: dto.name || '',
      email: dto.email || '',
      phone: dto.phone,
      company: dto.company,
      website: dto.website,
      message: dto.message,
      serviceInterest: Array.isArray(dto.serviceInterest) ? dto.serviceInterest : [],
      budget: typeof dto.budget === 'number' ? dto.budget : undefined,
      budgetCurrency: dto.budgetCurrency || 'USD',
      timeline: dto.timeline,
      source: dto.source || 'website',
      utmSource: dto.utmSource,
      utmMedium: dto.utmMedium,
      utmCampaign: dto.utmCampaign,
      qualificationScore: typeof dto.qualificationScore === 'number' ? dto.qualificationScore : 0,
      assignedTo: dto.assignedTo,
      notes: dto.notes,
      status: dto.status,
      convertedAt: dto.convertedAt ? new Date(dto.convertedAt) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

  static toEntityList(dtos: LeadResponseDto[]): LeadEntity[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(LeadMapper.toEntity);
  }

  static toPaginated(
    response: PaginatedLeadResponseDto | LeadResponseDto[],
  ): {
    items: LeadEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(response)) {
      const items = response.map(LeadMapper.toEntity);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length || 20,
        totalPages: 1,
      };
    }

    const rawList = Array.isArray(response?.data) ? response.data : [];
    const items = rawList.map(LeadMapper.toEntity);
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
