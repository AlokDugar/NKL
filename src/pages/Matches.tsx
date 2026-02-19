import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";

/* ---------- Types ---------- */
interface Team {
  id: number;
  name: string;
  logo: string;
}

interface MatchDetails {
  first_team_score?: number;
  second_team_score?: number;
  status?: number; // 1 = finished
}

interface Stadium {
  name: string;
}

interface Match {
  id: number;
  type: string;
  date: string;
  season_id?: number;
  first_team: Team;
  second_team: Team;
  details?: MatchDetails;
  stadium?: Stadium;
}

interface Season {
  id: number;
  name: string;
}

/* ---------- Constants ---------- */
const ITEMS_PER_PAGE = 6;

/* ---------- Component ---------- */
const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "LIVE" | "UPCOMING" | "RECENT"
  >("ALL");
  const [selectedSeason, setSelectedSeason] = useState("ALL");
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [searchDate, setSearchDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /* ---------- Fetch ---------- */
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/games`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/seasons`).then((r) => r.json()),
    ])
      .then(([gamesRes, seasonsRes]) => {
        const sortedMatches = (gamesRes.data || []).sort(
          (a: Match, b: Match) =>
            new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

        setMatches(sortedMatches);
        setSeasons(seasonsRes.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- Reset page on filter ---------- */
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, selectedSeason, selectedTeam, searchDate]);

  /* ---------- Status helper ---------- */
  const getMatchStatus = (match: Match) => {
    const s1 = Number(match.details?.first_team_score ?? 0);
    const s2 = Number(match.details?.second_team_score ?? 0);

    if (match.details?.status === 1) return "RECENT";
    if (s1 !== 0 || s2 !== 0) return "LIVE";
    return "UPCOMING";
  };

  /* ---------- Filtering ---------- */
  const filteredMatches = matches.filter((match) => {
    const status = getMatchStatus(match);

    if (filterStatus !== "ALL" && status !== filterStatus) return false;

    if (
      selectedSeason !== "ALL" &&
      match.season_id?.toString() !== selectedSeason
    )
      return false;

    if (
      selectedTeam !== "ALL" &&
      match.first_team.id.toString() !== selectedTeam &&
      match.second_team.id.toString() !== selectedTeam
    )
      return false;

    if (searchDate && !match.date.includes(searchDate)) return false;

    return true;
  });

  /* ---------- Pagination ---------- */
  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);

  const paginatedMatches = filteredMatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  /* ---------- Render ---------- */
  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-4">
              <span className="inline-block pr-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                Match Schedule
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 -skew-x-12" />
          </motion.div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            <div className="flex justify-center gap-4 border-b border-white/10 pb-4">
              {(["ALL", "LIVE", "UPCOMING", "RECENT"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all ${
                      filterStatus === status
                        ? "bg-red-600 text-white shadow-lg"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                ),
              )}
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase">
                <Filter size={16} /> Filters:
              </div>

              <div className="flex flex-wrap gap-4 flex-1 justify-end">
                {/* Season */}
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="bg-black border border-white/10 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="ALL">All Seasons</option>
                  {seasons.map((season) => (
                    <option key={season.id} value={season.id}>
                      {season.name}
                    </option>
                  ))}
                </select>

                {/* Team */}
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="bg-black border border-white/10 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="ALL">All Teams</option>
                  {[
                    ...new Map(
                      matches.flatMap((m) => [
                        [m.first_team.id, m.first_team],
                        [m.second_team.id, m.second_team],
                      ]),
                    ).values(),
                  ].map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>

                {/* Date */}
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search Date (YYYY-MM-DD)"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="bg-black border border-white/10 rounded pl-9 pr-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Match List */}
          <div className="max-w-4xl mx-auto space-y-8">
            {loading ? (
              <div className="text-center py-20 text-slate-400 font-bold">
                Loading matches...
              </div>
            ) : paginatedMatches.length === 0 ? (
              <div className="text-center py-20 text-slate-500 font-bold uppercase">
                No matches found
              </div>
            ) : (
              paginatedMatches.map((match, index) => {
                const s1 = Number(match.details?.first_team_score ?? 0);
                const s2 = Number(match.details?.second_team_score ?? 0);
                const statusLabel = getMatchStatus(match);

                return (
                  <Link
                    to={`/matches/${match.id}`}
                    key={match.id}
                    className="block"
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-slate-900/50 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all group"
                    >
                      <div className="bg-black/40 px-6 py-3 flex justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="bg-gradient-to-r from-red-600 to-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                            {match.type}
                          </span>
                          <span className="text-slate-400 flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-1" />
                            {match.date}
                          </span>
                        </div>
                        <div className="flex items-center text-slate-400 text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          {statusLabel}
                        </div>
                      </div>

                      <div className="p-8 flex items-center justify-between">
                        <TeamBlock team={match.first_team} align="right" />

                        <div className="text-center">
                          <div className="text-4xl font-black flex gap-4">
                            <span>{s1}</span>
                            <span className="text-slate-600">-</span>
                            <span>{s2}</span>
                          </div>
                          <div className="mt-2 flex items-center text-slate-500 text-sm">
                            <MapPin className="w-4 h-4 mr-1" />
                            {match.stadium?.name || "TBD"}
                          </div>
                        </div>

                        <TeamBlock team={match.second_team} align="left" />
                      </div>

                      <div className="h-1 bg-gradient-to-r from-red-500 to-blue-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-14">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {getPageNumbers().map((page, i) =>
                page === "..." ? (
                  <span key={`ellipsis-${i}`} className="text-slate-500 px-1">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`relative w-10 h-10 rounded-full text-sm font-bold transition-all duration-300 ${
                      currentPage === page
                        ? "text-white"
                        : "text-slate-400 hover:text-white border border-white/10 hover:border-red-500/50"
                    }`}
                  >
                    {currentPage === page && (
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-blue-500" />
                    )}
                    <span className="relative z-10">{page}</span>
                  </button>
                ),
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-red-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

/* ---------- Team UI ---------- */
const TeamBlock = ({
  team,
  align,
}: {
  team: Team;
  align: "left" | "right";
}) => (
  <div className="flex-1 flex flex-col items-center">
    <img
      src={team.logo}
      alt={team.name}
      className={`w-20 h-20 object-contain mb-3 ${
        align === "left" ? "md:mr-6" : "md:ml-6"
      }`}
    />
    <h3 className="text-xl font-bold uppercase text-center">{team.name}</h3>
  </div>
);

export default Matches;
