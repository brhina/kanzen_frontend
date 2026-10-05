import { describe, expect, it } from 'vitest';
import { env } from '../env';

describe('Environment Configuration', () => {
  it('correctly loads and validates env constants', () => {
    expect(env.API_BASE_URL).toBeDefined();
    expect(env.API_BASE_URL.endsWith('/')).toBe(false);
    expect(['development', 'test', 'production']).toContain(env.APP_ENV);
  });
});
