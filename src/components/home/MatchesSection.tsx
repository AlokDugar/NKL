import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MATCHES, TEAMS } from '../../data/mockData';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const MatchesSection = () => {
  const getTeam = (id: string) => TEAMS.find(t => t.id === id);

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/10 to-black pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-bold uppercase tracking-widest text-sm block mb-2"
          >
            Action Packed
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter"
          >
            Match <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600">Center</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {MATCHES.map((match, index) => {
            const team1 = getTeam(match.team1);
            const team2 = getTeam(match.team2);

            if (!team1 || !team2) return null;

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden hover:border-transparent transition-all duration-300 group relative"
              >
                {/* Gradient Border on Hover */}
                <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-red-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Match Header */}
                <div className="bg-white/5 px-6 py-3 flex justify-between items-center border-b border-white/5 relative z-10">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-bold text-sm uppercase tracking-wider">
                    {match.type}
                  </span>
                  <div className="flex items-center gap-4 text-gray-400 text-xs font-medium uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-blue-500" />
                      {match.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} className="text-red-500" />
                      {match.venue}
                    </span>
                  </div>
                </div>

                {/* Match Content */}
                <div className="p-8 relative z-10">
                  {/* VS Background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
                    <span className="text-[150px] font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">VS</span>
                  </div>

                  <div className="flex justify-between items-center relative z-10">
                    {/* Team 1 */}
                    <div className="flex flex-col items-center gap-4 flex-1">
                      <div className="w-20 h-20 md:w-24 md:h-24 relative">
                        <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/30 transition-colors duration-500" />
                        <img 
                          src={team1.logo} 
                          alt={team1.name} 
                          className="w-full h-full object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-white font-bold text-center uppercase text-sm md:text-base leading-tight max-w-[120px]">
                        {team1.name}
                      </h3>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center px-4">
                      <div className="flex items-center gap-4 md:gap-8 mb-2">
                        <span className={clsx(
                          "text-4xl md:text-6xl font-black tracking-tighter",
                          match.score1 > match.score2 ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400" : "text-gray-600"
                        )}>
                          {match.score1}
                        </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-blue-500 text-2xl font-light">:</span>
                        <span className={clsx(
                          "text-4xl md:text-6xl font-black tracking-tighter",
                          match.score2 > match.score1 ? "text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400" : "text-gray-600"
                        )}>
                          {match.score2}
                        </span>
                      </div>
                      <span className="bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                        {match.status}
                      </span>
                    </div>

                    {/* Team 2 */}
                    <div className="flex flex-col items-center gap-4 flex-1">
                      <div className="w-20 h-20 md:w-24 md:h-24 relative">
                        <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/30 transition-colors duration-500" />
                        <img 
                          src={team2.logo} 
                          alt={team2.name} 
                          className="w-full h-full object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <h3 className="text-white font-bold text-center uppercase text-sm md:text-base leading-tight max-w-[120px]">
                        {team2.name}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Match Footer */}
                <div className="bg-white/5 px-6 py-4 flex justify-center border-t border-white/5 group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-blue-600 transition-all duration-300 relative z-10">
                  <Link to="/schedule" className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    View Match Details
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/schedule" className="inline-block border border-white/20 hover:border-transparent hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 text-white px-8 py-3 rounded-full font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-red-500/20">
            View Full Schedule
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MatchesSection;
