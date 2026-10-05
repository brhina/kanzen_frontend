import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type { UserEntity } from '@/domains/users/domain/entities/user.entity';
import type {
  AuthActionResponseDto,
  AuthResponseDto,
  ChangePasswordDto,
  LoginCredentialsDto,
  RefreshTokenResponseDto,
} from './auth.dto';

export const authApi = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentialsDto): Promise<AuthResponseDto> {
    return apiClient
      .post(API_ENDPOINTS.auth.login, {
        json: credentials,
      })
      .json<AuthResponseDto>();
  },

  /**
   * Refresh JWT access token pair using refresh token
   */
  async refresh(refreshToken: string): Promise<RefreshTokenResponseDto> {
    return apiClient
      .post(API_ENDPOINTS.auth.refresh, {
        json: { refreshToken },
      })
      .json<RefreshTokenResponseDto>();
  },

  /**
   * Revoke refresh token and terminate session
   */
  async logout(refreshToken: string): Promise<AuthActionResponseDto> {
    return apiClient
      .post(API_ENDPOINTS.auth.logout, {
        json: { refreshToken },
      })
      .json<AuthActionResponseDto>();
  },

  /**
   * Dispatch password recovery link to specified email
   */
  async forgotPassword(email: string): Promise<AuthActionResponseDto> {
    return apiClient
      .post(API_ENDPOINTS.auth.forgotPassword, {
        json: { email },
      })
      .json<AuthActionResponseDto>();
  },

  /**
   * Reset account password with one-time security token
   */
  async resetPassword(
    token: string,
    password: string,
  ): Promise<AuthActionResponseDto> {
    return apiClient
      .post(API_ENDPOINTS.auth.resetPassword(token), {
        json: { password },
      })
      .json<AuthActionResponseDto>();
  },

  /**
   * Update password for current authenticated user
   */
  async changePassword(dto: ChangePasswordDto): Promise<AuthActionResponseDto> {
    return apiClient
      .post(API_ENDPOINTS.auth.changePassword, {
        json: dto,
      })
      .json<AuthActionResponseDto>();
  },

  /**
   * Fetch current authenticated user profile
   */
  async getMe(): Promise<UserEntity> {
    return apiClient.get(API_ENDPOINTS.auth.me).json<UserEntity>();
  },
};
