import { Camera } from "lucide-react";
import { housePhotos } from "@/data/house";

export default function HouseGallery() {
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {housePhotos.map((photo) => (
            <figure
              key={photo.caption}
              className="group relative h-64 overflow-hidden rounded-lg bg-secondary shadow-soft transition-smooth hover:shadow-hover"
            >
              {photo.src ? (
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="h-full w-full object-cover transition-smooth group-hover:scale-105"
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
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
