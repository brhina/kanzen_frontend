import { useState, useMemo } from 'react';
import { useLeads } from '../../application/use-cases/useLeads';
import { useDeleteLead } from '../../application/use-cases/useDeleteLead';
import type { LeadEntity } from '../../domain/entities/lead.entity';
import { LeadStatus } from '../../domain/enums/lead-status.enum';
import { LeadStatusBadge } from './LeadStatusBadge';
import { LeadQualificationScore } from './LeadQualificationScore';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { Button } from '@/shared/ui/button';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';
import {
  Building2,
  Calendar,
  Eye,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-react';

const STATUS_TABS = [
  { id: 'all', label: 'All Leads' },
  { id: LeadStatus.NEW, label: 'New' },
  { id: LeadStatus.CONTACTED, label: 'Contacted' },
  { id: LeadStatus.QUALIFIED, label: 'Qualified' },
  { id: LeadStatus.CONVERTED, label: 'Converted' },
  { id: LeadStatus.DISQUALIFIED, label: 'Disqualified' },
];

export function LeadTable() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'score' | 'name'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<LeadEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const deleteLead = useDeleteLead();

  const { data, isLoading } = useLeads({
    status: selectedStatus === 'all' ? undefined : selectedStatus,
    search: searchTerm || undefined,
    page: currentPage,
    limit: 15,
  });

  const leads = data?.items || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedStatus !== 'all') count++;
    if (scoreFilter !== 'all') count++;
    if (sortBy !== 'newest') count++;
    return count;
  }, [selectedStatus, scoreFilter, sortBy]);

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
    if (selectedStatus !== 'all') {
      const tab = STATUS_TABS.find((t) => t.id === selectedStatus);
      chips.push({
        id: 'status',
        label: `Status: ${tab?.label || selectedStatus}`,
        onRemove: () => setSelectedStatus('all'),
      });
    }
    if (scoreFilter !== 'all') {
      chips.push({
        id: 'score',
        label: `Score: ${scoreFilter === 'high' ? '>75 High Priority' : '>40 Qualified'}`,
        onRemove: () => setScoreFilter('all'),
      });
    }
    if (sortBy !== 'newest') {
      chips.push({
        id: 'sort',
        label: `Sort: ${sortBy === 'score' ? 'Score High-to-Low' : 'Name A-Z'}`,
        onRemove: () => setSortBy('newest'),
      });
    }
    return chips;
  }, [searchTerm, selectedStatus, scoreFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setScoreFilter('all');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Filter and sort leads locally if scoreFilter or sortBy is applied
  const displayedLeads = useMemo(() => {
    let list = [...leads];
    if (scoreFilter === 'high') {
      list = list.filter((l) => (l.qualificationScore || 0) >= 75);
    } else if (scoreFilter === 'medium') {
      list = list.filter((l) => (l.qualificationScore || 0) >= 40);
    }
    if (sortBy === 'score') {
      list.sort((a, b) => (b.qualificationScore || 0) - (a.qualificationScore || 0));
    } else if (sortBy === 'name') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [leads, scoreFilter, sortBy]);

  const handleInspect = (lead: LeadEntity) => {
    setSelectedLead(lead);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Expandable Filter Bar */}
      <SearchFilterBar
        searchValue={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search leads by name, email, company..."
        isFilterExpanded={isFilterExpanded}
        onToggleFilter={() => setIsFilterExpanded((prev) => !prev)}
        activeFilterCount={activeFilterCount}
        activeChips={activeChips}
        onClearAllFilters={handleResetFilters}
        resultsSummary={
          <span className="text-xs text-slate-500 font-medium">
            Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{displayedLeads.length}</span> of {total} leads
          </span>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <FilterGroup label="Lead Status" count={selectedStatus !== 'all' ? 1 : undefined}>
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

          <FilterGroup label="Qualification Score" count={scoreFilter !== 'all' ? 1 : undefined}>
            <FilterSelect
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              options={[
                { value: 'all', label: 'All Scores' },
                { value: 'high', label: 'High Priority (75+)' },
                { value: 'medium', label: 'Qualified (40+)' },
              ]}
            />
          </FilterGroup>

          <FilterGroup label="Sort By" count={sortBy !== 'newest' ? 1 : undefined}>
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'score' | 'name')}
              options={[
                { value: 'newest', label: 'Newest Inquiries First' },
                { value: 'score', label: 'Highest Score First' },
                { value: 'name', label: 'Name (A to Z)' },
              ]}
            />
          </FilterGroup>
        </div>
      </SearchFilterBar>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Lead / Company</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Interest & Budget</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Received</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading CRM leads...
                  </td>
                </tr>
              ) : displayedLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 space-y-2">
                    <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="font-medium text-slate-700 dark:text-slate-300">No leads found in this view.</p>
                    <p className="text-xs text-slate-400">Incoming inquiries from prospective clients will appear here.</p>
                  </td>
                </tr>
              ) : (
                displayedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    onClick={() => handleInspect(lead)}
                  >
                    {/* Lead & Company */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-xs shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {lead.name}
                          </div>
                          {lead.company && (
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {lead.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 text-xs text-slate-600 dark:text-slate-400">
                      <div>{lead.email}</div>
                      {lead.phone && <div className="text-slate-400 mt-0.5">{lead.phone}</div>}
                    </td>

                    {/* Interest & Budget */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-xs text-slate-900 dark:text-white">
                        {lead.budget ? `$${lead.budget.toLocaleString()} ${lead.budgetCurrency}` : 'Undisclosed'}
                      </div>
                      <div className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">
                        {lead.serviceInterest.join(', ') || 'General'}
                      </div>
                    </td>

                    {/* Score */}
                    <td className="py-3.5 px-4">
                      <LeadQualificationScore score={lead.qualificationScore} />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <LeadStatusBadge status={lead.status} />
                    </td>

                    {/* Received Date */}
                    <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleInspect(lead)}
                          title="View lead details"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4 text-slate-500" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(lead.id)}
                          title="Delete lead"
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

        {/* Table Footer with Pagination */}
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {leads.length} of {total} leads
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

      {/* Slide-out Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedLead(null);
        }}
      />
    </div>
  );
}
