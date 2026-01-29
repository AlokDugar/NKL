import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Layout from "../components/layout/Layout";

interface Team {
  id: number;
  name: string;
  slug: string;
  logo: string;
  primary_color: string;
}

const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  useEffect(() => {
    fetch(`${API_BASE_URL}/teams`)
      .then((res) => res.json())
      .then((data) => setTeams(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-4">
              <span className="inline-block pr-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 [text-shadow:0.06em_0_0_transparent]">
                The Teams
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 transform -skew-x-12" />
          </motion.div>

          {loading ? (
            <div className="text-center py-12 text-white">Loading teams...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {teams.map((team, index) => (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/team/${team.slug}`}
                    className="group block h-full"
                  >
                    <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/10 h-full flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:border-red-500/30 relative">
                      {/* Background Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black opacity-50 group-hover:opacity-0 transition-opacity duration-300" />

                      {/* Team Color Accent */}
                      <div
                        className="h-2 w-full"
                        style={{
                          background: `linear-gradient(to right, ${team.primary_color}, #ef4444)`,
                        }}
                      />

                      <div className="p-8 flex-1 flex flex-col items-center justify-center relative z-10">
                        <div className="w-40 h-40 mb-8 relative transform transition-transform duration-500 group-hover:scale-110">
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-blue-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <img
                            src={team.logo}
                            alt={team.name}
                            className="w-full h-full object-contain drop-shadow-xl relative z-10"
                          />
                        </div>

                        <h3 className="text-2xl font-black text-white uppercase text-center mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 transition-all duration-300">
                          {team.name}
                        </h3>

                        <div className="mt-6 flex items-center text-sm font-bold text-slate-400 uppercase tracking-wider group-hover:text-white transition-colors">
                          View Team Details{" "}
                          <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Teams;
