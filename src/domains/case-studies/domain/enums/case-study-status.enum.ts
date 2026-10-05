export const CaseStudyStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type CaseStudyStatus =
  (typeof CaseStudyStatus)[keyof typeof CaseStudyStatus];

export const CASE_STUDY_STATUS_LABELS: Record<CaseStudyStatus, string> = {
  [CaseStudyStatus.DRAFT]: 'Draft',
  [CaseStudyStatus.PUBLISHED]: 'Published',
  [CaseStudyStatus.ARCHIVED]: 'Archived',
};
