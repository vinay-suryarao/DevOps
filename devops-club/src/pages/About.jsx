import React, { useState, useRef, useEffect } from 'react';
import { Binoculars, Rocket, ChevronLeft, ChevronRight, HeartHandshake } from 'lucide-react';
import PresidentShreyash from '../assets/president_shreyash.png';
import TechnicalVinay from '../assets/Technical_Vinay.png';
import DesignAkshata from '../assets/Design_Akshata.png';
import DesignIshita from '../assets/Design_Ishita.png';
import LiteratureAnubhav from '../assets/Literature_Anubhav.png';
import LiteratureVarunkumar from '../assets/Literature_Varunkumar.png';
import PublicityHarsh from '../assets/Publicity_Harsh.png';
import PublicityNupur from '../assets/Publicity_Nupur.png';
import PhotographyShivam from '../assets/Photography_Shivam.png';
import PhotographyRumiza from '../assets/Photography_Rumiza.png';
import CinematographyShubham from '../assets/Cinematography_Shubham.png';
import CinematographySonali from '../assets/Cinematography_Sonali.png';
import TanviPawar from '../assets/Tanvi_Pawar.png';
import AnubhavSingh from '../assets/Anubhav_Singh.png';
import OmkarChadgaonkar from '../assets/Omkar_Chadgaonkar.png';
import AnjaliSingh from '../assets/Anjali_Singh.png';
import RutujaMore from '../assets/Rutuja_More.png';
import PrabhatMahadik from '../assets/Prabhat_Mahadik.png';
import BhaveshMarathe from '../assets/Bhavesh_Marathe.png';
import SanketKurle from '../assets/Sanket_Kurle.png';
import RutujaManore from '../assets/Rutuja_Manore.png';
import PrasadKotian from '../assets/Prasad_Kotian.png';
import PranavJadhav from '../assets/Pranav_Jadhav.png';
import KinjalParadkar from '../assets/Kinjal_Paradkar.png';
import AnanyaMishra from '../assets/Ananya_Mishra.png';
import AryanPardeshi from '../assets/Aryan_Pardeshi.png';
import RajMehta from '../assets/Raj_Mehta.png';
import Technicalcohead_Ismaeel from '../assets/Technicalcohead_Ismaeel.png';
import Technicalcohead_Chitresh from '../assets/Technicalcohead_Chitresh.png';
import Designcohead_Madhura from '../assets/Designcohead_Madhura.png';
import Designcohead_Siddharth from '../assets/Designcohead_Siddharth.png';
import Literaturecohead_Kanksha from '../assets/Literaturecohead_Kanksha.png'; 
import Literaturecohead_Raj from '../assets/Literaturecohead_Raj.png';
import Cinematographycohead_Aarya from '../assets/Cinematographycohead_Aarya.png';
import Cinematographycohead_Parth from '../assets/Cinematographycohead_Parth.png'; 
import Publicitycohead_Tanushree from '../assets/Publicitycohead_Tanushree.png';
import Publicitycohead_Shivansh from '../assets/Publicitycohead_Shivansh.png';


// Defines custom CSS animations used throughout the component.
const CustomStyles = () => (
  <style>{`
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-100%); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
    .animate-marquee { animation: marquee 40s linear infinite; }
    .hover\\:pause-animation:hover { animation-play-state: paused; }
    .preserve-3d { transform-style: preserve-3d; }
  `}</style>
);

// Renders the animated, drifting particle network in the background.
const NetworkBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particlesArray;

        const setCanvasDimensions = () => {
            const dpr = window.devicePixelRatio || 1;
            const bodyHeight = document.body.scrollHeight;
            canvas.style.width = '100%';
            canvas.style.height = `${bodyHeight}px`;
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = bodyHeight * dpr;
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
        resizeObserver.observe(document.body);
        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-slate-100" style={{ display: 'block' }} />;
};


// A reusable card for displaying information like Vision, Mission, and Values.
const InfoCard = ({ icon, title, description, animationDelay }) => (
    <div 
        className="bg-[#2a3f54] backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-xl p-8 flex flex-col items-center text-center transition-transform duration-300 hover:shadow-orange-400/20 animate-fade-in-up  hover:-translate-y-4"
        style={{ animationDelay }}
    >
        <div className="text-orange-400 mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-white tracking-[0.2em] uppercase mb-4">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
);

// ## MODIFIED COMPONENT: Shows a slider of DevOps tools with descriptions and new layout ##
const ToolsSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    const devopsTools = [
        { name: 'Linux', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', description: 'The open-source kernel powering most cloud servers and infrastructures.' },
        { name: 'Git', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg', description: 'A distributed version control system for tracking changes in source code.' },
        { name: 'GitHub', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', description: 'A platform for hosting and collaborating on Git repositories.' },
        { name: 'Docker', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', description: 'A platform to develop, ship, and run applications in lightweight containers.' },
        { name: 'Jenkins', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', description: 'An open-source automation server for building, testing, and deploying code (CI/CD).' },
        { name: 'Kubernetes', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', description: 'An open-source container orchestration platform for automating application deployment.' },
        { name: 'Ansible', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg', description: 'An agentless automation tool for configuration management and application deployment.' },
        { name: 'Terraform', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg', description: 'An infrastructure as code (IaC) tool to build and manage cloud resources safely.' },
        { name: 'Azure', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg', description: 'Microsoft\'s cloud computing platform offering a wide range of services.' },
        { name: 'Prometheus', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg', description: 'An open-source monitoring and alerting toolkit for modern systems.' },
        { name: 'Grafana', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg', description: 'An open-source platform for data visualization, monitoring, and analysis.' },
    ];

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () => 
                setCurrentIndex((prevIndex) => 
                    prevIndex === devopsTools.length - 1 ? 0 : prevIndex + 1
                ),
            7000 // Slower speed: 7 seconds
        );

        return () => {
            resetTimeout();
        };
    }, [currentIndex, devopsTools.length]);

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? devopsTools.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === devopsTools.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="w-full mx-auto relative group">
            <div className="overflow-hidden relative h-64 rounded-2xl shadow-2xl bg-[#2a3f54]/80 backdrop-blur-lg border border-white/20">
                <div 
                    className="flex transition-transform ease-in-out duration-300 h-full"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {devopsTools.map((tool, index) => (
                        <div key={index} className="w-full flex-shrink-0 p-8 flex flex-col md:flex-row items-center justify-center gap-8 h-full">
                            {/* Left Column: Logo and Name */}
                            <div className="flex-shrink-0 flex flex-col items-center w-32">
                                <img 
                                    src={tool.logoUrl} 
                                    alt={`${tool.name} logo`} 
                                    className="h-20 w-auto object-contain" 
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/e2e8f0/64748b?text=LOGO'; }}
                                />
                                <h4 className="font-semibold text-lg text-white mt-3 text-center">{tool.name}</h4>
                            </div>
                            {/* Right Column: Description */}
                            <div className="text-center md:text-left md:border-l border-gray-500 md:pl-8">
                                <p className="text-gray-300 max-w-sm">{tool.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <button onClick={prevSlide} className="absolute top-1/2 -translate-y-1/2 left-4 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 shadow-md transition group-hover:opacity-100 opacity-0">
                <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            
            <button onClick={nextSlide} className="absolute top-1/2 -translate-y-1/2 right-4 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-2 shadow-md transition group-hover:opacity-100 opacity-0">
                <ChevronRight className="h-6 w-6 text-white" />
            </button>
        </div>
    );
};


// A card for displaying team member information.
const TeamCard = ({ name, designation, photoUrl, animationDelay }) => (
    <div 
        className="flex-shrink-0 w-full bg-[#2a3f54]/40 backdrop-blur-md border border-blue-400/50 rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-xl hover:shadow-orange-400/30 animate-fade-in-up"
        style={{ animationDelay }}
    >
        <img 
            src={photoUrl} 
            alt={name} 
            className="w-24 h-24 mx-auto object-cover border-4 border-orange-400 rounded-full"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/e2e8f0/64748b?text=Photo'; }}
        />
        <h4 className="font-bold text-lg mt-4 text-slate-800">{name}</h4>
        <p className="text-sm text-[#2a3f54] font-medium mt-1 whitespace-pre-line">{designation}</p>
    </div>
);


// A card for displaying intern information, used in the marquee.
const InternCard = ({ name, photoUrl }) => (
    <div className="h-full flex-shrink-0 w-full bg-white rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-orange-400/20 flex flex-col">
        <div className="flex-grow">
            <img 
                src={photoUrl} 
                alt={name} 
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-orange-400"
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/96x96/e2e8f0/64748b?text=Photo'; }}
            />
            <h4 className="font-bold text-lg mt-4 text-slate-800">{name}</h4>
        </div>
        <div className="mt-auto border-t border-slate-400 pt-3 w-full">
            <p className="text-center text-sm font-semibold text-orange-400">
                RigelX Infotech Private Limited
            </p>
        </div>
    </div>
);

// An infinitely scrolling marquee of intern cards.
const InternsMarquee = () => {
    const studentData = [
        { name: 'Tanvi Pawar', photoUrl: TanviPawar }, { name: 'Anubhav Singh', photoUrl: AnubhavSingh },
        { name: 'Omkar Chadgaonkar', photoUrl: OmkarChadgaonkar }, { name: 'Anjali Singh', photoUrl: AnjaliSingh },
        { name: 'Rutuja More', photoUrl: RutujaMore }, { name: 'Prabhat Mahadik', photoUrl: PrabhatMahadik },
        { name: 'Bhavesh Marathe', photoUrl: BhaveshMarathe }, { name: 'Sanket Kurle', photoUrl: SanketKurle },
        { name: 'Rutuja Manore', photoUrl: RutujaManore }, { name: 'Prasad Kotian', photoUrl: PrasadKotian },
        { name: 'Pranav Jadhav', photoUrl: PranavJadhav }, { name: 'Kinjal Paradkar', photoUrl: KinjalParadkar },
        { name: 'Ananya Mishra', photoUrl: AnanyaMishra }, { name: 'Aryan Pardeshi', photoUrl: AryanPardeshi },
        { name: 'Raj Mehta', photoUrl: RajMehta },
    ];
    const extendedStudentData = [...studentData, ...studentData];

    return (
        <div className="w-full overflow-hidden relative py-4">
            <div className="flex animate-marquee hover:pause-animation">
                {extendedStudentData.map((student, index) => (
                    <div key={index} className="flex-shrink-0 w-64 mx-4">
                        <InternCard name={student.name} photoUrl={student.photoUrl} />
                    </div>
                ))}
            </div>
        </div>
    );
}

// The main component for the "About Us" page.
const About = () => {
    const mentorsData = [
        { name: 'Shreyash Narvekar', designation: 'President\nTechnical Team', photoUrl: PresidentShreyash },
        { name: 'Akshata Khandekar', designation: 'Design Team', photoUrl: DesignAkshata},
        { name: 'Anubhav Singh', designation: 'Literature Team', photoUrl: LiteratureAnubhav },
        { name: 'Harsh Tambade', designation: 'Publicity Team', photoUrl: PublicityHarsh },
        { name: 'Shivam Sharma', designation: 'Photography Team', photoUrl: PhotographyShivam },
        { name: 'Shubham Shelake', designation: 'Cinematography Team', photoUrl: CinematographyShubham },
    ];
    const headsData = [
        { name: 'Vinay Suryarao', designation: 'Technical Team', photoUrl: TechnicalVinay},
        { name: 'Ishita Singh', designation: 'Design Team', photoUrl: DesignIshita},
        { name: 'Varunkumar Lysetti', designation: 'Literature Team', photoUrl: LiteratureVarunkumar },
        { name: 'Nupur Sugadare', designation: 'Publicity Team', photoUrl: PublicityNupur },
        { name: 'Sayyeda Rumiza', designation: 'Photography Team', photoUrl: PhotographyRumiza },
        { name: 'Saloni Shirasat', designation: 'Cinematography Team', photoUrl: CinematographySonali },
    ];
    const coHeadsData = [
        { name: 'Ismaeel Shaikh', designation: 'Technical Co-Head', photoUrl: Technicalcohead_Ismaeel },
        { name: 'Siddharth Kumar', designation: 'Design Co-Head', photoUrl: Designcohead_Siddharth },
        { name: 'Raj Puranik', designation: 'Literature Co-Head', photoUrl: Literaturecohead_Raj },
        { name: 'Aarya Nichal', designation: 'Cinematography Co-Head', photoUrl: Cinematographycohead_Aarya },
        { name: 'Tanushree Gabhane', designation: 'Publicity Co-Head', photoUrl: Publicitycohead_Tanushree },
        { name: 'Chitresh Poojary', designation: 'Technical Co-Head', photoUrl: Technicalcohead_Chitresh },
        { name: 'Madhura Zambare', designation: 'Design Co-Head', photoUrl: Designcohead_Madhura },
        { name: 'Kanksha Vanjare', designation: 'Literature Co-Head', photoUrl: Literaturecohead_Kanksha },
        { name: 'Parth Joshi', designation: 'Cinematography Co-Head', photoUrl: Cinematographycohead_Parth },
        { name: 'Shivansh Shukla', designation: 'Publicity Co-Head', photoUrl: Publicitycohead_Shivansh },
    ];

 return (
    <>
      <CustomStyles />
      <section className="relative min-h-screen flex flex-col pt-24 pb-24 overflow-hidden bg-slate-100 space-y-24">
        
        <div className="absolute inset-0 z-0"><NetworkBackground /></div>

        <div className="relative z-10 container mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-12 animate-fade-in-up">Our Guiding Principles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                <InfoCard icon={<Binoculars size={64} strokeWidth={1.5} />} title="Vision" description="Achieve a world where executives embrace business relationship management as an essential business capability." animationDelay="0.2s" />
                <InfoCard icon={<Rocket size={64} strokeWidth={1.5} />} title="Mission" description="Provide thought leadership for executives through real-world experience in ourselves achieving excellence through BRM." animationDelay="0.4s" />
                <InfoCard icon={<HeartHandshake size={64} strokeWidth={1.5} />} title="Values" description="Foster collaboration, innovation, and integrity to drive meaningful and lasting business relationships." animationDelay="0.6s" />
            </div>
        </div>
        
        <div className="relative z-10 bg-slate-100/80 backdrop-blur-sm py-16">
            <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
                <h2 className="text-4xl md:text-5xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-4 animate-fade-in-up" style={{animationDelay: '0.8s'}}>Our Team</h2>
                <h3 className="text-2xl font-bold text-orange-500 mb-4 animate-fade-in-up" style={{animationDelay: '0.9s'}}>Student Mentors</h3>
                <p className="max-w-2xl mx-auto text-slate-600 mb-12 animate-fade-in-up" style={{animationDelay: '1s'}}>The pillars of our leadership, the Student Mentors provide strategic direction and guide the club's overall vision and activities.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto mb-16">
                    {mentorsData.map((member, index) => (<TeamCard key={index} name={member.name} designation={member.designation} photoUrl={member.photoUrl} animationDelay={`${1.1 + index * 0.1}s`} />))}
                </div>
                <h3 className="text-2xl font-bold text-orange-500 mb-4 animate-fade-in-up" style={{animationDelay: '1.5s'}}>Heads</h3>
                <p className="max-w-2xl mx-auto text-slate-600 mb-12 animate-fade-in-up" style={{animationDelay: '1.6s'}}>Our Department Heads are the experts at the helm, managing their teams and ensuring the successful execution of all club initiatives within their domain.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 max-w-7xl mx-auto mb-16">
                    {headsData.map((member, index) => (<TeamCard key={index} name={member.name} designation={member.designation} photoUrl={member.photoUrl} animationDelay={`${1.7 + index * 0.1}s`} />))}
                </div>
                <h3 className="text-2xl font-bold text-orange-500 mb-4 animate-fade-in-up" style={{animationDelay: '2.2s'}}>Co-heads</h3>
                <p className="max-w-2xl mx-auto text-slate-600 mb-12 animate-fade-in-up" style={{animationDelay: '2.3s'}}>The dynamic force supporting our leaders, the Co-heads are instrumental in day-to-day management, fostering teamwork, and driving departmental projects forward.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
                    {coHeadsData.map((member, index) => (<TeamCard key={index} name={member.name} designation={member.designation} photoUrl={member.photoUrl} animationDelay={`${2.4 + index * 0.1}s`} />))}
                </div>
            </div>
        </div>

        <div className="relative z-10 w-full text-center px-4 sm:px-6 lg:px-8">
             <h2 className="text-4xl md:text-5xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-4 animate-fade-in-up" style={{animationDelay: '3.3s'}}>Our Club Expertise</h2>
            <p className="max-w-3xl mx-auto text-slate-600 mb-8 animate-fade-in-up" style={{animationDelay: '3.4s'}}>We focus on hands-on learning with the industry's most essential DevOps tools, preparing our members for real-world challenges.</p>
            <div className="relative"><ToolsSlider /></div>
        </div>

        <div className="relative z-10 w-full text-center bg-slate-100/80 backdrop-blur-sm py-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-8 animate-fade-in-up" style={{animationDelay: '3.5s'}}>Meet Our Interns</h2>
            <InternsMarquee />
        </div>
      </section>
    </>
  );
};

export default About;