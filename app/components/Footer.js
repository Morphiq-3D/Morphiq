"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaWhatsappSquare,
  FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="w-full px-6 py-9 md:px-16 md:py-20 flex flex-col gap-9 xl:flex-row xl:justify-between bg-black text-white"
    >
      {/* Logo Section */}
      <div className="logo">
        <Link
          href="/"
          className="block relative w-[140px] h-[50px] md:w-[180px] md:h-[60px]"
        >
          <Image
            src="/new-morphiq.png"
            alt="Morphiq logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* Social Media Icons */}
      <div className="socials flex gap-4 text-3xl lg:text-4xl">
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          <FaFacebookSquare />
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          <FaInstagramSquare />
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          <FaWhatsappSquare />
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          <FaLinkedin />
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="links grid grid-cols-2 grid-rows-3 xl:grid-cols-6 xl:grid-rows-1 gap-4 lg:text-lg  content-center">
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          About Us
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          Blog
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          FAQ
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          Contact
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          Privacy Policy
        </Link>
        <Link href="#" className="hover:text-gray-400 duration-300 content-center">
          Terms of Use
        </Link>
      </div>

      {/* Copyright */}
      <p className="text-sm content-center">Copyright © 2025 • Morphiq.3D</p>
    </footer>
  );
}
