import React, { useState, useEffect, useRef } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../FirebaseConfig';
import { FileText, Loader, Search } from 'lucide-react';

// Background component
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
            constructor(x, y, dX, dY, size, color) {
                this.x = x; this.y = y; this.directionX = dX; this.directionY = dY; this.size = size; this.color = color;
            }
            draw() {
                ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); ctx.fillStyle = this.color; ctx.fill();
            }
            update() {
                if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
                if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
                this.x += this.directionX; this.y += this.directionY; this.draw();
            }
        }

        function init() {
            particlesArray = [];
            let numParticles = (canvas.height * canvas.width) / 18000;
            const colors = ['#f97316', '#60a5fa', '#ffffff'];
            for (let i = 0; i < numParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * (canvas.width - size * 4)) + size * 2;
                let y = (Math.random() * (canvas.height - size * 4)) + size * 2;
                let dX = (Math.random() * .4) - .2;
                let dY = (Math.random() * .4) - .2;
                particlesArray.push(new Particle(x, y, dX, dY, size, colors[Math.floor(Math.random() * colors.length)]));
            }
        }

        function connect() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    let dist = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                    if (dist < (canvas.width / 8) * (canvas.height / 8)) {
                        let opacity = 1 - (dist / 20000);
                        ctx.strokeStyle = `rgba(100, 116, 139, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath(); ctx.moveTo(particlesArray[a].x, particlesArray[a].y); ctx.lineTo(particlesArray[b].x, particlesArray[b].y); ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            if(!canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particlesArray.forEach(p => p.update());
            connect();
            animationFrameId = window.requestAnimationFrame(animate);
        }

        const handleResize = () => { setCanvasDimensions(); init(); };
        setTimeout(() => { init(); animate(); }, 100);
        window.addEventListener('resize', handleResize);
        return () => { window.cancelAnimationFrame(animationFrameId); window.removeEventListener('resize', handleResize); };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 -z-10 w-full h-full bg-slate-100" />;
};


export default function Newsletters() {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const announcementsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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
            results = results.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
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
        return new Date(timestamp.seconds * 1000).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className="relative">
            <AnimatedBackground />
            <div className="relative z-10 bg-transparent min-h-screen p-4 sm:p-8 font-sans">
                <div className="max-w-4xl mx-auto">
                    <header className="mb-8 text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">DevOps Announcements</h1>
                        <p className="mt-4 text-lg text-slate-500">The latest news, updates, and articles from our team.</p>
                    </header>
                    <div className="mb-8 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md flex flex-col sm:flex-row gap-4">
                        <div className="relative w-full sm:w-2/3">
                            <Search className="w-5 h-5 text-slate-900 absolute top-1/2 left-3 -translate-y-1/2" />
                            <input type="search" placeholder="Search by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg" />
                        </div>
                        <div className="relative w-full sm:w-1/3">
                            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-4 py-2 border rounded-lg text-slate-600" />
                        </div>
                    </div>
                    {loading ? <div className="flex justify-center h-64 items-center"><Loader className="w-12 h-12 text-indigo-400 animate-spin" /></div>
                    : filteredAnnouncements.length === 0 ? <div className="text-center bg-white/10 p-12 rounded-lg"><FileText className="mx-auto w-16 h-16 text-slate-400" /><h2 className="mt-4 text-2xl font-semibold">No Announcements Found</h2></div>
                    : <div className="space-y-8">
                        {filteredAnnouncements.map((item) => (
                            <article key={item.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8">
                                <p className="text-sm text-indigo-600 font-semibold">{formatDate(item.createdAt)}</p>
                                <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">{item.title}</h2>
                                <p className="mt-4 text-slate-600 whitespace-pre-wrap">{item.content}</p>
                            </article>
                        ))}
                    </div>}
                </div>
            </div>
        </div>
    );
};