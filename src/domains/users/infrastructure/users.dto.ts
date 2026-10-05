import type { PaginationMeta } from '@/core/api/types';

export interface FilterUsersDto {
  status?: string;
  isAdmin?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  avatar?: string;
  isAdmin?: boolean;
  permissions?: string[];
  status?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  avatar?: string;
  isAdmin?: boolean;
  permissions?: string[];
  status?: string;
}

export interface UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  isAdmin: boolean;
  permissions: string[];
  status: string;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedUsersResponseDto {
  data: UserResponseDto[];
  meta: {
    pagination: PaginationMeta;
  };
}
