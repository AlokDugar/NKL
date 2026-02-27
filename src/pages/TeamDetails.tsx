import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import {
  Globe,
  Users,
  Activity,
  Loader2,
  ArrowLeft,
  Award,
  Swords,
  Shield,
} from "lucide-react";
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
  CartesianGrid,
} from "recharts";
import {
  fetchTeam,
  fetchSeasons,
  fetchSquad,
  fetchTeamStats,
  getLatestSeason,
  type Team,
  type Season,
  type SquadPlayer,
  type TeamStats,
} from "../api";

const chartStyles = `
  .recharts-default-tooltip { background: rgba(2,6,23,0.92) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 12px !important; backdrop-filter: blur(12px) !important; }
  .recharts-tooltip-label { color: #fff !important; font-weight: bold !important; }
  .recharts-tooltip-item { color: #ccc !important; }
`;

const percent = (num: number, den: number) => (den > 0 ? (num / den) * 100 : 0);
const avg = (total: number, matches: number) =>
  matches > 0 ? total / matches : 0;

const TeamDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [players, setPlayers] = useState<SquadPlayer[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | "">("");
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch team + seasons on mount
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    Promise.all([fetchTeam(slug), fetchSeasons()])
      .then(([teamData, seasonData]) => {
        setTeam(teamData);
        setSeasons(seasonData);
        const latest = getLatestSeason(seasonData);
        if (latest) setSelectedSeason(latest.id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  // Fetch squad whenever team or season changes
  useEffect(() => {
    if (!slug || !selectedSeason) return;
    fetchSquad(slug, selectedSeason as number)
      .then(setPlayers)
      .catch(() => setPlayers([]));
  }, [slug, selectedSeason]);

  // Fetch team stats whenever team id or season changes
  useEffect(() => {
    if (!team?.id || !selectedSeason) return;
    setLoadingStats(true);
    fetchTeamStats(team.id, selectedSeason as number)
      .then(setTeamStats)
      .catch(() => setTeamStats(null))
      .finally(() => setLoadingStats(false));
  }, [team?.id, selectedSeason]);

  const radarData = useMemo(() => {
    if (!teamStats) return [];
    return [
      {
        metric: "Raid Success %",
        value: percent(
          Number(teamStats.successful_raid),
          Number(teamStats.total_raids),
        ),
        type: "percent",
      },
      {
        metric: "Tackle Success %",
        value: percent(
          Number(teamStats.successful_tackle),
          Number(teamStats.total_tackles),
        ),
        type: "percent",
      },
      {
        metric: "Win Rate %",
        value: percent(teamStats.wins, teamStats.played),
        type: "percent",
      },
      {
        metric: "Avg Raid Pts / Match",
        value: avg(teamStats.raid_points, teamStats.played) * 10,
        type: "points",
      },
      {
        metric: "Avg Tackle Pts / Match",
        value: avg(teamStats.tackle_points, teamStats.played) * 10,
        type: "points",
      },
    ];
  }, [teamStats]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-40 left-1/4 w-[500px] h-[500px] bg-red-600/20 blur-[150px] rounded-full" />
            <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full" />
          </div>
          <div className="text-center relative z-10">
            <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-slate-400">Loading team data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !team) {
    return (
      <Layout>
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>
            <p className="text-slate-400 mb-6">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-950 text-white font-sans relative overflow-x-hidden">
        <style>{chartStyles}</style>

        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/20 to-slate-950" />
        </div>

        {/* Hero */}
        <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden z-10">
          <div
            className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-60"
            style={{
              backgroundImage: `url(${team.featured_img || team.logo})`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
            <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-black/50 backdrop-blur-xl rounded-full p-4 border-2 border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] flex items-center justify-center flex-shrink-0">
                <img
                  src={team.logo}
                  alt={team.name}
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>

              <div className="flex-1 mb-4">
                <button
                  onClick={() => navigate("/team")}
                  className="flex items-center gap-2 text-red-400 font-bold uppercase mb-3 hover:text-red-300 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-red-600 transition-colors">
                    <ArrowLeft size={14} />
                  </div>
                  Back to Teams
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <span className="px-3 py-1 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-900/50">
                    {seasons.find((s) => s.id === selectedSeason)?.name ||
                      "Season"}
                  </span>
                  {teamStats && (
                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-900/50">
                      Rank #{teamStats.rank}
                    </span>
                  )}
                </div>

                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                  {team.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-white/80 text-lg">
                  <div className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                    <Users size={16} className="text-slate-400" />
                    <span className="text-slate-400 text-sm uppercase font-bold mr-1">
                      Home:
                    </span>
                    <span className="font-bold text-white text-sm">
                      {team.home_ground || team.address || "TBA"}
                    </span>
                  </div>

                  {team.social_links?.website &&
                    team.social_links.website !== "#" && (
                      <a
                        href={team.social_links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                      >
                        <Globe
                          size={16}
                          className="text-slate-400 group-hover:text-white"
                        />
                        <span className="font-bold text-sm group-hover:text-white">
                          {team.social_links.website
                            .replace("https://", "")
                            .replace("www.", "")}
                        </span>
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Nav */}
        <div className="bg-black/60 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 shadow-2xl">
          <div className="container mx-auto px-4 md:px-16">
            <div className="flex overflow-x-auto gap-8 no-scrollbar">
              {["overview", "players", "stats"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-5 font-black uppercase tracking-widest text-sm transition-all relative whitespace-nowrap ${
                    activeTab === tab
                      ? "text-white"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 to-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-16 py-12 relative z-10">
          {/* About */}
          {activeTab === "overview" && team.description && (
            <div className="mb-16">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4 mb-8">
                <span className="w-3 h-10 bg-gradient-to-b from-red-600 to-blue-600 block skew-x-[-15deg]" />
                About {team.name}
              </h2>
              <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_30px_-10px_rgba(220,38,38,0.2)]">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                  {team.description}
                </p>
              </div>
            </div>
          )}

          {/* Squad */}
          {(activeTab === "overview" || activeTab === "players") && (
            <>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                  <span className="w-3 h-10 bg-gradient-to-b from-red-600 to-blue-600 block skew-x-[-15deg]" />
                  Squad ({players.length} Players)
                </h2>

                {seasons.length > 0 && (
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm p-1 rounded-xl border border-white/10">
                    <span className="text-slate-400 uppercase text-xs font-bold px-3">
                      Season:
                    </span>
                    <select
                      value={selectedSeason}
                      onChange={(e) =>
                        setSelectedSeason(Number(e.target.value))
                      }
                      className="bg-black/60 text-white text-sm font-bold uppercase px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-red-500 outline-none cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                      {seasons.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {players.length === 0 ? (
                <div className="text-center py-20 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 border-dashed">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold uppercase">
                    No Players Available
                  </h3>
                  <p className="text-slate-400">
                    Squad information coming soon.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                  {players.map((player) => (
                    <Link
                      key={player.id}
                      to={`/player/${player.slug}`}
                      state={{ teamSlug: slug, jersey: player.jersey }}
                      className="group relative block"
                    >
                      <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/40 transition-all duration-500 hover:shadow-[0_0_40px_-5px_rgba(220,38,38,0.3)] hover:-translate-y-2 cursor-pointer">
                        <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
                          <img
                            src={player.photo}
                            alt={`${player.name} ${player.last_name}`}
                            className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-110 z-10 relative"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-20" />

                          {player.isCaptain && (
                            <span className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded uppercase tracking-wider shadow-lg z-30 flex items-center gap-1">
                              <span className="text-[12px] font-black">©</span>{" "}
                              Captain
                            </span>
                          )}
                          {player.isSubCaptain && (
                            <span className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-wider shadow-lg z-30 flex items-center gap-1">
                              <Award size={10} /> Vice Captain
                            </span>
                          )}
                          {player.jersey && (
                            <span className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm text-white text-2xl font-black px-4 py-2 rounded-lg border border-white/20 shadow-lg z-30">
                              #{player.jersey}
                            </span>
                          )}
                        </div>

                        <div className="p-6 relative z-30 -mt-12">
                          <div className="flex justify-between items-end mb-2">
                            <span
                              className={`inline-block text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded bg-gradient-to-r ${
                                player.position?.name
                                  ?.toLowerCase()
                                  .includes("raider")
                                  ? "from-red-600 to-orange-600"
                                  : "from-blue-600 to-cyan-600"
                              } text-white shadow-lg`}
                            >
                              {player.position?.name || "Player"}
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-white mb-4 group-hover:text-slate-300 transition-all leading-none uppercase italic">
                            {player.name} {player.last_name}
                          </h3>

                          <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="bg-black/50 p-2 rounded-lg border border-white/5 text-center">
                              <div className="text-xs text-slate-400 uppercase font-bold">
                                Country
                              </div>
                              <div className="text-sm font-bold text-white">
                                {player.country?.code || "N/A"}
                              </div>
                            </div>
                            <div className="bg-black/50 p-2 rounded-lg border border-white/5 text-center">
                              <div className="text-xs text-slate-400 uppercase font-bold">
                                Debut
                              </div>
                              <div className="text-sm font-bold text-red-400">
                                {player.debut_year
                                  ? new Date(player.debut_year).getFullYear()
                                  : "N/A"}
                              </div>
                            </div>
                          </div>

                          <div className="w-full py-3 text-xs font-black uppercase tracking-widest text-center border border-white/10 rounded-lg bg-white/5 group-hover:bg-white/15 group-hover:border-white/20 group-hover:text-white transition-all duration-300">
                            View Profile
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Stats */}
          {(activeTab === "overview" || activeTab === "stats") && (
            <>
              <div className="h-16" />
              <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
                <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                  <span className="w-3 h-10 bg-gradient-to-b from-blue-600 to-cyan-600 block skew-x-[-15deg]" />
                  Team Statistics
                </h2>

                {seasons.length > 0 && (
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm p-1 rounded-xl border border-white/10">
                    <span className="text-slate-400 uppercase text-xs font-bold px-3">
                      Season:
                    </span>
                    <select
                      value={selectedSeason}
                      onChange={(e) =>
                        setSelectedSeason(Number(e.target.value))
                      }
                      className="bg-black/60 text-white text-sm font-bold uppercase px-4 py-2 rounded-lg border-none focus:ring-2 focus:ring-red-500 outline-none cursor-pointer hover:bg-zinc-800 transition-colors"
                    >
                      {seasons.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {!teamStats ? (
                <div className="text-slate-500 text-center py-12 bg-black/30 backdrop-blur-sm rounded-2xl border border-white/10 border-dashed">
                  <Activity size={48} className="mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-bold uppercase mb-2">
                    {loadingStats
                      ? "Loading Statistics..."
                      : "Performance Data Not Available"}
                  </h3>
                  <p className="text-slate-400">
                    {loadingStats
                      ? "Fetching team performance data..."
                      : "Team statistics will be available once the season begins."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Summary pills */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                    {[
                      {
                        label: "Matches Played",
                        value: teamStats.played,
                        color: "text-white",
                        glow: "",
                      },
                      {
                        label: "Won",
                        value: teamStats.wins,
                        color: "text-green-400",
                        glow: "shadow-[0_0_20px_-5px_rgba(74,222,128,0.3)]",
                      },
                      {
                        label: "Draw",
                        value: teamStats.draws,
                        color: "text-yellow-400",
                        glow: "",
                      },
                      {
                        label: "Lost",
                        value:
                          teamStats.played - teamStats.wins - teamStats.draws,
                        color: "text-red-400",
                        glow: "shadow-[0_0_20px_-5px_rgba(248,113,113,0.3)]",
                      },
                      {
                        label: "Rank",
                        value: `#${teamStats.rank}`,
                        color: "text-blue-400",
                        glow: "shadow-[0_0_20px_-5px_rgba(96,165,250,0.3)]",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl text-center hover:bg-black/60 transition-colors ${stat.glow}`}
                      >
                        <div
                          className={`text-4xl font-black mb-1 ${stat.color}`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 lg:col-span-2 shadow-[0_0_30px_-10px_rgba(220,38,38,0.2)]">
                      <h3 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-red-500" /> Match
                        Results
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={[
                            {
                              label: "Matches",
                              value: teamStats.played,
                              fill: "#3b82f6",
                            },
                            {
                              label: "Wins",
                              value: teamStats.wins,
                              fill: "#22c55e",
                            },
                            {
                              label: "Losses",
                              value:
                                teamStats.played -
                                teamStats.wins -
                                teamStats.draws,
                              fill: "#ef4444",
                            },
                            {
                              label: "Draws",
                              value: teamStats.draws,
                              fill: "#eab308",
                            },
                          ]}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#1e293b"
                            horizontal={false}
                          />
                          <XAxis
                            type="number"
                            stroke="#475569"
                            tick={{ fill: "#94a3b8" }}
                          />
                          <YAxis
                            dataKey="label"
                            type="category"
                            stroke="#475569"
                            width={100}
                            tick={{
                              fill: "#cbd5e1",
                              fontSize: 12,
                              fontWeight: "bold",
                            }}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.03)" }}
                          />
                          <Bar
                            dataKey="value"
                            radius={[0, 6, 6, 0]}
                            barSize={30}
                            animationDuration={1500}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_-10px_rgba(37,99,235,0.2)]">
                      <h3 className="font-bold uppercase mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-blue-500" /> Team
                        Balance
                      </h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData} outerRadius="70%">
                          <PolarGrid stroke="#1e293b" />
                          <PolarAngleAxis
                            dataKey="metric"
                            tick={{ fill: "#94a3b8", fontSize: 10 }}
                          />
                          <Radar
                            dataKey="value"
                            stroke="#ef4444"
                            fill="#ef4444"
                            fillOpacity={0.35}
                          />
                          <Tooltip
                            formatter={(value: any, name: any, props: any) => {
                              const { type } = props.payload;
                              if (type === "points")
                                return [`${(value / 10).toFixed(2)} pts`, name];
                              return [`${value.toFixed(1)}%`, name];
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Attack & Defence */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Attack */}
                    <div className="bg-black/40 backdrop-blur-xl p-8 border border-white/10 rounded-2xl relative overflow-hidden shadow-[0_0_40px_-10px_rgba(220,38,38,0.25)]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/8 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-orange-500 to-transparent rounded-t-2xl" />

                      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
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
                              {teamStats.total_raids}
                            </div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                              Total Raids
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-green-400 mb-1">
                              {teamStats.successful_raid}
                            </div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                              Successful
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold uppercase mb-2">
                            <span className="text-slate-300">Success Rate</span>
                            <span className="text-red-400">
                              {percent(
                                Number(teamStats.successful_raid),
                                Number(teamStats.total_raids),
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-1000 rounded-full"
                              style={{
                                width: `${percent(Number(teamStats.successful_raid), Number(teamStats.total_raids)).toFixed(1)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              label: "Super Raids",
                              value: teamStats.super_raid,
                              color: "text-white",
                            },
                            {
                              label: "Raid Points",
                              value: teamStats.raid_points,
                              color: "text-white",
                            },
                            {
                              label: "Bonus Points",
                              value: teamStats.bonus_point,
                              color: "text-orange-400",
                            },
                            {
                              label: "Empty Raids",
                              value: teamStats.empty_raid,
                              color: "text-red-400",
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="bg-black/50 border border-white/5 p-4 rounded-xl hover:border-red-500/20 transition-colors"
                            >
                              <div
                                className={`text-2xl font-black ${item.color}`}
                              >
                                {item.value}
                              </div>
                              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Defence */}
                    <div className="bg-black/40 backdrop-blur-xl p-8 border border-white/10 rounded-2xl relative overflow-hidden shadow-[0_0_40px_-10px_rgba(37,99,235,0.25)]">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-cyan-500 to-transparent rounded-t-2xl" />

                      <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
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
                              {teamStats.total_tackles}
                            </div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                              Total Tackles
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-black text-green-400 mb-1">
                              {teamStats.successful_tackle}
                            </div>
                            <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                              Successful
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-bold uppercase mb-2">
                            <span className="text-slate-300">Success Rate</span>
                            <span className="text-blue-400">
                              {percent(
                                Number(teamStats.successful_tackle),
                                Number(teamStats.total_tackles),
                              ).toFixed(1)}
                              %
                            </span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all duration-1000 rounded-full"
                              style={{
                                width: `${percent(Number(teamStats.successful_tackle), Number(teamStats.total_tackles)).toFixed(1)}%`,
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          {[
                            {
                              label: "Super Tackles",
                              value: teamStats.super_tackle,
                              color: "text-white",
                            },
                            {
                              label: "Tackle Points",
                              value: teamStats.tackle_points,
                              color: "text-white",
                            },
                            {
                              label: "Total Points",
                              value: teamStats.total_points,
                              color: "text-cyan-400",
                            },
                            {
                              label: "Highest Score",
                              value: teamStats.highest_score,
                              color: "text-blue-400",
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="bg-black/50 border border-white/5 p-4 rounded-xl hover:border-blue-500/20 transition-colors"
                            >
                              <div
                                className={`text-2xl font-black ${item.color}`}
                              >
                                {item.value}
                              </div>
                              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                                {item.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TeamDetails;
