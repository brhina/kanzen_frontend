export const SettingType = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  JSON: 'json',
  SECRET: 'secret',
} as const;

export type SettingType = (typeof SettingType)[keyof typeof SettingType];
export type SettingTypeValue = SettingType;

export const SettingGroupEnum = {
  GENERAL: 'general',
  SEO: 'seo',
  SOCIAL: 'social',
  EMAIL: 'email',
  INTEGRATIONS: 'integrations',
} as const;

export type SettingGroupEnum = (typeof SettingGroupEnum)[keyof typeof SettingGroupEnum];
export type SettingGroupValue = SettingGroupEnum;
