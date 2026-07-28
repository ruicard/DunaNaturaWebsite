export interface HousePhoto {
  // Replace with your own photo URL (or a local path under /public) to fill this slot.
  src: string | null;
  alt: string;
  caption: string;
}

export const houseName = "Duna Natura House";

export const housePhotos: HousePhoto[] = [
  { src: null, alt: "House exterior", caption: "Exterior" },
  { src: null, alt: "Living room", caption: "Living Room" },
  { src: null, alt: "Bedroom", caption: "Bedroom" },
  { src: null, alt: "Kitchen", caption: "Kitchen" },
  { src: null, alt: "Bathroom", caption: "Bathroom" },
  { src: null, alt: "Outdoor space", caption: "Outdoor Space" },
];
