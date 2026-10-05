import { ContactEntity } from '../domain/entities/contact.entity';
import type { ContactResponseDto } from './contact.dto';

export interface PaginatedContactResponseDto {
  data: ContactResponseDto[];
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export class ContactMapper {
  static toEntity(dto: ContactResponseDto): ContactEntity {
    return new ContactEntity({
      id: dto.id || (dto as unknown as { _id?: string })._id,
      name: dto.name || '',
      email: dto.email || '',
      phone: dto.phone,
      subject: dto.subject || '',
      message: dto.message || '',
      type: dto.type,
      status: dto.status,
      readAt: dto.readAt ? new Date(dto.readAt) : undefined,
      repliedAt: dto.repliedAt ? new Date(dto.repliedAt) : undefined,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    });
  }

  static toEntityList(dtos: ContactResponseDto[]): ContactEntity[] {
    if (!Array.isArray(dtos)) return [];
    return dtos.map(ContactMapper.toEntity);
  }

  static toPaginated(
    response: PaginatedContactResponseDto | ContactResponseDto[],
  ): {
    items: ContactEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    if (Array.isArray(response)) {
      const items = response.map(ContactMapper.toEntity);
      return {
        items,
        total: items.length,
        page: 1,
        limit: items.length || 20,
        totalPages: 1,
      };
    }

    const rawList = Array.isArray(response?.data) ? response.data : [];
    const items = rawList.map(ContactMapper.toEntity);
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
