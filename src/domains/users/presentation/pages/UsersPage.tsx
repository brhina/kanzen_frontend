import { useState } from 'react';
import {
  Users as UsersIcon,
  Plus,
  Search,
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
import { Input } from '@/shared/ui/input';
import { Tabs } from '@/shared/ui/tabs';
import { Spinner } from '@/shared/ui/spinner';
import { UserCard } from '../components/UserCard';
import { UserTable } from '../components/UserTable';
import { UserForm } from '../components/UserForm';

export function UsersPage() {
  const { viewMode, setViewMode } = useUIStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filterParams = {
    search: search.trim() || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
  };

  const { data, isLoading } = useUsers(filterParams);
  const users = data?.users || [];

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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Team Directory & Governance
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Senior leadership, distributed systems architects, and engineering personnel.
          </p>
        </div>

        {/* Inline Create User Trigger (Guarded by users:write) */}
        <PermissionGate permission="users:write">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 shadow-md shadow-brand-500/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add Team Member</span>
          </Button>
        </PermissionGate>
      </div>

      {/* Inline Administrative Management Toolbar (Guarded by users:read) */}
      <PermissionGate permission="users:read">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="w-full sm:w-64">
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                leftIcon={<Search className="h-4 w-4 text-slate-400" />}
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center">
              <Tabs
                tabs={[
                  { id: 'all', label: 'All' },
                  { id: 'active', label: 'Active' },
                  { id: 'inactive', label: 'Inactive' },
                  { id: 'suspended', label: 'Suspended' },
                ]}
                activeTab={statusFilter}
                onChange={setStatusFilter}
              />
            </div>
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center justify-end gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
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
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
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
        </div>
      </PermissionGate>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Spinner size="lg" aria-label="Loading team directory..." />
        </div>
      ) : users.length === 0 ? (
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
          users={users}
          onEditUser={handleOpenEdit}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
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
