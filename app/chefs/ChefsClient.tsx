"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";

interface Chef {
  _id: string;
  name: string;
  avatar: string;
  specialty: string;
  location: string;
  cuisines: string[];
  tags: string[];
  badge: string;
  pricePerEvent: number;
  rating: number;
  totalReviews: number;
  totalBookings: number;
  available: boolean;
  theaterMode: boolean;
  sosAvailable: boolean;
  signatureDish: string;
  countryBadge: string;
  color: string;
}

const FILTERS = [
  { key: "all", label: "All Chefs" },
  { key: "available", label: "Available Now" },
  { key: "theater", label: "Theater Mode" },
  { key: "sos", label: "SOS Ready" },
  { key: "budget", label: "Under $300" },
];

export default function ChefsClient() {
  const searchParams = useSearchParams();
  const [chefs, setChefs] = useState<Chef[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (searchParams.get("sos") === "true") setFilter("sos");
  }, [searchParams]);

  useEffect(() => {
    const fetchChefs = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter === "available") params.set("available", "true");
      if (filter === "theater") params.set("theater", "true");
      if (filter === "sos") params.set("sos", "true");
      if (filter === "budget") params.set("maxPrice", "300");
      const mood = searchParams.get("mood");
      if (mood) params.set("mood", mood);
      const cuisine = searchParams.get("cuisine");
      if (cuisine) params.set("cuisine", cuisine);
      try {
        const res = await fetch(`/api/chefs?${params}`);
        const data = await res.json();
        setChefs(Array.isArray(data) ? data : []);
      } catch { setChefs([]); }
      setLoading(false);
    };
    fetchChefs();
  }, [filter, searchParams]);

  const filtered = chefs.filter(c =>
    search === "" ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.specialty.toLowerCase().includes(search.toLowerCase()) ||
    c.cuisines.some(cu => cu.toLowerCase().includes(search.toLowerCase()))
  );

  const ac = (color: string) => color === "fire" ? "#ff5a28" : color === "gold" ? "#ffc14a" : "#00d4b4";
  const ac2 = (color: string) => color === "teal" ? "#00a8ff" : color === "fire" ? "#ffc14a" : "#a855f7";

  return (
    <main className="min-h-screen" style={{ background: "#020408" }}>
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="font-mono-custom text-xs text-[#00d4b4] tracking-[0.4em] mb-3 uppercase">◆ The Roster</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <h1 className="font-display text-4xl md:text-5xl text-white">EXPLORE <span className="text-fire">CHEFS</span></h1>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search name, cuisine, specialty..."
              className="md:w-72" style={{ background: "#0a1520", border: "1px solid rgba(0,212,180,0.15)", color: "#f0f4f8", padding: "10px 16px", fontFamily: "Syne, sans-serif", outline: "none" }} />
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className="font-mono-custom text-xs px-4 py-2 border tracking-widest transition-all duration-200"
                style={{ borderColor: filter === f.key ? "#00d4b4" : "#2a4a5a", color: filter === f.key ? "#00d4b4" : "#5a7a8a", background: filter === f.key ? "rgba(0,212,180,0.08)" : "transparent" }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3,4,5,6].map(i => <div key={i} className="h-80 animate-pulse" style={{ background: "#0a1520" }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="font-display text-xl text-[#5a7a8a] mb-4">NO CHEFS FOUND</div>
              <p className="text-sm text-[#2a4a5a] mb-6">Database may be empty. Seed demo data first.</p>
              <a href="/api/seed" target="_blank" className="btn-ghost inline-block">→ Seed Demo Chefs</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(chef => (
                <div key={chef._id} className="chef-card glow-teal overflow-hidden" style={{ background: "#0a1520" }}>
                  <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${ac(chef.color)}, ${ac2(chef.color)})` }} />
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex items-center justify-center font-display text-sm border"
                          style={{ background: `${ac(chef.color)}18`, color: ac(chef.color), borderColor: `${ac(chef.color)}44` }}>
                          {chef.avatar}
                          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2"
                            style={{ background: chef.available ? "#00d4b4" : "#ff5a28", borderColor: "#0a1520" }} />
                        </div>
                        <div>
                          <div className="font-display text-xs text-white tracking-wide">{chef.name}</div>
                          <div className="font-mono-custom text-[0.6rem] text-[#2a4a5a] mt-0.5">{chef.location}</div>
                        </div>
                      </div>
                      <span className="tag" style={{ background: `${ac(chef.color)}18`, color: ac(chef.color), border: `1px solid ${ac(chef.color)}44`, fontSize: "0.55rem" }}>{chef.badge}</span>
                    </div>
                    <p className="text-sm text-[#5a7a8a] mb-4 leading-relaxed">{chef.specialty}</p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {chef.tags.slice(0, 3).map(t => <span key={t} className="tag" style={{ background: `${ac(chef.color)}10`, color: ac(chef.color), border: `1px solid ${ac(chef.color)}30`, fontSize: "0.6rem" }}>{t}</span>)}
                      {chef.theaterMode && <span className="tag tag-gold" style={{ fontSize: "0.6rem" }}>🎭</span>}
                      {chef.sosAvailable && <span className="tag tag-fire" style={{ fontSize: "0.6rem" }}>⚡</span>}
                    </div>
                    {chef.signatureDish && (
                      <div className="py-3 border-t border-b border-[rgba(255,255,255,0.04)] mb-4">
                        <div className="font-mono-custom text-[0.55rem] text-[#2a4a5a] tracking-widest mb-1">SIGNATURE</div>
                        <div className="text-xs text-[#5a7a8a] truncate">{chef.signatureDish}</div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(s => <span key={s} style={{ color: chef.rating >= s ? "#ffc14a" : "#2a4a5a", fontSize: "0.7rem" }}>★</span>)}
                          <span className="font-mono-custom text-xs text-[#5a7a8a] ml-1">{chef.rating}</span>
                        </div>
                        <div className="font-mono-custom text-[0.6rem] text-[#2a4a5a] mt-0.5">{chef.totalReviews} reviews</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-xl" style={{ color: ac(chef.color) }}>${chef.pricePerEvent}</div>
                        <div className="font-mono-custom text-[0.6rem] text-[#2a4a5a]">per event</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/chefs/${chef._id}`} className="btn-ghost flex-1 text-center text-xs py-2 px-2">View</Link>
                      {chef.available
                        ? <Link href={`/book/${chef._id}`} className="btn-primary flex-1 text-center text-xs py-2 px-2">Book</Link>
                        : <button className="flex-1 text-xs py-2 px-2 border border-[#2a4a5a] text-[#2a4a5a] font-display tracking-widest cursor-not-allowed" disabled>Waitlist</button>
                      }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
