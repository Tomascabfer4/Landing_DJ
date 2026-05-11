import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Lightbox({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') onPrev();
      else if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  if (index == null) return null;
  const img = images[index];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      className="fixed inset-0 z-[90] grid place-items-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <img
        src={img.src}
        alt={img.alt || ''}
        className="max-h-[90vh] max-w-[90vw] select-none"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-6 right-6 text-fg hover:text-cyan"
      >
        <X size={28} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous"
        className="absolute left-6 top-1/2 -translate-y-1/2 text-fg hover:text-cyan"
      >
        <ChevronLeft size={36} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next"
        className="absolute right-6 top-1/2 -translate-y-1/2 text-fg hover:text-cyan"
      >
        <ChevronRight size={36} />
      </button>
    </div>,
    document.body
  );
}
