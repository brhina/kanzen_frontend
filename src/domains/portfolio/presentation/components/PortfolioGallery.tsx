import { useState } from 'react';
import { X, Play, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export interface PortfolioGalleryProps {
  coverImage: string;
  images?: string[];
  videoUrl?: string;
  title: string;
}

export function PortfolioGallery({
  coverImage,
  images = [],
  videoUrl,
  title,
}: PortfolioGalleryProps) {
  const allMedia = [coverImage, ...images.filter((img) => img !== coverImage)];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allMedia.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < allMedia.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-4">
      {/* Featured Main Image Preview */}
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-lg group">
        <img
          src={allMedia[selectedIndex] || coverImage}
          alt={`${title} Preview ${selectedIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Action Controls */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {videoUrl && (
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Watch Video</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs backdrop-blur shadow-md transition-colors cursor-pointer"
            title="Expand Fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation arrows for main image if multiple */}
        {allMedia.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      {allMedia.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {allMedia.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? 'border-primary-500 ring-2 ring-primary-500/30'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <img
            src={allMedia[selectedIndex]}
            alt={`${title} Lightbox ${selectedIndex + 1}`}
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-6 text-sm text-white/80 font-mono">
            {selectedIndex + 1} / {allMedia.length}
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {isVideoModalOpen && videoUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
            <button
              type="button"
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={videoUrl.replace('watch?v=', 'embed/')}
              title={`${title} Video Showcase`}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
