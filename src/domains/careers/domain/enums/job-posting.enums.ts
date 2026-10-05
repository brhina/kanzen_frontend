export const JobPostingStatus = {
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
  PAUSED: 'paused',
} as const;

export type JobPostingStatus =
  (typeof JobPostingStatus)[keyof typeof JobPostingStatus];

export const JobType = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
} as const;

export type JobType = (typeof JobType)[keyof typeof JobType];

export const WorkMode = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ON_SITE: 'on-site',
} as const;

export type WorkMode = (typeof WorkMode)[keyof typeof WorkMode];

export const ExperienceLevel = {
  JUNIOR: 'junior',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
} as const;

export type ExperienceLevel =
  (typeof ExperienceLevel)[keyof typeof ExperienceLevel];
