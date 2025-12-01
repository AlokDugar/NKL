import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TEAMS, PLAYERS } from "../data/mockData";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Swords,
  Shield,
  Users,
  Trophy,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";

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
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

// Remove grey hover background on Recharts bar
const chartStyles = `
  .recharts-default-tooltip { background: rgba(0,0,0,0.85) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 8px !important; }
  .recharts-tooltip-label { color: #fff !important; font-weight: bold !important; }
  .recharts-tooltip-item { color: #ccc !important; }
  .recharts-bar-rectangle:hover { fill-opacity: 1 !important; }
  .recharts-sector:hover { fill-opacity: 1 !important; }
  .recharts-active-bar { fill: none !important; }
  .recharts-bar:hover { fill: none !important; }
`;

type SeasonStats = {
  overall: {
    played: number;
    won: number;
    draw: number;
    lost: number;
    rank: number;
  };
  attack: {
    totalRaids: number;
    successfulRaids: number;
    successRate: number;
    superRaids: number;
    totalRaidPoints: number;
  };
  defence: {
    totalTackles: number;
    successfulTackles: number;
    successRate: number;
    superTackles: number;
    totalDefencePoints: number;
  };
};

const TeamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const team = TEAMS.find((t) => t.id === id);
  const teamPlayers = PLAYERS.filter((p) => p.teamId === id);

  const [activeTab, setActiveTab] = useState<
    "overview" | "players" | "stats" | "news" | "photos"
  >("overview");

  // Season filter
  const seasons = team?.statsBySeason ? Object.keys(team.statsBySeason) : [];

  const [selectedSeason, setSelectedSeason] = useState(
    seasons.length > 0 ? seasons[0] : ""
  );

  const seasonStats: SeasonStats | null =
    selectedSeason && team?.statsBySeason
      ? (team.statsBySeason[selectedSeason] as SeasonStats)
      : null;

  if (!team) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>
          <Link to="/" className="text-red-500 hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Chart Data
  const barData = seasonStats
    ? [
        {
          label: "Matches",
          value: seasonStats.overall.played,
          fill: "#3b82f6",
        },
        { label: "Wins", value: seasonStats.overall.won, fill: "#22c55e" },
        { label: "Losses", value: seasonStats.overall.lost, fill: "#ef4444" },
        { label: "Draws", value: seasonStats.overall.draw, fill: "#eab308" },
      ]
    : [];

  const pointsData = seasonStats
    ? [
        {
          name: "Raid Pts",
          value: seasonStats.attack.totalRaidPoints,
          fill: "#ef4444",
        },
        {
          name: "Tackle Pts",
          value: seasonStats.defence.totalDefencePoints,
          fill: "#3b82f6",
        },
      ]
    : [];

  const radarData = seasonStats
    ? [
        {
          category: "Raid Success",
          value: seasonStats.attack.successRate,
          fullMark: 100,
        },
        {
          category: "Tackle Success",
          value: seasonStats.defence.successRate,
          fullMark: 100,
        },
        {
          category: "Win Rate",
          value: (seasonStats.overall.won / seasonStats.overall.played) * 100,
          fullMark: 100,
        },
        {
          category: "Super Raids",
          value: seasonStats.attack.superRaids * 5,
          fullMark: 100,
        }, // Scaled for visual
        {
          category: "Super Tackles",
          value: seasonStats.defence.superTackles * 5,
          fullMark: 100,
        }, // Scaled for visual
      ]
    : [];

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <style>{chartStyles}</style>

      <Header />

      {/* HERO */}
      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-bottom bg-no-repeat bg-contain opacity-60 translate-y-10 ..."
          style={{ backgroundImage: `url(${team.banner || team.logo})` }}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
          <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring" }}
            >
              <div className="w-32 h-32 md:w-48 md:h-48 bg-black/40 backdrop-blur-xl rounded-full p-4 border-4 border-red-600/40 shadow-[0_0_40px_rgba(220,38,38,0.6)] flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                />
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex-1 mb-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-2"
              >
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-900/50">
                  Season {selectedSeason}
                </span>
                {seasonStats && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-900/50">
                    Rank #{seasonStats.overall.rank}
                  </span>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 drop-shadow-sm"
              >
                {team.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap items-center gap-6 text-white/80 text-lg"
              >
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Users size={18} className="text-red-500" />
                  <span className="text-slate-400 text-sm uppercase font-bold mr-2">
                    Coach:
                  </span>
                  <span className="font-bold text-white">
                    {team.coach || "TBA"}
                  </span>
                </div>

                {team.website && (
                  <a
                    href={team.website}
                    target="_blank"
                    className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-red-600 hover:border-red-500 transition-all group"
                  >
                    <Globe
                      size={18}
                      className="text-blue-400 group-hover:text-white"
                    />
                    <span className="font-bold group-hover:text-white">
                      {team.website.replace("https://", "").replace("www.", "")}
                    </span>
                  </a>
                )}
              </motion.div>
            </div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4 mb-6"
            >
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 rounded-full bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-500 hover:scale-110 transition-all duration-300 shadow-lg"
                >
                  <Icon size={22} />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-[72px] z-40 shadow-2xl">
        <div className="container mx-auto px-4 md:px-16">
          <div className="flex overflow-x-auto gap-8 no-scrollbar">
            {(["overview", "players", "stats", "news", "photos"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-5 font-black uppercase tracking-widest text-sm transition-all relative ${
                    activeTab === tab
                      ? "text-red-500"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-400"
                    />
                  )}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-16 py-12">
        {/* PLAYERS SECTION (UPDATED WITH NEWS-STYLE CARDS) */}
        {(activeTab === "overview" || activeTab === "players") && (
          <>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-3 h-10 bg-gradient-to-b from-red-600 to-blue-600 block skew-x-[-15deg]" />
                Squad
              </h2>
              <div className="hidden md:flex gap-2">
                <button className="px-4 py-2 bg-white/5 rounded hover:bg-white/10 text-sm font-bold uppercase transition-colors">
                  All
                </button>
                <button className="px-4 py-2 bg-transparent rounded hover:bg-white/5 text-slate-400 text-sm font-bold uppercase transition-colors">
                  Raiders
                </button>
                <button className="px-4 py-2 bg-transparent rounded hover:bg-white/5 text-slate-400 text-sm font-bold uppercase transition-colors">
                  Defenders
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamPlayers.map((player, index) => (
                <Link to={`/player/${player.id}`} key={player.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-2"
                  >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/assets/pattern.png')] opacity-5 mix-blend-overlay" />

                    {/* Player Image Section */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <img
                        src={player.image}
                        alt={player.name}
                        className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-110 z-10 relative"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-20" />

                      <span className="absolute top-4 left-4 text-white/10 text-6xl font-black z-0 group-hover:text-white/20 transition-colors duration-500">
                        {player.jersey}
                      </span>

                      {player.isCaptain && (
                        <span className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded uppercase tracking-wider shadow-lg z-30 flex items-center gap-1">
                          <Trophy size={10} /> Captain
                        </span>
                      )}
                    </div>

                    {/* Player Info */}
                    <div className="p-6 relative z-30 -mt-12">
                      {/* Role Pill */}
                      <div className="flex justify-between items-end mb-2">
                        <span
                          className={`inline-block text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded bg-gradient-to-r ${
                            player.role.includes("Raider")
                              ? "from-red-600 to-orange-600"
                              : "from-blue-600 to-cyan-600"
                          } text-white shadow-lg`}
                        >
                          {player.role}
                        </span>
                        <span className="text-4xl font-black text-white/10 group-hover:text-white/30 transition-colors">
                          #{player.jersey}
                        </span>
                      </div>

                      <h3 className="text-xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-orange-500 transition-all leading-none uppercase italic">
                        {player.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-black/40 p-2 rounded border border-white/5 text-center">
                          <div className="text-xs text-slate-400 uppercase font-bold">
                            Matches
                          </div>
                          <div className="text-lg font-bold text-white">
                            {player.stats?.totalMatches || 0}
                          </div>
                        </div>
                        <div className="bg-black/40 p-2 rounded border border-white/5 text-center">
                          <div className="text-xs text-slate-400 uppercase font-bold">
                            Points
                          </div>
                          <div className="text-lg font-bold text-red-500">
                            {player.stats?.totalPoints || 0}
                          </div>
                        </div>
                      </div>

                      <div className="w-full py-3 text-xs font-black uppercase tracking-widest text-center border border-white/10 rounded bg-white/5 group-hover:bg-red-600 group-hover:border-red-500 group-hover:text-white transition-all duration-300">
                        View Profile
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* EXTRA SPACE BEFORE TEAM STATS */}
        <div className="h-24" />

        {/* TEAM STATS */}
        {(activeTab === "overview" || activeTab === "stats") && (
          <>
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-3 h-10 bg-gradient-to-b from-blue-600 to-cyan-600 block skew-x-[-15deg]" />
                Team Statistics
              </h2>

              {/* Season Dropdown */}
              {seasons.length > 0 && (
                <div className="flex items-center gap-3 bg-zinc-900 p-1 rounded-lg border border-white/10">
                  <span className="text-slate-400 uppercase text-xs font-bold px-3">
                    Season:
                  </span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    className="bg-black text-white text-sm font-bold uppercase px-4 py-2 rounded border-none focus:ring-2 focus:ring-red-500 outline-none cursor-pointer hover:bg-zinc-800 transition-colors"
                  >
                    {seasons.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {!seasonStats ? (
              <div className="text-slate-500 text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                <Activity size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold uppercase">
                  No Stats Available
                </h3>
                <p>Select a different season to view performance data.</p>
              </div>
            ) : (
              <>
                {/* Overall Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                  {[
                    {
                      label: "Matches Played",
                      value: seasonStats.overall.played,
                      icon: Activity,
                      color: "text-white",
                    },
                    {
                      label: "Won",
                      value: seasonStats.overall.won,
                      icon: Trophy,
                      color: "text-green-500",
                    },
                    {
                      label: "Draw",
                      value: seasonStats.overall.draw,
                      icon: Users,
                      color: "text-yellow-500",
                    },
                    {
                      label: "Lost",
                      value: seasonStats.overall.lost,
                      icon: TrendingUp,
                      color: "text-red-500",
                    },
                    {
                      label: "Rank",
                      value: `#${seasonStats.overall.rank}`,
                      icon: Award,
                      color: "text-blue-500",
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl text-center hover:bg-zinc-800/50 transition-colors group"
                    >
                      <stat.icon
                        size={20}
                        className={`mx-auto mb-3 ${stat.color} opacity-70 group-hover:opacity-100 transition-opacity`}
                      />
                      <div className={`text-4xl font-black mb-1 ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  {/* BAR CHART */}
                  <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 lg:col-span-2">
                    <h3 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                      <Activity size={18} className="text-red-500" />
                      Match Results
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={barData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#333"
                          horizontal={false}
                        />
                        <XAxis type="number" stroke="#666" />
                        <YAxis
                          dataKey="label"
                          type="category"
                          stroke="#999"
                          width={100}
                          tick={{
                            fill: "#ccc",
                            fontSize: 12,
                            fontWeight: "bold",
                          }}
                        />
                        <Tooltip cursor={{ fill: "rgba(255,255,255,0.05)" }} />
                        <Bar
                          dataKey="value"
                          radius={[0, 4, 4, 0]}
                          barSize={30}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* RADAR CHART */}
                  <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                      <Shield size={18} className="text-blue-500" />
                      Team Balance
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="70%"
                        data={radarData}
                      >
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis
                          dataKey="category"
                          tick={{
                            fill: "#999",
                            fontSize: 10,
                            fontWeight: "bold",
                          }}
                        />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.4}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Attack & Defence Detailed Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Attack */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-zinc-900 to-black p-8 border border-white/10 rounded-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-32 bg-red-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                      <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                        <Swords size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase italic">
                          Attack Stats
                        </h3>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                          Raid Performance
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-5xl font-black text-white mb-1">
                            {seasonStats.attack.totalRaids}
                          </div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                            Total Raids
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-green-500 mb-1">
                            {seasonStats.attack.successfulRaids}
                          </div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                            Successful
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold uppercase mb-2">
                          <span className="text-slate-300">Success Rate</span>
                          <span className="text-red-500">
                            {seasonStats.attack.successRate}%
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${seasonStats.attack.successRate}%`,
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-red-600 to-orange-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {seasonStats.attack.superRaids}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Super Raids
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {seasonStats.attack.totalRaidPoints}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Raid Points
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Defence */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="bg-gradient-to-br from-zinc-900 to-black p-8 border border-white/10 rounded-2xl relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                        <Shield size={24} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase italic">
                          Defence Stats
                        </h3>
                        <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">
                          Tackle Performance
                        </p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-5xl font-black text-white mb-1">
                            {seasonStats.defence.totalTackles}
                          </div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                            Total Tackles
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-green-500 mb-1">
                            {seasonStats.defence.successfulTackles}
                          </div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                            Successful
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold uppercase mb-2">
                          <span className="text-slate-300">Success Rate</span>
                          <span className="text-blue-500">
                            {seasonStats.defence.successRate}%
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{
                              width: `${seasonStats.defence.successRate}%`,
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-600"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {seasonStats.defence.superTackles}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Super Tackles
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {seasonStats.defence.totalDefencePoints}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Defence Points
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default TeamDetails;
