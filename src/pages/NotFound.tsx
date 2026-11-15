import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { buildPath, stripLanguagePrefix } from "@/i18n/routing";

export default function NotFound() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { lang } = stripLanguagePrefix(pathname);

  useEffect(() => {
    if (i18n.language !== lang) i18n.changeLanguage(lang);
  }, [lang, i18n]);

  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-background">
      <div className="text-center">
        <p className="text-6xl font-light text-primary">{t("notFound.code")}</p>
        <p className="mt-4 text-muted-foreground">{t("notFound.message")}</p>
        <Link
          to={buildPath(lang, "/")}
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90"
        >
          {t("notFound.backHome")}
        </Link>
      </div>
    </section>
  );
}
