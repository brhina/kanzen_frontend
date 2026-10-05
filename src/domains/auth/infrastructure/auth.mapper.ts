import { useAuthStore } from '@/core/auth/auth.store';
import type { UserEntity } from '@/domains/users/domain/entities/user.entity';
import type { AuthTokensEntity } from '../domain/entities/auth-token.entity';
import type { AuthResponseDto, RefreshTokenResponseDto } from './auth.dto';

export const authMapper = {
  /**
   * Convert AuthResponseDto tokens to AuthTokensEntity
   */
  toTokens(
    dto:
      | AuthResponseDto
      | RefreshTokenResponseDto
      | { data: AuthResponseDto | RefreshTokenResponseDto },
  ): AuthTokensEntity {
    const payload = (dto && 'data' in dto && dto.data ? dto.data : dto) as
      | AuthResponseDto
      | RefreshTokenResponseDto;
    return {
      accessToken: payload?.accessToken || '',
      refreshToken: payload?.refreshToken || '',
      tokenType: payload?.tokenType || 'Bearer',
      expiresIn: payload?.expiresIn,
    };
  },

  /**
   * Normalize user data into UserEntity
   */
  toUserEntity(rawUser?: Partial<UserEntity> | null): UserEntity {
    if (!rawUser) {
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
  syncAuthStore(dto: AuthResponseDto | { data: AuthResponseDto }): void {
    const payload = (dto && 'data' in dto && dto.data ? dto.data : dto) as AuthResponseDto;
    const user = this.toUserEntity(payload?.user);
    useAuthStore.getState().setAuth(
      {
        accessToken: payload?.accessToken || '',
        refreshToken: payload?.refreshToken || '',
      },
      user,
    );
  },
};
