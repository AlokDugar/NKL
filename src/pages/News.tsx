import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import Layout from "../components/layout/Layout";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  created_at: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://api-v1.nepalkabaddileague.com/api/items?category_slug=news&category_id=74"
    )
      .then((res) => res.json())
      .then((res) => {
        const items = (res.data?.data || []).map((item: any) => ({
          id: item.id,
          title: item.name, // map name → title
          category: item.category?.name, // map category object → name string
          image: item.photo, // map photo → image
          date: item.created_at, // you can format this later
          created_at: item.created_at,
        }));

        items.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        setNews(items);
      })
      .catch((err) => console.error("Error fetching news:", err))
      .finally(() => setLoading(false));
  }, []);

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
            <div className="text-center text-white py-12 font-bold">
              Loading news...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {news.map((item, index) => (
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

                  {/* Bottom Gradient Border */}
                  <div className="h-1 w-full bg-gradient-to-r from-red-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default News;
