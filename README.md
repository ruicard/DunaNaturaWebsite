# Duna Natura / Wild Haven

Reconstruction of the site at **https://dunanatura.lovable.app** as an editable
code repository, built with the same stack the original uses:

- **Vite** (build tool / dev server)
- **React 18** + **TypeScript**
- **Tailwind CSS** (design tokens matched to the original: teal primary
  `hsl(195 45% 38%)` on a warm off-white background, DM Sans typography)
- **React Router** for the `/`, `/about`, `/contact`, `/locations` routes
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:8080
npm run build    # production build in /dist
npm run preview  # preview the build
```

## Project structure

```
src/
  components/    Navbar, Hero, FeaturedSpots, Experience, Reservations, Footer
  pages/         Index, About, Contact, Locations, NotFound
  data/spots.ts  Featured spots content + image URLs
  index.css      Design tokens (CSS variables) + Tailwind layers
```

## Notes

- **Images** are referenced from the original deployment's `/assets` URLs
  (see `src/data/spots.ts` and `src/components/Hero.tsx`). To make the repo
  fully self-contained, download your photos into `public/assets/` and update
  those paths.
- This is a faithful **reconstruction from the live rendered site** — content,
  layout, colors, fonts and images were captured from the public page. It is not
  a copy of Lovable's private source project (which lives in the Lovable
  platform and isn't publicly downloadable).
- The booking calendar and guest selector are interactive front-end demos; wire
  them to your booking backend / availability data as needed.
