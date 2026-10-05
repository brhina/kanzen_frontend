import { Link } from 'react-router';
import { ArrowRight, Clock, Edit3 } from 'lucide-react';
import type { ServiceEntity } from '../../domain/entities/service.entity';
import { ServiceCategoryBadge } from './ServiceCategoryBadge';
import { ServicePricingBadge } from './ServicePricingBadge';
import { ServiceFeatureList } from './ServiceFeatureList';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';

export interface ServiceCardProps {
  service: ServiceEntity;
  onEdit?: (service: ServiceEntity) => void;
  showAdminActions?: boolean;
}

export function ServiceCard({
  service,
  onEdit,
  showAdminActions = true,
}: ServiceCardProps) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      {/* Top Header Row */}
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ServiceCategoryBadge category={service.category} />
            {service.status !== 'active' && (
              <Badge variant="neutral" size="sm" className="capitalize text-[10px]">
                {service.status}
              </Badge>
            )}
          </div>

          {/* Inline Edit Button */}
          {showAdminActions && onEdit && (
            <PermissionGate permission="services:write">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => onEdit(service)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                title="Edit Service Offering"
              >
                <Edit3 className="h-3 w-3" />
                <span className="text-xs">Edit</span>
              </Button>
            </PermissionGate>
          )}
        </div>

        {/* Title & Tagline */}
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            <Link to={`/services/${service.slug}`}>
              {service.name}
            </Link>
          </h3>
          <p className="mt-1 text-xs font-medium text-brand-600 dark:text-brand-400">
            {service.tagline}
          </p>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
          {service.shortDescription || service.description}
        </p>

        {/* Features preview */}
        {service.features && service.features.length > 0 && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <ServiceFeatureList features={service.features} maxItems={3} />
          </div>
        )}
      </div>

      {/* Footer / Deliverables & Price */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-1">
          <ServicePricingBadge
            startingPrice={service.startingPrice}
            pricingModel={service.pricingModel}
          />
          {service.estimatedTimeline && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{service.estimatedTimeline}</span>
            </span>
          )}
        </div>

        <Link to={`/services/${service.slug}`}>
          <Button variant="outline" size="xs" className="flex items-center gap-1 group-hover:border-brand-500 group-hover:text-brand-600 dark:group-hover:text-brand-400">
            <span>Explore</span>
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default ServiceCard;
