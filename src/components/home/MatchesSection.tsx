import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { fetchMatches, type Match } from "../../api";

const typePriority: Record<string, number> = {
  Final: 1,
  "Semi Final": 2,
  "Quarter Final": 3,
  Qualifier: 4,
  Eliminator: 5,
  League: 6,
};

const MatchesSection = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches()
      .then((data) => {
        const sorted = [...data].sort((a, b) => {
          const pA = typePriority[a.type] ?? 10;
          const pB = typePriority[b.type] ?? 10;
          if (pA !== pB) return pA - pB;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setMatches(sorted.slice(0, 6));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-black text-center text-white">
        <div className="flex items-center justify-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
          <span className="text-lg font-medium">Loading matches...</span>
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-24 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/20 to-black" />
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full opacity-40" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full opacity-40" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-bold uppercase tracking-[0.2em] text-sm"
          >
            Action Packed
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white mt-2 uppercase"
          >
            Match{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600">
              Center
            </span>
          </motion.h2>
        </div>

        {/* Match Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {matches.map((match, index) => {
            const s1 = Number(match.details?.first_team_score ?? 0);
            const s2 = Number(match.details?.second_team_score ?? 0);
            const statusLabel =
              match.details?.status === 1
                ? "Finished"
                : s1 === s2
                  ? "Draw"
                  : "Live";

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl bg-zinc-900/60 border border-white/10 overflow-hidden group
                           hover:shadow-[0_0_40px_-5px_rgba(255,0,0,0.3)] transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-2xl p-[1px] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-red-500 to-blue-500" />

                <div className="relative z-10 bg-white/5 px-6 py-4 border-b border-white/10 flex justify-between">
                  <span className="text-xs font-bold uppercase bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-blue-400">
                    {match.type}
                  </span>
                  <div className="flex gap-4 text-xs text-gray-300">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-blue-500" />
                      {match.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-red-500" />
                      {match.stadium?.name || "TBD"}
                    </span>
                  </div>
                </div>

                <div className="relative p-10">
                  <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
                    <span className="text-[160px] font-black bg-gradient-to-r from-red-500 to-blue-600 bg-clip-text text-transparent">
                      VS
                    </span>
                  </div>

                  <div className="relative flex items-center justify-between">
                    <TeamBlock team={match.first_team} glow="red" />

                    <div className="flex flex-col items-center px-6">
                      <div className="flex gap-6 mb-2">
                        <span
                          className={clsx(
                            "text-5xl font-black",
                            s1 > s2 ? "text-white" : "text-gray-600",
                          )}
                        >
                          {s1}
                        </span>
                        <span className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-blue-600">
                          :
                        </span>
                        <span
                          className={clsx(
                            "text-5xl font-black",
                            s2 > s1 ? "text-white" : "text-gray-600",
                          )}
                        >
                          {s2}
                        </span>
                      </div>
                      <span className="px-4 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-red-600 to-blue-600 text-white">
                        {statusLabel}
                      </span>
                    </div>

                    <TeamBlock team={match.second_team} glow="blue" />
                  </div>
                </div>

                <div className="relative z-10 bg-white/5 px-6 py-4 border-t border-white/10 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-blue-600 transition-all flex justify-center">
                  <Link
                    to={`/matches/${match.id}`}
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

        <div className="text-center mt-14">
          <Link
            to="/schedule"
            className="inline-block border border-white/20 px-10 py-3 rounded-full font-bold uppercase text-white
                       hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 transition-all shadow-lg"
          >
            View Full Schedule
          </Link>
        </div>
      </div>
    </section>
  );
};

const TeamBlock = ({
  team,
  glow,
}: {
  team: { name: string; logo: string };
  glow: "red" | "blue";
}) => (
  <div className="flex flex-col items-center flex-1 gap-4">
    <div className="relative w-24 h-24">
      <div
        className={`absolute inset-0 ${
          glow === "red" ? "bg-red-500/20" : "bg-blue-500/20"
        } blur-xl rounded-full`}
      />
      <img
        src={team.logo}
        alt={team.name}
        className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
      />
    </div>
    <h3 className="text-white font-bold uppercase text-center text-sm md:text-base">
      {team.name}
    </h3>
  </div>
);

export default MatchesSection;
