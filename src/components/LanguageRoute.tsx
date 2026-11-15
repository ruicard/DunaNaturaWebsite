import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { SupportedLanguage } from "@/i18n/config";

// Wraps a route element so visiting its URL (even directly, via a bookmark,
// a search result, or browser back/forward) activates the matching i18n
// language — the URL is the single source of truth for which language is
// showing, there is no separate stored preference.
export default function LanguageRoute({
  lang,
  children,
}: {
  lang: SupportedLanguage;
  children: ReactNode;
}) {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  return <>{children}</>;
}
