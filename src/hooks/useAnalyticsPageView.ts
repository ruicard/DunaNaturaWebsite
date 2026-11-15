import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { logEvent } from "firebase/analytics";
import { analytics } from "@/lib/firebase";

// Analytics only auto-logs a page_view on the initial script load, so a
// single-page app needs to log one itself on every client-side route change.
export function useAnalyticsPageView() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (!analytics) return;
    logEvent(analytics, "page_view", {
      page_path: pathname + search,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);
}
