import { HERO_IMAGE } from "@/data/spots";

export default function Hero() {
  return (
    <section className="relative flex h-screen min-h-[600px] items-center justify-center overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="Boardwalk through coastal dunes at sunset"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 bg-background/10" />

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
