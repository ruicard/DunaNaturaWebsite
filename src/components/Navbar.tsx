import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/duna-natura-lockup-black.png";

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
      <div className="container flex h-16 items-center justify-between sm:h-20">
        <Link to="/" className="flex shrink-0 items-center">
          <img src={logo} alt="Duna Natura" className="h-10 w-auto sm:h-14 md:h-16" />
        </Link>

        <nav className="flex shrink-0 items-center gap-1.5 sm:gap-4 md:gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={l.to === "/" ? handleHomeClick : undefined}
              className={cn(
                "whitespace-nowrap text-[0.55rem] font-medium uppercase tracking-[0.04em] transition-smooth hover:opacity-70 sm:text-xs sm:tracking-[0.15em]",
                solid ? "text-foreground" : "text-white"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href="#reservations"
            onClick={handleBookNow}
            className="whitespace-nowrap rounded-md bg-primary px-1.5 py-1.5 text-[0.55rem] font-medium uppercase tracking-[0.04em] text-primary-foreground transition-smooth hover:opacity-90 sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.15em]"
          >
            Book Now
          </a>
        </nav>
      </div>
    </header>
  );
}
