import { describe, expect, it } from 'vitest';
import {
  isValidPermission,
  PERMISSION_MATRIX,
  PERMISSIONS,
} from '../permissions.constants';

describe('Permissions Constants Matrix', () => {
  it('contains expected domain permission keys', () => {
    expect(PERMISSION_MATRIX).toContain('users:read');
    expect(PERMISSION_MATRIX).toContain('users:write');
    expect(PERMISSION_MATRIX).toContain('blog:publish');
    expect(PERMISSION_MATRIX).toContain('leads:convert');
    expect(PERMISSION_MATRIX).toContain('consultations:confirm');
    expect(PERMISSION_MATRIX).toContain('testimonials:approve');
  });

  it('validates canonical permission matrix items with isValidPermission', () => {
    expect(isValidPermission('users:read')).toBe(true);
    expect(isValidPermission(PERMISSIONS.SERVICES_WRITE)).toBe(true);
    expect(isValidPermission(PERMISSIONS.AUDIT_READ)).toBe(true);

    expect(isValidPermission('unknown:permission')).toBe(false);
    expect(isValidPermission('')).toBe(false);
  });
});
