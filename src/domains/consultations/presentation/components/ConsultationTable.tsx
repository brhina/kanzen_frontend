import { useState, useMemo } from 'react';
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
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';
import {
  Calendar,
  Video,
  Phone,
  Users,
  ExternalLink,
  CheckCircle,
  XCircle,
  Trash2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Link as LinkIcon,
  Laptop,
  BookOpen,
  Pencil,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Statuses' },
  { id: ConsultationStatus.PENDING, label: 'Pending' },
  { id: ConsultationStatus.SCHEDULED, label: 'Scheduled' },
  { id: ConsultationStatus.COMPLETED, label: 'Completed' },
  { id: ConsultationStatus.CANCELLED, label: 'Cancelled' },
];

const TYPE_TABS = [
  { id: 'all', label: 'All Sessions' },
  { id: 'consultation', label: '1-on-1 Consultations' },
  { id: 'training', label: 'Corporate Trainings' },
];

export interface ConsultationTableProps {
  actions?: React.ReactNode;
  onEdit?: (item: ConsultationEntity) => void;
  onOpenCreate?: () => void;
}

export function ConsultationTable({
  actions,
  onEdit,
  onOpenCreate,
}: ConsultationTableProps = {}) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [formatFilter, setFormatFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'preferredDate' | 'name'>('newest');
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
    isAdminView: true,
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    type: selectedType === 'all' ? undefined : selectedType,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 15,
  });

  const appointments = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleOpenConfirm = (item: ConsultationEntity) => {
    setConfirmingItem(item);
    setMeetingLink(
      item.meetingLink ||
        (item.type === 'training'
          ? 'https://meet.google.com/kzn-workshop-lab'
          : 'https://meet.google.com/kzn-arch-sync'),
    );
    setConfirmNotes(
      item.type === 'training'
        ? `Confirmed training workshop for ${item.attendeesCount || 10} engineers. Sandboxes provisioned.`
        : 'Confirmed by staff architect.',
    );
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
    if (window.confirm('Are you sure you want to delete this consultation/training appointment?')) {
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

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (selectedType !== 'all') count++;
    if (formatFilter !== 'all') count++;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedStatus, selectedType, formatFilter, sortBy]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (searchTerm) {
      chips.push({
        id: 'search',
        label: `Search: "${searchTerm}"`,
        onRemove: () => setSearchTerm(''),
      });
    }
    if (selectedType !== 'all') {
      const tab = TYPE_TABS.find((t) => t.id === selectedType);
      chips.push({
        id: 'type',
        label: `Offering: ${tab?.label || selectedType}`,
        onRemove: () => setSelectedType('all'),
      });
    }
    if (selectedStatus !== 'all') {
      const tab = STATUS_TABS.find((t) => t.id === selectedStatus);
      chips.push({
        id: 'status',
        label: `Status: ${tab?.label || selectedStatus}`,
        onRemove: () => setSelectedStatus('all'),
      });
    }
    if (formatFilter !== 'all') {
      chips.push({
        id: 'format',
        label: `Format: ${formatFilter === 'video' ? 'Video Call' : formatFilter === 'phone' ? 'Phone Call' : 'In-Person'}`,
        onRemove: () => setFormatFilter('all'),
      });
    }
    if (sortBy !== 'newest') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'preferredDate' ? 'Appointment Date' : 'Attendee Name'}`,
        onRemove: () => setSortBy('newest'),
      });
    }
    return chips;
  }, [searchTerm, selectedType, selectedStatus, formatFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedType('all');
    setFormatFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const displayedAppointments = useMemo(() => {
    let list = [...appointments];
    if (formatFilter !== 'all') {
      list = list.filter((a) => a.meetingType?.toLowerCase() === formatFilter.toLowerCase());
    }
    if (sortBy === 'preferredDate') {
      list.sort((a, b) => {
        const da = a.preferredDate ? new Date(a.preferredDate).getTime() : 0;
        const db = b.preferredDate ? new Date(b.preferredDate).getTime() : 0;
        return db - da;
      });
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [appointments, formatFilter, sortBy]);

  return (
    <div className="space-y-4">
      {/* Filters & Search */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search attendee, organization, training topic, email..."
        isFilterExpanded={isFilterExpanded}
        onToggleFilter={() => setIsFilterExpanded((prev) => !prev)}
        activeFilterCount={activeFilterCount}
        activeChips={activeChips}
        onClearAllFilters={handleResetFilters}
        resultsSummary={
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{displayedAppointments.length}</span> of {total} sessions
          </span>
        }
        actions={
          actions ||
          (onOpenCreate ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onOpenCreate}
            >
              <span>Schedule Session</span>
            </Button>
          ) : undefined)
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <FilterGroup label="Session Type" count={selectedType !== 'all' ? 1 : undefined}>
            <div className="flex flex-wrap gap-1.5">
              {TYPE_TABS.map((tab) => (
                <FilterPill
                  key={tab.id}
                  label={tab.label}
                  isActive={selectedType === tab.id}
                  onClick={() => {
                    setSelectedType(tab.id);
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Appointment Status" count={selectedStatus !== 'all' ? 1 : undefined}>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_TABS.map((tab) => (
                <FilterPill
                  key={tab.id}
                  label={tab.label}
                  isActive={selectedStatus === tab.id}
                  onClick={() => {
                    setSelectedStatus(tab.id);
                    setCurrentPage(1);
                  }}
                />
              ))}
            </div>
          </FilterGroup>

          <FilterGroup label="Meeting & Delivery Format" count={formatFilter !== 'all' ? 1 : undefined}>
            <FilterSelect
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Formats' },
                { value: 'video', label: 'Virtual (Video / Labs)' },
                { value: 'phone', label: 'Phone Call' },
                { value: 'in_person', label: 'On-Site / In-Person' },
              ]}
            />
          </FilterGroup>

          <FilterGroup label="Sort By" count={sortBy !== 'newest' ? 1 : undefined}>
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'preferredDate' | 'name')}
              options={[
                { value: 'newest', label: 'Newest Booked First' },
                { value: 'preferredDate', label: 'Preferred Schedule Date' },
                { value: 'name', label: 'Attendee Name (A-Z)' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

      {/* Appointments & Workshops Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Attendee / Company</th>
                <th className="py-3 px-4">Offering &amp; Curriculum</th>
                <th className="py-3 px-4">Schedule &amp; Timezone</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Coordinates / Room</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading consultations and trainings...
                  </td>
                </tr>
              ) : displayedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      No consultation or training bookings found in this view.
                    </p>
                  </td>
                </tr>
              ) : (
                displayedAppointments.map((item) => {
                  const isTraining = item.type === 'training';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Attendee & Organization */}
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

                      {/* Offering & Curriculum */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex items-center gap-1.5 mb-1">
                          {isTraining ? (
                            <>
                              <Badge variant="brand" size="sm">
                                Training
                              </Badge>
                              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-0.5">
                                <Users className="w-3 h-3" />
                                {item.attendeesCount || 10} devs
                              </span>
                            </>
                          ) : (
                            <Badge variant="neutral" size="sm">
                              Consultation
                            </Badge>
                          )}
                        </div>

                        {item.trainingTopic ? (
                          <div className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                            <BookOpen className="w-3 h-3 text-brand-500 shrink-0" />
                            <span className="truncate">{item.trainingTopic}</span>
                          </div>
                        ) : null}

                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.projectDescription}
                        </p>
                      </td>

                      {/* Schedule & Timezone */}
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
                          {isTraining ? (
                            <>
                              <Laptop className="w-3.5 h-3.5 text-brand-600" />
                              <span>{item.deliveryFormat?.replace('_', ' ') || 'Virtual Lab'}</span>
                            </>
                          ) : item.meetingType === 'video' ? (
                            <>
                              <Video className="w-3.5 h-3.5 text-brand-600" />
                              <span>Video Call</span>
                            </>
                          ) : item.meetingType === 'phone' ? (
                            <>
                              <Phone className="w-3.5 h-3.5 text-brand-600" />
                              <span>Phone</span>
                            </>
                          ) : (
                            <>
                              <Users className="w-3.5 h-3.5 text-brand-600" />
                              <span>In-Person</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Coordinates / Room */}
                      <td className="py-3.5 px-4 text-xs">
                        {item.meetingLink ? (
                          <a
                            href={item.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 hover:underline font-semibold"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {isTraining ? 'Workshop Lab' : 'Join Call'}
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
                              title="Cancel Session"
                              className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}

                          {onEdit && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => onEdit(item)}
                              title="Edit Session Details"
                              className="h-8 w-8 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
                            >
                              <Pencil className="w-3.5 h-3.5" />
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {displayedAppointments.length} of {total} sessions
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
          title={
            confirmingItem.type === 'training'
              ? `Confirm Corporate Training Workshop: ${confirmingItem.company || confirmingItem.name}`
              : `Confirm Architecture Consultation: ${confirmingItem.name}`
          }
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {confirmingItem.type === 'training'
                ? `Attach the virtual workshop / lab meeting room coordinates and setup instructions for ${confirmingItem.attendeesCount || 10} engineers.`
                : 'Attach the video meeting link (Google Meet, Zoom, or Teams) and internal notes for this session.'}
            </p>

            <Input
              label={confirmingItem.type === 'training' ? 'Workshop Lab / Meeting URL *' : 'Meeting URL *'}
              placeholder={
                confirmingItem.type === 'training'
                  ? 'https://meet.google.com/kzn-workshop-lab'
                  : 'https://meet.google.com/xyz-uvwx-rst'
              }
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              leftIcon={<LinkIcon className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Confirmation Notes"
              placeholder={
                confirmingItem.type === 'training'
                  ? 'Confirmed training schedule. Lab cluster access details attached.'
                  : 'Confirmed with attendee via email calendar invitation.'
              }
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
                Confirm &amp; Dispatch Coordinates
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
