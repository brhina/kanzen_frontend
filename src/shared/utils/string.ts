/**
 * Converts text to a clean URL-friendly slug.
 */
export function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Truncates text cleanly at a specific character limit with ellipsis.
 */
export function truncate(text: string, maxLength: number, ellipsis = '...'): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trim() + ellipsis;
}

/**
 * Capitalizes the first letter of a string.
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Converts a string to Title Case.
 */
export function toTitleCase(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Converts kebab-case or snake_case string into readable title (e.g., "case-studies" -> "Case Studies").
 */
export function kebabToTitle(text: string): string {
  if (!text) return '';
  return text
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(' ')
    .map(capitalize)
    .join(' ');
}

/**
 * Converts camelCase to kebab-case.
 */
export function camelToKebab(text: string): string {
  if (!text) return '';
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase();
}

/**
 * Extracts uppercase initials from full names (e.g., "John Doe" -> "JD").
 */
export function getInitials(name?: string | null, maxInitials = 2): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, maxInitials)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}
