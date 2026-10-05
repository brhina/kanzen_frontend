export const ContactType = {
  GENERAL: 'general',
  SUPPORT: 'support',
  PARTNERSHIP: 'partnership',
  MEDIA: 'media',
  CAREERS: 'careers',
} as const;

export type ContactType = (typeof ContactType)[keyof typeof ContactType];
