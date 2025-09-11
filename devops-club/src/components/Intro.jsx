import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import logo from "../assets/logo.png";

const Intro = ({ onComplete }) => {
  const canvasRef = useRef(null);
  const logoRef = useRef(null);
  const textRef = useRef(null);
  const mainContainerRef = useRef(null);
  const topScreenRef = useRef(null);
  const bottomScreenRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particlesFinished = false;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const numParticles = 250;
    const colors = ["#2AABE1", "#FCAF17", "#F36F21", "#1A75BB", "#FFFFFF"];

    class Particle {
      constructor() {
        this.angle = Math.random() * Math.PI * 2;
        this.radius = Math.random() * (canvas.width / 2) + 50;
        this.x = canvas.width / 2 + Math.cos(this.angle) * this.radius;
        this.y = canvas.height / 2 + Math.sin(this.angle) * this.radius;
        this.size = Math.random() * 3.5 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.angle += 0.01; // Controls the spiral effect speed
        if (this.radius > 0) {
          this.radius = Math.max(0, this.radius - 3); // Controls convergence speed
        }
        this.x = canvas.width / 2 + Math.cos(this.angle) * this.radius;
        this.y = canvas.height / 2 + Math.sin(this.angle) * this.radius;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    }

    function startLogoAnimation() {
      if (particlesFinished) return;
      particlesFinished = true;
      cancelAnimationFrame(animationFrameId);

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.to(mainContainerRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              if (mainContainerRef.current) {
                mainContainerRef.current.style.display = 'none';
              }
              if (onComplete) onComplete();
            }
          });
        },
      });

      tl.to(canvasRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: "power1.in",
      })
      .fromTo(
        [logoRef.current, textRef.current],
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          stagger: 0.15,
        },
        "-=0.1"
      )
      .to({}, { duration: 1.0 }) // Pause for 1 second
      .to([topScreenRef.current, bottomScreenRef.current], {
        height: "50%",
        duration: 1.0,
        ease: "power3.inOut",
      })
      .to([logoRef.current, textRef.current], {
        opacity: 0,
        duration: 0.5,
        ease: "power1.in",
      }, "<"); // Starts at the same time as the previous animation
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let allConverged = true;
      particles.forEach(p => {
        p.update();
        p.draw();
        if (p.radius > 0) {
          allConverged = false;
        }
      });
      if (allConverged) {
        startLogoAnimation();
      } else {
        animationFrameId = requestAnimationFrame(animate);
      }
    }

    initParticles();
    animate();

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0; // Clear existing particles
      initParticles(); // Re-initialize for the new size
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <div ref={mainContainerRef} className="absolute inset-0 z-50 bg-[#0a0f1e] overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <img
          ref={logoRef}
          src={logo}
          alt="APSIT DevOps Space Logo"
          className="w-96 md:w-[28rem] opacity-0"
          style={{ filter: "drop-shadow(0 0 30px rgba(42, 171, 225, 0.8))" }}
        />
        <h1
          ref={textRef}
          className="mt-10 text-3xl md:text-4xl font-bold text-white opacity-0"
          style={{ textShadow: "0 0 15px rgba(255, 255, 255, 0.6)" }}
        >
          Welcome to APSIT DevOps Club
        </h1>
      </div>
      <div ref={topScreenRef} className="absolute top-0 left-0 w-full h-0 bg-[#0a0f1e] z-10"></div>
      <div ref={bottomScreenRef} className="absolute bottom-0 left-0 w-full h-0 bg-[#0a0f1e] z-10"></div>
    </div>
  );
};

export default Intro;