import type { SettingTypeValue } from '../enums/setting.enums';

export interface SettingEntity {
  id: string;
  key: string;
  value: unknown;
  type: SettingTypeValue | string;
  group: string;
  label: string;
  description?: string;
  isPublic: boolean;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
