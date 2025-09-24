import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, where } from "firebase/firestore";
import { db } from '../firebaseConfig';

const googleScriptUrl = import.meta.env.VITE_HACKATHON_REGISTRATION_SCRIPT_URL;

export default function Hackathons() {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRegFormOpen, setRegFormOpen] = useState(false);
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      setLoading(true);
      try {
        // Query to fetch only enabled hackathons
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
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
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
                   {/* Display Team Size */}
                  <p className="text-sm text-slate-500 mt-2">
                    <strong>Team Size:</strong> {hackathon.teamSize || 'N/A'} Members
                  </p>
                </div>
                <div className="p-6 bg-slate-50 rounded-b-xl">
                  {/* The button is already correctly checking isEnabled */}
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

// --- UPDATED Registration Modal Component ---
const RegistrationModal = ({ hackathon, onClose }) => {
  const teamSize = hackathon.teamSize || 4; // Default to 4 if not set
  
  // Create an initial state with an array of empty member objects
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

    // Get all emails from the form, filter out empty ones
    const allEmails = members.map(m => m.email.trim()).filter(email => email !== '');
    if (allEmails.length === 0) {
        setRegStatus({ submitting: false, message: 'Please enter at least one email.' });
        return;
    }

    // --- NEW VALIDATION LOGIC ---
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

    // --- NEW SUBMISSION LOGIC ---
    setRegStatus({ submitting: true, message: 'Registering...' });
    
    // Flatten the members array into a single object for the Google Script
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