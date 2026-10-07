export const MediaFolder = {
  PORTFOLIO: 'portfolio',
  BLOG: 'blog',
  TEAM: 'team',
  CLIENTS: 'clients',
  RESUMES: 'resumes',
  GENERAL: 'general',
} as const;

export type MediaFolder = (typeof MediaFolder)[keyof typeof MediaFolder];
export type MediaFolderType = MediaFolder;
