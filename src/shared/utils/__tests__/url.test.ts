import { describe, expect, it } from 'vitest';
import {
  buildQueryString,
  isExternalUrl,
  joinPaths,
  parseQueryString,
} from '../url';

describe('URL Utilities', () => {
  it('builds clean query string omitting null, undefined, or empty values', () => {
    const params = {
      page: 1,
      limit: 20,
      search: 'architecture',
      empty: '',
      skipped: undefined,
      nullVal: null,
    };
    expect(buildQueryString(params)).toBe('?page=1&limit=20&search=architecture');
    expect(buildQueryString({})).toBe('');
    expect(buildQueryString()).toBe('');
  });

  it('parses query string into key-value map', () => {
    expect(parseQueryString('?page=2&limit=50')).toEqual({
      page: '2',
      limit: '50',
    });
    expect(parseQueryString('')).toEqual({});
  });

  it('identifies external and internal URLs', () => {
    expect(isExternalUrl('https://google.com')).toBe(true);
    expect(isExternalUrl('http://kanzen.tech')).toBe(true);
    expect(isExternalUrl('/blog/post-1')).toBe(false);
    expect(isExternalUrl('blog/post-1')).toBe(false);
  });

  it('normalizes and joins path segments cleanly', () => {
    expect(joinPaths('api', 'v1', 'blog')).toBe('api/v1/blog');
    expect(joinPaths('/api/', '/v1/', '/blog/')).toBe('api/v1/blog');
  });
});
