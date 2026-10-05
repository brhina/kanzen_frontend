import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { toast } from '@/shared/ui/toast/toast.store';

export interface CaseStudyDownloadProps {
  pdfUrl?: string;
  title: string;
  variant?: 'button' | 'banner';
}

export function CaseStudyDownload({
  pdfUrl,
  title,
  variant = 'button',
}: CaseStudyDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = () => {
    if (!pdfUrl) {
      toast.info('Direct PDF download is currently being compiled for this enterprise study.', 'PDF Document');
      return;
    }

    setIsDownloading(true);
    // Simulate slight download trigger for responsive feel
    setTimeout(() => {
      window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      setIsDownloading(false);
      toast.success(`Whitepaper for "${title}" download initiated.`, 'Download Started');
    }, 600);
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        isLoading={isDownloading}
        className="flex items-center gap-1.5 text-xs"
      >
        <Download className="h-3.5 w-3.5" />
        <span>Download PDF</span>
      </Button>
    );
  }

  return (
    <div className="rounded-2xl bg-gradient-to-r from-primary-900 to-indigo-950 text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-300">
          <FileText className="h-4 w-4" />
          <span>Complete Technical Whitepaper</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Download Enterprise Architecture Report
        </h3>
        <p className="text-sm text-slate-300 max-w-xl">
          Get the complete breakdown including telemetry graphs, database schemas, and performance benchmarks for this deployment.
        </p>
      </div>

      <div className="flex-shrink-0">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleDownload}
          isLoading={isDownloading}
          className="flex items-center gap-2 shadow-lg"
        >
          {isDownloading ? (
            <span>Generating PDF...</span>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download Full Case Study</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
