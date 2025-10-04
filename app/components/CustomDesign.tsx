"use client";
import AnimatedContent from "./AnimatedContent";
import SplitText from "./SplitText";

interface CustomDesignProps {
  onOpenMenu: () => void;
}

export default function CustomDesign({ onOpenMenu }: CustomDesignProps) {
  return (
    <section className="relative p-10 md:px-15 lg:px-24 lg:py-16 min-h-[500px] bg-transparent">
      <AnimatedContent distance={150} direction="vertical" reverse={false} duration={1} threshold={0.3}>
        <div className="relative z-10 w-full mx-auto px-4 sm:px-10 lg:px-30 xl:px-60 2xl:px-90 rounded-[40px] bg-gray-400/25 py-25 shadow-lg border border-gray-700">
          <div className="flex flex-col items-center text-center">
            <SplitText
              text="Want to bring your idea to life?"
              tag="h2"
              className="block text-4xl lg:text-5xl font-semibold text-white mb-6 leading-tight pb-6"
              splitType="words"
              delay={60}
              duration={0.6}
            />

            <SplitText
              text="From concept to creation, we handle it all. Tell us your idea, and our team will design, print, and ship your custom 3D model."
              tag="p"
              className="block text-lg xl:text-xl text-[#FFFFFF] mb-8 leading-relaxed max-w-3xl pb-6"
              splitType="lines"
              delay={80}
              duration={0.7}
            />

            {/* Trigger menu */}
            <button
              onClick={onOpenMenu}
              className="btn cta-btn-1 shadow-md hover:scale-110 duration-300 transition"
            >
              {/*  shadow-md hover:scale-110 duration-300 transition */}
              Submit Idea
            </button>
          </div>
        </div>
      </AnimatedContent>
    </section>
  );
}
