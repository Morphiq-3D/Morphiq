"use client";
import { useState } from "react";
import Navbar from "./components/Navbar";
import NewHeroSection from "./components/NewHeroSection";
import CustomDesign from "./components/CustomDesign";
import Services from "./components/Services";
import ProductCarousel from "./components/ProductCarousel";
import StaggeredMenu from "./components/StaggeredMenu";
import Footer from "./components/Footer"

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const products = [
    { name: "Design 1", image: "/product1.jpg" },
    { name: "Design 2", image: "/product2.jpg" },
    { name: "Design 3", image: "/product3.jpg" },
    { name: "Design 4", image: "/product4.jpg" },
    { name: "Design 5", image: "/product5.jpg" },
    { name: "Design 6", image: "/product6.jpg" },
    { name: "Design 7", image: "/product7.jpg" },
    { name: "Design 8", image: "/product8.jpg" },
    { name: "Design 9", image: "/product9.jpg" },
    { name: "Design 10", image: "/product4.jpg" },
    { name: "Design 11", image: "/product5.jpg" },
  ];

  return (
    <>
      <Navbar />
      <NewHeroSection onOpenMenu={() => setIsMenuOpen(true)} />

      <ProductCarousel products={products} />
      
      <Services />

      <CustomDesign onOpenMenu={() => setIsMenuOpen(true)} />

      <Footer />

        <StaggeredMenu
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
      />
    </>
  );
}
