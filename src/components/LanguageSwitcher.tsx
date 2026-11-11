import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENABLED_LANGUAGES, setLanguage, type SupportedLanguage } from "@/i18n/config";

const FLAGS: Record<SupportedLanguage, string> = {
  en: "🇬🇧",
  pt: "🇵🇹",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
};

export default function LanguageSwitcher({ solid }: { solid: boolean }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current = (
    ENABLED_LANGUAGES.includes(i18n.language as SupportedLanguage) ? i18n.language : "en"
  ) as SupportedLanguage;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function choose(lang: SupportedLanguage) {
    setLanguage(lang);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("languageSwitcher.label")}
        className={cn(
          "flex shrink-0 items-center gap-0.5 whitespace-nowrap rounded-md py-1.5 text-[0.55rem] font-medium uppercase tracking-[0.04em] transition-smooth hover:opacity-70 sm:gap-1.5 sm:px-2 sm:text-xs sm:tracking-[0.15em]",
          solid ? "text-foreground" : "text-white"
        )}
      >
        <span className="text-sm sm:text-base">{FLAGS[current]}</span>
        <span className="hidden sm:inline">{current}</span>
        <ChevronDown
          className={cn("h-2.5 w-2.5 transition-smooth sm:h-3 sm:w-3", open ? "rotate-180" : "")}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-full mt-2 w-40 overflow-hidden rounded-md border border-border bg-card py-1 text-foreground shadow-hover"
        >
          {ENABLED_LANGUAGES.map((lang) => (
            <button
              key={lang}
              type="button"
              role="option"
              aria-selected={lang === current}
              onClick={() => choose(lang)}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-smooth hover:bg-muted",
                lang === current ? "font-medium text-primary" : "text-foreground"
              )}
            >
              <span className="text-base">{FLAGS[lang]}</span>
              {t(`languageSwitcher.${lang}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
