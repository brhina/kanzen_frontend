export const SolutionStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type SolutionStatus = (typeof SolutionStatus)[keyof typeof SolutionStatus];
export type SolutionStatusType = SolutionStatus;
