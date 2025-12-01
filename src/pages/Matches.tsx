import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Filter, Search } from "lucide-react";
import { MATCHES, TEAMS } from "../data/mockData";
import Layout from "../components/layout/Layout";
import { Link } from "react-router-dom";

const Matches = () => {
  const [filterStatus, setFilterStatus] = useState<
    "ALL" | "LIVE" | "UPCOMING" | "RECENT"
  >("ALL");
  const [selectedSeason, setSelectedSeason] = useState("2025");
  const [selectedTeam, setSelectedTeam] = useState("ALL");
  const [searchDate, setSearchDate] = useState("");

  const getTeam = (id: string) => TEAMS.find((t) => t.id === id);

  // Filter Logic
  const filteredMatches = MATCHES.filter((match) => {
    // Status Filter
    if (filterStatus === "LIVE" && match.status !== "LIVE") return false;
    if (filterStatus === "UPCOMING" && match.status !== "Upcoming")
      return false;
    if (filterStatus === "RECENT" && match.status !== "FT") return false;

    // Team Filter
    if (
      selectedTeam !== "ALL" &&
      match.team1 !== selectedTeam &&
      match.team2 !== selectedTeam
    )
      return false;

    // Date Filter
    if (searchDate && !match.date.includes(searchDate)) return false;

    return true;
  });

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                Match Schedule
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 transform -skew-x-12" />
          </motion.div>

          {/* Filters Section */}
          <div className="max-w-4xl mx-auto mb-8 space-y-4">
            {/* Top Row: Status Tabs */}
            <div className="flex justify-center gap-4 border-b border-white/10 pb-4">
              {(["ALL", "LIVE", "UPCOMING", "RECENT"] as const).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all ${
                      filterStatus === status
                        ? "bg-red-600 text-white shadow-lg shadow-red-900/20"
                        : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            {/* Bottom Row: Advanced Filters */}
            <div className="bg-slate-900/50 p-4 rounded-xl border border-white/10 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-sm font-bold uppercase">
                <Filter size={16} /> Filters:
              </div>

              <div className="flex flex-wrap gap-4 flex-1 justify-end">
                {/* Season Select */}
                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="bg-black border border-white/10 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="2025">Season 2025</option>
                  <option value="2024">Season 2024</option>
                </select>

                {/* Team Select */}
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="bg-black border border-white/10 rounded px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                >
                  <option value="ALL">All Teams</option>
                  {TEAMS.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>

                {/* Date Search */}
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search Date (e.g. Jan 25)"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="bg-black border border-white/10 rounded pl-9 pr-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500 w-48"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Matches List */}
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredMatches.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-bold uppercase">
                No matches found matching your criteria
              </div>
            ) : (
              filteredMatches.map((match, index) => {
                const team1 = getTeam(match.team1);
                const team2 = getTeam(match.team2);

                if (!team1 || !team2) return null;

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
                      transition={{ delay: index * 0.1 }}
                      className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/10 hover:border-red-500/30 hover:shadow-red-500/10 transition-all duration-300 group cursor-pointer"
                    >
                      <div className="bg-black/40 px-6 py-3 flex justify-between items-center border-b border-white/5">
                        <div className="flex items-center space-x-2">
                          <span className="bg-gradient-to-r from-red-600 to-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/20">
                            {match.type}
                          </span>
                          <span className="text-slate-400 text-sm font-medium flex items-center">
                            <Calendar className="w-4 h-4 mr-1" /> {match.date}
                          </span>
                        </div>
                        <div className="flex items-center text-slate-400 text-sm font-medium">
                          <Clock className="w-4 h-4 mr-1" /> {match.status}
                        </div>
                      </div>

                      <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                          {/* Team 1 */}
                          <div className="flex-1 flex flex-col items-center md:items-end text-center md:text-right">
                            <div className="w-20 h-20 md:w-24 md:h-24 mb-4 relative group-hover:scale-110 transition-transform duration-300">
                              <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <img
                                src={team1.logo}
                                alt={team1.name}
                                className="w-full h-full object-contain drop-shadow-lg relative z-10"
                              />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white uppercase leading-tight">
                              {team1.name}
                            </h3>
                          </div>

                          {/* Score / VS */}
                          <div className="flex flex-col items-center justify-center w-full md:w-auto shrink-0">
                            <div className="text-4xl md:text-5xl font-black text-white flex items-center gap-4">
                              <span
                                className={
                                  match.score1 > match.score2
                                    ? "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500"
                                    : ""
                                }
                              >
                                {match.score1}
                              </span>
                              <span className="text-2xl text-slate-600 font-medium">
                                -
                              </span>
                              <span
                                className={
                                  match.score2 > match.score1
                                    ? "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500"
                                    : ""
                                }
                              >
                                {match.score2}
                              </span>
                            </div>
                            <div className="mt-2 flex items-center text-slate-500 text-sm font-medium">
                              <MapPin className="w-4 h-4 mr-1" />
                              {match.venue}
                            </div>
                            <div className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                              View Details
                            </div>
                          </div>

                          {/* Team 2 */}
                          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
                            <div className="w-20 h-20 md:w-24 md:h-24 mb-4 relative group-hover:scale-110 transition-transform duration-300">
                              <div className="absolute inset-0 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <img
                                src={team2.logo}
                                alt={team2.name}
                                className="w-full h-full object-contain drop-shadow-lg relative z-10"
                              />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white uppercase leading-tight">
                              {team2.name}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Gradient Border */}
                      <div className="h-1 w-full bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    </motion.div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Matches;
