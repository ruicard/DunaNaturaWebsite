import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "@/i18n/config";
import { buildPath, ROUTE_SEO_KEYS, stripLanguagePrefix } from "@/i18n/routing";
import i18n from "@/i18n/config";

const SITE_ORIGIN = "https://dunanatura.pt";

const OG_LOCALES: Record<SupportedLanguage, string> = {
  en: "en_US",
  pt: "pt_PT",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
};

function setMetaContent(selector: string, content: string) {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute("content", content);
}

function setRobotsMeta(content: string | null) {
  let el = document.head.querySelector('meta[name="robots"]');
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", "robots");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string | null) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!href) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setHreflangAlternates(basePath: string | null) {
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  if (!basePath) return;

  for (const altLang of SUPPORTED_LANGUAGES) {
    const link = document.createElement("link");
    link.setAttribute("rel", "alternate");
    link.setAttribute("hreflang", altLang);
    link.setAttribute("href", `${SITE_ORIGIN}${buildPath(altLang, basePath)}`);
    document.head.appendChild(link);
  }
  // x-default: the version search engines should offer when no hreflang
  // matches the visitor's own language — English, since it's unprefixed.
  const defaultLink = document.createElement("link");
  defaultLink.setAttribute("rel", "alternate");
  defaultLink.setAttribute("hreflang", "x-default");
  defaultLink.setAttribute("href", `${SITE_ORIGIN}${buildPath("en", basePath)}`);
  document.head.appendChild(defaultLink);
}

// Keeps document.title, the meta description, og/twitter tags, canonical +
// hreflang alternate links, the <html> lang attribute, and a noindex tag
// (for /admin) in sync with the current route and language — none of this
// updates on its own in a client-only SPA, and the URL (not i18n's current
// language, which can lag a render behind on navigation) is the source of
// truth for which language a given page is.
export function usePageMeta() {
  const { pathname } = useLocation();
  useTranslation(); // subscribe so this hook re-runs when the language changes

  useEffect(() => {
    const { lang, basePath } = stripLanguagePrefix(pathname);
    document.documentElement.lang = lang;

    if (pathname === "/admin") {
      setRobotsMeta("noindex, nofollow");
      setCanonical(null);
      setHreflangAlternates(null);
      return;
    }

    const seoKey = ROUTE_SEO_KEYS[basePath];
    if (!seoKey) {
      setRobotsMeta(null);
      setCanonical(null);
      setHreflangAlternates(null);
      return;
    }

    setRobotsMeta(null);
    setCanonical(`${SITE_ORIGIN}${buildPath(lang, basePath)}`);
    setHreflangAlternates(basePath);

    const fixedT = i18n.getFixedT(lang);
    const title = fixedT(`seo.${seoKey}.title`);
    const description = fixedT(`seo.${seoKey}.description`);

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[property="og:url"]', `${SITE_ORIGIN}${buildPath(lang, basePath)}`);
    setMetaContent('meta[property="og:locale"]', OG_LOCALES[lang]);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, i18n.language]);
}
