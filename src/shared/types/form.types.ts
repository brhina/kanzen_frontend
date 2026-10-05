import type { FieldError } from 'react-hook-form';

export interface FormFieldProps {
  label?: string;
  helperText?: string;
  error?: FieldError | string;
  required?: boolean;
  disabled?: boolean;
}

export type ValidationStatus = 'default' | 'valid' | 'invalid' | 'warning';
