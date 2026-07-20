import { Star } from "lucide-react";
import { spots } from "@/data/spots";

export default function FeaturedSpots() {
  return (
    <section id="locations" className="bg-background py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <p className="eyebrow">Our Locations</p>
          <h2 className="mt-3 text-4xl font-light md:text-5xl">Featured Spots</h2>
          <p className="mt-4 text-muted-foreground">
            Handpicked spots between the pine forest and the Atlantic
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {spots.map((spot) => (
            <article
              key={spot.name}
              className="group overflow-hidden rounded-lg bg-card shadow-soft transition-smooth hover:shadow-hover"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={spot.image}
                  alt={spot.name}
                  className="h-full w-full object-cover transition-smooth group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  {spot.rating}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-medium">{spot.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{spot.location}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {spot.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-secondary px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wider text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg font-medium">
                    ${spot.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /night
                    </span>
                  </span>
                  <a
                    href="#reservations"
                    className="text-sm font-medium text-primary transition-smooth hover:opacity-70"
                  >
                    View Details →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
