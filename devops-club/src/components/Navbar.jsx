import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';

const Navbar = () => {
  return (
    <nav className="bg-primary text-light shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
          <img src={logo} alt="DevOps Club Logo" className="h-10 w-10 object-contain" />
          <span className="text-xl font-bold tracking-wide text-accent">APSIT DevOps Space</span>
        </div>

        {/* Navigation Links */}
        <div className="space-x-6 text-sm font-medium">
          <Link to="/" className="hover:text-accent">Home</Link>
          <Link to="/about" className="hover:text-accent">About</Link>
          <Link to="/events" className="hover:text-accent">Events</Link>
          <Link to="/connect" className="hover:text-accent">Connect</Link>
          <Link to="/newsletters" className="hover:text-accent">Newsletters</Link>
          <Link to="/feedback" className="hover:text-accent">Feedback</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
