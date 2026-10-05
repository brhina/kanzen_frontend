import { ServiceCategory } from '../../domain/enums/service-category.enum';
import { Badge } from '@/shared/ui/badge';

export interface ServiceCategoryBadgeProps {
  category: ServiceCategory | string;
  className?: string;
}

const categoryLabels: Record<string, string> = {
  [ServiceCategory.CUSTOM_SOFTWARE]: 'Custom Software',
  [ServiceCategory.SAAS]: 'SaaS Engineering',
  [ServiceCategory.WEB_APP]: 'Web Applications',
  [ServiceCategory.MOBILE]: 'Mobile Development',
  [ServiceCategory.AI]: 'AI & Machine Learning',
  [ServiceCategory.CLOUD]: 'Cloud & DevOps',
  [ServiceCategory.DESIGN]: 'Product & UI/UX',
  [ServiceCategory.CONSULTING]: 'Tech Consulting',
  [ServiceCategory.MAINTENANCE]: 'SRE & Maintenance',
};

export function ServiceCategoryBadge({ category, className }: ServiceCategoryBadgeProps) {
  const label = categoryLabels[category] || category.replace('-', ' ');
  return (
    <Badge variant="info" size="sm" className={className}>
      {label}
    </Badge>
  );
}

export default ServiceCategoryBadge;
