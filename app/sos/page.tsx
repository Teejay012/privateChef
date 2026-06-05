"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, MapPin, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Chef { _id:string; name:string; bio:string; cuisine:string[]; price:number; imageUrl:string; }

export default function SOSPage() {
  const [timeLeft, setTimeLeft] = useState(7200);
  const [chefs, setChefs] = useState<Chef[]>([]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => p > 0 ? p-1 : 0), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fetch("/api/chefs?sos=true").then(r=>r.json()).then(d => setChefs(Array.isArray(d)?d:[]));
  }, []);

  const fmt = (s:number) => {
    const h=Math.floor(s/3600), m=Math.floor(s%3600/60), ss=s%60;
    return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(ss).padStart(2,"0")}`;
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto relative flex-grow">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-[#FF3D9A]/5 blur-[150px] animate-pulse-slow pointer-events-none" />

      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FF3D9A]/10 border border-[#FF3D9A]/30 mb-6 text-[#FF3D9A] animate-pulse">
          <AlertTriangle className="w-10 h-10" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-space font-bold mb-4">
          <span className="text-gradient-magenta">SOS</span> Dinner
        </h1>
        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">Emergency dispatch. A world-class chef at your door in under 2 hours.</p>
        <div className="inline-flex flex-col items-center justify-center p-8 rounded-3xl border border-[#FF3D9A]/30 bg-[#FF3D9A]/5 backdrop-blur-md">
          <span className="text-sm font-space text-[#FF3D9A] uppercase tracking-widest mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Guaranteed Dispatch Window
          </span>
          <div className="text-4xl sm:text-5xl md:text-6xl font-space font-bold text-white tracking-wider tabular-nums">{fmt(timeLeft)}</div>
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-space font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-[#FF3D9A]" /> Available Right Now</h2>
          <span className="text-sm text-white/50 flex items-center gap-1"><MapPin className="w-4 h-4" /> Near You</span>
        </div>

        {chefs.length === 0 ? (
          <div className="text-center py-16 glass-card border-[#FF3D9A]/20">
            <p className="text-white/60 mb-4">No chefs available right now.</p>
            <a href="/api/seed" target="_blank" className="text-[#FF3D9A] hover:underline text-sm">Seed demo data to see chefs →</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {chefs.map((chef, idx) => (
              <motion.div key={chef._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.1 }}
                className="glass-card overflow-hidden group border-[#FF3D9A]/20 hover:border-[#FF3D9A]/50 transition-colors">
                <div className="flex flex-col sm:flex-row h-full">
                  <div className="w-full sm:w-2/5 h-64 sm:h-auto relative overflow-hidden shrink-0">
                    <img src={chef.imageUrl} alt={chef.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 left-4 px-3 py-1 bg-[#FF3D9A] text-white text-xs font-bold rounded-full font-space animate-pulse">READY TO DISPATCH</div>
                  </div>
                  <div className="w-full sm:w-3/5 p-6 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-editorial mb-1">{chef.name}</h3>
                      <p className="text-sm text-white/60 font-space mb-4">{chef.cuisine.join(" • ")}</p>
                      <p className="text-sm text-white/80 line-clamp-3 mb-4">{chef.bio}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                      <span className="font-space font-bold text-lg">${Math.round(chef.price*1.5)}<span className="text-xs text-white/50 font-normal">/person (Rush)</span></span>
                      <Link href={`/book/${chef._id}?sos=true`} className="px-6 py-2 rounded-full bg-[#FF3D9A] text-white font-space font-bold text-sm hover:bg-[#FF3D9A]/80 transition-colors flex items-center gap-2">
                        Dispatch <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
