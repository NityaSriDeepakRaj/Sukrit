"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ChatLayout from "@/components/ChatLayout"; 
import WellnessGraph from '@/components/WellnessGraph';
import { 
    FaPaperPlane, FaLock, FaSpinner, FaFlag, FaCircle, 
    FaUserCircle, FaStethoscope, FaChartLine, FaRobot 
} from 'react-icons/fa';

export default function CounselorDashboard() {
    const router = useRouter();
    
    // --- User State ---
    const [user, setUser] = useState(null);
    const [instituteName, setInstituteName] = useState('Loading...');
    
    // --- Tabs (Queue, Graph, AI) ---
    const [activeTab, setActiveTab] = useState('QUEUE'); 

    // --- Chat & Data State ---
    const [activeSessions, setActiveSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isSending, setIsSending] = useState(false);

    // --- Clinical Tools State (For the Header) ---
    const [severity, setSeverity] = useState('Pending');
    const [problemType, setProblemType] = useState('');
    const [isReported, setIsReported] = useState(false);

    const chatEndRef = useRef(null);

    // 1. Auth & Initial Load (WITH SECURITY FIX)
    useEffect(() => {
        const storedUser = localStorage.getItem("staffUser");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            
            // --- CRITICAL FIX: Check if ID exists and Role is correct ---
            if (!parsed._id || parsed.role !== 'psychologist') {
                // If invalid, clear data and force login
                localStorage.removeItem("staffUser");
                router.push('/psychologist/login');
                return;
            }

            setUser(parsed);
            setInstituteName(parsed.instituteName || "Sukrit Wellness");
            fetchActiveSessions(parsed._id);
        } else {
            router.push('/psychologist/login');
        }
    }, [router]);

    // 2. Fetch Inbox (Patient Queue)
    const fetchActiveSessions = useCallback(async (counselorId) => {
        try {
            const res = await fetch(`/api/chat/inbox?userId=${counselorId}`);
            if (res.ok) {
                const data = await res.json();
                setActiveSessions(data.sessions || []);
            }
        } catch (err) { console.error("Inbox sync failed", err); }
    }, []);

    // 3. Fetch Messages
    const fetchMessages = useCallback(async (sessionId) => {
        if (!sessionId) return;
        try {
            const res = await fetch(`/api/chat/messages?sessionId=${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages);
            }
        } catch (err) { console.error(err); }
    }, []);

    // 4. Real-Time Polling (Every 3 seconds)
    useEffect(() => {
        if (!user) return;
        
        // Poll for new sessions and new messages
        const interval = setInterval(() => {
            fetchActiveSessions(user._id);
            if (selectedSession && activeTab === 'QUEUE') {
                fetchMessages(selectedSession._id);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [user, selectedSession, activeTab, fetchActiveSessions, fetchMessages]);

    // 5. Scroll to Bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeTab]);

    // 6. Handle Session Selection
    const handleSelectSession = (session) => {
        setSelectedSession(session);
        // Load saved clinical data into the header tools
        setSeverity(session.severity || 'Pending');
        setProblemType(session.problemType || '');
        setIsReported(session.isReported || false);
        fetchMessages(session._id);
    };

    // 7. CLINICAL TOOLS: Update Graph Data (With Optimistic UI)
    const updateTools = async (newSev, newProb, newRep) => {
        if (!selectedSession) return;
        
        // 1. Update UI Instantly (Optimistic)
        if (newSev) setSeverity(newSev);
        if (newProb) setProblemType(newProb);
        if (newRep !== undefined) setIsReported(newRep);

        // 2. Send to Backend
        try {
            const res = await fetch('/api/chat/session/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    sessionId: selectedSession._id, 
                    severity: newSev ?? severity, 
                    problemType: newProb ?? problemType, 
                    isReported: newRep ?? isReported 
                }),
            });
            
            if (res.ok) {
                // Refresh list so the dot color changes in the sidebar immediately
                fetchActiveSessions(user._id); 
            }
        } catch (err) { alert("Update failed"); }
    };

    // 8. Send Reply
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        setIsSending(true);
        try {
            const res = await fetch('/api/chat/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    sessionId: selectedSession._id, 
                    senderId: user._id, 
                    content: messageInput 
                }),
            });
            if (res.ok) {
                setMessageInput('');
                fetchMessages(selectedSession._id);
            }
        } catch (err) { console.error(err); }
        finally { setIsSending(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem("staffUser");
        router.push("/");
    };

    if (!user) return <div className="p-10 text-center text-purple-600 font-bold animate-pulse">Loading Clinical Portal...</div>;

    return (
        <ChatLayout 
            role="psychologist" 
            user={user} 
            instituteId={user.instituteId} 
            instituteName={instituteName}
            onLogout={handleLogout}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
        >
            {/* === VIEW 1: PATIENT QUEUE & CHAT === */}
            {activeTab === 'QUEUE' && (
                <div className="flex flex-1 h-full m-4 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* LEFT: Patient List */}
                    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200 bg-white/50">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Incoming Requests</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {activeSessions.length === 0 && (
                                <div className="text-center p-8 text-gray-400 text-sm italic">
                                    Queue is empty.
                                </div>
                            )}
                            {activeSessions.map(s => (
                                <button 
                                    key={s._id} 
                                    onClick={() => handleSelectSession(s)}
                                    className={`w-full text-left p-3 rounded-xl border transition-all group ${
                                        selectedSession?._id === s._id 
                                        ? 'bg-white border-purple-400 shadow-md ring-1 ring-purple-50' 
                                        : 'bg-white border-gray-200 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-sm text-gray-700 flex items-center gap-2">
                                            {s.isAnonymous ? <FaLock size={10} className="text-gray-400"/> : <FaUserCircle size={12} className="text-blue-500"/>}
                                            {s.isAnonymous ? 'Anonymous' : 'Verified User'}
                                        </span>
                                        {/* Severity Dot */}
                                        <FaCircle size={10} className={s.severity === 'Red' ? 'text-red-500' : s.severity === 'Yellow' ? 'text-yellow-400' : s.severity === 'Green' ? 'text-green-500' : 'text-gray-200'} />
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide group-hover:bg-white transition-colors">
                                            {s.problemType || 'New Case'}
                                        </span>
                                        <span>{new Date(s.updatedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Chat Area */}
                    <div className="flex-1 flex flex-col bg-white">
                        {selectedSession ? (
                            <>
                                {/* HEADER: Clinical Tools */}
                                <div className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white shadow-sm z-10">
                                    <div>
                                        <div className="flex items-center gap-2 text-purple-700 font-bold">
                                            <FaStethoscope /> 
                                            <span>Clinical Session</span>
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            ID: {selectedSession._id.slice(-6)}
                                        </div>
                                    </div>

                                    {/* TOOLBAR */}
                                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-200 shadow-inner">
                                        {/* Severity Buttons */}
                                        <div className="flex bg-white rounded-lg shadow-sm border border-gray-100">
                                            {['Green', 'Yellow', 'Red'].map(col => (
                                                <button key={col} onClick={() => updateTools(col, null, null)} 
                                                    className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${severity === col ? (col==='Red'?'bg-red-500 text-white':col==='Yellow'?'bg-yellow-400 text-black':'bg-green-500 text-white') : 'text-gray-300 hover:bg-gray-100'}`}
                                                    title={`Mark as ${col}`}
                                                >
                                                    <FaCircle size={12} className={severity !== col ? (col==='Red'?'text-red-300':col==='Yellow'?'text-yellow-300':'text-green-300') : 'text-current'}/>
                                                </button>
                                            ))}
                                        </div>
                                        
                                        <div className="w-px h-6 bg-gray-200 mx-1"></div>

                                        {/* Problem Tag */}
                                        <select 
                                            value={problemType} 
                                            onChange={e => updateTools(null, e.target.value, null)} 
                                            className="text-xs bg-white border border-gray-200 py-2 px-2 rounded-lg outline-none font-bold text-gray-600 cursor-pointer hover:border-purple-300 transition-colors"
                                        >
                                            <option value="">Select Issue...</option>
                                            <option value="Academic">Academic Stress</option>
                                            <option value="Anxiety">Anxiety</option>
                                            <option value="Depression">Depression</option>
                                            <option value="Family">Family Issues</option>
                                            <option value="Social">Social / Peer</option>
                                        </select>
                                        
                                        {/* Report Flag */}
                                        <button 
                                            onClick={() => updateTools(null, null, !isReported)} 
                                            className={`p-2 rounded-lg border transition-all ${isReported ? 'bg-red-50 border-red-500 text-red-500' : 'bg-white border-gray-200 text-gray-300 hover:text-red-500'}`} 
                                            title="Flag User"
                                        >
                                            <FaFlag />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                    {messages.map(m => (
                                        <div key={m._id} className={`flex ${m.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed ${
                                                m.senderId === user._id 
                                                ? 'bg-purple-600 text-white rounded-br-none' // My Message (Doctor)
                                                : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none' // Patient Message
                                            }`}>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                {/* Input */}
                                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                                    <input 
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        className="flex-1 bg-gray-50 border border-gray-200 p-3.5 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50 focus:bg-white transition-all text-sm"
                                        placeholder="Type professional response..."
                                        disabled={isSending}
                                    />
                                    <button 
                                        className="bg-purple-600 text-white px-6 rounded-xl font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-all flex items-center gap-2"
                                        disabled={!messageInput.trim() || isSending}
                                    >
                                        {isSending ? <FaSpinner className="animate-spin"/> : <FaPaperPlane/>}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                    <FaStethoscope size={40} className="text-gray-200"/>
                                </div>
                                <h3 className="text-lg font-bold text-gray-400">Clinical Dashboard</h3>
                                <p className="text-sm">Select a patient from the queue to start.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* === VIEW 2: WELLNESS GRAPH === */}
            {activeTab === 'GRAPH' && (
                <div className="h-full bg-white m-4 rounded-2xl shadow-sm border border-gray-200 p-8 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaChartLine className="text-purple-600"/> Patient Wellness Analytics
                    </h2>
                    <WellnessGraph sessions={activeSessions} />
                </div>
            )}

            {/* === VIEW 3: AI ASSISTANT === */}
            {activeTab === 'AI' && (
                <div className="h-full bg-white m-4 rounded-2xl shadow-sm border border-gray-200 p-8 flex flex-col items-center justify-center text-gray-400">
                    <FaRobot size={64} className="mb-4 opacity-20"/>
                    <h3 className="text-xl font-bold text-gray-600">AI Clinical Assistant</h3>
                    <p>Automated case summarization coming soon.</p>
                </div>
            )}
        </ChatLayout>
    );
}