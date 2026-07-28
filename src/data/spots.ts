// Asset images are referenced from the original deployment.
// Swap these for local files in /public/assets once you have your own photos.
const CDN = "https://dunanatura.lovable.app/assets";

export interface Spot {
  name: string;
  location: string;
  rating: number;
  image: string;
  tags: string[];
  price: number;
}

export const spots: Spot[] = [
  {
    name: "Pinhal Retreat",
    location: "Coastal Pine Grove",
    rating: 4.9,
    image: `${CDN}/spot-forest-COOsvQmS.jpg`,
    tags: ["Pine Grove", "Fire Pit", "Solar Shower"],
    price: 85,
  },
  {
    name: "Atlantic Shore",
    location: "Open Ocean Beach",
    rating: 5,
    image: `${CDN}/spot-lake-Cxpl3zJZ.jpg`,
    tags: ["Beachfront", "Surfboard Included", "Composting Toilet"],
    price: 95,
  },
  {
    name: "Dune Boardwalk",
    location: "Masseiras Trail",
    rating: 4.8,
    image: `${CDN}/spot-meadow-BDscIEdG.jpg`,
    tags: ["Dune Views", "Boardwalk Trails", "Bird Watching"],
    price: 75,
  },
];

export const HERO_IMAGE = `${CDN}/hero-camping-CbW0tLde.jpg`;

export const HERO_IMAGES = [
  HERO_IMAGE,
  `${CDN}/spot-forest-COOsvQmS.jpg`,
  `${CDN}/spot-lake-Cxpl3zJZ.jpg`,
  `${CDN}/spot-meadow-BDscIEdG.jpg`,
];
