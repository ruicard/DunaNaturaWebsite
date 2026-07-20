import { Link } from "react-router-dom";
import { Instagram, Facebook } from "lucide-react";

const pages = [
  { label: "Home", to: "/" },
  { label: "Locations", to: "/#locations" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Book Now", to: "/#reservations" },
  { label: "Admin Panel", to: "/admin" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="container grid gap-10 py-16 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-medium">Duna Natura</h3>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Off-grid camping between the Atlantic and the maritime pine forest.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Pages
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {pages.map((p) => (
              <li key={p.label}>
                <Link to={p.to} className="transition-smooth hover:text-primary">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Contact Us
          </p>
          <a
            href="mailto:hello@dunanatura.com"
            className="mt-4 block text-sm transition-smooth hover:text-primary"
          >
            hello@dunanatura.com
          </a>
          <p className="mt-1 text-sm text-muted-foreground">Mon – Fri: 9am – 5pm</p>

          <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Follow Us
          </p>
          <div className="mt-3 flex gap-4">
            <a href="#" aria-label="Instagram" className="text-muted-foreground transition-smooth hover:text-primary">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-muted-foreground transition-smooth hover:text-primary">
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Duna Natura. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
