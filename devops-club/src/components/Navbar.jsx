// 1. 'Link' ko 'NavLink' se replace kiya gaya hai
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
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

      <div className="bg-white flex items-center justify-between px-7 py-1">
        <div className="flex items-center gap-4">
          <img src={logo} alt="DevOps Club Logo" className="h-20 w-auto" />
          <h1 className="text-3xl font-semibold text-primary">
            APSIT DevOps Club
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-6 font-semibold text-primary">
            
            {/* 2. Har NavLink mein className ko function banaya gaya hai */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "hover:text-orange-400"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "hover:text-orange-400"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "hover:text-orange-400"
                }`
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/connect"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "hover:text-orange-400"
                }`
              }
            >
              Connect
            </NavLink>
            <NavLink
              to="/newsletters"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "hover:text-orange-400"
                }`
              }
            >
              Bulletins
            </NavLink>
        
            <NavLink
              to="/hackathons"
              className={({ isActive }) =>
                `transition-colors duration-300 ${
                  isActive
                    ? "text-orange-500 underline underline-offset-4"
                    : "hover:text-orange-400"
                }`
              }
            >
              Hackathons
            </NavLink>
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
        </div>
      </div>
    </div>
  );
}