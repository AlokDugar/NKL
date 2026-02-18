import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/layout/Layout";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Calendar,
  Trophy,
  Activity,
  TrendingUp,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

interface Team {
  id: number;
  name: string;
  logo: string;
}

interface Player {
  id: number;
  slug: string;
  name: string;
  image: string;
  role: string;
  teamId: number;
  points?: number;
}

interface Match {
  id: string;
  type: string;
  status: string;
  date: string;
  time: string;
  venue: string;
  score1: number;
  score2: number;
  team1: Team;
  team2: Team;
  stats: {
    team1: {
      raidPoints: number;
      tacklePoints: number;
      allOutPoints: number;
      extraPoints: number;
    };
    team2: {
      raidPoints: number;
      tacklePoints: number;
      allOutPoints: number;
      extraPoints: number;
    };
  };
  mvp?: Player;
  startingLineups: { team1: Player[]; team2: Player[] };
  activities: any[];
}

const MatchDetails = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMVP, setShowMVP] = useState(false);

  const parseTime = (timeStr: string | null | undefined) => {
    if (!timeStr) return 0;
    const parts = timeStr.split(":");
    if (parts.length !== 3) return 0;
    const [h, m, s] = parts.map(Number);
    return h * 3600 + m * 60 + s;
  };

  const transformMatchData = (
    apiData: any,
    lineupStatsData: any,
  ): Match | null => {
    if (!apiData?.data) return null;
    const data = apiData.data;

    const calculateStats = (teamId: number) => {
      const activities = data.activities.filter(
        (a: any) => a.team_id === teamId,
      );
      const sum = (types: string[]) =>
        activities
          .filter((a: any) => types.includes(a.type))
          .reduce((s: number, a: any) => s + a.points, 0);

      return {
        raidPoints: sum(["Successful Raid"]),
        tacklePoints: sum(["Successful Tackle", "Super Tackle"]),
        allOutPoints: sum(["Luna Point"]),
        extraPoints: sum(["Bonus Point", "Technical Point"]),
      };
    };

    const mapLineup = (teamId: number): Player[] => {
      if (!lineupStatsData?.data) return [];
      const teamPlayers = lineupStatsData.data[teamId.toString()];
      if (!teamPlayers || !Array.isArray(teamPlayers)) return [];
      return teamPlayers
        .filter((p: any) => p.gameCount > 0)
        .slice(0, 7)
        .map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          image: p.player_image_url,
          role: p.position?.name || "Player",
          teamId: teamId,
        }));
    };

    const team1Lineups = mapLineup(data.first_team_id);
    const team2Lineups = mapLineup(data.second_team_id);

    const allPlayers: Player[] = [];
    if (lineupStatsData?.data) {
      Object.keys(lineupStatsData.data).forEach((teamId) => {
        const teamPlayers = lineupStatsData.data[teamId];
        if (Array.isArray(teamPlayers)) {
          teamPlayers.forEach((p: any) => {
            if (p.gameCount > 0 && p.total_points) {
              allPlayers.push({
                id: p.id,
                slug: p.slug,
                name: p.name,
                image: p.player_image_url,
                role: p.position?.name || "Player",
                teamId: parseInt(teamId),
                points: parseInt(p.total_points) || 0,
              });
            }
          });
        }
      });
    }

    const mvp =
      allPlayers.sort((a, b) => (b.points || 0) - (a.points || 0))[0] ||
      undefined;

    return {
      id: data.id.toString(),
      type: data.type,
      status: data.details.status === 1 ? "Completed" : "Live",
      date: new Date(data.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: data.time,
      venue: data.stadium.name,
      score1: Number(data.details.first_team_score),
      score2: Number(data.details.second_team_score),
      team1: data.first_team,
      team2: data.second_team,
      stats: {
        team1: calculateStats(data.first_team_id),
        team2: calculateStats(data.second_team_id),
      },
      mvp,
      startingLineups: { team1: team1Lineups, team2: team2Lineups },
      activities: data.activities,
    };
  };

  const generateMomentumData = (match: Match) => {
    const validActivities = match.activities.filter(
      (a) => a.time && parseTime(a.time) > 0,
    );

    if (validActivities.length === 0) {
      return [
        { time: "0'", [match.team1.name]: 0, [match.team2.name]: 0 },
        {
          time: "20'",
          [match.team1.name]: Math.floor(match.score1 * 0.5),
          [match.team2.name]: Math.floor(match.score2 * 0.5),
        },
        {
          time: "40'",
          [match.team1.name]: match.score1,
          [match.team2.name]: match.score2,
        },
      ];
    }

    const interval = 5 * 60;
    const maxTime = Math.max(...validActivities.map((a) => parseTime(a.time)));
    const intervals = Math.ceil(maxTime / interval);
    const data: any[] = [];

    for (let i = 0; i <= intervals; i++) {
      const endTime = i * interval;
      const activitiesUpToNow = validActivities.filter(
        (a) => parseTime(a.time) <= endTime,
      );
      const t1Score = activitiesUpToNow
        .filter((a) => a.team_id === match.team1.id)
        .reduce((sum, a) => sum + (a.points || 0), 0);
      const t2Score = activitiesUpToNow
        .filter((a) => a.team_id === match.team2.id)
        .reduce((sum, a) => sum + (a.points || 0), 0);

      data.push({
        time: `${Math.floor(endTime / 60)}'`,
        [match.team1.name]: t1Score,
        [match.team2.name]: t2Score,
      });
    }

    return data;
  };

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        const [matchRes, lineupStatsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/games/${matchId}`),
          fetch(`${API_BASE_URL}/lineup-stats/${matchId}`),
        ]);

        const matchData = await matchRes.json();
        const lineupStatsData = await lineupStatsRes.json();

        if (!window.lineupStatsCache) {
          (window as any).lineupStatsCache = {};
        }

        if (lineupStatsData?.data) {
          Object.keys(lineupStatsData.data).forEach((teamId) => {
            const teamPlayers = lineupStatsData.data[teamId];
            if (Array.isArray(teamPlayers)) {
              (window as any).lineupStatsCache[teamId] = teamPlayers.reduce(
                (acc: any, player: any) => {
                  acc[player.id] = player;
                  return acc;
                },
                {},
              );
            }
          });
        }

        setMatch(transformMatchData(matchData, lineupStatsData));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatchData();
  }, [matchId]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full" />
            <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full" />
          </div>
          <div className="text-center relative z-10">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-bold">Loading match details...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!match) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Match Not Found</h2>
            <a
              href="/schedule"
              className="text-red-500 hover:text-red-400 font-medium flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Schedule
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const { team1, team2, startingLineups, stats } = match;

  const pointsComparisonData = [
    {
      name: "Raid Pts",
      [team1.name]: stats.team1.raidPoints,
      [team2.name]: stats.team2.raidPoints,
    },
    {
      name: "Tackle Pts",
      [team1.name]: stats.team1.tacklePoints,
      [team2.name]: stats.team2.tacklePoints,
    },
    {
      name: "All Out Pts",
      [team1.name]: stats.team1.allOutPoints,
      [team2.name]: stats.team2.allOutPoints,
    },
    {
      name: "Extras",
      [team1.name]: stats.team1.extraPoints,
      [team2.name]: stats.team2.extraPoints,
    },
  ];

  const momentumData = generateMomentumData(match);

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white font-sans relative overflow-hidden">
        {/* ── Ambient background glows matching site theme ── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-blue-950/20 to-slate-950" />
          <div className="absolute -top-40 left-0 w-[600px] h-[600px] bg-red-600/20 blur-[180px] rounded-full opacity-50" />
          <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-blue-600/20 blur-[180px] rounded-full opacity-40" />
          <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-red-900/15 blur-[120px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Back link */}
          <a
            href="/schedule"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="uppercase font-bold text-sm tracking-wider">
              Back to Schedule
            </span>
          </a>

          {/* ── Hero Score Card ── */}
          <div
            className="relative rounded-3xl overflow-hidden mb-12 p-8 md:p-16 border border-white/10
                        bg-black/40 backdrop-blur-xl
                        shadow-[0_0_60px_-10px_rgba(220,38,38,0.2),0_0_60px_-10px_rgba(37,99,235,0.2)]"
          >
            {/* gradient border shimmer */}
            <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-red-600/30 via-transparent to-blue-600/30 pointer-events-none" />
            {/* inner gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-transparent to-blue-900/10 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 mb-8"
              >
                <span className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-red-900/50">
                  {match.type}
                </span>
                <span className="bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest text-white">
                  {match.status}
                </span>
              </motion.div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 w-full mb-12">
                {/* Team 1 */}
                <div className="flex flex-col items-center text-center group">
                  <div
                    className="w-32 h-32 md:w-40 md:h-40 bg-black/40 rounded-full p-6
                                border-2 border-red-500/20 group-hover:border-red-500/60
                                shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]
                                group-hover:shadow-[0_0_50px_-5px_rgba(239,68,68,0.5)]
                                transition-all duration-500 mb-6"
                  >
                    <img
                      src={team1.logo}
                      alt={team1.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">
                    {team1.name}
                  </h2>
                  <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-red-300 drop-shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                    {match.score1}
                  </div>
                </div>

                {/* VS divider */}
                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 italic">
                    VS
                  </div>
                  <div className="w-px h-24 bg-gradient-to-b from-red-500/50 via-white/20 to-blue-500/50" />
                </div>

                {/* Team 2 */}
                <div className="flex flex-col items-center text-center group">
                  <div
                    className="w-32 h-32 md:w-40 md:h-40 bg-black/40 rounded-full p-6
                                border-2 border-blue-500/20 group-hover:border-blue-500/60
                                shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]
                                group-hover:shadow-[0_0_50px_-5px_rgba(59,130,246,0.5)]
                                transition-all duration-500 mb-6"
                  >
                    <img
                      src={team2.logo}
                      alt={team2.name}
                      className="w-full h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">
                    {team2.name}
                  </h2>
                  <div className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    {match.score2}
                  </div>
                </div>
              </div>

              {/* Meta info pill */}
              <div
                className="flex flex-wrap justify-center gap-6 md:gap-12 text-slate-400 text-sm font-bold uppercase tracking-wider
                            bg-black/50 backdrop-blur-sm px-8 py-4 rounded-full border border-white/10"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-red-500" /> {match.date}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> {match.time}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" /> {match.venue}
                </span>
              </div>

              {match.mvp && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowMVP(true)}
                  className="mt-8 px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-black uppercase tracking-widest text-black shadow-lg shadow-orange-500/30 flex items-center gap-2"
                >
                  <Trophy size={18} /> View Match MVP
                </motion.button>
              )}
            </div>
          </div>

          {/* ── Charts ── */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Stats Comparison */}
            <div
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6
                          hover:border-red-500/20 transition-colors duration-300
                          shadow-[0_0_30px_-10px_rgba(220,38,38,0.2)]"
            >
              <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                <Activity className="text-red-500" /> Stats Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={pointsComparisonData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#475569"
                    tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: "bold" }}
                  />
                  <YAxis stroke="#475569" tick={{ fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(2,6,23,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      backdropFilter: "blur(12px)",
                    }}
                    cursor={{ fill: "rgba(255,255,255,0.03)" }}
                  />
                  <Bar
                    dataKey={team1.name}
                    fill="url(#barRed)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey={team2.name}
                    fill="url(#barBlue)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barRed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#991b1b" />
                    </linearGradient>
                    <linearGradient id="barBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Momentum */}
            <div
              className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6
                          hover:border-blue-500/20 transition-colors duration-300
                          shadow-[0_0_30px_-10px_rgba(37,99,235,0.2)]"
            >
              <h3 className="text-lg font-black uppercase italic mb-6 flex items-center gap-2">
                <TrendingUp className="text-blue-500" /> Match Momentum
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={momentumData}>
                  <defs>
                    <linearGradient id="colorTeam1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorTeam2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="time"
                    stroke="#475569"
                    tick={{ fill: "#94a3b8" }}
                  />
                  <YAxis stroke="#475569" tick={{ fill: "#94a3b8" }} />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e293b"
                    vertical={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(2,6,23,0.9)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      backdropFilter: "blur(12px)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={team1.name}
                    stroke="#ef4444"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTeam1)"
                  />
                  <Area
                    type="monotone"
                    dataKey={team2.name}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTeam2)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Lineups ── */}
          <div className="grid md:grid-cols-2 gap-12">
            {[team1, team2].map((team, idx) => {
              const teamId = idx === 0 ? match.team1.id : match.team2.id;
              const accentColor = idx === 0 ? "red" : "blue";

              return (
                <div key={team.name}>
                  <div
                    className={`flex items-center justify-between mb-6 pb-3 border-b
                                 ${idx === 0 ? "border-red-500/30" : "border-blue-500/30"}`}
                  >
                    <h3
                      className={`text-xl font-black uppercase italic text-transparent bg-clip-text
                                  ${
                                    idx === 0
                                      ? "bg-gradient-to-r from-red-400 to-white"
                                      : "bg-gradient-to-r from-blue-400 to-white"
                                  }`}
                    >
                      {team.name}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Lineup
                    </span>
                  </div>

                  <div className="space-y-3">
                    {startingLineups[`team${idx + 1}`].map((player) => {
                      const playerStats = Object.values(
                        (window as any).lineupStatsCache?.[teamId] || {},
                      ).find((p: any) => p.id === player.id) as any;

                      const raidPoints = parseInt(
                        playerStats?.raid_points || "0",
                      );
                      const tacklePoints = parseInt(
                        playerStats?.tackle_points || "0",
                      );
                      const totalPoints = parseInt(
                        playerStats?.total_points || "0",
                      );

                      return (
                        <div
                          key={player.id}
                          className={`flex items-center gap-3 p-3
                                    bg-black/40 backdrop-blur-sm border border-white/5 rounded-xl
                                    hover:bg-black/60 transition-all group
                                    hover:border-${accentColor}-500/30
                                    hover:shadow-[0_0_15px_-5px_rgba(${idx === 0 ? "239,68,68" : "59,130,246"},0.3)]`}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0 ring-1 ring-white/10">
                            <img
                              src={player.image}
                              alt={player.name}
                              className="w-full h-full object-cover object-top"
                            />
                          </div>
                          <div className="flex-1">
                            <h4
                              className={`font-bold text-white transition-colors
                                          ${
                                            idx === 0
                                              ? "group-hover:text-red-400"
                                              : "group-hover:text-blue-400"
                                          }`}
                            >
                              {player.name}
                            </h4>
                            <p className="text-[10px] text-slate-500 uppercase font-bold">
                              {player.role}
                            </p>
                          </div>
                          <div className="flex flex-col items-end text-sm font-black space-y-1 flex-shrink-0">
                            <span className="text-red-400">
                              ⚡ {raidPoints}
                            </span>
                            <span className="text-blue-400">
                              🛡️ {tacklePoints}
                            </span>
                            <span className="text-white">⭐ {totalPoints}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MVP Modal ── */}
        <AnimatePresence>
          {showMVP && match.mvp && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowMVP(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotateX: -90 }}
                className="relative w-full max-w-lg rounded-3xl overflow-hidden
                         bg-slate-950/90 backdrop-blur-xl
                         border border-yellow-500/30
                         shadow-[0_0_80px_-10px_rgba(234,179,8,0.4)]"
              >
                {/* Ambient glow inside modal */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500/15 rounded-full blur-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </div>

                <button
                  onClick={() => setShowMVP(false)}
                  className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-colors border border-white/10"
                >
                  <X size={20} />
                </button>

                <div className="relative h-[500px] flex flex-col items-center justify-end pb-12">
                  <motion.img
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    src={match.mvp.image}
                    alt={match.mvp.name}
                    className="absolute top-0 h-[80%] object-contain z-10 drop-shadow-2xl"
                  />

                  <div className="relative z-20 text-center">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mb-2"
                    >
                      <span className="px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-black uppercase tracking-widest rounded-full shadow-lg shadow-yellow-500/50">
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
                        <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
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
      </div>
    </Layout>
  );
};

export default MatchDetails;
