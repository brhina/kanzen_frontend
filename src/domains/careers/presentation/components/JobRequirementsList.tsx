import React from 'react';
import { CheckCircle2, PlusCircle, Gift, Cpu } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

interface JobRequirementsListProps {
  requirements: string[];
  niceToHave?: string[];
  benefits?: string[];
  technologies?: string[];
  className?: string;
}

export const JobRequirementsList: React.FC<JobRequirementsListProps> = ({
  requirements,
  niceToHave = [],
  benefits = [],
  technologies = [],
  className = '',
}) => {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Key Responsibilities & Requirements */}
      {requirements.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <span>Key Requirements & Qualifications</span>
          </h3>
          <ul className="space-y-2 pl-1">
            {requirements.map((req, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Nice to Have */}
      {niceToHave.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-indigo-500 shrink-0" />
            <span>Nice to Have</span>
          </h3>
          <ul className="space-y-2 pl-1">
            {niceToHave.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tech Stack */}
      {technologies.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-cyan-500 shrink-0" />
            <span>Technologies & Tools</span>
          </h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {technologies.map((tech, idx) => (
              <Badge
                key={idx}
                variant="neutral"
                size="md"
                className="font-mono text-xs px-2.5 py-1"
              >
                {tech}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Benefits & Perks */}
      {benefits.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="h-5 w-5 text-amber-500 shrink-0" />
            <span>Perks & Benefits</span>
          </h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-1">
            {benefits.map((benefit, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                <span className="leading-snug">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};
