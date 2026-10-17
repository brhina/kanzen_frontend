import {
  Calendar,
  Clock,
  Users,
  Laptop,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';
import { ConsultationType } from '../../domain/enums/consultation-type.enum';
import { DeliveryFormat } from '../../domain/enums/delivery-format.enum';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { formatDate } from '@/shared/utils/format';

export interface ConsultationCardProps {
  consultation: ConsultationEntity;
  onBookSimilar?: (consultation: ConsultationEntity) => void;
  onSelect?: (consultation: ConsultationEntity) => void;
  isAdmin?: boolean;
}

export function ConsultationCard({
  consultation,
  onBookSimilar,
  onSelect,
  isAdmin = false,
}: ConsultationCardProps) {
  const isTraining = consultation.type === ConsultationType.TRAINING;

  const formatBadgeVariant = (format?: string) => {
    switch (format) {
      case DeliveryFormat.ON_SITE_INTENSIVE:
        return 'warning';
      case DeliveryFormat.HYBRID:
        return 'success';
      default:
        return 'info';
    }
  };

  const formatLabel = (format?: string) => {
    switch (format) {
      case DeliveryFormat.ON_SITE_INTENSIVE:
        return 'On-Site Intensive';
      case DeliveryFormat.HYBRID:
        return 'Hybrid Cohort';
      default:
        return 'Virtual Interactive Lab';
    }
  };

  const title = isTraining
    ? consultation.trainingTopic || consultation.projectDescription
    : consultation.projectDescription;

  const dateFormatted = consultation.preferredDate
    ? formatDate(consultation.preferredDate, 'MMM d, yyyy')
    : 'Date Arranged Upon Booking';

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
      {/* Top Header Row: Category Badge & Delivery Mode */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {isTraining ? (
              <Badge variant="brand" size="sm">
                Corporate Workshop
              </Badge>
            ) : (
              <Badge variant="info" size="sm">
                1-on-1 Advisory
              </Badge>
            )}

            {isTraining && consultation.deliveryFormat && (
              <Badge
                variant={formatBadgeVariant(consultation.deliveryFormat)}
                size="sm"
                className="text-[10px]"
              >
                {formatLabel(consultation.deliveryFormat)}
              </Badge>
            )}

            {consultation.status === 'scheduled' ? (
              <Badge variant="success" size="sm" className="text-[10px]">
                Confirmed &amp; Scheduled
              </Badge>
            ) : consultation.status === 'pending' ? (
              <Badge variant="warning" size="sm" className="text-[10px]">
                Discovery Pending
              </Badge>
            ) : (
              <Badge variant="neutral" size="sm" className="text-[10px] capitalize">
                {consultation.status}
              </Badge>
            )}
          </div>

          {/* Sponsoring / Client Organization */}
          {consultation.company && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <Building2 className="h-3 w-3" />
              <span className="truncate max-w-[140px]">{consultation.company}</span>
            </div>
          )}
        </div>

        {/* Title / Topic */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {consultation.projectDescription}
          </p>
        </div>

        {/* Logistics & Headcount Metadata Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 pb-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="truncate font-medium">{dateFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="truncate">
              {consultation.preferredTime || '14:00 UTC'} ({consultation.timezone || 'UTC'})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span className="truncate font-medium">
              {isTraining
                ? `${consultation.attendeesCount || 10}+ Engineers`
                : '1-on-1 Dedicated Slot'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isTraining ? (
              <Laptop className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            ) : (
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            )}
            <span className="truncate">
              {isTraining ? 'Cloud Sandbox Labs' : 'Mutual NDA Included'}
            </span>
          </div>
        </div>

        {/* Notes or Track Focus */}
        {consultation.notes && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
            {consultation.notes}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500 dark:text-slate-400">
          {isTraining ? 'Interactive Enterprise Track' : 'Principal Architect Review'}
        </div>

        <div className="flex items-center gap-2">
          {onBookSimilar && (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => onBookSimilar(consultation)}
              className="cursor-pointer text-xs"
            >
              <span>{isTraining ? 'Book Team Cohort' : 'Book Session'}</span>
            </Button>
          )}

          {isAdmin && onSelect && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onSelect(consultation)}
              className="text-xs"
            >
              Manage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
