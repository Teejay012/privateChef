"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Calendar, MessageSquare, Map, Sparkles, ChevronRight, Star, LogOut, User } from "lucide-react";

interface Booking { _id: string; chefName: string; chefImageUrl: string; date: string; time: string; guests: number; mood: string; status: string; totalAmount: number; }
interface UserProfile { name: string; email: string; role: string; flavorDNA?: { title: string; desc: string }; passportBadges: string[]; }

const ALL_BADGES_COUNT = 20;

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Auth Redirection Guard
  useEffect(() => { 
    if (status === "unauthenticated") {
      router.push("/sign-in"); 
    }
  }, [status, router]);

  // Unified Safe Data Fetch Pipeline
  useEffect(() => {
    if (!session) return;
    
    let isMounted = true;
    setLoading(true);

    Promise.all([
      fetch("/api/bookings")
        .then(async (res) => {
          if (!res.ok) throw new Error(`Bookings route returned status ${res.status}`);
          return res.json();
        })
        .catch((err) => {
          console.error("Bookings Fetch Failure:", err.message);
          return []; // Safe fallback array
        }),
      fetch("/api/user")
        .then(async (res) => {
          if (!res.ok) throw new Error(`User route returned status ${res.status}`);
          return res.json();
        })
        .catch((err) => {
          console.error("User Profile Fetch Failure:", err.message);
          return null; // Safe fallback object
        })
    ])
      .then(([b, u]) => {
        if (!isMounted) return;
        setBookings(Array.isArray(b) ? b : []);
        setProfile(u);
        
        if (!u) {
          setFetchError("Could not retrieve user context matrix from /api/user");
        }
      })
      .catch((globalErr) => {
        console.error("Critical Dashboard Pipeline Error:", globalErr);
        if (isMounted) setFetchError(globalErr.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, [session]);

  // Loading State Display
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#070710] pt-32 flex flex-col items-center justify-center gap-4">
        <div className="glass-card p-12 animate-pulse w-64 h-32 flex items-center justify-center border border-white/5">
          <span className="text-sm text-white/40 tracking-widest font-space font-medium">ALIGNING MATRIX...</span>
        </div>
      </div>
    );
  }

  // Network Fallback Error Display
  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#070710] pt-32 px-6 flex flex-col items-center justify-center text-center">
        <div className="glass-card p-8 max-w-md border border-red-500/20 bg-red-950/10">
          <h2 className="text-xl font-space font-bold text-red-400 mb-2">Data Transmission Deficit</h2>
          <p className="text-sm text-white/60 mb-6">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 rounded-full bg-white text-[#070710] font-space font-bold text-xs hover:bg-[#FFB547] transition-colors">
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!session || !profile) return null;

  const upcoming = bookings.filter(b => ["pending", "confirmed", "in-progress"].includes(b.status));
  const badgeCount = profile.passportBadges?.length ?? 0;
  const progress = Math.round((badgeCount / ALL_BADGES_COUNT) * 100);

  return (
    <div className="min-h-screen bg-[#070710] pt-32 px-6 pb-24 max-w-7xl mx-auto flex-grow noise-bg">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-space font-bold mb-2">Welcome back, {profile.name?.split(" ")[0] || "Diner"}</h1>
          <p className="text-white/60">Your culinary journey awaits.</p>
        </div>
        <div className="flex items-center gap-3">
          {profile.role === "chef" && (
            <Link href="/chef-studio" className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-card hover:bg-white/10 transition-colors text-sm font-space font-medium">
              Chef Studio
            </Link>
          )}
          <Link href="/chefs" className="px-4 py-2.5 rounded-full bg-white text-[#070710] font-space font-bold text-sm hover:bg-[#FFB547] transition-colors">
            Book a Chef
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-2 px-4 py-2.5 rounded-full glass-card hover:bg-white/10 transition-colors text-sm text-white/60">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col — Bookings Engine */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-space font-bold mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#FFB547]" /> Upcoming Experiences</h2>
            {upcoming.length === 0 ? (
              <div className="glass-card p-8 text-center border border-white/5">
                <p className="text-white/50 mb-4">No upcoming bookings yet.</p>
                <Link href="/chefs" className="px-6 py-3 rounded-full bg-white text-[#070710] font-space font-bold text-sm hover:bg-[#FFB547] transition-colors">Find a Chef</Link>
              </div>
            ) : upcoming.map(b => (
              <div key={b._id} className="glass-card p-6 relative overflow-hidden group mb-4 border border-white/5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB547]/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {b.chefImageUrl && <img src={b.chefImageUrl} alt={b.chefName} className="w-24 h-24 rounded-2xl object-cover border border-white/10 shrink-0" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 rounded-md bg-white/10 text-xs font-medium text-[#FFB547]">{b.mood}</span>
                      <span className="text-sm text-white/60">{b.date ? new Date(b.date).toLocaleDateString() : "TBD"} at {b.time}</span>
                    </div>
                    <h3 className="text-2xl font-space font-bold mb-1">{b.chefName}</h3>
                    <p className="text-sm text-white/80 mb-4">{b.guests} Guests · ${b.totalAmount}</p>
                    <div className="flex gap-3">
                      <Link href={`/consultation/${b._id}`} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium">
                        <MessageSquare className="w-4 h-4" /> Chat with Chef
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Past Bookings Summary */}
          {bookings.filter(b => b.status === "completed" || b.status === "cancelled").length > 0 && (
            <section>
              <h2 className="text-xl font-space font-bold mb-4 flex items-center gap-2"><Star className="w-5 h-5 text-[#FF3D9A]" /> Past Experiences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.filter(b => ["completed", "cancelled"].includes(b.status)).map(b => (
                  <div key={b._id} className="glass-card p-4 flex gap-4 border border-white/5">
                    {b.chefImageUrl && <img src={b.chefImageUrl} alt={b.chefName} className="w-16 h-16 rounded-xl object-cover shrink-0" />}
                    <div>
                      <h3 className="font-space font-bold">{b.chefName}</h3>
                      <p className="text-xs text-white/60 mb-1">{b.date ? new Date(b.date).toLocaleDateString() : "N/A"}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${b.status === "completed" ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/40"}`}>{b.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Col — Personal Archetype Data */}
        <div className="space-y-8">
          <section className="glass-card p-6 relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#FF3D9A]/10 to-transparent pointer-events-none" />
            <h2 className="text-lg font-space font-bold mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-[#FF3D9A]" /> Your Flavor DNA</h2>
            {profile.flavorDNA ? (
              <div>
                <h3 className="text-2xl font-editorial text-gradient-magenta mb-1">{profile.flavorDNA.title}</h3>
                <p className="text-sm text-white/60 mb-4">{profile.flavorDNA.desc}</p>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-sm text-white/50 mb-4">Discover your unique taste profile.</p>
                <Link href="/flavor-dna" className="px-4 py-2 rounded-full bg-[#FF3D9A]/20 border border-[#FF3D9A]/30 text-[#FF3D9A] text-sm font-space font-medium hover:bg-[#FF3D9A]/30 transition-colors">Take the Quiz</Link>
              </div>
            )}
            <Link href="/flavor-dna" className="block text-center text-sm font-medium text-white/60 hover:text-white transition-colors mt-4">
              {profile.flavorDNA ? "Retake Quiz" : "Get Started →"}
            </Link>
          </section>

          <section className="glass-card p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-space font-bold flex items-center gap-2"><Map className="w-5 h-5 text-[#4DE5FF]" /> Culinary Passport</h2>
              <span className="text-xs font-medium px-2 py-1 bg-white/10 rounded-md">Level {Math.floor(badgeCount / 5) + 1}</span>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/60">World Explorer</span>
                <span className="font-medium">{badgeCount}/{ALL_BADGES_COUNT}</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-[#4DE5FF] to-blue-500" />
              </div>
            </div>
            <Link href="/passport" className="flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
              View Passport <ChevronRight className="w-4 h-4" />
            </Link>
          </section>

          <section className="glass-card p-6 border border-white/5">
            <h2 className="text-lg font-space font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-white/60" /> Account</h2>
            <div className="space-y-2 text-sm text-white/60">
              <div className="flex justify-between"><span>Email</span><span className="text-white/80 truncate ml-4">{profile.email}</span></div>
              <div className="flex justify-between"><span>Role</span><span className="capitalize text-[#FFB547]">{profile.role}</span></div>
              <div className="flex justify-between"><span>Bookings</span><span className="text-white/80">{bookings.length}</span></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}