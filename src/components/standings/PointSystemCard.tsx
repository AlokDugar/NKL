import React from "react";
import { motion } from "framer-motion";

const PointSystemCard = () => {
  const pointRules = [
    { label: "Win", points: "5 Pts", color: "from-emerald-400 to-emerald-600" },
    { label: "Tie", points: "3 Pts", color: "from-slate-400 to-slate-500" },
    {
      label: "Loss ≤7 Pts",
      points: "1 Pt",
      color: "from-yellow-400 to-yellow-500",
    },
    { label: "Loss >7 Pts", points: "0 Pts", color: "from-red-500 to-red-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="nkl-card p-6 bg-slate-900/70 backdrop-blur-lg rounded-2xl shadow-xl"
    >
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-red-500 to-blue-500 rounded-full">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold uppercase tracking-wide text-white">
          NKL Point System
        </h3>
      </div>

      {/* Points Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pointRules.map((rule, index) => (
          <motion.div
            key={rule.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-4 rounded-xl border border-white/10 hover:scale-105 transition-transform bg-gradient-to-tl from-black/40 to-black/20 shadow-md"
          >
            <div
              className={`text-2xl font-extrabold mb-1 bg-clip-text text-transparent bg-gradient-to-r ${rule.color}`}
            >
              {rule.points}
            </div>
            <div className="text-xs font-medium text-slate-300 uppercase tracking-wide text-center">
              {rule.label}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PointSystemCard;
