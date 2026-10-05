import { Flame, Sparkles, AlertCircle } from 'lucide-react';

interface LeadQualificationScoreProps {
  score: number;
  showDetails?: boolean;
  className?: string;
}

export function LeadQualificationScore({
  score,
  showDetails = false,
  className = '',
}: LeadQualificationScoreProps) {
  const normalizedScore = Math.max(0, Math.min(100, score || 0));

  let colorClasses = 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700';
  let badgeText = 'Cold';
  let Icon = AlertCircle;

  if (normalizedScore >= 80) {
    colorClasses = 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    badgeText = 'High Intent';
    Icon = Flame;
  } else if (normalizedScore >= 50) {
    colorClasses = 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    badgeText = 'Qualified';
    Icon = Sparkles;
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${colorClasses}`}
        title={`Qualification Score: ${normalizedScore}/100`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{normalizedScore}</span>
        {showDetails && <span className="opacity-75">· {badgeText}</span>}
      </div>
    </div>
  );
}
