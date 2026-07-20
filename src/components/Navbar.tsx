import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || !onHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-smooth",
        solid
          ? "bg-background/90 shadow-soft backdrop-blur border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link
          to="/"
          className={cn(
            "text-lg font-medium tracking-wide transition-smooth",
            solid ? "text-foreground" : "text-white"
          )}
        >
          Wild Haven
        </Link>

        <nav className="flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "text-xs font-medium uppercase tracking-[0.15em] transition-smooth hover:opacity-70",
                solid ? "text-foreground" : "text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#reservations"
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90"
          >
            Book Now
          </a>
        </nav>
      </div>
    </header>
  );
}
