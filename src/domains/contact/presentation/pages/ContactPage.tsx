import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { ContactForm } from '../components/ContactForm';
import { ContactTable } from '../components/ContactTable';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Mail,
  MapPin,
  Clock,
  LayoutGrid,
  ListFilter,
} from 'lucide-react';

export function ContactPage() {
  const { user, hasPermission } = useAuthStore();
  const canManage = Boolean(user?.isAdmin || hasPermission('contact:read'));

  const [activeView, setActiveView] = useState<'inbox' | 'form'>('inbox');

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* AUTHORIZED STAFF INBOX DESK */}
      {canManage ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  Inquiries & Support Desk
                </h1>
                <Badge variant="brand" size="sm">
                  Inbox Live
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
                Triage incoming partnership requests, technical inquiries, and media messages.
              </p>
            </div>

            {/* View Switcher: Inbox vs Public Form Preview */}
            <div className="flex items-center gap-3">
              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveView('inbox')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'inbox'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  Message Inbox
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('form')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeView === 'form'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Contact Form Preview
                </button>
              </div>
            </div>
          </div>

          {activeView === 'inbox' ? (
            <ContactTable />
          ) : (
            <div className="max-w-2xl mx-auto py-4">
              <div className="mb-6 p-4 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs text-brand-800 dark:text-brand-300 flex items-center justify-between">
                <span>Displaying public contact page as seen by prospective clients and partners.</span>
                <Button size="sm" variant="ghost" onClick={() => setActiveView('inbox')}>
                  Back to Inbox
                </Button>
              </div>
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <ContactForm />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* PUBLIC VISITOR CONTACT CHANNELS & FORM */
        <div className="max-w-5xl mx-auto py-4 space-y-12">
          <div className="text-center space-y-4">
            <Badge variant="brand" size="md" className="mx-auto">
              Direct Communication
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Get in Touch with Kanzen Tech
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Have questions about our engineering capabilities, consulting engagements, or partnership programs? We are here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Direct Channels Column */}
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Direct Inquiries
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  General inquiries, enterprise sales, and client collaborations:
                </p>
                <div className="text-sm font-semibold text-brand-600">
                  <a href="mailto:hello@kanzen.tech" className="hover:underline">
                    hello@kanzen.tech
                  </a>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Engineering Hub
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nairobi, Kenya · Silicon Savannah
                </p>
                <p className="text-xs text-slate-400">
                  Global remote distributed delivery across US, UK & EMEA timezones.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  Operating Hours
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Monday – Friday: 08:00 – 18:00 EAT
                </p>
                <p className="text-xs text-slate-400">
                  24/7 dedicated support for active enterprise SLA clients.
                </p>
              </div>
            </div>

            {/* Interactive Inquiry Form */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <ContactForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactPage;
export { ContactPage as Component };
