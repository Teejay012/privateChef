"use client";
import { useState } from "react";

const FEATURES = [
  {
    id: "sos",
    icon: "⚡",
    label: "SOS DINNER",
    headline: "Chef in under 2 hours",
    desc: "Forgot a dinner party? Need to impress last minute? Our SOS network of on-standby chefs can be at your door within 90 minutes. No excuses for a bad meal.",
    tag: "EMERGENCY",
    color: "fire",
    stat: "87 min avg. arrival",
  },
  {
    id: "theater",
    icon: "🎭",
    label: "CHEF THEATER",
    headline: "Dining as performance",
    desc: "Upgrade any booking to Theater Mode. Your chef becomes a storyteller — narrating each dish's origin, technique, and inspiration like a live cooking show in your home.",
    tag: "UPGRADE",
    color: "gold",
    stat: "Rated 4.99 by guests",
  },
  {
    id: "cam",
    icon: "🔴",
    label: "LIVE KITCHEN CAM",
    headline: "Watch the magic unfold",
    desc: "Opt into a private stream of your chef at work. Share with guests joining remotely, or save a highlight reel as a keepsake. The kitchen becomes the entertainment.",
    tag: "LIVE",
    color: "fire",
    stat: "HD + instant replay",
  },
  {
    id: "passport",
    icon: "🌍",
    label: "CULINARY PASSPORT",
    headline: "Eat the world. Earn badges.",
    desc: "Every new cuisine unlocks a country badge. Hit all 5 continents and earn Platinum Explorer status. Share your passport, compete with friends, unlock chef exclusives.",
    tag: "GAMIFIED",
    color: "teal",
    stat: "120+ countries mapped",
  },
  {
    id: "mood",
    icon: "💫",
    label: "MOOD BOOKING",
    headline: "Match your emotion, not just a menu",
    desc: "Tell us how you're feeling — Romantic, Celebratory, Comfort, or Adventurous — and our algorithm surfaces the perfect chef, menu, and vibe for that exact moment.",
    tag: "AI-POWERED",
    color: "teal",
    stat: "4.8× better matches",
  },
  {
    id: "consult",
    icon: "💬",
    label: "PRE-DINNER CONSULT",
    headline: "Co-design your menu",
    desc: "Async chat with your chef before the event. Share dietary needs, flavor dreams, and a few photos of your space. The chef curates a fully personalized experience.",
    tag: "EXCLUSIVE",
    color: "gold",
    stat: "Avg 3 messages exchanged",
  },
];

export default function FeaturesSection() {
  const [active, setActive] = useState("sos");
  const current = FEATURES.find((f) => f.id === active)!;

  return (
    <section id="experiences" className="py-24 bg-[var(--bg-deep)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-teal)] to-transparent opacity-30" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-fire)] to-transparent opacity-20" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-mono text-xs text-[var(--accent-fire)] tracking-[0.4em] mb-3 uppercase">◆ Innovations</div>
          <h2 className="font-display text-4xl md:text-5xl">
            FEATURES THAT <span className="text-gradient-fire">REDEFINE</span> DINING
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Feature list */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {FEATURES.map((f) => (
              <button
                key={f.id}
                onClick={() => setActive(f.id)}
                className={`text-left p-5 border transition-all duration-300 flex items-start gap-4 ${
                  active === f.id
                    ? f.color === "fire" ? "border-[var(--accent-fire)] bg-[rgba(255,90,40,0.06)]" :
                      f.color === "gold" ? "border-[var(--accent-gold)] bg-[rgba(255,193,74,0.06)]" :
                      "border-[var(--accent-teal)] bg-[rgba(0,212,180,0.06)]"
                    : "border-[rgba(255,255,255,0.04)] bg-[var(--bg-card)] hover:border-[rgba(255,255,255,0.08)]"
                }`}
              >
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <div className={`font-display text-xs tracking-widest mb-1 ${
                    active === f.id
                      ? f.color === "fire" ? "text-[var(--accent-fire)]" :
                        f.color === "gold" ? "text-[var(--accent-gold)]" :
                        "text-[var(--accent-teal)]"
                      : "text-[var(--text-dim)]"
                  }`}>
                    {f.label}
                  </div>
                  <div className="font-body text-sm text-[var(--text-muted)]">{f.headline}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-3">
            <div
              className={`h-full p-10 relative overflow-hidden ${
                current.color === "fire" ? "glow-border-fire" :
                "glow-border-teal"
              } bg-[var(--bg-card)] scanline`}
            >
              {/* Background glow */}
              <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-[80px] pointer-events-none ${
                current.color === "fire" ? "bg-[var(--accent-fire)]" :
                current.color === "gold" ? "bg-[var(--accent-gold)]" :
                "bg-[var(--accent-teal)]"
              }`} />

              <div className={`inline-block tag mb-6 ${
                current.color === "fire" ? "tag-fire" :
                current.color === "gold" ? "tag-gold" : "tag-teal"
              }`}>
                {current.tag}
              </div>

              <div className="text-6xl mb-6">{current.icon}</div>

              <h3 className={`font-display text-2xl md:text-3xl mb-5 ${
                current.color === "fire" ? "text-gradient-fire" :
                current.color === "gold" ? "text-[var(--accent-gold)]" :
                "text-gradient-teal"
              }`}>
                {current.headline.toUpperCase()}
              </h3>

              <p className="font-body text-[var(--text-muted)] leading-relaxed mb-8 text-base">
                {current.desc}
              </p>

              <div className="flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-6">
                <div>
                  <div className="font-mono text-xs text-[var(--text-dim)] tracking-widest mb-1">BENCHMARK</div>
                  <div className={`font-display text-lg ${
                    current.color === "fire" ? "text-[var(--accent-fire)]" :
                    current.color === "gold" ? "text-[var(--accent-gold)]" :
                    "text-[var(--accent-teal)]"
                  }`}>
                    {current.stat}
                  </div>
                </div>
                <button className={`${current.color === "fire" ? "btn-fire" : "btn-primary"}`}>
                  Explore Feature →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
