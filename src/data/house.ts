import livingRoom from "@/assets/casa-living-room.jpg";
import kitchen from "@/assets/casa-kitchen.jpg";
import mainBedroom from "@/assets/casa-main-bedroom.jpg";
import secondaryBedroom from "@/assets/casa-secondary-bedroom.jpg";
import bathroom from "@/assets/casa-bathroom.jpg";
import exterior from "@/assets/casa-exterior.jpg";
import pool from "@/assets/casa-pool.jpg";
import beachfrontView from "@/assets/casa-beachfront-view.jpg";

export interface HousePhoto {
  // Replace with your own photo URL (or a local path under /public) to fill this slot.
  src: string | null;
  alt: string;
  caption: string;
}

export const houseName = "Duna Natura House";

export const housePhotos: HousePhoto[] = [
  { src: livingRoom, alt: "Living room", caption: "Living Room" },
  { src: kitchen, alt: "Kitchen", caption: "Kitchen" },
  { src: mainBedroom, alt: "Main bedroom", caption: "Main Bedroom" },
  { src: secondaryBedroom, alt: "Secondary bedroom", caption: "Secondary Bedroom" },
  { src: bathroom, alt: "Bathroom", caption: "Bathroom" },
  { src: exterior, alt: "House exterior and garden", caption: "Exterior" },
  { src: pool, alt: "Swimming pool", caption: "Pool" },
  { src: beachfrontView, alt: "Aerial view of the beach and dunes", caption: "Beachfront View" },
];
