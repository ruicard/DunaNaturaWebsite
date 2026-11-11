import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();
  return (
    <section className="bg-background pt-28 pb-24">
      <div className="container max-w-3xl">
        <p className="eyebrow">{t("about.eyebrow")}</p>
        <h1 className="mt-3 text-4xl font-light md:text-5xl">{t("about.title")}</h1>
        <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <p>{t("about.p3")}</p>
        </div>
      </div>
    </section>
  );
}
