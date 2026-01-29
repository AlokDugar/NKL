import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface NewsItem {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  created_at: string;
}

const NewsSection = () => {
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

        setNews(items.slice(0, 3));
      })
      .catch((err) => console.error("Error fetching news:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-20 bg-zinc-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-red-900/20 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-900/20 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-bold uppercase tracking-widest text-sm block mb-2"
            >
              Latest Updates
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight"
            >
              Breaking{" "}
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-600 pr-1">
                News
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <Link
              to="/news"
              className="group flex items-center gap-2 text-white font-bold uppercase tracking-wider hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-500 hover:to-blue-500 transition-all"
            >
              View All News
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform text-red-500 group-hover:text-blue-500"
              />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="text-center text-white py-12 font-bold">
            Loading news...
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="news-swiper !pb-12"
          >
            {news.map((item, index) => (
              <SwiperSlide key={item.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-black border border-white/10 rounded-xl overflow-hidden h-full hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:shadow-red-900/20"
                >
                  {/* Gradient Border on Hover */}
                  <div className="absolute inset-0 rounded-xl p-[1px] bg-gradient-to-r from-red-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  <div className="aspect-[16/10] overflow-hidden relative rounded-t-xl">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-6 relative bg-zinc-950 rounded-b-xl h-full">
                    <div className="flex items-center gap-4 text-gray-400 text-xs mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-red-500" />
                        {item.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-blue-500" />2 min read
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 transition-all leading-tight">
                      {item.title}
                    </h3>

                    <Link
                      to="/news"
                      className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white uppercase tracking-wider transition-colors group/link"
                    >
                      Read More
                      <ArrowRight
                        size={16}
                        className="group-hover/link:translate-x-1 transition-transform text-red-500 group-hover/link:text-blue-500"
                      />
                    </Link>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default NewsSection;
