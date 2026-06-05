"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Compass, Map, Video, MessageSquare, Lock } from "lucide-react";
import { useEffect, useState } from "react";

const features = [
  { icon: Sparkles, title: "AI Flavor DNA", desc: "Discover your unique cuisine personality.", path: "/flavor-dna", color: "text-[#FFB547]" },
  { icon: Video, title: "Chef Theater", desc: "Live narrated dining experience.", path: "/chefs", color: "text-[#FF3D9A]" },
  { icon: Zap, title: "SOS Dinner", desc: "Emergency dispatch under 2 hours.", path: "/sos", color: "text-[#4DE5FF]" },
  { icon: Compass, title: "Mood Booking", desc: "Match your meal to your emotion.", path: "/mood", color: "text-[#FFB547]" },
  { icon: Map, title: "Culinary Passport", desc: "Collect badges from around the world.", path: "/passport", color: "text-[#FF3D9A]" },
  { icon: Video, title: "Live Kitchen Cam", desc: "Watch the magic happen live.", path: "/chefs", color: "text-[#4DE5FF]" },
  { icon: MessageSquare, title: "Pre-Dinner Chat", desc: "Customize every detail directly.", path: "/dashboard", color: "text-[#FFB547]" },
  { icon: Lock, title: "Signature Reveal", desc: "Unlock secret dishes with loyalty.", path: "/chefs", color: "text-[#FF3D9A]" },
];

interface Chef { 
  _id: string; 
  name: string; 
  cuisine: string[]; 
  imageUrl: string; 
  rating: number; 
}

export default function HomePage() {
  const [chefs, setChefs] = useState<Chef[]>([]);

  useEffect(() => { 
    fetch("/api/chefs")
      .then((r) => r.json())
      .then((d) => { 
        if (Array.isArray(d)) setChefs(d.slice(0, 3)); 
      })
      .catch((err) => console.error("Error loading chefs:", err));
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070710] overflow-hidden noise-bg">
      {/* 🌌 AMBIENT BACKGROUND GLOWS (The Invisible Screen Setup) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#FFB547]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-[#FF3D9A]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-[#4DE5FF]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* MAIN CONTAINER */}
      <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto flex-grow relative z-10">
        
        {/* Hero Section */}
        <section className="text-center mb-32 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-space font-bold mb-6 leading-tight">
              The Future of <br />
              <span className="font-editorial italic text-gradient-amber">Private Dining</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-light">
              Experience culinary artistry in your home. Matched by AI, curated by mood, delivered with theatrical flair.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/flavor-dna" 
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#070710] font-space font-bold hover:bg-[#FFB547] transition-colors flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-5 h-5 group-hover:animate-pulse" /> Discover Your Flavor DNA
              </Link>
              <Link 
                href="/sos" 
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/10 transition-colors flex items-center justify-center gap-2 border-[#FF3D9A]/30 text-[#FF3D9A]"
              >
                <Zap className="w-5 h-5" /> SOS Dinner (Need a chef now?)
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-space font-bold">
              The <span className="font-editorial italic text-gradient-cyan">Aura</span> Experience
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  href={f.path} 
                  className="block h-full glass-card p-6 hover:border-white/30 transition-all duration-300 group"
                >
                  <f.icon className={`w-8 h-8 mb-4 ${f.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-space font-bold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/60">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Chefs Section */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-space font-bold">
              Featured <span className="font-editorial italic text-gradient-magenta">Visionaries</span>
            </h2>
            <Link 
              href="/chefs" 
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {chefs.length === 0 ? (
              [0, 1, 2].map((i) => (
                <div key={i} className="glass-card h-80 animate-pulse bg-white/5" />
              ))
            ) : (
              chefs.map((chef, idx) => (
                <motion.div 
                  key={chef._id} 
                  initial={{ opacity: 0, scale: 0.95 }} 
                  whileInView={{ opacity: 1, scale: 1 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: idx * 0.2 }} 
                  className="glass-card overflow-hidden group cursor-pointer"
                >
                  <Link href={`/chefs/${chef._id}`}>
                    <div className="relative h-80 overflow-hidden">
                      <img 
                        src={chef.imageUrl} 
                        alt={chef.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#070710] via-[#070710]/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-editorial mb-1">{chef.name}</h3>
                        <p className="text-sm text-white/70 font-space">{chef.cuisine.join(" • ")}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
          
          {chefs.length === 0 && (
            <div className="text-center mt-8">
              <Link 
                href="/api/seed" 
                target="_blank" 
                className="text-sm text-white/40 hover:text-[#FFB547] transition-colors border border-white/10 px-4 py-2 rounded-full hover:bg-white/5"
              >
                Seed demo chefs into cluster →
              </Link>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}