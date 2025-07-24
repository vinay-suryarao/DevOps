import React, { useState, useRef, useEffect } from 'react';

// --- Configuration ---
// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzaXfJ9hGjtbCcUxWalU6jh7BVOwIJEHWzxIfeE2VgAmYwV16LzL7Nc_ptfBvJwu8A/exec";

// --- Data ---
const events = [  
  "Select Event",
  "CI/CD with GitHub Actions",
  "Kubernetes 101",
  "Intro to Terraform",
  "Docker Hub",
  "Monitoring with Prometheus & Grafana"
];

const departments = [
  "Select Your Department",
    "Information Technology",
    "Computer Engineering",
    "Data Science Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "AI/ML Engineering"
];

// --- Helper Components for Icons ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const IdCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
);

// --- Custom Select Dropdown Component ---
const CustomSelect = ({ id, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSelect = (optionValue) => {
        onChange(id, optionValue);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={selectRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 text-left bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all duration-300 flex justify-between items-center"
            >
                <span>{value}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {isOpen && (
                <ul className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-auto transition-all duration-300 ease-in-out transform origin-top animate-fadeIn">
                    {options.map(option => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className="px-4 py-2 text-slate-800 hover:bg-slate-100 cursor-pointer"
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
             <style>
                {`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scaleY(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scaleY(1);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.1s ease-out;
                }
                `}
            </style>
        </div>
    );
};


// --- Canvas Background Component ---
const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particlesArray;

        const setCanvasDimensions = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        setCanvasDimensions();

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
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 18000;
            const colors = ['#1e293b', '#f97316']; // Dark Slate and Orange
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = colors[Math.floor(Math.random() * colors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                        + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                        opacityValue = 1 - (distance / 20000);
                        const particleColor = particlesArray[a].color;
                        if (particleColor === '#f97316') {
                            ctx.strokeStyle = `rgba(249, 115, 22, ${opacityValue})`;
                        } else {
                            ctx.strokeStyle = `rgba(30, 41, 59, ${opacityValue})`;
                        }
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
            animationFrameId = window.requestAnimationFrame(animate);
        }

        init();
        animate();

        const handleResize = () => {
            setCanvasDimensions();
            init();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-slate-100" />;
};

// --- Main App Component ---
export default function App() {
  // --- State Management ---
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    moodleId: '',
    department: departments[0],
    event: events[0],
    feedback: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | 'success' | 'error'
  const [currentDate, setCurrentDate] = useState(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
  );

  // --- Effect to update date at midnight ---
  useEffect(() => {
    const updateDateAtMidnight = () => {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilMidnight = tomorrow - now;

        // Set a timeout to update the date a second after midnight
        const timerId = setTimeout(() => {
            setCurrentDate(new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }));
            // Recursively call to set up the next day's timer
            updateDateAtMidnight();
        }, msUntilMidnight + 1000);

        return () => clearTimeout(timerId);
    };

    const cleanup = updateDateAtMidnight();
    return cleanup;
  }, []);

  // --- Handlers ---
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleSelectChange = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    setSubmissionStatus(null);

    const dataToSubmit = new FormData();
    dataToSubmit.append('Date', currentDate); // <-- Send the displayed date
    dataToSubmit.append('Name', formData.name);
    dataToSubmit.append('Email', formData.email);
    dataToSubmit.append('MoodleID', formData.moodleId);
    dataToSubmit.append('Department', formData.department);
    dataToSubmit.append('Event', formData.event);
    dataToSubmit.append('Feedback', formData.feedback);

    fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: dataToSubmit })
      .then(res => {
        if (res.ok || res.type === 'opaque') {
          setSubmissionStatus('success');
          setFormData({
            name: '', email: '', moodleId: '',
            department: departments[0], event: events[0], feedback: ''
          });
        } else {
          throw new Error('Server response was not OK.');
        }
      })
      .catch(err => {
        console.error("Submission Error:", err);
        setSubmissionStatus('error');
      })
      .finally(() => {
        setSubmitting(false);
        setTimeout(() => setSubmissionStatus(null), 5000);
      });
  };

  // --- JSX Rendering ---
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-xl p-8 text-slate-800 transition-all duration-500 z-10">
        
        {/* --- Header --- */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">Share Your Valuable Feedback</h1>
          <p className="text-slate-500 text-lg">We value your thoughts. Help us improve!</p>
        </div>

        {/* --- Form --- */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- Date Display --- */}
          <div className="text-center p-3 bg-slate-100/80 rounded-lg border border-slate-200">
            <span className="text-slate-600">Submission Date: </span>
            <span className="font-semibold text-slate-800">{currentDate}</span>
          </div>

          {/* Row 1: Name and Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <UserIcon />
              <input type="text" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all duration-300" />
            </div>
            <div className="relative">
              <MailIcon />
              <input type="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all duration-300" />
            </div>
          </div>

          {/* Row 2: Moodle ID and Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
                <IdCardIcon />
                <input type="text" id="moodleId" placeholder="Moodle ID" value={formData.moodleId} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all duration-300" />
            </div>
            <CustomSelect 
                id="department"
                options={departments}
                value={formData.department}
                onChange={handleSelectChange}
            />
          </div>

          {/* Row 3: Event */}
          <CustomSelect 
            id="event"
            options={events}
            value={formData.event}
            onChange={handleSelectChange}
          />

          {/* Row 4: Feedback Textarea */}
          <textarea id="feedback" placeholder="Share your detailed feedback..." value={formData.feedback} onChange={handleChange} required rows="5" className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all duration-300"></textarea>

          {/* --- Submission Area --- */}
          <div className="text-center pt-4">
            <button type="submit" disabled={submitting} className="w-full md:w-auto font-bold text-lg text-white px-10 py-3 bg-slate-800 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
              {submitting ? 'Sending...' : 'Submit Feedback'}
            </button>
            
            {/* --- Status Messages --- */}
            {submissionStatus === 'success' && (
              <p className="mt-4 text-green-600 font-semibold">✅ Success! Thank you for your feedback.</p>
            )}
            {submissionStatus === 'error' && (
              <p className="mt-4 text-red-600 font-semibold">❌ Error! Could not submit. Please try again.</p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
