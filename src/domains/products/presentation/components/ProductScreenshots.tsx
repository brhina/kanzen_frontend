import { useState } from 'react';
import { Eye, Image as ImageIcon } from 'lucide-react';
import { Modal } from '@/shared/ui/modal';

export interface ProductScreenshotsProps {
  screenshots: string[];
  productName: string;
}

export function ProductScreenshots({ screenshots, productName }: ProductScreenshotsProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  if (screenshots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-xs text-slate-400">
        <ImageIcon className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
        <span>Product screenshots coming soon</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Thumbnails grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {screenshots.map((src, index) => (
          <div
            key={index}
            onClick={() => setActiveImage(src)}
            className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-900 aspect-16/10 shadow-xs hover:shadow-md transition"
          >
            <img
              src={src}
              alt={`${productName} screenshot ${index + 1}`}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-900 shadow-md">
                <Eye className="h-3.5 w-3.5" />
                <span>Zoom</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={Boolean(activeImage)}
        onClose={() => setActiveImage(null)}
        title={`${productName} Screenshot Preview`}
        size="lg"
      >
        {activeImage && (
          <div className="overflow-hidden rounded-lg">
            <img
              src={activeImage}
              alt={productName}
              className="w-full max-h-[80vh] object-contain mx-auto"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default ProductScreenshots;
