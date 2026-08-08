import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { housePhotos, type HousePhoto } from "@/data/house";

function PhotoCard({ photo, className }: { photo: HousePhoto; className: string }) {
  return (
    <>
      {photo.src ? (
        <img
          src={photo.src}
          alt={photo.alt}
          className={`h-full w-full object-cover transition-smooth ${className}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground">
          <Camera className="h-8 w-8" />
          <span className="text-xs uppercase tracking-wider">Add photo</span>
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm font-medium text-white">
        {photo.caption}
      </figcaption>
    </>
  );
}

function MobileGalleryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track) return;
      const slideWidth = track.clientWidth;
      if (slideWidth === 0) return;
      const index = Math.round(track.scrollLeft / slideWidth);
      setActiveIndex(index);
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(housePhotos.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative sm:hidden">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {housePhotos.map((photo) => (
          <figure
            key={photo.caption}
            className="relative h-72 w-full shrink-0 snap-center overflow-hidden rounded-lg bg-secondary shadow-soft"
          >
            <PhotoCard photo={photo} className="" />
          </figure>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label="Previous photo"
        className="absolute left-2 top-[calc(50%-1.25rem)] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(activeIndex + 1)}
        disabled={activeIndex === housePhotos.length - 1}
        aria-label="Next photo"
        className="absolute right-2 top-[calc(50%-1.25rem)] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        {housePhotos.map((photo, index) => (
          <button
            key={photo.caption}
            type="button"
            aria-label={`Show photo ${index + 1}`}
            onClick={() => goTo(index)}
            className={`h-2 w-2 rounded-full transition-smooth ${
              index === activeIndex ? "bg-primary" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

const CARDS_PER_PAGE = 3;

function DesktopGalleryCarousel({ onPhotoClick }: { onPhotoClick: (index: number) => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const pages: HousePhoto[][] = [];
  for (let i = 0; i < housePhotos.length; i += CARDS_PER_PAGE) {
    pages.push(housePhotos.slice(i, i + CARDS_PER_PAGE));
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    function onScroll() {
      if (!track) return;
      const pageWidth = track.clientWidth;
      if (pageWidth === 0) return;
      const index = Math.round(track.scrollLeft / pageWidth);
      setActivePage(index);
    }

    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(pages.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative hidden sm:block">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.map((page, pageIndex) => (
          <div key={pageIndex} className="grid w-full shrink-0 snap-center grid-cols-3 gap-6">
            {page.map((photo, itemIndex) => {
              const globalIndex = pageIndex * CARDS_PER_PAGE + itemIndex;
              return (
                <button
                  key={photo.caption}
                  type="button"
                  onClick={() => onPhotoClick(globalIndex)}
                  aria-label={`View ${photo.caption} full screen`}
                  className="group relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-lg bg-secondary shadow-soft transition-smooth hover:shadow-hover"
                >
                  <PhotoCard photo={photo} className="group-hover:scale-105" />
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {pages.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(activePage - 1)}
            disabled={activePage === 0}
            aria-label="Previous photos"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activePage + 1)}
            disabled={activePage === pages.length - 1}
            aria-label="Next photos"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show photos ${index * CARDS_PER_PAGE + 1} to ${
                  index * CARDS_PER_PAGE + pages[index].length
                }`}
                onClick={() => goTo(index)}
                className={`h-2 w-2 rounded-full transition-smooth ${
                  index === activePage ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function GalleryLightbox({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: HousePhoto[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNavigate(Math.max(0, index - 1));
      if (e.key === "ArrowRight") onNavigate(Math.min(photos.length - 1, index + 1));
    }
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [index, photos.length, onClose, onNavigate]);

  const photo = photos[index];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${photo.caption}`}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-smooth hover:bg-white/20"
      >
        <X className="h-6 w-6" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(index - 1);
        }}
        disabled={index === 0}
        aria-label="Previous photo"
        className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-smooth hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0 sm:left-6"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate(index + 1);
        }}
        disabled={index === photos.length - 1}
        aria-label="Next photo"
        className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-smooth hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0 sm:right-6"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        className="flex max-h-full max-w-full flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {photo.src ? (
          <img
            src={photo.src}
            alt={photo.alt}
            className="max-h-[80vh] max-w-full rounded-md object-contain"
          />
        ) : (
          <div className="flex h-[60vh] w-[80vw] max-w-xl flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-white/30 text-white/60">
            <Camera className="h-10 w-10" />
            <span className="text-xs uppercase tracking-wider">Add photo</span>
          </div>
        )}
        <p className="mt-4 text-sm font-medium text-white">{photo.caption}</p>
        <div className="mt-3 flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => onNavigate(i)}
              className={`h-2 w-2 rounded-full transition-smooth ${
                i === index ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function HouseGallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="bg-background py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <p className="eyebrow">The House</p>
          <h2 className="mt-3 text-4xl font-light md:text-5xl">Photo Gallery</h2>
          <p className="mt-4 text-muted-foreground">
            A closer look at the house we're renting out
          </p>
        </div>

        <MobileGalleryCarousel />
        <DesktopGalleryCarousel onPhotoClick={setLightboxIndex} />
      </div>

      {lightboxIndex !== null && (
        <GalleryLightbox
          photos={housePhotos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </section>
  );
}
