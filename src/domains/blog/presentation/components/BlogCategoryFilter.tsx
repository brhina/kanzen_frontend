import type { BlogCategoryEntity } from '../../domain/entities/blog-category.entity';
import { cn } from '@/shared/utils/cn';

export interface BlogCategoryFilterProps {
  categories: BlogCategoryEntity[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
  className?: string;
}

export function BlogCategoryFilter({
  categories,
  selectedCategoryId,
  onSelectCategory,
  className,
}: BlogCategoryFilterProps) {
  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none', className)}>
      <button
        type="button"
        onClick={() => onSelectCategory('all')}
        className={cn(
          'inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
          selectedCategoryId === 'all' || !selectedCategoryId
            ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
        )}
      >
        All Articles
      </button>

      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id || selectedCategoryId === cat.slug;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              'inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
              isSelected
                ? 'bg-slate-900 text-white shadow-xs dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700',
            )}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}

export default BlogCategoryFilter;
