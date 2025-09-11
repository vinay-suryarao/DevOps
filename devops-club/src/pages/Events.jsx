import React, { useState, useRef, useEffect } from 'react';
// Make sure to install lucide-react: npm install lucide-react
import { Calendar, Clock, MapPin, Globe, X, ArrowLeft, Search, Filter, PlayCircle } from 'lucide-react';
import intro_devops_pic1 from '../assets/intro_devops_pic1.jpg';
import img_01 from '../assets/img_01.jpg'
import img_02 from '../assets/img_02.jpg'
import img_03 from '../assets/img_03.jpg'
import img_04 from '../assets/img_04.jpg'
import intro_to_cloud from '../assets/intro_to_cloud.jpg';
import img_15 from '../assets/img_15.png'
import img_16 from '../assets/img_16.jpg'
import img_17 from '../assets/img_17.jpg'
import img_18 from '../assets/img_18.png'
import linux_basic from '../assets/linux_basic.jpg';
import img_05 from '../assets/img_05.jpg'
import img_06 from '../assets/img_06.jpg'
import img_07 from '../assets/img_07.jpg'
import red_hat from '../assets/red_hat.jpg'
import img_08 from '../assets/img_08.jpg'
import img_09 from '../assets/img_09.jpg'
import img_10 from '../assets/img_10.jpg'
import img_11 from '../assets/img_11.jpg'
import red_hat_career from '../assets/red_hat_career.jpg'
import img_12 from '../assets/img_12.jpg'
import img_13 from '../assets/img_13.jpg'
import img_14 from '../assets/img_14.jpg'
import linux_bash from '../assets/linux_bash.jpg'
import img_19 from '../assets/img_19.jpg'
import img_20 from '../assets/img_20.jpg'
import img_21 from '../assets/img_21.jpg'
import img_22 from '../assets/img_22.jpg'

// ### CHANGE HERE: API URL ab .env file se aa raha hai ###
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_EVENTS_FEEDBACK_SCRIPT_URL;

// --- Data for Feedback Form ---
const feedbackFormEvents = [
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

// --- Helper Components for Feedback Form Icons ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const IdCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
);

// --- Custom Select Dropdown Component for Feedback Form ---
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

// --- Feedback Form Section ---
const FeedbackFormSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    moodleId: '',
    department: departments[0],
    event: feedbackFormEvents[0],
    feedback: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // null | 'success' | 'error'
  const [currentDate, setCurrentDate] = useState(
      new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      })
  );

  useEffect(() => {
    const updateDateAtMidnight = () => {
        const now = new Date();
        const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
        const msUntilMidnight = tomorrow - now;

        const timerId = setTimeout(() => {
            setCurrentDate(new Date().toLocaleDateString('en-US', {
                year: 'numeric', month: 'long', day: 'numeric'
            }));
            updateDateAtMidnight();
        }, msUntilMidnight + 1000);

        return () => clearTimeout(timerId);
    };
    const cleanup = updateDateAtMidnight();
    return cleanup;
  }, []);

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
    dataToSubmit.append('Date', currentDate);
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
            department: departments[0], event: feedbackFormEvents[0], feedback: ''
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

  return (
    <div className="w-full bg-white/95 border border-slate-200 rounded-2xl shadow-xl p-8 text-slate-800 transition-all duration-500 z-10">
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center p-3 bg-slate-100/80 rounded-lg border border-slate-200">
        <span className="text-slate-600">Submission Date: </span>
        <span className="font-semibold text-slate-800">{currentDate}</span>
        </div>
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
        <CustomSelect 
        id="event"
        options={feedbackFormEvents}
        value={formData.event}
        onChange={handleSelectChange}
        />
        <textarea id="feedback" placeholder="Share your detailed feedback..." value={formData.feedback} onChange={handleChange} required rows="5" className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all duration-300"></textarea>
        <div className="text-center pt-4">
        <button type="submit" disabled={submitting} className="w-full md:w-auto font-bold text-lg text-white px-10 py-3 bg-slate-800 rounded-lg hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-500/50 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105">
            {submitting ? 'Sending...' : 'Submit Feedback'}
        </button>
        {submissionStatus === 'success' && (
            <p className="mt-4 text-green-600 font-semibold">✅ Success! Thank you for your feedback.</p>
        )}
        {submissionStatus === 'error' && (
            <p className="mt-4 text-red-600 font-semibold">❌ Error! Could not submit. Please try again.</p>
        )}
        </div>
    </form>
    </div>
  );
};


// --- GLOBAL STYLES & ANIMATIONS ---
const CustomStyles = () => (
  <style>{`
    @keyframes fade-in-up {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-fade-in-up {
      animation: fade-in-up 0.8s ease-out forwards;
    }
    @keyframes fade-in {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }
     @keyframes slide-down {
      0% {
        opacity: 0;
        transform: translateY(-10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-slide-down {
      animation: slide-down 0.3s ease-out forwards;
    }
  `}</style>
);

// --- GLOBAL BACKGROUND (UPDATED FOR MOVEMENT AND LESS CONGESTION) ---
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
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
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
                // Particles bounce off the edges of a larger invisible box to feel more natural
                if (this.x > canvas.clientWidth + 100 || this.x < -100) this.directionX = -this.directionX;
                if (this.y > canvas.clientHeight + 100 || this.y < -100) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            // MODIFICATION: Drastically reduced particle density for a less congested look
            let numberOfParticles = (canvas.clientWidth * canvas.clientHeight) / 20000;
            const colors = ['#f97316', '#3b82f6'];
           
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2.5) + 1.5; 
                // Particles are generated in a larger area to drift into view smoothly
                let x = (Math.random() * (canvas.clientWidth + 200)) - 100;
                let y = (Math.random() * (canvas.clientHeight + 200)) - 100;
                let directionX = (Math.random() * .3) - .15;
                let directionY = (Math.random() * .3) - .15;
                let color = colors[Math.floor(Math.random() * colors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                   
                    // MODIFICATION: Reduced connection radius for fewer lines
                    if (distance < (canvas.clientWidth / 9) * (canvas.clientHeight / 9)) {
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

        // MODIFICATION: Animate function now accepts a timestamp for smooth, time-based motion
        function animate(timestamp) {
            if(!ctx || !particlesArray) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height); 
           
            // MODIFICATION: Add a slow, gentle, looping drift to the entire canvas
            const driftX = Math.sin(timestamp / 8000) * 50;
            const driftY = Math.cos(timestamp / 8000) * 30;
           
            ctx.save(); // Save the current state
            ctx.translate(driftX, driftY); // Apply the drift

            particlesArray.forEach(p => p.update());
            connect();

            ctx.restore(); // Restore to the original state for the next frame
           
            animationFrameId = window.requestAnimationFrame(animate);
        }
       
        // Initial setup
        setCanvasDimensions();
        init();
        animate(0); // Start the animation
       
        const handleResize = () => { 
            window.cancelAnimationFrame(animationFrameId);
            setCanvasDimensions(); 
            init();
            animate(0);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-slate-100" style={{ display: 'block' }} />;
};


// --- EVENT PAGE COMPONENTS ---
const RegistrationForm = ({ event, allEvents, onClose }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        event: event ? event.name : (allEvents.length > 0 ? allEvents[0].name : ''),
        fullName: '',
        email: '',
        phone: '',
        moodleId: '',
        semester: '',
        branch: '',
        division: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // ### CHANGE HERE: API URL ab .env file se aa raha hai ###
        const scriptURL = import.meta.env.VITE_EVENTS_REGISTRATION_SCRIPT_URL;
        try {
            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                redirect: 'follow',
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error submitting form:', error);
            console.log("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const finalEvent = allEvents.find(e => e.name === formData.event);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
                    <X size={24} />
                </button>
                {isSubmitted ? (
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-blue-600 mb-4">Registration Confirmed!</h3>
                        <p className="text-slate-600 mb-2">Thank you for registering for <span className="font-semibold">{finalEvent?.name}</span>.</p>
                        <p className="text-slate-600">Your details have been recorded.</p>
                        <button onClick={onClose} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold text-orange-500 mb-6">Register for an Event</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="event-select" className="block text-sm font-medium text-slate-700">Event</label>
                                <select id="event-select" name="event" value={formData.event} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    {allEvents.map((evt) => (<option key={evt.name} value={evt.name}>{evt.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700">Full Name</label>
                                <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                                <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
                                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required pattern="[0-9]{10}" title="Please enter a 10-digit phone number" className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="moodleId" className="block text-sm font-medium text-slate-700">Moodle ID</label>
                                <input type="text" id="moodleId" name="moodleId" value={formData.moodleId} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="semester" className="block text-sm font-medium text-slate-700">Semester</label>
                                    <select id="semester" name="semester" value={formData.semester} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Select Sem</option>
                                        {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="branch" className="block text-sm font-medium text-slate-700">Branch</label>
                                    <select id="branch" name="branch" value={formData.branch} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Select Branch</option>
                                        <option value="COMP">Computer</option>
                                        <option value="IT">IT</option>
                                        <option value="AIML">AIML</option>
                                        <option value="DS">Data Science</option>
                                        <option value="MECH">Mechanical</option>
                                        <option value="CIVIL">Civil</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="division" className="block text-sm font-medium text-slate-700">Division</label>
                                    <select id="division" name="division" value={formData.division} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                        <option value="">Select Division</option>
                                        <option value="A">A</option> <option value="B">B</option> <option value="C">C</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-right pt-4">
                                <button type="submit" disabled={isSubmitting} className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

const EventCard = ({ event, onRegister, animationDelay }) => {
    const { name, description, imageUrl, date, time, location, mode } = event;
    return (
        <div className="bg-white rounded-2xl shadow-xl flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay }}>
            <img src={imageUrl} alt={name} className="w-full h-48 object-cover rounded-t-2xl" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/2a3f54/f97316?text=Event'; }} />
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-orange-500 mb-2">{name}</h3>
                <p className="text-slate-600 mb-4 text-sm flex-grow">{description}</p>
                <div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-500">
                    <p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-500" /> {date}</p>
                    <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" /> {time}</p>
                    {mode === 'Offline' ? (
                        <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" /> {location}</p>
                    ) : (
                        <p className="flex items-center"><Globe className="w-4 h-4 mr-2 text-blue-500" /> {location}</p>
                    )}
                </div>
                <div className="mt-6 text-center">
                    <button onClick={onRegister} className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg">
                        Register Now
                    </button>
                </div>
            </div>
        </div>
    );
};

const CompactPastEventCard = ({ event, onViewMore, animationDelay }) => {
    const { name, imageUrl, date, time } = event;
    return (
        <div className="bg-slate-50 rounded-xl shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up overflow-hidden" style={{ animationDelay }}>
            <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-40 object-cover" 
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x400/9ca3af/ffffff?text=Past'; }} 
            />
            <div className="p-4 flex flex-col flex-grow text-left w-full">
                <h3 className="font-bold text-md text-orange-500 mb-1 truncate">{name}</h3>
                <p className="flex items-center text-xs text-black mb-4"><Calendar className="w-3 h-3 mr-1.5" /> {date}</p>
                <p className="flex items-center text-xs text-black mb-4"><Clock className="w-3 h-3 mr-1.5" /> {time}</p>
                <div className="mt-auto">
                    <button onClick={onViewMore} className="w-full text-xs bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors duration-300">
                        View More
                    </button>
                </div>
            </div>
        </div>
    );
};

const PastEventDetail = ({ event, onBack }) => {
    return (
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in w-full max-w-6xl">
            <button onClick={onBack} className="flex items-center text-blue-500 hover:text-blue-700 font-semibold mb-8">
                <ArrowLeft size={20} className="mr-2" />
                Back to All Events
            </button>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <img src={event.posterUrl} alt={event.name} className="w-full h-64 md:h-96 object-cover" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/1200x800/2a3f54/ffffff?text=Event+Poster'; }}/>
                <div className="p-8 md:p-12">
                    <h2 className="text-4xl font-extrabold text-[#2a3f54] mb-4">{event.name}</h2>
                    <p className="text-slate-500 mb-8 flex items-center"><Calendar className="w-5 h-5 mr-3 text-slate-400" /> Held on {event.date}</p>
                    <p className="text-slate-500 mb-8 flex items-center"><Clock className="w-5 h-5 mr-3 text-slate-400" /> Time {event.time}</p>
                    <div className="prose max-w-none text-slate-700 mb-12">
                        <h3 className="text-2xl font-bold text-slate-800 mb-3 ">Event Brief</h3>
                        <p className="text-justify">{event.brief}</p>
                    </div>
               
                    {event.galleryImages && event.galleryImages.length > 0 && (
                        <div className="border-t border-slate-200 pt-12">
                            <h3 className="text-3xl font-bold text-center text-[#2a3f54] mb-8 animate-fade-in-up">Event Gallery</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {event.galleryImages.map((imgSrc, index) => (
                                    <div key={index} className="animate-fade-in-up" style={{animationDelay: `${0.2 + index * 0.1}s`}}>
                                        <img 
                                            src={imgSrc} 
                                            alt={`${event.name} gallery image ${index + 1}`} 
                                            className="w-full h-56 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/9ca3af/ffffff?text=Gallery+Image'; }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FilterControls = ({ tempFilters, onTempFilterChange, onApply, onClear, years, domains, allEventNames }) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [filterRef]);


    const handleApply = () => {
        onApply();
        setIsFilterOpen(false);
    }
   
    const handleClear = () => {
        onClear();
        setIsFilterOpen(false);
    }
   
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onApply();
        }
    };

    return (
        <div className="relative animate-fade-in-up w-full max-w-2xl mx-auto mb-12 z-30">
            <div className="relative flex items-center bg-white/90 rounded-full shadow-lg p-2">
                <Search className="absolute left-5 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search by name and press Enter..."
                    value={tempFilters.search}
                    onChange={onTempFilterChange}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full bg-transparent pl-12 pr-16 py-2 text-slate-800 focus:outline-none"
                />
                <div className="relative" ref={filterRef}>
                     <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow"
                    >
                        <Filter size={20} />
                    </button>
                    {isFilterOpen && (
                        <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl p-4 z-20 animate-slide-down">
                            <h4 className="font-bold text-slate-800 mb-4 text-left">Filter Events</h4>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="eventName-filter" className="block text-sm font-medium text-slate-700 mb-1 text-left">Event Name</label>
                                    <select id="eventName-filter" name="eventName" value={tempFilters.eventName} onChange={onTempFilterChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition">
                                        <option value="">All Events</option>
                                        {allEventNames.map(name => <option key={name} value={name}>{name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="domain-filter" className="block text-sm font-medium text-slate-700 mb-1 text-left">Domain</label>
                                    <select id="domain-filter" name="domain" value={tempFilters.domain} onChange={onTempFilterChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition">
                                        <option value="">All Domains</option>
                                        {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="year-filter" className="block text-sm font-medium text-slate-700 mb-1 text-left">Year</label>
                                    <select id="year-filter" name="year" value={tempFilters.year} onChange={onTempFilterChange} className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition">
                                        <option value="">All Years</option>
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                 <div>
                                    <label htmlFor="date-filter" className="block text-sm font-medium text-slate-700 mb-1 text-left">Specific Date</label>
                                    <input
                                        type="date"
                                        id="date-filter"
                                        name="date"
                                        value={tempFilters.date}
                                        onChange={onTempFilterChange}
                                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-6">
                                <button onClick={handleClear} className="text-sm font-semibold text-slate-500 hover:text-slate-800">Clear All</button>
                                <button onClick={handleApply} className="bg-blue-500 text-white font-bold py-2 px-5 rounded-full hover:bg-blue-600 transition-colors duration-300">
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const TestimonialCard = ({ testimonial, animationDelay }) => {
    const { videoUrl, thumbnailUrl, quote, name } = testimonial;
    return (
        <div className="bg-white rounded-2xl shadow-xl flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl animate-fade-in-up" style={{ animationDelay }}>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="relative">
                <img src={thumbnailUrl} alt={`Testimonial from ${name}`} className="w-full h-48 object-cover rounded-t-2xl" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/2a3f54/f97316?text=Video'; }} />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-t-2xl">
                    <PlayCircle className="w-16 h-16 text-white opacity-80 hover:opacity-100 transition-opacity" />
                </div>
            </a>
            <div className="p-6 flex flex-col flex-grow">
                <blockquote className="text-slate-600 mb-4 text-sm flex-grow italic">"{quote}"</blockquote>
                <p className="font-bold text-right text-orange-500">- {name}</p>
            </div>
        </div>
    );
};

const MainEventsView = ({
    tempFilters, onTempFilterChange, onApply, onClear, years, domains, allEventNames,
    filteredUpcomingEvents, filteredPastEvents, onRegister, onViewMore, testimonials
}) => (
    <div className="relative z-10 container mx-auto text-center px-4 sm:px-6 lg:px-8 animate-fade-in">
        <FilterControls 
            tempFilters={tempFilters} onTempFilterChange={onTempFilterChange} onApply={onApply}
            onClear={onClear} years={years} domains={domains} allEventNames={allEventNames}
        />

        <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-12 animate-fade-in-up">
            Upcoming Events & Workshops
        </h2>
        {filteredUpcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {filteredUpcomingEvents.map((event, index) => (
                    <EventCard key={index} event={event} onRegister={() => onRegister(event)} animationDelay={`${0.2 + index * 0.1}s`} />
                ))}
            </div>
        ) : (
            <p className="text-slate-500 bg-white/50 rounded-lg p-8">No upcoming events match your criteria.</p>
        )}

        <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mt-24 mb-12 animate-fade-in-up">
            Past Events & Workshops
        </h2>
        {filteredPastEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {filteredPastEvents.map((event, index) => (
                    <CompactPastEventCard key={index} event={event} onViewMore={() => onViewMore(event)} animationDelay={`${0.2 + index * 0.1}s`} />
                ))}
            </div>
        ) : (
            <p className="text-slate-500 bg-white/50 rounded-lg p-8">No past events match your criteria.</p>
        )}

        <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mt-24 mb-12 animate-fade-in-up">
            What Our Attendees Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
                <TestimonialCard key={index} testimonial={testimonial} animationDelay={`${0.2 + index * 0.1}s`} />
            ))}
        </div>
       
        {/* --- New Feedback Section --- */}
        <div className="mt-24 max-w-4xl mx-auto">
             <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-12 animate-fade-in-up">
                 Share Your Valuable Feedback
            </h2>
            <FeedbackFormSection />
        </div>
    </div>
);


// --- MAIN APP COMPONENT ---
export default function App() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewingPastEvent, setViewingPastEvent] = useState(null);
   
    const initialFilterState = { search: '', domain: '', year: '', date: '', eventName: '' };
    const [tempFilters, setTempFilters] = useState(initialFilterState);
    const [appliedFilters, setAppliedFilters] = useState(initialFilterState);

    useEffect(() => {
        if (viewingPastEvent) {
            window.scrollTo(0, 0);
        }
    }, [viewingPastEvent]);

    const upcomingEvents = [
        { name: 'Introduction to Docker', description: 'A hands-on workshop covering the fundamentals of Docker, containerization, and basic commands.', imageUrl: 'https://placehold.co/600x400/2a3f54/ffffff?text=Docker', date: 'August 15, 2025', time: '2:00 PM - 4:00 PM', mode: 'Online', location: 'via Zoom', domain: 'DevOps' },
        { name: 'Kubernetes for Beginners', description: 'Learn how to orchestrate containers with Kubernetes. This session covers pods, services, and deployments.', imageUrl: 'https://placehold.co/600x400/60a5fa/ffffff?text=Kubernetes', date: 'August 22, 2025', time: '3:00 PM - 5:00 PM', mode: 'Offline', location: 'College Auditorium', domain: 'DevOps' },
        { name: 'CI/CD with Jenkins', description: 'Automate your build, test, and deployment pipeline using Jenkins. A step-by-step guide.', imageUrl: 'https://placehold.co/600x400/f97316/ffffff?text=Jenkins', date: 'September 5, 2025', time: '1:00 PM - 3:00 PM', mode: 'Online', location: 'via Google Meet', domain: 'DevOps' },
    ];
   
    const pastEvents = [
        { name: 'Introduction to DevOps', imageUrl: intro_devops_pic1, posterUrl: img_01 , date: '19th September, 2024', time: '9:30 am to 10:30 am', brief: 'The DevOps Club hosted a workshop titled "Introduction to DevOps" on 19th September 2024. The session, which aimed to introduce students to the fundamentals of DevOps, began promptly at 9:35 AM. With a focus on the role of DevOps engineers, SDLC models, Agile methodologies, and various stages of DevOps, the event provided participants with both theoretical knowledge and practical insights into modern software development practices.Sakshi Jagtap kicked off the workshop by explaining the origin of DevOps and why it emerged as a necessity in software development. She elaborated on the issues caused by the traditional separation between development and operations teams, such as long development cycles and miscommunication. She also described how DevOps bridges these gaps, ensuring smoother, faster, and more reliable software delivery by encouraging collaboration and automation.Following this, Meet Jamsutkar took over to discuss the Software Development Life Cycle (SDLC). He outlined the stages of SDLC, highlighting how software projects evolve from requirement gathering to deployment. Meet also covered various SDLC models, such as the Waterfall and Spiral, before moving on to explain Agile methodology. He described Agile as a flexible and iterative development model that allows teams to adapt to changes rapidly, making it a perfect complement to DevOps practices.Sakshi returned to explain the stages of DevOps, covering critical phases like planning, development, testing, release, deployment, and monitoring. She highlighted key tools such as Git for version control, and Docker for containerization. Sakshi also discussed Infrastructure as Code (IaC),  promoting consistency across environments. She delved into advanced topics like container orchestration using Kubernetes, and monitoring tools like Grafana and Nagios, stressing their importance in ensuring system stability and performance. Additionally, she introduced GitOps, which leverages Git for deploying infrastructure changes.Meet Jamsutkar later elaborated on key DevOps concepts such as Testing and CI/CD pipelines, explaining how these technologies integrate to ensure seamless software delivery and scaling. He highlighted the role of Jenkins in managing continuous integration and deployment, showing how it simplifies the CI/CD process. He also covered various Deployment strategies and the use of Cloud platforms such as AWS, GCP, and Azure, comparing their benefits. He emphasized how cloud services, compared to traditional dedicated servers and shared hosting. The session concluded with a comprehensive discussion on how cloud solutions streamline the deployment process, enabling faster and more efficient management of applications in a DevOps environment.', galleryImages: [img_02, img_03, img_04], domain: 'Development' },
        { name: 'Introduction to Cloud Deployment Essentials', imageUrl: intro_to_cloud , posterUrl: img_15, date: '4th October, 2024' , time: '10:00 am to 12:00 pm', brief: 'The DevOps Club hosted an informative session “Cloud Computing, AI Model Deployment, and Web Application Deployment” on 4th October, 2024 aimed at introducing students to fundamental concepts of cloud computing and practical deployment methods for AI models and React applications started at 10 am. The session featured theoretical insights, hands-on demonstrations, and discussions on cloud environments and service providers.The session commenced with Urvi giving an overview of cloud computing, emphasizing its advantages over traditional computing infrastructure on pointers like, On-Demand Self-Service, Broad Network Access, Resource Pooling, Measured Service and Rapid Elasticity.Participants learned about the distinctions between cloud computing and traditional setups, focusing on flexibility, scalability, and cost-effectiveness. The discussion included various cloud deployment models like Public Cloud, Private Cloud and hybrid Cloud.The session continued with an introduction to key cloud service providers, including AWS, GCP, Microsoft Azure and DigitalOcean. The strengths of each platform were reviewed, with a particular emphasis on DigitalOcean for its user-friendly approach, making it an excellent entry point for developers new to cloud deployment.The next segment focused on Varad explaining about Hugging Face Inference API, showcasing its ability to deploy pre-trained AI models for various applications like text generation and sentiment analysis with discussion going around: Integration of AI functionalities into applications with minimal effort.Introduction to Hugging Face Spaces for hosting machine learning models.A live demonstration of deploying a model on Hugging Face Spaces, providing insights into cloud-based deployment and management.The session concluded with a hands-on demonstration of deploying React applications using Vercel. The Instant deployment capabilities, Serverless functionalities, Global edge network for scalability were explained by Urvi. And the Participants did a live deployment of a simple React application, gaining firsthand experience with Vercels efficiency and ease of use.Throughout the session, participants engaged in hands-on exercises, deploying AI models using Hugging Face and React applications on Vercel. These practical applications reinforced the theoretical knowledge presented earlier, equipping students with the skills necessary for cloud-based deployments.The event successfully provided a comprehensive exploration of cloud computing, AI model deployment, and web application deployment using modern platforms. A recap of the key topics concluded the session, leaving participants with a deeper understanding of cloud strategies and tools for efficient application deployment.', galleryImages: [img_16, img_17, img_18], domain: 'Data Science' },
        { name: 'Exploring Linux: From Basics to Command Line Mastery', imageUrl: linux_basic, posterUrl: img_05, date: '13th March, 2025', time: '8:30 am to 10:00 am', brief: 'The DevOps Club hosted a workshop on Linux Fundamentals on 13th of March 2025, aiming to equip students with the essential skills needed to navigate and master the Linux command line. The session aimed to provide a structured introduction to Linux systems, commands, user management, and scripting, laying a strong foundation for those aiming their careers in DevOps. Shreyas Narvekar, a third-year Information Technology Engineering student and a DevOps enthusiast, led the session. The session kicked off at 08:30 AM by introducing Linux’s significance in today’s tech landscape by explaining why Linux holds such significance in cloud platforms as well as in running critical enterprise infrastructure. Shreyash walked the audience through the various Linux distributions, explaining their differences and helping students understand which one might be the best fit for their needs; whether for personal use or for DevOps.Once the foundation was set, the session dived into file system navigation, which is an essential skill for working on Linux. Students learned how to move between directories, list files, and execute basic commands like ls, cd, and pwd, gaining confidence with the command line interface. To ensure an interactive experience, Shreyash provided real-time hands-on demonstrations, making it easy for attendees to follow along and apply what they learned on their own systems.Then the session moved on towards user management, groups, and permissions. Attendees were shown how to create and manage user accounts, groups, and set file permissions, which is are essential for system security and administrative tasks. Building on this, the session moved into process management and package management, where students gained practical insights into monitoring and controlling processes, along with understanding package installation and updates using apt.One of the most exciting parts of the session was the hands-on demonstration of text editors like Vim, Nano and gedit, enabling students to edit files directly from the terminal. To wrap up the event, Shreyash introduced Bash scripting, showing how simple scripts can automate everyday tasks and improve productivity. To make the session even more engaging, a quiz was conducted, testing attendees on the key concepts covered. The quiz added a fun, competitive element to the overall learning experience.After a brief recap of the topics covered, the session concluded at 10:10 AM.', galleryImages: [img_06, img_07], domain: 'Web Development' },
        { name: 'Red Hat Enterprise Linux Automation with Ansible (RH294)', imageUrl: red_hat, posterUrl: img_08, date: '9th August, 2024', time: '', brief:'The August 09, 2024 seminar briefed the importance of Automation with Ansible and focusing on RH294 course from Red Hat Academy.Speaker Mr. Ravindra Patil, took off the presentation with an introduction to Red Hat Academy, highlighting it’s 30-year experience in open-source projects, it’s commitment to diverse collaboration, transparency, and innovation. Mr. Patil emphasized on Red Hat Academy (RHA) platform showcasing it’s centralized, flexible environment that allows students to connect with over 150,000 open-source users, offering them job opportunities based on the location, skills, and RHA certifications.Mr. Patil continued presentation discussing the overview about Ansible Automation, he shared how powerful tool Ansible is for automating tasks across multiple servers, increasing the time efficiency and reducing the human error. The platform is human-readable, supports cross-platform management (including Ubuntu, Windows, AWS), and is agentless, making it easy to manage without additional software on managed nodes. Then he shared the working of Ansible, Ansible operates through a Control Node, where tasks are organized in an inventory and playbook, then executed across managed hosts via SSH. Briefing about the Course RH294 Mr. Patil shared, through this course you will gain the skills to automate your workflows, build the foundation for DevOps practices, and learn how to leverage Ansible Automation Platform for developmental efficiencies. This course prepares you for Red Hat Certified Engineer Exam (EX294). The certification is available at a discount for RHA students (50% off) and RHA instructors (75% off). Discussing about job prospects, upon completion of the course, students can pursue roles such as Automation Administrator or specialize in Linux with Ansible, leveraging their new skills to meet job market demands.', galleryImages: [img_09, img_10, img_11], domain: 'Design' },
        { name: 'Red Hat Enterprise Linux System Administration & Career prospects', imageUrl: red_hat_career, posterUrl: img_12, date: '28th Feburary, 2025', time: '', brief: 'The February 28th, 2025  seminar provided insights into Red Hat Enterprise Linux (RHEL) system administration, highlighting its significance in enterprise IT and career opportunities. The session focused on Red Hat certifications, and practical skills essential for industry rolesThe speaker, Vaibhav Pagar, began the session with an introduction to Red Hat Enterprise Linux (RHEL) and its significance in enterprise IT environments. He explained the fundamentals of Linux system administration and its role in modern cloud infrastructure, security, and automation. The session highlighted the benefits of learning RHEL and the structured approach Red Hat Academy offers to help students build expertise in Linux administration. The discussion covered key Red Hat certifications, including Red Hat System Administration I (RH124), Red Hat System Administration II (RH134), Red Hat Certified System Administrator (EX200), and Red Hat Certified Engineer (EX294). The speaker elaborated on how these certifications provide a step-by-step learning path for mastering Linux system administration and prepare students for industry roles. The session emphasized critical concepts in system administration such as user and access management, security configurations, network administration, and troubleshooting in Linux environments. Mr. Vaibhav explained the importance of these skills in managing enterprise systems efficiently and securely.The career opportunities in Linux and open-source technologies were also discussed in detail. The speaker highlighted the growing demand for professionals with expertise in Red Hat technologies and how RHEL certification can open doors to careers in DevOps, cloud computing, and enterprise IT. The session also included insights on how students can leverage Red Hat Academy resources to enhance their learning experience and prepare for certification exams.As the session wrapped up, the speaker shared valuable strategies to help students confidently tackle Red Hat certification exams. He provided practical tips on exam preparation, hands-on practice, and study techniques to boost their chances of success. To make the learning experience even more engaging, he also hosted an interactive Q&A session, where students got their doubts cleared and gained deeper insights into Linux system administration and certification pathways.', galleryImages: [ img_13, img_14], domain: 'Security' },
        { name: 'Introduction to Linux-Baisc and Bash Scripting', imageUrl: linux_bash , posterUrl: img_19, date: '13th August, 2025', time: '8:00 am to 9:00 am', brief:'The seminar on August 13, 2025, commenced at 8:00 AM and provided an insightful introduction to Linux, including its basics and bash scripting essentials, aimed at fostering understanding among students.Vinay Suryarao began by explaining what Linux is — an open-source operating system that powers a large variety of computing environments across the globe. They detailed Linuxs history, originating from its creation by Linus Torvalds in 1991, and the significance of its open-source nature which has led to many popular distributions, such as Ubuntu, Fedora, Debian, Kali Linux, and CentOS.The presenters described the Linux kernel as the core or brain of the system that manages hardware and software interaction. They further elaborated on the role of the shell, the command-line interface (CLI), which acts as a communication bridge between the user and the kernel, and introduced the Linux terminal as a text-based interface crucial for executing commands.The session covered Linux user management, explaining the different user types—root, system users, and regular users—and commands for creating, deleting, renaming users, and managing groups. This segment highlighted the importance of permissions and the security model Linux employs.Continuing further, Ismaeel Shaikh demonstrated commands for file management, showing how to create, organize, modify, and navigate files and directories using commands such as touch, mkdir, cd, ls, cp, mv, rm, and others—underscoring the file-centric nature of Linux.The participants were also introduced to process management, learning how to manage running applications via commands like ps, top, kill, and nice, enhancing their ability to monitor and control system processes efficiently.Memory management concepts were discussed too, emphasizing the management of RAM and disk resources critical for system performance. Commands such as free, du, cat /proc/meminfo, vmstat, and df were showcased as tools for monitoring system memory and storage.The presentation concluded with a Q&A session where students clarified doubts about Linux commands, scripting, and system administration.', galleryImages: [img_20, img_21, img_22], domain: 'Design' },
    ];
        
    const testimonials = [
        { videoUrl: '#', thumbnailUrl: 'https://placehold.co/600x400/60a5fa/ffffff?text=Riya', quote: 'The Docker workshop was fantastic! I learned so much in just a few hours. Highly recommended.', name: 'Riya Sharma' },
        { videoUrl: '#', thumbnailUrl: 'https://placehold.co/600x400/f97316/ffffff?text=Amit', quote: 'An amazing introduction to Kubernetes. The hands-on labs were the best part.', name: 'Amit Patel' },
        { videoUrl: '#', thumbnailUrl: 'https://placehold.co/600x400/10b981/ffffff?text=Sneha', quote: 'I finally understand CI/CD thanks to the Jenkins workshop. The instructor was clear and very helpful.', name: 'Sneha Verma' },
    ];

    const handleRegisterClick = (event) => {
        setSelectedEvent(event);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setSelectedEvent(null);
    };
   
    const handleViewMoreClick = (event) => {
        setViewingPastEvent(event);
    };

    const handleBackToList = () => {
        setViewingPastEvent(null);
    };
   
    const handleTempFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilters(prev => ({ ...prev, [name]: value }));
    };
   
    const applyFilters = () => {
        setAppliedFilters(tempFilters);
    };
   
    const clearFilters = () => {
        setTempFilters(initialFilterState);
        setAppliedFilters(initialFilterState);
    };

    const allEvents = [...upcomingEvents, ...pastEvents];
    const uniqueYears = [...new Set(allEvents.map(e => e.date.split(', ')[1]).filter(Boolean))].sort((a, b) => b - a);
    const uniqueDomains = [...new Set(allEvents.map(e => e.domain).filter(Boolean))].sort();
    const allEventNames = [...new Set(allEvents.map(e => e.name))].sort();

    const filterEvents = (events) => {
        return events.filter(event => {
            const searchMatch = appliedFilters.search ? event.name.toLowerCase().includes(appliedFilters.search.toLowerCase()) : true;
            const eventNameMatch = appliedFilters.eventName ? event.name === appliedFilters.eventName : true;
            const domainMatch = appliedFilters.domain ? event.domain === appliedFilters.domain : true;
            const yearMatch = appliedFilters.year ? event.date.includes(appliedFilters.year) : true;
            const dateMatch = appliedFilters.date ? (() => {
                try {
                    const eventDate = new Date(event.date);
                    const filterDate = new Date(appliedFilters.date + 'T00:00:00');
                    return eventDate.getFullYear() === filterDate.getFullYear() &&
                           eventDate.getMonth() === filterDate.getMonth() &&
                           eventDate.getDate() === filterDate.getDate();
                // eslint-disable-next-line no-unused-vars
                } catch(e) { return false; }
            })() : true;

            return searchMatch && domainMatch && yearMatch && dateMatch && eventNameMatch;
        });
    }

    const filteredUpcomingEvents = filterEvents(upcomingEvents);
    const filteredPastEvents = filterEvents(pastEvents);

    const renderContent = () => {
        if (viewingPastEvent) {
            return <PastEventDetail event={viewingPastEvent} onBack={handleBackToList} />;
        }
        return (
            <MainEventsView
                tempFilters={tempFilters}
                onTempFilterChange={handleTempFilterChange}
                onApply={applyFilters}
                onClear={clearFilters}
                years={uniqueYears}
                domains={uniqueDomains}
                allEventNames={allEventNames}
                filteredUpcomingEvents={filteredUpcomingEvents}
                filteredPastEvents={filteredPastEvents}
                onRegister={handleRegisterClick}
                onViewMore={handleViewMoreClick}
                testimonials={testimonials}
            />
        );
    };

    return (
        <>
            <CustomStyles />
            <main className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-24 overflow-hidden bg-slate-100 font-sans">
                <div className="absolute inset-0 z-0">
                    <NetworkBackground />
                </div>
               
                {renderContent()}

            </main>
            {isFormOpen && <RegistrationForm event={selectedEvent} allEvents={upcomingEvents} onClose={handleCloseForm} />}
        </>
    );
};