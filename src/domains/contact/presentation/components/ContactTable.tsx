import { useState } from 'react';
import { useContacts } from '../../application/use-cases/useContacts';
import { useMarkContactRead } from '../../application/use-cases/useMarkContactRead';
import { useUpdateContactStatus } from '../../application/use-cases/useUpdateContactStatus';
import { useArchiveContact } from '../../application/use-cases/useArchiveContact';
import { useDeleteContact } from '../../application/use-cases/useDeleteContact';
import type { ContactEntity } from '../../domain/entities/contact.entity';
import { ContactStatus } from '../../domain/enums/contact-status.enum';
import { ContactStatusBadge } from './ContactStatusBadge';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Drawer } from '@/shared/ui/drawer';
import {
  Search,
  Mail,
  Phone,
  Eye,
  CheckCircle,
  Archive,
  Trash2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Reply,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Inquiries' },
  { id: ContactStatus.PENDING, label: 'Unread / Pending' },
  { id: ContactStatus.READ, label: 'Read' },
  { id: ContactStatus.REPLIED, label: 'Replied' },
  { id: ContactStatus.ARCHIVED, label: 'Archived' },
];

export function ContactTable() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContact, setSelectedContact] = useState<ContactEntity | null>(null);

  const markRead = useMarkContactRead();
  const updateStatus = useUpdateContactStatus();
  const archiveContact = useArchiveContact();
  const deleteContact = useDeleteContact();

  const { data, isLoading } = useContacts({
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 15,
  });

  const messages = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const handleInspect = async (item: ContactEntity) => {
    setSelectedContact(item);
    if (item.id && item.status === ContactStatus.PENDING) {
      await markRead.mutateAsync(item.id);
    }
  };

  const handleMarkReplied = async (id?: string) => {
    if (!id) return;
    await updateStatus.mutateAsync({ id, status: ContactStatus.REPLIED });
    if (selectedContact?.id === id) {
      setSelectedContact((prev) => prev ? { ...prev, status: ContactStatus.REPLIED } as ContactEntity : null);
    }
  };

  const handleArchive = async (id?: string) => {
    if (!id) return;
    await archiveContact.mutateAsync(id);
    if (selectedContact?.id === id) {
      setSelectedContact((prev) => prev ? { ...prev, status: ContactStatus.ARCHIVED } as ContactEntity : null);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteContact.mutateAsync(id);
      if (selectedContact?.id === id) {
        setSelectedContact(null);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Tabs & Search */}
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
            placeholder="Search sender, email, subject..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Main Inbox Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Sender</th>
                <th className="py-3 px-4">Topic</th>
                <th className="py-3 px-4">Subject & Message</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Loading inquiries...
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      No contact messages found.
                    </p>
                  </td>
                </tr>
              ) : (
                messages.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => handleInspect(item)}
                  >
                    {/* Sender */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">{item.email}</div>
                    </td>

                    {/* Topic */}
                    <td className="py-3.5 px-4">
                      <Badge variant="neutral" size="sm" className="capitalize">
                        {item.type}
                      </Badge>
                    </td>

                    {/* Subject & Preview */}
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                        {item.subject}
                      </div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.message}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <ContactStatusBadge status={item.status} />
                    </td>

                    {/* Received */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleInspect(item)}
                          title="View message"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Button>

                        {item.status !== ContactStatus.REPLIED && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkReplied(item.id)}
                            title="Mark as Replied"
                            className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}

                        {item.status !== ContactStatus.ARCHIVED && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleArchive(item.id)}
                            title="Archive message"
                            className="h-8 w-8 p-0 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <Archive className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(item.id)}
                          title="Delete message"
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
            Showing {messages.length} of {total} messages
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

      {/* Inspect Message Drawer */}
      <Drawer
        isOpen={Boolean(selectedContact)}
        onClose={() => setSelectedContact(null)}
        title="Inquiry Message Details"
        size="md"
        footer={
          selectedContact ? (
            <div className="flex items-center justify-between w-full">
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                className="inline-flex"
              >
                <Button variant="primary" size="sm" leftIcon={<Reply className="w-4 h-4" />}>
                  Reply via Email
                </Button>
              </a>
              <div className="flex items-center gap-2">
                {selectedContact.status !== ContactStatus.REPLIED && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkReplied(selectedContact.id)}
                  >
                    Mark Replied
                  </Button>
                )}
                {selectedContact.status !== ContactStatus.ARCHIVED && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleArchive(selectedContact.id)}
                  >
                    Archive
                  </Button>
                )}
              </div>
            </div>
          ) : undefined
        }
      >
        {selectedContact && (
          <div className="space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedContact.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="neutral" size="sm" className="capitalize">
                    {selectedContact.type}
                  </Badge>
                  <ContactStatusBadge status={selectedContact.status} />
                </div>
              </div>
              <span className="text-xs text-slate-400">
                {selectedContact.createdAt ? new Date(selectedContact.createdAt).toLocaleString() : ''}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <Mail className="w-4 h-4 text-brand-600 shrink-0" />
                <a href={`mailto:${selectedContact.email}`} className="text-brand-600 hover:underline">
                  {selectedContact.email}
                </a>
              </div>
              {selectedContact.phone && (
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-brand-600 shrink-0" />
                  <a href={`tel:${selectedContact.phone}`} className="hover:underline">
                    {selectedContact.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Subject
              </h4>
              <p className="text-base font-bold text-slate-900 dark:text-white">
                {selectedContact.subject}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Message Body
              </h4>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedContact.message}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
