import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { LeadForm } from '../components/LeadForm';
import { LeadTable } from '../components/LeadTable';
import { useExportLeads } from '../../application/use-cases/useExportLeads';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import {
  Download,
  ShieldCheck,
  Zap,
  Users,
  LayoutGrid,
  ListFilter,
} from 'lucide-react';

export function LeadsPage() {
  const { user, hasPermission } = useAuthStore();
  const canViewCRM = Boolean(user?.isAdmin || hasPermission('leads:read'));

  const [activeView, setActiveView] = useState<'crm' | 'form'>('crm');
  const { exportCsv, isExporting } = useExportLeads();

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* AUTHORIZED STAFF CRM HEADER */}
      {canViewCRM ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Lead Generation Pipeline
                </h1>
                <Badge variant="brand" size="sm">
                  CRM Live
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                Review, qualify, score, and convert enterprise inbound opportunities.
              </p>
            </div>

            {/* INLINE ADMIN CONTROLS */}
            <div className="flex items-center gap-3">
              {/* View Switcher (CRM Table vs Visitor Form Preview) */}
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveView('crm')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'crm'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  CRM Table
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('form')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'form'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Public Intake Preview
                </button>
              </div>

              {/* CSV Export Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={exportCsv}
                isLoading={isExporting}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export CSV
              </Button>
            </div>
          </div>

          {/* ACTIVE CONTENT */}
          {activeView === 'crm' ? (
            <LeadTable />
          ) : (
            <div className="max-w-2xl mx-auto py-4">
              <div className="mb-6 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
                <span>Displaying visitor intake experience as seen by prospective clients.</span>
                <Button size="sm" variant="ghost" onClick={() => setActiveView('crm')}>
                  Back to Table
                </Button>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <LeadForm />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PUBLIC VISITOR HIGH-CONVERTING INBOUND INTAKE */
        <div className="max-w-4xl mx-auto py-4 space-y-10">
          <div className="text-center space-y-4">
            <Badge variant="brand" size="md" className="mx-auto">
              Engineering Scoping & Partnership
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Start Your Project with Kanzen Tech
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Tell us about your technical requirements, architectural goals, and timelines. We analyze your scope and respond with a structured proposal within 24 hours.
            </p>

            {/* Value Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Zap className="w-5 h-5 text-brand-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">&lt; 24h Turnaround</div>
                  <div className="text-[11px] text-slate-500">Fast feasibility brief</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Mutual NDA Protected</div>
                  <div className="text-[11px] text-slate-500">Full IP confidentiality</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Users className="w-5 h-5 text-brand-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Staff Architects</div>
                  <div className="text-[11px] text-slate-500">Direct technical triage</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <LeadForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default LeadsPage;
export { LeadsPage as Component };
