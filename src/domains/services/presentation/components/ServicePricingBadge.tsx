import type { PricingModel } from '../../domain/enums/pricing-model.enum';
import { Badge } from '@/shared/ui/badge';

export interface ServicePricingBadgeProps {
  startingPrice?: number;
  pricingModel?: PricingModel | string;
  className?: string;
}

export function ServicePricingBadge({
  startingPrice,
  pricingModel,
  className,
}: ServicePricingBadgeProps) {
  if (!startingPrice && !pricingModel) return null;

  let text = '';
  if (startingPrice) {
    text = `From $${startingPrice.toLocaleString()}`;
    if (pricingModel === 'hourly') text += ' / hr';
    else if (pricingModel === 'retainer') text += ' / mo';
  } else if (pricingModel) {
    text = pricingModel === 'custom' ? 'Custom Scope' : `${pricingModel} pricing`;
  }

  return (
    <Badge variant="neutral" size="sm" className={className}>
      {text}
    </Badge>
  );
}

export default ServicePricingBadge;
