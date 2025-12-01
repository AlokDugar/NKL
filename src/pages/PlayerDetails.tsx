import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Shield,
  Star,
  Activity,
  Users,
  Trophy,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { PLAYERS, TEAMS } from "../data/mockData";
import Layout from "../components/layout/Layout";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PlayerDetails = () => {
  const { playerId } = useParams();
  const player = PLAYERS.find((p) => p.id === parseInt(playerId || "0"));
  const team = TEAMS.find((t) => t.id === player?.teamId);

  // Season Filter State
  const [selectedSeason, setSelectedSeason] = useState("2025");

  if (!player) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Player Not Found</h2>
            <Link
              to="/team"
              className="text-red-500 hover:text-red-400 font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Teams
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Get seasons from history
  const seasons = player.history
    ? player.history.map((h) => h.season)
    : ["2025"];

  // Mock stats for different seasons (in a real app, this would come from the player object)
  const seasonStats =
    selectedSeason === "2025"
      ? player.stats
      : {
          totalPoints: Math.floor((player.stats?.totalPoints || 0) * 0.8),
          raidPoints: Math.floor((player.stats?.raidPoints || 0) * 0.8),
          tacklePoints: Math.floor((player.stats?.tacklePoints || 0) * 0.8),
          totalMatches: Math.floor((player.stats?.totalMatches || 0) * 0.8),
          successfulRaids: Math.floor(
            (player.stats?.successfulRaids || 0) * 0.8
          ),
          superRaids: Math.floor((player.stats?.superRaids || 0) * 0.8),
          successfulTackles: Math.floor(
            (player.stats?.successfulTackles || 0) * 0.8
          ),
          superTackles: Math.floor((player.stats?.superTackles || 0) * 0.8),
          doOrDieRaidPoints: Math.floor(
            (player.stats?.doOrDieRaidPoints || 0) * 0.8
          ),
          allOutsInflicted: Math.floor(
            (player.stats?.allOutsInflicted || 0) * 0.8
          ),
        };

  // Chart Data
  const raidVsTackleData = [
    {
      name: "Raid Points",
      value: seasonStats?.raidPoints || 0,
      color: "#ef4444",
    },
    {
      name: "Tackle Points",
      value: seasonStats?.tacklePoints || 0,
      color: "#3b82f6",
    },
  ];

  const performanceData = [
    {
      name: "Success Rate",
      value: seasonStats?.successfulRaids
        ? (seasonStats.successfulRaids / (seasonStats.raidPoints + 20)) * 100
        : 0,
    }, // Mock calculation
    { name: "Super Raids", value: (seasonStats?.superRaids || 0) * 10 },
    { name: "Super Tackles", value: (seasonStats?.superTackles || 0) * 10 },
    { name: "All Outs", value: (seasonStats?.allOutsInflicted || 0) * 20 },
  ];

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-black text-white font-sans">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to={`/team/${team?.id}`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="uppercase font-bold text-sm tracking-wider">
              Back to {team?.name}
            </span>
          </Link>

          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-white/10 mb-12">
            <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-10 mix-blend-overlay" />

            <div className="grid md:grid-cols-2 gap-8 relative z-10">
              {/* Image Side */}
              <div className="relative h-[500px] md:h-[600px] bg-gradient-to-b from-zinc-800 to-black flex items-end justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-600/20 to-transparent opacity-50" />
                <motion.img
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  src={player.image}
                  alt={player.name}
                  className="h-[90%] object-contain relative z-10 drop-shadow-2xl"
                />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-20" />

                <div className="absolute top-8 left-8 z-30">
                  <div className="text-[120px] font-black text-white/5 leading-none select-none">
                    {player.jersey}
                  </div>
                </div>
              </div>

              {/* Info Side */}
              <div className="p-8 md:p-16 flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r ${
                        player.role.includes("Raider")
                          ? "from-red-600 to-orange-600"
                          : "from-blue-600 to-cyan-600"
                      } text-white shadow-lg`}
                    >
                      {player.role}
                    </span>
                    {player.isCaptain && (
                      <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-yellow-500 text-black flex items-center gap-1 shadow-lg">
                        <Trophy size={12} /> Captain
                      </span>
                    )}
                  </div>

                  <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-2 leading-none">
                    {player.name}
                  </h1>

                  <div className="flex items-center gap-4 mb-8">
                    <div className="text-2xl font-bold text-slate-400">
                      Jersey #{player.jersey}
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                    <div className="text-xl font-bold text-red-500">
                      {team?.name}
                    </div>
                  </div>

                  {/* Season Selector */}
                  <div className="mb-8">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                      Select Season
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {seasons.map((season) => (
                        <button
                          key={season}
                          onClick={() => setSelectedSeason(season)}
                          className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
                            selectedSeason === season
                              ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          Season {season}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Total Points
                      </div>
                      <div className="text-4xl font-black text-white">
                        {seasonStats?.totalPoints || 0}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Matches
                      </div>
                      <div className="text-4xl font-black text-white">
                        {seasonStats?.totalMatches || 0}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Raid Points
                      </div>
                      <div className="text-4xl font-black text-red-500">
                        {seasonStats?.raidPoints || 0}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                      <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                        Tackle Points
                      </div>
                      <div className="text-4xl font-black text-blue-500">
                        {seasonStats?.tacklePoints || 0}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Career Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8 flex items-center gap-4">
              <span className="w-2 h-8 bg-red-600 block skew-x-[-15deg]" />
              Career Timeline
            </h2>

            <div className="relative">
              {/* Line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -ml-0.5 md:ml-0" />

              <div className="space-y-12">
                {player.history?.map((item, index) => {
                  const historyTeam = TEAMS.find((t) => t.id === item.teamId);
                  return (
                    <div
                      key={index}
                      className={`relative flex flex-col md:flex-row gap-8 ${
                        index % 2 === 0 ? "md:flex-row-reverse" : ""
                      }`}
                    >
                      {/* Dot */}
                      <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-red-600 rounded-full border-4 border-black -translate-x-[7px] md:-translate-x-2 mt-6 z-10" />

                      {/* Content */}
                      <div className="flex-1 ml-8 md:ml-0">
                        <div
                          className={`bg-zinc-900 border border-white/10 p-6 rounded-xl hover:border-red-500/50 transition-all group ${
                            index % 2 === 0 ? "md:text-left" : "md:text-right"
                          }`}
                        >
                          <div className="flex items-center gap-4 mb-4 justify-start md:justify-end flex-row-reverse md:flex-row">
                            <span className="text-4xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                              Season {item.season}
                            </span>
                          </div>

                          <div
                            className={`flex items-center gap-4 ${
                              index % 2 === 0
                                ? "md:flex-row"
                                : "md:flex-row-reverse"
                            }`}
                          >
                            <img
                              src={historyTeam?.logo}
                              alt={historyTeam?.name}
                              className="w-16 h-16 object-contain"
                            />
                            <div>
                              <h3 className="text-xl font-bold text-white uppercase">
                                {historyTeam?.name}
                              </h3>
                              <p className="text-slate-400 text-sm">Player</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 hidden md:block" />
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Detailed Stats & Charts */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Stats Table */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 bg-zinc-900/50 rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="p-6 border-b border-white/10 bg-white/5 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
                  <Activity className="text-red-500" /> Detailed Statistics
                </h3>
                <span className="text-xs font-bold bg-white/10 px-3 py-1 rounded-full text-slate-300">
                  Season {selectedSeason}
                </span>
              </div>

              <div className="p-6 grid md:grid-cols-2 gap-x-12 gap-y-6">
                {[
                  {
                    label: "Successful Raids",
                    value: seasonStats?.successfulRaids,
                    icon: Zap,
                    color: "text-yellow-500",
                  },
                  {
                    label: "Super Raids",
                    value: seasonStats?.superRaids,
                    icon: Star,
                    color: "text-orange-500",
                  },
                  {
                    label: "Successful Tackles",
                    value: seasonStats?.successfulTackles,
                    icon: Shield,
                    color: "text-blue-500",
                  },
                  {
                    label: "Super Tackles",
                    value: seasonStats?.superTackles,
                    icon: Shield,
                    color: "text-cyan-500",
                  },
                  {
                    label: "Do or Die Raid Points",
                    value: seasonStats?.doOrDieRaidPoints,
                    icon: Activity,
                    color: "text-red-500",
                  },
                  {
                    label: "All Outs Inflicted",
                    value: seasonStats?.allOutsInflicted,
                    icon: Users,
                    color: "text-purple-500",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <stat.icon size={18} className={stat.color} />
                      <span className="text-sm font-bold text-slate-300 uppercase">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xl font-black text-white">
                      {stat.value || 0}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Charts Column */}
            <div className="space-y-8">
              {/* Pie Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-zinc-900/50 rounded-2xl border border-white/10 p-6"
              >
                <h3 className="text-sm font-black uppercase tracking-wider mb-6 text-center">
                  Points Distribution
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={raidVsTackleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {raidVsTackleData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.color}
                            stroke="rgba(0,0,0,0)"
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#000",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                        itemStyle={{ color: "#fff", fontWeight: "bold" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {raidVsTackleData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-xs font-bold uppercase text-slate-400">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Radar Chart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-zinc-900/50 rounded-2xl border border-white/10 p-6"
              >
                <h3 className="text-sm font-black uppercase tracking-wider mb-6 text-center">
                  Performance Analysis
                </h3>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      cx="50%"
                      cy="50%"
                      outerRadius="70%"
                      data={performanceData}
                    >
                      <PolarGrid stroke="#333" />
                      <PolarAngleAxis
                        dataKey="name"
                        tick={{
                          fill: "#999",
                          fontSize: 10,
                          fontWeight: "bold",
                        }}
                      />
                      <Radar
                        name="Player Stats"
                        dataKey="value"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.4}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#000",
                          border: "1px solid rgba(255,255,255,0.1)",
                          borderRadius: "8px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PlayerDetails;
