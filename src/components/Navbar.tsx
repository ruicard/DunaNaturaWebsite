import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/duna-natura-logo.png";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const onHome = pathname === "/";

  function handleBookNow(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (onHome) {
      document.getElementById("reservations")?.scrollIntoView();
    } else {
      navigate("/#reservations");
    }
  }

  function handleHomeClick(e: MouseEvent<HTMLAnchorElement>) {
    if (onHome) {
      e.preventDefault();
      window.scrollTo({ top: 0 });
    }
  }

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
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Duna Natura" className="h-10 w-auto" />
        </Link>

        <nav className="flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={l.to === "/" ? handleHomeClick : undefined}
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
            onClick={handleBookNow}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground transition-smooth hover:opacity-90"
          >
            Book Now
          </a>
        </nav>
      </div>
    </header>
  );
}
