/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from '../firebaseConfig'; // Make sure this path is correct
// MODIFIED: Added UserCheck icon for the speaker
import { Calendar, Clock, MapPin, Globe, X, ArrowLeft, Download, Search, Filter, UserCheck } from 'lucide-react';

// --- Helper Components & Constants ---
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const IdCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
);
const departments = [
    "Select Your Department", "Information Technology", "Computer Engineering", "Data Science Engineering", "Mechanical Engineering", "Civil Engineering", "AI/ML Engineering"
];

// --- NEW: Advanced Filter Component (Simplified) ---
const FilterControls = ({ tempFilters, onTempFilterChange, onApply, onClear }) => {
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
            setIsFilterOpen(false);
        }
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto mb-12 z-30">
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
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow">
                        <Filter size={20} />
                    </button>
                    {isFilterOpen && (
                        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl p-4 z-20">
                            <h4 className="font-bold text-slate-800 mb-4 text-left">Filter Events</h4>
                            <div className="space-y-4">
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
                                <button onClick={handleApply} className="bg-blue-500 text-white font-bold py-2 px-5 rounded-full hover:bg-blue-600 transition-colors duration-300">Apply Filters</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- Custom Select Dropdown Component ---
const CustomSelect = ({ id, options, value, onChange }) => {
    // ... (component code is unchanged)
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    const handleSelect = (optionValue) => {
        onChange(id, optionValue);
        setIsOpen(false);
    };
    return (
        <div className="relative" ref={selectRef}><button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-3 text-left bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:outline-none transition-all duration-300 flex justify-between items-center"><span>{value}</span><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}><polyline points="6 9 12 15 18 9"></polyline></svg></button>{isOpen && (<ul className="absolute z-20 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-auto">{options.map(option => (<li key={option} onClick={() => handleSelect(option)} className="px-4 py-2 text-slate-800 hover:bg-slate-100 cursor-pointer">{option}</li>))}</ul>)}</div>
    );
};

// --- Feedback Form Section ---
const FeedbackFormSection = ({ dynamicEvents }) => {
    // ... (component code is unchanged)
    const [formData, setFormData] = useState({ name: '', email: '', moodleId: '', department: departments[0], event: dynamicEvents.length > 1 ? dynamicEvents[0] : "No upcoming events",  feedback: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [currentDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    const handleChange = (e) => { const { id, value } = e.target; setFormData(prev => ({ ...prev, [id]: value })); };
    const handleSelectChange = (id, value) => { setFormData(prev => ({ ...prev, [id]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); if (submitting || formData.event === "Select Event" || formData.department === "Select Your Department") { alert("Please select a valid event and department."); return; }; setSubmitting(true); setSubmissionStatus(null); const GOOGLE_SCRIPT_URL = import.meta.env.VITE_EVENTS_FEEDBACK_SCRIPT_URL; const dataToSubmit = new FormData(); dataToSubmit.append('Date', currentDate); dataToSubmit.append('Name', formData.name); dataToSubmit.append('Email', formData.email); dataToSubmit.append('MoodleID', formData.moodleId); dataToSubmit.append('Department', formData.department); dataToSubmit.append('Event', formData.event); dataToSubmit.append('Feedback', formData.feedback); fetch(GOOGLE_SCRIPT_URL, { method: 'POST', body: dataToSubmit }).then(res => res.json()).then(data => { if (data.result === 'success') { setSubmissionStatus('success'); setFormData({ name: '', email: '', moodleId: '', department: departments[0], event: dynamicEvents.length > 1 ? dynamicEvents[0] : "No upcoming events", feedback: '' }); } else { throw new Error(data.message || 'An unknown error occurred on the server.'); } }).catch(err => { console.error("Submission Error:", err); setSubmissionStatus('error'); }).finally(() => { setSubmitting(false); setTimeout(() => setSubmissionStatus(null), 5000); }); };
    return (<div className="w-full bg-white/95 border border-slate-200 rounded-2xl shadow-xl p-8 text-slate-800 z-10"><form onSubmit={handleSubmit} className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="relative"><UserIcon /><input type="text" id="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg" /></div><div className="relative"><MailIcon /><input type="email" id="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg" /></div></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="relative"><IdCardIcon /><input type="text" id="moodleId" placeholder="Moodle ID" value={formData.moodleId} onChange={handleChange} required className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg" /></div><CustomSelect id="department" options={departments} value={formData.department} onChange={handleSelectChange} /></div><CustomSelect id="event" options={dynamicEvents} value={formData.event} onChange={handleSelectChange} /><textarea id="feedback" placeholder="Share your detailed feedback..." value={formData.feedback} onChange={handleChange} required rows="5" className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg"></textarea><div className="text-center pt-4"><button type="submit" disabled={submitting} className="w-full md:w-auto font-bold text-lg text-white px-10 py-3 bg-slate-800 rounded-lg hover:bg-orange-500 disabled:bg-slate-400">{submitting ? 'Sending...' : 'Submit Feedback'}</button>{submissionStatus === 'success' && <p className="mt-4 text-green-600">✅ Success! Thank you for your feedback.</p>}{submissionStatus === 'error' && <p className="mt-4 text-red-600">❌ Error! Could not submit. Please try again.</p>}</div></form></div>);
};

// --- Registration Form ---
const RegistrationForm = ({ event, onClose }) => {
    // ... (component code is unchanged)
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ Event: event.name, FullName: '', Email: '', Phone: '', MoodleID: '', Semester: '', Branch: '', Division: '' });
    const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = async (e) => { e.preventDefault(); setIsSubmitting(true); const scriptURL = import.meta.env.VITE_EVENTS_REGISTRATION_SCRIPT_URL; const dataForSheet = new FormData(); for (const key in formData) { dataForSheet.append(key, formData[key]); } try { const response = await fetch(scriptURL, { method: 'POST', body: dataForSheet }); const result = await response.json(); if (result.result === 'success') { setIsSubmitted(true); } else { throw new Error(result.message || "An error occurred on the server."); } } catch (error) { console.error('Error submitting form:', error); alert(`An error occurred during registration: ${error.message}`); } finally { setIsSubmitting(false); } };
    return (<div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"><div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative"><button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><X size={24} /></button>{isSubmitted ? (<div className="text-center"><h3 className="text-2xl font-bold text-blue-600 mb-4">Registration Confirmed!</h3><p className="text-slate-600 mb-2">Thank you for registering for <span className="font-semibold">{event.name}</span>.</p><button onClick={onClose} className="mt-6 bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600">Close</button></div>) : (<><div className="p-3 bg-slate-100 rounded-lg text-center mb-6"><p className="text-sm text-slate-600">You are registering for:</p><p className="font-bold text-lg text-blue-600">{event.name}</p></div><form onSubmit={handleSubmit} className="space-y-4"><div><label className="text-sm font-medium text-slate-700">Full Name</label><input type="text" name="FullName" value={formData.FullName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" /></div><div><label className="text-sm font-medium text-slate-700">Email Address</label><input type="email" name="Email" value={formData.Email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" /></div><div><label className="text-sm font-medium text-slate-700">Phone Number</label><input type="tel" name="Phone" value={formData.Phone} onChange={handleInputChange} required pattern="[0-9]{10}" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" /></div><div><label className="text-sm font-medium text-slate-700">Moodle ID</label><input type="text" name="MoodleID" value={formData.MoodleID} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" /></div><div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><div><label className="text-sm font-medium text-slate-700">Semester</label><select name="Semester" value={formData.Semester} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"><option value="">Select</option>{[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}</select></div><div><label className="text-sm font-medium text-slate-700">Branch</label><select name="Branch" value={formData.Branch} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"><option value="">Select</option><option value="Computer">Computer</option><option value="IT">IT</option><option value="AIML">AIML</option><option value="Data Science">Data Science</option><option value="Mechanical">Mechanical</option><option value="Civil">Civil</option></select></div><div><label className="text-sm font-medium text-slate-700">Division</label><select name="Division" value={formData.Division} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md"><option value="">Select</option><option value="A">A</option><option value="B">B</option><option value="C">C</option></select></div></div><div className="text-right pt-4"><button type="submit" disabled={isSubmitting} className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 disabled:bg-slate-400">{isSubmitting ? 'Submitting...' : 'Submit Registration'}</button></div></form></>)}</div></div>);
};

// --- Child Components for Displaying Events ---
const EventCard = ({ event, onRegister }) => (
    // ... (component code is unchanged)
    <div className="bg-white rounded-2xl shadow-xl flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"><img src={event.posterUrl} alt={event.name} className="w-full h-48 object-cover rounded-t-2xl" onError={(e) => { e.target.src = 'https://placehold.co/600x400/2a3f54/f97316?text=Event'; }} /><div className="p-6 flex flex-col flex-grow"><h3 className="text-xl font-bold text-orange-500 mb-2">{event.name}</h3><div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-500"><p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-500" /> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>{event.time && <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" /> {event.time}</p>}<p className="flex items-center">{event.mode === 'Offline' ? <MapPin className="w-4 h-4 mr-2 text-blue-500" /> : <Globe className="w-4 h-4 mr-2 text-blue-500" />} {event.location}</p></div><div className="mt-auto pt-6 text-center"><button onClick={onRegister} className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg">Register Now</button></div></div></div>
);

const CompactPastEventCard = ({ event, onViewMore }) => (
    // ... (component code is unchanged)
    <div className="bg-slate-50 rounded-xl shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"><img src={event.cardImageUrl} alt={event.name} className="w-full h-40 object-cover" onError={(e) => { e.target.src = 'https://placehold.co/400x400/9ca3af/ffffff?text=Past+Event'; }} /><div className="p-4 flex flex-col flex-grow text-left w-full"><h3 className="font-bold text-md text-orange-500 mb-1 truncate">{event.name}</h3><p className="flex items-center text-xs text-slate-600 mb-4"><Calendar className="w-3 h-3 mr-1.5" /> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p><div className="mt-auto"><button onClick={onViewMore} className="w-full text-xs bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600">View More</button></div></div></div>
);

// MODIFICATION START: Added speaker name display to PastEventDetail
const PastEventDetail = ({ event, onBack }) => (
    <div className="relative z-10 container mx-auto px-4 w-full max-w-6xl">
        <button onClick={onBack} className="flex items-center text-blue-500 hover:text-blue-700 font-semibold mb-8">
            <ArrowLeft size={20} className="mr-2" /> Back to All Events
        </button>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <img src={event.posterUrl} alt={event.name} className="w-full h-64 md:h-96 object-cover" onError={(e) => { e.target.src = 'https://placehold.co/1200x800/2a3f54/ffffff?text=Event+Poster'; }}/>
            <div className="p-8 md:p-12">
                <h2 className="text-4xl font-extrabold text-[#2a3f54] mb-4">{event.name}</h2>
                
                {/* Container for event details */}
                <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 text-slate-500">
                    <p className="flex items-center">
                        <Calendar className="w-5 h-5 mr-3 text-slate-400" />
                        Held on {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    {event.time && (
                        <p className="flex items-center">
                            <Clock className="w-5 h-5 mr-3 text-slate-400" />
                            Time: {event.time}
                        </p>
                    )}
                    {/* NEW: Display Speaker Name if it exists */}
                    {event.speaker && (
                        <p className="flex items-center">
                            <UserCheck className="w-5 h-5 mr-3 text-slate-400" />
                            Speaker: <span className="font-medium text-slate-600 ml-1">{event.speaker}</span>
                        </p>
                    )}
                </div>

                <div className="prose max-w-none text-slate-700 mb-12">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Event Brief</h3>
                    <p className="text-justify whitespace-pre-wrap">{event.brief}</p>
                </div>

                {event.reportUrl && (
                    <div className="mb-12 text-center">
                        <a href={event.reportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 shadow-lg">
                            <Download size={20} /> Download Event Report
                        </a>
                    </div>
                )}
                
                {event.galleryImages && event.galleryImages.length > 0 && (
                    <div className="border-t border-slate-200 pt-12">
                        <h3 className="text-3xl font-bold text-center text-[#2a3f54] mb-8">Event Gallery</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {event.galleryImages.map((imgSrc, index) => 
                                <div key={index}>
                                    <img src={imgSrc} alt={`${event.name} gallery image ${index + 1}`} className="w-full h-56 object-cover rounded-lg shadow-md" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
// MODIFICATION END


// --- Main View Component ---
const MainEventsView = ({ upcomingEvents, pastEvents, onRegister, onViewMore, feedbackEvents, totalEventsCount, filteredEventsCount }) => (
    <>
        {totalEventsCount > 0 && filteredEventsCount === 0 && (
             <div className="mb-12 max-w-2xl mx-auto bg-yellow-100/80 border border-yellow-300 text-yellow-800 px-6 py-4 rounded-lg">
                 <p className="font-semibold">No events match your current filters. Try adjusting your search.</p>
             </div>
        )}

        <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-12">Upcoming Events & Workshops</h2>
        {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {upcomingEvents.map((event) => <EventCard key={event.id} event={event} onRegister={() => onRegister(event)} />)}
            </div>
        ) : (
            <p className="text-slate-500 bg-white/50 rounded-lg p-8">No upcoming events scheduled. Check back soon!</p>
        )}

        <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mt-24 mb-12">Past Events Gallery</h2>
        {pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {pastEvents.map((event) => <CompactPastEventCard key={event.id} event={event} onViewMore={() => onViewMore(event)} />)}
            </div>
        ) : (
             <p className="text-slate-500 bg-white/50 rounded-lg p-8">No past events to display.</p>
        )}

        <div className="mt-24 max-w-4xl mx-auto">
             <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-12">Share Your Valuable Feedback</h2>
            <FeedbackFormSection dynamicEvents={feedbackEvents} />
        </div>
    </>
);

// --- Parent Component that Fetches Data ---
export default function Events() {
    const [allEvents, setAllEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewingPastEvent, setViewingPastEvent] = useState(null);
    
    // MODIFIED: State management for new filter logic
    const initialFilters = { search: '', date: '' };
    const [activeFilters, setActiveFilters] = useState(initialFilters);
    const [tempFilters, setTempFilters] = useState(initialFilters);


    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                const q = query(collection(db, 'events'), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const eventsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAllEvents(eventsData);
            } catch (error) {
                console.error("Error fetching events: ", error);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (viewingPastEvent) {
            window.scrollTo(0, 0);
        }
    }, [viewingPastEvent]);
    
    // MODIFIED: Filtering logic now depends on `activeFilters`
    const filteredEvents = useMemo(() => {
        return allEvents.filter(event => {
            const nameMatch = event.name.toLowerCase().includes(activeFilters.search.toLowerCase());
            // Fix: Add timezone offset to match input date with Firestore date correctly
            const filterDate = activeFilters.date ? new Date(activeFilters.date) : null;
            if (filterDate) {
                const userTimezoneOffset = filterDate.getTimezoneOffset() * 60000;
                filterDate.setTime(filterDate.getTime() + userTimezoneOffset);
            }
            const dateMatch = !filterDate || (new Date(event.date).toDateString() === filterDate.toDateString());
            return nameMatch && dateMatch;
        });
    }, [allEvents, activeFilters]);

    // NEW: Handlers for the new filter component
    const handleTempFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        setActiveFilters(tempFilters);
    };

    const handleClearFilters = () => {
        setTempFilters(initialFilters);
        setActiveFilters(initialFilters);
    };

    const handleRegisterClick = (event) => { setSelectedEvent(event); setIsFormOpen(true); };
    const handleCloseForm = () => { setIsFormOpen(false); setSelectedEvent(null); };
    const handleViewMoreClick = (event) => { setViewingPastEvent(event); };
    const handleBackToList = () => { setViewingPastEvent(null); };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = filteredEvents.filter(e => e.type === 'upcoming' && new Date(e.date) >= today);
    const pastEvents = filteredEvents.filter(e => e.type === 'past' || (e.type === 'upcoming' && new Date(e.date) < today));
    const feedbackFormEventsList = ["Select Event", ...allEvents.filter(e => e.type === 'upcoming' && new Date(e.date) >= today).map(e => e.name)];

    const renderContent = () => {
        if (loading) {
            return <div className="text-center py-20 text-xl text-slate-600 z-10">Loading Events...</div>;
        }
        if (viewingPastEvent) {
            return <PastEventDetail event={viewingPastEvent} onBack={handleBackToList} />;
        }
        return (
            <div className="relative z-10 container mx-auto text-center px-4 sm:px-6 lg:px-8">
                {/* MODIFIED: Replaced old filter with the new one */}
                <FilterControls
                    tempFilters={tempFilters}
                    onTempFilterChange={handleTempFilterChange}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                />
                <MainEventsView
                    upcomingEvents={upcomingEvents}
                    pastEvents={pastEvents}
                    onRegister={handleRegisterClick}
                    onViewMore={handleViewMoreClick}
                    feedbackEvents={feedbackFormEventsList}
                    totalEventsCount={allEvents.length}
                    filteredEventsCount={filteredEvents.length}
                />
            </div>
        );
    };

    return (
        <>
            <CustomStyles />
            <main className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-24 overflow-hidden bg-slate-100 font-sans">
                <div className="absolute inset-0 z-0"><NetworkBackground /></div>
                {renderContent()}
            </main>
            {isFormOpen && <RegistrationForm event={selectedEvent} onClose={handleCloseForm} />}
        </>
    );
}

// --- GLOBAL STYLES & BACKGROUND ---
const CustomStyles = () => (
    <style>{`
      @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards; }
      @keyframes fade-in { 0% { opacity: 0; } 100% { opacity: 1; } }
      .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      @keyframes slide-down { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
      .animate-slide-down { animation: slide-down 0.3s ease-out forwards; }
    `}</style>
);

const NetworkBackground = () => {
    // ... (component code is unchanged)
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current; if (!canvas) return; const ctx = canvas.getContext('2d'); let animationFrameId; let particlesArray;
        const setCanvasDimensions = () => { const dpr = window.devicePixelRatio || 1; const rect = canvas.getBoundingClientRect(); canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; ctx.scale(dpr, dpr); };
        class Particle { constructor(x, y, directionX, directionY, size, color) { this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color; } draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill(); } update() { if (this.x > canvas.clientWidth + 100 || this.x < -100) this.directionX = -this.directionX; if (this.y > canvas.clientHeight + 100 || this.y < -100) this.directionY = -this.directionY; this.x += this.directionX; this.y += this.directionY; this.draw(); } }
        function init() { particlesArray = []; let numberOfParticles = (canvas.clientWidth * canvas.clientHeight) / 20000; const colors = ['#f97316', '#3b82f6']; for (let i = 0; i < numberOfParticles; i++) { let size = (Math.random() * 2.5) + 1.5; let x = (Math.random() * (canvas.clientWidth + 200)) - 100; let y = (Math.random() * (canvas.clientHeight + 200)) - 100; let directionX = (Math.random() * .3) - .15; let directionY = (Math.random() * .3) - .15; let color = colors[Math.floor(Math.random() * colors.length)]; particlesArray.push(new Particle(x, y, directionX, directionY, size, color)); } }
        function connect() { let opacityValue = 1; for (let a = 0; a < particlesArray.length; a++) { for (let b = a; b < particlesArray.length; b++) { let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2); if (distance < (canvas.clientWidth / 9) * (canvas.clientHeight / 9)) { opacityValue = 1 - (distance / 22000); ctx.strokeStyle = `rgba(42, 63, 84, ${opacityValue})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke(); } } } }
        function animate(timestamp) { if(!ctx || !particlesArray) return; ctx.clearRect(0, 0, canvas.width, canvas.height); const driftX = Math.sin(timestamp / 8000) * 50; const driftY = Math.cos(timestamp / 8000) * 30; ctx.save(); ctx.translate(driftX, driftY); particlesArray.forEach(p => p.update()); connect(); ctx.restore(); animationFrameId = window.requestAnimationFrame(animate); }
        setCanvasDimensions(); init(); animate(0);
        const handleResize = () => { window.cancelAnimationFrame(animationFrameId); setCanvasDimensions(); init(); animate(0); }; window.addEventListener('resize', handleResize);
        return () => { window.cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full bg-slate-100" style={{ display: 'block' }} />;
};