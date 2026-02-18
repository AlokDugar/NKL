import React from "react";
import { motion } from "framer-motion";
import { ABOUT_CONTENT } from "../data/mockData";
import Layout from "../components/layout/Layout";

const About = () => {
  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Page heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-4">
              <span className="inline-block px-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                About NKL
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 transform -skew-x-12" />
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
              {/* Diagonal color accent */}
              <div
                className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-br from-red-600/10 to-blue-600/10 pointer-events-none"
                style={{
                  clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)",
                }}
              />

              <div className="flex flex-col md:flex-row items-center p-8 md:p-12 gap-10">
                {/* Left: logo contained, not cropped */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="md:w-2/5 flex items-center justify-center"
                >
                  <img
                    src={ABOUT_CONTENT.image}
                    alt="NKL Logo"
                    className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl"
                  />
                </motion.div>

                {/* Right: text content */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="md:w-3/5 flex flex-col justify-center"
                >
                  <h2 className="text-2xl md:text-3xl font-black italic tracking-tight text-white mb-5 leading-tight">
                    {ABOUT_CONTENT.title}
                  </h2>

                  <p className="text-slate-300 text-base leading-relaxed">
                    {ABOUT_CONTENT.description}
                  </p>
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
