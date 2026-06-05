"use client";
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Video, Camera, Check, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Chef { _id:string; name:string; imageUrl:string; price:number; offersTheater:boolean; offersLiveCam:boolean; acceptsSOS:boolean; }

export default function BookingClient() {
  const { chefId } = useParams<{ chefId:string }>();
  const searchParams = useSearchParams();
  const isSOS = searchParams.get("sos") === "true";
  const router = useRouter();
  const { data: session, status } = useSession();

  const [chef, setChef] = useState<Chef|null>(null);
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState(2);
  const [mood, setMood] = useState("Romantic");
  const [address, setAddress] = useState("");
  const [addons, setAddons] = useState({ theater:false, cam:false });
  const [card, setCard] = useState({ name:"", number:"", expiry:"", cvv:"" });
  const [bookingId, setBookingId] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => { fetch(`/api/chefs/${chefId}`).then(r=>r.json()).then(setChef); }, [chefId]);
  useEffect(() => { if (status === "unauthenticated") router.push("/sign-in"); }, [status, router]);

  if (!chef || status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card p-12 animate-pulse w-64 h-32" />
    </div>
  );

  const base = chef.price * guests * (isSOS ? 1.5 : 1);
  const total = Math.round(base + (addons.theater ? 150 : 0) + (addons.cam ? 50 : 0));

  const createBooking = async () => {
    setLoading(true); setError("");
    const res = await fetch("/api/bookings", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ chefId, date, time, guests, mood, address, isSOS, theaterMode:addons.theater, liveCam:addons.cam }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setBookingId(data._id);
    setStep(3);
    setLoading(false);
  };

  const processPayment = async () => {
    if (!bookingId) return;
    setLoading(true); setError("");
    const res = await fetch("/api/payment", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({ bookingId }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Payment failed. Try again."); setLoading(false); return; }
    setConfirmed(true); setLoading(false);
  };

  if (confirmed) return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-xl mx-auto flex flex-col items-center justify-center text-center flex-grow">
      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:200}}
        className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFB547] to-[#FF3D9A] flex items-center justify-center mb-8">
        <Check className="w-12 h-12 text-white" />
      </motion.div>
      <h1 className="text-4xl font-space font-bold mb-4">Booking Confirmed!</h1>
      <p className="text-white/60 mb-8 text-lg">Your table with <strong className="text-white">{chef.name}</strong> is set. They'll reach out to finalize the menu.</p>
      <div className="glass-card p-6 w-full text-left mb-8 space-y-3">
        {!isSOS && <div className="flex justify-between text-sm"><span className="text-white/60">Date</span><span>{date} at {time}</span></div>}
        <div className="flex justify-between text-sm"><span className="text-white/60">Guests</span><span>{guests}</span></div>
        <div className="flex justify-between text-sm"><span className="text-white/60">Mood</span><span>{mood}</span></div>
        <div className="flex justify-between font-bold"><span>Total Paid</span><span className="text-[#FFB547]">${total}</span></div>
      </div>
      <div className="flex gap-4">
        <Link href="/dashboard" className="px-8 py-4 rounded-full bg-white text-[#070710] font-space font-bold hover:bg-[#FFB547] transition-colors">Go to Dashboard</Link>
        <Link href="/chefs" className="px-8 py-4 rounded-full glass-card hover:bg-white/10 transition-colors font-space font-medium">Browse More</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-3xl mx-auto flex-grow">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <Link href={`/chefs/${chef._id}`} className="text-sm text-white/50 hover:text-white flex items-center gap-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </Link>
          <span className="text-sm font-space text-white/50">Step {step} of 3</span>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <img src={chef.imageUrl} alt={chef.name} className="w-16 h-16 rounded-full object-cover border-2 border-white/10" />
          <div>
            <h1 className="text-2xl font-editorial">Booking {chef.name}</h1>
            {isSOS && <span className="text-xs font-bold text-[#FF3D9A] uppercase tracking-wider animate-pulse">⚡ SOS Dispatch</span>}
          </div>
        </div>
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div className={`h-full ${isSOS ? "bg-[#FF3D9A]" : "bg-[#FFB547]"}`}
            animate={{ width:`${step/3*100}%` }} transition={{ duration:0.4 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 — Details */}
        {step === 1 && (
          <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-5">
            <h2 className="text-3xl font-space font-bold mb-6">Event Details</h2>
            {!isSOS && (
              <div className="glass-card p-6">
                <label className="block text-sm font-space text-white/60 mb-3">Date</label>
                <input type="date" value={date} onChange={e=>setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-transparent border-b border-white/20 pb-2 text-xl font-space focus:outline-none focus:border-[#FFB547] transition-colors" />
              </div>
            )}
            <div className="glass-card p-6">
              <label className="block text-sm font-space text-white/60 mb-4">Time</label>
              <div className="flex flex-wrap gap-3">
                {["17:00","18:00","19:00","20:00","21:00"].map(t => (
                  <button key={t} onClick={()=>setTime(t)}
                    className={`px-5 py-2 rounded-full text-sm font-space transition-all ${time===t ? "bg-[#FFB547] text-[#070710] font-bold" : "glass-card text-white/60 hover:text-white"}`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <label className="block text-sm font-space text-white/60 mb-4">Guests</label>
              <div className="flex items-center justify-between">
                <button onClick={()=>setGuests(g=>Math.max(1,g-1))} className="w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 text-2xl">-</button>
                <span className="text-4xl font-space font-bold">{guests}</span>
                <button onClick={()=>setGuests(g=>Math.min(20,g+1))} className="w-12 h-12 rounded-full border border-white/20 hover:bg-white/10 text-2xl">+</button>
              </div>
            </div>
            <div className="glass-card p-6">
              <label className="block text-sm font-space text-white/60 mb-4">Dining Mood</label>
              <div className="grid grid-cols-2 gap-3">
                {["Romantic","Celebration","Comfort","Adventure"].map(m => (
                  <button key={m} onClick={()=>setMood(m)}
                    className={`py-3 px-4 rounded-xl border text-sm font-space font-medium transition-all ${mood===m ? "border-[#FFB547] bg-[#FFB547]/10 text-white" : "border-white/10 text-white/60 hover:border-white/30"}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="glass-card p-6">
              <label className="block text-sm font-space text-white/60 mb-3">Your Address</label>
              <input value={address} onChange={e=>setAddress(e.target.value)} placeholder="123 Main St, City, State"
                className="w-full bg-transparent border-b border-white/20 pb-2 text-lg font-space focus:outline-none focus:border-[#FFB547] transition-colors placeholder:text-white/20" />
            </div>
            <button onClick={()=>setStep(2)} disabled={!address||(!isSOS&&!date)}
              className="w-full py-4 rounded-xl bg-white text-[#070710] font-space font-bold hover:bg-[#FFB547] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Step 2 — Upgrades */}
        {step === 2 && (
          <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-5">
            <h2 className="text-3xl font-space font-bold mb-6">Enhance Your Evening</h2>
            {[
              { key:"theater" as const, icon:Video, label:"Chef Theater Mode", desc:"Your chef narrates each dish like a live performance.", price:150, available:chef.offersTheater },
              { key:"cam" as const, icon:Camera, label:"Live Kitchen Cam", desc:"HD stream of your chef at work. Share or save the highlight reel.", price:50, available:chef.offersLiveCam },
            ].map(opt => (
              <button key={opt.key} onClick={()=>opt.available && setAddons(a=>({...a,[opt.key]:!a[opt.key]}))} disabled={!opt.available}
                className={`w-full p-6 rounded-2xl border text-left transition-all duration-300 ${addons[opt.key] ? "border-[#FFB547] bg-[#FFB547]/10" : "glass-card hover:border-white/30"} ${!opt.available ? "opacity-40 cursor-not-allowed" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <opt.icon className={`w-6 h-6 mt-0.5 ${addons[opt.key]?"text-[#FFB547]":"text-white/60"}`} />
                    <div>
                      <h3 className="font-space font-bold mb-1">{opt.label}</h3>
                      <p className="text-sm text-white/60">{opt.desc}</p>
                      {!opt.available && <p className="text-xs text-white/40 mt-1 flex items-center gap-1"><Lock className="w-3 h-3" /> Not offered by this chef</p>}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="font-space font-bold">+${opt.price}</span>
                    {addons[opt.key] && <div className="w-6 h-6 rounded-full bg-[#FFB547] flex items-center justify-center mt-2 ml-auto"><Check className="w-3 h-3 text-[#070710]" /></div>}
                  </div>
                </div>
              </button>
            ))}
            <div className="glass-card p-6">
              <div className="flex justify-between text-sm mb-2 text-white/60"><span>Base ({guests} guests{isSOS?" × SOS 1.5×":""})</span><span>${Math.round(base)}</span></div>
              {addons.theater && <div className="flex justify-between text-sm mb-2 text-white/60"><span>Chef Theater</span><span>+$150</span></div>}
              {addons.cam && <div className="flex justify-between text-sm mb-2 text-white/60"><span>Live Cam</span><span>+$50</span></div>}
              <div className="flex justify-between font-space font-bold text-lg border-t border-white/10 pt-3 mt-3"><span>Total</span><span className="text-[#FFB547]">${total}</span></div>
            </div>
            <div className="flex gap-4">
              <button onClick={()=>setStep(1)} className="flex-1 py-4 rounded-xl glass-card hover:bg-white/10 transition-colors font-space font-medium flex items-center justify-center gap-2"><ArrowLeft className="w-4 h-4" /> Back</button>
              <button onClick={createBooking} disabled={loading}
                className="flex-1 py-4 rounded-xl bg-white text-[#070710] font-space font-bold hover:bg-[#FFB547] transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? "Creating…" : <><span>Continue to Pay</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </div>
            {error && <p className="text-[#FF3D9A] text-sm text-center">{error}</p>}
          </motion.div>
        )}

        {/* Step 3 — Payment */}
        {step === 3 && (
          <motion.div key="s3" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-5">
            <h2 className="text-3xl font-space font-bold mb-6">Payment</h2>
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFB547] via-[#FF3D9A] to-[#4DE5FF]" />
              <p className="text-xs font-space text-white/40 uppercase tracking-widest mb-6">Demo — no real charges</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Cardholder Name</label>
                  <input value={card.name} onChange={e=>setCard(c=>({...c,name:e.target.value}))} placeholder="Jane Smith"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#FFB547]/50 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Card Number</label>
                  <input value={card.number} onChange={e=>setCard(c=>({...c,number:e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim().slice(0,19)}))}
                    placeholder="4242 4242 4242 4242" maxLength={19}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:border-[#FFB547]/50 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Expiry</label>
                    <input value={card.expiry} onChange={e=>setCard(c=>({...c,expiry:e.target.value.replace(/\D/g,"").replace(/^(\d{2})(\d)/,"$1/$2").slice(0,5)}))}
                      placeholder="MM/YY" maxLength={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#FFB547]/50 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">CVV</label>
                    <input value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value.replace(/\D/g,"").slice(0,4)}))}
                      placeholder="•••" maxLength={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#FFB547]/50 transition-all" />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10 flex justify-between font-space font-bold text-xl">
                <span>Total Due</span><span className="text-[#FFB547]">${total}</span>
              </div>
            </div>
            {error && <p className="text-[#FF3D9A] text-sm text-center">{error}</p>}
            <button onClick={processPayment} disabled={loading||!card.name||!card.number||!card.expiry||!card.cvv}
              className="w-full py-4 rounded-xl bg-white text-[#070710] font-space font-bold text-lg hover:bg-[#FFB547] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Processing…" : <><span>Pay ${total}</span><ArrowRight className="w-5 h-5" /></>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
