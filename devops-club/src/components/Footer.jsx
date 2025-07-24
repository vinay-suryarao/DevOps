import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import logo1 from "../assets/logo1.png";
import logo2 from "../assets/logo2.png";

export default function Footer() {
  return (
    <footer className="bg-[#2c3e50] text-white pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo and About */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={logo1} alt="DevOps Logo" className="h-10" />
            <div className="h-10 w-px bg-gray-400" />
            <img src={logo2} alt="Secondary Logo" className="h-10" />
          </div>
          <h2 className="text-xl font-semibold">APSIT DevOps Space</h2>
          <p className="text-sm text-gray-300">
            Where innovation meets automation. Join the DevOps Club — code, deploy, and succeed together!
          </p>
          <div className="flex gap-4 text-xl text-white">
            <a href="https://github.com/your-github-link" target="_blank" rel="noopener noreferrer">
              <FaGithub className="hover:text-orange-400 transition" />
            </a>
            <a href="https://linkedin.com/in/your-linkedin-link" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="hover:text-orange-400 transition" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "About", path: "/about" },
              { name: "Events", path: "/events" },
              { name: "Connect", path: "/connect" },
              { name: "Newsletters", path: "/newsletters" },
              { name: "Feedback", path: "/feedback" }
            ].map((item, index) => (
              <li key={index}>
                <Link to={item.path} className="flex items-center hover:text-orange-400 transition">
                  <FiChevronRight className="mr-2" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <ul className="space-y-4 text-sm text-gray-300">
            <li className="flex items-start">
              <FaMapMarkerAlt className="text-orange-400 mr-3 mt-1" />
              <span>APSIT Campus, Kasarvadavali, Thane, Maharashtra</span>
            </li>
            <li className="flex items-center">
              <FaEnvelope className="text-orange-400 mr-3" />
              <a href="mailto:devops@apsit.edu.in" className="hover:text-white transition">
                devops@apsit.edu.in
              </a>
            </li>
            <li className="flex items-center">
              <FaPhoneAlt className="text-orange-400 mr-3" />
              <a href="tel:+911234567890" className="hover:text-white transition">
                +91 12345 67890
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-600 pt-6 text-sm text-center text-gray-400">
        © {new Date().getFullYear()} APSIT DevOps Club. All rights reserved.
      </div>
    </footer>
  );
}
