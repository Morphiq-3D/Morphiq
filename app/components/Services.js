"use client";
import Image from "next/image";
import AnimatedContent from "./AnimatedContent"; 
import SplitText from "./SplitText"; 

export default function Services() {
  const services = [
    {
      title: "Custom 3D Modeling",
      description:
        "Our team crafts precise 3D models tailored to your vision, combining creativity with technical accuracy. From initial sketches to detailed digital prototypes, we bring your ideas to life in three dimensions.",
      image: "/service1.jpg",
      reverse: false,
    },
    {
      title: "Rapid Prototyping",
      description:
        "Quickly transform your concepts into functional prototypes using our advanced 3D printing techniques. We prioritize speed without compromising quality, helping you test, iterate, and refine your designs efficiently.",
      image: "/service2.jpg",
      reverse: true,
    },
    {
      title: "High-Quality Production",
      description:
        "We deliver durable, production-ready 3D prints using premium materials and meticulous processes. Every product is engineered for performance, precision, and lasting quality, ensuring your final output meets the highest standards.",
      image: "/service3.jpg",
      reverse: false,
    },
  ];

  return (
    <section className="py-20 bg-black">
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
                el.classList.add("animate-split"); 
              });
            }}
          >
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              {/* Content */}
              <div
                className={`relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center p-8`}
                data-service={index}
              >
                {/* Text */}
                <div
                  className={`${
                    service.reverse
                      ? "md:order-2 order-2"  // desktop: right, mobile: bottom
                      : "md:order-1 order-2"  // desktop: left, mobile: bottom
                  }`}
                >
                  <SplitText
                    text={service.title}
                    tag="h3"
                    className="text-3xl font-bold text-white mb-4 split-text "
                    splitType="chars"
                    delay={50}
                    threshold={0.2}
                  />
                  <SplitText
                    text={service.description}
                    tag="p"
                    className="text-lg text-gray-200 leading-relaxed split-text "
                    splitType="words"
                    delay={30}
                    threshold={0.2}
                  />
                </div>

                {/* Image */}
                <div
                  className={`${
                    service.reverse
                      ? "md:order-1 order-1"  // desktop: left, mobile: top
                      : "md:order-2 order-1"  // desktop: right, mobile: top
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
