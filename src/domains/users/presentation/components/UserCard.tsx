import { Link } from 'react-router';
import { Mail, Shield } from 'lucide-react';
import type { UserEntity } from '../../domain/entities/user.entity';
import { Avatar } from '@/shared/ui/avatar';
import { Badge } from '@/shared/ui/badge';
import { UserStatusBadge } from './UserStatusBadge';

export interface UserCardProps {
  user: UserEntity;
  showAdminActions?: boolean;
  onEditClick?: (user: UserEntity) => void;
  className?: string;
}

export function UserCard({
  user,
  showAdminActions = false,
  onEditClick,
  className = '',
}: UserCardProps) {
  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/90 dark:hover:border-slate-700 ${className}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <Avatar
            name={user.fullName || user.email}
            src={user.avatar}
            size="lg"
            className="ring-2 ring-brand-500/10 group-hover:ring-brand-500/30 transition-all"
          />

          <div className="flex items-center gap-1.5 flex-wrap justify-end">
            {user.isAdmin && (
              <Badge variant="brand" size="sm" className="font-mono text-[10px]">
                <Shield className="h-3 w-3 mr-1 text-brand-500" />
                <span>Admin</span>
              </Badge>
            )}
            <UserStatusBadge status={user.status} size="sm" />
          </div>
        </div>

        <div className="mt-4 space-y-1">
          <Link
            to={`/users/${user.id}`}
            className="block text-base font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors"
          >
            {user.fullName}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{user.email}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 dark:text-slate-400">
          {user.isAdmin
            ? 'Full System Authority'
            : `${user.permissions.length} Assigned Capabilities`}
        </span>

        {showAdminActions && onEditClick ? (
          <button
            type="button"
            onClick={() => onEditClick(user)}
            className="font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 transition-colors cursor-pointer"
          >
            Configure
          </button>
        ) : (
          <Link
            to={`/users/${user.id}`}
            className="inline-flex items-center font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
          >
            <span>Profile</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default UserCard;
