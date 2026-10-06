import React, { useState, useEffect, useMemo } from 'react';
import {
    onAdminAuthStateChanged,
    adminSignIn,
    adminSignOut,
    adminChangePassword,
    getAdminUsers,
    createAdminUser,
    deleteAdminUser
} from '../db/neonAuth';
import {
    subscribeEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    subscribeHackathons,
    createHackathon,
    updateHackathon,
    toggleHackathonStatus,
    deleteHackathon,
    subscribeAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    uploadImageToNeon,
    getEventById,
    subscribeEventRegistrations,
    deleteEventRegistration
} from '../db/neonService';
import { LogIn, LogOut, PlusCircle, Loader, User, Lock, Trash2, Pencil, XCircle, Mail, ArrowLeft, ToggleLeft, ToggleRight, Users, Calendar, UploadCloud, Download, Search, FileSpreadsheet } from 'lucide-react';

// --- MAIN ADMIN PANEL COMPONENT ---
export default function Admin() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAdminAuthStateChanged((currentUser) => {
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

// --- LOGIN FORM COMPONENT (Powered by Neon DB) ---
const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [isResetView, setIsResetView] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setResetMessage('');
        setSubmitting(true);
        try {
            await adminSignIn(email, password);
        } catch (err) {
            setError(err.message || "Failed to log in. Check credentials.");
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setResetMessage('');
        setSubmitting(true);
        try {
            await adminChangePassword(email, currentPassword, newPassword);
            setResetMessage("Password updated successfully! Returning to login...");
            setTimeout(() => {
                setIsResetView(false);
                setPassword('');
                setCurrentPassword('');
                setNewPassword('');
                setResetMessage('');
            }, 2000);
        } catch (err) {
            setError(err.message || "Failed to update password.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isResetView) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-100">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-slate-800">Change Password</h1>
                        <p className="text-slate-500">Update your Neon DB admin credentials.</p>
                    </div>
                    <form onSubmit={handlePasswordChange} className="space-y-4 mt-6">
                        <div className="relative">
                            <Mail className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                            <input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="relative">
                            <Lock className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                            <input type="password" placeholder="New Password (min 6 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        {resetMessage && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-lg">{resetMessage}</p>}
                        {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                        <button type="submit" disabled={submitting} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                           <Lock className="w-5 h-5" /><span>{submitting ? 'Updating...' : 'Update Password'}</span>
                        </button>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => { setIsResetView(false); setError(''); setResetMessage(''); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1 mx-auto">
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
                    <p className="text-slate-500">Access the central dashboard (Neon DB).</p>
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
                        <button type="button" onClick={() => { setIsResetView(true); setError(''); setResetMessage(''); }} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Change Password?
                        </button>
                    </div>
                    <button type="submit" disabled={submitting} className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400">
                        <LogIn className="w-5 h-5" /><span>{submitting ? 'Logging In...' : 'Log In'}</span>
                    </button>
                </form>

            </div>
        </div>
    );
};

// --- ADMIN DASHBOARD COMPONENT ---
const AdminDashboard = ({ loggedInUser }) => {
    const [activeTab, setActiveTab] = useState('events');
    const [selectedRegistrationEvent, setSelectedRegistrationEvent] = useState('all');

    const handleViewRegistrations = (event) => {
        if (event) {
            setSelectedRegistrationEvent(event.name);
        } else {
            setSelectedRegistrationEvent('all');
        }
        setActiveTab('registrations');
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-bold text-slate-900">Central Dashboard</h1>
                        <p className="text-slate-500 text-sm whitespace-nowrap">Logged in as {loggedInUser.email}</p>
                    </div>
                    <button onClick={() => adminSignOut()} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition self-start sm:self-center">
                        <LogOut className="w-5 h-5" /><span>Logout</span>
                    </button>
                </header>
                
                <div className="mb-8 flex border-b border-slate-200 overflow-x-auto">
                    <TabButton title="Manage Events" isActive={activeTab === 'events'} onClick={() => setActiveTab('events')} />
                    <TabButton title="Manage Hackathons" isActive={activeTab === 'hackathons'} onClick={() => setActiveTab('hackathons')} />
                    <TabButton title="Manage Announcements" isActive={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} />
                    <TabButton title="Event Registrations" isActive={activeTab === 'registrations'} onClick={() => setActiveTab('registrations')} />
                    <TabButton title="Manage Admins" isActive={activeTab === 'admins'} onClick={() => setActiveTab('admins')} />
                </div>
                
                <div>
                    <div className={activeTab === 'events' ? 'block' : 'hidden'}>
                        <EventManager onViewRegistrations={handleViewRegistrations} />
                    </div>
                    <div className={activeTab === 'hackathons' ? 'block' : 'hidden'}>
                        <Manager section="hackathons" title="Hackathon" />
                    </div>
                    <div className={activeTab === 'announcements' ? 'block' : 'hidden'}>
                        <Manager section="announcements" title="Announcement" />
                    </div>
                    <div className={activeTab === 'registrations' ? 'block' : 'hidden'}>
                        <RegistrationsManager 
                            selectedEventName={selectedRegistrationEvent} 
                            onSelectEventName={setSelectedRegistrationEvent} 
                        />
                    </div>
                    <div className={activeTab === 'admins' ? 'block' : 'hidden'}>
                        <AdminAccountsManager loggedInUser={loggedInUser} />
                    </div>
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
        const subscriber = section === 'hackathons' ? subscribeHackathons : subscribeAnnouncements;
        const unsubscribe = subscriber(
            (data) => {
                setItems(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching items: ", err);
                setLoading(false);
            }
        );
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
                if (section === 'hackathons') {
                    await updateHackathon(currentId, dataToSubmit);
                } else {
                    await updateAnnouncement(currentId, dataToSubmit);
                }
            } else {
                if (section === 'hackathons') {
                    await createHackathon({ ...dataToSubmit, isEnabled: true });
                } else {
                    await createAnnouncement(dataToSubmit);
                }
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
            if (section === 'hackathons') {
                await deleteHackathon(id);
            } else {
                await deleteAnnouncement(id);
            }
            if (isEditing && id === currentId) resetForm();
        }
    };
    
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            await toggleHackathonStatus(id, currentStatus);
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
const EventManager = ({ onViewRegistrations }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState(null);
    const [formType, setFormType] = useState('upcoming');

    useEffect(() => {
        const unsubscribe = subscribeEvents(
            (data) => {
                setEvents(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching events: ", err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    const openForm = (type, eventToEdit = null) => {
        setFormType(type);
        setEditingEvent(eventToEdit);
        setIsFormOpen(true);
        if (eventToEdit?.id) {
            getEventById(eventToEdit.id).then((fullEvent) => {
                if (fullEvent) {
                    setEditingEvent(fullEvent);
                }
            }).catch(console.error);
        }
    };

    const closeForm = () => {
        setIsFormOpen(false);
        setEditingEvent(null);
    };

    const handleDelete = async (event) => {
        if (window.confirm(`Are you sure you want to delete the event: "${event.name}"?`)) {
            try {
                await deleteEvent(event.id);
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
                <EventList events={upcomingEvents} onEdit={(event) => openForm('upcoming', event)} onDelete={handleDelete} onViewRegistrations={onViewRegistrations} loading={loading} />

                <div className="flex justify-between items-center mt-12 mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Manage Past Events</h2>
                    <button onClick={() => openForm('past')} className="flex items-center gap-2 py-2 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                        <PlusCircle className="w-5 h-5" /> Add Past Event
                    </button>
                </div>
                <EventList events={pastEvents} onEdit={(event) => openForm('past', event)} onDelete={handleDelete} onViewRegistrations={onViewRegistrations} loading={loading} />
            </div>
        </>
    );
};

const EventList = ({ events, onEdit, onDelete, onViewRegistrations, loading }) => {
    if (loading) return <div className="flex justify-center"><Loader className="w-8 h-8 text-indigo-600 animate-spin" /></div>;
    if (events.length === 0) return <p className="text-slate-500">No events to manage yet.</p>;

    return (
        <div className="space-y-4">
            {events.map(event => (
                <div key={event.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <div>
                        <p className="font-semibold text-slate-800">{event.name}</p>
                        <p className="text-sm text-slate-500">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button 
                            onClick={() => onViewRegistrations && onViewRegistrations(event)} 
                            title="View Registrations" 
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                            <Users className="w-4 h-4" />
                            <span>Registrations</span>
                        </button>
                        <button onClick={() => onEdit(event)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full"><Pencil className="w-5 h-5" /></button>
                        <button onClick={() => onDelete(event)} title="Delete" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="w-5 h-5" /></button>
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- REGISTRATIONS MANAGER COMPONENT with CSV Export ---
const RegistrationsManager = ({ selectedEventName, onSelectEventName }) => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const unsubscribe = subscribeEventRegistrations(
            (data) => {
                setRegistrations(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching registrations: ", err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    // Unique event names from all registrations
    const uniqueEvents = useMemo(() => {
        const set = new Set();
        registrations.forEach(r => {
            if (r.eventName) set.add(r.eventName);
        });
        return Array.from(set);
    }, [registrations]);

    // Filter registrations by selected event & search query
    const filteredRegistrations = useMemo(() => {
        return registrations.filter(reg => {
            const matchesEvent = selectedEventName === 'all' || reg.eventName === selectedEventName;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch = !q || 
                (reg.fullName && reg.fullName.toLowerCase().includes(q)) ||
                (reg.email && reg.email.toLowerCase().includes(q)) ||
                (reg.phone && reg.phone.includes(q)) ||
                (reg.moodleId && reg.moodleId.toLowerCase().includes(q)) ||
                (reg.branch && reg.branch.toLowerCase().includes(q));
            return matchesEvent && matchesSearch;
        });
    }, [registrations, selectedEventName, searchQuery]);

    const handleExportCSV = () => {
        if (filteredRegistrations.length === 0) {
            alert("No registrations available to export.");
            return;
        }

        const headers = [
            "Event Name",
            "Full Name",
            "Email Address",
            "Phone Number",
            "Moodle ID",
            "Semester",
            "Branch",
            "Division",
            "Registration Date & Time"
        ];

        const rows = filteredRegistrations.map(r => [
            r.eventName || '',
            r.fullName || '',
            r.email || '',
            r.phone || '',
            r.moodleId || '',
            r.semester || '',
            r.branch || '',
            r.division || '',
            r.createdAt ? new Date(r.createdAt).toLocaleString('en-GB') : ''
        ]);

        const csvContent = [
            headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
            ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        ].join('\r\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const sanitizedEvent = selectedEventName !== 'all' 
            ? selectedEventName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 35) 
            : 'All_Events';
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `Registrations_${sanitizedEvent}_${dateStr}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleDelete = async (registration) => {
        if (window.confirm(`Are you sure you want to delete registration for "${registration.fullName}"?`)) {
            try {
                await deleteEventRegistration(registration.id);
            } catch (err) {
                console.error("Error deleting registration:", err);
                alert("Failed to delete registration.");
            }
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl">
            {/* Header with Title, Stats, and Action */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-7 h-7 text-indigo-600" />
                        Event Registrations
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Showing {filteredRegistrations.length} of {registrations.length} total registrations
                    </p>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={filteredRegistrations.length === 0}
                    className="flex items-center gap-2 py-2.5 px-5 bg-emerald-600 text-white font-semibold rounded-lg shadow hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors self-stretch sm:self-auto justify-center"
                >
                    <Download className="w-5 h-5" />
                    <span>Generate .CSV ({filteredRegistrations.length})</span>
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Filter by Event</label>
                    <select
                        value={selectedEventName}
                        onChange={(e) => onSelectEventName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Events ({registrations.length})</option>
                        {uniqueEvents.map(evtName => {
                            const count = registrations.filter(r => r.eventName === evtName).length;
                            return (
                                <option key={evtName} value={evtName}>
                                    {evtName} ({count})
                                </option>
                            );
                        })}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Search Registrations</label>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by student name, email, moodle ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Table or Empty State */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-semibold">No registrations found</p>
                    <p className="text-xs text-slate-400 mt-1">
                        {registrations.length === 0 
                            ? "Nobody has registered for any events yet." 
                            : "Try selecting another event or clearing your search filter."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-slate-600 font-semibold">
                            <tr>
                                <th className="px-4 py-3">#</th>
                                <th className="px-4 py-3">Student Name</th>
                                <th className="px-4 py-3">Event</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Moodle ID</th>
                                <th className="px-4 py-3">Branch / Sem / Div</th>
                                <th className="px-4 py-3">Registered At</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredRegistrations.map((reg, idx) => (
                                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-4 py-3 text-slate-400 font-mono text-xs">{idx + 1}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-800">{reg.fullName}</td>
                                    <td className="px-4 py-3 text-indigo-600 font-medium max-w-xs truncate" title={reg.eventName}>
                                        {reg.eventName}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-slate-800">{reg.email}</p>
                                        <p className="text-xs text-slate-500 font-mono">{reg.phone}</p>
                                    </td>
                                    <td className="px-4 py-3 font-mono text-xs font-semibold text-slate-700">{reg.moodleId}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700">
                                            {reg.branch || '—'} · Sem {reg.semester || '—'} · Div {reg.division || '—'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                                        {new Date(reg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button
                                            onClick={() => handleDelete(reg)}
                                            title="Delete Registration"
                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let dataToSubmit = { ...formData, type };

            if (formData.posterUrlFile) dataToSubmit.posterUrl = await uploadImageToNeon(formData.posterUrlFile);
            if (type === 'past' && formData.cardImageUrlFile) dataToSubmit.cardImageUrl = await uploadImageToNeon(formData.cardImageUrlFile);
            if (type === 'past' && formData.galleryImagesFiles.length > 0) {
                const galleryUrls = await Promise.all(formData.galleryImagesFiles.map(file => uploadImageToNeon(file)));
                const successfulUrls = galleryUrls.filter(url => url !== null);
                if (successfulUrls.length !== formData.galleryImagesFiles.length) { setSubmitting(false); return; }
                dataToSubmit.galleryImages = [...(formData.galleryImages || event?.galleryImages || []), ...successfulUrls];
            } else if (event?.galleryImages) {
                dataToSubmit.galleryImages = event.galleryImages;
            }

            delete dataToSubmit.posterUrlFile;
            delete dataToSubmit.cardImageUrlFile;
            delete dataToSubmit.galleryImagesFiles;

            if (event) {
                await updateEvent(event.id, dataToSubmit);
            } else {
                await createEvent(dataToSubmit);
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

// --- ADMIN ACCOUNTS & ACCESS MANAGER COMPONENT ---
const AdminAccountsManager = ({ loggedInUser }) => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('admin');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const loadAdmins = async () => {
        setLoading(true);
        try {
            const list = await getAdminUsers();
            setAdmins(list);
        } catch (err) {
            console.error('Failed to load admins:', err);
            setErrorMessage('Could not load admin accounts: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setErrorMessage('Password must be at least 6 characters long.');
            return;
        }

        setSubmitting(true);
        try {
            const newAdmin = await createAdminUser(email, password, role);
            setSuccessMessage(`Admin account created successfully for ${newAdmin.email}!`);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            await loadAdmins();
            setTimeout(() => setSuccessMessage(''), 5000);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to create admin user.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteAdmin = async (id, targetEmail) => {
        if (!window.confirm(`Are you sure you want to remove admin access for ${targetEmail}?`)) {
            return;
        }
        setSuccessMessage('');
        setErrorMessage('');
        try {
            await deleteAdminUser(id, loggedInUser.id);
            setSuccessMessage(`Admin ${targetEmail} was successfully removed.`);
            await loadAdmins();
            setTimeout(() => setSuccessMessage(''), 4000);
        } catch (err) {
            setErrorMessage(err.message || 'Failed to delete admin user.');
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Description */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-6 h-6 text-indigo-600" />
                        Admin Access & Accounts
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage central administrator accounts stored securely in Neon PostgreSQL database. Any admin created here can immediately log in to this portal.
                    </p>
                </div>
                <button
                    onClick={loadAdmins}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                >
                    {loading ? 'Refreshing...' : 'Refresh Accounts'}
                </button>
            </div>

            {/* Status alerts */}
            {successMessage && (
                <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">✅</span> {successMessage}
                </div>
            )}
            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium flex items-center gap-2">
                    <span className="text-lg">❌</span> {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left 2 Cols: Registered Admins List */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span>Active Administrators</span>
                        <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                            {admins.length} {admins.length === 1 ? 'Account' : 'Accounts'}
                        </span>
                    </h3>

                    {loading ? (
                        <div className="py-12 flex justify-center items-center text-slate-400">
                            <Loader className="w-8 h-8 animate-spin text-indigo-600" />
                        </div>
                    ) : admins.length === 0 ? (
                        <p className="text-sm text-slate-500 py-8 text-center">No admin accounts found.</p>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {admins.map((admin) => {
                                const isCurrent = admin.id === loggedInUser.id || admin.email.toLowerCase() === loggedInUser.email.toLowerCase();
                                return (
                                    <div key={admin.id} className="py-4 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm shrink-0">
                                                {admin.email.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold text-slate-800 text-sm truncate">
                                                        {admin.email}
                                                    </p>
                                                    {isCurrent && (
                                                        <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                                            You (Active)
                                                        </span>
                                                    )}
                                                    <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 uppercase px-2 py-0.5 rounded">
                                                        {admin.role}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">
                                                    Added {admin.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            {isCurrent ? (
                                                <span className="text-xs text-slate-400 italic px-3 py-1.5">
                                                    Current User
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                                                    disabled={admins.length <= 1}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={admins.length <= 1 ? "Cannot delete the only remaining admin" : "Remove admin access"}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Right Col: Add New Admin Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
                        <PlusCircle className="w-5 h-5 text-indigo-600" />
                        Create New Admin
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                        Add a new team member with administrative privileges.
                    </p>

                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@devopsclub.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Password (min. 6 characters)
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                                Access Role
                            </label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                            >
                                <option value="admin">Administrator (Full Access)</option>
                                <option value="editor">Editor (Events & Bulletins)</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow transition-colors flex items-center justify-center gap-2 disabled:bg-indigo-400 mt-6"
                        >
                            {submitting ? (
                                <>
                                    <Loader className="w-4 h-4 animate-spin" />
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                <>
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Create Admin Account</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};