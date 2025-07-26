import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail
} from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    query,
    onSnapshot,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from 'firebase/firestore';
import { FileText, LogIn, LogOut, PlusCircle, Loader, User, Lock, Trash2, Pencil, XCircle, Search, Mail, ArrowLeft } from 'lucide-react';

// --- BACKGROUND COMPONENT (Defined in the same file) ---
const AnimatedBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particlesArray;

        const setCanvasDimensions = () => {
            canvas.width = document.body.scrollWidth;
            canvas.height = document.body.scrollHeight;
        };
        setCanvasDimensions();

        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) {
                    this.directionX = -this.directionX;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.directionY = -this.directionY;
                }
                this.x += this.directionX;
                this.y += this.directionY;
                this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numberOfParticles = (canvas.height * canvas.width) / 18000;
            const colors = ['#f97316', '#60a5fa', '#ffffff']; // Orange, Blue, and White particles
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
                let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
                let directionX = (Math.random() * .4) - .2;
                let directionY = (Math.random() * .4) - .2;
                let color = colors[Math.floor(Math.random() * colors.length)];
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }

        function connect() {
            let opacityValue = 1;
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                    if (distance < (canvas.width / 8) * (canvas.height / 8)) {
                        opacityValue = 1 - (distance / 20000);
                        ctx.strokeStyle = `rgba(100, 116, 139, ${opacityValue})`; // Slate color for lines
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
            animationFrameId = window.requestAnimationFrame(animate);
        }

        const handleResize = () => {
            setCanvasDimensions();
            init();
        };

        // Delay init to allow page content to render first, ensuring correct scrollHeight
        setTimeout(() => {
            init();
            animate();
        }, 100);

        window.addEventListener('resize', handleResize);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // The canvas is positioned absolutely behind everything with a dark background
    return <canvas ref={canvasRef} className="absolute top-0 left-0 -z-10 w-full h-full bg-slate-100" />;
};

// --- IMPORTANT: PASTE YOUR FIREBASE CONFIG HERE ---
const firebaseConfig = {
    apiKey: "AIzaSyAAl3AoUuzi20mlDQPv_v-Eomulg9LA1FQ",
    authDomain: "mydevopsblog-1d895.firebaseapp.com",
    projectId: "mydevopsblog-1d895",
    storageBucket: "mydevopsblog-1d895.firebasestorage.app",
    messagingSenderId: "30618275948",
    appId: "1:30618275948:web:949b2a8b4c53bffaaec849",
    measurementId: "G-JXPZSFQSZ4"
};

// --- INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- 1. ANNOUNCEMENTS PAGE (With Search and Filter) ---
const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const announcementsData = [];
            querySnapshot.forEach((doc) => {
                announcementsData.push({ id: doc.id, ...doc.data() });
            });
            setAnnouncements(announcementsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching announcements: ", error);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        let results = announcements;
        if (searchTerm) {
            results = results.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (selectedDate) {
            results = results.filter(item => {
                if (!item.createdAt) return false;
                const itemDate = new Date(item.createdAt.seconds * 1000).toISOString().split('T')[0];
                return itemDate === selectedDate;
            });
        }
        setFilteredAnnouncements(results);
    }, [searchTerm, selectedDate, announcements]);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'Just now';
        return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    return (
        <div className="bg-transparent min-h-screen p-4 sm:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                        DevOps Announcements
                    </h1>
                    <p className="mt-4 text-lg text-slate-500">
                        The latest news, updates, and articles from our team.
                    </p>
                </header>
                <div className="mb-8 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4 items-center border border-white/20">
                    <div className="relative w-full sm:w-2/3">
                         <Search className="w-5 h-5 text-slate-900 absolute top-1/2 left-3 -translate-y-1/2" />
                        <input
                            type="search"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition bg-white/200"
                        />
                    </div>
                    <div className="relative w-full sm:w-1/3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-slate-600 bg-white/80"
                        />
                    </div>
                </div>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader className="w-12 h-12 text-indigo-400 animate-spin" />
                    </div>
                ) : filteredAnnouncements.length === 0 ? (
                    <div className="text-center bg-white/10 backdrop-blur-sm p-12 rounded-lg shadow-md border border-white/20">
                        <FileText className="mx-auto w-16 h-16 text-slate-400" />
                        <h2 className="mt-4 text-2xl font-semibold text-slate-900">No Announcements Found</h2>
                        <p className="mt-2 text-slate-400">Try adjusting your search or filter criteria.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {filteredAnnouncements.map((item) => (
                            <article key={item.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-2xl border border-white/20">
                                <div className="p-6 sm:p-8">
                                    <p className="text-sm text-indigo-600 font-semibold">
                                        {formatDate(item.createdAt)}
                                    </p>
                                    <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                                        {item.title}
                                    </h2>
                                    <p className="mt-4 text-slate-600 whitespace-pre-wrap leading-relaxed">
                                        {item.content}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- 2. ADMIN PANEL (with Password Reset) ---
const AdminPanel = () => {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [postSuccess, setPostSuccess] = useState('');
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [isResetView, setIsResetView] = useState(false);
    const [resetMessage, setResetMessage] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setError('');
            setResetMessage('');
            if (!currentUser) {
                setAnnouncements([]);
                setLoading(true);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const announcementsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAnnouncements(announcementsData);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [user]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setResetMessage('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            setError("Failed to log in. Please check your email and password.");
            console.error(err);
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setError('');
        setResetMessage('');
        if (!email) {
            setError("Please enter your email address.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setResetMessage("Password reset email sent! Please check your inbox.");
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/user-not-found') {
                setError("No user found with this email address.");
            } else {
                setError("Failed to send password reset email. Please try again.");
            }
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        resetForm();
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("Please fill in both title and content.");
            return;
        }
        setSubmitting(true);
        try {
            if (isEditing) {
                const docRef = doc(db, "announcements", currentId);
                await updateDoc(docRef, { title, content });
                setPostSuccess('Announcement updated successfully!');
            } else {
                await addDoc(collection(db, "announcements"), {
                    title: title,
                    content: content,
                    createdAt: serverTimestamp()
                });
                setPostSuccess('Announcement posted successfully!');
            }
            resetForm();
            setTimeout(() => setPostSuccess(''), 3000);
        } catch (err) {
            console.error("Error submitting document: ", err);
            alert(`Failed to ${isEditing ? 'update' : 'post'} announcement.`);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this announcement?")) {
            try {
                await deleteDoc(doc(db, "announcements", id));
                setPostSuccess('Announcement deleted successfully!');
                setTimeout(() => setPostSuccess(''), 3000);
                if (isEditing && id === currentId) {
                    resetForm();
                }
            } catch (err) {
                console.error("Error deleting document: ", err);
                alert("Failed to delete announcement.");
            }
        }
    };

    const handleEditClick = (item) => {
        setIsEditing(true);
        setCurrentId(item.id);
        setTitle(item.title);
        setContent(item.content);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentId(null);
        setTitle('');
        setContent('');
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center bg-transparent min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md p-8 space-y-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                    {isResetView ? (
                        <div>
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-slate-800">Reset Password</h1>
                                <p className="text-slate-500">Enter your email to get a reset link.</p>
                            </div>
                            <form onSubmit={handlePasswordReset} className="space-y-6">
                                <div className="relative">
                                    <Mail className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                                </div>
                                {resetMessage && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-lg">{resetMessage}</p>}
                                {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                                <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Send Reset Link
                                </button>
                            </form>
                            <div className="mt-6 text-center">
                                <button onClick={() => setIsResetView(false)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 flex items-center justify-center gap-1 mx-auto">
                                    <ArrowLeft className="w-4 h-4" /> Back to Login
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-slate-800">Admin Login</h1>
                                <p className="text-slate-500">Access to the announcement dashboard.</p>
                            </div>
                            <form onSubmit={handleLogin} className="space-y-6 mt-6">
                                <div className="relative">
                                    <User className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                                </div>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-slate-400 absolute top-3.5 left-4" />
                                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" />
                                </div>
                                {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
                                <div className="text-right">
                                    <button type="button" onClick={() => setIsResetView(true)} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                        Forgot Password?
                                    </button>
                                </div>
                                <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105">
                                    <LogIn className="w-5 h-5" />
                                    <span>Log In</span>
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-10">
                    <div className="flex items-baseline gap-3">
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-500 text-sm whitespace-nowrap">Logged in as {user.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition self-start sm:self-center">
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </header>
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/5 w-full">
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full sticky top-8 border border-white/20">
                            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                                {isEditing ? <Pencil className="text-indigo-600" /> : <PlusCircle className="text-indigo-600" />}
                                {isEditing ? 'Edit Announcement' : 'Create New Announcement'}
                            </h2>
                            <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
                                    <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                                </div>
                                <div>
                                    <label htmlFor="content" className="block text-sm font-medium text-slate-700">Content</label>
                                    <textarea id="content" rows="6" value={content} onChange={(e) => setContent(e.target.value)} required className="mt-1 block w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                                </div>
                                <div className="flex justify-end items-center gap-4 pt-2">
                                    {isEditing && (
                                        <button type="button" onClick={resetForm} className="flex items-center gap-2 py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300">
                                            <XCircle className="w-5 h-5" /> Cancel
                                        </button>
                                    )}
                                    <button type="submit" disabled={submitting} className="flex justify-center items-center gap-2 py-2 px-6 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                                        {submitting ? <Loader className="animate-spin w-5 h-5" /> : (isEditing ? 'Update' : 'Post')}
                                    </button>
                                </div>
                            </form>
                             {postSuccess && <p className="text-center mt-4 text-green-600 font-semibold">{postSuccess}</p>}
                        </div>
                    </div>
                    <div className="lg:w-3/5 w-full">
                        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl h-full border border-white/20">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Manage Announcements</h2>
                            {loading ? (
                                <div className="flex justify-center"><Loader className="w-8 h-8 text-indigo-600 animate-spin" /></div>
                            ) : announcements.length === 0 ? (
                                <p className="text-slate-500">No announcements to manage yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {announcements.map(item => (
                                        <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-white">
                                            <div className="flex-grow min-w-0">
                                                <p className="font-semibold text-slate-800 truncate pr-4">{item.title}</p>
                                                <p className="text-sm text-slate-500">
                                                    {new Date(item.createdAt?.seconds * 1000).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric'})}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <button onClick={() => handleEditClick(item)} title="Edit" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors">
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button onClick={() => handleDelete(item.id)} title="Delete" className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- 3. MAIN APP (Navigation Modified) ---
export default function App() {
    const [page, setPage] = useState('announcements');

    // REMOVED the placeholder MainNavbar component to avoid duplication.
    // Your actual site's navbar will now appear correctly without a copy.

    return (
        // The main container needs to be relative to layer the background and content
        <div className="relative">
            <AnimatedBackground />
            
            {/* This container sits on top of the background */}
            <div className="relative z-10">
                {/* The duplicate navbar has been removed from here */}

                {/* Centered, tab-style navigation */}
                <div className="flex justify-center py-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm p-1.5 rounded-xl flex space-x-2 shadow-lg border border-white/20">
                        <button
                            onClick={() => setPage('announcements')}
                            className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out ${
                                page === 'announcements'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                            }`}
                        >
                            Announcements
                        </button>
                        <button
                            onClick={() => setPage('admin')}
                            className={`font-semibold py-2 px-6 rounded-lg transition-all duration-300 ease-in-out ${
                                page === 'admin'
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                            }`}
                        >
                            Admin Panel
                        </button>
                    </div>
                </div>

                {page === 'announcements' && <AnnouncementsPage />}
                {page === 'admin' && <AdminPanel />}
            </div>
        </div>
    );
}