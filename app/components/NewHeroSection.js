"use client";
import Image from "next/image";

export default function NewHeroSection() {
    return (
        <div id="Hero" className="relative w-full px-10 py-6 md:px-15 md:py-9 lg:px-28 xl:h-screen bg-black text-white overflow-hidden">
            <div className="headlines relative xl:z-100 mt-22 md:mt-35 xl:mt-45 mb-8 flex flex-col gap-6 items-start lg:max-w-7/10 xl:max-w-35/100">
                <h1 className="font-bold text-4xl lg:text-5xl">
                    Turn your <span className="gradient-text">imagination</span> into <span className="gradient-text">reality</span>
                </h1>
                <p className="text-lg xl:text-xl">Submit your idea for a full design, modeling, and printing service, or simply upload your existing 3D file for professional printing and delivery.</p>

                <div className="btn-section flex flex-row gap-x-7">
                    <button className="btn cta-btn-1">Upload Designs</button>
                    <button className="cta-btn-2">
                        <div className="btn bg-black text-white">Submit Idea</div>
                    </button>
                </div>
            </div>

            <Image
                src="/background.jpg"
                alt="3D Printing Hero"
                width="2000"
                height="2000"
                className="z-1 object-cover xl:absolute top-0 right-[-20%] outline-lime-500"
                priority
            />

            {/* <img src="/background.jpg" className="z-1 xl:absolute top-0 right-[-15%] outline-lime-500"/> */}
        </div>
    )
}