import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "../../data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-black/90 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-5",
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 z-[70]">
          <img
            src="https://nepalkabaddileague.com/nkl-logo.png"
            alt="NKL Logo"
            className="h-12 w-auto md:h-16"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {(NAV_LINKS as NavItem[]).map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                "font-medium uppercase tracking-wide text-sm transition-all relative group",
                isActive(link.path)
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500"
                  : "text-white/90 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-500 hover:to-blue-500",
              )}
            >
              {link.name}
              <span
                className={clsx(
                  "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-300",
                  isActive(link.path) ? "w-full" : "w-0 group-hover:w-full",
                )}
              />
            </Link>
          ))}

          <a
            href="/tickets"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-gradient-to-r from-red-600 to-blue-600
            text-white text-xs font-black uppercase tracking-widest
            shadow-lg shadow-red-900/30 hover:shadow-red-900/50
            hover:scale-[1.04] transition-all duration-300"
          >
            <span className="transition-transform duration-300 group-hover:scale-110">
              Join The Action
            </span>

            <ArrowUpRight
              size={14}
              className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-yellow-300"
            />
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white z-[80] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Overlay Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="absolute right-0 top-0 h-full w-[60%] bg-black shadow-2xl text-white flex flex-col px-6 py-16"
                onClick={(e) => e.stopPropagation()}
              >
                <nav className="flex flex-col gap-6">
                  {NAV_LINKS.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={clsx(
                          "inline-block text-xl font-semibold uppercase tracking-wide py-3 border-b w-full [-webkit-text-fill-color:transparent] text-transparent bg-clip-text bg-gradient-to-r",
                          isActive(link.path)
                            ? "from-red-500 via-blue-500 to-blue-600 border-white/40"
                            : "from-white/60 via-white/60 to-white/60 border-white/10",
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}

                  <a
                    href="/tickets"
                    className="group flex items-center gap-2 px-5 py-3 rounded-xl
                    bg-gradient-to-r from-red-600 to-blue-600
                    text-white text-sm font-black uppercase tracking-widest
                    shadow-lg shadow-red-900/30 w-fit
                    transition-all duration-300"
                  >
                    <span className="transition-transform duration-300 group-hover:scale-110">
                      Join The Action
                    </span>

                    <ArrowUpRight
                      size={14}
                      className="transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-yellow-300"
                    />
                  </a>
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;
