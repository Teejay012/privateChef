"use client";
import { useState } from "react";

const CHEFS = [
  {
    id: 1,
    name: "Kenji Mori",
    specialty: "Omakase & Modern Japanese",
    location: "Tokyo · Available Globally",
    rating: 4.98,
    reviews: 312,
    price: 380,
    tags: ["Omakase", "Kaiseki", "Sushi"],
    badge: "MICHELIN ★★",
    available: true,
    theater: true,
    avatar: "KM",
    color: "teal",
    bookings: 1240,
    signature: "🔒 Unlocked at 3 bookings",
  },
  {
    id: 2,
    name: "Sofia Aldana",
    specialty: "Modern Mexican & Fire Cooking",
    location: "Mexico City · Americas",
    rating: 4.97,
    reviews: 289,
    price: 290,
    tags: ["Tasting Menu", "Fermentation", "Mezcal Pairings"],
    badge: "TOP CHEF",
    available: true,
    theater: false,
    avatar: "SA",
    color: "fire",
    bookings: 876,
    signature: "🌮 Fire-Smoked Mole Noir",
  },
  {
    id: 3,
    name: "Ama Owusu",
    specialty: "West African Contemporary",
    location: "Lagos · West Africa · Europe",
    rating: 4.99,
    reviews: 156,
    price: 260,
    tags: ["Jollof Elevated", "Suya", "Modern African"],
    badge: "RISING STAR",
    available: true,
    theater: true,
    avatar: "AO",
    color: "gold",
    bookings: 432,
    signature: "🍖 Royal Egusi Ritual",
  },
  {
    id: 4,
    name: "Pierre Moreau",
    specialty: "Classic French Haute Cuisine",
    location: "Paris · London · New York",
    rating: 4.96,
    reviews: 445,
    price: 480,
    tags: ["Soufflé", "Truffle", "Wine Pairings"],
    badge: "MICHELIN ★",
    available: false,
    theater: true,
    avatar: "PM",
    color: "teal",
    bookings: 2100,
    signature: "🥐 Butter-Poached Lobster Royale",
  },
  {
    id: 5,
    name: "Yara Khalil",
    specialty: "Levantine & Eastern Mediterranean",
    location: "Beirut · Dubai · London",
    rating: 4.95,
    reviews: 203,
    price: 240,
    tags: ["Mezze", "Slow Lamb", "Rose Water"],
    badge: "BESTSELLER",
    available: true,
    theater: false,
    avatar: "YK",
    color: "gold",
    bookings: 654,
    signature: "🌹 Slow-Braised Lamb Arak",
  },
  {
    id: 6,
    name: "Raj Venkat",
    specialty: "Progressive Indian",
    location: "Mumbai · Singapore · Dubai",
    rating: 4.97,
    reviews: 178,
    price: 310,
    tags: ["Spice Lab", "Molecular", "Fermented"],
    badge: "INNOVATION",
    available: true,
    theater: true,
    avatar: "RV",
    color: "fire",
    bookings: 521,
    signature: "🔒 Unlocked at 3 bookings",
  },
];

const FILTERS = ["All", "Available Now", "Theater Mode", "Under $300", "Michelin"];

export default function ChefGrid() {
  const [active, setActive] = useState("All");
  const [hovered, setHovered] = useState<number | null>(null);

  const filtered = CHEFS.filter((c) => {
    if (active === "Available Now") return c.available;
    if (active === "Theater Mode") return c.theater;
    if (active === "Under $300") return c.price < 300;
    if (active === "Michelin") return c.badge.includes("MICHELIN");
    return true;
  });

  return (
    <section id="chefs" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="font-mono text-xs text-[var(--accent-teal)] tracking-[0.4em] mb-3 uppercase">◆ The Roster</div>
            <h2 className="font-display text-4xl md:text-5xl">
              ELITE <span className="text-gradient-fire">CHEFS</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`font-mono text-xs px-4 py-2 border transition-all duration-200 tracking-widest ${
                  active === f
                    ? "border-[var(--accent-teal)] text-[var(--accent-teal)] bg-[rgba(0,212,180,0.08)]"
                    : "border-[var(--text-dim)] text-[var(--text-dim)] hover:border-[var(--text-muted)] hover:text-[var(--text-muted)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((chef) => (
            <div
              key={chef.id}
              className="chef-card glow-border-teal bg-[var(--bg-card)] overflow-hidden cursor-pointer"
              onMouseEnter={() => setHovered(chef.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Top banner */}
              <div className={`h-1 w-full bg-gradient-to-r ${
                chef.color === "teal" ? "from-[var(--accent-teal)] to-[#00a8ff]" :
                chef.color === "fire" ? "from-[var(--accent-fire)] to-[var(--accent-gold)]" :
                "from-[var(--accent-gold)] to-[var(--accent-purple)]"
              }`} />

              <div className="p-6">
                {/* Avatar + Status */}
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 flex items-center justify-center font-display text-lg relative ${
                      chef.color === "teal" ? "bg-[rgba(0,212,180,0.1)] text-[var(--accent-teal)] border border-[rgba(0,212,180,0.3)]" :
                      chef.color === "fire" ? "bg-[rgba(255,90,40,0.1)] text-[var(--accent-fire)] border border-[rgba(255,90,40,0.3)]" :
                      "bg-[rgba(255,193,74,0.1)] text-[var(--accent-gold)] border border-[rgba(255,193,74,0.3)]"
                    }`}>
                      {chef.avatar}
                      <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-[var(--bg-card)] ${chef.available ? "bg-[var(--accent-teal)] animate-pulse-teal" : "bg-[var(--accent-fire)]"}`} />
                    </div>
                    <div>
                      <h3 className="font-display text-sm text-[var(--text-primary)] tracking-wide">{chef.name}</h3>
                      <div className="font-mono text-xs text-[var(--text-dim)] mt-0.5">{chef.location}</div>
                    </div>
                  </div>
                  <span className={`tag ${
                    chef.badge.includes("MICHELIN") ? "tag-teal" :
                    chef.badge.includes("FIRE") || chef.badge.includes("TOP") ? "tag-fire" : "tag-gold"
                  } text-[0.55rem]`}>
                    {chef.badge}
                  </span>
                </div>

                {/* Specialty */}
                <p className="font-body text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
                  {chef.specialty}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {chef.tags.map((t) => (
                    <span key={t} className={`tag tag-${chef.color} text-[0.6rem]`}>{t}</span>
                  ))}
                  {chef.theater && (
                    <span className="tag tag-gold text-[0.6rem]">🎭 Theater</span>
                  )}
                </div>

                {/* Signature */}
                <div className="border-t border-[rgba(255,255,255,0.04)] pt-4 mb-5">
                  <div className="font-mono text-[0.6rem] text-[var(--text-dim)] tracking-widest mb-1">SIGNATURE DISH</div>
                  <div className="font-body text-xs text-[var(--text-muted)]">{chef.signature}</div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <span key={s} className={`text-xs ${chef.rating >= s ? "star-filled" : "star-empty"}`}>★</span>
                      ))}
                      <span className="font-mono text-xs text-[var(--text-muted)] ml-1">{chef.rating}</span>
                    </div>
                    <div className="font-mono text-xs text-[var(--text-dim)]">{chef.reviews} reviews · {chef.bookings} dinners</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl text-[var(--accent-teal)]">${chef.price}</div>
                    <div className="font-mono text-[0.6rem] text-[var(--text-dim)]">per event</div>
                  </div>
                </div>

                {/* Book button */}
                <button
                  className={`w-full mt-4 ${chef.available ? "btn-primary" : "btn-ghost"}`}
                  disabled={!chef.available}
                >
                  {chef.available ? "Book This Chef" : "Join Waitlist"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="text-center mt-12">
          <button className="btn-ghost">
            View All 2,400+ Chefs
          </button>
        </div>
      </div>
    </section>
  );
}
