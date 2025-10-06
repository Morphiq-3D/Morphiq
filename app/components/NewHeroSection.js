"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFileContext } from "../context/FileContext";
import { useState } from "react";
import * as utils from "../test/utils/utils";

export default function NewHeroSection({ onOpenMenu }) {
  const router = useRouter();
  const { setFile } = useFileContext();
  const [notification, setNotification] = useState(null);
  const [showNotification, setShowNotification] = useState(false);

  const handleUploadClick = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".stl";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (!file.name.toLowerCase().endsWith(".stl")) {
        triggerNotification("Unsupported file type! Please upload a .STL file.");
        return;
      }

      try {
        const isValid = await utils.validateSTL(file);
        if (!isValid) {
          triggerNotification("Invalid or corrupted STL file. Please choose another file.");
          return;
        }

        setFile(file);
        router.push("/test");
      } catch (err) {
        console.error("STL validation error:", err);
        triggerNotification("Error reading the STL file. Please choose another file.");
      }
    };

    input.click();
  };

  const triggerNotification = (message) => {
    setNotification(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  return (
    <div id="Hero" className="relative w-full px-10 py-6 md:px-15 md:py-9 lg:px-28 xl:h-screen bg-black text-white overflow-hidden">
      <div className="headlines relative xl:z-100 mt-22 md:mt-35 xl:mt-45 mb-8 flex flex-col gap-6 items-start lg:max-w-7/10 xl:max-w-35/100">
        <h1 className="font-bold text-4xl lg:text-5xl">
          Turn your <span className="gradient-text">imagination</span> into <span className="gradient-text">reality</span>
        </h1>
        <p className="text-lg xl:text-xl">
          Submit your idea for a full design, modeling, and printing service, or simply upload your existing 3D file for professional printing and delivery.
        </p>

        <div className="btn-section flex flex-row gap-x-7">
          <button onClick={handleUploadClick} className="btn cta-btn-1">Upload Designs</button>
          <button onClick={onOpenMenu} className="cta-btn-2">
            <div className="btn bg-black text-white">Submit Idea</div>
          </button>
        </div>
      </div>

      <Image
        src="/background.jpg"
        alt="3D Printing Hero"
        width={2000}
        height={2000}
        className="z-1 object-cover xl:absolute top-0 right-[-20%] outline-lime-500"
        priority
      />

      {/* Notification */}
      {notification && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-transform duration-500 ease-in-out pointer-events-none
            ${showNotification ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}
        >
          {notification}
        </div>
      )}
    </div>
  );
}
