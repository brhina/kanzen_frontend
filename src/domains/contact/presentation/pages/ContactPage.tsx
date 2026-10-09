import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { ContactForm } from '../components/ContactForm';
import { ContactTable } from '../components/ContactTable';
import { Badge } from '@/shared/ui/badge';
import {
  useSocialLinks,
  useCompanySettings,
  useContactSettings,
} from '@/domains/settings/application/use-cases/usePublicSettings';
import { SocialIcon } from '@/shared/ui/social/SocialIcon';
import {
  Mail,
  MapPin,
  Clock,
  Phone,
} from 'lucide-react';

export function ContactPage() {
  const { user, hasPermission } = useAuthStore();
  const canManage = Boolean(user?.isAdmin || hasPermission('contact:read'));

  const [activeView, setActiveView] = useState<'inbox' | 'form'>('inbox');

  const { company } = useCompanySettings();
  const { contact } = useContactSettings();
  const socialLinks = useSocialLinks();

  const companyName = company?.name || 'Kanzen Tech';
  const supportEmail = contact?.supportEmail || company?.email || 'hello@kanzen.tech';
  const headquarters = contact?.headquarters || company?.address || 'Nairobi, Kenya · Silicon Savannah';
  const businessHours = contact?.businessHours || 'Monday – Friday: 08:00 – 18:00 EAT';
  const phoneNumber = company?.phone;

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-radial from-slate-900 via-slate-950 to-slate-950 px-6 py-12 text-white shadow-2xl sm:px-12 sm:py-16">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center rounded-full bg-brand-500/10 px-3.5 py-1 text-xs font-semibold text-brand-300 ring-1 ring-brand-500/30">
            <span>{canManage ? 'Inquiries & Support Desk' : 'Direct Communication & Inquiries'}</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl text-white">
            {canManage ? 'Inquiries & Support Desk' : `Get in Touch with ${companyName}`}
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed max-w-2xl mx-auto">
            {canManage
              ? 'Triage incoming partnership requests, technical inquiries, and client collaborations with live status workflows.'
              : 'Have questions about our engineering capabilities, consulting engagements, or partnership programs? We are here to help.'}
          </p>
        </div>
      </div>

      {/* AUTHORIZED STAFF INBOX CONTROLS */}
      {canManage && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Badge variant="brand" size="sm">
              Inbox Live
            </Badge>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Manage incoming communications or preview public submission form.
            </span>
          </div>

          {/* View Switcher: Inbox vs Public Form Preview */}
          <div className="flex items-center rounded-xl bg-slate-100 p-0.5 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setActiveView('inbox')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeView === 'inbox'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Message Inbox
            </button>
            <button
              type="button"
              onClick={() => setActiveView('form')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeView === 'form'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Contact Form Preview
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {canManage && activeView === 'inbox' ? (
        <ContactTable />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Direct Channels Column */}
          <div className="space-y-4">
            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Direct Inquiries
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  General inquiries, enterprise sales, and client collaborations:
                </p>
              </div>
              <div className="text-sm font-semibold text-brand-600 dark:text-brand-400">
                <a href={`mailto:${supportEmail}`} className="hover:underline break-all">
                  {supportEmail}
                </a>
              </div>
            </div>

            {phoneNumber && (
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    Corporate Phone
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    Direct line for client operations and inquiries:
                  </p>
                </div>
                <div className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                  <a href={`tel:${phoneNumber.replace(/\s+/g, '')}`} className="hover:underline">
                    {phoneNumber}
                  </a>
                </div>
              </div>
            )}

            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Engineering Hub
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 font-medium">
                  {headquarters}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  Global remote distributed delivery across US, UK &amp; EMEA timezones.
                </p>
              </div>
            </div>

            <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  Operating Hours
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1 font-medium">
                  {businessHours}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  24/7 dedicated support for active enterprise SLA clients.
                </p>
              </div>
            </div>

            {/* Social Networks Channel Card */}
            {socialLinks.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900/90 space-y-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Connect Across Channels
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Follow official channels, engineering open-source releases, and engineering updates.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:border-brand-500/50 hover:bg-white hover:text-brand-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-brand-400 transition-all cursor-pointer"
                      title={link.label}
                    >
                      <SocialIcon platform={link.platform} className="h-3.5 w-3.5 shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Inquiry Form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900/90 p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <ContactForm />
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactPage;
export { ContactPage as Component };
