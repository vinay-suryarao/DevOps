/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy, onSnapshot } from "firebase/firestore";
import { auth, db } from '../firebaseConfig'; // Aapke central config se import
// NEW: ToggleLeft aur ToggleRight icons add kiye hain
import { LogIn, LogOut, PlusCircle, Loader, User, Lock, Trash2, Pencil, XCircle, Mail, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react';

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

// --- LOGIN FORM COMPONENT (with Forgot Password logic) ---
const LoginForm = () => {
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
    const [activeTab, setActiveTab] = useState('hackathons');

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
                
                <div className="mb-8 flex border-b border-slate-200">
                    <TabButton title="Manage Hackathons" isActive={activeTab === 'hackathons'} onClick={() => setActiveTab('hackathons')} />
                    <TabButton title="Manage Announcements" isActive={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')} />
                </div>
                
                <div>
                    {activeTab === 'hackathons' && <Manager section="hackathons" title="Hackathon" />}
                    {activeTab === 'announcements' && <Manager section="announcements" title="Announcement" />}
                </div>
            </div>
        </div>
    );
};

const TabButton = ({ title, isActive, onClick }) => (
    <button onClick={onClick} className={`py-3 px-6 font-semibold text-sm transition-colors ${isActive ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
        {title}
    </button>
);

// --- GENERIC MANAGER COMPONENT (Handles both sections) ---
const Manager = ({ section, title }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ title: '', content: '', date: '' });
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
    const resetForm = () => { setIsEditing(false); setCurrentId(null); setFormData({ title: '', content: '', date: '' }); };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const dataToSubmit = section === 'hackathons' 
            ? { name: formData.title, description: formData.content, date: formData.date } 
            : { title: formData.title, content: formData.content };

        try {
            if (isEditing) {
                await updateDoc(doc(db, section, currentId), dataToSubmit);
            } else {
                // CHANGED: Jab naya hackathon banega, isEnabled: true set ho jayega
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
        setFormData({ title: item.name || item.title, content: item.description || item.content, date: item.date || '' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Are you sure you want to delete this ${title}?`)) {
            await deleteDoc(doc(db, section, id));
            if (isEditing && id === currentId) resetForm();
        }
    };
    
    // NEW: Function to toggle hackathon status
    const handleToggleStatus = async (id, currentStatus) => {
        try {
            const itemRef = doc(db, section, id);
            await updateDoc(itemRef, {
                isEnabled: !currentStatus
            });
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
                             <div>
                                 <label className="block text-sm font-medium text-slate-700">Date</label>
                                 <input type="date" name="date" value={formData.date} onChange={handleFormChange} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md" />
                             </div>
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
                            <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div>
                                    <p className="font-semibold text-slate-800">{item.name || item.title}</p>
                                    <p className="text-sm text-slate-500">{new Date(item.createdAt?.seconds * 1000).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    {/* NEW: Toggle button sirf hackathons ke liye dikhega */}
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
