"use client";
import Beams from "./Beams";
import AnimatedContent from "./AnimatedContent";
import SplitText from "./SplitText";
import CircularText from "./CircularText";

export default function AboutUs() {
  return (
    <section className="relative min-h-[700px] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Beams Background */}
      <div className="absolute inset-0 z-0">
        <Beams />
      </div>

      {/* Title Above */}
      <div className="relative z-10 mb-10">
        <AnimatedContent
          distance={80}
          direction="vertical"
          reverse={true}
          duration={1}
          threshold={0.3}
        >
          <SplitText
            text="About Us"
            tag="h2"
            className="text-5xl font-extrabold text-white text-center drop-shadow-lg"
            splitType="chars"
            delay={60}
            duration={0.6}
          />
        </AnimatedContent>
      </div>

      {/* Flex Row: Circles + Content Card */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-10 w-full max-w-6xl">
        {/* Left Circle */}
        <AnimatedContent
          distance={200}
          direction="horizontal"
          reverse={true} // from left
          duration={1}
          threshold={0.3}
        >
          <div className="order-1 md:order-1">
            <CircularText
              text="3D PRINTING • DESIGN • INNOVATION • "
              spinDuration={8}
            />
          </div>
        </AnimatedContent>

        {/* Content Card */}
        <AnimatedContent
          distance={150}
          direction="vertical"
          reverse={true}
          duration={1}
          threshold={0.3}
        >
          <div className="order-2 container relative z-10 bg-[#BFE5F6] backdrop-blur-sm rounded-4xl shadow-lg p-10 text-center max-w-4xl">
            <SplitText
              text="Welcome to morphiq, Where dreams come to life"
              tag="h2"
              className="text-3xl font-bold text-gray-800 mb-6"
              splitType="words"
              delay={80}
              duration={0.7}
            />
            <SplitText
              text="At My 3D Print Studio, we specialize in transforming creative ideas into physical realities. With cutting-edge 3D printing technology and a passion for design, we provide high-quality prints that are durable, precise, and tailored to your needs. Whether it’s prototyping, custom products, or unique artistic creations, we bring imagination to life."
              tag="p"
              className="text-lg text-gray-700 leading-relaxed"
              splitType="lines"
              delay={100}
              duration={0.8}
            />
          </div>
        </AnimatedContent>

        {/* Right Circle */}
        <AnimatedContent
          distance={200}
          direction="horizontal"
          reverse={false} // from right
          duration={1}
          threshold={0.3}
        >
          <div className="order-3 md:order-3">
            <CircularText
              text="CREATIVITY • TECHNOLOGY • FUTURE • "
              spinDuration={8}
            />
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
