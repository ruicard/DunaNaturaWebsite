import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Hero from "@/components/Hero";
import HouseGallery from "@/components/HouseGallery";
import Experience from "@/components/Experience";
import Reservations from "@/components/Reservations";

export default function Index() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash !== "#reservations") return;
    document.getElementById("reservations")?.scrollIntoView();
  }, [hash]);

  return (
    <>
      <Hero />
      <HouseGallery />
      <Experience />
      <Reservations />
    </>
  );
}
