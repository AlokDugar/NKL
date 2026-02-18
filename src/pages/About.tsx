import React from "react";
import { motion } from "framer-motion";
import { ABOUT_CONTENT } from "../data/mockData";
import Layout from "../components/layout/Layout";

const About = () => {
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
              <span className="inline-block px-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 [text-shadow:0.06em_0_0_transparent]">
                About NKL
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 transform -skew-x-12" />
          </motion.div>

          <div className="max-w-5xl mx-auto bg-slate-900/50 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/10">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <img
                  src={ABOUT_CONTENT.image}
                  alt="About NKL"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent" />
              </div>

              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <motion.h2
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl font-black text-white mb-6 uppercase italic"
                >
                  {ABOUT_CONTENT.title}
                </motion.h2>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="prose prose-lg text-slate-300"
                >
                  <p className="leading-relaxed">{ABOUT_CONTENT.description}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mt-8 pt-8 border-t border-white/10"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-1 bg-gradient-to-b from-red-500 to-blue-500 rounded-full" />
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                        Organized By
                      </p>
                      <p className="text-lg font-bold text-white">
                        Astrionix Management Pvt Ltd
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
