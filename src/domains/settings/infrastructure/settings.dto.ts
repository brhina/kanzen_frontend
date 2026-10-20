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

export interface BulkUpdateItem {
  key: string;
  value: unknown;
}

export interface BulkUpdateSettingsDto {
  items: BulkUpdateItem[];
}

export interface DefaultSettingDto {
  key: string;
  value: unknown;
  type: string;
  group: string;
  label: string;
  description?: string;
  isPublic: boolean;
}
