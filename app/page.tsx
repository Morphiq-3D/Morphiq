import Image from "next/image";
import HeroSection from "./components/HeroSection";
import AboutUs from "./components/AboutUs";
import Services from "./components/Services";
import DesignRequestForm from "./components/DesignRequestForm";

export default function Home() {
  return (
    <>
      <HeroSection />

      <AboutUs/>

      <Services/>

      <DesignRequestForm />
    </>
  );
}

// beamWidth = 2.5,
//   beamHeight = 20,
//   beamNumber = 16,
//   lightColor = '#ffffff',
//   speed = 3,
//   noiseIntensity = 2,
//   scale = 0.25,
//   rotation = 0