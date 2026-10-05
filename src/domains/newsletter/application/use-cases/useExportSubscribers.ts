import { useState } from 'react';
import { newsletterApi } from '../../infrastructure/newsletter.api';

export function useExportSubscribers() {
  const [isExporting, setIsExporting] = useState(false);

  const exportCsv = async () => {
    try {
      setIsExporting(true);
      const blob = await newsletterApi.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export newsletter subscribers', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportCsv, isExporting };
}
