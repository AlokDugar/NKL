import React from "react";
import { motion } from "framer-motion";
import { TEAMS } from "../../data/mockData";
import { Trophy } from "lucide-react";

const ReigningChampions = () => {
  const champion = TEAMS.find((t) => t.id === "janakpur-knights") || TEAMS[0];

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Golden Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-900/20 via-black to-black pointer-events-none" />

      {/* BIG GOLDEN GLOW BEHIND ENTIRE COMPONENT */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[90vw] h-[90vw]
                   bg-yellow-500/10 blur-[150px] rounded-full pointer-events-none"
      />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100, x: Math.random() * 100 }}
            animate={{
              opacity: [0, 1, 0],
              y: -100,
              x: Math.random() * 100 - 50,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute bottom-0 w-2 h-2 bg-yellow-500 rounded-full blur-sm"
            style={{ left: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-12"
          >
            Reigning{" "}
            <span className="inline-block px-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-600">
              Champions
            </span>
          </motion.h2>

          {/* Champion Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group"
          >
            {/* Glow Behind Card */}
            <div
              className="absolute inset-0 bg-yellow-500/20 rounded-full blur-[100px] 
                            group-hover:bg-yellow-500/30 transition-all duration-700"
            />

            <div className="relative z-10 flex flex-col items-center">
              {/* Trophy with Golden Glow */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-8 relative flex items-center justify-center"
              >
                {/* Pulsing Golden Glow Behind Trophy */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute w-52 h-52 md:w-72 md:h-72 rounded-full 
                             bg-yellow-500/20 blur-3xl -z-10"
                />

                <Trophy
                  size={120}
                  className="text-yellow-400 drop-shadow-[0_0_40px_rgba(250,204,21,0.8)]"
                />
              </motion.div>

              {/* Team Logo */}
              <div className="w-32 h-32 md:w-48 md:h-48 mb-6 relative">
                <img
                  src={champion.logo}
                  alt={champion.name}
                  className="w-full h-full object-contain drop-shadow-2xl 
                             transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Team Name */}
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                {champion.name}
              </h3>

              <p className="text-gray-400 max-w-2xl text-sm md:text-base leading-relaxed">
                Dominating the mat with unparalleled skill and strategy,{" "}
                {champion.name} rose above all to claim the ultimate glory in
                Season 2024. A victory etched in history!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ReigningChampions;
