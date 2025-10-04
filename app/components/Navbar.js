"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    // Function to handle the scroll event
    const handleScroll = () => {
        // Check if the vertical scroll position is greater than 100 pixels
        const offset = window.scrollY;
        if (offset > 100) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    };

    // Set up the event listener when the component mounts
    useEffect(() => {
        // Ensure this only runs on the client-side
        window.addEventListener('scroll', handleScroll);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Determine the CSS classes based on the 'scrolled' state
    const navbarClasses = `
    fixed z-200 top-0 left-0 right-0 
    transition-all duration-300 ease-in-out
    flex items-center justify-between lg:justify-start
    px-10 py-6 md:px-15 md:py-9 lg:px-28 box-border
    
    ${scrolled
            ? 'bg-black text-white shadow-md' // Classes when scrolled (opaque)
            : 'bg-transparent text-white'     // Classes when at top (transparent)
        }
    `;
    return (
        <div id="Navbar" className={navbarClasses}>
            <div className="logo me-5 md:me-8">
                <div>
                    <Link href="/">
                        <h1 className="text-4xl md:text-5xl">LOGO</h1>
                        {/* <Image src="/new-morphiq.png" alt="Morphiq logo" fill className="w-full"/> */}
                    </Link>
                </div>
            </div>
            <div className="nav flex gap-3 md:gap-5 lg:text-lg">
                <Link href="#">About</Link>
                <Link href="#">FAQ</Link>
                <Link href="#">Services</Link>
            </div>
        </div>
    );
}