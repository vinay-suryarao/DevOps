import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom"; // Use Link instead of <a>
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";

export default function Navbar() {
  return (
    <div className="w-full shadow-md">
      {/* Sliding Top Bar */}
      <div className="bg-[#2c3e50] text-white text-sm font-medium overflow-hidden relative h-10">
        <div className="absolute whitespace-nowrap animate-marquee flex gap-16 items-center h-full">
          <span>
            DevOps: Where innovation meets automation, and collaboration fuels transformation. Join the DevOps Club—code, deploy, and succeed together!
          </span>
          <span>
            DevOps: Where innovation meets automation, and collaboration fuels transformation. Join the DevOps Club—code, deploy, and succeed together!
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-white flex items-center justify-between px-6 py-4">
        {/* Left: Logos and Title */}
        <div className="flex i  tems-center gap-4">
          <img src={logo1} alt="DevOps Club Logo" className="h-10 w-auto" />
          <div className="h-10 w-px bg-gray-300 mx-4" />
          <img src={logo2} alt="Secondary Logo" className="h-10 w-auto" />
          <h1 className="text-2xl font-semibold text-primary">APSIT DevOps Space</h1>
          
        </div>

        {/* Right: Nav Links & Icons */}
        <div className="flex items-center gap-8">
          <nav className="flex gap-6 font-medium text-primary">
            <Link to="/" className="hover:text-orange-400 transition-colors duration-300">Home</Link>
            <Link to="/about" className="hover:text-orange-400 transition-colors duration-300">About</Link>
            <Link to="/events" className="hover:text-orange-400 transition-colors duration-300">Events</Link>
            <Link to="/connect" className="hover:text-orange-400 transition-colors duration-300">Connect</Link>
            <Link to="/newsletters" className="hover:text-orange-400 transition-colors duration-300">Newsletters</Link>
            <Link to="/feedback" className="hover:text-orange-400 transition-colors duration-300">Feedback</Link>
          </nav>
          <div className="flex items-center gap-4 text-2xl text-primary">
            <a href="https://github.com/your-github-link" target="_blank" rel="noopener noreferrer">
              <FaGithub />
            </a>
            <a href="https://linkedin.com/in/your-linkedin-link" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
