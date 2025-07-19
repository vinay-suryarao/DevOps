import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Events from '../pages/Events';
import Connect from '../pages/Connect';
import Newsletters from '../pages/Newsletters';
import Feedback from '../pages/Feedback';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/events" element={<Events />} />
    <Route path="/connect" element={<Connect />} />
    <Route path="/newsletters" element={<Newsletters />} />
    <Route path="/feedback" element={<Feedback />} />
  </Routes>
);

export default AppRoutes;
