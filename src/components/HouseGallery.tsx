import { Camera, Check, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { houseAmenityKeys, housePhotos, type HousePhoto } from "@/data/house";

function PhotoCard({ photo, className }: { photo: HousePhoto; className: string }) {
  const { t } = useTranslation();
  const caption = t(`gallery.photos.${photo.key}`);
  return (
    <>
      {photo.src ? (
        <img
          src={photo.src}
          alt={t(`gallery.photoAlts.${photo.key}`)}
          className={`h-full w-full object-cover transition-smooth ${className}`}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border text-muted-foreground">
          <Camera className="h-8 w-8" />
          <span className="text-xs uppercase tracking-wider">{t("gallery.addPhoto")}</span>
        </div>
      )}
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3 text-sm font-medium text-white">
        {caption}
      </figcaption>
    </>
  );
}

function MobileGalleryCarousel({ onPhotoClick }: { onPhotoClick: (index: number) => void }) {
  const { t } = useTranslation();
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
        {housePhotos.map((photo, index) => (
          <button
            key={photo.key}
            type="button"
            onClick={() => onPhotoClick(index)}
            aria-label={t("gallery.viewFullScreen", { caption: t(`gallery.photos.${photo.key}`) })}
            className="relative h-72 w-full shrink-0 snap-center cursor-zoom-in overflow-hidden rounded-lg bg-secondary shadow-soft"
          >
            <PhotoCard photo={photo} className="" />
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => goTo(activeIndex - 1)}
        disabled={activeIndex === 0}
        aria-label={t("gallery.previousPhoto")}
        className="absolute left-2 top-[calc(50%-1.25rem)] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => goTo(activeIndex + 1)}
        disabled={activeIndex === housePhotos.length - 1}
        aria-label={t("gallery.nextPhoto")}
        className="absolute right-2 top-[calc(50%-1.25rem)] flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="mt-4 flex items-center justify-center gap-2">
        {housePhotos.map((photo, index) => (
          <button
            key={photo.key}
            type="button"
            aria-label={t("gallery.showPhoto", { n: index + 1 })}
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
  const { t } = useTranslation();
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
                  key={photo.key}
                  type="button"
                  onClick={() => onPhotoClick(globalIndex)}
                  aria-label={t("gallery.viewFullScreen", {
                    caption: t(`gallery.photos.${photo.key}`),
                  })}
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
            aria-label={t("gallery.previousPhotos")}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => goTo(activePage + 1)}
            disabled={activePage === pages.length - 1}
            aria-label={t("gallery.nextPhotos")}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-soft transition-smooth hover:bg-white disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="mt-6 flex items-center justify-center gap-2">
            {pages.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={t("gallery.showPhotosRange", {
                  from: index * CARDS_PER_PAGE + 1,
                  to: index * CARDS_PER_PAGE + pages[index].length,
                })}
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
  const { t } = useTranslation();

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
  const caption = t(`gallery.photos.${photo.key}`);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={caption}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("gallery.close")}
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
        aria-label={t("gallery.previousPhoto")}
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
        aria-label={t("gallery.nextPhoto")}
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
            alt={t(`gallery.photoAlts.${photo.key}`)}
            className="max-h-[80vh] max-w-full rounded-md object-contain"
          />
        ) : (
          <div className="flex h-[60vh] w-[80vw] max-w-xl flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-white/30 text-white/60">
            <Camera className="h-10 w-10" />
            <span className="text-xs uppercase tracking-wider">{t("gallery.addPhoto")}</span>
          </div>
        )}
        <p className="mt-4 text-sm font-medium text-white">{caption}</p>
        <div className="mt-3 flex items-center gap-2">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={t("gallery.showPhoto", { n: i + 1 })}
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
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="gallery" className="bg-background py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <p className="eyebrow">{t("gallery.eyebrow")}</p>
          <h2 className="mt-3 text-4xl font-light md:text-5xl">{t("gallery.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("gallery.subtitle")}</p>
        </div>

        <MobileGalleryCarousel onPhotoClick={setLightboxIndex} />
        <DesktopGalleryCarousel onPhotoClick={setLightboxIndex} />

        <div className="mx-auto mt-20 max-w-3xl">
          <div className="mb-10 text-center">
            <h3 className="text-2xl font-light md:text-3xl">{t("gallery.amenitiesTitle")}</h3>
            <p className="mt-2 text-muted-foreground">{t("gallery.amenitiesSubtitle")}</p>
          </div>

          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {houseAmenityKeys.map((key) => (
              <div key={key} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm text-foreground">{t(`gallery.amenities.${key}`)}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            {t("gallery.amenitiesFootnote")}
          </p>
        </div>
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
