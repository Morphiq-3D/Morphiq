"use client";
import Image from "next/image";
import Dither from "./Dither"; // adjust path
import AnimatedContent from "./AnimatedContent"; // adjust path
import SplitText from "./SplitText"; // adjust path

export default function Services() {
  const services = [
    {
      title: "Custom 3D Modeling",
      description:
        "We design and create custom 3D models tailored to your unique requirements, from concept to prototype.",
      image: "/service1.jpg",
      reverse: false,
    },
    {
      title: "Rapid Prototyping",
      description:
        "Turn your ideas into functional prototypes quickly, with precision and high-quality finishes.",
      image: "/service2.jpg",
      reverse: true,
    },
    {
      title: "High-Quality Production",
      description:
        "We use advanced materials and techniques to deliver durable, production-ready 3D prints.",
      image: "/service3.jpg",
      reverse: false,
    },
  ];

  return (
    <section className="py-20 bg-[#00050D]">
      <div className="container mx-auto px-4 space-y-16">
        <h2 className="text-center text-4xl font-bold text-gray-100 mb-12">
          Our Services
        </h2>

        {services.map((service, index) => (
          <AnimatedContent
            key={index}
            distance={200}
            direction="horizontal"
            reverse={service.reverse}
            duration={1}
            delay={index * 0.3} // stagger each card by 0.3s
            threshold={0.2} // triggers when 20% of card is in viewport
            onComplete={() => {
              // trigger SplitText after slide finishes
              const texts = document.querySelectorAll(
                `[data-service="${index}"] .split-text`
              );
              texts.forEach((el) => {
                el.classList.add("animate-split"); // custom trigger class
              });
            }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              {/* Dither Background */}
              <div className="absolute inset-0 z-0">
                <Dither
                  waveColor={[0.1, 0.5, 0.6]}
                  colorNum={5}
                  pixelSize={2}
                  disableAnimation={false}
                />
              </div>

              {/* Content */}
              <div
                className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8`}
                data-service={index}
              >
                {/* Text */}
                <div
                  className={`${
                    service.reverse ? "md:order-2 md:text-left" : "md:order-1"
                  }`}
                >
                  <SplitText
                    text={service.title}
                    tag="h3"
                    className="text-3xl font-bold text-white mb-4 split-text"
                    splitType="chars"
                    delay={50}
                    threshold={0.2}
                  />
                  <SplitText
                    text={service.description}
                    tag="p"
                    className="text-lg text-gray-200 leading-relaxed split-text"
                    splitType="words"
                    delay={30}
                    threshold={0.2}
                  />
                </div>

                {/* Image */}
                <div
                  className={`${
                    service.reverse ? "md:order-1" : "md:order-2"
                  } relative w-full h-72 md:h-96`}
                >
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover rounded-xl shadow-md"
                  />
                </div>
              </div>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </section>
  );
}
