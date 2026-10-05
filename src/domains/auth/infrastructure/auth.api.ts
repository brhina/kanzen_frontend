import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '@/core/api/types';
import type { UserEntity } from '@/domains/users/domain/entities/user.entity';
import type {
  AuthActionResponseDto,
  AuthResponseDto,
  ChangePasswordDto,
  LoginCredentialsDto,
  RefreshTokenResponseDto,
} from './auth.dto';

function unwrapResponse<T>(res: ApiResponse<T> | T): T {
  if (res && typeof res === 'object' && 'data' in res && (res as ApiResponse<T>).data !== undefined) {
    return (res as ApiResponse<T>).data;
  }
  return res as T;
}

export const authApi = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentialsDto): Promise<AuthResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.auth.login, {
        json: credentials,
      })
      .json<ApiResponse<AuthResponseDto> | AuthResponseDto>();

    return unwrapResponse(res);
  },

  /**
   * Refresh JWT access token pair using refresh token
   */
  async refresh(refreshToken: string): Promise<RefreshTokenResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.auth.refresh, {
        json: { refreshToken },
      })
      .json<ApiResponse<RefreshTokenResponseDto> | RefreshTokenResponseDto>();

    return unwrapResponse(res);
  },

  /**
   * Revoke refresh token and terminate session
   */
  async logout(refreshToken: string): Promise<AuthActionResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.auth.logout, {
        json: { refreshToken },
      })
      .json<ApiResponse<AuthActionResponseDto> | AuthActionResponseDto>();

    return unwrapResponse(res);
  },

  /**
   * Dispatch password recovery link to specified email
   */
  async forgotPassword(email: string): Promise<AuthActionResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.auth.forgotPassword, {
        json: { email },
      })
      .json<ApiResponse<AuthActionResponseDto> | AuthActionResponseDto>();

    return unwrapResponse(res);
  },

  /**
   * Reset account password with one-time security token
   */
  async resetPassword(
    token: string,
    password: string,
  ): Promise<AuthActionResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.auth.resetPassword(token), {
        json: { password },
      })
      .json<ApiResponse<AuthActionResponseDto> | AuthActionResponseDto>();

    return unwrapResponse(res);
  },

  /**
   * Update password for current authenticated user
   */
  async changePassword(dto: ChangePasswordDto): Promise<AuthActionResponseDto> {
    const res = await apiClient
      .post(API_ENDPOINTS.auth.changePassword, {
        json: dto,
      })
      .json<ApiResponse<AuthActionResponseDto> | AuthActionResponseDto>();

    return unwrapResponse(res);
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(): Promise<UserEntity> {
    const res = await apiClient
      .get(API_ENDPOINTS.auth.me)
      .json<ApiResponse<UserEntity> | UserEntity>();

    return unwrapResponse(res);
  },
};
