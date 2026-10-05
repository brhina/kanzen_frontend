import type { UserStatus } from '../enums/user-status.enum';

export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  isAdmin: boolean;
  permissions: string[];
  status: UserStatus | string;
  emailVerifiedAt?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
