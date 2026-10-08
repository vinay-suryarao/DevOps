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
      <div className="flex flex-col min-h-screen bg-white text-black w-full">
        {showIntro ? (
          <Intro onComplete={handleIntroComplete} />
        ) : (
          <>
            <Navbar /> 
            <main className="flex-1 w-full">
              <AppRoutes /> 
            </main>
            <Footer />
          </>
        )}
      </div>
    );
  }

  export default App;