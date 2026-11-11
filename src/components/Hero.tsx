import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HERO_IMAGES } from "@/data/spots";

const SLIDE_INTERVAL_MS = 3000;

export default function Hero() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % HERO_IMAGES.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative flex h-screen min-h-[600px] items-center justify-center overflow-hidden">
      {HERO_IMAGES.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={t("hero.slideAlt")}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-background/10" />

      <div className="absolute left-1/2 top-24 z-10 flex -translate-x-1/2 gap-3">
        {HERO_IMAGES.map((image, index) => (
          <button
            key={image}
            type="button"
            aria-label={t("hero.showSlide", { n: index + 1 })}
            onClick={() => setActiveIndex(index)}
            className={`h-3.5 w-3.5 rounded-full border border-white/80 transition-smooth ${
              index === activeIndex ? "bg-white" : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="container relative z-10 text-center text-white animate-fade-up">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-white/90">
          {t("hero.eyebrow")}
        </p>
        <h1 className="text-5xl font-light leading-[1.05] md:text-7xl">
          {t("hero.titleLine1")}
          <br />
          {t("hero.titleLine2")}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/90 md:text-lg">
          {t("hero.subtitle")}
        </p>
        <a
          href="#reservations"
          className="mt-10 inline-block rounded-md bg-white/95 px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground transition-smooth hover:bg-white"
        >
          {t("hero.cta")}
        </a>
      </div>
    </section>
  );
}
