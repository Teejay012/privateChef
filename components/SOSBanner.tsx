"use client";
import { useState, useEffect } from "react";

export default function SOSBanner() {
  const [chefs, setChefs] = useState(14);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
      setChefs((n) => Math.max(8, Math.min(20, n + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div
        className="glow-border-fire py-16 md:py-20 relative scanline"
        style={{ background: "linear-gradient(135deg, #0d0500, #1a0800)" }}
      >
        {/* Background glow */}
        <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[var(--accent-fire)] opacity-[0.06] blur-[80px] pointer-events-none" />
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-[var(--accent-gold)] opacity-[0.04] blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-[var(--accent-fire)] animate-pulse-teal" style={{ animation: "pulse-teal 1s infinite" }} />
              <span className="font-mono text-xs text-[var(--accent-fire)] tracking-[0.3em] uppercase">Emergency Booking Active</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-[var(--text-primary)] mb-3">
              ⚡ SOS <span className="text-gradient-fire">DINNER</span>
            </h2>
            <p className="font-body text-[var(--text-muted)] max-w-md leading-relaxed">
              Forgot a dinner party? Last-minute guests? An emergency culinary brigade is on standby, 
              ready to deploy to your kitchen within 90 minutes. Anywhere. Tonight.
            </p>

            <div className="flex items-center gap-6 mt-6">
              <div>
                <div
                  className={`font-display text-3xl text-[var(--accent-fire)] transition-all duration-300 ${pulse ? "scale-125" : "scale-100"}`}
                >
                  {chefs}
                </div>
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest">CHEFS ON STANDBY</div>
              </div>
              <div>
                <div className="font-display text-3xl text-[var(--accent-gold)]">87<span className="text-lg"> min</span></div>
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest">AVG ARRIVAL</div>
              </div>
              <div>
                <div className="font-display text-3xl text-[var(--accent-teal)]">$45<span className="text-lg"> fee</span></div>
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest">SURGE PRICE</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 min-w-[200px]">
            <button className="btn-fire">
              ACTIVATE SOS NOW
            </button>
            <div className="font-mono text-xs text-[var(--text-dim)] text-center tracking-widest">
              RESPONSE GUARANTEED IN 15 MIN
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
