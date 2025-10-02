import React, { useState, useRef, useEffect } from 'react';
import { Binoculars, Rocket, HeartHandshake } from 'lucide-react';
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
import InternPoster from '../assets/internposter.jpeg';

const CustomStyles = () => (
  <style>{`
    @keyframes fade-in-up {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
    .animate-marquee { animation: marquee 40s linear infinite; }
    .hover\\:pause-animation:hover { animation-play-state: paused; }
    .preserve-3d { transform-style: preserve-3d; }
  `}</style>
);

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

const ToolsSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);
  const devopsTools = [
      { name: 'Linux', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg', description: 'Linux is the backbone of modern DevOps, providing the stability and flexibility required to host cloud-native applications. Our club focuses on mastering the command line, shell scripting, and system administration, giving members the foundational skills to manage any server environment.' },
      { name: 'Git & GitHub', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg', description: 'Version control is non-negotiable in software development. We dive deep into Git for tracking code changes and GitHub for hosting repositories and fostering teamwork. Members learn branching, pull requests, and resolving merge conflicts, ensuring they can contribute to any project with confidence.' },
      { name: 'Docker', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', description: "Docker revolutionized how we build and ship software by containerizing applications, ensuring consistency from a developer's laptop to production. We teach how to write Dockerfiles, manage images, and use Docker Compose for multi-container applications, a crucial skill for microservices." },
      { name: 'Kubernetes', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg', description: 'When containers run at scale, Kubernetes is the industry-standard for orchestration. It automates the deployment, scaling, and management of applications. Our workshops cover key concepts like Pods, Services, and Deployments, empowering members to manage complex, resilient systems with ease.' },
      { name: 'Jenkins', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', description: 'Automation is at the heart of DevOps, and Jenkins is a leading server for building CI/CD pipelines. We guide members through creating automated workflows that build, test, and deploy code. This hands-on experience reduces manual errors and accelerates the software delivery lifecycle.' },
      { name: 'Ansible', logoUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg', description: 'Configuration management ensures that infrastructure is consistent and reliable. Ansible is a powerful, agentless tool for automating this process using simple YAML syntax. We explore how to write playbooks to configure servers, deploy applications, and orchestrate complex IT tasks.' },
  ];

  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(() =>
      setCurrentIndex((prev) => (prev === devopsTools.length - 1 ? 0 : prev + 1)),
      10000
    );
    return () => resetTimeout();
  }, [currentIndex, devopsTools.length]);

  const goToSlide = (index) => setCurrentIndex(index);

  const getCardStyle = (index) => {
    const offset = index - currentIndex;
    const total = devopsTools.length;
    let adjustedOffset = offset;
    if (offset > total / 2) adjustedOffset = offset - total;
    else if (offset < -total / 2) adjustedOffset = offset + total;
    const scale = adjustedOffset === 0 ? 1 : 0.8;
    const opacity = adjustedOffset === 0 ? 1 : (Math.abs(adjustedOffset) === 1 ? 0.6 : 0);
    const zIndex = total - Math.abs(adjustedOffset);
    const translateX = adjustedOffset * 60;
    const blur = Math.abs(adjustedOffset) > 0 ? 'blur(4px)' : 'blur(0px)';
    return {
      transform: `translateX(${translateX}%) scale(${scale})`,
      opacity, zIndex, filter: blur,
      transition: 'all 0.5s ease-in-out',
    };
  };

  return (
    <div className="w-full relative flex flex-col items-center justify-center py-8">
      <div className="relative w-full h-[26rem] flex items-center justify-center">
        {devopsTools.map((tool, index) => (
          <div
            key={tool.name}
            className="absolute w-full max-w-2xl cursor-pointer"
            style={getCardStyle(index)}
            onClick={() => goToSlide(index)}
          >
            <div className={`p-8 rounded-2xl shadow-2xl border border-white/20 flex flex-col md:flex-row items-center gap-8 min-h-[22rem] transition-all duration-500 ${index === currentIndex ? 'bg-[#2a3f54]' : 'bg-[#2a3f54]/80 backdrop-blur-lg'}`}>
              <div className="flex-shrink-0 flex flex-col items-center justify-center space-y-4 md:w-1/4">
                <img src={tool.logoUrl} alt={`${tool.name} logo`} className="h-24 w-auto object-contain" />
                <h4 className="font-bold text-2xl text-white text-center tracking-wider">{tool.name}</h4>
              </div>
              <div className="md:w-3/4">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed text-center md:text-left">{tool.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeamCard = ({ name, designation, photoUrl, animationDelay }) => (
  <div
    className="flex-shrink-0 w-full bg-slate-400 backdrop-blur-md border border-gray-400/50 rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-3 hover:shadow-xl hover:shadow-orange-400/30 animate-fade-in-up"
    style={{ animationDelay }}
  >
    <img src={photoUrl} alt={name} className="w-24 h-24 mx-auto object-cover border-4 border-orange-400 rounded-full" />
    <h4 className="font-bold text-lg mt-4 text-slate-800">{name}</h4>
    <p className="text-sm text-[#2a3f54] font-medium mt-1 whitespace-pre-line">{designation}</p>
  </div>
);

const InternCard = ({ name, photoUrl }) => (
  <div className="h-full flex-shrink-0 w-full bg-slate-300 rounded-2xl shadow-lg p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-orange-400/20 flex flex-col">
    <div className="flex-grow">
      <img src={photoUrl} alt={name} className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-orange-400" />
      <h4 className="font-bold text-lg mt-4 text-slate-800">{name}</h4>
    </div>
    <div className="mt-auto border-t border-slate-400 pt-3 w-full">
      <p className="text-center text-sm font-semibold text-orange-400">RigelX Infotech Private Limited</p>
    </div>
  </div>
);

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
      <div className="flex animate-marquee hover:pause-animation space-x-8 pr-8">
        {extendedStudentData.map((student, index) => (
          <div key={index} className="flex-shrink-0 w-64">
            <InternCard name={student.name} photoUrl={student.photoUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}


const About = () => {
    const pageWrapperRef = useRef(null);

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
      <section ref={pageWrapperRef} className="relative flex flex-col pt-24 pb-24 overflow-hidden bg-slate-100 space-y-24">
        
        <div className="absolute inset-0 z-0"><NetworkBackground containerRef={pageWrapperRef} /></div>

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
            <ToolsSlider />
        </div>

        <div className="relative z-10 w-full text-center bg-slate-100/80 backdrop-blur-sm py-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-8 animate-fade-in-up" style={{animationDelay: '3.5s'}}>Meet Our Interns</h2>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-slate-200/50">
                <div className="flex flex-col md:flex-row md:items-stretch gap-12">
                    <div className="md:w-3/5 text-left animate-fade-in-up flex flex-col justify-center" style={{animationDelay: '3.6s'}}>
                        <p className="text-slate-700 text-lg leading-relaxed text-justify mb-4">
                            The DevOps Club of A. P. Shah Institute of Technology is thrilled to celebrate a significant milestone. We extend our heartiest congratulations to our 15 dedicated students who have successfully completed an impactful internship at RigelX Infotech Private Limited. This collaboration provided an unparalleled opportunity for our members to gain critical hands-on industry experience and apply their skills to solve real-world challenges.
                        </p>
                        <p className="text-slate-700 text-lg leading-relaxed text-justify">
                          We are immensely proud of their hard work, dedication, and professional growth throughout this journey. During the program, they not only sharpened their technical abilities but also mastered the vital skills of teamwork, communication, and collaboration. They have grown from students into young professionals ready for success, and this achievement sets a new standard for our club. We are excited to see them lead the next wave of innovation in the technology industry.
                        </p>
                    </div>
                    <div className="md:w-2/5 w-full flex justify-center animate-fade-in-up" style={{animationDelay: '3.7s'}}>
                        <div className="w-full max-w-sm overflow-hidden rounded-lg shadow-md border border-slate-300">
                            <img src={InternPoster} alt="Internship Poster" className="object-cover w-full h-full" />
                        </div>
                    </div>
                </div>
                <InternsMarquee />
            </div>
        </div>
      </section>
    </>
  );
};

export default About;