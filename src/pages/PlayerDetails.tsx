import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Shield,
  Star,
  Activity,
  Users,
  Trophy,
} from "lucide-react";
import Layout from "../components/layout/Layout";

// Recharts
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

const API_BASE = "https://api-v1.nepalkabaddileague.com/api";

const PlayerDetails = () => {
  const { slug } = useParams();
  const location = useLocation();
  const passedTeamSlug = location.state?.teamSlug;
  const passedJersey = location.state?.jersey;

  const [player, setPlayer] = useState(null);
  const [stats, setStats] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [teamHistory, setTeamHistory] = useState([]);

  /* ----------------------------------------
     FETCH SEASONS
  ---------------------------------------- */
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const res = await fetch(`${API_BASE}/seasons`);
        const json = await res.json();
        const seasonData = json?.data || [];
        setSeasons(seasonData);

        // Set the first season as default
        if (seasonData.length > 0 && !selectedSeason) {
          setSelectedSeason(seasonData[0].id);
        }
      } catch (err) {
        console.error("Error fetching seasons:", err);
      }
    };

    fetchSeasons();
  }, []);

  /* ----------------------------------------
     FETCH PLAYER DATA & STATS
  ---------------------------------------- */
  useEffect(() => {
    if (!selectedSeason) return;

    const fetchPlayerData = async () => {
      try {
        setLoading(true);

        // Fetch player basic info
        const playerRes = await fetch(`${API_BASE}/players/${slug}`);
        const playerJson = await playerRes.json();
        const playerData = playerJson?.data;

        // Log to debug
        console.log("Player Data:", playerData);

        setPlayer(playerData);

        // Fetch player stats for selected season
        if (playerData?.id) {
          const statsRes = await fetch(
            `${API_BASE}/player-stats?season_id=${selectedSeason}&player_id=${playerData.id}`
          );
          const statsJson = await statsRes.json();
          const statsData = statsJson?.data?.[0];

          if (statsData) {
            setStats({
              total_points: parseInt(statsData.total_points) || 0,
              raid_points: parseInt(statsData.raid_points) || 0,
              tackle_points: parseInt(statsData.tackle_points) || 0,
              matches: parseInt(statsData.gameCount) || 0,
              successful_raids: parseInt(statsData.successful_raid) || 0,
              successful_tackles: parseInt(statsData.successful_tackle) || 0,
              super_raids: parseInt(statsData.super_raid) || 0,
              super_tackles: parseInt(statsData.super_tackle) || 0,
              do_or_die_points: parseInt(statsData.dod_points) || 0,
              empty_raids: parseInt(statsData.empty_raid) || 0,
              super_10s: parseInt(statsData.super_10s) || 0,
              super_5s: parseInt(statsData.super_5s) || 0,
              avg_raid_points: parseFloat(statsData.avg_raid_points) || 0,
              team_name: statsData.team_name,
              team_logo_url: statsData.team_logo_url,
              team_slug: statsData.slug,
            });
          } else {
            // No stats for this season
            setStats(null);
          }
        }
      } catch (err) {
        console.error("Error fetching player data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [slug, selectedSeason]);

  /* ----------------------------------------
     FETCH TEAM HISTORY (ALL SEASONS)
  ---------------------------------------- */
  useEffect(() => {
    if (!player?.id || seasons.length === 0) return;

    const fetchTeamHistory = async () => {
      try {
        const historyPromises = seasons.map(async (season) => {
          const res = await fetch(
            `${API_BASE}/player-stats?season_id=${season.id}&player_id=${player.id}`
          );
          const json = await res.json();
          const data = json?.data?.[0];

          if (data) {
            return {
              season_id: season.id,
              season_name: season.name,
              team_name: data.team_name,
              team_logo_url: data.team_logo_url,
              total_points: parseInt(data.total_points) || 0,
              successful_raids: parseInt(data.successful_raid) || 0,
              successful_tackles: parseInt(data.successful_tackle) || 0,
            };
          }
          return null;
        });

        const history = await Promise.all(historyPromises);
        setTeamHistory(history.filter(Boolean));
      } catch (err) {
        console.error("Error fetching team history:", err);
      }
    };

    fetchTeamHistory();
  }, [player, seasons]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase">
              Loading Player...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!player) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Player Not Found</h2>
            <Link
              to="/teams"
              className="text-red-500 hover:text-red-400 font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Teams
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  /* ----------------------------------------
     CHART DATA
  ---------------------------------------- */
  const raidVsTackleData = stats
    ? [
        {
          name: "Raid Points",
          value: stats.raid_points || 0,
          color: "#ef4444",
        },
        {
          name: "Tackle Points",
          value: stats.tackle_points || 0,
          color: "#3b82f6",
        },
      ]
    : [];

  const performanceData = stats
    ? [
        { name: "Raids", value: stats.successful_raids || 0 },
        { name: "Tackles", value: stats.successful_tackles || 0 },
        { name: "Super Raids", value: (stats.super_raids || 0) * 10 },
        { name: "Super Tackles", value: (stats.super_tackles || 0) * 10 },
        { name: "DoD Points", value: (stats.do_or_die_points || 0) * 5 },
      ]
    : [];

  /* ----------------------------------------
     RENDER
  ---------------------------------------- */
  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-black text-white font-sans">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Link
            to={passedTeamSlug ? `/team/${passedTeamSlug}` : "/team"}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="uppercase font-bold text-sm tracking-wider">
              {stats?.team_name
                ? `Back to ${stats.team_name}`
                : "Back to Teams"}
            </span>
          </Link>

          {/* Hero Section */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-900 via-black to-zinc-900 border border-white/10 mb-12 shadow-2xl">
            <div className="absolute inset-0 opacity-10 mix-blend-overlay" />

            <div className="grid md:grid-cols-2 gap-0 relative z-10">
              {/* Image Side */}
              <div className="relative h-[600px] md:h-[700px] bg-gradient-to-br from-zinc-800 via-black to-zinc-900 flex items-center justify-center overflow-hidden">
                {/* Player Image - Full Height */}
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="relative z-10 h-full w-full flex items-end justify-center"
                >
                  <img
                    src={player.player_image_url || player.photo}
                    alt={player.name}
                    className="h-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
                  />
                </motion.div>

                {/* Fade to Background Effect */}
                <div className="absolute inset-0 z-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

                {/* Jersey Number - Enhanced */}
                {passedJersey && (
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="absolute top-8 left-8 z-30"
                  >
                    <div className="relative">
                      <div className="text-[140px] md:text-[180px] font-black text-white/3 leading-none select-none">
                        {String(passedJersey).padStart(2, "0")}
                      </div>
                      <div className="absolute inset-0 text-[140px] md:text-[180px] font-black leading-none select-none bg-gradient-to-b from-red-600/10 to-transparent bg-clip-text text-transparent">
                        {String(passedJersey).padStart(2, "0")}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Info Side */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-black/50 to-transparent">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  {/* Position Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 mb-6 flex-wrap"
                  >
                    <span className="relative px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-900/30 overflow-hidden group">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                      <span className="relative">
                        {player.position?.name || "Player"}
                      </span>
                    </span>
                  </motion.div>

                  {/* Player Name */}
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none"
                  >
                    <span className="bg-gradient-to-r from-white via-white to-slate-300 bg-clip-text text-transparent drop-shadow-2xl">
                      {player.name}
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-2xl">
                      {player.last_name}
                    </span>
                  </motion.h1>

                  {/* Jersey & Team Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-4 mb-10 flex-wrap"
                  >
                    {passedJersey && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Jersey
                          </span>
                          <div className="text-2xl font-black text-white bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                            #{String(passedJersey).padStart(2, "0")}
                          </div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      </>
                    )}
                    {stats && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Team
                        </span>
                        <div className="text-xl font-bold text-red-500">
                          {stats.team_name || "Team"}
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Season Selector */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-10"
                  >
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 block">
                      Select Season
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {seasons.map((season, idx) => (
                        <motion.button
                          key={season.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.9 + idx * 0.1 }}
                          onClick={() => setSelectedSeason(season.id)}
                          className={`relative px-5 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all overflow-hidden group ${
                            selectedSeason === season.id
                              ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-900/40 scale-105"
                              : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10 hover:border-white/20"
                          }`}
                        >
                          {selectedSeason === season.id && (
                            <motion.span
                              layoutId="activeSeasonBg"
                              className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700"
                              transition={{
                                type: "spring",
                                bounce: 0.2,
                                duration: 0.6,
                              }}
                            />
                          )}
                          <span className="relative z-10">{season.name}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quick Stats Grid - Enhanced */}
                  {stats ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      {[
                        {
                          label: "Total Points",
                          value: stats.total_points,
                          color: "from-white to-slate-300",
                        },
                        {
                          label: "Matches",
                          value: stats.matches,
                          color: "from-white to-slate-300",
                        },
                        {
                          label: "Raid Points",
                          value: stats.raid_points,
                          color: "from-red-500 to-orange-500",
                        },
                        {
                          label: "Tackle Points",
                          value: stats.tackle_points,
                          color: "from-blue-500 to-cyan-500",
                        },
                      ].map((stat, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1.1 + idx * 0.1 }}
                          whileHover={{ scale: 1.05, y: -4 }}
                          className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 p-5 rounded-2xl hover:border-white/20 transition-all group overflow-hidden"
                        >
                          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="relative">
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">
                              {stat.label}
                            </div>
                            <div
                              className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                            >
                              {stat.value}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="bg-white/5 border border-white/10 p-6 rounded-xl text-center"
                    >
                      <p className="text-slate-400 font-bold">
                        No stats available for this season
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Career Timeline - Horizontal Scrollable */}
          {teamHistory.length > 0 && (
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
                {/* Horizontal Scrollable Container */}
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-red-600 scrollbar-track-white/5 pb-4">
                  <div className="flex gap-6 min-w-max">
                    {teamHistory.map((item, index) => (
                      <motion.div
                        key={item.season_id}
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex-shrink-0 w-[350px]"
                      >
                        <div className="relative bg-zinc-900 border border-white/10 rounded-xl hover:border-red-500/50 transition-all group h-full overflow-hidden">
                          {/* Team Logo Shield Background */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-5 group-hover:opacity-10 transition-opacity">
                            <img
                              src={item.team_logo_url}
                              alt={item.team_name}
                              className="w-64 h-64 object-contain"
                            />
                          </div>

                          <div className="relative z-10 p-6">
                            {/* Season Header */}
                            <div className="mb-6 text-center">
                              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                {item.season_name}
                              </span>
                              <div className="w-24 h-24 mx-auto mb-3 bg-white/5 rounded-lg p-3 backdrop-blur-sm">
                                <img
                                  src={item.team_logo_url}
                                  alt={item.team_name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <h3 className="text-xl font-bold text-white uppercase leading-tight">
                                {item.team_name}
                              </h3>
                              <p className="text-slate-400 text-sm mt-1">
                                {player.position?.name || "Player"}
                              </p>
                            </div>

                            {/* Stats Preview */}
                            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10">
                              <div className="text-center">
                                <div className="text-2xl font-black text-red-500">
                                  {item.total_points}
                                </div>
                                <div className="text-xs text-slate-500 uppercase font-bold">
                                  Points
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-black text-yellow-500">
                                  {item.successful_raids}
                                </div>
                                <div className="text-xs text-slate-500 uppercase font-bold">
                                  Raids
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-2xl font-black text-blue-500">
                                  {item.successful_tackles}
                                </div>
                                <div className="text-xs text-slate-500 uppercase font-bold">
                                  Tackles
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Scroll Indicator */}
                <div className="flex justify-center mt-6 gap-2">
                  {teamHistory.map((_, index) => (
                    <div
                      key={index}
                      className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-blue-500"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Detailed Stats & Charts */}
          {stats && (
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
                    {seasons.find((s) => s.id === selectedSeason)?.name}
                  </span>
                </div>

                <div className="p-6 grid md:grid-cols-2 gap-x-12 gap-y-6">
                  {[
                    {
                      label: "Successful Raids",
                      value: stats.successful_raids,
                      icon: Zap,
                      color: "text-yellow-500",
                    },
                    {
                      label: "Super Raids",
                      value: stats.super_raids,
                      icon: Star,
                      color: "text-orange-500",
                    },
                    {
                      label: "Successful Tackles",
                      value: stats.successful_tackles,
                      icon: Shield,
                      color: "text-blue-500",
                    },
                    {
                      label: "Super Tackles",
                      value: stats.super_tackles,
                      icon: Shield,
                      color: "text-cyan-500",
                    },
                    {
                      label: "Do or Die Points",
                      value: stats.do_or_die_points,
                      icon: Activity,
                      color: "text-red-500",
                    },
                    {
                      label: "Empty Raids",
                      value: stats.empty_raids,
                      icon: Users,
                      color: "text-purple-500",
                    },
                    {
                      label: "Super 10s",
                      value: stats.super_10s,
                      icon: Trophy,
                      color: "text-green-500",
                    },
                    {
                      label: "Avg Raid Points",
                      value: stats.avg_raid_points?.toFixed(2),
                      icon: Activity,
                      color: "text-pink-500",
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
                  {stats.total_points > 0 ? (
                    <>
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
                    </>
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm uppercase font-bold">
                      No Data Available
                    </div>
                  )}
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
                  {stats.total_points > 0 ? (
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
                  ) : (
                    <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm uppercase font-bold">
                      No Data Available
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PlayerDetails;
