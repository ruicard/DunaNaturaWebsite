import { Trees, WifiOff, Footprints, Sunset } from "lucide-react";

const features = [
  {
    icon: Trees,
    title: "Pine & Sea Air",
    text: "Fall asleep under maritime pines, wake to the sound of Atlantic waves",
  },
  {
    icon: WifiOff,
    title: "Digital Detox",
    text: "No wifi, no signal — just pines, dunes, and the ocean horizon",
  },
  {
    icon: Footprints,
    title: "Boardwalk to Beach",
    text: "Wooden trails through the dunes lead straight to wild Atlantic sand",
  },
  {
    icon: Sunset,
    title: "Ocean Sunsets",
    text: "Golden hour over the Atlantic, every single evening of your stay",
  },
];

export default function Experience() {
  return (
    <section className="bg-muted py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <p className="eyebrow">The Experience</p>
          <h2 className="mt-3 text-4xl font-light md:text-5xl">
            Simplicity Meets Comfort
          </h2>
          <p className="mt-4 text-muted-foreground">
            Embrace simplicity without sacrificing comfort
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                <f.icon className="h-6 w-6" strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 text-lg font-medium">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
