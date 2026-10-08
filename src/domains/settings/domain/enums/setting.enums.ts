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
  COMPANY: 'company',
  SEO: 'seo',
  SOCIAL: 'social',
  CONTACT: 'contact',
  EMAIL: 'email',
  INTEGRATIONS: 'integrations',
  SYSTEM: 'system',
  // Backward compatibility alias:
  GENERAL: 'company',
} as const;

export type SettingGroupEnum = (typeof SettingGroupEnum)[keyof typeof SettingGroupEnum];
export type SettingGroupValue = SettingGroupEnum;
