import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { NewsletterSignupForm } from '../components/NewsletterSignupForm';
import { SubscriberTable } from '../components/SubscriberTable';
import { useUnsubscribe } from '../../application/use-cases/useUnsubscribe';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import {
  LayoutGrid,
  ListFilter,
  CheckCircle2,
  BookOpen,
  Server,
  Cpu,
  Layers,
} from 'lucide-react';

export function NewsletterPage() {
  const { user, hasPermission } = useAuthStore();
  const canManage = Boolean(user?.isAdmin || hasPermission('newsletter:read'));

  const [activeAdminView, setActiveAdminView] = useState<'table' | 'public'>('table');
  const [publicTab, setPublicTab] = useState<'subscribe' | 'unsubscribe'>('subscribe');

  // Unsubscribe form state
  const [unsubEmail, setUnsubEmail] = useState('');
  const [unsubReason, setUnsubReason] = useState('');
  const [unsubSuccess, setUnsubSuccess] = useState(false);
  const unsubscribe = useUnsubscribe();

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unsubEmail) return;
    try {
      await unsubscribe.mutateAsync({ email: unsubEmail, reason: unsubReason });
      setUnsubSuccess(true);
    } catch (err) {
      console.error('Failed to unsubscribe', err);
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* AUTHORIZED STAFF AUDIENCE DESK */}
      {canManage ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Audience & Newsletter Engine
                </h1>
                <Badge variant="brand" size="sm">
                  Subscribers Live
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                Monitor subscriber acquisition channels, manage tags, and export active subscribers.
              </p>
            </div>

            {/* View Switcher: Table vs Public Dispatch Preview */}
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveAdminView('table')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeAdminView === 'table'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  Subscribers Table
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAdminView('public')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeAdminView === 'public'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Public Dispatch Preview
                </button>
              </div>
            </div>
          </div>

          {activeAdminView === 'table' ? (
            <SubscriberTable />
          ) : (
            <div className="max-w-3xl mx-auto py-4">
              <div className="mb-6 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
                <span>Displaying public newsletter preference center as seen by readers.</span>
                <Button size="sm" variant="ghost" onClick={() => setActiveAdminView('table')}>
                  Back to Table
                </Button>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <NewsletterSignupForm />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PUBLIC VISITOR ARCHITECTURE DISPATCH & PREFERENCE CENTER */
        <div className="max-w-4xl mx-auto py-4 space-y-12">
          {/* Hero */}
          <div className="text-center space-y-4">
            <Badge variant="brand" size="md" className="mx-auto">
              Weekly Technical Publication
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              The Kanzen Architecture Dispatch
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Curated engineering analysis, distributed systems patterns, database performance reviews, and cloud cost optimization delivered straight to your inbox.
            </p>
          </div>

          {/* Core Focus Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <div className="w-9 h-9 mx-auto rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Distributed Core</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Event brokers & consensus</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <div className="w-9 h-9 mx-auto rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Multi-Tenancy</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">SaaS isolation models</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <div className="w-9 h-9 mx-auto rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">AI Systems</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Low-latency agent flows</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
              <div className="w-9 h-9 mx-auto rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">Post-Mortems</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Real outage teardowns</p>
            </div>
          </div>

          {/* Preference Center Container */}
          <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none space-y-6">
            {/* Tab switch between Subscribe vs Unsubscribe */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 gap-6">
              <button
                type="button"
                onClick={() => setPublicTab('subscribe')}
                className={`pb-1 text-sm font-bold transition-all border-b-2 ${
                  publicTab === 'subscribe'
                    ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Join Architecture Dispatch
              </button>
              <button
                type="button"
                onClick={() => setPublicTab('unsubscribe')}
                className={`pb-1 text-sm font-bold transition-all border-b-2 ${
                  publicTab === 'unsubscribe'
                    ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                Manage Preferences / Unsubscribe
              </button>
            </div>

            {publicTab === 'subscribe' ? (
              <NewsletterSignupForm source="newsletter_page" />
            ) : (
              <div className="max-w-md mx-auto py-2 space-y-4">
                {unsubSuccess ? (
                  <div className="p-6 text-center space-y-2 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      You have been unsubscribed
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your email has been removed from all future broadcasts. You can re-subscribe anytime.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleUnsubscribe} className="space-y-4">
                    <p className="text-xs text-slate-500">
                      Enter the email address you wish to unsubscribe from our weekly dispatch.
                    </p>
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="engineer@company.com"
                      value={unsubEmail}
                      onChange={(e) => setUnsubEmail(e.target.value)}
                      required
                    />
                    <Input
                      label="Feedback (Optional)"
                      placeholder="Too frequent, content no longer relevant..."
                      value={unsubReason}
                      onChange={(e) => setUnsubReason(e.target.value)}
                    />
                    <Button
                      type="submit"
                      variant="danger"
                      size="md"
                      isLoading={unsubscribe.isPending}
                      className="w-full"
                    >
                      Confirm Unsubscribe
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsletterPage;
export { NewsletterPage as Component };
