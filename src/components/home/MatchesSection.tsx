import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MATCHES, TEAMS } from "../../data/mockData";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import clsx from "clsx";

const MatchesSection = () => {
  const getTeam = (id: string) => TEAMS.find((t) => t.id === id);

  return (
    <section className="relative py-24 overflow-hidden bg-black">
      {/* 🔥 Isolated Red–Blue Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/20 to-black" />
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full opacity-40" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full opacity-40" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* ---------- HEADER ---------- */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 
                       font-bold uppercase tracking-[0.2em] text-sm"
          >
            Action Packed
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mt-2 uppercase"
          >
            Match{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600">
              Center
            </span>
          </motion.h2>
        </div>

        {/* ---------- MATCH LIST ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {MATCHES.map((match, index) => {
            const team1 = getTeam(match.team1);
            const team2 = getTeam(match.team2);
            if (!team1 || !team2) return null;

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl bg-zinc-900/60 border border-white/10 
                           overflow-hidden group hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.3)] 
                           transition-all duration-300"
              >
                {/* Hover Gradient Border */}
                <div
                  className="absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100
                                bg-gradient-to-r from-red-500 to-blue-500 transition-all"
                />

                {/* Header */}
                <div
                  className="relative z-10 bg-white/5 px-6 py-4 border-b border-white/10 
                                flex items-center justify-between"
                >
                  <span
                    className="text-xs font-bold uppercase tracking-wider 
                                   bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400"
                  >
                    {match.type}
                  </span>
                  <div className="flex items-center gap-4 text-gray-300 text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-blue-500" />
                      {match.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-red-500" />
                      {match.venue}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-10">
                  {/* Faded VS */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                    <span
                      className="text-[160px] font-black bg-gradient-to-r from-red-500 to-blue-600 
                                     bg-clip-text text-transparent"
                    >
                      VS
                    </span>
                  </div>

                  <div className="relative flex items-center justify-between">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center flex-1 gap-4">
                      <div className="relative w-24 h-24">
                        <div
                          className="absolute inset-0 bg-red-500/20 blur-xl rounded-full 
                                        group-hover:bg-red-500/30 transition-all"
                        />
                        <img
                          src={team1.logo}
                          alt={team1.name}
                          className="relative z-10 w-full h-full object-contain drop-shadow-2xl
                                     transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="text-white font-bold text-sm md:text-base uppercase text-center">
                        {team1.name}
                      </h3>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center px-6">
                      <div className="flex items-center gap-6 mb-2">
                        <span
                          className={clsx(
                            "text-5xl md:text-6xl font-black",
                            match.score1 > match.score2
                              ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                              : "text-gray-600"
                          )}
                        >
                          {match.score1}
                        </span>
                        <span
                          className="text-3xl bg-clip-text text-transparent 
                                         bg-gradient-to-br from-red-500 to-blue-600"
                        >
                          :
                        </span>
                        <span
                          className={clsx(
                            "text-5xl md:text-6xl font-black",
                            match.score2 > match.score1
                              ? "text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                              : "text-gray-600"
                          )}
                        >
                          {match.score2}
                        </span>
                      </div>

                      <span
                        className="px-4 py-1 text-xs font-bold rounded-full uppercase 
                                       bg-gradient-to-r from-red-600 to-blue-600 text-white"
                      >
                        {match.status}
                      </span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center flex-1 gap-4">
                      <div className="relative w-24 h-24">
                        <div
                          className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full 
                                        group-hover:bg-blue-500/30 transition-all"
                        />
                        <img
                          src={team2.logo}
                          alt={team2.name}
                          className="relative z-10 w-full h-full object-contain drop-shadow-2xl
                                     transition-transform duration-500 group-hover:scale-110"
                        />
                      </div>
                      <h3 className="text-white font-bold text-sm md:text-base uppercase text-center">
                        {team2.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="relative z-10 bg-white/5 px-6 py-4 border-t border-white/10 
                                group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-blue-600 
                                transition-all"
                >
                  <Link
                    to="/schedule"
                    className="flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest"
                  >
                    View Match Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-14">
          <Link
            to="/schedule"
            className="inline-block border border-white/20 px-10 py-3 rounded-full font-bold uppercase 
                       tracking-wider text-white hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 
                       hover:border-transparent transition-all shadow-lg"
          >
            View Full Schedule
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MatchesSection;
