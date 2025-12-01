import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { HERO_IMAGES } from "../../data/mockData";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class="${className} w-3 h-3"></span>`;
          },
        }}
        loop={true}
        className="h-full w-full"
      >
        {HERO_IMAGES.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              {/* Background */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${image})` }}
              >
                {/* NKL-style overlays */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              </div>

              {/* CONTENT */}
              <div className="relative h-full w-full flex flex-col justify-end pb-20 z-10 px-6 md:px-20">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-full max-w-full md:max-w-6xl"
                >
                  {/* Season Tag + Subtitle */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-sm">
                      Season 2025
                    </span>
                    <span className="text-white/80 text-sm font-medium tracking-wider uppercase border-l-2 border-red-600 pl-3">
                      The Ultimate Battle Begins
                    </span>
                  </div>

                  {/* Heading */}
                  <h1 className="text-5xl md:text-7xl font-black text-white uppercase leading-[0.9] tracking-tighter mb-6 break-words">
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">
                      UNLEASH
                    </span>
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 bg-[length:100%_100%]">
                      WARRIOR
                    </span>
                  </h1>

                  {/* Button */}
                  <button className="flex items-center gap-2 bg-black/90 text-white px-6 py-3 rounded-md font-semibold text-sm md:text-base hover:bg-black transition-all duration-300 w-fit shadow-lg">
                    <Play size={18} />
                    Watch Highlights
                  </button>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient Bullet Styles */}
      <style>
        {`
          .swiper-pagination-bullet {
            @apply w-3 h-3 rounded-full opacity-70 transition-all duration-300;
            background: linear-gradient(to right, #dc2626, #2563eb);
          }

          .swiper-pagination-bullet-active {
            @apply opacity-100 scale-125;
            background: linear-gradient(to right, #ef4444, #3b82f6);
          }
        `}
      </style>
    </section>
  );
};

export default Hero;
