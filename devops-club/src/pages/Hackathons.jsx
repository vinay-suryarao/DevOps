import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebaseConfig';

const googleScriptUrl = import.meta.env.VITE_HACKATHON_REGISTRATION_SCRIPT_URL;

// --- BACKGROUND COMPONENT (Updated to accept a ref) ---
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

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegFormOpen, setRegFormOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  // 1. Create a ref for the main container
  const pageWrapperRef = useRef(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'hackathons'), where("isEnabled", "==", true), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        setHackathons(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Error fetching hackathons: ", error);
      }
      setLoading(false);
    };
    fetchHackathons();
  }, []);

  const handleApplyClick = (hackathon) => {
    setSelectedHackathon(hackathon);
    setRegFormOpen(true);
  };

  if (loading) return <div className="text-center py-20 text-xl text-slate-600">Loading Hackathons...</div>;

  return (
    // 2. Attach the ref to the main div
    <div ref={pageWrapperRef} className="relative bg-slate-100 min-h-screen font-sans">
      
      {/* 3. Pass the ref to the NetworkBackground component */}
      <div className="absolute inset-0 z-0"><NetworkBackground containerRef={pageWrapperRef} /></div>
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-slate-800">Upcoming Hackathons</h1>
          <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">Join us for exciting challenges, learning opportunities, and amazing prizes.</p>
        </div>

        {hackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hackathons.map((hackathon) => (
              <div key={hackathon.id} className="bg-white rounded-xl shadow-lg flex flex-col transition-transform hover:scale-105 duration-300">
                <div className="p-6 flex-grow">
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">{hackathon.name}</h2>
                  <p className="text-gray-600 mb-4 whitespace-pre-wrap">{hackathon.description}</p>
                  <p className="text-sm text-slate-500">
                    <strong>Date:</strong> {new Date(hackathon.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    <strong>Team Size:</strong> {hackathon.teamSize || 'N/A'} Members
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-xl">
                  <button onClick={() => handleApplyClick(hackathon)} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-10">No hackathons scheduled right now. Check back soon!</p>
        )}
      </div>

      {isRegFormOpen && <RegistrationModal hackathon={selectedHackathon} onClose={() => setRegFormOpen(false)} />}
    </div>
  );
}

// --- Registration Modal Component (No changes needed here) ---
const RegistrationModal = ({ hackathon, onClose }) => {
  const teamSize = hackathon.teamSize || 4;
  const createInitialState = () => Array.from({ length: teamSize }, () => ({ name: '', college: '', email: '', contactNumber: '' }));

  const [members, setMembers] = useState(createInitialState());
  const [regStatus, setRegStatus] = useState({ submitting: false, message: '' });

  const handleMemberChange = (index, e) => {
    const updatedMembers = [...members];
    updatedMembers[index][e.target.name] = e.target.value;
    setMembers(updatedMembers);
  };

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegStatus({ submitting: true, message: 'Checking your registration status...' });

    const allEmails = members.map(m => m.email.trim()).filter(email => email !== '');
    if (allEmails.length === 0) {
        setRegStatus({ submitting: false, message: 'Please enter at least one email.' });
        return;
    }

    try {
      const checkUrl = `${googleScriptUrl}?emails=${encodeURIComponent(allEmails.join(','))}&hackathonName=${encodeURIComponent(hackathon.name)}`;
      
      const checkResponse = await fetch(checkUrl);
      const checkResult = await checkResponse.json();

      if (checkResult.result === 'success' && checkResult.isRegistered) {
        setRegStatus({ submitting: false, message: `An email you entered is already registered for this hackathon.` });
        return; 
      }
      
      if (checkResult.result !== 'success') {
        throw new Error(checkResult.message || "Could not verify registration status.");
      }

    } catch (error) {
      setRegStatus({ submitting: false, message: `Verification Error: ${error.message}` });
      return;
    }

    setRegStatus({ submitting: true, message: 'Registering...' });
    
    const dataToSubmit = { hackathonName: hackathon.name };
    members.forEach((member, index) => {
        const prefix = index === 0 ? 'Leader' : `Member${index + 1}`;
        dataToSubmit[`${prefix}Name`] = member.name;
        dataToSubmit[`${prefix}College`] = member.college;
        dataToSubmit[`${prefix}Email`] = member.email;
        dataToSubmit[`${prefix}ContactNumber`] = member.contactNumber;
    });

    try {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        redirect: 'follow',
        body: JSON.stringify(dataToSubmit),
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      });
      
      const result = await response.json();
      if (result.result === 'success') {
        setRegStatus({ submitting: false, message: 'Registration successful!' });
        setTimeout(() => { onClose(); }, 3000);
      } else {
        throw new Error(result.message || 'An unknown error occurred during registration.');
      }
    } catch (error) {
      setRegStatus({ submitting: false, message: `Error: ${error.message}` });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} disabled={regStatus.submitting} className="absolute top-3 right-5 text-gray-400 hover:text-gray-700 text-3xl disabled:cursor-not-allowed">&times;</button>
        <h2 className="text-2xl font-bold mb-2">Register for {hackathon.name}</h2>
        <p className="mb-6 text-gray-500">Please fill in details for all {teamSize} members.</p>
        
        {regStatus.message && (
          <div className={`p-3 my-4 rounded-md text-center ${regStatus.message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {regStatus.message}
          </div>
        )}
        
        {!regStatus.message.includes('successful') && (
          <form onSubmit={handleRegSubmit} className="space-y-6">
            {members.map((member, index) => (
              <div key={index} className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-bold text-lg mb-3 text-slate-700">{index === 0 ? 'Team Leader' : `Member ${index + 1}`}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" name="name" placeholder="Full Name" value={member.name} onChange={(e) => handleMemberChange(index, e)} className="w-full p-3 border border-slate-300 rounded-lg" required />
                  <input type="text" name="college" placeholder="College Name" value={member.college} onChange={(e) => handleMemberChange(index, e)} className="w-full p-3 border border-slate-300 rounded-lg" required />
                  <input type="email" name="email" placeholder="Email ID" value={member.email} onChange={(e) => handleMemberChange(index, e)} className="w-full p-3 border border-slate-300 rounded-lg" required />
                  <input type="tel" name="contactNumber" placeholder="Contact Number" value={member.contactNumber} onChange={(e) => handleMemberChange(index, e)} className="w-full p-3 border border-slate-300 rounded-lg" required />
                </div>
              </div>
            ))}
            <button type="submit" disabled={regStatus.submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-700 transition-colors">
              {regStatus.submitting ? 'Please wait...' : 'Submit Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};