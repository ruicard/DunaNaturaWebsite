import livingRoom from "@/assets/casa-living-room.jpg";
import diningArea from "@/assets/casa-dining-area.jpg";
import kitchen from "@/assets/casa-kitchen.jpg";
import mainBedroom from "@/assets/casa-main-bedroom.jpg";
import secondaryBedroom from "@/assets/casa-secondary-bedroom.jpg";
import bathroom from "@/assets/casa-bathroom.jpg";
import exterior from "@/assets/casa-exterior.jpg";
import terrace from "@/assets/casa-terrace.jpg";
import pool from "@/assets/casa-pool.jpg";
import beachfrontView from "@/assets/casa-beachfront-view.jpg";

export interface HousePhoto {
  // Replace with your own photo URL (or a local path under /public) to fill this slot.
  src: string | null;
  key: string;
}

export const houseName = "Duna Natura House";

export const housePhotos: HousePhoto[] = [
  { src: livingRoom, key: "livingRoom" },
  { src: diningArea, key: "diningArea" },
  { src: kitchen, key: "kitchen" },
  { src: mainBedroom, key: "mainBedroom" },
  { src: secondaryBedroom, key: "secondaryBedroom" },
  { src: bathroom, key: "bathroom" },
  { src: exterior, key: "exterior" },
  { src: terrace, key: "terrace" },
  { src: pool, key: "pool" },
  { src: beachfrontView, key: "beachfrontView" },
];

export const houseAmenityKeys: string[] = [
  "kitchen",
  "masterBedroom",
  "secondaryBedroom",
  "extraBed",
  "diningLiving",
  "balcony",
  "garage",
  "rooftop",
  "pool",
];
