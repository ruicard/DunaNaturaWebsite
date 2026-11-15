import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LanguageRoute from "./components/LanguageRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Locations from "./pages/Locations";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { useAnalyticsPageView } from "./hooks/useAnalyticsPageView";
import { usePageMeta } from "./hooks/usePageMeta";
import { SUPPORTED_LANGUAGES } from "./i18n/config";
import { LANGUAGE_PREFIXES } from "./i18n/routing";

const PAGES = [
  { basePath: "/", Component: Index },
  { basePath: "/locations", Component: Locations },
  { basePath: "/about", Component: About },
  { basePath: "/contact", Component: Contact },
];

export default function App() {
  useAnalyticsPageView();
  usePageMeta();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {SUPPORTED_LANGUAGES.flatMap((lang) => {
            const prefix = LANGUAGE_PREFIXES[lang];
            return PAGES.map(({ basePath, Component }) => (
              <Route
                key={`${lang}${basePath}`}
                path={basePath === "/" ? prefix || "/" : `${prefix}${basePath}`}
                element={
                  <LanguageRoute lang={lang}>
                    <Component />
                  </LanguageRoute>
                }
              />
            ));
          })}
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
