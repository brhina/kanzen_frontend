import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, KeyRound } from 'lucide-react';
import type { UserEntity } from '../../domain/entities/user.entity';
import { PERMISSION_MATRIX } from '@/core/auth/permissions.constants';
import { useCreateUser } from '../../application/use-cases/useCreateUser';
import { useUpdateUser } from '../../application/use-cases/useUpdateUser';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';

const userFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().optional(),
  phone: z.string().optional(),
  isAdmin: z.boolean(),
  status: z.enum(['active', 'inactive', 'suspended']),
  permissions: z.array(z.string()),
});

export type UserFormData = z.infer<typeof userFormSchema>;

export interface UserFormProps {
  user?: UserEntity | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Group permissions by resource prefix
const PERMISSION_GROUPS = PERMISSION_MATRIX.reduce(
  (acc, perm) => {
    const [group] = perm.split(':');
    if (!acc[group]) acc[group] = [];
    acc[group].push(perm);
    return acc;
  },
  {} as Record<string, string[]>,
);

export function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const isEditing = Boolean(user);
  const { mutate: createUser, isPending: isCreating } = useCreateUser({ onSuccess });
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser({ onSuccess });
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      password: '',
      phone: user?.phone || '',
      isAdmin: user?.isAdmin || false,
      status: (user?.status as 'active' | 'inactive' | 'suspended') || 'active',
      permissions: user?.permissions || [],
    },
  });

  const selectedPermissions = useWatch({ control, name: 'permissions' }) || [];
  const isAdmin = useWatch({ control, name: 'isAdmin' });
  const status = useWatch({ control, name: 'status' });

  const handlePermissionToggle = (perm: string, checked: boolean) => {
    if (checked) {
      setValue('permissions', [...selectedPermissions, perm]);
    } else {
      setValue(
        'permissions',
        selectedPermissions.filter((p) => p !== perm),
      );
    }
  };

  const handleSelectAllGroup = (groupPerms: string[], select: boolean) => {
    if (select) {
      const merged = Array.from(new Set([...selectedPermissions, ...groupPerms]));
      setValue('permissions', merged);
    } else {
      setValue(
        'permissions',
        selectedPermissions.filter((p) => !groupPerms.includes(p)),
      );
    }
  };

  const onSubmit = (data: UserFormData) => {
    if (isEditing && user) {
      updateUser({
        id: user.id,
        dto: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || undefined,
          isAdmin: data.isAdmin,
          status: data.status,
          permissions: data.permissions,
          ...(data.password ? { password: data.password } : {}),
        },
      });
    } else {
      if (!data.password) {
        return; // Password required for creation
      }
      createUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        isAdmin: data.isAdmin,
        status: data.status,
        permissions: data.permissions,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {/* Basic Profile Details */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Account Information
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              First Name
            </label>
            <Input
              placeholder="First name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Last Name
            </label>
            <Input
              placeholder="Last name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="email@kanzen.tech"
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Phone (Optional)
            </label>
            <Input
              placeholder="+1 (555) 000-0000"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {isEditing ? 'New Password (leave empty to keep current)' : 'Initial Password'}
          </label>
          <Input
            type="password"
            placeholder={isEditing ? '••••••••••••' : 'Min. 8 characters'}
            error={errors.password?.message}
            {...register('password')}
            leftIcon={<KeyRound className="h-4 w-4 text-slate-400" />}
          />
        </div>
      </div>

      {/* Role & Status */}
      <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Governance & Permissions
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Account Status
            </label>
            <Select
              options={[
                { value: 'active', label: 'Active (Permitted)' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'suspended', label: 'Suspended (Revoked)' },
              ]}
              value={status}
              onChange={(e) =>
                setValue('status', e.target.value as 'active' | 'inactive' | 'suspended')
              }
            />
          </div>

          <div className="pt-5">
            <Checkbox
              label="Super Administrator (Bypass all checks)"
              checked={isAdmin}
              onChange={(e) => setValue('isAdmin', e.target.checked)}
            />
          </div>
        </div>

        {isAdmin ? (
          <div className="rounded-xl border border-brand-500/20 bg-brand-50/50 p-4 dark:border-brand-500/30 dark:bg-brand-950/20 text-xs text-brand-800 dark:text-brand-300 flex items-center gap-3">
            <Shield className="h-5 w-5 shrink-0 text-brand-500" />
            <p>
              Super Administrators bypass all granular RBAC gates and possess full administrative authority over the system.
            </p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Granular Capability Matrix ({selectedPermissions.length} selected)
              </span>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 border border-slate-200 dark:border-slate-800 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/50">
              {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => {
                const allInGroup = perms.every((p) => selectedPermissions.includes(p));
                return (
                  <div key={group} className="space-y-2 border-b border-slate-200/60 dark:border-slate-800/60 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                        {group}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSelectAllGroup(perms, !allInGroup)}
                        className="text-[11px] font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400"
                      >
                        {allInGroup ? 'Clear Group' : 'Select All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map((perm) => (
                        <Checkbox
                          key={perm}
                          label={perm}
                          checked={selectedPermissions.includes(perm)}
                          onChange={(e) => handlePermissionToggle(perm, e.target.checked)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isPending}>
          <span>{isEditing ? 'Save Changes' : 'Create User'}</span>
        </Button>
      </div>
    </form>
  );
}

export default UserForm;
