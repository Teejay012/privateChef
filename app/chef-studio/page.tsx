"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, Save, Eye, EyeOff, Plus, Trash2, Upload,
  DollarSign, Star, MapPin, Clock, Video, Camera, Zap,
  BookOpen, Lock, Unlock, CheckCircle2, AlertCircle
} from "lucide-react";
import Link from "next/link";

const CUISINE_OPTIONS = [
  "Italian","Japanese","French","Spanish","Indian","Mexican",
  "Peruvian","Lebanese","Chinese","West African","Korean",
  "Thai","Greek","Turkish","Nordic","Modernist","Other"
];
const MOOD_OPTIONS = ["Romantic","Celebration","Comfort","Adventure"];

interface ChefProfile {
  _id?: string;
  name: string;
  bio: string;
  location: string;
  cuisine: string[];
  moods: string[];
  price: number;
  imageUrl: string;
  acceptsSOS: boolean;
  offersTheater: boolean;
  offersLiveCam: boolean;
  signatureDish: { name: string; description: string; imageUrl: string };
  lockedSignatureDish: { name: string; description: string; imageUrl: string; bookingsRequired: number };
  availableNow: boolean;
  rating?: number;
  reviews?: number;
  earnings?: number;
}

const EMPTY: ChefProfile = {
  name: "", bio: "", location: "", cuisine: [], moods: [], price: 150,
  imageUrl: "", acceptsSOS: false, offersTheater: false, offersLiveCam: false,
  signatureDish: { name: "", description: "", imageUrl: "" },
  lockedSignatureDish: { name: "", description: "", imageUrl: "", bookingsRequired: 3 },
  availableNow: true,
};

type Tab = "profile" | "dishes" | "availability" | "earnings";

export default function ChefStudioPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chef, setChef] = useState<ChefProfile>(EMPTY);
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [isNewChef, setIsNewChef] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/sign-in"); return; }
    if (status === "loading" || !session?.user?.id) return;
    // Check if user is a chef
    fetch(`/api/chefs/by-user/${session.user.id}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data && data._id) {
          setChef(data);
          setIsNewChef(false);
        } else {
          // Pre-fill name from session
          setChef(c => ({ ...c, name: session.user?.name ?? "" }));
        }
      });
  }, [session, status, router]);

  const set = (field: keyof ChefProfile, value: unknown) =>
    setChef(c => ({ ...c, [field]: value }));

  const setNested = (parent: "signatureDish" | "lockedSignatureDish", field: string, value: string | number) =>
    setChef(c => ({ ...c, [parent]: { ...c[parent], [field]: value } }));

  const toggleCuisine = (c: string) =>
    set("cuisine", chef.cuisine.includes(c) ? chef.cuisine.filter(x => x !== c) : [...chef.cuisine, c]);

  const toggleMood = (m: string) =>
    set("moods", chef.moods.includes(m) ? chef.moods.filter(x => x !== m) : [...chef.moods, m]);

  const handleSave = async () => {
    setSaving(true); setSaveStatus("idle");
    try {
      const res = await fetch(`/api/chefs/by-user/${session!.user!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chef),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setChef(saved);
      setIsNewChef(false);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch {
      setSaveStatus("error");
    }
    setSaving(false);
  };

  if (status === "loading") return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass-card w-64 h-32 animate-pulse" />
    </div>
  );

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <ChefHat className="w-4 h-4" /> },
    { id: "dishes", label: "Dishes", icon: <BookOpen className="w-4 h-4" /> },
    { id: "availability", label: "Availability", icon: <Clock className="w-4 h-4" /> },
    { id: "earnings", label: "Earnings", icon: <DollarSign className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto flex-grow">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB547] to-[#FF3D9A] flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-3xl font-space font-bold">Chef Studio</h1>
            {!isNewChef && (
              <span className="px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 text-xs font-medium">Live</span>
            )}
          </div>
          <p className="text-white/50 text-sm">
            {isNewChef ? "Create your chef profile to start receiving bookings." : "Manage your profile, dishes, and availability."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isNewChef && (
            <Link href={`/chefs/${chef._id}`} target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-card hover:bg-white/10 transition-colors text-sm font-space font-medium text-white/70">
              <Eye className="w-4 h-4" /> View Public Profile
            </Link>
          )}
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-[#070710] font-space font-bold text-sm hover:bg-[#FFB547] transition-colors disabled:opacity-60">
            {saving ? (
              <><span className="animate-spin">↻</span> Saving…</>
            ) : saveStatus === "saved" ? (
              <><CheckCircle2 className="w-4 h-4 text-green-600" /> Saved!</>
            ) : saveStatus === "error" ? (
              <><AlertCircle className="w-4 h-4 text-red-500" /> Error</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>

      {/* Stats row (only when profile exists) */}
      {!isNewChef && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Rating", value: chef.rating?.toFixed(1) ?? "—", icon: <Star className="w-4 h-4 text-[#FFB547]" />, color: "text-[#FFB547]" },
            { label: "Reviews", value: chef.reviews ?? 0, icon: <Star className="w-4 h-4 text-white/40" />, color: "text-white" },
            { label: "Earnings", value: `$${chef.earnings ?? 0}`, icon: <DollarSign className="w-4 h-4 text-green-400" />, color: "text-green-400" },
            { label: "Status", value: chef.availableNow ? "Available" : "Offline", icon: <div className={`w-2 h-2 rounded-full ${chef.availableNow ? "bg-green-400 animate-pulse" : "bg-white/30"}`} />, color: chef.availableNow ? "text-green-400" : "text-white/40" },
          ].map(s => (
            <div key={s.label} className="glass-card p-5">
              <div className="flex items-center gap-2 text-white/50 text-xs uppercase tracking-wider mb-2">
                {s.icon} {s.label}
              </div>
              <div className={`text-2xl font-space font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 glass-card rounded-2xl w-full md:w-fit mb-10 overflow-x-auto hide-scrollbar">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-space font-medium transition-all whitespace-nowrap ${tab === t.id ? "bg-white text-[#070710]" : "text-white/60 hover:text-white"}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column */}
            <div className="space-y-6">
              <div className="glass-card p-8">
                <h2 className="text-lg font-space font-bold mb-6">Basic Information</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Chef Name</label>
                    <input value={chef.name} onChange={e => set("name", e.target.value)}
                      placeholder="Your professional name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 focus:bg-white/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Bio</label>
                    <textarea value={chef.bio} onChange={e => set("bio", e.target.value)}
                      placeholder="Tell clients about your culinary journey, training, and philosophy…"
                      rows={5} style={{ resize: "none" }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 focus:bg-white/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">
                      <MapPin className="w-3 h-3 inline mr-1" /> Base Location
                    </label>
                    <input value={chef.location} onChange={e => set("location", e.target.value)}
                      placeholder="e.g. New York, NY · Available Nationwide"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 focus:bg-white/10 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Profile Photo URL</label>
                    <input value={chef.imageUrl} onChange={e => set("imageUrl", e.target.value)}
                      placeholder="https://images.unsplash.com/…"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 focus:bg-white/10 transition-all" />
                    {chef.imageUrl && (
                      <div className="mt-3 w-24 h-24 rounded-2xl overflow-hidden border border-white/10">
                        <img src={chef.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h2 className="text-lg font-space font-bold mb-2">Base Rate</h2>
                <p className="text-sm text-white/50 mb-6">Price per person. SOS bookings automatically charge 1.5× your base rate.</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-[#FFB547]">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <input type="number" min={50} max={2000} value={chef.price} onChange={e => set("price", Number(e.target.value))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-2xl font-space font-bold focus:outline-none focus:border-[#FFB547]/50 transition-all" />
                  </div>
                  <span className="text-white/50 text-sm font-space">/person</span>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              <div className="glass-card p-8">
                <h2 className="text-lg font-space font-bold mb-2">Cuisine Specialties</h2>
                <p className="text-sm text-white/50 mb-6">Select all that apply. This powers Mood and Flavor DNA matching.</p>
                <div className="flex flex-wrap gap-2">
                  {CUISINE_OPTIONS.map(c => (
                    <button key={c} onClick={() => toggleCuisine(c)}
                      className={`px-4 py-2 rounded-full text-sm font-space transition-all ${chef.cuisine.includes(c) ? "bg-[#FFB547] text-[#070710] font-bold" : "glass-card text-white/60 hover:text-white hover:bg-white/10"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8">
                <h2 className="text-lg font-space font-bold mb-2">Mood Specialties</h2>
                <p className="text-sm text-white/50 mb-6">Which dining atmospheres do you excel at creating?</p>
                <div className="grid grid-cols-2 gap-3">
                  {MOOD_OPTIONS.map(m => (
                    <button key={m} onClick={() => toggleMood(m)}
                      className={`py-3 px-4 rounded-xl border text-sm font-space font-medium transition-all ${chef.moods.includes(m) ? "border-[#FF3D9A] bg-[#FF3D9A]/10 text-white" : "border-white/10 text-white/60 hover:border-white/30"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live preview card */}
              {chef.name && (
                <div className="glass-card overflow-hidden border-[#FFB547]/20">
                  <div className="px-4 py-2 border-b border-white/10 flex items-center gap-2">
                    <Eye className="w-3 h-3 text-white/40" />
                    <span className="text-xs text-white/40 font-space">Card Preview</span>
                  </div>
                  <div className="relative h-48 overflow-hidden">
                    {chef.imageUrl
                      ? <img src={chef.imageUrl} alt={chef.name} className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.background = "#111"; }} />
                      : <div className="w-full h-full bg-gradient-to-br from-[#FFB547]/20 to-[#FF3D9A]/20 flex items-center justify-center"><ChefHat className="w-12 h-12 text-white/20" /></div>
                    }
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070710] via-[#070710]/20 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <h3 className="text-xl font-editorial mb-1">{chef.name}</h3>
                      <p className="text-sm text-white/70">{chef.cuisine.slice(0, 2).join(" • ") || "Cuisine TBD"}</p>
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-white/60 text-sm">${chef.price}/person</span>
                    <div className="flex gap-2">
                      {chef.offersTheater && <Video className="w-4 h-4 text-[#FF3D9A]" />}
                      {chef.offersLiveCam && <Camera className="w-4 h-4 text-[#4DE5FF]" />}
                      {chef.acceptsSOS && <Zap className="w-4 h-4 text-[#FFB547]" />}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── DISHES TAB ── */}
        {tab === "dishes" && (
          <motion.div key="dishes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Signature dish */}
            <div className="glass-card p-8 border-[#FFB547]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FFB547]/20 flex items-center justify-center">
                  <Unlock className="w-5 h-5 text-[#FFB547]" />
                </div>
                <div>
                  <h2 className="text-lg font-space font-bold">Signature Dish</h2>
                  <p className="text-xs text-white/50">Visible to all visitors on your profile</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Dish Name</label>
                  <input value={chef.signatureDish.name} onChange={e => setNested("signatureDish", "name", e.target.value)}
                    placeholder="e.g. Truffle Sphere Carbonara"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 focus:bg-white/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Description</label>
                  <textarea value={chef.signatureDish.description} onChange={e => setNested("signatureDish", "description", e.target.value)}
                    placeholder="A short, evocative description of this dish…"
                    rows={3} style={{ resize: "none" }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 focus:bg-white/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Photo URL</label>
                  <input value={chef.signatureDish.imageUrl} onChange={e => setNested("signatureDish", "imageUrl", e.target.value)}
                    placeholder="https://images.unsplash.com/…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FFB547]/50 focus:bg-white/10 transition-all" />
                </div>
                {chef.signatureDish.imageUrl && (
                  <div className="rounded-2xl overflow-hidden h-40 border border-white/10">
                    <img src={chef.signatureDish.imageUrl} alt="preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
            </div>

            {/* Locked dish */}
            <div className="glass-card p-8 border-[#FF3D9A]/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#FF3D9A]/20 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-[#FF3D9A]" />
                </div>
                <div>
                  <h2 className="text-lg font-space font-bold">Locked Signature Dish</h2>
                  <p className="text-xs text-white/50">Revealed after a client books you N times</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Dish Name</label>
                  <input value={chef.lockedSignatureDish.name} onChange={e => setNested("lockedSignatureDish", "name", e.target.value)}
                    placeholder="e.g. The Golden Tiramisu"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3D9A]/50 focus:bg-white/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Description</label>
                  <textarea value={chef.lockedSignatureDish.description} onChange={e => setNested("lockedSignatureDish", "description", e.target.value)}
                    placeholder="Describe the mystery that awaits loyal clients…"
                    rows={3} style={{ resize: "none" }}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3D9A]/50 focus:bg-white/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Photo URL</label>
                  <input value={chef.lockedSignatureDish.imageUrl} onChange={e => setNested("lockedSignatureDish", "imageUrl", e.target.value)}
                    placeholder="https://images.unsplash.com/…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF3D9A]/50 focus:bg-white/10 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Unlock after N bookings</label>
                  <div className="flex items-center gap-4">
                    <button onClick={() => setNested("lockedSignatureDish", "bookingsRequired", Math.max(1, chef.lockedSignatureDish.bookingsRequired - 1))}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-lg">-</button>
                    <span className="text-2xl font-space font-bold text-[#FF3D9A] w-8 text-center">{chef.lockedSignatureDish.bookingsRequired}</span>
                    <button onClick={() => setNested("lockedSignatureDish", "bookingsRequired", Math.min(10, chef.lockedSignatureDish.bookingsRequired + 1))}
                      className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-lg">+</button>
                  </div>
                </div>
                {chef.lockedSignatureDish.imageUrl && (
                  <div className="rounded-2xl overflow-hidden h-40 border border-[#FF3D9A]/20 relative">
                    <img src={chef.lockedSignatureDish.imageUrl} alt="preview" className="w-full h-full object-cover blur-sm grayscale" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-[#070710]/80 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 text-sm">
                        <Lock className="w-4 h-4 text-[#FF3D9A]" /> Locked Preview
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── AVAILABILITY TAB ── */}
        {tab === "availability" && (
          <motion.div key="avail" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl space-y-6">
            {/* Toggle availability */}
            <div className="glass-card p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-space font-bold mb-1">Available for Bookings</h2>
                  <p className="text-sm text-white/50">When off, your profile is hidden from search results.</p>
                </div>
                <button onClick={() => set("availableNow", !chef.availableNow)}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${chef.availableNow ? "bg-green-500" : "bg-white/20"}`}>
                  <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all duration-300 ${chef.availableNow ? "left-9" : "left-1"}`} />
                </button>
              </div>
            </div>

            {/* Experience toggles */}
            <div className="glass-card p-8 space-y-6">
              <h2 className="text-lg font-space font-bold">Experience Offerings</h2>
              {[
                { key: "offersTheater" as const, icon: <Video className="w-5 h-5 text-[#FF3D9A]" />, label: "Chef Theater Mode", desc: "You narrate and perform each dish. +$150 per booking.", color: "border-[#FF3D9A]/40 bg-[#FF3D9A]/5" },
                { key: "offersLiveCam" as const, icon: <Camera className="w-5 h-5 text-[#4DE5FF]" />, label: "Live Kitchen Cam", desc: "HD stream of you cooking. Clients can share or replay. +$50.", color: "border-[#4DE5FF]/40 bg-[#4DE5FF]/5" },
                { key: "acceptsSOS" as const, icon: <Zap className="w-5 h-5 text-[#FFB547]" />, label: "SOS Dispatch Available", desc: "Be called for emergency same-day bookings. 1.5× your rate.", color: "border-[#FFB547]/40 bg-[#FFB547]/5" },
              ].map(opt => (
                <div key={opt.key}
                  onClick={() => set(opt.key, !chef[opt.key])}
                  className={`flex items-start gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 ${chef[opt.key] ? opt.color : "border-white/10 hover:border-white/20"}`}>
                  <div className="mt-0.5">{opt.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-space font-bold mb-1">{opt.label}</h3>
                    <p className="text-sm text-white/60">{opt.desc}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${chef[opt.key] ? "border-white bg-white" : "border-white/30"}`}>
                    {chef[opt.key] && <CheckCircle2 className="w-4 h-4 text-[#070710]" />}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── EARNINGS TAB ── */}
        {tab === "earnings" && (
          <motion.div key="earn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl space-y-6">
            <div className="glass-card p-8">
              <h2 className="text-lg font-space font-bold mb-6">Earnings Overview</h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Total Earned", value: `$${chef.earnings ?? 0}`, color: "text-green-400" },
                  { label: "Pending Payout", value: "$0", color: "text-[#FFB547]" },
                  { label: "Total Bookings", value: chef.reviews ?? 0, color: "text-white" },
                  { label: "Avg. Per Booking", value: chef.reviews ? `$${Math.round((chef.earnings ?? 0) / chef.reviews)}` : "—", color: "text-[#4DE5FF]" },
                ].map(s => (
                  <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-xs font-space text-white/40 uppercase tracking-wider mb-2">{s.label}</p>
                    <p className={`text-3xl font-space font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-sm text-white/50 mb-2">Platform Fee</p>
                <p className="text-2xl font-space font-bold text-white">20%</p>
                <p className="text-xs text-white/40 mt-1">You keep 80% of every booking</p>
              </div>
            </div>
            <div className="glass-card p-8 border-dashed border-white/20">
              <div className="text-center">
                <DollarSign className="w-10 h-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm text-white/40">Full payout history and bank account settings coming soon.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating save bar on mobile */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#070710] font-space font-bold shadow-2xl shadow-black/50 hover:bg-[#FFB547] transition-colors disabled:opacity-60">
          {saving ? "Saving…" : saveStatus === "saved" ? "✓ Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
