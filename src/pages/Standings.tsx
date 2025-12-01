import React from 'react';
import { motion } from 'framer-motion';
import { TEAMS, STANDINGS } from '../data/mockData';
import Layout from '../components/layout/Layout';

const Standings = () => {
  const getTeam = (id: string) => TEAMS.find((t) => t.id === id);

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
                League Standings
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 transform -skew-x-12" />
          </motion.div>

          <div className="max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/10">
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
                    <th className="py-4 px-6 text-center font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {STANDINGS.map((row, index) => {
                    const team = getTeam(row.teamId);
                    if (!team) return null;

                    return (
                      <motion.tr
                        key={row.teamId}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index < 4 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {row.rank}
                          </div>
                        </td>
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
                        <td className="py-4 px-6 text-center font-medium text-slate-400">{row.played}</td>
                        <td className="py-4 px-6 text-center font-medium text-green-500">{row.won}</td>
                        <td className="py-4 px-6 text-center font-medium text-red-500">{row.lost}</td>
                        <td className="py-4 px-6 text-center font-medium text-slate-400">{row.draw}</td>
                        <td className="py-4 px-6 text-center">
                          <span className="text-xl font-black text-white">{row.points}</span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Legend */}
            <div className="bg-black/20 px-6 py-4 border-t border-white/5 flex items-center space-x-6 text-xs font-medium text-slate-400 uppercase tracking-wide">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                Qualified for Playoffs
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Standings;
