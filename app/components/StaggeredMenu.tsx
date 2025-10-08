"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// TODO: change animation on mobile view to "down sheet"
// TODO: maybe add a loading animation when sending the request ??

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
  const [error, setError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log("json: ", formJson);

    try {
      const response = await fetch("/api/orders/design", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formJson),
      });

      if (!response.ok) {
        console.error(response.body);
        throw new Error(`HTTP Error! status: ${response.status}`);
      }

      console.log("Your request has been sent!");
      setError("");
      setNotification("Your request has been sent!");
      formRef.current?.reset();
      setTimeout(() => setNotification(""), 3000);

    } catch (e: unknown) {
      console.error(e);
      setNotification("");
      setError("Error sending your request!")
    }
  };

  const handleClose = () => {
    setIsOpen(false);

    setTimeout(() => {
      formRef.current?.reset();
      setNotification("");
      setError("");
    }, 3000);
  }

  const setFieldRef = (el: HTMLDivElement | null, index: number) => {
    formFieldsRef.current[index] = el;
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] ${isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
    >
      {/* Optional backdrop for better UX */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar Panel */}
      <aside
        ref={panelRef}
        className={`absolute top-0 ${position}-0 h-full bg-gray-800 flex flex-col p-10 shadow-2xl overflow-y-auto`}
        style={{ width: "clamp(260px, 38vw, 420px)" }}
      >
        {/* Close Button */}
        <div ref={(el) => setFieldRef(el, 0)} className="mb-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gradient-to-br from-blue-600 to-cyan-400 text-white rounded font-semibold hover:scale-105 transition-transform duration-200"
          >
            Close
          </button>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          className="flex flex-col gap-4 text-white"
          onSubmit={handleSubmit}
        >
          {/* TODO: implement field filling with existing emails */}
          <div ref={(el) => setFieldRef(el, 1)}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div ref={(el) => setFieldRef(el, 2)}>
            <input
              type="text"
              name="fname"
              placeholder="First Name"
              required
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div ref={(el) => setFieldRef(el, 3)}>
            <input
              type="text"
              name="lname"
              placeholder="Last Name"
              required
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div ref={(el) => setFieldRef(el, 4)}>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              className="border border-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div ref={(el) => setFieldRef(el, 5)}>
            <textarea
              placeholder="Describe your 3D model"
              name="description"
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

        {notification && (
          <div
            ref={(el) => setFieldRef(el, 7)}
            className="mt-4 p-3 bg-green-500 text-white rounded shadow"
          >
            {notification}
          </div>
        )}

        {error && (
          <div
            ref={(el) => setFieldRef(el, 7)}
            className="mt-4 p-3 bg-red-500 text-white rounded shadow"
          >
            {error}
          </div>
        )}
      </aside>
    </div>
  );
}
