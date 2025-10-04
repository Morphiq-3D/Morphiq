"use client";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full">
      {/* Background image */}
      <Image
        src="/background.jpg" // replace with your hero image
        alt="3D Printing Hero"
        fill
        className="object-cover"
        priority
      />

      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black/40" /> */}

      {/* Logo at top center */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center">
        <Image
          src="/new morphiq.png" // replace with your logo
          alt="Logo"
          width={250}
          height={250}
          className="mx-auto"
        />
        <h1 className="text-white text-2xl font-bold mt-2 tracking-wide drop-shadow-md">
          Where all your dreams come to life
        </h1>
      </div>

      {/* Left side text */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white max-w-sm">
        <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
          Custom 3D Designs
        </h2>
        <p className="text-lg drop-shadow-md mb-6">
          Bring your imagination to life with our precision 3D printing
          solutions.
        </p>
        <a className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition transform hover:scale-105 mt-5">
          Upload your STL design
        </a>
      </div>

          {/* Right side text with CTA */}
      <div className="absolute right-10 top-1/2 -translate-y-1/2 text-white max-w-sm text-right">
        <h2 className="text-3xl font-semibold mb-4 drop-shadow-lg">
          High Quality Prints
        </h2>
        <p className="text-lg drop-shadow-md mb-6">
          Durable materials, smooth finishes, and attention to detail in every
          design.
        </p>
        <a href="#request" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg transition transform hover:scale-105">
          Lets make magic 
        </a>
      </div>
    </section>
  );
}
