import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import {
  Video,
  Clock,
  ShieldCheck,
  Calendar,
  Search,
} from 'lucide-react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useConsultations } from '../../application/use-cases/useConsultations';
import { useCreateConsultation } from '../../application/use-cases/useCreateConsultation';
import { useUpdateConsultation } from '../../application/use-cases/useUpdateConsultation';
import { ConsultationType } from '../../domain/enums/consultation-type.enum';
import type { ConsultationEntity } from '../../domain/entities/consultation.entity';
import type {
  CreateConsultationDto,
  UpdateConsultationDto,
} from '../../infrastructure/consultations.dto';
import { ConsultationCard } from '../components/ConsultationCard';
import { ConsultationTable } from '../components/ConsultationTable';
import { ConsultationBookingForm } from '../components/ConsultationBookingForm';
import { ConsultationForm } from '../components/ConsultationForm';
import { Drawer } from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { HeaderBanner } from '@/layouts/components';

export function ConsultationsPage() {
  const { user, hasPermission } = useAuthStore();
  const isStaff = Boolean(user?.isAdmin || hasPermission('consultations:read'));
  const canWrite = Boolean(user?.isAdmin || hasPermission('consultations:write'));

  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('type') === 'training' ? 'training' : 'consultation';
  const initialOpen = searchParams.get('book') === 'true';

  // View state
  const [activeView, setActiveView] = useState<'grid' | 'table'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Drawer & Form state
  const [isDrawerOpen, setIsDrawerOpen] = useState(initialOpen);
  const [drawerMode, setDrawerMode] = useState<'consultation' | 'training'>(initialMode);
  const [isAdminFormOpen, setIsAdminFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ConsultationEntity | null>(null);

  // Queries & Mutations
  const { data, isLoading, refetch } = useConsultations({
    isAdminView: isStaff,
    type: selectedType !== 'all' ? selectedType : undefined,
    search: searchQuery || undefined,
  });

  const createConsultation = useCreateConsultation();
  const updateConsultation = useUpdateConsultation();

  // Loaded sessions from backend database API
  const sessions = useMemo(() => {
    return data?.items || [];
  }, [data?.items]);

  // Client-side filtering for search & tabs
  const filteredSessions = useMemo(() => {
    let result = [...sessions];

    if (selectedType !== 'all') {
      result = result.filter((s) => s.type === selectedType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.trainingTopic?.toLowerCase().includes(q) ||
          s.projectDescription?.toLowerCase().includes(q) ||
          s.company?.toLowerCase().includes(q) ||
          s.name?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [sessions, selectedType, searchQuery]);

  const handleOpenPublicBooking = (mode: 'consultation' | 'training') => {
    setEditingItem(null);
    setDrawerMode(mode);
    setIsAdminFormOpen(false);
    setIsDrawerOpen(true);
  };

  const handleOpenAdminCreate = (mode?: 'consultation' | 'training') => {
    if (mode) setDrawerMode(mode);
    setEditingItem(null);
    setIsAdminFormOpen(true);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (item: ConsultationEntity) => {
    setEditingItem(item);
    setDrawerMode(item.type === ConsultationType.TRAINING ? 'training' : 'consultation');
    setIsAdminFormOpen(true);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setIsAdminFormOpen(false);
    setEditingItem(null);
  };

  const handleBookSimilar = (consultation: ConsultationEntity) => {
    setDrawerMode(consultation.type === ConsultationType.TRAINING ? 'training' : 'consultation');
    setIsAdminFormOpen(false);
    setIsDrawerOpen(true);
  };

  const handleAdminFormSubmit = async (
    dto: CreateConsultationDto | UpdateConsultationDto,
  ) => {
    if (editingItem?.id) {
      await updateConsultation.mutateAsync({
        id: editingItem.id,
        data: dto as UpdateConsultationDto,
      });
    } else {
      await createConsultation.mutateAsync(dto as CreateConsultationDto);
    }
    handleCloseDrawer();
    refetch();
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* 1. Header Banner */}
      <div className="relative">
        <HeaderBanner
          badge="Direct Technical Discovery"
          title="Book an Architecture Consultation"
          description="Engage directly with our Principal Architects. In 45 minutes, we evaluate your technical roadmap, scalability bottlenecks, and proposed architecture."
        />
      </div>

      {/* 2. Value Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              45-Minute Deep Dive
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live whiteboard review
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Direct Screen Share
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Architecture teardowns
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Mutual NDA Protected
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Full IP confidentiality
            </p>
          </div>
        </div>
      </div>

      {/* 3. Quick Booking Triggers */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Upcoming Architecture Discovery &amp; Corporate Cohorts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Browse confirmed public sessions below or schedule a dedicated slot for your engineering organization.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleOpenPublicBooking('consultation')}
          >
            <span>Book a Session</span>
          </Button>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => handleOpenPublicBooking('training')}
          >
            <span>Book Team Training</span>
          </Button>
        </div>
      </div>

      {/* 4. Staff Dispatch Desk Toolbar Header (when staff with permission) */}
      {isStaff && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Consultations &amp; Discovery Desk
            </h2>
            <Badge variant="brand" size="sm">
              Active Dispatch
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Grid Showcase vs Table Dispatch Desk */}
            <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setActiveView('grid')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeView === 'grid'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Grid Showcase"
              >
                <span>Grid View</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('table')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeView === 'table'
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Dispatch Table"
              >
                <span>Table</span>
              </button>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleOpenPublicBooking('consultation')}
              className="text-xs"
            >
              <span>Public Booking Preview</span>
            </Button>

            {canWrite && (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => handleOpenAdminCreate()}
                className="text-xs"
              >
                <span>Schedule Session</span>
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 5. Main Content: Table or Grid */}
      {isStaff && activeView === 'table' ? (
        <ConsultationTable
          onOpenCreate={canWrite ? () => handleOpenAdminCreate() : undefined}
          onEdit={handleOpenEdit}
        />
      ) : (
        <div className="space-y-6">
          {/* Filter Pills & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  selectedType === 'all'
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                }`}
              >
                All Sessions ({sessions.length})
              </button>

              <button
                type="button"
                onClick={() => setSelectedType(ConsultationType.TRAINING)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  selectedType === ConsultationType.TRAINING
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                }`}
              >
                <span>Corporate Trainings</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedType(ConsultationType.CONSULTATION)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                  selectedType === ConsultationType.CONSULTATION
                    ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800'
                }`}
              >
                <span>1-on-1 Consultations</span>
              </button>
            </div>

            {/* Quick Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search workshops, topics, or teams..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Scheduled Sessions Showcase Grid */}
          {isLoading && sessions.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="h-64 rounded-2xl border border-slate-200 bg-white/50 p-6 dark:border-slate-800 dark:bg-slate-900/50 animate-pulse"
                />
              ))}
            </div>
          ) : filteredSessions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSessions.map((session) => (
                <ConsultationCard
                  key={session.id}
                  consultation={session}
                  onBookSimilar={handleBookSimilar}
                  onSelect={handleOpenEdit}
                  isAdmin={isStaff}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
              <Calendar className="mx-auto h-10 w-10 text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No matching sessions found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No scheduled consultations match your query. You can schedule a bespoke corporate workshop or advisory session directly.
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    canWrite
                      ? handleOpenAdminCreate()
                      : handleOpenPublicBooking('consultation')
                  }
                >
                  Schedule a New Session
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. Slide-Out Booking & Admin Scheduling Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          isAdminFormOpen
            ? editingItem
              ? `Edit Session: ${editingItem.company || editingItem.name}`
              : drawerMode === 'training'
                ? 'Schedule Corporate Team Training Cohort'
                : 'Schedule 1-on-1 Architecture Consultation'
            : drawerMode === 'training'
              ? 'Schedule Corporate Team Training Workshop'
              : 'Schedule 1-on-1 Architecture Consultation'
        }
        description={
          isAdminFormOpen
            ? 'Administrative Session Dispatch: Configure curriculum topic, cohort headcount, meeting links, and cloud sandbox notes.'
            : 'Engage directly with our Principal Architects and Engineering Leads. Complete the requirements below to reserve your slot.'
        }
        size="xl"
      >
        <div className="p-6">
          {isAdminFormOpen ? (
            <ConsultationForm
              initialData={editingItem}
              defaultType={drawerMode}
              onSubmit={handleAdminFormSubmit}
              onCancel={handleCloseDrawer}
              isLoading={createConsultation.isPending || updateConsultation.isPending}
            />
          ) : (
            <ConsultationBookingForm
              initialType={drawerMode}
              onSuccess={() => {
                setIsDrawerOpen(false);
                refetch();
              }}
            />
          )}
        </div>
      </Drawer>
    </div>
  );
}

export default ConsultationsPage;
export { ConsultationsPage as Component };
