import { ProductStatus } from '../../domain/enums/product-status.enum';
import { Badge } from '@/shared/ui/badge';

export interface ProductStatusBadgeProps {
  status: ProductStatus | string;
  className?: string;
}

const statusConfig: Record<
  string,
  { label: string; variant: 'success' | 'warning' | 'info' | 'neutral' }
> = {
  [ProductStatus.LIVE]: { label: 'Live in Production', variant: 'success' },
  [ProductStatus.BETA]: { label: 'Public Beta', variant: 'warning' },
  [ProductStatus.COMING_SOON]: { label: 'Coming Soon', variant: 'info' },
  [ProductStatus.RETIRED]: { label: 'Archived', variant: 'neutral' },
};

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status.replace('-', ' '),
    variant: 'neutral',
  };

  return (
    <Badge variant={config.variant} size="sm" className={className}>
      {config.label}
    </Badge>
  );
}

export default ProductStatusBadge;
