"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Filter, Star, ArrowRight } from "lucide-react";

interface Chef { 
  _id: string; 
  name: string; 
  bio: string; 
  cuisine: string[]; 
  price: number; 
  rating: number; 
  reviews: number; 
  availableNow: boolean; 
  imageUrl: string; 
}

const FILTERS = ["All", "Italian", "Japanese", "French", "Southern", "Contemporary", "Spanish", "Indian", "Peruvian", "Lebanese", "Chinese", "West African"];

export default function ChefsPage() {
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [active, setActive] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const p = new URLSearchParams();
    if (active !== "All") p.set("cuisine", active);
    
    setLoading(true);
    fetch(`/api/chefs?${p}`)
      .then((r) => r.json())
      .then((d) => { 
        setChefs(Array.isArray(d) ? d : []); 
        setLoading(false); 
      })
      .catch((err) => {
        console.error("Error loading chefs:", err);
        setLoading(false);
      });
  }, [active]);

  return (
    <div className="min-h-screen bg-[#070710] pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 max-w-7xl mx-auto flex-grow noise-bg relative">
      
      {/* 🌌 AMBIENT BACKGROUND SYSTEM TO MATCH LANDING */}
      <div className="absolute top-[-5%] right-[-10%] w-[45%] h-[45%] bg-[#FFB547]/5 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[50%] h-[50%] bg-[#FF3D9A]/5 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER CONTROLS (Restructured for adaptive stacking profiles) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-10 sm:mb-14 gap-6 relative z-10">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-space font-bold mb-3 tracking-tight">
            The <span className="font-editorial italic text-gradient-amber">Masters</span>
          </h1>
          <p className="text-sm sm:text-base text-white/60 max-w-md">
            Discover world-class culinary talent available for immersive dining experiences.
          </p>
        </div>

        {/* 📱 DEFENSIVE SCROLL WRAPPER (This explicitly fixes the horizontal mobile layout blowout) */}
        <div className="flex items-center gap-2 w-full lg:w-auto max-w-full overflow-hidden border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
          <Filter className="w-4 h-4 text-white/30 shrink-0 hidden sm:block" />
          <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full hide-scrollbar touch-pan-x active:cursor-grabbing">
            {FILTERS.map((f) => (
              <button 
                key={f} 
                onClick={() => setActive(f)} 
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-space whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  active === f 
                    ? "bg-white text-[#070710] font-bold shadow-lg scale-102" 
                    : "glass-card text-white/70 hover:text-white hover:bg-white/10 border border-white/5"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RENDER BODY CONTAINER */}
      <div className="relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card h-96 animate-pulse bg-white/5 border border-white/5" />
            ))}
          </div>
        ) : chefs.length === 0 ? (
          <div className="text-center py-20 sm:py-32 glass-card border border-white/5 p-8">
            <p className="text-base text-white/50 mb-4">No master chefs match the specified culinary filter criteria.</p>
            <Link href="/api/seed" target="_blank" className="text-sm text-[#FFB547] hover:underline font-space">
              Seed demo chefs into engine →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {chefs.map((chef, idx) => (
              <motion.div 
                key={chef._id} 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.05, duration: 0.4 }} 
                className="glass-card overflow-hidden group flex flex-col h-full border border-white/5 hover:border-white/20 transition-all duration-300"
              >
                <Link href={`/chefs/${chef._id}`} className="flex flex-col h-full">
                  
                  {/* Photo Canvas Component */}
                  <div className="relative h-60 sm:h-64 md:h-72 overflow-hidden shrink-0">
                    <img 
                      src={chef.imageUrl || "/placeholder-chef.jpg"} 
                      alt={chef.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070710] via-[#070710]/30 to-transparent" />
                    
                    {chef.availableNow && (
                      <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#FF3D9A]/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-bold rounded-full font-space flex items-center gap-1.5 tracking-wider shadow-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        AVAILABLE NOW
                      </div>
                    )}
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      {/* Responsive text scale prevents long names from breaking bounds */}
                      <h3 className="text-xl sm:text-2xl font-editorial text-white mb-1 drop-shadow-md truncate">
                        {chef.name}
                      </h3>
                      <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90 font-space drop-shadow-sm">
                        <span className="truncate max-w-[120px]">{chef.cuisine?.[0] || "Gastronomy"}</span>
                        <span className="w-1 h-1 rounded-full bg-white/60 shrink-0" />
                        <span className="flex items-center gap-1 shrink-0">
                          <Star className="w-3 h-3 text-[#FFB547] fill-[#FFB547]" />
                          {chef.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Text Details & Pricing Canvas */}
                  <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-[#070710]/20">
                    <p className="text-xs sm:text-sm text-white/60 line-clamp-3 mb-6 font-light leading-relaxed">
                      {chef.bio || "Crafting curated culinary interactions tailored precisely to client architectural flavor preferences."}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 uppercase tracking-widest mb-0.5">Starting at</span>
                        <span className="font-space font-bold text-base sm:text-lg text-white">
                          ${chef.price || "150"}
                          <span className="text-xs text-white/40 font-normal font-sans">/pp</span>
                        </span>
                      </div>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-[#070710] transition-all duration-300 group-hover:border-white shrink-0">
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>

                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}