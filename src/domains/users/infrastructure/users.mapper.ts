import type { UserEntity } from '../domain/entities/user.entity';
import type { PaginatedUsersResponseDto, UserResponseDto } from './users.dto';

export const usersMapper = {
  /**
   * Convert UserResponseDto to domain UserEntity
   */
  toEntity(dto: UserResponseDto): UserEntity {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      fullName: dto.fullName || `${dto.firstName} ${dto.lastName}`.trim(),
      email: dto.email,
      phone: dto.phone,
      avatar: dto.avatar,
      isAdmin: dto.isAdmin,
      permissions: Array.isArray(dto.permissions) ? dto.permissions : [],
      status: dto.status || 'active',
      emailVerifiedAt: dto.emailVerifiedAt,
      lastLoginAt: dto.lastLoginAt,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
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
