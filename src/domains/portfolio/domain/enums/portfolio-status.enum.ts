export const PortfolioItemStatus = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
} as const;

export type PortfolioItemStatus =
  (typeof PortfolioItemStatus)[keyof typeof PortfolioItemStatus];

export const PORTFOLIO_STATUS_LABELS: Record<PortfolioItemStatus, string> = {
  [PortfolioItemStatus.DRAFT]: 'Draft',
  [PortfolioItemStatus.PUBLISHED]: 'Published',
  [PortfolioItemStatus.ARCHIVED]: 'Archived',
};
