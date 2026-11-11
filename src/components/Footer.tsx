import { Instagram } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/duna-natura-lockup-color.png";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-muted">
      <div className="container grid gap-10 py-16 md:grid-cols-2">
        <div>
          <img src={logo} alt="Duna Natura" className="h-16 w-auto" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {t("footer.contactUs")}
          </p>
          <a
            href="mailto:relax@dunanatura.pt"
            className="mt-4 block text-sm transition-smooth hover:text-primary"
          >
            relax@dunanatura.pt
          </a>
          <p className="mt-1 text-sm text-muted-foreground">{t("footer.address")}</p>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            {t("footer.followUs")}
          </p>
          <div className="mt-3 flex gap-4">
            <a
              href="https://www.instagram.com/duna.natura"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-smooth hover:text-primary"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          {t("footer.rights", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
