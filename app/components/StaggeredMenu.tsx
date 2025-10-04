"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface StaggeredMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  position?: "left" | "right";
  accentColor?: string;
}

export default function StaggeredMenu({
  isOpen,
  setIsOpen,
  position = "right",
  accentColor = "#5227FF",
}: StaggeredMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formFieldsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [notification, setNotification] = useState("");

  // Initial hidden state
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const offscreen = position === "left" ? -100 : 100;
    gsap.set(panel, { xPercent: offscreen, opacity: 1 });
  }, [position]);

  // Animate panel and form fields on open/close
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const offscreen = position === "left" ? -100 : 100;

    if (isOpen) {
      // Slide panel in
      gsap.to(panel, { xPercent: 0, duration: 0.6, ease: "power4.out" });

      // Stagger form fields
      formFieldsRef.current.forEach((field, i) => {
        if (field) {
          gsap.fromTo(
            field,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: "power4.out" }
          );
        }
      });
    } else {
      // Slide panel out
      gsap.to(panel, { xPercent: offscreen, duration: 0.5, ease: "power4.in" });
    }
  }, [isOpen, position]);

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNotification("Your request has been sent!");
    formRef.current?.reset();
    setTimeout(() => setNotification(""), 3000);
  };

  // Utility to attach refs to form fields for stagger animation
  const setFieldRef = (el: HTMLDivElement | null, index: number) => {
    formFieldsRef.current[index] = el;
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 pointer-events-none">
      <aside
        ref={panelRef}
        className={`absolute top-0 ${position}-0 h-full bg-gray-800 flex flex-col p-10 pointer-events-auto shadow-xl overflow-y-auto`}
        style={{ width: "clamp(260px, 38vw, 420px)" }}
      >
        {/* Close button */}
        <div ref={(el) => setFieldRef(el, 0)} className="mb-6">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gradient-to-br from-blue-600 to-cyan-400 text-white rounded"
          >
            Close
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} className="flex flex-col gap-4 text-white" onSubmit={handleSubmit}>
          <div ref={(el) => setFieldRef(el, 1)}>
            <input
              type="text"
              placeholder="Full Name"
              required
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div ref={(el) => setFieldRef(el, 2)}>
            <input
              type="email"
              placeholder="Email"
              required
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div ref={(el) => setFieldRef(el, 3)}>
            <input
              type="tel"
              placeholder="Phone Number (Optional)"
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div ref={(el) => setFieldRef(el, 4)}>
            <input
              type="tel"
              placeholder="Whatsapp Number (Optional)"
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div ref={(el) => setFieldRef(el, 5)}>
            <textarea
              placeholder="Describe your 3D model"
              required
              rows={5}
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>
          <div ref={(el) => setFieldRef(el, 6)}>
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-gradient-to-br from-blue-600 to-cyan-400 text-white rounded font-semibold hover:scale-105 transition-transform duration-200"
            >
              Submit
            </button>
          </div>
        </form>

        {/* Notification */}
        {notification && (
          <div ref={(el) => setFieldRef(el, 7)} className="mt-4 p-3 bg-green-500 text-white rounded shadow">
            {notification}
          </div>
        )}
      </aside>
    </div>
  );
}
