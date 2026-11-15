import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ROUTE_SEO_KEYS: Record<string, string> = {
  "/": "home",
  "/locations": "locations",
  "/about": "about",
  "/contact": "contact",
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

// Keeps document.title, the meta description, og/twitter tags, the <html>
// lang attribute, and a noindex tag (for /admin) in sync with the current
// route and language — none of this updates on its own in a client-only SPA.
export function usePageMeta() {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    if (pathname === "/admin") {
      setRobotsMeta("noindex, nofollow");
      return;
    }
    setRobotsMeta(null);

    const seoKey = ROUTE_SEO_KEYS[pathname];
    if (!seoKey) return;

    const title = t(`seo.${seoKey}.title`);
    const description = t(`seo.${seoKey}.description`);

    document.title = title;
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:title"]', title);
    setMetaContent('meta[property="og:description"]', description);
    setMetaContent('meta[name="twitter:title"]', title);
    setMetaContent('meta[name="twitter:description"]', description);
  }, [pathname, t, i18n.language]);
}
