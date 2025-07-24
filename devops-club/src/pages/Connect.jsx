import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, Instagram, MapPin, Send, Loader, CheckCircle, AlertTriangle } from 'lucide-react';

// --- COMPONENT 1: The Animated Background Canvas ---
// This component creates a dynamic particle animation that runs in the background.
const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particlesArray;

        // Set canvas to fill the parent container
        const setCanvasDimensions = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        setCanvasDimensions();

        // Particle class
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

        // Create particle array
        function init() {
            particlesArray = [];
            // Adjusted number of particles for a cleaner look
            let numberOfParticles = (canvas.width * canvas.height) / 25000;
            // Updated color palette to match the new theme
            const colors = ['#4f46e5', '#64748b', '#3b82f6']; 
            
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * (canvas.width - size * 2));
                let y = (Math.random() * (canvas.height - size * 2));
                let directionX = (Math.random() * 0.4) - 0.2;
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = colors[Math.floor(Math.random() * colors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        // Draw lines connecting nearby particles
        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                                   ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    
                    // Adjust connection distance based on canvas size
                    if (distance < (canvas.width / 9) * (canvas.height / 9)) {
                        opacityValue = 1 - (distance / 20000);
                        // Use a subtle, semi-transparent line color
                        ctx.strokeStyle = `rgba(79, 70, 229, ${opacityValue * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
            animationFrameId = window.requestAnimationFrame(animate);
        }

        init();
        animate();

        // Resize event listener
        const handleResize = () => {
            setCanvasDimensions();
            init();
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-gray-50" />;
};


// --- COMPONENT 2: The Main Connect Page ---
// This component renders the page content on top of the animated background.
const App = () => {
  // --- STATE MANAGEMENT (Unchanged) ---
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // --- SCRIPT URL (Unchanged) ---
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzSb5z4aNH2DjGZoyJcJoAM9quuf7UDJKLfI9HPnxypnL43fC9DpZo-LcFgbjJ_M3Nr9g/exec";

  // --- CONTACT DETAILS (Unchanged) ---
  const contactDetails = {
    email: 'devopsclub@apsit.edu.in',
    whatsapp: '7972867869',
    instagram: 'devopsclub_apsit',
    address: 'APSIT Campus, Kasarvadavali, Thane, Maharashtra'
  };

  // --- HANDLERS (Unchanged) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmissionStatus('submitting');
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        setSubmissionStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setTimeout(() => setSubmissionStatus(null), 5000);
      } else {
        setSubmissionStatus('error');
      }
    })
    .catch(error => {
      console.error('Error submitting form:', error);
      setSubmissionStatus('error');
    });
  };

  // --- RENDER ---
  return (
    <div className="relative min-h-screen w-full font-sans overflow-x-hidden">
      {/* The animated background is placed here, absolutely positioned */}
      <AnimatedBackground />

      {/* All page content is placed in a relative container on top of the background */}
      <div className="relative z-10">
        {/* Banner Section with a background image */}
        <div 
          className="relative py-24 sm:py-32 flex items-center justify-center bg-cover bg-center"
          style={{ backgroundImage: `url(http://googleusercontent.com/file_content/1)` }}
        >
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Connect With Us
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto text-slate-200">
              We're excited to hear from you. Whether you have a question, a suggestion, or just want to say hello, we're here to help.
            </p>
          </div>
        </div>

        {/* Main Content Section */}
        <main className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Left Column: Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-3xl font-bold text-slate-800">Get In Touch</h2>
              <p className="text-slate-600">
                Reach out via any of our social channels or send us an email. We strive to respond within 24 hours.
              </p>
              <div className="space-y-6">
                <a href={`mailto:${contactDetails.email}`} className="flex items-center space-x-4 group">
                  <div className="bg-indigo-100 p-3 rounded-full group-hover:bg-indigo-600 transition-colors"><Mail className="w-6 h-6 text-indigo-600 group-hover:text-white" /></div>
                  <div><p className="font-semibold text-slate-700">Email Us</p><p className="text-indigo-600 group-hover:underline">{contactDetails.email}</p></div>
                </a>
                <a href={`https://wa.me/${contactDetails.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                  <div className="bg-green-100 p-3 rounded-full group-hover:bg-green-500 transition-colors"><Phone className="w-6 h-6 text-green-600 group-hover:text-white" /></div>
                  <div><p className="font-semibold text-slate-700">WhatsApp</p><p className="text-green-600 group-hover:underline">Chat with us</p></div>
                </a>
                <a href={`https://instagram.com/${contactDetails.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-4 group">
                  <div className="bg-pink-100 p-3 rounded-full group-hover:bg-pink-500 transition-colors"><Instagram className="w-6 h-6 text-pink-600 group-hover:text-white" /></div>
                  <div><p className="font-semibold text-slate-700">Instagram</p><p className="text-pink-600 group-hover:underline">@{contactDetails.instagram}</p></div>
                </a>
                {/* --- UPDATED LOCATION BLOCK --- */}
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactDetails.address)}`} target="_blank" rel="noopener noreferrer" className="flex items-start space-x-4 group">
                    <div className="bg-gray-200 p-3 rounded-full group-hover:bg-gray-500 transition-colors">
                        <MapPin className="w-6 h-6 text-gray-600 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-700">Our Location</p>
                        <p className="text-slate-600 group-hover:underline group-hover:text-indigo-600 transition-colors">
                            {contactDetails.address}
                        </p>
                    </div>
                </a>
              </div>
            </div>

            {/* Right Column: Contact Form with a "glassmorphism" effect */}
            <div className="lg:col-span-2 bg-white/70 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-200/80">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Send a Message</h2>
              <p className="text-slate-600 mb-8">Have a specific question? Fill out the form below.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                    <input type="text" name="firstName" id="firstName" value={formData.firstName} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                    <input type="text" name="lastName" id="lastName" value={formData.lastName} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                  <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>

                <div>
                  <button type="submit" disabled={submissionStatus === 'submitting'} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-[#2c3e50] hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                    {submissionStatus === 'submitting' && <Loader className="animate-spin w-6 h-6" />}
                    {submissionStatus !== 'submitting' && <Send className="w-6 h-6" />}
                    <span>{submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}</span>
                  </button>
                </div>
                
                {submissionStatus === 'success' && (
                  <div className="flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-md">
                    <CheckCircle /><span>Message sent successfully! We'll be in touch soon.</span>
                  </div>
                )}
                {submissionStatus === 'error' && (
                  <div className="flex items-center gap-2 text-red-700 bg-red-100 p-3 rounded-md">
                    <AlertTriangle /><span>Something went wrong. Please try again later.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
