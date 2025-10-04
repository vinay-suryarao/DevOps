  import { Route, Routes } from "react-router-dom";
  import ScrollToTop from "../components/ScrollToTop";

  import Home from "../pages/Home";
  import About from "../pages/About";
  import Events from "../pages/Events";
  import Connect from "../pages/Connect";
  import Newsletters from "../pages/Newsletters";
  import Credits from "../pages/Credits";
  import Hackathons from "../pages/Hackathons";
  import Admin from "../pages/Admin";
  import Redhat from "../pages/RedHat"; // <<< STEP 2: Naye Redhat page ko import karein

  export default function AppRoutes() {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/newsletters" element={<Newsletters />} />
          <Route path="/credits" element={<Credits />} />
          <Route path="/hackathons" element={<Hackathons />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/redhat" element={<Redhat />} />
        </Routes>
      </>
    );
  }