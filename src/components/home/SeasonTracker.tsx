"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { SEASON_DATA } from "../../data/mockData";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 25 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay },
});

const SeasonTracker = () => {
  const { topRaider, topDefender, raidStats, tackleStats, overallStats } =
    SEASON_DATA;

  return (
    <section className="min-h-screen bg-black relative overflow-hidden py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-900/20 via-black to-blue-900/20 pointer-events-none" />
      <div className="absolute top-10 left-20 w-72 h-72 bg-red-600/20 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="text-center mb-20">
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-blue-400 font-semibold uppercase tracking-[0.25em] text-xs mb-4">
            Live Statistics
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white uppercase tracking-tight mb-4 drop-shadow-[0_4px_20px_rgba(255,0,0,0.3)]">
            Season 12{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
              Tracker
            </span>
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Real-time PKL performance breakdown powered by enhanced analytics.
          </p>
        </motion.div>

        {/* Top Players */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Top Raider */}
          <motion.div
            {...fadeUp(0.1)}
            className="bg-gradient-to-br from-red-600/30 to-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(255,0,0,.15)] hover:shadow-[0_0_35px_rgba(255,0,0,.35)] transition-all duration-300 group relative"
          >
            <Badge label="Raid" color="red" />

            <PlayerImage image={topRaider.image} />

            <StatCardTitle color="red" title="Top Raider" />

            <h3 className="text-3xl font-extrabold text-white mb-2 group-hover:text-red-300 transition-all">
              {topRaider.name}
            </h3>

            <GradientNumber
              value={topRaider.points}
              gradient="from-red-400 to-orange-500"
            />

            <p className="text-gray-400 text-sm mt-2">Raid Points</p>
          </motion.div>

          {/* Top Defender */}
          <motion.div
            {...fadeUp(0.2)}
            className="bg-gradient-to-br from-blue-600/30 to-blue-900/20 border border-blue-500/30 rounded-xl p-6 backdrop-blur-xl shadow-[0_0_20px_rgba(0,120,255,.15)] hover:shadow-[0_0_35px_rgba(0,120,255,.35)] transition-all duration-300 group relative"
          >
            <Badge label="Defense" color="blue" />

            <PlayerImage image={topDefender.image} />

            <StatCardTitle color="blue" title="Top Defender" />

            <h3 className="text-3xl font-extrabold text-white mb-2 group-hover:text-blue-300 transition-all">
              {topDefender.name}
            </h3>

            <GradientNumber
              value={topDefender.points}
              gradient="from-blue-400 to-cyan-500"
            />

            <p className="text-gray-400 text-sm mt-2">Tackle Points</p>
          </motion.div>
        </div>

        {/* Raid Points */}
        <SectionHeader
          title="Raid Points"
          accent="from-red-500 to-orange-500"
        />
        <StatGrid data={raidStats} highlightColor="red" delayStart={0.25} />

        {/* Tackle Points */}
        <SectionHeader
          title="Tackle Points"
          accent="from-blue-500 to-cyan-500"
          mt="mt-20"
        />
        <StatGrid
          data={tackleStats}
          highlightColor="blue"
          delayStart={0.45}
          cols="lg:grid-cols-3"
        />

        {/* Overall Statistics */}
        <motion.div {...fadeUp(0.7)} className="mt-20">
          <div className="flex items-center gap-3 mb-8">
            <TrendingUp size={32} className="text-white" />
            <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">
              Overall Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {overallStats.map((stat, idx) => (
              <motion.div
                key={idx}
                {...fadeUp(0.75 + idx * 0.07)}
                className="bg-white/10 border border-white/20 rounded-xl p-6 backdrop-blur-xl hover:border-white/40 hover:shadow-[0_0_25px_rgba(255,255,255,.25)] transition-all duration-300 group hover:scale-[1.03]"
              >
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
                  {stat.label}
                </p>

                <p className="text-5xl font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:via-blue-500 group-hover:to-blue-500 transition-all">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Badge = ({ label, color }: any) => (
  <div
    className={`absolute top-4 right-4 flex items-center gap-2 bg-${color}-500/20 backdrop-blur px-4 py-1 rounded-full border border-${color}-500/40`}
  >
    <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-pulse`} />
    <span
      className={`text-xs font-bold uppercase tracking-widest text-${color}-300`}
    >
      {label}
    </span>
  </div>
);

const PlayerImage = ({ image }: any) => (
  <div className="relative mb-6 h-48 rounded-lg overflow-hidden">
    <img
      src={image || "/placeholder.svg"}
      alt="Player"
      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
  </div>
);

const StatCardTitle = ({ title, color }: any) => (
  <p
    className={`text-${color}-300 text-xs uppercase tracking-widest font-semibold mb-2`}
  >
    {title}
  </p>
);

const GradientNumber = ({ value, gradient }: any) => (
  <p
    className={`text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}
  >
    {value}
  </p>
);

const SectionHeader = ({ title, accent, mt = "mt-0" }: any) => (
  <motion.div
    {...fadeUp(0.15)}
    className={`flex items-center gap-3 mb-8 ${mt}`}
  >
    <div className={`w-1 h-8 bg-gradient-to-b ${accent} rounded-full`} />
    <h2 className="text-4xl font-extrabold text-white uppercase tracking-tight">
      {title}
    </h2>
  </motion.div>
);

const StatGrid = ({
  data,
  highlightColor,
  delayStart,
  cols = "lg:grid-cols-5",
}: any) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 ${cols} gap-6 mb-16`}>
    {data.map((stat: any, idx: number) => (
      <motion.div
        key={idx}
        {...fadeUp(delayStart + idx * 0.05)}
        className={`rounded-xl p-6 backdrop-blur-xl border transition-all duration-300 hover:scale-[1.05] cursor-pointer group ${
          stat.highlight
            ? `bg-${highlightColor}-600/30 border-${highlightColor}-500/40 shadow-[0_0_20px_rgba(255,0,0,.2)]`
            : "bg-white/10 border-white/20"
        }`}
      >
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">
          {stat.label}
        </p>

        <p
          className={`text-4xl font-extrabold group-hover:scale-110 transition-transform ${
            stat.highlight
              ? `text-transparent bg-clip-text bg-gradient-to-r from-${highlightColor}-400 to-${highlightColor}-600`
              : "text-white"
          }`}
        >
          {stat.value}
        </p>
      </motion.div>
    ))}
  </div>
);

export default SeasonTracker;
