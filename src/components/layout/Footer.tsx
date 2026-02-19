import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";

interface Partner {
  id: number;
  name: string;
  logo: string;
  link: string;
  category: {
    id: number;
    name: string;
  };
}

const Footer = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${API_BASE_URL}/partners`)
      .then((res) => res.json())
      .then((data) => setPartners(data.data || []))
      .finally(() => setLoading(false));
  }, []);

  const quickLinks = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Teams", path: "/team" },
    { label: "Matches", path: "/schedule" },
    { label: "Standings", path: "/standings" },
    { label: "News", path: "/news" },
  ];

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white border-t border-white/10">
      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/80 to-black" />
        <div className="absolute -top-40 left-0 w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full" />
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gradient-to-t from-red-950/20 to-transparent" />
      </div>

      {/* ── Top gradient border ── */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-white/20 to-blue-600" />

      <div className="relative z-10">
        {/* ── Marquee strip ── */}
        <div className="border-b border-white/5 py-4 overflow-hidden bg-black/20 backdrop-blur-sm">
          <div className="flex gap-16 whitespace-nowrap animate-[marquee_25s_linear_infinite]">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="text-sm font-black uppercase tracking-[0.3em] text-white/10 flex-shrink-0"
              >
                Nepal Kabaddi League &nbsp;·&nbsp; NKL 2025 &nbsp;·&nbsp; The
                Ultimate Battle &nbsp;·&nbsp;
              </span>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 pt-16 pb-8">
          {/* ── Partners ── */}
          <div className="mb-16">
            <div className="flex items-center gap-4 justify-center mb-10">
              <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-white/20" />
              <p className="text-2xl font-black uppercase tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500">
                Official Partners
              </p>
              <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-white/20" />
            </div>

            {loading ? (
              <div className="text-center text-slate-500 text-sm">
                Loading partners...
              </div>
            ) : (
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
                {partners.map((partner) => (
                  <a
                    key={partner.id}
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-2"
                  >
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-400 transition-colors">
                      {partner.category.name}
                    </span>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/8 rounded-xl px-5 py-3 group-hover:bg-white/10 group-hover:border-white/15 transition-all">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="h-10 md:h-12 w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 pb-12 border-b border-white/10">
            {/* Brand */}
            <div className="md:col-span-5">
              <img
                src="https://nepalkabaddileague.com/nkl-logo.png"
                alt="NKL Logo"
                className="h-20 w-auto mb-6"
              />
              <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-xs">
                The premier professional Kabaddi league in Nepal, bringing
                world-class sports entertainment and fostering athletic
                excellence across the nation.
              </p>

              {/* Social icons */}
              <div className="flex gap-3">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Youtube, label: "YouTube" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center
                               hover:bg-gradient-to-br hover:from-red-600 hover:to-blue-600 hover:border-transparent
                               transition-all duration-300 group"
                  >
                    <Icon
                      size={16}
                      className="text-slate-400 group-hover:text-white transition-colors"
                    />
                  </a>
                ))}
              </div>
              {/* Get In Touch CTA */}
              <a
                href="mailto:info@nepalkabaddileague.com"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
             border border-white/15 bg-white/5 backdrop-blur-sm
             text-white text-xs font-black uppercase tracking-widest
             hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600
             hover:border-transparent transition-all duration-300"
              >
                Get In Touch
                <ArrowUpRight size={14} />
              </a>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3 md:col-start-7">
              <h4 className="font-black text-sm uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                <span className="w-3 h-3 bg-gradient-to-br from-red-600 to-blue-600 rounded-sm rotate-45 block" />
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.path}
                      className="text-slate-500 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-3 h-px bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-300 overflow-hidden" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Bottom bar ── */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <p>
                © {new Date().getFullYear()} Nepal Kabaddi League. All Rights
                Reserved.
              </p>
            </div>

            <div className="flex items-center gap-6">
              <Link to="#" className="hover:text-slate-300 transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/10">|</span>
              <Link to="#" className="hover:text-slate-300 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
