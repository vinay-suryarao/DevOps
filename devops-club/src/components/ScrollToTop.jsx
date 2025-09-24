import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  // useLocation hook se humein current page ka path milta hai
  const { pathname } = useLocation();

  // useEffect hook tab chalta hai jab भी pathname badalta hai
  useEffect(() => {
    // Yeh command window ko scroll karke top (0, 0) position par le jaata hai
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array mein pathname daalne se yeh har route change par chalega

  return null; // Yeh component screen par kuch nahi dikhata
}

export default ScrollToTop;