import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useLead } from '../../application/use-cases/useLead';
import { useUpdateLead } from '../../application/use-cases/useUpdateLead';
import { useQualifyLead } from '../../application/use-cases/useQualifyLead';
import { useConvertLead } from '../../application/use-cases/useConvertLead';
import { useDeleteLead } from '../../application/use-cases/useDeleteLead';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { LeadStatusBadge } from '../components/LeadStatusBadge';
import { LeadQualificationScore } from '../components/LeadQualificationScore';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Textarea } from '@/shared/ui/textarea';
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  ExternalLink,
  DollarSign,
  Clock,
  Calendar,
  CheckCircle2,
  Sliders,
  Trash2,
  Sparkles,
} from 'lucide-react';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: lead, isLoading, isError } = useLead(id);
  const updateLead = useUpdateLead();
  const qualifyLead = useQualifyLead();
  const convertLead = useConvertLead();
  const deleteLead = useDeleteLead();

  const [prevLeadId, setPrevLeadId] = useState<string | undefined>(lead?.id);
  const [notes, setNotes] = useState(lead?.notes || '');
  const [qualifyScore, setQualifyScore] = useState(lead?.qualificationScore || 50);

  if (lead && lead.id !== prevLeadId) {
    setPrevLeadId(lead.id);
    setNotes(lead.notes || '');
    setQualifyScore(lead.qualificationScore || 50);
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center text-slate-500">
        Loading lead dossier...
      </div>
    );
  }

  if (isError || !lead) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Lead Not Found</h2>
        <p className="text-sm text-slate-500">The requested lead record could not be located or has been archived.</p>
        <Link to="/leads">
          <Button variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Return to Pipeline
          </Button>
        </Link>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!id) return;
    await updateLead.mutateAsync({
      id,
      data: { status: newStatus },
    });
  };

  const handleScoreUpdate = async () => {
    if (!id) return;
    await qualifyLead.mutateAsync({
      id,
      data: { score: Number(qualifyScore) },
    });
  };

  const handleSaveNotes = async () => {
    if (!id) return;
    await updateLead.mutateAsync({
      id,
      data: { notes },
    });
  };

  const handleConvert = async () => {
    if (!id) return;
    await convertLead.mutateAsync(id);
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this lead record permanently?')) {
      await deleteLead.mutateAsync(id);
      navigate('/leads');
    }
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link to="/leads">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Pipeline
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {lead.status !== LeadStatus.CONVERTED && (
            <Button
              size="sm"
              variant="success"
              onClick={handleConvert}
              isLoading={convertLead.isPending}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Convert to Customer
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Hero Overview */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lead.name}
            </h1>
            <LeadStatusBadge status={lead.status} size="md" />
          </div>
          {lead.company && (
            <p className="text-base font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              {lead.company}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Inquiry created {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
            </span>
            <span>Source: {lead.source || 'Website'}</span>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Lead Qualification
          </span>
          <LeadQualificationScore score={lead.qualificationScore} showDetails />
        </div>
      </div>

      {/* Main Grid: Details & Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Technical Scope & Discussion Notes */}
        <div className="lg:col-span-2 space-y-6">
          {/* Brief Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Project Brief & Requirements
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
              {lead.message || 'No project description provided with this inquiry.'}
            </div>

            {/* Service Focus */}
            <div className="space-y-1.5 pt-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Requested Capabilities
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {lead.serviceInterest.map((srv) => (
                  <Badge key={srv} variant="brand" size="md">
                    {srv}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Internal Notes Editor */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sales Engineer Notes & Next Actions
              </h3>
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
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record call discussion notes, stakeholder decision makers, architectural requirements..."
            />
          </div>
        </div>

        {/* Right 1 Col: Contact Info & Pipeline Controls */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Contact Dossier
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <a href={`mailto:${lead.email}`} className="text-brand-600 hover:underline truncate">
                  {lead.email}
                </a>
              </div>

              {lead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                  <a href={`tel:${lead.phone}`} className="text-slate-800 dark:text-slate-200 hover:underline">
                    {lead.phone}
                  </a>
                </div>
              )}

              {lead.website && (
                <div className="flex items-center gap-3">
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

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Budget:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {lead.budget ? `$${lead.budget.toLocaleString()} ${lead.budgetCurrency}` : 'Undisclosed'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Timeline:
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {lead.timeline || 'Flexible'}
                </span>
              </div>
            </div>
          </div>

          {/* Pipeline Stage Buttons */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Change Pipeline Stage
            </h3>
            <div className="grid grid-cols-2 gap-2">
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
            </div>
          </div>

          {/* Score Slider */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-brand-600" /> Score ({qualifyScore}/100)
              </h3>
              <Button
                size="sm"
                variant="outline"
                onClick={handleScoreUpdate}
                isLoading={qualifyLead.isPending}
              >
                Save
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
        </div>
      </div>
    </div>
  );
}

export default LeadDetailPage;
export { LeadDetailPage as Component };
