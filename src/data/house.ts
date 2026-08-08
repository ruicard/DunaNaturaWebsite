import livingRoom from "@/assets/gallery-living-room.png";
import mainBedroom from "@/assets/gallery-main-bedroom.png";
import secondaryBedroom from "@/assets/gallery-secondary-bedroom.png";
import bathroom from "@/assets/gallery-bathroom.png";
import terrace from "@/assets/gallery-terrace.png";
import pool from "@/assets/gallery-pool.png";

export interface HousePhoto {
  // Replace with your own photo URL (or a local path under /public) to fill this slot.
  src: string | null;
  alt: string;
  caption: string;
}

export const houseName = "Duna Natura House";

export const housePhotos: HousePhoto[] = [
  { src: livingRoom, alt: "Living room", caption: "Living Room" },
  { src: mainBedroom, alt: "Main bedroom", caption: "Main Bedroom" },
  { src: secondaryBedroom, alt: "Secondary bedroom", caption: "Secondary Bedroom" },
  { src: bathroom, alt: "Bathroom", caption: "Bathroom" },
  { src: terrace, alt: "Terrace", caption: "Terrace" },
  { src: pool, alt: "Swimming pool", caption: "Pool" },
];
