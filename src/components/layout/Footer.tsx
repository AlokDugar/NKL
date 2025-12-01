import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { PARTNERS } from "../../data/mockData";

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Partners Section */}
        <div className="mb-16">
          <h3 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-bold uppercase tracking-widest mb-8 text-sm">
            Official Partners
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 transition-all duration-500">
            {PARTNERS.map((partner) => (
              <div
                key={partner.name}
                className="flex flex-col items-center gap-2"
              >
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  {partner.role}
                </span>
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-12 md:h-16 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <img
              src="https://nepalkabaddileague.com/nkl-logo.png"
              alt="NKL Logo"
              className="h-20 w-auto mb-6"
            />
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The premier professional Kabaddi league in Nepal, bringing
              world-class sports entertainment and fostering athletic excellence
              across the nation.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 transition-all text-white group"
              >
                <Facebook
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 transition-all text-white group"
              >
                <Instagram
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 transition-all text-white group"
              >
                <Twitter
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-gradient-to-r hover:from-red-600 hover:to-blue-600 transition-all text-white group"
              >
                <Youtube
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg uppercase mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Teams",
                "Matches",
                "Standings",
                "Stats",
                "News",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-500 hover:to-blue-500 transition-all text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Fan Zone */}
          <div>
            <h4 className="font-bold text-lg uppercase mb-6 text-white">
              Fan Zone
            </h4>
            <ul className="space-y-3">
              {[
                "Video Hub",
                "Photo Gallery",
                "Fan Choice",
                "Ticket Booking",
                "Merchandise",
                "Fantasy League",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-red-500 hover:to-blue-500 transition-all text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg uppercase mb-6 text-white">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-400 text-sm group">
                <MapPin
                  size={18}
                  className="text-red-500 shrink-0 mt-0.5 group-hover:text-blue-500 transition-colors"
                />
                <span>
                  Kathmandu, Nepal
                  <br />
                  Corporate Office
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <Phone
                  size={18}
                  className="text-red-500 shrink-0 group-hover:text-blue-500 transition-colors"
                />
                <span>+977 1234567890</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm group">
                <Mail
                  size={18}
                  className="text-red-500 shrink-0 group-hover:text-blue-500 transition-colors"
                />
                <span>info@nepalkabaddileague.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 text-xs text-gray-500 border-t border-white/5">
          <p>© 2025 Nepal Kabaddi League. All Rights Reserved.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
