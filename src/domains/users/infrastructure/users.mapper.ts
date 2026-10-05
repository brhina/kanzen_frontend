import type { UserEntity } from '../domain/entities/user.entity';
import type { PaginatedUsersResponseDto, UserResponseDto } from './users.dto';

export const usersMapper = {
  /**
   * Convert UserResponseDto to domain UserEntity
   */
  toEntity(dto: UserResponseDto | { data: UserResponseDto }): UserEntity {
    const raw = (dto && 'data' in dto && dto.data ? dto.data : dto) as UserResponseDto;
    if (!raw) {
      return {
        id: '',
        firstName: '',
        lastName: '',
        fullName: '',
        email: '',
        phone: undefined,
        avatar: undefined,
        isAdmin: false,
        permissions: [],
        status: 'active',
        emailVerifiedAt: undefined,
        lastLoginAt: undefined,
        createdAt: undefined,
        updatedAt: undefined,
      };
    }
    return {
      id: raw.id || '',
      firstName: raw.firstName || '',
      lastName: raw.lastName || '',
      fullName: raw.fullName || `${raw.firstName || ''} ${raw.lastName || ''}`.trim(),
      email: raw.email || '',
      phone: raw.phone,
      avatar: raw.avatar,
      isAdmin: Boolean(raw.isAdmin),
      permissions: Array.isArray(raw.permissions) ? raw.permissions : [],
      status: raw.status || 'active',
      emailVerifiedAt: raw.emailVerifiedAt,
      lastLoginAt: raw.lastLoginAt,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  },

  /**
   * Transform paginated backend response into entity collection with pagination metadata
   */
  toPaginated(dto: PaginatedUsersResponseDto): {
    users: UserEntity[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    return {
      users: (dto.data || []).map((u) => this.toEntity(u)),
      total: dto.meta?.pagination?.total ?? dto.data?.length ?? 0,
      page: dto.meta?.pagination?.page ?? 1,
      limit: dto.meta?.pagination?.limit ?? 20,
      totalPages: dto.meta?.pagination?.totalPages ?? 1,
    };
  },
};
