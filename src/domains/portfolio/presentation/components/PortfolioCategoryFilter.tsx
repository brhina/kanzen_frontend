import { PortfolioCategory } from '../../domain/enums/portfolio-category.enum';

export interface CategoryFilterItem {
  id: string;
  label: string;
  count?: number;
}

const PORTFOLIO_CATEGORY_TABS: CategoryFilterItem[] = [
  { id: 'all', label: 'All Projects' },
  { id: PortfolioCategory.WEB, label: 'Web Applications' },
  { id: PortfolioCategory.MOBILE, label: 'Mobile Apps' },
  { id: PortfolioCategory.SAAS, label: 'SaaS Platforms' },
  { id: PortfolioCategory.AI, label: 'AI & Data Systems' },
  { id: PortfolioCategory.ENTERPRISE, label: 'Enterprise Core' },
];

export interface PortfolioCategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  counts?: Record<string, number>;
}

export function PortfolioCategoryFilter({
  selectedCategory,
  onSelectCategory,
  counts = {},
}: PortfolioCategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {PORTFOLIO_CATEGORY_TABS.map((tab) => {
        const isActive = selectedCategory === tab.id;
        const count = counts[tab.id];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectCategory(tab.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
              isActive
                ? 'bg-primary-600 text-white shadow-sm ring-2 ring-primary-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            {count !== undefined && count > 0 && (
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
                  isActive
                    ? 'bg-primary-700 text-primary-100'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
