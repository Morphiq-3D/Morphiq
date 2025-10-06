"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 100);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarClasses = `
    fixed z-200 top-0 left-0 right-0 
    transition-all duration-300 ease-in-out
    flex items-center justify-between lg:justify-start
    px-10 py-6 md:px-15 md:py-9 lg:px-28 box-border
    ${scrolled ? "bg-black text-white shadow-md" : "bg-transparent text-white"}
  `;

  return (
    <div id="Navbar" className={navbarClasses}>
      <div className="logo me-5 md:me-8">
        <Link href="/" className="block relative w-[140px] h-[50px] md:w-[180px] md:h-[60px]">
          <Image
            src="/new-morphiq.png"
            alt="Morphiq logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      <div className="nav flex gap-3 md:gap-5 lg:text-lg">
        <Link href="#" className="hover:text-gray-400 duration-300">About</Link>
        <Link href="#" className="hover:text-gray-400 duration-300">FAQ</Link>
        <Link href="#" className="hover:text-gray-400 duration-300">Services</Link>
      </div>
    </div>
  );
}
