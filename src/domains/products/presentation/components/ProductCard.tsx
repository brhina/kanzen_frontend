import { Link } from 'react-router';
import { ExternalLink, Edit3 } from 'lucide-react';
import type { ProductEntity } from '../../domain/entities/product.entity';
import { ProductStatusBadge } from './ProductStatusBadge';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';

export interface ProductCardProps {
  product: ProductEntity;
  onEdit?: (product: ProductEntity) => void;
  showAdminActions?: boolean;
}

export function ProductCard({
  product,
  onEdit,
  showAdminActions = true,
}: ProductCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      {/* Top Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="neutral" size="sm" className="uppercase font-mono text-[10px]">
              {product.category}
            </Badge>
            <ProductStatusBadge status={product.status} />
          </div>

          {/* Inline Edit Action */}
          {showAdminActions && onEdit && (
            <PermissionGate permission="products:write">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onEdit(product)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                title="Edit Product"
              >
                <Edit3 className="h-3 w-3" />
                <span className="text-xs">Edit</span>
              </Button>
            </PermissionGate>
          )}
        </div>

        {/* Name & Tagline */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <Link to={`/products/${product.slug}`}>
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">
            {product.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {product.description}
        </p>

        {/* Tech Stack Chips */}
        {product.techStack && product.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            {product.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer / Links */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 inline-flex items-center gap-1"
            >
              <span>Demo</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        <Link to={`/products/${product.slug}`}>
          <Button variant="outline" size="xs" className="group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            <span>Learn More</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
