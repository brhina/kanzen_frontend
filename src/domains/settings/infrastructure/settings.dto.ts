export interface FilterSettingsDto {
  group?: string;
  isPublic?: boolean;
  search?: string;
}

export interface CreateSettingDto {
  key: string;
  value: unknown;
  type: string;
  group: string;
  label: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateSettingDto {
  value?: unknown;
  type?: string;
  group?: string;
  label?: string;
  description?: string;
  isPublic?: boolean;
}

export interface SettingResponseDto {
  id: string;
  key: string;
  value: unknown;
  type: string;
  group: string;
  label: string;
  description?: string;
  isPublic: boolean;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}
