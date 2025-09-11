import { Link } from "react-router-dom";
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
            <Link
              to="/"
              className="hover:text-orange-400 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:text-orange-400 transition-colors duration-300"
            >
              About
            </Link>
            <Link
              to="/events"
              className="hover:text-orange-400 transition-colors duration-300"
            >
              Events
            </Link>
            <Link
              to="/connect"
              className="hover:text-orange-400 transition-colors duration-300"
            >
              Connect
            </Link>
            <Link
              to="/newsletters"
              className="hover:text-orange-400 transition-colors duration-300"
            >
              Bulletins
            </Link>
      
            <Link
              to="/hackathons"
              className="hover:text-orange-400 transition-colors duration-300"
            >
              Hackathons
            </Link>
            <Link
              to="/admin"
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors duration-300 flex items-center gap-2 text-sm"
            >
              <ShieldCheck size={18} />
              <span>Admin</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}