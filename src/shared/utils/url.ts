/**
 * Builds a clean URL query string from an arbitrary parameters object,
 * omitting undefined, null, or empty string values.
 */
export function buildQueryString(params?: Record<string, unknown>): string {
  if (!params) return '';
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') {
      continue;
    }
    if (Array.isArray(value)) {
      for (const item of value) {
        if (item !== undefined && item !== null) {
          searchParams.append(key, String(item));
        }
      }
    } else {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

/**
 * Parses URL search string into a simple key-value dictionary.
 */
export function parseQueryString(search: string): Record<string, string> {
  if (!search) return {};
  const query = search.startsWith('?') ? search.slice(1) : search;
  const searchParams = new URLSearchParams(query);
  const result: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

/**
 * Tests whether a URL points to an external site.
 */
export function isExternalUrl(url: string): boolean {
  if (!url) return false;
  return /^(https?:)?\/\//.test(url);
}

/**
 * Normalizes and joins multiple path segments into a clean path string.
 */
export function joinPaths(...paths: string[]): string {
  return paths
    .map((p) => p.replace(/^\/+|\/+$/g, ''))
    .filter(Boolean)
    .join('/');
}
