"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Filter, Star, ArrowRight } from "lucide-react";

interface Chef { _id:string; name:string; bio:string; cuisine:string[]; price:number; rating:number; reviews:number; availableNow:boolean; imageUrl:string; }
const FILTERS = ["All","Italian","Japanese","French","Southern","Contemporary","Spanish","Indian","Peruvian","Lebanese","Chinese","West African"];

export default function ChefsPage() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = new URLSearchParams();
    if (active !== "All") p.set("cuisine", active);
    fetch(`/api/chefs?${p}`).then(r=>r.json()).then(d=>{ setChefs(Array.isArray(d)?d:[]); setLoading(false); });
  }, [active]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto flex-grow">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-space font-bold mb-4">The <span className="font-editorial italic text-gradient-amber">Masters</span></h1>
          <p className="text-white/60">Discover world-class culinary talent available for your home.</p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scrollbar">
          <Filter className="w-5 h-5 text-white/40 mr-2 shrink-0" />
          {FILTERS.map(f => <button key={f} onClick={()=>setActive(f)} className={`px-4 py-2 rounded-full text-sm font-space whitespace-nowrap transition-colors ${active===f ? "bg-white text-obsidian font-bold" : "glass-card text-white/70 hover:text-white hover:bg-white/10"}`}>{f}</button>)}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{[1,2,3,4,5,6].map(i=><div key={i} className="glass-card h-96 animate-pulse" />)}</div>
      ) : chefs.length === 0 ? (
        <div className="text-center py-24"><p className="text-white/60 mb-4">No chefs found.</p><a href="/api/seed" target="_blank" className="text-amber hover:underline">Seed demo chefs →</a></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chefs.map((chef, idx) => (
            <motion.div key={chef._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.1 }} className="glass-card overflow-hidden group flex flex-col h-full">
              <Link href={`/chefs/${chef._id}`} className="flex flex-col h-full">
                <div className="relative h-72 overflow-hidden shrink-0">
                  <img src={chef.imageUrl} alt={chef.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />
                  {chef.availableNow && <div className="absolute top-4 left-4 px-3 py-1 bg-magenta/90 backdrop-blur-sm text-white text-xs font-bold rounded-full font-space flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-white animate-pulse" />AVAILABLE NOW</div>}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-editorial mb-1">{chef.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-white/80 font-space">
                      <span>{chef.cuisine[0]}</span><span className="w-1 h-1 rounded-full bg-white/50" /><span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber fill-amber" />{chef.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <p className="text-sm text-white/60 line-clamp-3 mb-6">{chef.bio}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                    <div className="flex flex-col"><span className="text-xs text-white/40 uppercase tracking-wider mb-1">Starting at</span><span className="font-space font-bold text-lg">${chef.price}<span className="text-xs text-white/50 font-normal">/pp</span></span></div>
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-obsidian transition-colors"><ArrowRight className="w-4 h-4" /></div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
