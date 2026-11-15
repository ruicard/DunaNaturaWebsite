import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import pt from "./locales/pt.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";

export const SUPPORTED_LANGUAGES = ["en", "pt", "es", "fr", "de"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

// Languages selectable from the UI right now. The rest are fully translated
// and loaded below — flip them on by adding them here once reviewed.
export const ENABLED_LANGUAGES: SupportedLanguage[] = ["en", "pt", "es", "fr", "de"];

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
  },
  // The actual active language is driven by the URL (see src/i18n/routing.ts
  // and LanguageRoute) — this is just the value before the router's first
  // render settles it, so it doesn't matter which supported language it is.
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
