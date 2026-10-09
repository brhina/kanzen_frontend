import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { ConsultationBookingForm } from '../components/ConsultationBookingForm';
import { ConsultationTable } from '../components/ConsultationTable';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Clock,
  ShieldCheck,
  Video,
  ListFilter,
  LayoutGrid,
} from 'lucide-react';

export function ConsultationsPage() {
  const { user, hasPermission } = useAuthStore();
  const canManage = Boolean(user?.isAdmin || hasPermission('consultations:read'));

  const [activeView, setActiveView] = useState<'table' | 'wizard'>('table');

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* AUTHORIZED STAFF APPOINTMENT DISPATCH CENTER */}
      {canManage ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Consultations &amp; Discovery Desk
                </h1>
                <Badge variant="brand" size="sm">
                  Active Dispatch
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                Confirm meeting slots, attach video rooms, and triage enterprise client technical discussions.
              </p>
            </div>

            {/* INLINE ADMIN CONTROLS */}
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveView('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeView === 'table'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  <span>Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('wizard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    activeView === 'wizard'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Public Booking Preview</span>
                </button>
              </div>
            </div>
          </div>

          {activeView === 'table' ? (
            <ConsultationTable />
          ) : (
            <div className="max-w-4xl mx-auto py-4">
              <div className="mb-6 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
                <span>Displaying 4-step consultation booking wizard as seen by prospective clients.</span>
                <Button size="sm" variant="ghost" onClick={() => setActiveView('table')}>
                  Back to Table
                </Button>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800">
                <ConsultationBookingForm />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PUBLIC VISITOR HIGH-CONVERTING INBOUND INTAKE */
        <div className="max-w-4xl mx-auto py-4 space-y-10">
          <div className="text-center space-y-4">
            <Badge variant="brand" size="md" className="mx-auto">
              Direct Technical Discovery
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Book an Architecture Consultation
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Engage directly with our Principal Architects. In 45 minutes, we evaluate your technical roadmap, scalability bottlenecks, and proposed architecture.
            </p>

            {/* Value Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-2xl mx-auto text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Clock className="w-5 h-5 text-brand-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">45-Minute Deep Dive</div>
                  <div className="text-[11px] text-slate-500">Live whiteboard review</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Video className="w-5 h-5 text-brand-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Direct Screen Share</div>
                  <div className="text-[11px] text-slate-500">Architecture teardowns</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Mutual NDA Protected</div>
                  <div className="text-[11px] text-slate-500">Full IP confidentiality</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800">
            <ConsultationBookingForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultationsPage;
export { ConsultationsPage as Component };
