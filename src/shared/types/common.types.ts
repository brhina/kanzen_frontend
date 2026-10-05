import type { ReactNode } from 'react';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type ComponentVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info';

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

export type SortOrder = 'asc' | 'desc';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface Option<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: ReactNode;
  description?: string;
}

export type AsyncState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
};
