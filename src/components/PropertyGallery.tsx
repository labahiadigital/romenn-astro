import { useState, useEffect, useCallback, useRef } from "react";

interface Photo {
  url: string;
  thumbnail_url: string | null;
  is_main: boolean;
  caption: string | null;
  position: number;
}

interface Props {
  photos: Photo[];
  title: string;
}

export default function PropertyGallery({ photos, title }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const thumbnailRef = useRef<HTMLDivElement>(null);

  const mainPhoto = photos.find((ph) => ph.is_main) || photos[0];
  const mainIndex = photos.indexOf(mainPhoto);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    setImgLoaded(false);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex(((index % photos.length) + photos.length) % photos.length);
      setImgLoaded(false);
    },
    [photos.length]
  );

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxOpen, closeLightbox, goPrev, goNext]);

  useEffect(() => {
    if (lightboxOpen && thumbnailRef.current) {
      const active = thumbnailRef.current.querySelector(`[data-idx="${currentIndex}"]`);
      active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [currentIndex, lightboxOpen]);

  const minSwipe = 50;
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (Math.abs(dist) >= minSwipe) {
      dist > 0 ? goNext() : goPrev();
    }
  };

  if (photos.length === 0) {
    return (
      <div className="h-[40vh] flex items-center justify-center bg-slate-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-400">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
      </div>
    );
  }

  const galleryPhotos = photos.filter((_, i) => i !== mainIndex);

  return (
    <>
      {/* Hero grid */}
      <div className="max-w-7xl mx-auto">
        <div
          className={`grid gap-1 max-h-[70vh] overflow-hidden cursor-pointer ${
            photos.length === 1
              ? "grid-cols-1"
              : photos.length <= 3
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 md:grid-cols-4 md:grid-rows-2"
          }`}
        >
          {/* Main photo */}
          <div
            className={`relative ${photos.length >= 4 ? "md:col-span-2 md:row-span-2" : ""}`}
            onClick={() => openLightbox(mainIndex)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && openLightbox(mainIndex)}
          >
            <img
              src={mainPhoto.url}
              alt={title}
              className="w-full h-full object-cover min-h-[300px] md:min-h-[500px] hover:brightness-95 transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
            {photos.length > 1 && (
              <button
                className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-slate-900 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 hover:bg-white transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  openLightbox(0);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                Ver {photos.length} fotos
              </button>
            )}
          </div>

          {/* Side photos */}
          {galleryPhotos.slice(0, 4).map((ph, i) => {
            const realIndex = photos.indexOf(ph);
            const isLast = i === 3 && galleryPhotos.length > 4;
            return (
              <div
                key={ph.url}
                className="hidden md:block relative overflow-hidden cursor-pointer"
                onClick={() => openLightbox(realIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && openLightbox(realIndex)}
              >
                <img
                  src={ph.url}
                  alt={ph.caption || `Foto ${i + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {isLast && (
                  <div className="absolute inset-0 bg-black/50 hover:bg-black/40 transition-colors flex items-center justify-center">
                    <span className="text-white text-2xl font-serif">+{galleryPhotos.length - 3} fotos</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex flex-col"
          role="dialog"
          aria-label="Galería de fotos"
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 text-white/80 shrink-0">
            <span className="text-sm font-medium">
              {currentIndex + 1} / {photos.length}
            </span>
            <button
              onClick={closeLightbox}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cerrar galería"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Main image area */}
          <div
            className="flex-1 relative flex items-center justify-center min-h-0 select-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Prev button */}
            {photos.length > 1 && (
              <button
                onClick={goPrev}
                className="absolute left-2 md:left-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors"
                aria-label="Foto anterior"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
            )}

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center px-16 py-2">
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <img
                key={photos[currentIndex].url}
                src={photos[currentIndex].url}
                alt={photos[currentIndex].caption || `Foto ${currentIndex + 1}`}
                className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
                draggable={false}
              />
            </div>

            {/* Next button */}
            {photos.length > 1 && (
              <button
                onClick={goNext}
                className="absolute right-2 md:right-6 z-10 w-12 h-12 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/60 text-white transition-colors"
                aria-label="Foto siguiente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            )}
          </div>

          {/* Thumbnail strip */}
          {photos.length > 1 && (
            <div ref={thumbnailRef} className="shrink-0 py-3 px-4 overflow-x-auto flex gap-2 justify-center scrollbar-hide">
              {photos.map((ph, i) => (
                <button
                  key={ph.url}
                  data-idx={i}
                  onClick={() => goTo(i)}
                  className={`shrink-0 w-16 h-12 md:w-20 md:h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                    i === currentIndex
                      ? "ring-2 ring-white opacity-100 scale-105"
                      : "opacity-50 hover:opacity-80"
                  }`}
                >
                  <img
                    src={ph.thumbnail_url || ph.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
