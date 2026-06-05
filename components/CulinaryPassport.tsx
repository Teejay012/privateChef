"use client";
import { useState } from "react";

const BADGES = [
  { country: "Japan", emoji: "🇯🇵", unlocked: true, cuisine: "Omakase", date: "Mar 2025" },
  { country: "France", emoji: "🇫🇷", unlocked: true, cuisine: "Haute Cuisine", date: "Jan 2025" },
  { country: "Nigeria", emoji: "🇳🇬", unlocked: true, cuisine: "Jollof Elevated", date: "Apr 2025" },
  { country: "Mexico", emoji: "🇲🇽", unlocked: true, cuisine: "Modern Mexican", date: "Feb 2025" },
  { country: "India", emoji: "🇮🇳", unlocked: false, cuisine: "Progressive Indian", date: null },
  { country: "Peru", emoji: "🇵🇪", unlocked: false, cuisine: "Nikkei Fusion", date: null },
  { country: "Lebanon", emoji: "🇱🇧", unlocked: false, cuisine: "Levantine", date: null },
  { country: "Korea", emoji: "🇰🇷", unlocked: false, cuisine: "Modern Korean", date: null },
  { country: "Thailand", emoji: "🇹🇭", unlocked: false, cuisine: "Regional Thai", date: null },
  { country: "Ethiopia", emoji: "🇪🇹", unlocked: false, cuisine: "Ethiopian Feast", date: null },
];

const CONTINENTS = [
  { name: "Asia", count: 2, total: 4, color: "teal" },
  { name: "Europe", count: 1, total: 3, color: "gold" },
  { name: "Africa", count: 1, total: 3, color: "fire" },
  { name: "Americas", count: 1, total: 3, color: "teal" },
  { name: "Middle East", count: 0, total: 2, color: "gold" },
];

export default function CulinaryPassport() {
  const [hovered, setHovered] = useState<string | null>(null);
  const unlocked = BADGES.filter((b) => b.unlocked).length;

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: explanation */}
          <div>
            <div className="font-mono text-xs text-[var(--accent-gold)] tracking-[0.4em] mb-4 uppercase">◆ Gamification</div>
            <h2 className="font-display text-4xl md:text-5xl mb-6">
              YOUR <span className="text-gradient-teal">CULINARY</span>
              <br />PASSPORT
            </h2>
            <p className="font-body text-[var(--text-muted)] leading-relaxed mb-8">
              Every cuisine you experience earns a country badge. Collect all 5 continents and unlock 
              <span className="text-[var(--accent-gold)]"> Platinum Explorer</span> status — with access to exclusive Michelin-starred chefs and invite-only tasting events.
            </p>

            {/* Continent progress */}
            <div className="flex flex-col gap-4">
              {CONTINENTS.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between font-mono text-xs mb-1">
                    <span className="text-[var(--text-muted)]">{c.name}</span>
                    <span className={`text-[var(--accent-${c.color})]`}>{c.count}/{c.total}</span>
                  </div>
                  <div className="h-1 bg-[var(--bg-card)]">
                    <div
                      className={`h-full transition-all duration-1000 ${
                        c.color === "teal" ? "bg-[var(--accent-teal)]" :
                        c.color === "gold" ? "bg-[var(--accent-gold)]" :
                        "bg-[var(--accent-fire)]"
                      }`}
                      style={{ width: `${(c.count / c.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="glow-border-teal p-4 bg-[var(--bg-card)]">
                <div className="font-display text-2xl text-gradient-teal">{unlocked}/10</div>
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest">BADGES EARNED</div>
              </div>
              <div className="glow-border-teal p-4 bg-[var(--bg-card)]">
                <div className="font-display text-2xl text-[var(--accent-gold)]">Silver</div>
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest">CURRENT RANK</div>
              </div>
            </div>
          </div>

          {/* Right: passport grid */}
          <div>
            <div className="glow-border-teal bg-[var(--bg-card)] p-8">
              <div className="flex justify-between items-center mb-6">
                <span className="font-display text-xs tracking-widest text-[var(--text-muted)]">PASSPORT — EXPLORER TIER</span>
                <span className="tag tag-gold">{unlocked} STAMPS</span>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {BADGES.map((badge) => (
                  <div
                    key={badge.country}
                    className="relative flex flex-col items-center gap-1 cursor-pointer"
                    onMouseEnter={() => setHovered(badge.country)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <div className={`w-12 h-12 flex items-center justify-center text-2xl border transition-all duration-200 ${
                      badge.unlocked
                        ? "border-[rgba(0,212,180,0.3)] bg-[rgba(0,212,180,0.05)] opacity-100"
                        : "border-[var(--text-dim)] bg-[var(--bg-deep)] opacity-30 grayscale"
                    }`}>
                      {badge.emoji}
                    </div>
                    <span className={`font-mono text-[0.5rem] tracking-wide ${badge.unlocked ? "text-[var(--text-muted)]" : "text-[var(--text-dim)]"}`}>
                      {badge.country}
                    </span>

                    {/* Tooltip */}
                    {hovered === badge.country && (
                      <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-10 w-36 p-2 bg-[var(--bg-deep)] border border-[rgba(0,212,180,0.2)] text-center">
                        <div className="font-display text-[0.6rem] text-[var(--accent-teal)] mb-0.5">{badge.cuisine}</div>
                        <div className="font-mono text-[0.55rem] text-[var(--text-dim)]">
                          {badge.unlocked ? `Earned ${badge.date}` : "Not yet visited"}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Unlock prompt */}
              <div className="mt-6 border-t border-[rgba(255,255,255,0.04)] pt-6">
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest mb-3">NEXT UNLOCK</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl opacity-40">🇮🇳</span>
                    <div>
                      <div className="font-body text-sm text-[var(--text-muted)]">Progressive Indian</div>
                      <div className="font-mono text-xs text-[var(--text-dim)]">Chef Raj Venkat available</div>
                    </div>
                  </div>
                  <button className="btn-ghost py-2 px-4 text-[0.65rem]">Book</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
