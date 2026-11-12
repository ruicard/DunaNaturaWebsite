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
export const ENABLED_LANGUAGES: SupportedLanguage[] = ["en", "pt", "es"];

const STORAGE_KEY = "duna-natura-lang";

function isSupportedLanguage(value: string | null): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);
}

const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
const initialLanguage: SupportedLanguage =
  isSupportedLanguage(stored) && ENABLED_LANGUAGES.includes(stored) ? stored : "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    pt: { translation: pt },
    es: { translation: es },
    fr: { translation: fr },
    de: { translation: de },
  },
  lng: initialLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export function setLanguage(lang: SupportedLanguage) {
  i18n.changeLanguage(lang);
  localStorage.setItem(STORAGE_KEY, lang);
}

export default i18n;
