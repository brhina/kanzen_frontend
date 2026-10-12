import { describe, it, expect } from 'vitest';
import { EmailVO } from '../value-objects/email.vo';

describe('EmailVO', () => {
  it('creates valid email VO and normalizes casing', () => {
    const email = new EmailVO('Engineer@Veyroo.Tech');
    expect(email.getValue()).toBe('engineer@veyroo.tech');
  });

  it('throws for invalid email formats', () => {
    expect(() => new EmailVO('invalid-email')).toThrow();
    expect(() => new EmailVO('@domain.com')).toThrow();
    expect(() => new EmailVO('')).toThrow();
  });

  it('compares equality correctly', () => {
    const a = new EmailVO('test@veyroo.tech');
    const b = new EmailVO('TEST@veyroo.tech');
    const c = new EmailVO('other@veyroo.tech');

    expect(a.equals(b)).toBe(true);
    expect(a.equals(c)).toBe(false);
  });
});
