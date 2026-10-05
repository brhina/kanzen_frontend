import { formatFileSize } from './format';

export { formatFileSize };

/**
 * Extracts file extension in lowercase without leading period.
 */
export function getFileExtension(filename: string): string {
  if (!filename) return '';
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot + 1).toLowerCase();
}

/**
 * Checks whether a filename or MIME type represents an image file.
 */
export function isImageFile(filenameOrMime: string): boolean {
  if (!filenameOrMime) return false;
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif'];
  const ext = getFileExtension(filenameOrMime);
  return filenameOrMime.startsWith('image/') || imageExtensions.includes(ext);
}

/**
 * Checks whether a file is a PDF document.
 */
export function isPdfFile(filenameOrMime: string): boolean {
  if (!filenameOrMime) return false;
  return filenameOrMime === 'application/pdf' || getFileExtension(filenameOrMime) === 'pdf';
}

/**
 * Triggers a browser download of a given Blob object.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
}
