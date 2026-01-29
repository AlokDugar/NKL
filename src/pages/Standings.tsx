import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import FormBadge from "../components/standings/FormBadge";
import PointSystemCard from "../components/standings/PointSystemCard";

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

const getFormFromGames = (
  games: Game[],
  teamId: number
): ("W" | "L" | "D")[] => {
  if (!games || games.length === 0) return [];
  return games.slice(0, 5).map((game) => {
    if (game.stat.toLowerCase() === "draw" || game.winner_id === 0) return "D";
    if (game.winner_id === teamId) return "W";
    return "L";
  });
};

const Standings = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api-v1.nepalkabaddileague.com/api/standings")
      .then((res) => res.json())
      .then((data) => {
        const sorted = (data.data || []).sort(
          (a: Team, b: Team) => b.total_points - a.total_points
        );
        setTeams(sorted);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-4">
              <span className="inline-block pr-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 [text-shadow:0.06em_0_0_transparent]">
                League Standings
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 transform -skew-x-12" />
          </motion.div>

          {/* Standings Table */}
          <div className="max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/10 mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-black to-slate-900 text-white text-sm uppercase tracking-wider border-b border-white/10">
                    <th className="py-4 px-6 text-left font-bold">Pos</th>
                    <th className="py-4 px-6 text-left font-bold">Team</th>
                    <th className="py-4 px-6 text-center font-bold">P</th>
                    <th className="py-4 px-6 text-center font-bold">W</th>
                    <th className="py-4 px-6 text-center font-bold">L</th>
                    <th className="py-4 px-6 text-center font-bold">D</th>
                    <th className="py-4 px-6 text-center font-bold">SD</th>
                    <th className="py-4 px-6 text-center font-bold">Pts</th>
                    <th className="py-4 px-6 text-center font-bold">Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-white">
                        Loading standings...
                      </td>
                    </tr>
                  ) : teams.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-6 text-center text-white">
                        No data found
                      </td>
                    </tr>
                  ) : (
                    teams.map((team, index) => {
                      const form = getFormFromGames(team.games, team.id);
                      return (
                        <motion.tr
                          key={team.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-white/5 transition-colors group"
                        >
                          {/* Position */}
                          <td className="py-4 px-6">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                index < 4
                                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {index + 1}
                            </div>
                          </td>

                          {/* Team */}
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 relative group-hover:scale-110 transition-transform duration-300">
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-full h-full object-contain drop-shadow-md"
                                />
                              </div>
                              <span className="font-bold text-slate-200 uppercase group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 transition-all">
                                {team.name}
                              </span>
                            </div>
                          </td>

                          {/* Matches */}
                          <td className="py-4 px-6 text-center font-medium text-slate-400">
                            {team.total_matches}
                          </td>
                          <td className="py-4 px-6 text-center font-medium text-green-500">
                            {team.total_wins}
                          </td>
                          <td className="py-4 px-6 text-center font-medium text-red-500">
                            {team.total_losses}
                          </td>
                          <td className="py-4 px-6 text-center font-medium text-slate-400">
                            {team.total_draws}
                          </td>

                          {/* Score Difference */}
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`font-bold ${
                                team.total_score_diff > 0
                                  ? "text-emerald-400"
                                  : team.total_score_diff < 0
                                  ? "text-red-400"
                                  : "text-slate-400"
                              }`}
                            >
                              {team.total_score_diff > 0 ? "+" : ""}
                              {team.total_score_diff}
                            </span>
                          </td>

                          {/* Points */}
                          <td className="py-4 px-6 text-center">
                            <span className="text-xl font-black text-white">
                              {team.total_points}
                            </span>
                          </td>

                          {/* Form */}
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-1">
                              {form.length > 0 ? (
                                form.map((result, i) => (
                                  <FormBadge key={i} result={result} />
                                ))
                              ) : (
                                <span className="text-xs text-slate-400">
                                  -
                                </span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="bg-black/20 px-6 py-4 border-t border-white/5 flex items-center space-x-6 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                Qualify for Playoffs
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">SD</span>= Score Difference
              </div>
            </div>
          </div>

          {/* Point System Card */}
          <div className="max-w-5xl mx-auto">
            <PointSystemCard />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Standings;
