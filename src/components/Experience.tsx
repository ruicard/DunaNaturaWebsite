import { useTranslation } from "react-i18next";
import relaxIcon from "@/assets/008-relax.png";
import bicycleIcon from "@/assets/001-bicycle.png";
import vacationsIcon from "@/assets/002-vacations.png";
import roadTripIcon from "@/assets/009-arrow.png";
import sunriseIcon from "@/assets/003-sunrise.png";
import kiteIcon from "@/assets/004-kite.png";
import poolIcon from "@/assets/005-swimming-pool.png";
import buggyIcon from "@/assets/007-dune-buggy.png";

const features = [
  { key: "slowDown", icon: relaxIcon },
  { key: "woodenTrails", icon: bicycleIcon },
  { key: "beachDays", icon: vacationsIcon },
  { key: "roadTrips", icon: roadTripIcon },
  { key: "goldenHour", icon: sunriseIcon },
  { key: "surfing", icon: kiteIcon },
  { key: "poolDays", icon: poolIcon },
  { key: "buggyTours", icon: buggyIcon },
];

export default function Experience() {
  const { t } = useTranslation();

  return (
    <section className="bg-muted py-24">
      <div className="container">
        <div className="mb-14 text-center">
          <p className="eyebrow">{t("experience.eyebrow")}</p>
          <h2 className="mt-3 text-4xl font-light md:text-5xl">{t("experience.title")}</h2>
          <p className="mt-4 text-muted-foreground">{t("experience.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-10 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.key} className="text-center">
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-14 sm:w-14">
                <img src={f.icon} alt="" className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <h3 className="mt-3 text-sm font-medium sm:mt-5 sm:text-lg">
                {t(`experience.features.${f.key}.title`)}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground sm:mt-2 sm:text-sm">
                {t(`experience.features.${f.key}.text`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
