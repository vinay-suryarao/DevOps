/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  Instagram,
  MapPin,
  Send,
  Loader,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

// --- Background Component (Replaced) ---
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


// Custom hook to detect if an element is in view
const useInView = (options) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return [ref, isInView];
};

// --- Reusable Animated Components ---

const AnimatedSection = ({ children, delay = 0 }) => {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};

const ContactCard = ({ icon, title, text, href, isExternal = false, delay = 0 }) => {
  const [ref, isInView] = useInView({ threshold: 0.5, triggerOnce: true });

  return (
    <motion.a
      ref={ref}
      href={href}
      target={isExternal ? "_blank" : "_self"}
      rel={isExternal ? "noopener noreferrer" : ""}
      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="bg-slate-100 p-4 rounded-full mb-4 transition-colors duration-300 group-hover:bg-[#113F67]">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-[#113F67] mb-1">{title}</h3>
      <p className="text-slate-500 text-sm group-hover:text-[#113F67] transition-colors">{text}</p>
    </motion.a>
  );
};


const FloatingLabelInput = ({ id, name, type = 'text', label, value, onChange, required, error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`w-full px-4 py-3 mt-2 text-[#113F67] bg-slate-50 rounded-xl border-2 transition-colors duration-300
                ${error ? 'border-red-500' : 'border-slate-300 focus:border-[#113F67]'}
                focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-[#113F67]/50'}`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-300 pointer-events-none
                ${isFocused || hasValue ? 'top-0 text-xs text-[#113F67]' : 'top-5 text-base text-slate-400'}`}
      >
        {label}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs text-red-600 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Connect Component ---

const Connect = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const SCRIPT_URL = import.meta.env.VITE_CONNECT_FORM_SCRIPT_URL;

  const contactDetails = {
    email: 'devopsclub@apsit.edu.in',
    whatsapp: 'https://chat.whatsapp.com/KuhAdgzCJn9EOxNmuBofne?mode=r_t',
    instagram: 'devopsclub_apsit',
    address: 'Thane, Ghodbunder Road, Kasarvadavali',
    mapsLink: 'http://googleusercontent.com/maps.google.com/3' // Example link
  };

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName) tempErrors.firstName = "First name is required.";
    if (!formData.lastName) tempErrors.lastName = "Last name is required.";
    if (!formData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is not valid.";
    }
    if (!formData.message) tempErrors.message = "Message is required.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmissionStatus('submitting');
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    fetch(SCRIPT_URL, {
      method: 'POST',
      body: data
    })
      .then(res => {
        if (res.ok || res.type === 'opaque') {
            return { result: 'success' };
        }
        throw new Error('Network response was not ok.');
      })
      .then(() => {
        setSubmissionStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setTimeout(() => setSubmissionStatus(null), 5000);
      })
      .catch(() => {
        setSubmissionStatus('error');
        setTimeout(() => setSubmissionStatus(null), 5000);
      });
  };

  return (
    <div className="relative font-sans min-h-screen overflow-x-hidden">
      <NetworkBackground />

      {/* ### START OF HERO SECTION CHANGES ### */}
      {/* h-[50vh] ko hata kar py-* (padding) use kiya hai */}
      <div className="relative flex items-center justify-center text-center py-24 sm:py-32">
        <div className="relative px-6 max-w-4xl">
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold text-[#113F67] tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Connect With Us
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl text-slate-600 drop-shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            We're building the future of tech, together. Join the conversation.
          </motion.p>
        </div>
      </div>
      {/* ### END OF HERO SECTION CHANGES ### */}

      {/* ### START OF MAIN SECTION CHANGES ### */}
      {/* py-* (padding top/bottom) ko pb-* (padding bottom only) kiya hai */}
      <main className="relative max-w-7xl mx-auto pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left Column: Contact Information */}
          <AnimatedSection>
            <div>
              <h2 className="text-3xl font-extrabold text-[#113F67] mb-8">Get In Touch</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <ContactCard
                  icon={<Mail className="w-7 h-7 text-[#113F67] group-hover:text-white transition-colors" />}
                  title="Email Us"
                  text={contactDetails.email}
                  href={`mailto:${contactDetails.email}`}
                  delay={0.1}
                />
                <ContactCard
                  icon={<Phone className="w-7 h-7 text-green-700 group-hover:text-white transition-colors" />}
                  title="WhatsApp"
                  text="Join our group"
                  href={contactDetails.whatsapp}
                  isExternal={true}
                  delay={0.2}
                />
                <ContactCard
                  icon={<Instagram className="w-7 h-7 text-pink-700 group-hover:text-white transition-colors" />}
                  title="Instagram"
                  text={`@${contactDetails.instagram}`}
                  href={`https://instagram.com/${contactDetails.instagram}`}
                  isExternal={true}
                  delay={0.3}
                />
                <ContactCard
                  icon={<MapPin className="w-7 h-7 text-slate-600 group-hover:text-white transition-colors" />}
                  title="Our Location"
                  text={contactDetails.address}
                  href={contactDetails.mapsLink}
                  isExternal={true}
                  delay={0.4}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Right Column: Contact Form */}
          <AnimatedSection delay={0.2}>
            <div className="bg-white/80 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-extrabold text-[#113F67] mb-2">Send a Message</h2>
              <p className="text-slate-600 mb-10 text-lg">Have a specific question? Fill out the form below.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FloatingLabelInput id="firstName" name="firstName" label="First Name" value={formData.firstName} onChange={handleInputChange} required error={errors.firstName} />
                  <FloatingLabelInput id="lastName" name="lastName" label="Last Name" value={formData.lastName} onChange={handleInputChange} required error={errors.lastName} />
                </div>
                <FloatingLabelInput id="email" name="email" type="email" label="Email Address" value={formData.email} onChange={handleInputChange} required error={errors.email} />
                <div>
                  <label htmlFor="message" className="sr-only">Message</label>
                  <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleInputChange} required
                    className={`w-full px-4 py-3 mt-2 text-[#113F67] bg-slate-50 rounded-xl border-2 transition-colors duration-300 resize-none
                            ${errors.message ? 'border-red-500' : 'border-slate-300 focus:border-[#113F67]'}
                            focus:outline-none focus:ring-2 ${errors.message ? 'focus:ring-red-400' : 'focus:ring-[#113F67]/50'}`}
                    placeholder="Write your message here..."
                  ></textarea>
                  {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                </div>
                
                <motion.button
                  type="submit"
                  disabled={submissionStatus === 'submitting'}
                  className="w-full flex justify-center items-center gap-3 py-3 rounded-xl text-[#113F67] font-semibold border-2 border-[#113F67] transition-colors duration-300 hover:bg-[#113F67]/10 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#113F67]/40"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {submissionStatus === 'submitting' ? (
                      <motion.div key="loader" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><Loader className="animate-spin w-6 h-6" /></motion.div>
                    ) : (
                      <motion.div key="icon" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><Send className="w-6 h-6" /></motion.div>
                    )}
                  </AnimatePresence>
                  <span>
                    {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {submissionStatus === 'success' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 text-green-700 bg-green-100 p-4 rounded-xl shadow">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-medium">Message sent! We'll be in touch soon.</span>
                    </motion.div>
                  )}
                  {submissionStatus === 'error' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-3 text-red-700 bg-red-100 p-4 rounded-xl shadow">
                      <AlertTriangle className="w-6 h-6" />
                      <span className="font-medium">Something went wrong. Please try again.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </AnimatedSection>
        </div>
      </main>
      {/* ### END OF MAIN SECTION CHANGES ### */}
    </div>
  );
};

export default Connect;