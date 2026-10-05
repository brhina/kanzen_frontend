export const PortfolioCategory = {
  WEB: 'web',
  MOBILE: 'mobile',
  SAAS: 'saas',
  AI: 'ai',
  ENTERPRISE: 'enterprise',
} as const;

export type PortfolioCategory =
  (typeof PortfolioCategory)[keyof typeof PortfolioCategory];

export const PORTFOLIO_CATEGORY_LABELS: Record<PortfolioCategory, string> = {
  [PortfolioCategory.WEB]: 'Web Engineering',
  [PortfolioCategory.MOBILE]: 'Mobile Solutions',
  [PortfolioCategory.SAAS]: 'SaaS Platform',
  [PortfolioCategory.AI]: 'AI & Data Systems',
  [PortfolioCategory.ENTERPRISE]: 'Enterprise Core',
};
