  import React, { useState, useCallback } from 'react';

  import Navbar from './components/Navbar';
  import Footer from './components/Footer';
  import AppRoutes from './routes/AppRoutes';
  import Intro from './components/Intro';


  function App() {
    const [showIntro, setShowIntro] = useState(true);

    const handleIntroComplete = useCallback(() => {
      setShowIntro(false);
    }, []);

    return (
      <div className="flex flex-col min-h-screen bg-white text-black">
        {showIntro ? (
          <Intro onComplete={handleIntroComplete} />
        ) : (
          <>
            <Navbar /> 
            <div className="flex-grow">
              <AppRoutes /> 
            </div>
            <Footer />
          </>
        )}
      </div>
    );
  }

  export default App;