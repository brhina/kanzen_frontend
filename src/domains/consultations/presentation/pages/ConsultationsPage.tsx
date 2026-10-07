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
  LayoutGrid,
  ListFilter,
  Sparkles,
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
          <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                Consultations & Discovery Desk
              </h1>
              <Badge variant="brand" size="sm">
                Active Dispatch
              </Badge>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
              Confirm meeting slots, attach video rooms, and triage enterprise client technical discussions.
            </p>
          </div>

          {activeView === 'table' ? (
            <ConsultationTable
              actions={
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setActiveView('table')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      activeView === 'table'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
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
                      (activeView as string) === 'wizard'
                        ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span>Wizard Preview</span>
                  </button>
                </div>
              }
            />
          ) : (
            <div className="max-w-3xl mx-auto py-4">
              <div className="mb-6 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
                <span>Displaying 4-step consultation booking wizard as seen by prospective clients.</span>
                <Button size="sm" variant="ghost" onClick={() => setActiveView('table')}>
                  Back to Table
                </Button>
              </div>
              <div className="bg-white dark:bg-slate-900/90 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <ConsultationBookingForm />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PUBLIC VISITOR TECHNICAL DISCOVERY HERO & 4-STEP WIZARD */
        <div className="space-y-10">
          {/* Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16 border border-slate-800">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
                <Sparkles className="h-3.5 w-3.5 text-brand-400" />
                <span>Direct Technical Discovery</span>
              </div>

              <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
                Book an Architecture Consultation
              </h1>

              <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
                Engage directly with our Principal Architects. In 45 minutes, we evaluate your technical roadmap, scalability bottlenecks, and proposed architecture.
              </p>
            </div>
          </div>

          {/* Session Value Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">45-Minute Deep Dive</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Live whiteboard review</div>
              </div>
            </div>

            <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">Direct Screen Share</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Architecture teardowns</div>
              </div>
            </div>

            <div className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">No-Obligation</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Tangible recommendations</div>
              </div>
            </div>
          </div>

          {/* 4-Step Booking Wizard Card */}
          <div className="bg-white dark:bg-slate-900/90 p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <ConsultationBookingForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsultationsPage;
export { ConsultationsPage as Component };
