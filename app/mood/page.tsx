"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, GlassWater, Coffee, Compass, ArrowRight } from "lucide-react";
import Link from "next/link";

type Mood = "Romantic"|"Celebration"|"Comfort"|"Adventure";
const MOODS = [
  { id:"Romantic" as Mood, icon:Heart, color:"text-[#FF3D9A]", glow:"bg-[#FF3D9A]/20", desc:"Intimate, dimly lit, sensual flavors." },
  { id:"Celebration" as Mood, icon:GlassWater, color:"text-[#FFB547]", glow:"bg-[#FFB547]/20", desc:"Loud, vibrant, show-stopping dishes." },
  { id:"Comfort" as Mood, icon:Coffee, color:"text-white", glow:"bg-white/20", desc:"Familiar, warm, soul-soothing." },
  { id:"Adventure" as Mood, icon:Compass, color:"text-[#4DE5FF]", glow:"bg-[#4DE5FF]/20", desc:"Bold, experimental, boundary-pushing." },
];

interface Chef { _id:string; name:string; cuisine:string[]; imageUrl:string; rating:number; price:number; }

export default function MoodPage() {
  const [selected, setSelected] = useState<Mood|null>(null);
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    fetch(`/api/chefs?mood=${selected}`).then(r=>r.json()).then(d => { setChefs(Array.isArray(d)?d:[]); setLoading(false); });
  }, [selected]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto flex-grow">
      <div className="text-center mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-space font-bold mb-4">
          How do you want to <span className="font-editorial italic text-gradient-cyan">feel</span> tonight?
        </h1>
        <p className="text-white/60 max-w-2xl mx-auto">Select a mood to discover chefs who specialise in crafting that exact atmosphere.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
        {MOODS.map(mood => {
          const Icon = mood.icon;
          const isSelected = selected === mood.id;
          return (
            <motion.button key={mood.id} onClick={() => setSelected(mood.id)} whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              className={`relative h-64 rounded-3xl p-8 text-left transition-all duration-500 overflow-hidden group ${isSelected ? "border-2 border-white/50 bg-white/10" : "border border-white/10 glass-card hover:bg-white/5"}`}>
              <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[50px] transition-opacity duration-500 ${mood.glow} ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <Icon className={`w-10 h-10 ${isSelected ? mood.color : "text-white/40 group-hover:text-white"} transition-colors`} />
                <div>
                  <h3 className={`text-2xl font-space font-bold mb-2 ${isSelected ? "text-white" : "text-white/80"}`}>{mood.id}</h3>
                  <p className="text-sm text-white/50">{mood.desc}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key={selected} initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-40 }} transition={{ duration:0.5 }}>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-space font-bold">Chefs for <span className="text-gradient-amber">{selected}</span> evenings</h2>
              <Link href="/chefs" className="text-sm text-white/60 hover:text-white flex items-center gap-2 transition-colors">View All <ArrowRight className="w-4 h-4" /></Link>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{[1,2,3].map(i=><div key={i} className="glass-card h-64 animate-pulse" />)}</div>
            ) : chefs.length === 0 ? (
              <div className="text-center py-16 glass-card">
                <p className="text-white/60 mb-4">No chefs found for this mood.</p>
                <a href="/api/seed" target="_blank" className="text-[#FFB547] hover:underline text-sm">Seed demo data →</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {chefs.map((chef, idx) => (
                  <motion.div key={chef._id} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:idx*0.1 }} className="glass-card overflow-hidden group">
                    <Link href={`/chefs/${chef._id}`}>
                      <div className="relative h-56 overflow-hidden">
                        <img src={chef.imageUrl} alt={chef.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070710] via-[#070710]/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-editorial mb-1">{chef.name}</h3>
                          <p className="text-sm text-white/70">{chef.cuisine.join(" • ")}</p>
                        </div>
                      </div>
                      <div className="p-5 flex items-center justify-between">
                        <span className="font-space font-bold">${chef.price}<span className="text-xs text-white/50 font-normal">/pp</span></span>
                        <span className="flex items-center gap-1 text-sm text-white/70">★ {chef.rating}</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
