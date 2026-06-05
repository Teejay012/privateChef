"use client";
import { useState } from "react";

const MOODS = [
  {
    id: "romantic",
    emoji: "💑",
    label: "ROMANTIC",
    subtitle: "Intimate · Luxurious · Sensual",
    desc: "Candlelit courses. Champagne pairings. Dishes designed to slow time and amplify connection.",
    bg: "from-[#3d0a2e] to-[#1a0510]",
    accent: "#ff4d8f",
    chefs: ["Pierre Moreau", "Yara Khalil", "Sofia Aldana"],
    menu: ["Oyster Velouté · Champagne", "Duck Confit · Truffle Jus", "Dark Chocolate Soufflé"],
  },
  {
    id: "celebrate",
    emoji: "🥂",
    label: "CELEBRATE",
    subtitle: "Showstopping · Abundant · Joyful",
    desc: "Grand tasting menus. Spectacular presentations. Every course a standing ovation.",
    bg: "from-[#2a1a00] to-[#0d0800]",
    accent: "#ffc14a",
    chefs: ["Kenji Mori", "Ama Owusu", "Raj Venkat"],
    menu: ["Wagyu Carpaccio · Gold Leaf", "Lobster Thermidor", "Dessert Tasting Board × 8"],
  },
  {
    id: "comfort",
    emoji: "🏠",
    label: "COMFORT",
    subtitle: "Warm · Soulful · Familiar",
    desc: "Elevated soul food. Recipes that hug you. The warmth of home, cooked by a master.",
    bg: "from-[#0a1a10] to-[#050d08]",
    accent: "#00d4b4",
    chefs: ["Ama Owusu", "Yara Khalil", "Sofia Aldana"],
    menu: ["Slow-Braised Short Rib", "Hand-Rolled Pasta · Brown Butter", "Warm Sticky Toffee Pudding"],
  },
  {
    id: "adventure",
    emoji: "🗺️",
    label: "ADVENTURE",
    subtitle: "Wild · Unexpected · Transformative",
    desc: "Dishes you've never imagined. Techniques that defy expectation. A culinary journey with no map.",
    bg: "from-[#0a0a2a] to-[#050510]",
    accent: "#a855f7",
    chefs: ["Raj Venkat", "Kenji Mori", "Ama Owusu"],
    menu: ["Fermented Black Garlic · 60-day", "A5 Wagyu Miso Yaki", "Nitro-Frozen Yuzu Mochi"],
  },
];

export default function MoodBooking() {
  const [selected, setSelected] = useState<string | null>(null);
  const current = MOODS.find((m) => m.id === selected);

  return (
    <section id="explore" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-mono text-xs text-[var(--accent-gold)] tracking-[0.4em] mb-3 uppercase">◆ Mood Engine</div>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            HOW ARE YOU <span className="text-gradient-teal">FEELING</span> TONIGHT?
          </h2>
          <p className="text-[var(--text-muted)] font-body max-w-lg mx-auto">
            Skip the browsing. Tell us your mood and we'll assemble the perfect chef, menu, and atmosphere.
          </p>
        </div>

        {/* Mood cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelected(selected === mood.id ? null : mood.id)}
              className={`text-left p-8 relative overflow-hidden transition-all duration-400 border-2 ${
                selected === mood.id
                  ? "border-opacity-80 scale-[1.02]"
                  : "border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
              }`}
              style={{
                borderColor: selected === mood.id ? mood.accent : undefined,
                background: selected === mood.id ? `linear-gradient(135deg, ${mood.bg.replace("from-[", "").replace("]", "").split(" to-[")[0]}, ${mood.bg.split(" to-[")[1].replace("]", "")})` : "var(--bg-card)",
                boxShadow: selected === mood.id ? `0 0 30px ${mood.accent}22` : undefined,
              }}
            >
              <div className="text-5xl mb-5">{mood.emoji}</div>
              <div
                className="font-display text-xl mb-2"
                style={{ color: selected === mood.id ? mood.accent : "var(--text-primary)" }}
              >
                {mood.label}
              </div>
              <div className="font-mono text-[0.6rem] text-[var(--text-dim)] tracking-wider mb-3">
                {mood.subtitle}
              </div>
              <p className="font-body text-xs text-[var(--text-muted)] leading-relaxed">
                {mood.desc}
              </p>
              {selected === mood.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: mood.accent }}>
                  <span className="text-[var(--bg-void)] text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Expanded detail */}
        {current && (
          <div
            className="border p-8 md:p-12 transition-all duration-500"
            style={{ borderColor: `${current.accent}33`, background: `linear-gradient(135deg, var(--bg-card), var(--bg-deep))` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest mb-4">SUGGESTED CHEFS</div>
                <div className="flex flex-col gap-3">
                  {current.chefs.map((chef, i) => (
                    <div key={chef} className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center font-display text-xs" style={{ background: `${current.accent}18`, color: current.accent, border: `1px solid ${current.accent}33` }}>
                        {chef.split(" ").map(w => w[0]).join("")}
                      </div>
                      <span className="font-body text-sm text-[var(--text-muted)]">{chef}</span>
                      {i === 0 && <span className="tag tag-teal text-[0.55rem]">BEST MATCH</span>}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest mb-4">SAMPLE MENU</div>
                <div className="flex flex-col gap-3">
                  {current.menu.map((dish, i) => (
                    <div key={dish} className="flex items-start gap-3">
                      <span className="font-mono text-xs mt-0.5" style={{ color: current.accent }}>0{i + 1}</span>
                      <span className="font-body text-sm text-[var(--text-muted)]">{dish}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <div>
                  <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest mb-4">BOOKING OPTIONS</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-[var(--text-muted)]">Tonight</span>
                      <span style={{ color: current.accent }}>Available</span>
                    </div>
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-[var(--text-muted)]">This Weekend</span>
                      <span style={{ color: current.accent }}>3 Chefs Available</span>
                    </div>
                    <div className="flex justify-between font-body text-sm">
                      <span className="text-[var(--text-muted)]">Theater Mode</span>
                      <span style={{ color: current.accent }}>+$80 Upgrade</span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full py-3 px-6 font-display text-xs tracking-widest mt-6"
                  style={{
                    background: current.accent,
                    color: "var(--bg-void)",
                    clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  }}
                >
                  Book {current.label} Experience
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
