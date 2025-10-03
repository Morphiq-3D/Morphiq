"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import AnimatedContent from "./AnimatedContent"; 

export default function ProductCarousel({ products }) {
  return (
    <section className="py-20 bg-black px-12">
      <AnimatedContent
        direction="vertical"
        distance={200}      
        duration={1.5}        
        ease="power3.out"
        initialOpacity={0}  
      >
        <div className="container mx-auto px-4 bg-gradient-to-r from-[#1a1a1a] to-[#222] pb-15 rounded-[40px] border border-gray-700 shadow-2xl ">
          <h2 className="text-center text-4xl font-bold text-white mb-12 pt-10">
            Printed Designs
          </h2>

          <Swiper
            modules={[Autoplay]}
            slidesPerView={5} // desktop default
            spaceBetween={20}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              1280: { slidesPerView: 5, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 12 },
              0: {
                slidesPerView: 1,
                spaceBetween: 8,
                centeredSlides: true,
              },
            }}
          >
            {products.map((product, index) => (
              <SwiperSlide key={index}>
                <div className="relative h-90 max-w-[270px] w-[100%] mx-auto rounded-[40px] overflow-hidden shadow-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover rounded-[40px]"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </AnimatedContent>
    </section>
  );
}
