/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from '../firebaseConfig';
import { LogIn, LogOut, PlusCircle, Loader, User, Lock, Trash2, Pencil, XCircle, Mail, ArrowLeft, ToggleLeft, ToggleRight, Users, Calendar, UploadCloud } from 'lucide-react';

// --- MAIN ADMIN PANEL COMPONENT ---
export default function Admin() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader className="w-12 h-12 animate-spin text-blue-600" /></div>;
    }

    if (!user) {
        return <LoginForm />;
    }

    return <AdminDashboard loggedInUser={user} />;
}

// --- LOGIN FORM COMPONENT ---
const LoginForm = () => {
    // ... Aapka poora LoginForm component jaisa pehle tha ...
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [isResetView, setIsResetView] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setResetMessage('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError("Failed to log in. Check credentials.");
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setResetMessage('');
        if (!email) {
            setError("Please enter your email address to reset the password.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setResetMessage("Password reset email sent! Please check your inbox.");
        } catch (err) {
            if (err.code === 'auth/user-not-found') {
                setError("No user found with this email address.");
            } else {
                setError("Failed to send password reset email. Please try again later.");
            }
        }
    };

    if (isResetView) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
                        <p className="text-slate-500">Enter your email to get a reset link.</p>
                    </div>
                    <form onSubmit={handlePasswordReset} className="space-y-6 mt-6">
                        <div className="relative">
                            <Mail className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        {resetMessage && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-lg">{resetMessage}</p>}
                        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                        <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                           <Mail className="w-5 h-5" /><span>Send Reset Link</span>
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => setIsResetView(false)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1 mx-auto">
                            <ArrowLeft className="w-4 h-4" /> Back to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-800">Admin Login</h1>
                    <p className="text-slate-500">Access the central dashboard.</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-6 mt-6">
                    <div className="relative">
                        <User className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div className="relative">
                        <Lock className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                    <div className="text-right">
                        <button type="button" onClick={() => setIsResetView(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot Password?
                        </button>
                    </div>
                    <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700">
                        <LogIn className="w-5 h-5" /><span>Log In</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ loggedInUser }) => {
    // ... Aapka poora AdminDashboard component jaisa pehle tha ...
    const [activeTab, setActiveTab] = useState('events');

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-bold text-slate-900">Central Dashboard</h1>
                        <p className="text-slate-500 text-sm whitespace-nowrap">Logged in as {loggedInUser.email}</p>
                    </div>
                    <button onClick={() => signOut(auth)} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition self-start sm:self-center">
                        <LogOut className="w-5 h-5" /><span>Logout</span>
                    </button>
                </header>
                
                <div className="mb-8 flex border-b border-slate-200 overflow-x-auto">
                    <TabButton title="Manage Events" isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                    <TabButton title="Manage Hackathons" isActive={activeTab === 'hackathons'} onClick={() => setActiveTab('hackathons')} />
                    <TabButton title="Manage Announcements" isActive={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} />
                </div>
                
                <div>
                    {activeTab === 'events' && <EventManager />}
                    {activeTab === 'hackathons' && <Manager section="hackathons" title="Hackathon" />}
                    {activeTab === 'announcements' && <Manager section="announcements" title="Announcement" />}
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ title, isActive, onClick }) => (
    // ... Aapka poora TabButton component jaisa pehle tha ...
    <button onClick={onClick} className={`py-3 px-6 font-semibold text-sm transition-colors whitespace-nowrap ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
        {title}
    </button>
);

// --- GENERIC MANAGER COMPONENT (For Hackathons & Announcements) ---
const Manager = ({ section, title }) => {
    // ... Aapka poora Manager component jaisa pehle tha ...
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', content: '', date: '', teamSize: '4' });
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const q = query(collection(db, section), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [section]);

    const handleFormChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const resetForm = () => { setIsEditing(false); setCurrentId(null); setFormData({ title: '', content: '', date: '', teamSize: '4' }); };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const dataToSubmit = section === 'hackathons' 
            ? { name: formData.title, description: formData.content, date: formData.date, teamSize: parseInt(formData.teamSize) } 
            : { title: formData.title, content: formData.content };

        try {
            if (isEditing) {
                await updateDoc(doc(db, section, currentId), dataToSubmit);
            } else {
                const finalData = section === 'hackathons'
                    ? { ...dataToSubmit, createdAt: serverTimestamp(), isEnabled: true }
                    : { ...dataToSubmit, createdAt: serverTimestamp() };
                await addDoc(collection(db, section), finalData);
            }
            resetForm();
        } catch (err) { console.error("Error submitting document: ", err); }
        setSubmitting(false);
    };

    const handleEditClick = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setFormData({ 
            title: item.name || item.title, 
            content: item.description || item.content, 
            date: item.date || '',
            teamSize: item.teamSize?.toString() || '4'
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this ${title}?`)) {
            await deleteDoc(doc(db, section, id));
            if (isEditing && id === currentId) resetForm();
        }
    };
    
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const itemRef = doc(db, section, id);
            await updateDoc(itemRef, { isEnabled: !currentStatus });
        } catch (error) {
            console.error("Error updating status: ", error);
        }
    };
    
    return (
        <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/5 w-full">
                <div className="bg-white p-8 rounded-2xl shadow-xl h-full sticky top-8">
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        {isEditing ? <Pencil className="text-indigo-600" /> : <PlusCircle className="text-indigo-600" />}
                        {isEditing ? `Edit ${title}` : `Create New ${title}`}
                    </h2>
                    <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">{title} Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleFormChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">{section === 'hackathons' ? 'Description' : 'Content'}</label>
                            <textarea name="content" rows="6" value={formData.content} onChange={handleFormChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md"></textarea>
                        </div>
                        {section === 'hackathons' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Date</label>
                                    <input type="date" name="date" value={formData.date} onChange={handleFormChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Team Size</label>
                                    <div className="flex items-center gap-6">
                                        {[4, 5, 6].map(size => (
                                            <div key={size} className="flex items-center">
                                                <input id={`size-${size}`} type="radio" name="teamSize" value={size} checked={formData.teamSize === size.toString()} onChange={handleFormChange} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500" />
                                                <label htmlFor={`size-${size}`} className="ml-2 block text-sm text-gray-900">{size} Members</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="flex justify-end items-center gap-4 pt-2">
                            {isEditing && <button type="button" onClick={resetForm} className="flex items-center gap-2 py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300"><XCircle className="w-5 h-5" /> Cancel</button>}
                            <button type="submit" disabled={submitting} className="flex justify-center items-center gap-2 py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                                {submitting ? <Loader className="animate-spin w-5 h-5" /> : (isEditing ? 'Update' : 'Post')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className="lg:w-3/5 w-full">
                <div className="bg-white p-8 rounded-2xl shadow-xl h-full">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage {title}s</h2>
                    {loading ? <div className="flex justify-center"><Loader className="w-8 h-8 text-indigo-600 animate-spin" /></div>
                    : items.length === 0 ? <p className="text-slate-500">No {title.toLowerCase()}s to manage yet.</p>
                    : <div className="space-y-4">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <p className="font-semibold text-slate-800">{item.name || item.title}</p>
                                    <p className="text-sm text-slate-500">{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                    {section === 'hackathons' && item.teamSize && 
                                        <p className="text-xs text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 mt-2">
                                            <Users className="w-3 h-3" /> {item.teamSize} Members
                                        </p>
                                    }
                                </div>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                    {section === 'hackathons' && (
                                        item.isEnabled 
                                        ? <button onClick={() => handleToggleStatus(item.id, item.isEnabled)} title="Disable Registrations" className="p-2 text-green-500 hover:text-green-700"><ToggleRight className="w-6 h-6" /></button>
                                        : <button onClick={() => handleToggleStatus(item.id, item.isEnabled)} title="Enable Registrations" className="p-2 text-slate-400 hover:text-slate-600"><ToggleLeft className="w-6 h-6" /></button>
                                    )}
                                    <button onClick={() => handleEditClick(item)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full"><Pencil className="w-5 h-5" /></button>
                                    <button onClick={() => handleDelete(item.id)} title="Delete" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>
        </div>
    );
};

// --- EVENT MANAGER COMPONENT ---
const EventManager = () => {
    // ... Aapka poora EventManager component jaisa pehle tha ...
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formType, setFormType] = useState('upcoming');

    useEffect(() => {
        const q = query(collection(db, "events"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const openForm = (type, eventToEdit = null) => {
        setFormType(type);
        setEditingEvent(eventToEdit);
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingEvent(null);
    };

    const handleDelete = async (event) => {
        if (window.confirm(`Are you sure you want to delete the event: "${event.name}"?`)) {
            try {
                await deleteDoc(doc(db, "events", event.id));
                alert("Event deleted successfully.");
            } catch (error) {
                console.error("Error deleting event: ", error);
                alert("Failed to delete event. Check console for details.");
            }
        }
    };
    
    const upcomingEvents = events.filter(e => e.type === 'upcoming').sort((a, b) => new Date(a.date) - new Date(b.date));
    const pastEvents = events.filter(e => e.type === 'past').sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <>
            {isFormOpen && <EventForm event={editingEvent} type={formType} onClose={closeForm} />}
            
            <div className="bg-white p-8 rounded-2xl shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Manage Upcoming Events</h2>
                    <button onClick={() => openForm('upcoming')} className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        <PlusCircle className="w-5 h-5" /> Add Upcoming Event
                    </button>
                </div>
                <EventList events={upcomingEvents} onEdit={(event) => openForm('upcoming', event)} onDelete={handleDelete} loading={loading} />

                <div className="flex justify-between items-center mt-12 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Manage Past Events</h2>
                    <button onClick={() => openForm('past')} className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                        <PlusCircle className="w-5 h-5" /> Add Past Event
                    </button>
                </div>
                <EventList events={pastEvents} onEdit={(event) => openForm('past', event)} onDelete={handleDelete} loading={loading} />
            </div>
        </>
    );
};

const EventList = ({ events, onEdit, onDelete, loading }) => {
    // ... Aapka poora EventList component jaisa pehle tha ...
    if (loading) return <div className="flex justify-center"><Loader className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
    if (events.length === 0) return <p className="text-slate-500">No events to manage yet.</p>;

    return (
        <div className="space-y-4">
            {events.map(event => (
                <div key={event.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                        <p className="font-semibold text-slate-800">{event.name}</p>
                        <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => onEdit(event)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full"><Pencil className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(event)} title="Delete" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="w-5 h-5" /></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- UNIVERSAL EVENT FORM with ImgBB & UI Fix ---
const EventForm = ({ event, type, onClose }) => {
    const [formData, setFormData] = useState({
        name: '', date: '', time: '', location: '', mode: 'Offline',
        speakers: '', brief: '', reportUrl: '',
        posterUrlFile: null, cardImageUrlFile: null, galleryImagesFiles: []
    });
    const [submitting, setSubmitting] = useState(false);
    
    useEffect(() => {
        if (event) {
            setFormData({ ...event, posterUrlFile: null, cardImageUrlFile: null, galleryImagesFiles: [] });
        }
    }, [event]);

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === 'galleryImagesFiles') {
            setFormData(prev => ({ ...prev, [name]: Array.from(files) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const uploadFileToImgBB = async (file) => {
        if (!file) return null;
        const body = new FormData();
        body.append('image', file);
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: body });
            if (!response.ok) throw new Error('Image upload failed');
            const result = await response.json();
            if (result.success) return result.data.url;
            throw new Error(`ImgBB API Error: ${result.error.message}`);
        } catch (error) {
            console.error(error);
            alert("Image upload failed. Please check API key or try another image.");
            return null;
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let dataToSubmit = { ...formData, type };

            if (formData.posterUrlFile) dataToSubmit.posterUrl = await uploadFileToImgBB(formData.posterUrlFile);
            if (type === 'past' && formData.cardImageUrlFile) dataToSubmit.cardImageUrl = await uploadFileToImgBB(formData.cardImageUrlFile);
            if (type === 'past' && formData.galleryImagesFiles.length > 0) {
                const galleryUrls = await Promise.all(formData.galleryImagesFiles.map(file => uploadFileToImgBB(file)));
                const successfulUrls = galleryUrls.filter(url => url !== null);
                if (successfulUrls.length !== formData.galleryImagesFiles.length) { setSubmitting(false); return; }
                dataToSubmit.galleryImages = [...(event?.galleryImages || []), ...successfulUrls];
            }

            delete dataToSubmit.posterUrlFile;
            delete dataToSubmit.cardImageUrlFile;
            delete dataToSubmit.galleryImagesFiles;

            if (event) {
                await updateDoc(doc(db, 'events', event.id), dataToSubmit);
            } else {
                dataToSubmit.createdAt = serverTimestamp();
                await addDoc(collection(db, 'events'), dataToSubmit);
            }
            onClose();
        } catch (error) {
            console.error("Error submitting event:", error);
            alert("An error occurred. Check console.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800"><XCircle /></button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{event ? 'Edit' : 'Create'} {type === 'upcoming' ? 'Upcoming' : 'Past'} Event</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField label="Event Name" name="name" value={formData.name} onChange={handleInputChange} required />
                    <InputField label="Date" name="date" type="date" value={formData.date} onChange={handleInputChange} required />
                    <InputField label="Time" name="time" value={formData.time} onChange={handleInputChange} />
                    <FileInputField label="Event Poster" name="posterUrlFile" onChange={handleFileChange} accept="image/*" files={formData.posterUrlFile} />
                    {event?.posterUrl && !formData.posterUrlFile && <p className="text-xs text-slate-500 mt-[-10px]">Current: <a href={event.posterUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a></p>}

                    {type === 'upcoming' && (
                        <>
                            <InputField label="Location / Venue" name="location" value={formData.location} onChange={handleInputChange} required />
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Mode</label>
                                <select name="mode" value={formData.mode} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md">
                                    <option>Offline</option>
                                    <option>Online</option>
                                </select>
                            </div>
                        </>
                    )}

                    {type === 'past' && (
                         <>
                            <InputField label="Speaker(s)" name="speakers" value={formData.speakers} onChange={handleInputChange} placeholder="e.g., John Doe, Jane Smith"/>
                            <TextAreaField label="Event Brief" name="brief" value={formData.brief} onChange={handleInputChange} rows={8}/>
                            <FileInputField label="Card Image (for list view)" name="cardImageUrlFile" onChange={handleFileChange} accept="image/*" files={formData.cardImageUrlFile} />
                            {event?.cardImageUrl && !formData.cardImageUrlFile && <p className="text-xs text-slate-500 mt-[-10px]">Current: <a href={event.cardImageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a></p>}
                            <InputField label="Event Report URL (Google Drive Link)" name="reportUrl" type="text" value={formData.reportUrl || ''} onChange={handleInputChange} placeholder="Paste public link to the PDF here" />
                            {event?.reportUrl && <p className="text-xs text-slate-500 mt-[-10px]">Current: <a href={event.reportUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">View/Download</a></p>}
                            <FileInputField label="Gallery Images" name="galleryImagesFiles" onChange={handleFileChange} accept="image/*" multiple files={formData.galleryImagesFiles} />
                         </>
                    )}
                     
                    <div className="pt-4 flex justify-end">
                         <button type="submit" disabled={submitting} className="flex items-center gap-2 py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                             {submitting ? <><Loader className="animate-spin w-5 h-5" /> Submitting...</> : (event ? 'Update Event' : 'Create Event')}
                         </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Form Field Helper Components ---
const InputField = (props) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{props.label}</label>
        <input {...props} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
    </div>
);
const TextAreaField = (props) => (
    <div>
        <label className="block text-sm font-medium text-slate-700">{props.label}</label>
        <textarea {...props} className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
    </div>
);

// --- UPDATED: FileInputField Component with Multiple File Selection Fix ---
const FileInputField = (props) => {
    const selectedFiles = props.files;
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700">{props.label}</label>
            <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                    <label htmlFor={props.name} className="relative cursor-pointer">
                        <span className="font-semibold text-blue-600">Click to upload</span>
                        <input
                            id={props.name}
                            type="file"
                            name={props.name}
                            accept={props.accept}
                            multiple={props.multiple} // This attribute enables multiple file selection
                            onChange={props.onChange}
                            className="sr-only"
                        />
                    </label>
                    <p className="text-xs text-slate-500">or drag and drop</p>
                </div>
                {selectedFiles && (
                    <div className="mt-3 text-xs text-slate-500 font-medium">
                        {Array.isArray(selectedFiles) && selectedFiles.length > 0 ? (
                            <span className="bg-slate-200 px-2 py-1 rounded">{selectedFiles.length} files selected</span>
                        ) : selectedFiles.name ? (
                            <span className="bg-slate-200 px-2 py-1 rounded">Selected: {selectedFiles.name}</span>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};