import { CheckCircle2 } from 'lucide-react';

export interface ServiceFeatureListProps {
  features: string[];
  maxItems?: number;
  className?: string;
}

export function ServiceFeatureList({ features, maxItems, className = '' }: ServiceFeatureListProps) {
  const displayFeatures = maxItems ? features.slice(0, maxItems) : features;

  if (displayFeatures.length === 0) return null;

  return (
    <ul className={`space-y-2 text-xs text-slate-600 dark:text-slate-300 ${className}`}>
      {displayFeatures.map((feature, i) => (
        <li key={i} className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

export default ServiceFeatureList;
