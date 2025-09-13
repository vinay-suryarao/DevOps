import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Aapke central config se import

// ### CHANGE HERE: API URL ab .env file se aa raha hai ###
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
        const q = query(collection(db, 'hackathons'), orderBy('createdAt', 'desc'));
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
                </div>
                <div className="p-6 bg-slate-50 rounded-b-xl">
                  {/* CHANGED: Button ab 'isEnabled' field ke basis par dikhega */}
                  {hackathon.isEnabled === true ? (
                    <button onClick={() => handleApplyClick(hackathon)} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg">
                      Apply Now
                    </button>
                  ) : (
                    <button disabled className="w-full bg-slate-400 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                      Registrations Closed
                    </button>
                  )}
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

// Registration Modal Component
const RegistrationModal = ({ hackathon, onClose }) => {
  const [regFormData, setRegFormData] = useState({ name: '', college: '', email: '', contactNumber: '' });
  const [regStatus, setRegStatus] = useState({ submitting: false, message: '' });

  const handleRegFormChange = (e) => setRegFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleRegSubmit = async (e) => {
    e.preventDefault();
    setRegStatus({ submitting: true, message: '' });
    const dataToSubmit = { ...regFormData, hackathonName: hackathon.name };
    try {
      const response = await fetch(googleScriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(dataToSubmit),
      });
      const result = await response.json();
      if (result.result === 'success') {
        setRegStatus({ submitting: false, message: 'Registration successful!' });
        setTimeout(() => { onClose(); }, 3000);
      } else {
        throw new Error(result.message || 'Unknown error');
      }
    } catch (error) {
      setRegStatus({ submitting: false, message: `Error: ${error.message}` });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-3 right-5 text-gray-400 hover:text-gray-700 text-3xl">&times;</button>
        <h2 className="text-2xl font-bold mb-2">Register for {hackathon.name}</h2>
        <p className="mb-6 text-gray-500">Fill out the form to secure your spot.</p>
        {regStatus.message ? (
          <p className={`p-3 rounded-md text-center ${regStatus.message.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {regStatus.message}
          </p>
        ) : (
          <form onSubmit={handleRegSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Full Name" value={regFormData.name} onChange={handleRegFormChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
            <input type="text" name="college" placeholder="College Name" value={regFormData.college} onChange={handleRegFormChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
            <input type="email" name="email" placeholder="Email ID" value={regFormData.email} onChange={handleRegFormChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
            <input type="tel" name="contactNumber" placeholder="Contact Number" value={regFormData.contactNumber} onChange={handleRegFormChange} className="w-full p-3 border border-slate-300 rounded-lg" required />
            <button type="submit" disabled={regStatus.submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 hover:bg-blue-700 transition-colors">
              {regStatus.submitting ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};