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
import redhatamb6 from '../assets/redhatamb6.jpg';
import redhatamb7 from '../assets/redhatamb7.jpg';
import redhatamb8 from '../assets/redhatamb8.jpg';
import { FaCertificate, FaUserGraduate, FaTrophy, FaAward, FaUsers } from "react-icons/fa";

// Swiper ke components aur styles import karein
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// --- Background Component (No Changes) ---
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
    const pageWrapperRef = useRef(null);
    
    // --- UNIFIED DATA FOR ALL SUCCESS STORY CARDS ---
    const successStories = [
        {
            type: 'image',
            icon: <FaUserGraduate />,
            title: "RHA Challenge India Winner",
            name: "Shreyash Prashant Narvekar",
            description: "We are thrilled to announce that Shreyash Prashant Narvekar, a TE IT student, has secured the 2nd rank across all Red Hat Academy students in Maharashtra. His remarkable performance among 69 RHA colleges at the Red Hat Academy India Challenge 2024 also earned A.P. Shah Institute of Technology a prestigious Silver Medal.",
            content: shreyashCertificate,
            alt: "Shreyash Narvekar's Achievement Certificate",
            fit: 'contain'
        },
        {
            type: 'slider',
            icon: <FaUsers />,
            title: "Handover Highlights",
            name: "Ambassador Ceremony",
            // --- DESCRIPTION UPDATED HERE ---
            description: "In a proud moment for APSIT, Shreyash Narvekar was appointed as the new Red Hat Academy Student Ambassador. The official handover ceremony was graced by the Principal, Vice Principal, and department heads, marking a significant step for our open-source initiatives.",
            content: [redhatamb1, redhatamb2, redhatamb3, redhatamb4, redhatamb5],
            alt: "Ceremony Image",
            fit: 'contain'
        },
        {
            type: 'slider',
            icon: <FaTrophy />,
            title: "RHLC Mastery Series Winner",
            name: "Prof. Vishal Badgujar",
            description: "Prof. Vishal Badgujar was honored as a winner in the Red Hat Learning Community (RHLC) Mastery Series contest. This prestigious recognition celebrates his significant contributions and active engagement within the open-source community.",
            content: [redhatamb6, redhatamb7],
            alt: "Red Hat Learning Community Mastery Series Achievement",
            fit: 'contain'
        },
        {
            type: 'image',
            icon: <FaAward />,
            title: "Recognized Program Educator 2025",
            name: "Prof. Vishal Badgujar",
            description: "In recognition of his unwavering commitment to professional excellence, Prof. Vishal Badgujar earned the '2025 Red Hat Academy - Program Educator' distinction. This honor acknowledges his dedication to fostering an enriching open-source environment.",
            content: redhatamb8,
            alt: "2025 Red Hat Academy Program Educator Badge",
            fit: 'contain'
        }
    ];

    return (
        <div ref={pageWrapperRef} className="relative min-h-screen overflow-hidden">
            <div className="absolute inset-0 z-0">
                <NetworkBackground containerRef={pageWrapperRef} />
            </div>

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

                {/* --- Red Hat Certified Instructors Section (No Changes) --- */}
                <div className="mt-20">
                    <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
                        Red Hat Certified Instructors
                    </h2>
                    <div className="w-24 h-1.5 bg-red-600 mx-auto mb-12"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                        {educators.map((educator, index) => (
                            <div key={index} className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-red-500/30 border-t-4 border-red-600">
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-white mb-3">{educator.name}</h3>
                                    <p className="text-1xl text-slate-300 leading-relaxed text-justify">{educator.description}</p>
                                </div>
                                <div className="px-6 pb-6">
                                    <div className="flex items-center gap-2 text-white font-semibold mb-3">
                                        <FaCertificate className="text-yellow-400" />
                                        <span>Red Hat Certification</span>
                                    </div>
                                    <img src={educator.certificate} alt={`${educator.name}'s Certificate`} className="w-full h-auto rounded-lg border-2 border-slate-600"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- Success Stories Section --- */}
                <div className="mt-20">
                    <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">
                        Success Stories
                    </h2>
                    <div className="w-24 h-1.5 bg-red-600 mx-auto mb-12"></div>
                    
                    {/* --- UNIFIED CARD GRID --- */}
                    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                        {successStories.map((story, index) => (
                            <div key={index} className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-red-500/30 border-t-4 border-red-600 flex flex-col">
                                <div className="p-6 flex-grow">
                                    <div className="flex items-center gap-3 text-red-400 font-semibold mb-3">
                                        {story.icon}
                                        <span>{story.title}</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {story.name}
                                    </h3>
                                    <p className="text-sm text-slate-300 leading-relaxed text-justify">
                                        {story.description}
                                    </p>
                                </div>
                                
                                <div className="px-4 pb-4 mt-auto h-[300px]">
                                    {story.type === 'slider' ? (
                                        <Swiper
                                            modules={[Navigation, Pagination, Autoplay]}
                                            loop={true}
                                            autoplay={{ delay: 3500, disableOnInteraction: false }}
                                            pagination={{ clickable: true }}
                                            navigation={true}
                                            className="mySwiper w-full h-full"
                                        >
                                            {story.content.map((image, i) => (
                                                <SwiperSlide key={i}>
                                                    <img src={image} alt={`${story.alt} ${i + 1}`} className={`rounded-xl w-full h-full p-2 object-${story.fit}`} />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    ) : (
                                        <img src={story.content} alt={story.alt} className={`w-full h-full rounded-lg p-2 object-${story.fit}`} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Redhat;