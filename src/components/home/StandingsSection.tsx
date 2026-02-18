import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowRight } from "lucide-react";

interface Game {
  id: number;
  match_number: string;
  winner_id: number;
  status: number;
  first_half_start_time: string;
  second_half_end_time: string;
  total_points: number;
  total_score_diff: number;
  stat: string;
}

interface Team {
  id: number;
  logo: string;
  name: string;
  slug: string;
  primary_color: string;
  total_points: number;
  total_score_diff: number;
  total_matches: number;
  total_wins: number;
  total_draws: number;
  total_losses: number;
  games: Game[];
  previous_game?: Game | null;
  next_game?: Game | null;
}

const StandingsSection = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/standings`)
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data || []).sort(
          (a: Team, b: Team) => b.total_points - a.total_points,
        );
        setTeams(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-slate-950 relative overflow-hidden">
      {/* ── Background — same palette as footer, glows bleed downward ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Matches the footer's top-left/top-right glow pattern so they feel continuous */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        {/* Fade at the very bottom so it dissolves into footer */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-slate-950" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-bold uppercase tracking-widest text-sm block mb-2"
            >
              Leaderboard
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter"
            >
              League{" "}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600 pr-1">
                Standings
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link
              to="/standings"
              className="group flex items-center gap-2 text-white font-bold uppercase tracking-wider hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-500 hover:to-blue-500 transition-all"
            >
              View Full Table
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform text-red-500 group-hover:text-blue-500"
              />
            </Link>
          </motion.div>
        </div>

        {/* Table */}
        <div className="bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_60px_-15px_rgba(220,38,38,0.15),0_0_60px_-15px_rgba(37,99,235,0.15)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-red-900/20 to-blue-900/20 text-slate-400 text-xs uppercase tracking-wider border-b border-white/10">
                  <th className="p-6 font-bold">Pos</th>
                  <th className="p-6 font-bold">Team</th>
                  <th className="p-6 font-bold text-center">P</th>
                  <th className="p-6 font-bold text-center">W</th>
                  <th className="p-6 font-bold text-center">L</th>
                  <th className="p-6 font-bold text-center">D</th>
                  <th className="p-6 font-bold text-center">Pts</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      Loading standings...
                    </td>
                  </tr>
                ) : teams.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      No data found
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <motion.tr
                      key={team.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 last:border-0 hover:bg-gradient-to-r hover:from-red-900/10 hover:to-blue-900/10 transition-colors group"
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${
                              index < 4
                                ? "bg-green-500/15 border border-green-500/50 text-green-400"
                                : "bg-white/10 text-white"
                            }`}
                          >
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform drop-shadow-md"
                          />
                          <span className="font-bold text-white uppercase tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 transition-all">
                            {team.name}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-center text-slate-300 font-medium">
                        {team.total_matches}
                      </td>
                      <td className="p-6 text-center text-green-400 font-bold">
                        {team.total_wins}
                      </td>
                      <td className="p-6 text-center text-red-400 font-bold">
                        {team.total_losses}
                      </td>
                      <td className="p-6 text-center text-slate-300 font-medium">
                        {team.total_draws}
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                          <CountUp
                            end={team.total_points}
                            duration={2}
                            enableScrollSpy
                          />
                        </span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StandingsSection;
