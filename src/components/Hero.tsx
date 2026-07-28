import { useEffect, useState } from "react";
import { HERO_IMAGES } from "@/data/spots";

const SLIDE_INTERVAL_MS = 3000;

export default function Hero() {
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
          alt="Boardwalk through coastal dunes at sunset"
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
            aria-label={`Show slide ${index + 1}`}
            onClick={() => setActiveIndex(index)}
            className={`h-3.5 w-3.5 rounded-full border border-white/80 transition-smooth ${
              index === activeIndex ? "bg-white" : "bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      <div className="container relative z-10 text-center text-white animate-fade-up">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-white/90">
          Off-grid escapes · Portugal's northern coast
        </p>
        <h1 className="text-5xl font-light leading-[1.05] md:text-7xl">
          Between Pines
          <br />
          and the Sea
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-white/90 md:text-lg">
          Boardwalks, dunes and wild Atlantic beaches. Disconnect between the
          maritime pine forest and the ocean.
        </p>
        <a
          href="#reservations"
          className="mt-10 inline-block rounded-md bg-white/95 px-8 py-3 text-sm font-medium uppercase tracking-[0.15em] text-foreground transition-smooth hover:bg-white"
        >
          Book Now
        </a>
      </div>
    </section>
  );
}
