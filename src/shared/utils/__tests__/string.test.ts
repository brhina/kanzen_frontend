import { describe, expect, it } from 'vitest';
import {
  camelToKebab,
  capitalize,
  getInitials,
  kebabToTitle,
  slugify,
  toTitleCase,
  truncate,
} from '../string';

describe('String Utilities', () => {
  it('generates clean URL slugs', () => {
    expect(slugify('Hello World! Enterprise Architecture 2026')).toBe(
      'hello-world-enterprise-architecture-2026',
    );
    expect(slugify('  special---characters & symbols... ')).toBe(
      'special-characters-symbols',
    );
  });

  it('truncates strings cleanly', () => {
    expect(truncate('Super long text to be cut', 10)).toBe('Super long...');
    expect(truncate('Short', 10)).toBe('Short');
  });

  it('capitalizes and formats title cases', () => {
    expect(capitalize('react')).toBe('React');
    expect(toTitleCase('enterprise web architecture')).toBe(
      'Enterprise Web Architecture',
    );
    expect(kebabToTitle('case-studies')).toBe('Case Studies');
    expect(camelToKebab('caseStudies')).toBe('case-studies');
  });

  it('extracts avatar initials', () => {
    expect(getInitials('John Doe')).toBe('JD');
    expect(getInitials('Brie')).toBe('B');
    expect(getInitials('Jane Alice Doe', 2)).toBe('JA');
    expect(getInitials('')).toBe('');
  });
});
