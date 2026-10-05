import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns';

/**
 * Formats a monetary number into a localized currency string.
 */
export function formatCurrency(
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string {
  if (isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formats a standard numeric value with comma separators.
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions,
  locale = 'en-US',
): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Formats a percentage value (e.g., 0.85 -> 85.0%).
 */
export function formatPercentage(value: number, decimals = 1): string {
  if (isNaN(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Formats a date into a clean human-readable date string.
 */
export function formatDate(
  dateInput: string | number | Date | null | undefined,
  pattern = 'MMM dd, yyyy',
): string {
  if (!dateInput) return '—';
  try {
    const date =
      typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(date)) return '—';
    return format(date, pattern);
  } catch {
    return '—';
  }
}

/**
 * Formats relative time (e.g., "5 minutes ago", "2 days ago").
 */
export function formatRelativeTime(
  dateInput: string | number | Date | null | undefined,
): string {
  if (!dateInput) return '—';
  try {
    const date =
      typeof dateInput === 'string' ? parseISO(dateInput) : new Date(dateInput);
    if (!isValid(date)) return '—';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return '—';
  }
}

/**
 * Formats raw byte sizes into human-readable strings (e.g., "2.4 MB").
 */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const unitIndex = Math.min(i, units.length - 1);
  const size = bytes / Math.pow(1024, unitIndex);
  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
