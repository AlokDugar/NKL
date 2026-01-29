import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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

const chartStyles = `
  .recharts-default-tooltip { background: rgba(0,0,0,0.85) !important; border: 1px solid rgba(255,255,255,0.1) !important; border-radius: 8px !important; }
  .recharts-tooltip-label { color: #fff !important; font-weight: bold !important; }
  .recharts-tooltip-item { color: #ccc !important; }
`;

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const TeamDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [squadData, setSquadData] = useState(null);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [teamStats, setTeamStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const percent = (num, den) => (den > 0 ? (num / den) * 100 : 0);
  const avg = (total, matches) => (matches > 0 ? total / matches : 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const teamRes = await fetch(`${API_BASE_URL}/teams/${slug}`);
        if (!teamRes.ok) throw new Error("Team not found");
        const teamData = await teamRes.json();
        setTeam(teamData.data);

        const seasonsRes = await fetch(`${API_BASE_URL}/seasons`);
        const seasonsData = await seasonsRes.json();
        setSeasons(seasonsData.data || []);
        if (seasonsData.data?.length > 0) {
          setSelectedSeason(seasonsData.data[0].id);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchSquadPlayers = async () => {
      if (!slug || !selectedSeason) return;

      try {
        const squadRes = await fetch(
          `${API_BASE_URL}/squads?team_slug=${slug}&season_id=${selectedSeason}`,
        );
        const squadData = await squadRes.json();

        if (squadData.data?.data?.[0]) {
          const squad = squadData.data.data[0];
          setSquadData(squad);

          if (squad.players) {
            const squadPlayers = squad.players.map((p) => ({
              ...p.player,
              jersey: p.jersey,
              isCaptain: p.player.id === squad.captain,
              isSubCaptain: p.player.id === squad.sub_captain,
            }));
            setPlayers(squadPlayers);
          } else {
            setPlayers([]);
          }
        } else {
          setPlayers([]);
          setSquadData(null);
        }
      } catch (err) {
        console.error("Failed to fetch squad:", err);
        setPlayers([]);
        setSquadData(null);
      }
    };

    fetchSquadPlayers();
  }, [slug, selectedSeason]);

  useEffect(() => {
    const fetchTeamStats = async () => {
      if (!team?.id || !selectedSeason) return;

      try {
        setLoadingStats(true);
        const statsRes = await fetch(
          `${API_BASE_URL}/team-stats?team_id=${team.id}&season_id=${selectedSeason}`,
        );
        const statsData = await statsRes.json();
        setTeamStats(statsData.data?.[0] || null);
        setLoadingStats(false);
      } catch (err) {
        console.error("Failed to fetch team stats:", err);
        setTeamStats(null);
        setLoadingStats(false);
      }
    };

    fetchTeamStats();
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
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-slate-400">Loading team data...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Team Not Found</h1>
          <p className="text-slate-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <style>{chartStyles}</style>

      <div className="relative h-[65vh] md:h-[75vh] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-contain opacity-40"
          style={{ backgroundImage: `url(${team.featured_img || team.logo})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 z-10">
          <div className="container mx-auto flex flex-col md:flex-row items-end gap-8">
            <div className="w-32 h-32 md:w-48 md:h-48 bg-black/40 backdrop-blur-xl rounded-full p-4 border-4 border-red-600/40 shadow-[0_0_40px_rgba(220,38,38,0.6)] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-red-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={team.logo}
                alt={team.name}
                className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
              />
            </div>

            <div className="flex-1 mb-4">
              <button
                onClick={() => navigate("/team")}
                className="flex items-center gap-2 text-red-500 font-bold uppercase mb-2 hover:text-red-400 transition-colors"
              >
                <ArrowLeft size={20} /> Back to Teams
              </button>

              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-red-900/50">
                  {seasons.find((s) => s.id === selectedSeason)?.name ||
                    "Season"}
                </span>
                {teamStats && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg shadow-blue-900/50">
                    Rank #{teamStats.rank}
                  </span>
                )}
              </div>

              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400 drop-shadow-sm">
                {team.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/80 text-lg">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10">
                  <Users size={18} className="text-red-500" />
                  <span className="text-slate-400 text-sm uppercase font-bold mr-2">
                    Home:
                  </span>
                  <span className="font-bold text-white">
                    {team.home_ground || team.address || "TBA"}
                  </span>
                </div>

                {team.social_links?.website &&
                  team.social_links.website !== "#" && (
                    <a
                      href={team.social_links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-red-600 hover:border-red-500 transition-all group"
                    >
                      <Globe
                        size={18}
                        className="text-blue-400 group-hover:text-white"
                      />
                      <span className="font-bold group-hover:text-white">
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

      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-40 shadow-2xl">
        <div className="container mx-auto px-4 md:px-16">
          <div className="flex overflow-x-auto gap-8 no-scrollbar">
            {["overview", "players", "stats"].map((tab) => (
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
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-red-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-16 py-12">
        {activeTab === "overview" && team.description && (
          <div className="mb-16">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4 mb-8">
              <span className="w-3 h-10 bg-gradient-to-b from-red-600 to-blue-600 block skew-x-[-15deg]" />
              About {team.name}
            </h2>
            <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-8">
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {team.description}
              </p>
            </div>
          </div>
        )}

        {(activeTab === "overview" || activeTab === "players") && (
          <>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-3 h-10 bg-gradient-to-b from-red-600 to-blue-600 block skew-x-[-15deg]" />
                Squad ({players.length} Players)
              </h2>

              {seasons.length > 0 && (
                <div className="flex items-center gap-3 bg-zinc-900 p-1 rounded-lg border border-white/10">
                  <span className="text-slate-400 uppercase text-xs font-bold px-3">
                    Season:
                  </span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-black text-white text-sm font-bold uppercase px-4 py-2 rounded border-none focus:ring-2 focus:ring-red-500 outline-none cursor-pointer hover:bg-zinc-800 transition-colors"
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
              <div className="text-center py-20 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold uppercase">
                  No Players Available
                </h3>
                <p className="text-slate-400">Squad information coming soon.</p>
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
                    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.15)] hover:-translate-y-2 cursor-pointer">
                      <div className="aspect-[3/4] relative overflow-hidden bg-gradient-to-b from-zinc-800 to-zinc-900">
                        <img
                          src={player.photo}
                          alt={`${player.name} ${player.last_name}`}
                          className="w-full h-full object-contain object-bottom transition-transform duration-700 group-hover:scale-110 z-10 relative"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-20" />

                        {player.isCaptain && (
                          <span className="absolute top-4 right-4 bg-yellow-500 text-black text-[10px] font-black px-3 py-1 rounded uppercase tracking-wider shadow-lg z-30 flex items-center gap-1">
                            <span className="text-[12px] font-black">©</span>
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

                        <h3 className="text-xl font-black text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-orange-500 transition-all leading-none uppercase italic">
                          {player.name} {player.last_name}
                        </h3>

                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-black/40 p-2 rounded border border-white/5 text-center">
                            <div className="text-xs text-slate-400 uppercase font-bold">
                              Country
                            </div>
                            <div className="text-sm font-bold text-white">
                              {player.country?.code || "N/A"}
                            </div>
                          </div>
                          <div className="bg-black/40 p-2 rounded border border-white/5 text-center">
                            <div className="text-xs text-slate-400 uppercase font-bold">
                              Debut
                            </div>
                            <div className="text-sm font-bold text-red-500">
                              {player.debut_year
                                ? new Date(player.debut_year).getFullYear()
                                : "N/A"}
                            </div>
                          </div>
                        </div>

                        <div className="w-full py-3 text-xs font-black uppercase tracking-widest text-center border border-white/10 rounded bg-white/5 group-hover:bg-red-600 group-hover:border-red-500 group-hover:text-white transition-all duration-300">
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

        {(activeTab === "overview" || activeTab === "stats") && (
          <>
            <div className="h-4" />
            <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-6">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter flex items-center gap-4">
                <span className="w-3 h-10 bg-gradient-to-b from-blue-600 to-cyan-600 block skew-x-[-15deg]" />
                Team Statistics
              </h2>

              {seasons.length > 0 && (
                <div className="flex items-center gap-3 bg-zinc-900 p-1 rounded-lg border border-white/10">
                  <span className="text-slate-400 uppercase text-xs font-bold px-3">
                    Season:
                  </span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-black text-white text-sm font-bold uppercase px-4 py-2 rounded border-none focus:ring-2 focus:ring-red-500 outline-none cursor-pointer hover:bg-zinc-800 transition-colors"
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
              <div className="text-slate-500 text-center py-12 bg-zinc-900/30 rounded-2xl border border-white/5 border-dashed">
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
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                  {[
                    {
                      label: "Matches Played",
                      value: teamStats.played,
                      color: "text-white",
                    },
                    {
                      label: "Won",
                      value: teamStats.wins,
                      color: "text-green-500",
                    },
                    {
                      label: "Draw",
                      value: teamStats.draws,
                      color: "text-yellow-500",
                    },
                    {
                      label: "Lost",
                      value:
                        teamStats.played - teamStats.wins - teamStats.draws,
                      color: "text-red-500",
                    },
                    {
                      label: "Rank",
                      value: `#${teamStats.rank}`,
                      color: "text-blue-500",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-zinc-900/50 border border-white/5 p-6 rounded-xl text-center hover:bg-zinc-800/50 transition-colors group"
                    >
                      <div className={`text-4xl font-black mb-1 ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                  <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5 lg:col-span-2">
                    <h3 className="text-lg font-bold uppercase mb-6 flex items-center gap-2">
                      <Activity size={18} className="text-red-500" />
                      Match Results
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

                  <div className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
                    <h3 className="font-bold uppercase mb-4 flex items-center gap-2">
                      <Shield size={18} className="text-blue-500" />
                      Team Balance
                    </h3>

                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={radarData} outerRadius="70%">
                        <PolarGrid stroke="#333" />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fill: "#aaa", fontSize: 10 }}
                        />
                        <Radar
                          dataKey="value"
                          stroke="#ef4444"
                          fill="#ef4444"
                          fillOpacity={0.45}
                        />
                        <Tooltip
                          formatter={(value, name, props) => {
                            const { type } = props.payload;

                            if (type === "points") {
                              return [`${(value / 10).toFixed(2)} pts`, name];
                            }
                            return [`${value.toFixed(1)}%`, name];
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-zinc-900 to-black p-8 border border-white/10 rounded-2xl relative overflow-hidden">
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
                            {teamStats.total_raids}
                          </div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                            Total Raids
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-green-500 mb-1">
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
                          <span className="text-red-500">
                            {percent(
                              Number(teamStats.successful_raid),
                              Number(teamStats.total_raids),
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-red-600 to-orange-600 transition-all duration-1000"
                            style={{
                              width: `${percent(
                                Number(teamStats.successful_raid),
                                Number(teamStats.total_raids),
                              ).toFixed(1)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {teamStats.super_raid}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Super Raids
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {teamStats.raid_points}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Raid Points
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-orange-500">
                            {teamStats.bonus_point}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Bonus Points
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-red-400">
                            {teamStats.empty_raid}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Empty Raids
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-zinc-900 to-black p-8 border border-white/10 rounded-2xl relative overflow-hidden">
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
                            {teamStats.total_tackles}
                          </div>
                          <div className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                            Total Tackles
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-green-500 mb-1">
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
                          <span className="text-blue-500">
                            {percent(
                              Number(teamStats.successful_tackle),
                              Number(teamStats.total_tackles),
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all duration-1000"
                            style={{
                              width: `${percent(
                                Number(teamStats.successful_tackle),
                                Number(teamStats.total_tackles),
                              ).toFixed(1)}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {teamStats.super_tackle}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Super Tackles
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-white">
                            {teamStats.tackle_points}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Tackle Points
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-cyan-500">
                            {teamStats.total_points}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Total Points
                          </div>
                        </div>
                        <div className="bg-black/40 border border-white/5 p-4 rounded-xl">
                          <div className="text-2xl font-black text-blue-400">
                            {teamStats.highest_score}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                            Highest Score
                          </div>
                        </div>
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
  );
};

export default TeamDetails;
