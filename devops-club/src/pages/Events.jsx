/* eslint-disable no-irregular-whitespace */
/* eslint-disable no-unused-vars */
import { React, useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { getEventsListing, getEventById, registerForEvent, getCachedEventsListing } from '../db/neonService';
// Filter icon hata diya gaya hai
import { Calendar, Clock, MapPin, Globe, X, ArrowLeft, Download, Search, UserCheck } from 'lucide-react';

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

// --- Search Bar Component (Filter Hata Diya Gaya Hai) ---
const FilterControls = ({ tempFilters, onTempFilterChange, onApply, onFeedbackClick }) => {

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onApply();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mb-12 z-30 flex items-center justify-center gap-x-3 sm:gap-x-4">
            {/* Ab sirf search bar hai */}
            <div className="relative flex-grow">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <input
                    type="text"
                    id="search"
                    name="search"
                    placeholder="Search for events and press Enter..."
                    value={tempFilters.search}
                    onChange={onTempFilterChange}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full bg-white/90 rounded-full shadow-lg pl-12 pr-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Feedback button */}
            <button
                onClick={onFeedbackClick}
                className="flex-shrink-0 flex items-center justify-center px-5 h-[50px] bg-orange-500 text-white rounded-full font-semibold text-sm hover:bg-orange-600 transition-colors shadow-lg"
                title="Give Feedback"
            >
                Feedback
            </button>
        </div>
    );
};


// --- Custom Select Dropdown Component --- (No Changes)
const CustomSelect = ({ id, options, value, onChange }) => {
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

// --- Feedback Modal ---
const FeedbackModal = ({ dynamicEvents, onClose }) => {
    const defaultEvent = dynamicEvents.length > 1 ? dynamicEvents[1] : "Select Event";
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        moodleId: '', 
        department: departments[0], 
        event: defaultEvent,  
        feedback: '' 
    });
    const [submitting, setSubmitting] = useState(false);
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [statusMessage, setStatusMessage] = useState('');
    const [currentDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));

    const handleChange = (e) => { 
        const { id, value } = e.target; 
        setFormData(prev => ({ ...prev, [id]: value })); 
    };

    const handleSelectChange = (id, value) => { 
        setFormData(prev => ({ ...prev, [id]: value })); 
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        if (submitting) return;

        if (formData.event === "Select Event" || !formData.event) { 
            alert("Please select a specific event from the dropdown."); 
            return; 
        }
        if (formData.department === "Select Your Department" || !formData.department) { 
            alert("Please select your department."); 
            return; 
        }

        setSubmitting(true); 
        setSubmissionStatus(null);
        setStatusMessage('');

        const GOOGLE_SCRIPT_URL = import.meta.env.VITE_EVENTS_FEEDBACK_SCRIPT_URL;
        
        if (!GOOGLE_SCRIPT_URL) {
            setSubmitting(false);
            setSubmissionStatus('error');
            setStatusMessage('Feedback script URL is not configured. Please set VITE_EVENTS_FEEDBACK_SCRIPT_URL in .env.');
            return;
        }

        const dataToSubmit = new FormData(); 
        dataToSubmit.append('Date', currentDate); 
        dataToSubmit.append('Name', formData.name); 
        dataToSubmit.append('Email', formData.email); 
        dataToSubmit.append('MoodleID', formData.moodleId); 
        dataToSubmit.append('Department', formData.department); 
        dataToSubmit.append('Event', formData.event); 
        dataToSubmit.append('Feedback', formData.feedback); 

        try {
            const res = await fetch(GOOGLE_SCRIPT_URL, { 
                method: 'POST', 
                body: dataToSubmit 
            });

            if (!res.ok && res.status !== 0) {
                if (res.status === 401) {
                    throw new Error("HTTP 401: Google Apps Script requires 'Who has access: Anyone' in its deployment settings.");
                }
                throw new Error(`Server returned HTTP ${res.status}`);
            }

            const data = await res.json();
            if (data.result === 'success') { 
                setSubmissionStatus('success'); 
                setStatusMessage('Thank you! Your feedback has been recorded.');
                setFormData({ 
                    name: '', 
                    email: '', 
                    moodleId: '', 
                    department: departments[0], 
                    event: defaultEvent, 
                    feedback: '' 
                }); 
                setTimeout(() => { onClose(); }, 2000); 
            } else { 
                throw new Error(data.message || 'Unknown error returned by Apps Script.'); 
            }
        } catch (err) { 
            console.error("Feedback Submission Error:", err); 
            setSubmissionStatus('error'); 
            setStatusMessage(
                err.message?.includes('401') 
                    ? "Deployment authorization error: Google Apps Script must be deployed with 'Who has access: Anyone'."
                    : (err.message || 'Could not connect to Google Sheets. Please verify the Web App deployment.')
            );
        } finally { 
            setSubmitting(false); 
        } 
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors">
                    <X size={24} />
                </button>
                <h2 className="text-3xl font-extrabold text-[#2a3f54] text-center mb-6">Share Your Feedback</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <UserIcon />
                            <input 
                                type="text" 
                                id="name" 
                                placeholder="Your Name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            />
                        </div>
                        <div className="relative">
                            <MailIcon />
                            <input 
                                type="email" 
                                id="email" 
                                placeholder="Your Email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <IdCardIcon />
                            <input 
                                type="text" 
                                id="moodleId" 
                                placeholder="Moodle ID" 
                                value={formData.moodleId} 
                                onChange={handleChange} 
                                required 
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                            />
                        </div>
                        <CustomSelect id="department" options={departments} value={formData.department} onChange={handleSelectChange} />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1 text-left">Select Event</label>
                        <CustomSelect id="event" options={dynamicEvents} value={formData.event} onChange={handleSelectChange} />
                    </div>
                    <textarea 
                        id="feedback" 
                        placeholder="Share your detailed feedback..." 
                        value={formData.feedback} 
                        onChange={handleChange} 
                        required 
                        rows="5" 
                        className="w-full px-4 py-3 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    ></textarea>
                    
                    {submissionStatus === 'success' && (
                        <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm text-center">
                            ✅ {statusMessage || 'Success! Thank you for your feedback.'}
                        </div>
                    )}
                    {submissionStatus === 'error' && (
                        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm text-center">
                            ❌ {statusMessage || 'Error! Could not submit. Please check configuration.'}
                        </div>
                    )}

                    <div className="text-center pt-2">
                        <button 
                            type="submit" 
                            disabled={submitting} 
                            className="w-full md:w-auto font-bold text-lg text-white px-10 py-3 bg-slate-800 rounded-lg hover:bg-orange-500 transition-colors disabled:bg-slate-400 shadow-md"
                        >
                            {submitting ? 'Sending...' : 'Submit Feedback'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Registration Form with Neon DB & Google Sheets Dual-Save ---
const RegistrationForm = ({ event, onClose }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({ 
        Event: event.name, 
        FullName: '', 
        Email: '', 
        Phone: '', 
        MoodleID: '', 
        Semester: '', 
        Branch: '', 
        Division: '' 
    });

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        setFormData(prev => ({ ...prev, [name]: value })); 
    };

    const handleSubmit = async (e) => { 
        e.preventDefault(); 
        setIsSubmitting(true); 
        setErrorMessage('');

        try {
            // 1. Save directly to Neon PostgreSQL Database
            await registerForEvent({
                eventId: event.id,
                eventName: event.name,
                fullName: formData.FullName,
                email: formData.Email,
                phone: formData.Phone,
                moodleId: formData.MoodleID,
                semester: formData.Semester,
                branch: formData.Branch,
                division: formData.Division,
            });

            // 2. Also send to Google Apps Script webhook
            const scriptURL = import.meta.env.VITE_EVENTS_REGISTRATION_SCRIPT_URL;
            if (scriptURL) {
                const params = new URLSearchParams();
                for (const key in formData) { 
                    params.append(key, formData[key]); 
                }
                // Send with no-cors to prevent CORS/redirect errors from breaking the user experience
                try {
                    await fetch(scriptURL, { 
                        method: 'POST', 
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: params.toString() 
                    });
                } catch (sheetErr) {
                    console.warn('Google Sheets background sync notice:', sheetErr);
                }
            }

            setIsSubmitted(true);
        } catch (error) { 
            console.error('Error submitting registration:', error); 
            setErrorMessage(error.message || "An error occurred during registration. Please try again.");
            alert(`An error occurred during registration: ${error.message}`); 
        } finally { 
            setIsSubmitting(false); 
        } 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">
                    <X size={24} />
                </button>
                {isSubmitted ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                            ✓
                        </div>
                        <h3 className="text-2xl font-bold text-green-600 mb-2">Registration Confirmed!</h3>
                        <p className="text-slate-600 mb-2">Thank you for registering for <span className="font-semibold text-slate-800">{event.name}</span>.</p>
                        <p className="text-xs text-slate-400 mb-6">Your registration has been securely stored in the database.</p>
                        <button onClick={onClose} className="bg-blue-500 text-white font-bold py-2.5 px-8 rounded-full hover:bg-blue-600 transition-colors shadow-md">
                            Close
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="p-3 bg-slate-100 rounded-lg text-center mb-6">
                            <p className="text-sm text-slate-600">You are registering for:</p>
                            <p className="font-bold text-lg text-blue-600">{event.name}</p>
                        </div>
                        {errorMessage && (
                            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg mb-4 text-sm">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Full Name</label>
                                <input type="text" name="FullName" value={formData.FullName} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Email Address</label>
                                <input type="email" name="Email" value={formData.Email} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                <input type="tel" name="Phone" value={formData.Phone} onChange={handleInputChange} required pattern="[0-9]{10}" className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Moodle ID</label>
                                <input type="text" name="MoodleID" value={formData.MoodleID} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Semester</label>
                                    <select name="Semester" value={formData.Semester} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md">
                                        <option value="">Select</option>
                                        {[...Array(8).keys()].map(i => <option key={i+1} value={i+1}>{i+1}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Branch</label>
                                    <select name="Branch" value={formData.Branch} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md">
                                        <option value="">Select</option>
                                        <option value="Computer">Computer</option>
                                        <option value="IT">IT</option>
                                        <option value="AIML">AIML</option>
                                        <option value="Data Science">Data Science</option>
                                        <option value="Mechanical">Mechanical</option>
                                        <option value="Civil">Civil</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Division</label>
                                    <select name="Division" value={formData.Division} onChange={handleInputChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md">
                                        <option value="">Select</option>
                                        <option value="A">A</option>
                                        <option value="B">B</option>
                                        <option value="C">C</option>
                                    </select>
                                </div>
                            </div>
                            <div className="text-right pt-4">
                                <button type="submit" disabled={isSubmitting} className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 disabled:bg-slate-400">
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

// --- Child Components for Displaying Events --- (No Changes)
const EventCard = ({ event, onRegister }) => (
    <div className="bg-white rounded-2xl shadow-xl flex flex-col transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"><img src={event.posterUrl} alt={event.name} className="w-full h-48 object-cover rounded-t-2xl" loading="eager" decoding="async" onError={(e) => { e.target.src = 'https://placehold.co/600x400/2a3f54/f97316?text=Event'; }} /><div className="p-6 flex flex-col flex-grow"><h3 className="text-xl font-bold text-orange-500 mb-2">{event.name}</h3><div className="border-t border-slate-200 pt-4 space-y-2 text-sm text-slate-500"><p className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-blue-500" /> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>{event.time && <p className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" /> {event.time}</p>}<p className="flex items-center">{event.mode === 'Offline' ? <MapPin className="w-4 h-4 mr-2 text-blue-500" /> : <Globe className="w-4 h-4 mr-2 text-blue-500" />} {event.location}</p></div><div className="mt-auto pt-6 text-center"><button onClick={onRegister} className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-full hover:bg-blue-600 transition-colors duration-300 shadow-lg">Register Now</button></div></div></div>
);

const CompactPastEventCard = ({ event, onViewMore, onPrefetch }) => (
    <div 
        onMouseEnter={() => onPrefetch && onPrefetch(event.id)}
        className="bg-slate-50 rounded-xl shadow-lg flex flex-col transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
    >
        <img src={event.cardImageUrl} alt={event.name} className="w-full h-40 object-cover" loading="lazy" decoding="async" onError={(e) => { e.target.src = 'https://placehold.co/400x400/9ca3af/ffffff?text=Past+Event'; }} />
        <div className="p-4 flex flex-col flex-grow text-left w-full">
            <h3 className="font-bold text-md text-orange-500 mb-1 truncate">{event.name}</h3>
            <p className="flex items-center text-xs text-slate-600 mb-4"><Calendar className="w-3 h-3 mr-1.5" /> {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            <div className="mt-auto">
                <button 
                    onClick={onViewMore}
                    onMouseEnter={() => onPrefetch && onPrefetch(event.id)}
                    className="w-full text-xs bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors"
                >
                    View More
                </button>
            </div>
        </div>
    </div>
);

const PastEventDetail = ({ event, onBack, loadingGallery }) => {
    // Use posterUrl from full event, fall back to cardImageUrl from listing (available immediately)
    const heroSrc = event.posterUrl || event.cardImageUrl || '';
    return (
    <div className="relative z-10 container mx-auto px-4 w-full max-w-6xl animate-fade-in">
        <button onClick={onBack} className="flex items-center text-blue-500 hover:text-blue-700 font-semibold mb-8">
            <ArrowLeft size={20} className="mr-2" /> Back to All Events
        </button>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {heroSrc ? (
                <img 
                    src={heroSrc} 
                    alt={event.name} 
                    className="w-full h-64 md:h-96 object-cover" 
                    loading="eager"
                    decoding="async"
                    onError={(e) => { e.target.src = 'https://placehold.co/1200x800/2a3f54/ffffff?text=Event+Poster'; }}
                />
            ) : (
                <div className="w-full h-64 md:h-96 bg-slate-200 animate-pulse flex items-center justify-center">
                    <span className="text-slate-400 text-sm">Loading image...</span>
                </div>
            )}
            <div className="p-8 md:p-12">
                <h2 className="text-4xl font-extrabold text-[#2a3f54] mb-4">{event.name}</h2>
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
                    {event.speaker && (
                        <p className="flex items-center">
                            <UserCheck className="w-5 h-5 mr-3 text-slate-400" />
                            Speaker: <span className="font-medium text-slate-600 ml-1">{event.speaker}</span>
                        </p>
                    )}
                </div>
                <div className="prose max-w-none text-slate-700 mb-12">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">Event Highlights</h3>
                    <p className="text-justify whitespace-pre-wrap">{event.brief}</p>
                </div>
                {event.reportUrl && (
                    <div className="mb-12 text-center">
                        <a href={event.reportUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-600 text-white font-bold py-3 px-6 rounded-full hover:bg-green-700 shadow-lg">
                            <Download size={20} /> Download Event Report
                        </a>
                    </div>
                )}
                {loadingGallery ? (
                    <div className="border-t border-slate-200 pt-12">
                        <div className="flex items-center justify-center gap-3 mb-8">
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <h3 className="text-2xl font-bold text-[#2a3f54]">Loading Event Gallery...</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-full h-56 bg-slate-200 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                ) : event.galleryImages && event.galleryImages.length > 0 ? (
                    <div className="border-t border-slate-200 pt-12 animate-fade-in">
                        <h3 className="text-3xl font-bold text-center text-[#2a3f54] mb-8">Event Gallery</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {event.galleryImages.map((imgSrc, index) => 
                                <div key={index}>
                                    <img 
                                        src={imgSrc} 
                                        alt={`${event.name} gallery image ${index + 1}`} 
                                        className="w-full h-56 object-cover rounded-lg shadow-md hover:scale-[1.02] transition-transform duration-200" 
                                        loading={index < 3 ? 'eager' : 'lazy'}
                                        decoding="async"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    </div>
    );
};

// --- Main View Component --- (No Changes)
const MainEventsView = ({ upcomingEvents, pastEvents, onRegister, onViewMore, onPrefetch, totalEventsCount, filteredEventsCount }) => (
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
                {pastEvents.map((event) => (
                    <CompactPastEventCard 
                        key={event.id} 
                        event={event} 
                        onViewMore={() => onViewMore(event)} 
                        onPrefetch={onPrefetch}
                    />
                ))}
            </div>
        ) : (
             <p className="text-slate-500 bg-white/50 rounded-lg p-8">No past events to display.</p>
        )}
    </>
);

// --- Skeleton Placeholder Grid for Instant First Load ---
const EventsSkeletonView = () => (
    <div className="relative z-10 container mx-auto text-center px-4 sm:px-6 lg:px-8 animate-pulse">
        {/* Search Bar Skeleton */}
        <div className="w-full max-w-4xl mx-auto mb-12 flex items-center justify-center gap-x-3 sm:gap-x-4">
            <div className="h-[50px] bg-white/80 rounded-full flex-grow shadow-lg"></div>
            <div className="h-[50px] w-28 bg-orange-400/80 rounded-full shadow-lg"></div>
        </div>

        {/* Upcoming Header & Skeleton */}
        <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-12">Upcoming Events & Workshops</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
            {[1].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-xl overflow-hidden text-left flex flex-col">
                    <div className="w-full h-48 bg-slate-200"></div>
                    <div className="p-6 space-y-4">
                        <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-10 bg-slate-200 rounded-full w-36 mx-auto mt-6"></div>
                    </div>
                </div>
            ))}
        </div>

        {/* Past Events Header & Skeleton */}
        <h2 className="text-4xl font-extrabold text-[#2a3f54] drop-shadow-lg mb-12">Past Events Gallery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-slate-50 rounded-xl shadow-lg overflow-hidden flex flex-col">
                    <div className="w-full h-40 bg-slate-200"></div>
                    <div className="p-4 space-y-3">
                        <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-8 bg-slate-200 rounded-full w-full mt-4"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

// --- Parent Component ---
export default function Events() {
    // Initialize from sync cache so back-navigation shows events instantly (0ms)
    const cachedOnMount = getCachedEventsListing();
    const hasCache = cachedOnMount && cachedOnMount.length > 0;
    const [allEvents, setAllEvents] = useState(hasCache ? cachedOnMount : []);
    const [loading, setLoading] = useState(!hasCache);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [viewingPastEvent, setViewingPastEvent] = useState(null);
    const [isFeedbackFormOpen, setIsFeedbackFormOpen] = useState(false);
    
    const eventCache = useRef({});
    const [loadingGallery, setLoadingGallery] = useState(false);
    
    // Filter logic
    const initialFilters = { search: '' };
    const [activeFilters, setActiveFilters] = useState(initialFilters);
    const [tempFilters, setTempFilters] = useState(initialFilters);

    // Prefetch full event details (gallery) into in-memory cache
    const prefetchEvent = useCallback(async (id) => {
        if (!id || eventCache.current[id]) return eventCache.current[id];
        try {
            const fullEvent = await getEventById(id);
            if (fullEvent) {
                eventCache.current[id] = fullEvent;
            }
            return fullEvent;
        } catch (e) {
            console.warn('Prefetch failed for event', id, e);
            return null;
        }
    }, []);

    useEffect(() => {
        let isMounted = true;
        const fetchEvents = async () => {
            const cached = getCachedEventsListing();
            if (!cached || cached.length === 0) {
                setLoading(true);
            }
            try {
                // getEventsListing() checks memory & IndexedDB first, then network
                const eventsData = await getEventsListing();
                if (isMounted) {
                    setAllEvents(eventsData);
                    setLoading(false);
                }

                // Background prefetch all past event galleries so "View More" is instant
                const past = eventsData.filter(e => e.type === 'past');
                if (past.length > 0) {
                    setTimeout(() => {
                        past.forEach(p => prefetchEvent(p.id));
                    }, 200);
                }
            } catch (error) {
                console.error("Error fetching events: ", error);
                if (isMounted) setLoading(false);
            }
        };
        fetchEvents();
        return () => { isMounted = false; };
    }, [prefetchEvent]);

    useEffect(() => {
        if (viewingPastEvent) {
            window.scrollTo(0, 0);
        }
    }, [viewingPastEvent]);
    
    // Filtering logic ab sirf search par depend karta hai
    const filteredEvents = useMemo(() => {
        return allEvents.filter(event => {
            return event.name.toLowerCase().includes(activeFilters.search.toLowerCase());
        });
    }, [allEvents, activeFilters]);

    const handleTempFilterChange = (e) => {
        const { name, value } = e.target;
        setTempFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = () => {
        setActiveFilters(tempFilters);
    };

    const handleRegisterClick = (event) => { setSelectedEvent(event); setIsFormOpen(true); };
    const handleCloseForm = () => { setIsFormOpen(false); setSelectedEvent(null); };

    const handleViewMoreClick = (event) => {
        // INSTANT NAVIGATION (0ms delay): Never block page navigation!
        // The listing already has name, date, time, speaker, brief, posterUrl, reportUrl
        const cached = eventCache.current[event.id];
        if (cached && cached.galleryImages?.length > 0) {
            setViewingPastEvent(cached);
            setLoadingGallery(false);
            return;
        }

        // Show event detail immediately with what we have
        setViewingPastEvent(event);
        setLoadingGallery(true);

        // Fetch gallery in background without blocking the UI
        prefetchEvent(event.id).then((fullEvent) => {
            if (fullEvent) {
                setViewingPastEvent(fullEvent);
            }
            setLoadingGallery(false);
        });
    };

    const handleBackToList = () => { setViewingPastEvent(null); };
    
    const handleOpenFeedbackForm = () => setIsFeedbackFormOpen(true);
    const handleCloseFeedbackForm = () => setIsFeedbackFormOpen(false);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingEvents = filteredEvents.filter(e => e.type === 'upcoming' && new Date(e.date) >= today);
    const pastEvents = filteredEvents.filter(e => e.type === 'past');
    const feedbackFormEventsList = ["Select Event", ...Array.from(new Set(allEvents.map(e => e.name).filter(Boolean)))];

    const renderContent = () => {
        if (loading && allEvents.length === 0) {
            return <EventsSkeletonView />;
        }
        if (viewingPastEvent) {
            return <PastEventDetail event={viewingPastEvent} onBack={handleBackToList} loadingGallery={loadingGallery} />;
        }
        return (
            <div className="relative z-10 container mx-auto text-center px-4 sm:px-6 lg:px-8">
                <FilterControls
                    tempFilters={tempFilters}
                    onTempFilterChange={handleTempFilterChange}
                    onApply={handleApplyFilters}
                    onFeedbackClick={handleOpenFeedbackForm}
                />
                <MainEventsView
                    upcomingEvents={upcomingEvents}
                    pastEvents={pastEvents}
                    onRegister={handleRegisterClick}
                    onViewMore={handleViewMoreClick}
                    onPrefetch={prefetchEvent}
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
            {isFeedbackFormOpen && <FeedbackModal dynamicEvents={feedbackFormEventsList} onClose={handleCloseFeedbackForm} />}
        </>
    );
}

// --- GLOBAL STYLES & BACKGROUND --- (No Changes)
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