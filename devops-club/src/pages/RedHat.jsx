// src/pages/Redhat.jsx

import React, { useRef, useEffect } from "react";
// Image aur Icons ko import karein
import certificateImg from '../assets/vishalsir_redhatcertificate.jpeg';
import certificateImg1 from '../assets/sonalmam_redhatcertificate.png';
import shreyashCertificate from '../assets/shreyash_redhatcertificate.jpeg';
import redhatamb1 from '../assets/redhatamb1.jpeg';
import redhatamb2 from '../assets/redhatamb2.jpeg';
import redhatamb3 from '../assets/redhatamb3.jpeg';
import redhatamb4 from '../assets/redhatamb4.jpeg';
import redhatamb5 from '../assets/redhatamb5.jpeg';
import { FaCertificate, FaUserGraduate } from "react-icons/fa";

// Swiper ke components aur styles import karein
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// --- Background Component (Copied from your first file) ---
const NetworkBackground = ({ containerRef }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !containerRef.current) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particlesArray;

        const setCanvasDimensions = () => {
            if (!containerRef.current) return;
            const dpr = window.devicePixelRatio || 1;
            const containerHeight = containerRef.current.scrollHeight;
            
            canvas.style.width = '100%';
            canvas.style.height = `${containerHeight}px`;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = containerHeight * dpr;
            ctx.scale(dpr, dpr);
        };
        
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; this.y = y; this.directionX = directionX;
                this.directionY = directionY; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                const scaledWidth = canvas.offsetWidth;
                const scaledHeight = canvas.offsetHeight / (window.devicePixelRatio || 1);
                if (this.x > scaledWidth + 100 || this.x < -100) this.directionX = -this.directionX;
                if (this.y > scaledHeight + 100 || this.y < -100) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.width * canvas.height) / (20000 * (window.devicePixelRatio || 1)**2);
            const colors = ['#f97316', '#3b82f6'];
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2.5) + 1.5; 
                let x = (Math.random() * (canvas.offsetWidth + 200)) - 100;
                let y = (Math.random() * (canvas.offsetHeight / (window.devicePixelRatio || 1) + 200)) - 100;
                let directionX = (Math.random() * .3) - .15;
                let directionY = (Math.random() * .3) - .15;
                let color = colors[Math.floor(Math.random() * colors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let opacityValue = 1;
            const scaledWidth = canvas.offsetWidth;
            const scaledHeight = canvas.offsetHeight / (window.devicePixelRatio || 1);
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (distance < (scaledWidth / 9) * (scaledHeight / 9)) {
                        opacityValue = 1 - (distance / 22000);
                        ctx.strokeStyle = `rgba(42, 63, 84, ${opacityValue})`; 
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate(timestamp) {
            if(!ctx || !particlesArray) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
            
            const driftX = Math.sin(timestamp / 8000) * 50;
            const driftY = Math.cos(timestamp / 8000) * 30;
            
            ctx.save();
            ctx.translate(driftX, driftY);
            particlesArray.forEach(p => p.update());
            connect();
            ctx.restore();
            
            animationFrameId = window.requestAnimationFrame(animate);
        }
        
        setCanvasDimensions();
        init();
        animate(0);
        
        const handleResize = () => { 
            window.cancelAnimationFrame(animationFrameId);
            setCanvasDimensions(); 
            init();
            animate(0);
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
          resizeObserver.observe(containerRef.current);
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        };
      }, [containerRef]);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-slate-100" style={{ display: 'block' }} />;
};


// Educators ka data
const educators = [
  {
    name: "Prof. Vishal Badgujar",
    description: "Certified as a RED HAT CERTIFIED SYSTEM ADMINISTRATOR (RHCSA) for Red Hat Enterprise Linux 8. Prof. Badgujar brings expertise in system administration, command-line proficiency, and core system services.",
    certificate: certificateImg
  },
  {
    name: "Prof. Sonal Jain",
    description: "Certified as a RED HAT CERTIFIED SYSTEM ADMINISTRATOR (RHCSA) for Red Hat Enterprise Linux 8. Prof. Jain excels in managing and troubleshooting Linux systems, ensuring robust and efficient operations.",
    certificate: certificateImg1
  }
];

const Redhat = () => {
    const pageWrapperRef = useRef(null); // Ref for the main container
    const ambassadorImages = [redhatamb1, redhatamb2, redhatamb3, redhatamb4, redhatamb5];

    return (
        <div ref={pageWrapperRef} className="relative min-h-screen overflow-hidden">
            {/* --- Animated Background --- */}
            <div className="absolute inset-0 z-0">
                <NetworkBackground containerRef={pageWrapperRef} />
            </div>

            {/* --- Original Page Content (with relative z-10) --- */}
            <div className="relative z-10 container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-sm">
                        <span className="bg-gradient-to-r from-red-400 to-slate-600 bg-clip-text text-transparent">
                            APSIT Red Hat Academy
                        </span>
                    </h1>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                        Explore how our partnership with Red Hat provides students with cutting-edge skills in open-source technologies, straight from the industry leader.
                    </p>
                </div>

                {/* --- Red Hat Certified Instructors Section --- */}
                <div className="mt-20">
                    <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
                        Red Hat Certified Instructors
                    </h2>
                    <div className="w-24 h-1.5 bg-red-600 mx-auto mb-12"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {educators.map((educator, index) => (
                            <div
                                key={index}
                                className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-red-500/30 border-t-4 border-red-600"
                            >
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-3">{educator.name}</h3>
                                    <p className="text-sm text-slate-300 leading-relaxed">{educator.description}</p>
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="flex items-center gap-2 text-white font-semibold mb-3">
                                        <FaCertificate className="text-yellow-400" />
                                        <span>Red Hat Certification</span>
                                    </div>
                                    <img
                                        src={educator.certificate}
                                        alt={`${educator.name}'s Certificate`}
                                        className="w-full h-auto rounded-lg border-2 border-slate-600"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Red Hat Student Ambassador Section (Re-designed) --- */}
                <div className="mt-20">
                    <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
                        Red Hat Student Ambassador
                    </h2>
                    <div className="w-24 h-1.5 bg-red-600 mx-auto mb-12"></div>
                    
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        
                        <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-red-500/30 border-t-4 border-red-600">
                            <div className="p-6">
                                <div className="flex items-center gap-2 text-red-400 font-semibold mb-3">
                                    <FaUserGraduate />
                                    <span>Ambassador</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Shreyash Prashant Narvekar
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed text-justify">
                                        In a proud moment for APSIT, we introduce Shreyash Narvekar, Student Ambassador for Red Hat Academy. Shreyash has already demonstrated exceptional skill by securing the 2nd position in the Redhat India Final Challenge Contest. Taking the baton from his predecessor, he will now lead the Red Hat initiatives, guiding fellow students and fostering a vibrant open-source community on campus.
                                </p>
                            </div>
                            <div className="px-4 pb-4">
                                <img
                                    src={shreyashCertificate}
                                    alt="Shreyash Narvekar's Achievement Certificate"
                                    className="w-full max-h-[240px] object-contain rounded-lg"
                                />
                            </div>
                        </div>

                        {/* Right Column: Image Slider */}
                        <div>
                            <h3 className="text-3xl font-bold mb-6 text-center lg:text-left">
                                <span className="bg-gradient-to-r from-red-500 to-slate-600 bg-clip-text text-transparent">
                                    Handover Highlights
                                </span>
                            </h3>
                            <div className="max-w-lg mx-auto lg:mx-0">
                              <Swiper
                                modules={[Navigation, Pagination, Autoplay]}
                                spaceBetween={20}
                                slidesPerView={1}
                                loop={true}
                                autoplay={{ delay: 3000, disableOnInteraction: false }}
                                pagination={{ clickable: true }}
                                navigation={true}
                                className="mySwiper"
                              >
                                {ambassadorImages.map((image, index) => (
                                  <SwiperSlide key={index}>
                                    <img
                                      src={image}
                                      alt={`Ceremony Image ${index + 1}`}
                                      className="rounded-xl object-cover w-full h-[400px]"
                                    />
                                  </SwiperSlide>
                                ))}
                              </Swiper>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Redhat;