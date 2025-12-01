import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  Trophy,
  Users,
  Activity,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { MATCHES, TEAMS, PLAYERS } from "../data/mockData";
import Layout from "../components/layout/Layout";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

const MatchDetails = () => {
  const { matchId } = useParams();
  const [showMVP, setShowMVP] = useState(false);

  const match = MATCHES.find((m) => m.id === matchId);
  const team1 = TEAMS.find((t) => t.id === match?.team1);
  const team2 = TEAMS.find((t) => t.id === match?.team2);

  // Starting lineups (first 7 players per team)
  const team1Lineup = PLAYERS.filter((p) => p.teamId === match?.team1).slice(
    0,
    7
  );
  const team2Lineup = PLAYERS.filter((p) => p.teamId === match?.team2).slice(
    0,
    7
  );

  if (!match || !team1 || !team2) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Match Not Found</h2>
            <Link
              to="/schedule"
              className="text-red-500 hover:text-red-400 font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Schedule
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Mock Chart Data
  const pointsComparisonData = [
    {
      name: "Raid Pts",
      [team1.name]: match.stats?.team1.raidPoints || 0,
      [team2.name]: match.stats?.team2.raidPoints || 0,
    },
    {
      name: "Tackle Pts",
      [team1.name]: match.stats?.team1.tacklePoints || 0,
      [team2.name]: match.stats?.team2.tacklePoints || 0,
    },
    {
      name: "All Out Pts",
      [team1.name]: match.stats?.team1.allOutPoints || 0,
      [team2.name]: match.stats?.team2.allOutPoints || 0,
    },
    {
      name: "Extras",
      [team1.name]: match.stats?.team1.extraPoints || 0,
      [team2.name]: match.stats?.team2.extraPoints || 0,
    },
  ];

  const momentumData = [
    { time: "0'", team1: 0, team2: 0 },
    { time: "10'", team1: 12, team2: 8 },
    { time: "20'", team1: 24, team2: 18 },
    { time: "30'", team1: 35, team2: 28 },
    { time: "40'", team1: match.score1, team2: match.score2 },
  ];

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-black text-white font-sans">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to="/schedule"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="uppercase font-bold text-sm tracking-wider">
              Back to Schedule
            </span>
          </Link>

          {/* Match Hero */}
          <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 mb-12 p-8 md:p-16">
            <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-5 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="bg-red-600 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/50">
                  {match.type}
                </span>
                <span className="bg-white/10 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white">
                  {match.status}
                </span>
              </motion.div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full mb-12">
                {/* Team 1 */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-black/40 rounded-full p-6 border-4 border-white/5 group-hover:border-red-500/50 transition-all duration-500 mb-6 relative">
                    <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={team1.logo}
                      alt={team1.name}
                      className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">
                    {team1.name}
                  </h2>
                  <div className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {match.score1}
                  </div>
                </motion.div>

                {/* VS */}
                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl font-black text-slate-600 italic">
                    VS
                  </div>
                  <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-600 to-transparent" />
                </div>

                {/* Team 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-black/40 rounded-full p-6 border-4 border-white/5 group-hover:border-blue-500/50 transition-all duration-500 mb-6 relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <img
                      src={team2.logo}
                      alt={team2.name}
                      className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">
                    {team2.name}
                  </h2>
                  <div className="text-6xl md:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {match.score2}
                  </div>
                </motion.div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-slate-400 text-sm font-bold uppercase tracking-wider bg-black/40 px-8 py-4 rounded-full border border-white/10 backdrop-blur-sm">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" /> {match.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500" /> {match.time}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> {match.venue}
                </span>
              </div>

              {/* MVP Button */}
              {match.mvp && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMVP(true)}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-black uppercase tracking-widest text-black shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  <Trophy size={18} /> View Match MVP
                </motion.button>
              )}
            </div>
          </div>

          {/* Match Stats & Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Comparison Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-zinc-900/50 rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                <Activity className="text-red-500" /> Stats Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={pointsComparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#666"
                    tick={{ fill: "#999", fontSize: 12, fontWeight: "bold" }}
                  />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  />
                  <Bar
                    dataKey={team1.name}
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey={team2.name}
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Momentum Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-zinc-900/50 rounded-2xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-500" /> Match Momentum
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={momentumData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTeam1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTeam2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#666" />
                  <YAxis stroke="#666" />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#333"
                    vertical={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#000",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="team1"
                    stroke="#ef4444"
                    fillOpacity={1}
                    fill="url(#colorTeam1)"
                    name={team1.name}
                  />
                  <Area
                    type="monotone"
                    dataKey="team2"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorTeam2)"
                    name={team2.name}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Lineups */}
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-black uppercase italic text-white">
                  {team1.name}
                </h3>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Starting 7
                </span>
              </div>
              <div className="space-y-4">
                {team1Lineup.map((player, i) => (
                  <Link to={`/player/${player.id}`} key={player.id}>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl hover:bg-zinc-800 hover:border-red-500/30 transition-all mb-3 group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white group-hover:text-red-500 transition-colors">
                          {player.name}
                        </h4>
                        <p className="text-xs text-slate-400 uppercase font-bold">
                          {player.role}
                        </p>
                      </div>
                      <div className="text-2xl font-black text-white/10 group-hover:text-white/20">
                        #{player.jersey}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h3 className="text-2xl font-black uppercase italic text-white">
                  {team2.name}
                </h3>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                  Starting 7
                </span>
              </div>
              <div className="space-y-4">
                {team2Lineup.map((player, i) => (
                  <Link to={`/player/${player.id}`} key={player.id}>
                    <motion.div
                      whileHover={{ x: 10 }}
                      className="flex items-center gap-4 p-4 bg-zinc-900/50 border border-white/5 rounded-xl hover:bg-zinc-800 hover:border-blue-500/30 transition-all mb-3 group"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black">
                        <img
                          src={player.image}
                          alt={player.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white group-hover:text-blue-500 transition-colors">
                          {player.name}
                        </h4>
                        <p className="text-xs text-slate-400 uppercase font-bold">
                          {player.role}
                        </p>
                      </div>
                      <div className="text-2xl font-black text-white/10 group-hover:text-white/20">
                        #{player.jersey}
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* MVP Modal */}
      <AnimatePresence>
        {showMVP && match.mvp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMVP(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotateX: -90 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-yellow-500/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)]"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowMVP(false)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="relative h-[500px] flex flex-col items-center justify-end pb-12">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl" />

                {/* Player Image */}
                <motion.img
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  src={match.mvp.image}
                  alt={match.mvp.name}
                  className="absolute top-0 h-[80%] object-contain z-10 drop-shadow-2xl"
                />

                {/* Text Content */}
                <div className="relative z-20 text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-2"
                  >
                    <span className="px-4 py-1 bg-yellow-500 text-black text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-yellow-500/50">
                      Match MVP
                    </span>
                  </motion.div>

                  <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-3xl font-black uppercase italic text-white mb-2 px-8"
                  >
                    {match.mvp.name}
                  </motion.h2>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center justify-center gap-8 mt-6"
                  >
                    <div className="text-center">
                      <div className="text-4xl font-black text-yellow-500">
                        {match.mvp.points}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Total Points
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default MatchDetails;
