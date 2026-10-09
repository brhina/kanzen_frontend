import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Clock,
  CheckCircle2,
  Code2,
  Package,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useService } from '../../application/use-cases/useService';
import { useUpdateService } from '../../application/use-cases/useUpdateService';
import { useDeleteService } from '../../application/use-cases/useDeleteService';
import type { UpdateServiceDto } from '../../infrastructure/services.dto';
import { ServiceCategoryBadge } from '../components/ServiceCategoryBadge';
import { ServiceForm } from '../components/ServiceForm';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';
import { Drawer } from '@/shared/ui/drawer';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: service, isLoading, error, refetch } = useService(slug);
  const updateMutation = useUpdateService();
  const deleteMutation = useDeleteService();

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleUpdate = async (dto: UpdateServiceDto) => {
    if (service?.id) {
      await updateMutation.mutateAsync({ id: service.id, dto });
      setIsEditDrawerOpen(false);
      refetch();
    }
  };

  const handleDelete = async () => {
    if (!service?.id) return;
    await deleteMutation.mutateAsync(service.id);
    setIsDeleteModalOpen(false);
    navigate('/services');
  };

  if (isLoading) {
    return (
      <div className="w-full px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
        <p className="mt-3 text-sm text-slate-500">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Service Not Found
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The requested service offering does not exist or may have been retired.
        </p>
        <div className="mt-6">
          <Link to="/services">
            <Button variant="primary" size="sm" className="inline-flex items-center gap-1.5">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Services</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Staff Inline Control Header */}
      <PermissionGate permission="services:write">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 dark:border-amber-900/40 dark:bg-amber-950/20">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
              Staff Controls:
            </span>
            <Badge
              variant={service.status === 'active' ? 'success' : 'neutral'}
              size="sm"
              className="capitalize font-mono text-xs"
            >
              Status: {service.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => setIsEditDrawerOpen(true)}
              className="flex items-center gap-1"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>Edit Service</span>
            </Button>

            <PermissionGate permission="services:delete">
              <Button
                type="button"
                variant="danger"
                size="xs"
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>
            </PermissionGate>
          </div>
        </div>
      </PermissionGate>

      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ServiceCategoryBadge category={service.category} />
          {service.isFeatured && (
            <Badge variant="warning" size="sm">
              Featured Offering
            </Badge>
          )}
        </div>

        <h1 className="text-3xl font-black text-slate-900 sm:text-5xl dark:text-white">
          {service.name}
        </h1>

        <p className="text-lg font-medium text-brand-600 dark:text-brand-400 max-w-3xl">
          {service.tagline}
        </p>
      </div>

      {/* Main Grid: Left Spec Details & Right Commercial Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Specification (2 Columns) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Overview &amp; Architecture Approach
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {service.description}
            </div>
          </section>

          {/* Scope & Capabilities (Features) */}
          {service.features && service.features.length > 0 && (
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span>Scope of Work &amp; Capabilities</span>
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {service.features.map((feat, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3 text-xs font-medium text-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Deliverables */}
          {service.deliverables && service.deliverables.length > 0 && (
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-indigo-500" />
                <span>Concrete Deliverables</span>
              </h2>
              <div className="space-y-2 pt-2">
                {service.deliverables.map((deliv, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-xs text-slate-700 dark:border-slate-800/60 dark:bg-slate-800/40 dark:text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="font-medium">{deliv}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Tech Stack */}
          {service.technologies && service.technologies.length > 0 && (
            <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="h-5 w-5 text-brand-500" />
                <span>Recommended Stack &amp; Technologies</span>
              </h2>
              <div className="flex flex-wrap gap-2 pt-2">
                {service.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Summary & Booking CTA (1 Column) */}
        <div className="space-y-6">
          <Card className="sticky top-20 border-slate-200 dark:border-slate-800">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Engagement Parameters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pricing breakdown */}
              <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 space-y-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                  Investment
                </span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {service.startingPrice
                    ? `$${service.startingPrice.toLocaleString()}`
                    : 'Custom Quote'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Model: <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{service.pricingModel || 'Fixed or Milestone-based'}</span>
                </div>
              </div>

              {/* Timeline */}
              {service.estimatedTimeline && (
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                  <Clock className="h-4 w-4 text-brand-500" />
                  <span>Estimated timeline: <strong className="text-slate-900 dark:text-white">{service.estimatedTimeline}</strong></span>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-2.5 pt-2">
                <Link to="/consultations" className="w-full block">
                  <Button variant="primary" size="md" className="w-full flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Book Strategy Session</span>
                  </Button>
                </Link>

                <Link to="/leads" className="w-full block">
                  <Button variant="outline" size="md" className="w-full flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>Request Proposal</span>
                  </Button>
                </Link>
              </div>

              <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
                100% IP ownership transferred upon completion &bull; Production SLA guarantees
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Service Drawer */}
      <Drawer
        isOpen={isEditDrawerOpen}
        onClose={() => setIsEditDrawerOpen(false)}
        title="Edit Service Offering"
        description={`Updating "${service.name}"`}
        size="lg"
      >
        <ServiceForm
          initialData={service}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditDrawerOpen(false)}
          isLoading={updateMutation.isPending}
        />
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Service Offering"
        description="Are you sure you want to permanently delete this offering? This action cannot be reversed."
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{service.name}"
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={handleDelete}
              isLoading={deleteMutation.isPending}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ServiceDetailPage;
export { ServiceDetailPage as Component };
