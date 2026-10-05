import { useState } from 'react';
import { useConsultations } from '../../application/use-cases/useConsultations';
import { useConfirmConsultation } from '../../application/use-cases/useConfirmConsultation';
import { useCancelConsultation } from '../../application/use-cases/useCancelConsultation';
import { useCompleteConsultation } from '../../application/use-cases/useCompleteConsultation';
import { useDeleteConsultation } from '../../application/use-cases/useDeleteConsultation';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';
import { ConsultationStatus } from '../../domain/enums/consultation-status.enum';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Modal } from '@/shared/ui/modal';
import {
  Calendar,
  Video,
  Phone,
  Users,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
  Trash2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Link as LinkIcon,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Appointments' },
  { id: ConsultationStatus.PENDING, label: 'Pending Confirmation' },
  { id: ConsultationStatus.SCHEDULED, label: 'Scheduled' },
  { id: ConsultationStatus.COMPLETED, label: 'Completed' },
  { id: ConsultationStatus.CANCELLED, label: 'Cancelled' },
];

export function ConsultationTable() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Confirm Modal state
  const [confirmingItem, setConfirmingItem] = useState<ConsultationEntity | null>(null);
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/kzn-arch-sync');
  const [confirmNotes, setConfirmNotes] = useState('Confirmed by staff architect.');

  const confirmConsultation = useConfirmConsultation();
  const cancelConsultation = useCancelConsultation();
  const completeConsultation = useCompleteConsultation();
  const deleteConsultation = useDeleteConsultation();

  const { data, isLoading } = useConsultations({
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 15,
  });

  const appointments = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleOpenConfirm = (item: ConsultationEntity) => {
    setConfirmingItem(item);
    setMeetingLink(item.meetingLink || 'https://meet.google.com/kzn-arch-sync');
  };

  const handleExecuteConfirm = async () => {
    if (!confirmingItem?.id) return;
    await confirmConsultation.mutateAsync({
      id: confirmingItem.id,
      data: {
        meetingLink,
        notes: confirmNotes,
      },
    });
    setConfirmingItem(null);
  };

  const handleCancel = async (id?: string) => {
    if (!id) return;
    const reason = window.prompt('Please provide a reason for cancelling this appointment:');
    if (reason !== null) {
      await cancelConsultation.mutateAsync({ id, data: { reason } });
    }
  };

  const handleComplete = async (id?: string) => {
    if (!id) return;
    await completeConsultation.mutateAsync(id);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this consultation appointment?')) {
      await deleteConsultation.mutateAsync(id);
    }
  };

  const renderStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <Badge variant="warning" size="sm">Pending</Badge>;
      case ConsultationStatus.SCHEDULED:
        return <Badge variant="brand" size="sm">Scheduled</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge variant="success" size="sm">Completed</Badge>;
      case ConsultationStatus.CANCELLED:
        return <Badge variant="neutral" size="sm">Cancelled</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {STATUS_TABS.map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedStatus(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder="Search attendee, company..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Attendee / Company</th>
                <th className="py-3 px-4">Schedule & Timezone</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Technical Scope</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Meeting Room</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading consultations...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      No consultation bookings found in this view.
                    </p>
                  </td>
                </tr>
              ) : (
                appointments.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    {/* Attendee */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">{item.email}</div>
                      {item.company && (
                        <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" /> {item.company}
                        </div>
                      )}
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-brand-600" />
                        {item.preferredDate ? new Date(item.preferredDate).toLocaleDateString() : 'Pending'} {item.preferredTime ? `· ${item.preferredTime}` : ''}
                      </div>
                      <div className="text-slate-500 mt-0.5">{item.timezone}</div>
                    </td>

                    {/* Format */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium capitalize">
                        {item.meetingType === 'video' ? (
                          <Video className="w-3.5 h-3.5 text-brand-600" />
                        ) : item.meetingType === 'phone' ? (
                          <Phone className="w-3.5 h-3.5 text-brand-600" />
                        ) : (
                          <Users className="w-3.5 h-3.5 text-brand-600" />
                        )}
                        {item.meetingType}
                      </div>
                    </td>

                    {/* Technical Scope */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.projectDescription}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      {renderStatusBadge(item.status)}
                    </td>

                    {/* Meeting Room */}
                    <td className="py-3.5 px-4 text-xs">
                      {item.meetingLink ? (
                        <a
                          href={item.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-brand-600 hover:underline font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Join Call
                        </a>
                      ) : (
                        <span className="text-slate-400 italic">Not set</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === ConsultationStatus.PENDING && (
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={() => handleOpenConfirm(item)}
                            className="h-8 text-xs"
                          >
                            Confirm
                          </Button>
                        )}

                        {item.status === ConsultationStatus.SCHEDULED && (
                          <Button
                            size="sm"
                            variant="success"
                            onClick={() => handleComplete(item.id)}
                            isLoading={completeConsultation.isPending}
                            title="Mark Completed"
                            className="h-8 text-xs px-2.5"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </Button>
                        )}

                        {item.status !== ConsultationStatus.CANCELLED && item.status !== ConsultationStatus.COMPLETED && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancel(item.id)}
                            isLoading={cancelConsultation.isPending}
                            title="Cancel Appointment"
                            className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          title="Delete Record"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {appointments.length} of {total} appointments
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-7 px-2"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-7 px-2"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Inline Confirmation Modal */}
      {confirmingItem && (
        <Modal
          isOpen={Boolean(confirmingItem)}
          onClose={() => setConfirmingItem(null)}
          title={`Confirm Appointment: ${confirmingItem.name}`}
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Attach the video meeting link (Google Meet, Zoom, or Teams) and internal notes for this session.
            </p>

            <Input
              label="Meeting URL *"
              placeholder="https://meet.google.com/xyz-uvwx-rst"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              leftIcon={<LinkIcon className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Confirmation Notes"
              placeholder="Confirmed with attendee via email calendar invitation."
              value={confirmNotes}
              onChange={(e) => setConfirmNotes(e.target.value)}
            />

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" size="sm" onClick={() => setConfirmingItem(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleExecuteConfirm}
                isLoading={confirmConsultation.isPending}
              >
                Confirm & Dispatch Coordinates
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
