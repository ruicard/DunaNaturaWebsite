import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "./config";

// English is the unprefixed default (dunanatura.pt/, /about, ...) so existing
// links/bookmarks/indexed URLs keep working; every other language gets its
// own prefix (dunanatura.pt/pt/, /pt/about, ...).
export const LANGUAGE_PREFIXES: Record<SupportedLanguage, string> = {
  en: "",
  pt: "/pt",
  es: "/es",
  fr: "/fr",
  de: "/de",
};

// The app's routes, keyed by their unprefixed path (used for both the SEO
// copy in each locale file and for building/parsing language-prefixed URLs).
export const ROUTE_SEO_KEYS: Record<string, string> = {
  "/": "home",
  "/locations": "locations",
  "/about": "about",
  "/contact": "contact",
};

// Splits a URL pathname into its language and the unprefixed "base path"
// underneath it, e.g. "/pt/about" -> { lang: "pt", basePath: "/about" }.
// A pathname with no recognized language prefix (including admin/unknown
// routes) is treated as English.
export function stripLanguagePrefix(pathname: string): {
  lang: SupportedLanguage;
  basePath: string;
} {
  for (const lang of SUPPORTED_LANGUAGES) {
    const prefix = LANGUAGE_PREFIXES[lang];
    if (!prefix) continue;
    if (pathname === prefix) return { lang, basePath: "/" };
    if (pathname.startsWith(`${prefix}/`)) {
      return { lang, basePath: pathname.slice(prefix.length) };
    }
  }
  return { lang: "en", basePath: pathname || "/" };
}

// The inverse of stripLanguagePrefix: builds the URL for a given language
// and base path, e.g. buildPath("pt", "/about") -> "/pt/about".
export function buildPath(lang: SupportedLanguage, basePath: string): string {
  const prefix = LANGUAGE_PREFIXES[lang];
  if (basePath === "/") return prefix || "/";
  return `${prefix}${basePath}`;
}
