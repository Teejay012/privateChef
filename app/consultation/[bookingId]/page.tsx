"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Send, ArrowLeft, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Booking { _id:string; chefName:string; chefImageUrl:string; date:string; time:string; guests:number; mood:string; messages:Array<{from:"user"|"chef"; text:string; timestamp:string}>; }

const QUICK_REPLIES = ["No allergies, we eat everything!", "One guest is gluten-free.", "Can we make it extra spicy?", "We'd love a wine pairing suggestion."];

export default function ConsultationPage() {
  const { bookingId } = useParams<{ bookingId:string }>();
  const { data: session } = useSession();
  const [booking, setBooking] = useState<Booking|null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/bookings/${bookingId}`).then(r=>r.json()).then(setBooking);
  }, [bookingId]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [booking?.messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim() || sending) return;
    setSending(true); setInput("");
    const res = await fetch(`/api/bookings/${bookingId}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ message:text, from:"user" }) });
    const updated = await res.json();
    setBooking(updated);
    // Simulate chef auto-reply
    setTimeout(async () => {
      const replies = [
        "Perfect, I've noted that down. I'll tailor the menu specifically for you.",
        "Wonderful! I have something special planned — you'll love what I'm preparing.",
        "Noted! I'll make sure every detail is exactly right for your evening.",
        "Great choice! I'm already excited about the menu I'm crafting for you.",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const res2 = await fetch(`/api/bookings/${bookingId}`, { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ message:reply, from:"chef" }) });
      const updated2 = await res2.json();
      setBooking(updated2);
      setSending(false);
    }, 1800);
  };

  if (!booking) return <div className="min-h-screen flex items-center justify-center"><div className="glass-card w-64 h-32 animate-pulse" /></div>;

  return (
    <div className="min-h-screen pt-24 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 pb-6 flex-grow">
      {/* Sidebar */}
      <div className="w-full md:w-1/3 flex flex-col gap-6 pt-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /><span>Back to Dashboard</span>
        </Link>
        <div className="glass-card p-6 flex flex-col items-center text-center">
          <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#FFB547]/30">
            <img src={booking.chefImageUrl || "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80"} alt={booking.chefName} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-[#070710] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </div>
          </div>
          <h2 className="text-xl font-space font-bold">{booking.chefName}</h2>
          <p className="text-white/60 text-sm mb-4">Pre-Dinner Consultation</p>
          <div className="w-full bg-white/5 rounded-xl p-4 flex items-center gap-3 text-left mb-6">
            <div className="w-10 h-10 rounded-full bg-[#FFB547]/20 flex items-center justify-center shrink-0"><Clock className="w-5 h-5 text-[#FFB547]" /></div>
            <div><p className="text-sm font-medium">Upcoming Event</p><p className="text-xs text-white/60">{booking.date ? new Date(booking.date).toLocaleDateString() : "TBD"} at {booking.time} • {booking.guests} Guests</p></div>
          </div>
          <div className="w-full text-left">
            <h3 className="text-sm font-space font-bold text-white/80 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#FFB547]" /> Suggested Replies</h3>
            <div className="flex flex-col gap-2">
              {QUICK_REPLIES.map(r => (
                <button key={r} onClick={()=>sendMessage(r)} className="text-left text-xs px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#FFB547]/30 hover:bg-white/10 transition-colors text-white/70">{r}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col glass-card overflow-hidden" style={{ minHeight:"60vh" }}>
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-space font-medium">{booking.chefName}</span>
          <span className="text-xs text-white/40">· Online</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {booking.messages.length === 0 && (
            <div className="text-center text-white/30 text-sm py-8">Start the conversation with your chef!</div>
          )}
          {booking.messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} className={`flex ${msg.from==="user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.from==="user" ? "bg-[#FFB547]/20 border border-[#FFB547]/30 text-white" : "bg-white/5 border border-white/10 text-white/90"}`}>
                <p className={`text-[10px] mb-1 font-space uppercase tracking-wider ${msg.from==="user" ? "text-[#FFB547]" : "text-white/40"}`}>{msg.from==="user" ? "You" : booking.chefName}</p>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay:`${i*0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="p-4 border-t border-white/10">
          <form onSubmit={e=>{e.preventDefault();sendMessage();}} className="flex gap-3">
            <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Message your chef…" className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 transition-all" />
            <button type="submit" disabled={!input.trim() || sending} className="w-12 h-12 rounded-xl bg-[#FFB547] text-[#070710] flex items-center justify-center hover:bg-[#FFB547]/80 transition-colors disabled:opacity-40">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
