import { useState } from 'react';
import { Link } from 'react-router';
import type { LeadEntity } from '../../domain/entities/lead.entity';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { useUpdateLead } from '../../application/use-cases/useUpdateLead';
import { useQualifyLead } from '../../application/use-cases/useQualifyLead';
import { useConvertLead } from '../../application/use-cases/useConvertLead';
import { Drawer } from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Textarea } from '@/shared/ui/textarea';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadQualificationScore } from './LeadQualificationScore';
import {
  ExternalLink,
  Mail,
  Phone,
  Building2,
  Calendar,
  CheckCircle,
  Sliders,
  DollarSign,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  lead: LeadEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailDrawer({ lead, isOpen, onClose }: LeadDetailDrawerProps) {
  const updateLead = useUpdateLead();
  const qualifyLead = useQualifyLead();
  const convertLead = useConvertLead();

  const [prevLeadId, setPrevLeadId] = useState<string | undefined>(lead?.id);
  const [notes, setNotes] = useState(lead?.notes || '');
  const [qualifyScore, setQualifyScore] = useState(lead?.qualificationScore || 50);

  if (lead && lead.id !== prevLeadId) {
    setPrevLeadId(lead.id);
    setNotes(lead.notes || '');
    setQualifyScore(lead.qualificationScore || 50);
  }

  if (!lead) return null;

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead.id) return;
    await updateLead.mutateAsync({
      id: lead.id,
      data: { status: newStatus },
    });
  };

  const handleScoreUpdate = async () => {
    if (!lead.id) return;
    await qualifyLead.mutateAsync({
      id: lead.id,
      data: { score: Number(qualifyScore) },
    });
  };

  const handleSaveNotes = async () => {
    if (!lead.id) return;
    await updateLead.mutateAsync({
      id: lead.id,
      data: { notes },
    });
  };

  const handleConvert = async () => {
    if (!lead.id) return;
    await convertLead.mutateAsync(lead.id);
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Lead CRM Overview"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <Link to={`/leads/${lead.id}`}>
            <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Full Lead Page
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header Profile */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {lead.name}
              <LeadStatusBadge status={lead.status} />
            </h2>
            {lead.company && (
              <p className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                {lead.company}
              </p>
            )}
          </div>
          <LeadQualificationScore score={lead.qualificationScore} showDetails />
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Mail className="w-4 h-4 text-brand-600 shrink-0" />
            <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline truncate">
              {lead.email}
            </a>
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <Phone className="w-4 h-4 text-brand-600 shrink-0" />
              <a href={`tel:${lead.phone}`} className="text-slate-800 dark:text-slate-200 hover:underline">
                {lead.phone}
              </a>
            </div>
          )}
          {lead.website && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 sm:col-span-2">
              <ExternalLink className="w-4 h-4 text-brand-600 shrink-0" />
              <a
                href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-brand-600 hover:underline truncate"
              >
                {lead.website}
              </a>
            </div>
          )}
        </div>

        {/* Project Parameters */}
        <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Budget
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
              {lead.budget ? `$${lead.budget.toLocaleString()} ${lead.budgetCurrency}` : 'Undisclosed'}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> Timeline
            </span>
            <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1">
              {lead.timeline || 'Flexible'}
            </p>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 font-medium">Service Interests</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {lead.serviceInterest.length > 0 ? (
                lead.serviceInterest.map((item) => (
                  <Badge key={item} variant="neutral" size="sm">
                    {item}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">None specified</span>
              )}
            </div>
          </div>
        </div>

        {/* Client Brief */}
        {lead.message && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Project Brief & Requirements
            </h4>
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {lead.message}
            </div>
          </div>
        )}

        {/* Quick Lifecycle Status Actions */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Pipeline Stage & Status
          </h4>
          <div className="flex flex-wrap gap-2">
            {[LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.DISQUALIFIED].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={lead.status === st ? 'primary' : 'outline'}
                onClick={() => handleStatusChange(st)}
                isLoading={updateLead.isPending}
                className="capitalize"
              >
                {st}
              </Button>
            ))}
            {lead.status !== LeadStatus.CONVERTED && (
              <Button
                size="sm"
                variant="success"
                onClick={handleConvert}
                isLoading={convertLead.isPending}
                leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
              >
                Mark Converted
              </Button>
            )}
          </div>
        </div>

        {/* Score Adjuster */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-brand-600" />
              Adjust Qualification Score ({qualifyScore}/100)
            </label>
            <Button
              size="sm"
              variant="outline"
              onClick={handleScoreUpdate}
              isLoading={qualifyLead.isPending}
            >
              Update Score
            </Button>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={qualifyScore}
            onChange={(e) => setQualifyScore(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
        </div>

        {/* Internal Team Notes */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Internal Team Notes
            </h4>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveNotes}
              isLoading={updateLead.isPending}
            >
              Save Notes
            </Button>
          </div>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Log client call highlights, tech stack preferences, budget commitments..."
          />
        </div>

        {/* Submission Metadata */}
        <div className="text-xs text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            Created {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
          </span>
          <span>Source: {lead.source || 'Website'}</span>
        </div>
      </div>
    </Drawer>
  );
}
