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

  const colorClasses = 'text-brand-600 bg-brand-500/10 dark:text-brand-400 border-brand-500/20';
  let badgeText = 'Cold';
  let Icon = AlertCircle;

  if (normalizedScore >= 80) {
    badgeText = 'High Intent';
    Icon = Flame;
  } else if (normalizedScore >= 50) {
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
