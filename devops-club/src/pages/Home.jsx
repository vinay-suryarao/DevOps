/* eslint-disable no-unused-vars */
/* eslint-disable no-irregular-whitespace */
import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom"; // <<< 1. YAHAN LINK IMPORT KIYA GAYA HAI
import {
  FaShieldAlt,
  FaUniversity,
  FaBullhorn,
  FaGavel,
  FaGraduationCap,
  FaHome,
  FaPaintRoller,
  FaChartLine,
  FaLinkedin,
} from "react-icons/fa";
import { Typewriter } from "react-simple-typewriter";
import { motion } from "framer-motion";
import sonalImg from "../assets/sonal.png";
import vishalImg from "../assets/vishal.png";
import sujataImg from "../assets/sujata.jpg";

// Logo imports
import redHatLogoHat from "../assets/redhat.png";
import redHatAcademyLogo from "../assets/redhat-academy-logo.jpg";
import premiumpartner from "../assets/premium-partner.jpg";

const NetworkBackground = ({ containerRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particlesArray;

    const setCanvasDimensions = () => {
      if (!containerRef.current) return;

      const dpr = window.devicePixelRatio || 1;
      const containerHeight = containerRef.current.scrollHeight;

      canvas.style.width = "100%";
      canvas.style.height = `${containerHeight}px`;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = containerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
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
        if (this.x > scaledWidth + 100 || this.x < -100)
          this.directionX = -this.directionX;
        if (this.y > scaledHeight + 100 || this.y < -100)
          this.directionY = -this.directionY;
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      let numberOfParticles =
        (canvas.width * canvas.height) / (20000 * (window.devicePixelRatio || 1) ** 2);
      const colors = ["#f97316", "#3b82f6"];

      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2.5 + 1.5;
        let x = Math.random() * (canvas.offsetWidth + 200) - 100;
        let y =
          Math.random() * (canvas.offsetHeight / (window.devicePixelRatio || 1) + 200) -
          100;
        let directionX = Math.random() * 0.3 - 0.15;
        let directionY = Math.random() * 0.3 - 0.15;
        let color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(
          new Particle(x, y, directionX, directionY, size, color)
        );
      }
    }

    function connect() {
      let opacityValue = 1;
      const scaledWidth = canvas.offsetWidth;
      const scaledHeight = canvas.offsetHeight / (window.devicePixelRatio || 1);
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance =
            (particlesArray[a].x - particlesArray[b].x) ** 2 +
            (particlesArray[a].y - particlesArray[b].y) ** 2;
          if (distance < (scaledWidth / 9) * (scaledHeight / 9)) {
            opacityValue = 1 - distance / 22000;
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
      if (!ctx || !particlesArray) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const driftX = Math.sin(timestamp / 8000) * 50;
      const driftY = Math.cos(timestamp / 8000) * 30;

      ctx.save();
      ctx.translate(driftX, driftY);
      particlesArray.forEach((p) => p.update());
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

    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      resizeObserver.disconnect();
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 w-full bg-slate-100"
      style={{ display: "block" }}
    />
  );
};

const services = [
  { title: "PLAN", icon: <FaShieldAlt /> },
  { title: "CODE", icon: <FaUniversity /> },
  { title: "BUILD", icon: <FaBullhorn /> },
  { title: "TEST", icon: <FaGavel /> },
  { title: "RELEASE", icon: <FaGraduationCap /> },
  { title: "DEPLOY", icon: <FaHome /> },
  { title: "OPERATE", icon: <FaPaintRoller /> },
  { title: "MONITOR", icon: <FaChartLine /> },
]; 

const coordinators = [
  {
    name: "Prof. Sonal Jain",
    role: "Assistant Professor at APSIT",
    image: sonalImg,
    skills: [
      "RHCSA",
      "Google Certified Educator",
      "Certified Instructor @ Red Hat Academy",
    ],
    linkedinUrl: "https://www.linkedin.com/in/sonal-jain-65235927a/",
  },
  {
    name: "Prof. Vishal Badgujar",
    role: "Assistant Professor at APSIT",
    image: vishalImg,
    skills: ["RHCSA", "AI-900", "OCI Architect Associate", "IBM", "AZ-900"],
    linkedinUrl: "https://www.linkedin.com/in/vishalbadgujar/",
  },
  {
    name: "Prof. Sujata Oak",
    role: "Assistant Professor at APSIT",
    image: sujataImg,
    skills: [
      "Git & GitHub",
      "Software Engineering",
      "Software Development",
      "CI/CD",
      "Kubernetes",
    ],
    linkedinUrl: "https://www.linkedin.com/in/sujata-oak-a887601a9/",
  },
];

const events = [
  {
    videoSrc:
      "https://res.cloudinary.com/dfzlwhsia/video/upload/v1758978245/Sonal_Jain_2_ccod7q.mp4",
    title: "What is DevOps ?",
    description:
      "DevOps is a combination of development and operations practices that aims to shorten the software development lifecycle and deliver high-quality software faster. It emphasizes automation, collaboration, and continuous integration and delivery (CI/CD) to ensure efficient, reliable, and scalable software deployment.",
    position: "left",
  },
  {
    videoSrc:
      "https://res.cloudinary.com/dfzlwhsia/video/upload/v1758978729/Sujata_Mam_2_mrj6gv.mp4",
    title: "Basics of DevOps",
    description:
      "At its core, DevOps represents a modern approach to software delivery that integrates people, processes, and tools. It focuses on continuous improvement, automation of repetitive tasks, and bridging the gap between development and operations teams to enhance productivity and efficiency.",
    position: "right",
  },
  {
    videoSrc:
      "https://res.cloudinary.com/dfzlwhsia/video/upload/v1758978962/Vishal_Sir_nhdnqj.mp4",
    title: "Why to choose DevOps ?",
    description:
      "Adopting DevOps empowers organizations to accelerate software delivery, improve collaboration, and achieve higher reliability. It ensures faster releases, reduced errors, and greater customer satisfaction by automating processes and promoting a culture of shared responsibility.",
    position: "left",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const fadeInTo25 = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 0.25,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const fadeInUp = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

const slideIn = (direction) => ({
  hidden: {
    x: direction === "left" ? -100 : 100,
    opacity: 0,
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      duration: 0.8,
    },
  },
});

const CoordinatorCard = ({ coordinator }) => (
  <div className="group w-80 h-96 [perspective:1000px]">
    <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
      <div className="absolute w-full h-full [backface-visibility:hidden]">
        <div className="w-full h-full rounded-2xl bg-[#2c3e50] p-1 shadow-2xl">
          <div className="w-full h-full bg-[rgba(44,62,80,0.8)] backdrop-blur-sm rounded-[15px] flex flex-col items-center justify-center text-center p-6">
            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-br from-sky-400 to-blue-600 mb-4">
              <img
                src={coordinator.image}
                alt={coordinator.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {coordinator.name}
            </h3>
            <p className="text-sky-300">{coordinator.role}</p>
          </div>
        </div>
      </div>
      <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
        <div className="w-full h-full rounded-2xl bg-[#2c3e50] p-1 shadow-2xl">
          <div className="w-full h-full bg-[rgba(44,62,80,0.8)] backdrop-blur-sm rounded-[15px] flex flex-col items-center justify-center p-6">
            <h4 className="text-2xl font-bold text-white mb-4">Certified</h4>
            <ul className="space-y-2 text-center">
              {coordinator.skills.map((skill, index) => (
                <li
                  key={index}
                  className="bg-slate-700 text-sky-300 rounded-full px-4 py-1 text-sm"
                >
                  {skill}
                </li>
              ))}
            </ul>
            <div className="flex space-x-4 mt-6">
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={coordinator.linkedinUrl}
                className="text-white hover:text-sky-400 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const VideoCard = ({ videoSrc }) => (
  <div className="bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 aspect-video">
    <video
      src={videoSrc}
      className="w-full h-full object-cover"
      loop
      playsInline
      controls
    />
  </div>
);

const EventRow = ({ videoSrc, title, description, videoPosition }) => {
  const videoElement = (
    <div className="w-full md:w-1/2">
      <VideoCard videoSrc={videoSrc} />
    </div>
  );

  const textElement = (
    <div className="w-full md:w-1/2 flex items-center justify-center p-4">
      <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-8 shadow-xl border-2 border-transparent group-hover:border-orange-500 transition-all duration-300">
        <h3 className="text-3xl font-bold text-slate-900 mb-4">{title}</h3>
        <p className="text-slate-700 text-lg">{description}</p>
      </div>
    </div>
  );

  return (
    <motion.div
      variants={slideIn(videoPosition === "left" ? "left" : "right")}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ y: -16, transition: { type: "spring", stiffness: 300 } }}
      className={`group flex flex-col md:flex-row items-center gap-8 w-full ${
        videoPosition === "right" ? "md:flex-row-reverse" : ""
      }`}
    >
      {videoElement}
      {textElement}
    </motion.div>
  );
};

const Home = () => {
  const pageWrapperRef = useRef(null);

  return (
    <div ref={pageWrapperRef} className="relative font-sans">
      <NetworkBackground containerRef={pageWrapperRef} />

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          src={
            "https://res.cloudinary.com/dfzlwhsia/video/upload/v1758979456/video_xrjzqm.mp4"
          }
        />
        <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10" />
        <motion.div
          className="absolute top-0 left-0 w-full h-full z-20 flex flex-col items-center justify-center text-center px-4"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={fadeInTo25}
            className="text-5xl md:text-8xl lg:text-[120px] font-bold text-white select-none leading-none tracking-widest mb-[-20px] md:mb-[-50px]"
          >
            APSIT DEVOPS CLUB
          </motion.h1>
          <motion.h2
            variants={fadeInUp}
            className="text-md md:text-lg text-white font-semibold tracking-widest mt-[-10px] md:mt-[-20px] mb-14 uppercase"
          >
            WELCOME TO DEVOPS CLUB
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            className="text-4xl md:text-5xl text-white font-bold mb-10 pt-4 max-w-5xl"
          >
            <span>Orchestrating digital transformation through</span>
            <span className="block text-sky-400 font-semibold">
              <Typewriter
                words={services.map((s) => s.title)}
                loop={0}
                cursor
                cursorStyle="|"
                typeSpeed={150}
                deleteSpeed={120}
                delaySpeed={2350}
              />
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Red Hat Section */}
      <section className="relative bg-transparent py-20">
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeInUp}
            className="bg-white backdrop-blur-md rounded-3xl p-8 border border-slate-300 shadow-2xl transition-shadow duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(249,115,22,0.6),_0_0_30px_rgba(249,115,22,0.4),_inset_0_0_10px_rgba(249,115,22,0.3)]"
          >
            <div className="flex justify-center items-center gap-x-4 mb-8">
              <h2 className="text-4xl font-extrabold text-center text-slate-800 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)]">
                APSIT Red Hat Academy
              </h2>
              <img
                src={redHatLogoHat}
                alt="Red Hat Logo"
                className="h-12 w-auto"
              />
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <img
                  src={premiumpartner}
                  alt="APSIT Red Hat Academy Certificate"
                  className="rounded-xl shadow-lg border-2 border-slate-300/50 object-contain max-h-[400px]"
                />
              </div>

              <div className="w-full lg:w-1/2">
                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  <b>Red Hat Academy</b> is a global program that connects
                  industry and academia, helping students build skills in Linux,
                  cloud, containers, and automation with real-world, hands-on
                  learning.
                </p>
                <p className="text-slate-700 text-lg leading-relaxed mb-4">
                  In collaboration with the <b>APSIT DevOps Club</b>, this
                  premium partnership offers workshops, certifications, and
                  mentorship from Red Hat certified professionals, ensuring
                  students gain both knowledge and practical expertise.
                </p>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Together, <b>Red Hat Academy</b> and{" "}
                  <b>APSIT DevOps Club</b> prepare students to be future-ready
                  IT professionals, combining academic excellence with
                  industry-relevant DevOps and cloud skills.
                </p><br></br>

                <p className="text-slate-700 text-lg leading-relaxed">
                  Click the button to know more.
                </p>
                <div className="mt-6">
                  <Link
                    to="/redhat"
                    className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-md hover:bg-orange-600 transition-all"
                  >
                    APSIT RHA 
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Faculty Coordinators Section */}
      <section className="relative bg-transparent py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="text-4xl font-extrabold text-slate-800 mb-12"
            >
              FACULTY COORDINATORS
            </motion.h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex flex-wrap justify-center gap-16"
            >
              {coordinators.map((coord, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <CoordinatorCard coordinator={coord} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discover DevOps Section */}
      <section className="relative bg-transparent py-20">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <motion.h2
              variants={fadeInUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.5 }}
              className="text-4xl font-extrabold text-slate-800 mb-12"
            >
              Discover DevOps
            </motion.h2>
          </div>
          <div className="flex flex-col items-center gap-20 max-w-7xl mx-auto">
            {events.map((event, index) => (
              <EventRow
                key={index}
                videoSrc={event.videoSrc}
                title={event.title}
                description={event.description}
                videoPosition={event.position}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;