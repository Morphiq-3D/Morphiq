"use client";
import Link from "next/link";
import { FaFacebookSquare, FaInstagramSquare, FaWhatsappSquare, FaLinkedin } from "react-icons/fa";

export default function Footer() {
    return (
        <div id="footer" className="w-full px-6 py-9 md:px-16 md:py-20 flex flex-col gap-9 xl:flex-row xl:justify-between bg-black text-white">
            <div className="logo">
                <Link href="/"><h1 className="text-3xl lg:text-4xl">LOGO</h1></Link>
            </div>

            <div className="socials flex gap-4 text-3xl lg:text-4xl ">
                <Link href="#" className="hover:text-gray-400 duration-300">< FaFacebookSquare/></Link>
                <Link href="#" className="hover:text-gray-400 duration-300">< FaInstagramSquare/></Link>
                <Link href="#" className="hover:text-gray-400 duration-300">< FaWhatsappSquare/></Link>
                <Link href="#" className="hover:text-gray-400 duration-300">< FaLinkedin/></Link>
                {/* any other socials ? */}
            </div>

            <div className="links grid grid-cols-2 grid-rows-3 xl:grid-cols-6 xl:grid-rows-1 gap-4 lg:text-lg">
                <Link href="#" className="hover:text-gray-400 duration-300">About Us</Link>
                <Link href="#" className="hover:text-gray-400 duration-300">Blog</Link>
                <Link href="#" className="hover:text-gray-400 duration-300">FAQ</Link>
                <Link href="#" className="hover:text-gray-400 duration-300">Contact</Link>
                <Link href="#" className="hover:text-gray-400 duration-300">Privacy Policy</Link>
                <Link href="#" className="hover:text-gray-400 duration-300">Terms of Use</Link>
            </div>

            <p className="text-sm">Copyright © 2025 • Morphiq.3D</p>
        </div>
    );
}