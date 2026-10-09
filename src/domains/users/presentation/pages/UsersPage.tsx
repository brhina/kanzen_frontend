import { useState, useMemo } from 'react';
import {
  Users as UsersIcon,
  LayoutGrid,
  Table as TableIcon,
  Shield,
} from 'lucide-react';
import { useUsers } from '../../application/use-cases/useUsers';
import type { UserEntity } from '../../domain/entities/user.entity';
import { useUIStore } from '@/core/stores/ui.store';
import { PermissionGate } from '@/core/auth/guards/PermissionGate';
import { Drawer } from '@/shared/ui/drawer';
import { Button } from '@/shared/ui/button';
import { Spinner } from '@/shared/ui/spinner';
import {
  SearchFilterBar,
  FilterGroup,
  FilterPill,
  FilterSelect,
} from '@/shared/ui/filter';
import { UserCard } from '../components/UserCard';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';

const STATUS_TABS = [
  { id: 'all', label: 'All Users' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
  { id: 'suspended', label: 'Suspended' },
];

export function UsersPage() {
  const { viewMode, setViewMode } = useUIStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'standard'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'newest'>('name');
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filterParams = {
    search: search.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  };

  const { data, isLoading } = useUsers(filterParams);
  const users = data?.users || [];

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (statusFilter !== 'all') count++;
    if (roleFilter !== 'all') count++;
    if (sortBy !== 'name') count++;
    return count;
  }, [statusFilter, roleFilter, sortBy]);

  // Active filter chips
  const activeChips = useMemo(() => {
    const chips = [];
    if (search) {
      chips.push({
        id: 'search',
        label: `Search: "${search}"`,
        onRemove: () => setSearch(''),
      });
    }
    if (statusFilter !== 'all') {
      chips.push({
        id: 'status',
        label: `Status: ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}`,
        onRemove: () => setStatusFilter('all'),
      });
    }
    if (roleFilter !== 'all') {
      chips.push({
        id: 'role',
        label: `Role: ${roleFilter === 'admin' ? 'Admins only' : 'Standard members'}`,
        onRemove: () => setRoleFilter('all'),
      });
    }
    if (sortBy !== 'name') {
      chips.push({
        id: 'sort',
        label: 'Sort: Newest First',
        onRemove: () => setSortBy('name'),
      });
    }
    return chips;
  }, [search, statusFilter, roleFilter, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setRoleFilter('all');
    setSortBy('name');
  };

  const displayedUsers = useMemo(() => {
    let list = [...users];
    if (roleFilter === 'admin') {
      list = list.filter((u) => u.isAdmin);
    } else if (roleFilter === 'standard') {
      list = list.filter((u) => !u.isAdmin);
    }
    if (sortBy === 'name') {
      list.sort((a, b) => a.fullName.localeCompare(b.fullName));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      });
    }
    return list;
  }, [users, roleFilter, sortBy]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsDrawerOpen(true);
  };

  const handleOpenEdit = (user: UserEntity) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Team Directory & Governance
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Senior leadership, distributed systems architects, and engineering personnel.
        </p>
      </div>

      {/* Inline Administrative Management Toolbar (Guarded by users:read) */}
      <PermissionGate permission="users:read">
        <SearchFilterBar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search members by name or email..."
          isFilterExpanded={isFilterExpanded}
          onToggleFilter={() => setIsFilterExpanded((prev) => !prev)}
          activeFilterCount={activeFilterCount}
          activeChips={activeChips}
          onClearAllFilters={handleResetFilters}
          resultsSummary={
            <span className="text-xs text-slate-500 font-medium">
              Showing <span className="font-semibold text-slate-700 dark:text-slate-300">{displayedUsers.length}</span> team members
            </span>
          }
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                  title="Card Grid Showcase"
                >
                  <LayoutGrid className="h-4 w-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  aria-pressed={viewMode === 'table'}
                  className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    viewMode === 'table'
                      ? 'bg-slate-100 text-slate-900 dark:bg-slate-700 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                  title="Management Table"
                >
                  <TableIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Table</span>
                </button>
              </div>

              <PermissionGate permission="users:write">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleOpenCreate}
                  className="shrink-0"
                >
                  Add Team Member
                </Button>
              </PermissionGate>
            </div>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <FilterGroup label="Account Status" count={statusFilter !== 'all' ? 1 : undefined}>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_TABS.map((tab) => (
                  <FilterPill
                    key={tab.id}
                    label={tab.label}
                    isActive={statusFilter === tab.id}
                    onClick={() => setStatusFilter(tab.id)}
                  />
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Administrative Role" count={roleFilter !== 'all' ? 1 : undefined}>
              <FilterSelect
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'standard')}
                options={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'admin', label: 'Administrators Only' },
                  { value: 'standard', label: 'Standard Team Members' },
                ]}
              />
            </FilterGroup>

            <FilterGroup label="Sort Order" count={sortBy !== 'name' ? 1 : undefined}>
              <FilterSelect
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'newest')}
                options={[
                  { value: 'name', label: 'Full Name (A to Z)' },
                  { value: 'newest', label: 'Newest Registered First' },
                ]}
              />
            </FilterGroup>
          </div>
        </SearchFilterBar>
      </PermissionGate>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" aria-label="Loading team directory..." />
        </div>
      ) : displayedUsers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <UsersIcon className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No Members Found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            No personnel match the search query or active filter criteria.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        <UserTable
          users={displayedUsers}
          onEditUser={handleOpenEdit}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              showAdminActions={true}
              onEditClick={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Create / Edit User Drawer Sheet */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        size="lg"
        title={
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-brand-500" />
            <span>{selectedUser ? 'Configure User Account' : 'Invite Team Member'}</span>
          </div>
        }
        description={
          selectedUser
            ? `Editing permissions and profile for ${selectedUser.fullName}`
            : 'Register a new engineering team member and assign capability grants.'
        }
      >
        <UserForm
          user={selectedUser}
          onSuccess={handleDrawerClose}
          onCancel={handleDrawerClose}
        />
      </Drawer>
    </div>
  );
}

export default UsersPage;
export { UsersPage as Component };
