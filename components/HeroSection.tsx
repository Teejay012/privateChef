"use client";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: "2,400+", label: "Elite Chefs" },
  { value: "94K+", label: "Dinners Served" },
  { value: "4.97", label: "Avg Rating" },
  { value: "120+", label: "Cuisines" },
];

const LIVE_ORDERS = [
  "Marco R. just booked a Chef in Milan",
  "Aisha K. ordered Omakase Experience in Lagos",
  "James T. booked SOS Dinner in New York",
  "Priya S. unlocked 🌍 Indian Passport Badge",
  "Chen W. started a Kitchen Cam session in Tokyo",
];

export default function HeroSection() {
  const [orderIdx, setOrderIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setOrderIdx((i) => (i + 1) % LIVE_ORDERS.length);
        setVisible(true);
      }, 500);
    }, 3500);
    return () => clearInterval(cycle);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden grid-bg">
      {/* Ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--accent-teal)] opacity-[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[var(--accent-fire)] opacity-[0.05] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-[var(--accent-purple)] opacity-[0.03] blur-[80px] pointer-events-none" />

      {/* Decorative corner elements */}
      <div className="absolute top-24 left-8 w-20 h-20 border-l-2 border-t-2 border-[rgba(0,212,180,0.2)] pointer-events-none" />
      <div className="absolute top-24 right-8 w-20 h-20 border-r-2 border-t-2 border-[rgba(0,212,180,0.2)] pointer-events-none" />
      <div className="absolute bottom-12 left-8 w-20 h-20 border-l-2 border-b-2 border-[rgba(255,90,40,0.2)] pointer-events-none" />
      <div className="absolute bottom-12 right-8 w-20 h-20 border-r-2 border-b-2 border-[rgba(255,90,40,0.2)] pointer-events-none" />

      {/* Rotating ring */}
      <div className="absolute top-32 right-20 w-32 h-32 opacity-10 animate-rotate-slow pointer-events-none hidden lg:block">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-teal)" strokeWidth="0.5" strokeDasharray="5 3" />
          <circle cx="50" cy="50" r="35" fill="none" stroke="var(--accent-fire)" strokeWidth="0.5" strokeDasharray="3 5" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
        {/* Live activity ticker */}
        <div className="flex items-center gap-3 mb-12">
          <div className="status-available" />
          <span
            className={`font-mono text-xs text-[var(--text-muted)] tracking-widest transition-all duration-500 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            {LIVE_ORDERS[orderIdx]}
          </span>
        </div>

        {/* Main headline */}
        <div className="max-w-5xl">
          <div className="font-mono text-xs text-[var(--accent-teal)] tracking-[0.4em] mb-6 uppercase">
            ◆ The Future of Private Dining
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight mb-8">
            <span className="text-[var(--text-primary)]">YOUR KITCHEN.</span>
            <br />
            <span className="text-gradient-teal">WORLD-CLASS</span>
            <br />
            <span className="text-[var(--text-primary)]">CHEF.</span>
            <span className="text-gradient-fire"> TONIGHT.</span>
          </h1>

          <p className="text-[var(--text-muted)] text-lg max-w-xl leading-relaxed font-body mb-10">
            Book elite private chefs who transform your home into a Michelin-starred experience. 
            With AI-matched cuisine profiles, live kitchen cams, and emergency same-day booking —
            dining will never be the same.
          </p>

          <div className="flex flex-wrap gap-4 mb-16">
            <button className="btn-primary">
              Explore Chefs
            </button>
            <button className="btn-ghost">
              Take Flavor Quiz
            </button>
            <button className="btn-fire">
              ⚡ SOS Dinner
            </button>
          </div>

          {/* Feature tags */}
          <div className="flex flex-wrap gap-3">
            {[
              { text: "AI Flavor DNA", color: "teal" },
              { text: "Live Kitchen Cam", color: "fire" },
              { text: "Chef Theater Mode", color: "gold" },
              { text: "Mood Booking", color: "teal" },
              { text: "Culinary Passport", color: "gold" },
              { text: "SOS Dinner <2hr", color: "fire" },
            ].map((tag) => (
              <span key={tag.text} className={`tag tag-${tag.color}`}>
                {tag.text}
              </span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-px bg-[rgba(0,212,180,0.08)]">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="bg-[var(--bg-void)] px-8 py-8 flex flex-col gap-2"
            >
              <span className="font-display text-3xl text-gradient-teal">{stat.value}</span>
              <span className="font-mono text-xs text-[var(--text-dim)] tracking-widest uppercase">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
