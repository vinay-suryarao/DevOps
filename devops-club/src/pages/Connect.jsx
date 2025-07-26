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
  ChevronLeft,
  ChevronRight,
  Users,
  MessageSquare,
  Terminal
} from 'lucide-react';

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

const ContactItem = ({ icon, title, text, href, isExternal = false }) => {
    const [ref, isInView] = useInView({ threshold: 0.5, triggerOnce: true });
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 2000);
    };

    return (
        <motion.a
            ref={ref}
            href={href}
            target={isExternal ? "_blank" : "_self"}
            rel={isExternal ? "noopener noreferrer" : ""}
            onClick={handleClick}
            className="flex items-center space-x-4 group transition-all duration-300"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isInView ? 1 : 0, x: isInView ? 0 : -50 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
        >
            <motion.div
                className="p-3 rounded-full group-hover:bg-[#113F67] transition-colors duration-300 shadow-md"
                style={{ backgroundColor: '#E0E7FF' }}
                whileHover={{ scale: 1.2, rotate: 15 }}
            >
                {icon}
            </motion.div>
            <div>
                <p className="font-semibold text-[#113F67]">{title}</p>
                <p className="text-[#113F67]/90 group-hover:underline">{text}</p>
                 <AnimatePresence>
                    {isClicked && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-sm text-green-600 font-medium mt-1"
                        >
                            Opening...
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
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

const CodeSnippetCarousel = () => {
    const snippets = [
        { title: 'Docker Start', code: 'docker run -d -p 80:80 my-app' },
        { title: 'K8s Pods', code: 'kubectl get pods --all-namespaces' },
        { title: 'Git Push', code: 'git push origin main' },
        { title: 'CI/CD Pipeline (YAML)', code: 'jobs:\n  - build:\n    steps:\n      - run: npm install\n      - run: npm test' },
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % snippets.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [snippets.length]);

    const goNext = () => setIndex((index + 1) % snippets.length);
    const goPrev = () => setIndex((index - 1 + snippets.length) % snippets.length);

    return (
        <AnimatedSection>
            <div className="bg-slate-800 rounded-2xl p-6 my-12 shadow-2xl relative overflow-hidden">
                <div className="flex items-center mb-4">
                    <Terminal className="w-6 h-6 text-green-400 mr-3" />
                    <h3 className="text-xl font-bold text-slate-100">DevOps Snippets</h3>
                </div>
                <div className="relative h-32">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className="absolute w-full"
                        >
                            <p className="text-green-400 font-semibold mb-2">{snippets[index].title}</p>
                            <pre className="text-slate-300 bg-slate-900 p-4 rounded-lg text-sm whitespace-pre-wrap">
                                <code>{snippets[index].code}</code>
                            </pre>
                        </motion.div>
                    </AnimatePresence>
                </div>
                 <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-slate-700/50 p-1 rounded-full text-white hover:bg-slate-600 transition-colors"><ChevronLeft size={20}/></button>
                 <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700/50 p-1 rounded-full text-white hover:bg-slate-600 transition-colors"><ChevronRight size={20}/></button>
            </div>
        </AnimatedSection>
    );
};

const TeamMemberCard = ({ name, role, avatarUrl, delay }) => {
    const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });
    return (
        <motion.div
            ref={ref}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 0.8 }}
            transition={{ duration: 0.5, delay }}
            whileHover={{ y: -10, boxShadow: "0px 20px 30px rgba(0,0,0,0.1)" }}
        >
            <img src={avatarUrl} alt={name} className="w-24 h-24 mx-auto rounded-full shadow-lg border-4 border-white" />
            <h4 className="mt-4 text-lg font-semibold text-[#113F67]">{name}</h4>
            <p className="text-sm text-[#113F67]/80">{role}</p>
        </motion.div>
    );
};

const TestimonialCard = ({ text, author, delay }) => {
    const [ref, isInView] = useInView({ threshold: 0.2, triggerOnce: true });
    return (
        <motion.div
            ref={ref}
            className="bg-white p-6 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 50 }}
            transition={{ duration: 0.5, delay }}
        >
            <p className="text-slate-600 italic">"{text}"</p>
            <p className="mt-4 text-right font-semibold text-[#113F67]">- {author}</p>
        </motion.div>
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

  const SCRIPT_URL =
    'https://script.google.com/macros/s/AKfycbzSb5z4aNH2DjGZoyJcJoAM9quuf7UDJKLfI9HPnxypnL43fC9DpZo-LcFgbjJ_M3Nr9g/exec';

  const contactDetails = {
    email: 'suryaraovinay@email.com',
    whatsapp: 'https://chat.whatsapp.com/KuhAdgzCJn9EOxNmuBofne?mode=r_t', // Add your WhatsApp number here
    instagram: 'YOUR_HANDLE',
    address: 'Thane, Godbundar road, Kasarwadavli'
  };
  
  const teamMembers = [
      { name: 'Shreyash Narvekar', role: 'President', avatarUrl: 'https://placehold.co/150x150/E0E7FF/113F67?text=SN' },
      { name: 'Vinay Suryarao', role: 'VP of Tech', avatarUrl: 'https://placehold.co/150x150/D1FAE5/065F46?text=VS' },
      { name: 'Ishita Singh', role: 'Events Lead', avatarUrl: 'https://placehold.co/150x150/FEF3C7/92400E?text=IS' },
      { name: 'ismaeel shaikh', role: 'Marketing Head', avatarUrl: '/photo.jpg' },
  ];
  
  const testimonials = [
      { text: "The DevOps club workshops are top-notch! I learned so much about Docker and K8s.", author: "Club Member" },
      { text: "A fantastic community. Everyone is so welcoming and eager to share knowledge.", author: "Newbie Coder" },
  ];

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
        validate();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmissionStatus('submitting');
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === 'success') {
          setSubmissionStatus('success');
          setFormData({ firstName: '', lastName: '', email: '', message: '' });
          setTimeout(() => setSubmissionStatus(null), 5000);
        } else {
          setSubmissionStatus('error');
        }
      })
      .catch(() => {
        setSubmissionStatus('error');
      });
  };

  return (
    <div className="bg-slate-100 font-sans min-h-screen overflow-x-hidden">
      {/* --- Banner Section --- */}
      <div className="relative h-[60vh] md:h-[80vh] flex items-center justify-start text-left overflow-hidden">
        <motion.div
            className="absolute inset-0 w-full h-full"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        >
            <img
              src="https://t4.ftcdn.net/jpg/02/69/27/55/360_F_269275503_fL3Dx8hgvCDgrnuvbm8XLPHJ461QIM4o.jpg"
              alt="DevOps Club members collaborating in a modern workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#113F67]/80 via-[#113F67]/50 to-transparent"></div>
        </motion.div>

        <div className="relative px-6 max-w-4xl">
          <motion.h1
            className="text-4xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Connect With Us
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl text-slate-200 drop-shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            We're building the future of tech, together. Join the conversation.
          </motion.p>
        </div>
      </div>

      {/* --- Main Content Section --- */}
      <main className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        {/* UPDATED: Changed grid to lg:grid-cols-2 for a 50/50 split on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Contact Information */}
          <AnimatedSection>
            {/* REMOVED: lg:col-span-1 to allow natural grid flow */}
            <div className="space-y-10">
                <h2 className="text-3xl font-extrabold text-[#113F67] mb-4">Get In Touch</h2>
                <div className="space-y-8 mt-8">
                    <ContactItem
                        icon={<Mail className="w-6 h-6 text-[#113F67] group-hover:text-white transition-colors" />}
                        title="Email Us"
                        text={contactDetails.email}
                        href={`mailto:${contactDetails.email}`}
                    />
                    <ContactItem
                        icon={<Phone className="w-6 h-6 text-green-700 group-hover:text-white transition-colors" />}
                        title="WhatsApp"
                        text="Chat with us"
                        href={`https://chat.whatsapp.com/KuhAdgzCJn9EOxNmuBofne?mode=r_t}`}
                        isExternal={true}
                    />
                    <ContactItem
                        icon={<Instagram className="w-6 h-6 text-pink-700 group-hover:text-white transition-colors" />}
                        title="Instagram"
                        text={`@${contactDetails.instagram}`}
                        href={`https://instagram.com/${contactDetails.instagram}`}
                        isExternal={true}
                    />
                    <div className="flex items-start space-x-4">
                        <div className="bg-slate-200 p-3 rounded-full shadow-sm">
                            <MapPin className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-slate-900">Our Location</p>
                            <p className="text-slate-700">{contactDetails.address}</p>
                        </div>
                    </div>
                </div>
            </div>
          </AnimatedSection>

          {/* Right Column: Contact Form */}
          <AnimatedSection delay={0.2}>
            {/* REMOVED: lg:col-span-2 to allow natural grid flow */}
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl">
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
                    className="w-full flex justify-center items-center gap-3 py-4 rounded-xl text-white font-semibold bg-[#113F67] shadow-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-[#113F67]/40"
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(17, 63, 103, 0.4)" }}
                    whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {submissionStatus === 'submitting' ? (
                      <motion.div key="loader" initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}><Loader className="animate-spin w-6 h-6" /></motion.div>
                    ) : (
                      <motion.div key="icon" initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:10}}><Send className="w-6 h-6" /></motion.div>
                    )}
                  </AnimatePresence>
                  <span>
                    {submissionStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                  </span>
                </motion.button>
                
                <AnimatePresence>
                    {submissionStatus === 'success' && (
                        <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex items-center gap-3 text-green-700 bg-green-100 p-4 rounded-xl shadow">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-medium">Message sent! We'll be in touch soon.</span>
                        </motion.div>
                    )}
                    {submissionStatus === 'error' && (
                         <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex items-center gap-3 text-red-700 bg-red-100 p-4 rounded-xl shadow">
                            <AlertTriangle className="w-6 h-6" />
                            <span className="font-medium">Something went wrong. Please try again.</span>
                        </motion.div>
                    )}
                </AnimatePresence>
              </form>
            </div>
          </AnimatedSection>
        </div>
        
        {/* --- Code Snippet Section --- */}
        <CodeSnippetCarousel />

        {/* --- Meet The Team Section --- */}
        <AnimatedSection>
            <div className="mt-24 text-center">
                <h2 className="text-3xl font-extrabold text-[#113F67] inline-flex items-center gap-3"><Users/> Meet the Team</h2>
                <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">The core members driving our community forward.</p>
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {teamMembers.map((member, i) => (
                        <TeamMemberCard key={member.name} {...member} delay={i * 0.15} />
                    ))}
                </div>
            </div>
        </AnimatedSection>
        
        {/* --- Testimonials Section --- */}
        <AnimatedSection>
            <div className="mt-24">
                <h2 className="text-3xl font-extrabold text-[#113F67] text-center inline-flex items-center gap-3 mx-auto w-full justify-center"><MessageSquare/> What Our Members Say</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {testimonials.map((testimonial, i) => (
                        <TestimonialCard key={i} {...testimonial} delay={i * 0.2} />
                    ))}
                </div>
            </div>
        </AnimatedSection>

      </main>
    </div>
  );
};

export default Connect;
