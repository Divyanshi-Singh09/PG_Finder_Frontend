import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageLightbox({ images = [], initialIndex = 0, isOpen, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImg = images[currentIndex]?.url || images[currentIndex] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';
  const currentCaption = images[currentIndex]?.caption || `Photo ${currentIndex + 1}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 font-sans select-none animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex items-center justify-between text-white p-2 border-b border-slate-800">
        <span className="text-xs font-extrabold tracking-wider">
          {currentIndex + 1} / {images.length} — {currentCaption}
        </span>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-full text-slate-300 hover:text-white transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image View */}
      <div className="relative flex-1 flex items-center justify-center p-4">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 p-3 rounded-full bg-slate-900/80 text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentImg}
          alt={currentCaption}
          className="max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 p-3 rounded-full bg-slate-900/80 text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      <div className="flex justify-center items-center gap-2 p-2 overflow-x-auto">
        {images.map((img, idx) => {
          const thumbUrl = img.url || img;
          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                idx === currentIndex ? 'border-blue-500 scale-110 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
            </button>
          );
        })}
      </div>

    </div>
  );
}
