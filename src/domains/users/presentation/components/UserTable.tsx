import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { Edit2, Trash2, Shield, Eye, MoreHorizontal, UserCheck, UserX } from 'lucide-react';
import type { UserEntity } from '../../domain/entities/user.entity';
import { Table, type ColumnDef } from '@/shared/ui/table';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { Dropdown, type DropdownItem } from '@/shared/ui/dropdown';
import { UserStatusBadge } from './UserStatusBadge';
import { useDeleteUser } from '../../application/use-cases/useDeleteUser';
import { useUpdateUser } from '../../application/use-cases/useUpdateUser';

export interface UserTableProps {
  users: UserEntity[];
  isLoading?: boolean;
  onEditUser: (user: UserEntity) => void;
  className?: string;
}

export function UserTable({
  users,
  isLoading = false,
  onEditUser,
  className = '',
}: UserTableProps) {
  const [userToDelete, setUserToDelete] = useState<UserEntity | null>(null);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser({
    onSuccess: () => setUserToDelete(null),
  });
  const { mutate: updateUser } = useUpdateUser();

  const handleToggleStatus = useCallback(
    (user: UserEntity) => {
      const nextStatus = user.status === 'active' ? 'suspended' : 'active';
      updateUser({
        id: user.id,
        dto: { status: nextStatus },
      });
    },
    [updateUser],
  );

  const columns = useMemo<ColumnDef<UserEntity, any>[]>(
    () => [
      {
        id: 'user',
        header: 'User',
        cell: ({ row }: { row: { original: UserEntity } }) => {
          const user = row.original;
          return (
            <div className="flex items-center gap-3">
              <Avatar
                name={user.fullName || user.email}
                src={user.avatar}
                size="sm"
              />
              <div className="flex flex-col min-w-0">
                <Link
                  to={`/users/${user.id}`}
                  className="font-bold text-slate-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors truncate"
                >
                  {user.fullName}
                </Link>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user.email}
                </span>
              </div>
            </div>
          );
        },
      },
      {
        id: 'role',
        header: 'Role',
        cell: ({ row }: { row: { original: UserEntity } }) => {
          const user = row.original;
          return user.isAdmin ? (
            <Badge variant="brand" size="sm" className="font-mono text-[10px]">
              <Shield className="h-3 w-3 mr-1 text-brand-500" />
              <span>Super Admin</span>
            </Badge>
          ) : (
            <Badge variant="neutral" size="sm" className="text-[10px]">
              Team Member
            </Badge>
          );
        },
      },
      {
        id: 'status',
        header: 'Status',
        cell: ({ row }: { row: { original: UserEntity } }) => (
          <UserStatusBadge status={row.original.status} size="sm" />
        ),
      },
      {
        id: 'permissions',
        header: 'Capabilities',
        cell: ({ row }: { row: { original: UserEntity } }) => {
          const user = row.original;
          if (user.isAdmin) {
            return (
              <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                Full System (Bypass)
              </span>
            );
          }
          return (
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
              {user.permissions.length} granular
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: { original: UserEntity } }) => {
          const user = row.original;

          const actionItems: DropdownItem[] = [
            {
              id: 'edit',
              label: 'Edit Profile & Permissions',
              icon: <Edit2 className="h-4 w-4" />,
              onClick: () => onEditUser(user),
            },
            {
              id: 'status-toggle',
              label: user.status === 'active' ? 'Suspend Account' : 'Activate Account',
              icon: user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />,
              onClick: () => handleToggleStatus(user),
            },
            {
              id: 'view',
              label: 'View Detailed Profile',
              icon: <Eye className="h-4 w-4" />,
              onClick: () => {},
            },
            {
              divider: true,
              label: '',
            },
            {
              id: 'delete',
              label: 'Delete User Account',
              icon: <Trash2 className="h-4 w-4 text-rose-500" />,
              destructive: true,
              onClick: () => setUserToDelete(user),
            },
          ];

          return (
            <div className="flex items-center justify-end gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditUser(user)}
                title="Edit User"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </Button>

              <Dropdown
                trigger={
                  <button
                    type="button"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label="More user options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                }
                items={actionItems}
                align="right"
              />
            </div>
          );
        },
      },
    ],
    [onEditUser, handleToggleStatus],
  );

  return (
    <div className={className}>
      <Table<UserEntity>
        data={users}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No team members found matching current query"
      />

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <Modal
          isOpen={Boolean(userToDelete)}
          onClose={() => setUserToDelete(null)}
          title="Confirm User Deletion"
          footer={
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUserToDelete(null)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                isLoading={isDeleting}
                onClick={() => userToDelete && deleteUser(userToDelete.id)}
              >
                Delete Account
              </Button>
            </div>
          }
        >
          <div className="space-y-3 py-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              Are you sure you want to permanently delete{' '}
              <strong className="text-slate-900 dark:text-white">
                {userToDelete.fullName} ({userToDelete.email})
              </strong>
              ?
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400">
              This action cannot be undone. All active sessions and credentials will be revoked immediately.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default UserTable;
