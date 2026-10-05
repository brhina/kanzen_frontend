import { useAuthStore } from '@/core/auth/auth.store';
import type { UserEntity } from '@/domains/users/domain/entities/user.entity';
import type { AuthTokensEntity } from '../domain/entities/auth-token.entity';
import type { AuthResponseDto, RefreshTokenResponseDto } from './auth.dto';

export const authMapper = {
  /**
   * Convert AuthResponseDto tokens to AuthTokensEntity
   */
  toTokens(dto: AuthResponseDto | RefreshTokenResponseDto): AuthTokensEntity {
    return {
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken || '',
      tokenType: dto.tokenType || 'Bearer',
      expiresIn: dto.expiresIn,
    };
  },

  /**
   * Normalize user data into UserEntity
   */
  toUserEntity(rawUser: Partial<UserEntity>): UserEntity {
    return {
      id: rawUser.id || '',
      firstName: rawUser.firstName || '',
      lastName: rawUser.lastName || '',
      fullName:
        rawUser.fullName ||
        `${rawUser.firstName || ''} ${rawUser.lastName || ''}`.trim(),
      email: rawUser.email || '',
      phone: rawUser.phone,
      avatar: rawUser.avatar,
      isAdmin: Boolean(rawUser.isAdmin),
      permissions: Array.isArray(rawUser.permissions) ? rawUser.permissions : [],
      status: rawUser.status || 'active',
      emailVerifiedAt: rawUser.emailVerifiedAt,
      lastLoginAt: rawUser.lastLoginAt,
      createdAt: rawUser.createdAt,
      updatedAt: rawUser.updatedAt,
    };
  },

  /**
   * Hydrate authStore with full token and user payload
   */
  syncAuthStore(dto: AuthResponseDto): void {
    const user = this.toUserEntity(dto.user);
    useAuthStore.getState().setAuth(
      {
        accessToken: dto.accessToken,
        refreshToken: dto.refreshToken,
      },
      user,
    );
  },
};
