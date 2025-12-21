"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import ChatLayout from "@/components/ChatLayout"; 
import { FaPaperPlane, FaUserMd, FaRobot, FaSpinner, FaChalkboardTeacher } from 'react-icons/fa';

export default function TeacherChatPage() {
    const router = useRouter();
    
    // --- User State ---
    const [user, setUser] = useState(null);
    const [instituteName, setInstituteName] = useState('Loading...');
    
    // --- Tabs ---
    const [activeTab, setActiveTab] = useState('AI'); 
    
    // --- CHAT STATE ---
    const [counselors, setCounselors] = useState([]);
    const [activeSession, setActiveSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [isSending, setIsSending] = useState(false);
    
    const chatEndRef = useRef(null);

    // 1. Auth Check & Load Data
    useEffect(() => {
        const storedUser = localStorage.getItem("staffUser"); 
        if (storedUser) {
            const u = JSON.parse(storedUser);
            
            // --- CRITICAL FIX: Verify Role and ID ---
            if (!u._id || u.role !== 'teacher') {
                console.error("Invalid Teacher Data. Logging out.");
                localStorage.removeItem("staffUser");
                router.push('/teacher/login');
                return;
            }

            setUser(u);
            setInstituteName(u.instituteName || "Staff Portal");

            // Fetch Counselors
            if (u.instituteId) {
                fetch(`/api/institute/counselors?instituteId=${u.instituteId}`)
                    .then(res => res.json())
                    .then(data => setCounselors(data.counselors || []))
                    .catch(err => console.error("Counselor load error:", err));
            }
        } else {
            router.push("/teacher/login"); 
        }
    }, [router]);

    // 2. Fetch Messages
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

    // 3. Auto-Polling
    useEffect(() => {
        if (!activeSession) return;
        
        // Immediate fetch
        fetchMessages(activeSession._id);

        // Interval fetch
        const interval = setInterval(() => {
            fetchMessages(activeSession._id);
        }, 3000);

        return () => clearInterval(interval);
    }, [activeSession, fetchMessages]);

    // 4. Scroll to Bottom
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, activeTab]);

    // 5. Start Chat (ROBUST FIX)
    const handleStartChat = async (targetCounselor) => {
        // Extract ID safely (handle _id or id)
        const cId = targetCounselor._id || targetCounselor.id;

        // Validation
        if (!user || !user._id) {
            alert("Please re-login to start a chat.");
            return;
        }
        if (!cId) {
            alert("Error: Invalid Counselor ID.");
            return;
        }

        // DEBUG LOGS (Check console if it fails)
        console.log("Starting Chat...");
        console.log("Teacher ID:", user._id);
        console.log("Target Counselor ID:", cId);

        try {
            const res = await fetch('/api/chat/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    starterId: user._id, 
                    counselorId: cId 
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setActiveSession(data.session);
                fetchMessages(data.session._id);
            } else {
                console.error("Chat Error:", data);
                alert("Could not start chat: " + (data.message || "Unknown error"));
            }
        } catch (err) { console.error(err); }
    };

    // 6. Send Message
    const sendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;
        setIsSending(true);

        try {
            if (activeTab === 'COUNSELOR' && activeSession) {
                const res = await fetch('/api/chat/send-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        sessionId: activeSession._id, 
                        senderId: user._id, 
                        content: messageInput 
                    }),
                });
                if (res.ok) {
                    setMessageInput('');
                    fetchMessages(activeSession._id);
                }
            }
            else if (activeTab === 'AI') {
                alert("AI Chat is in demo mode.");
                setMessageInput('');
            }
        } catch (err) { console.error(err); }
        finally { setIsSending(false); }
    };

    const handleLogout = () => {
        localStorage.removeItem("staffUser");
        router.push("/");
    };

    if (!user) return <div className="p-10 text-center text-teal-600 font-bold animate-pulse">Loading Teacher Portal...</div>;

    return (
        <ChatLayout 
            role="teacher" 
            user={user} 
            instituteId={user.instituteId} 
            instituteName={instituteName} 
            onLogout={handleLogout}
            activeTab={activeTab} 
            setActiveTab={setActiveTab}
        >
            {/* --- TAB 1: AI SELF-CARE --- */}
            {activeTab === 'AI' && (
                <div className="flex flex-col h-full bg-white/50">
                    <h4 className="text-xl font-bold text-gray-800 mb-4 px-6 pt-6 flex items-center gap-2">
                        <FaRobot className="text-teal-600"/> Professional AI Check-in
                    </h4>
                    
                    <div className="flex-grow overflow-y-auto space-y-3 p-6">
                        <div className="flex justify-start">
                            <div className="bg-teal-100 text-teal-900 p-4 rounded-2xl rounded-tl-none max-w-lg shadow-sm border border-teal-200">
                                <p className="font-bold text-xs mb-1 text-teal-700">Staff Wellness AI</p>
                                Hello {user.name}. Teaching can be demanding. I am here to support your well-being.
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t bg-white">
                        <form onSubmit={sendMessage} className="flex gap-2">
                            <input 
                                value={messageInput}
                                onChange={e => setMessageInput(e.target.value)}
                                placeholder="Share your thoughts..." 
                                className="flex-grow p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none" 
                            />
                            <button className="p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold">
                                <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* --- TAB 2: CONSULT COUNSELOR --- */}
            {activeTab === 'COUNSELOR' && (
                <div className="flex h-full bg-white m-4 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* List of School Psychologists */}
                    <div className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
                        <h3 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider">School Psychologists</h3>
                        {counselors.length === 0 && <p className="text-sm text-gray-400 italic">No staff found.</p>}
                        
                        {counselors.map(c => (
                            <button 
                                key={c._id || c.id} 
                                // FIX: Pass the whole object to handleStartChat
                                onClick={() => handleStartChat(c)}
                                className={`w-full text-left p-3 rounded-lg mb-2 text-sm transition-all border ${
                                    activeSession?.counselorId === (c._id || c.id) 
                                    ? 'bg-white border-teal-400 shadow-md ring-1 ring-teal-50 font-bold text-teal-700' 
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <FaUserMd className={activeSession?.counselorId === (c._id || c.id) ? "text-teal-500" : "text-gray-400"} /> 
                                    Dr. {c.name}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col bg-white">
                        {activeSession ? (
                            <>
                                <header className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                                        <FaChalkboardTeacher className="text-teal-500"/> Staff Consultation
                                    </h3>
                                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded font-bold border border-teal-200">
                                        Confidential
                                    </span>
                                </header>

                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                    {messages.map(m => (
                                        <div key={m._id} className={`flex ${m.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm shadow-sm ${
                                                m.senderId === user._id 
                                                ? 'bg-teal-600 text-white rounded-br-none' // Teacher Message
                                                : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none' // Psychologist Message
                                            }`}>
                                                {m.content}
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </div>

                                <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                                    <input 
                                        value={messageInput}
                                        onChange={e => setMessageInput(e.target.value)}
                                        className="flex-1 border p-3.5 rounded-lg outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 bg-gray-50 focus:bg-white transition-all"
                                        placeholder="Type a confidential message..."
                                        disabled={isSending}
                                    />
                                    <button 
                                        className="bg-teal-600 text-white px-6 rounded-lg font-bold hover:bg-teal-700 disabled:opacity-50 shadow-md shadow-teal-100 transition-all"
                                        disabled={!messageInput.trim() || isSending}
                                    >
                                        {isSending ? <FaSpinner className="animate-spin"/> : <FaPaperPlane/>}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                                <FaChalkboardTeacher size={48} className="mb-4 opacity-20"/>
                                <p>Select a psychologist to consult regarding a student or yourself.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </ChatLayout>
    );
}