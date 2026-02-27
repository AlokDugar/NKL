import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Layout from "../components/layout/Layout";
import { fetchNews, type NewsItem } from "../api";

const ITEMS_PER_PAGE = 9;

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchNews()
      .then(setNews)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
  const paginatedNews = news.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
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

  return (
    <Layout>
      <div className="pt-24 pb-20 min-h-screen bg-slate-950 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight mb-4">
              <span className="inline-block pr-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 [text-shadow:0.06em_0_0_transparent]">
                Latest News
              </span>
            </h1>
            <div className="h-1 w-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 transform -skew-x-12" />
          </motion.div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500 to-blue-500 animate-spin [mask:radial-gradient(farthest-side,transparent_60%,black_60%)]" />
              </div>
              <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest animate-pulse">
                Loading news...
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {paginatedNews.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-slate-900/50 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/10 group hover:shadow-2xl hover:border-red-500/30 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute top-4 left-4 z-10">
                        <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                          {item.category}
                        </span>
                      </div>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                        <Calendar className="w-3 h-3 mr-1" />
                        {item.date}
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight mb-4 group-hover:text-red-500 transition-colors line-clamp-3 flex-1">
                        {item.title}
                      </h3>
                      <button className="text-sm font-bold uppercase tracking-wider text-slate-400 group-hover:text-white flex items-center transition-colors mt-auto">
                        Read More{" "}
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>

                    <div className="h-1 w-full bg-gradient-to-r from-red-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </motion.div>
                ))}
              </div>

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
                      <span
                        key={`ellipsis-${i}`}
                        className="text-slate-500 px-1"
                      >
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
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default News;
