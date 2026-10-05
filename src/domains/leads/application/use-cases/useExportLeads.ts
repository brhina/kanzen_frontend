import { useState } from 'react';
import { leadsApi } from '../../infrastructure/leads.api';

export function useExportLeads() {
  const [isExporting, setIsExporting] = useState(false);

  const exportCsv = async () => {
    try {
      setIsExporting(true);
      const blob = await leadsApi.exportCsv();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Failed to export leads CSV', err);
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return { exportCsv, isExporting };
}
