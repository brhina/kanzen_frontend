export const MediaStatus = {
  ACTIVE: 'active',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

export type MediaStatus = (typeof MediaStatus)[keyof typeof MediaStatus];
export type MediaStatusType = MediaStatus;
