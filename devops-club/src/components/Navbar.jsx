import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { ShieldCheck, Menu, X } from 'lucide-react';
import { getEventsListing } from '../db/neonService';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Silently pre-warm events in memory & IndexedDB 600ms after app mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      getEventsListing().catch(() => {});
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Prefetch events data on hover as well for immediate responsiveness
  const handleEventsPrefetch = () => {
    getEventsListing().catch(() => {});
  };

  const navLinks = [
    { to: "/", text: "Home" },
    { to: "/about", text: "About" },
    { to: "/events", text: "Events", onMouseEnter: handleEventsPrefetch },
    { to: "/connect", text: "Connect" },
    { to: "/newsletters", text: "Bulletins" },
    { to: "/hackathons", text: "Hackathons" },
  ];

  return (
    <div className="w-full shadow-md sticky top-0 z-50">
      <div className="bg-[#2c3e50] text-white text-sm font-medium overflow-hidden relative h-10">
        <div className="absolute whitespace-nowrap animate-marquee flex gap-16 items-center h-full">
          <span>
            DevOps: Where innovation meets automation, and collaboration fuels
            transformation. Join the DevOps Club—code, deploy, and succeed
            together!
          </span>
          <span>
            DevOps: Where innovation meets automation, and collaboration fuels
            transformation. Join the DevOps Club—code, deploy, and succeed
            together!
          </span>
        </div>
      </div>

      <div className="bg-white flex items-center justify-between px-4 sm:px-7 py-1 relative">
        <div className="flex items-center gap-4">
          <img src={logo} alt="DevOps Club Logo" className="h-16 sm:h-20 w-auto" />
          <h1 className="text-xl sm:text-3xl font-semibold text-primary">
            APSIT DevOps Club
          </h1>
        </div>

        {/* --- Desktop Navigation --- */}
        {/* 4. Yeh navigation bade screens (md se upar) par hi dikhega */}
        <nav className="hidden md:flex items-center gap-6 font-semibold text-primary">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onMouseEnter={link.onMouseEnter}
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "hover:text-orange-400"
                }`
              }
            >
              {link.text}
            </NavLink>
          ))}
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 text-sm ${
                isActive
                  ? "bg-orange-700 ring-2 ring-orange-400"
                  : "bg-orange-600 hover:bg-orange-700"
              }`
            }
          >
            <ShieldCheck size={18} />
            <span>Admin</span>
          </NavLink>
        </nav>

        {/* --- Mobile Menu Button --- */}
        {/* 5. Yeh button sirf chhote screens par dikhega */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        
        {/* --- Mobile Menu Dropdown --- */}
        {/* 6. Jab 'isMenuOpen' true hoga, tab yeh menu dikhega */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden">
            <nav className="flex flex-col p-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `py-3 px-4 rounded-lg text-lg transition-colors duration-200 ${
                      isActive
                        ? "bg-orange-100 text-orange-600 font-bold"
                        : "hover:bg-slate-100"
                    }`
                  }
                  // Link pe click karne par menu close ho jayega
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </NavLink>
              ))}
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `mt-4 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-base ${
                    isActive
                      ? "bg-orange-700 ring-2 ring-orange-400"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                <ShieldCheck size={18} />
                <span>Admin</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}