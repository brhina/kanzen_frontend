import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatFileSize,
  formatNumber,
  formatPercentage,
  formatRelativeTime,
} from '../format';

describe('Format Utilities', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1250)).toBe('$1,250.00');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(NaN)).toBe('$0.00');
  });

  it('formats numbers correctly', () => {
    expect(formatNumber(1000000)).toBe('1,000,000');
    expect(formatNumber(0)).toBe('0');
  });

  it('formats percentages correctly', () => {
    expect(formatPercentage(0.755, 1)).toBe('75.5%');
    expect(formatPercentage(1)).toBe('100.0%');
  });

  it('formats dates and relative time', () => {
    const isoDate = '2026-01-15T12:00:00.000Z';
    expect(formatDate(isoDate, 'yyyy-MM-dd')).toBe('2026-01-15');
    expect(formatDate(null)).toBe('—');
    expect(formatRelativeTime(null)).toBe('—');
  });

  it('formats file sizes accurately', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    expect(formatFileSize(1024 * 1024 * 1024 * 1.8)).toBe('1.8 GB');
  });
});
