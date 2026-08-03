import relaxIcon from "@/assets/008-relax.png";
import forestIcon from "@/assets/006-forest.png";
import vacationsIcon from "@/assets/002-vacations.png";
import bicycleIcon from "@/assets/001-bicycle.png";
import sunriseIcon from "@/assets/003-sunrise.png";
import kiteIcon from "@/assets/004-kite.png";
import poolIcon from "@/assets/005-swimming-pool.png";
import buggyIcon from "@/assets/007-dune-buggy.png";

const features = [
  {
    icon: relaxIcon,
    title: "Slow Down",
    text: "Forget time. Fall asleep between dunes and pines, wake to the sound of Atlantic waves.",
  },
  {
    icon: forestIcon,
    title: "Forest & River Trails",
    text: "Walk the river, the beach or the pine forest — all just steps from your door.",
  },
  {
    icon: vacationsIcon,
    title: "Beach Days",
    text: "Go catch some waves — the beach is always just meters away.",
  },
  {
    icon: bicycleIcon,
    title: "Wooden Trails",
    text: "Boardwalks lead straight to wild Atlantic sand, the coastal town or the riverside.",
  },
  {
    icon: sunriseIcon,
    title: "Golden Hour",
    text: "Chill on the terrace and soak up the Atlantic sunset, every single evening.",
  },
  {
    icon: kiteIcon,
    title: "Kite-Surfing",
    text: "Try something new — let the wind take your adrenaline up.",
  },
  {
    icon: poolIcon,
    title: "Pool Days",
    text: "Every sunny day is a pool day, and the pool is just steps away.",
  },
  {
    icon: buggyIcon,
    title: "Buggy Tours",
    text: "Wild wishes require wild measures — buggy tours nearby.",
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
                <img src={f.icon} alt="" className="h-8 w-8" />
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
