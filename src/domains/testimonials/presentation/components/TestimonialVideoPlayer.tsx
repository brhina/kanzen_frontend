import { X } from 'lucide-react';

export interface TestimonialVideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  author: string;
  company?: string;
}

export function TestimonialVideoPlayer({
  isOpen,
  onClose,
  videoUrl,
  author,
  company,
}: TestimonialVideoPlayerProps) {
  if (!isOpen || !videoUrl) return null;

  const embedUrl = videoUrl.includes('watch?v=')
    ? videoUrl.replace('watch?v=', 'embed/')
    : videoUrl;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <iframe
          src={embedUrl}
          title={`Video testimonial by ${author}${company ? ` at ${company}` : ''}`}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
