import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import Layout from '../components/layout/Layout';

const VideoHub = () => {
  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-red-500/30"
          >
            <Play className="w-10 h-10 text-white fill-current ml-1" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter mb-4 text-white"
          >
            Video Hub
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-slate-400 font-medium max-w-lg mx-auto"
          >
            Highlights, interviews, and exclusive content coming soon!
          </motion.p>
        </div>
      </div>
    </Layout>
  );
};

export default VideoHub;
