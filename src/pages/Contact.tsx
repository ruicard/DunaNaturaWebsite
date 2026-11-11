import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  return (
    <section className="bg-background pt-28 pb-24">
      <div className="container max-w-2xl">
        <p className="eyebrow">{t("contact.eyebrow")}</p>
        <h1 className="mt-3 text-4xl font-light md:text-5xl">{t("contact.title")}</h1>
        <p className="mt-4 text-muted-foreground">{t("contact.subtitle")}</p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <div className="flex items-center gap-3 rounded-lg bg-card p-5 shadow-soft">
            <Mail className="h-5 w-5 text-primary" />
            <a href="mailto:relax@dunanatura.pt" className="text-sm hover:text-primary">
              relax@dunanatura.pt
            </a>
          </div>

        </div>

        <form
          className="mt-10 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            alert(t("contact.demoAlert"));
          }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <input
              required
              placeholder={t("contact.namePlaceholder")}
              className="rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
            <input
              required
              type="email"
              placeholder={t("contact.emailPlaceholder")}
              className="rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <textarea
            required
            rows={5}
            placeholder={t("contact.messagePlaceholder")}
            className="w-full rounded-md border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <button className="rounded-md bg-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90">
            {t("contact.sendMessage")}
          </button>
        </form>
      </div>
    </section>
  );
}
