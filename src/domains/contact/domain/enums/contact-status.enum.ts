export const ContactStatus = {
  PENDING: 'pending',
  READ: 'read',
  REPLIED: 'replied',
  ARCHIVED: 'archived',
} as const;

export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus];
