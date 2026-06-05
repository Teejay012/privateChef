"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Star, MapPin, Clock, Shield, Lock, Unlock, ArrowRight, MessageSquare, Video } from "lucide-react";
import { useSession } from "next-auth/react";

interface Chef { _id:string; name:string; bio:string; cuisine:string[]; price:number; rating:number; reviews:number; availableNow:boolean; imageUrl:string; offersTheater:boolean; offersLiveCam:boolean; acceptsSOS:boolean; signatureDish:{name:string;description:string;imageUrl:string}; lockedSignatureDish:{name:string;description:string;imageUrl:string;bookingsRequired:number}; }

export default function ChefProfilePage() {
  const { id } = useParams<{ id:string }>();
  const { data: session } = useSession();
  const [chef, setChef] = useState<Chef|null>(null);
  const [userBookings] = useState(2); // mock — in prod fetch from /api/bookings

  useEffect(() => { fetch(`/api/chefs/${id}`).then(r=>r.json()).then(setChef); }, [id]);
  if (!chef) return <div className="min-h-screen pt-32 flex items-center justify-center"><div className="glass-card p-8 animate-pulse w-64 h-32" /></div>;

  const isUnlocked = userBookings >= chef.lockedSignatureDish.bookingsRequired;

  return (
    <div className="min-h-screen pb-24 flex-grow">
      {/* Hero */}
      <div className="relative h-[60vh] w-full mt-20">
        <img src={chef.imageUrl} alt={chef.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 max-w-7xl mx-auto">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
            <div className="flex flex-wrap gap-2 mb-4">{chef.cuisine.map(c=><span key={c} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-space font-medium border border-white/20">{c}</span>)}</div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-editorial mb-4">{chef.name}</h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-space text-white/80">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber fill-amber" />{chef.rating} ({chef.reviews} reviews)</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Available in your area</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Usually books 2 weeks out</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <h2 className="text-2xl font-space font-bold mb-6">About the Chef</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">{chef.bio}</p>
          </section>
          <section>
            <h2 className="text-2xl font-space font-bold mb-6">Signature Dishes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card overflow-hidden group">
                <div className="h-48 overflow-hidden"><img src={chef.signatureDish.imageUrl} alt={chef.signatureDish.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /></div>
                <div className="p-6"><h3 className="text-xl font-editorial mb-2">{chef.signatureDish.name}</h3><p className="text-sm text-white/60">{chef.signatureDish.description}</p></div>
              </div>
              <div className={`glass-card overflow-hidden relative ${!isUnlocked ? "border-magenta/30" : "border-amber/30"}`}>
                <div className="h-48 overflow-hidden relative">
                  <img src={chef.lockedSignatureDish.imageUrl} alt="Locked" className={`w-full h-full object-cover transition-transform duration-700 ${!isUnlocked ? "blur-xl scale-110 grayscale" : ""}`} />
                  {!isUnlocked && <div className="absolute inset-0 bg-obsidian/40 flex flex-col items-center justify-center text-center p-4"><Lock className="w-8 h-8 text-magenta mb-2" /><span className="font-space font-bold text-sm">Signature Reveal Locked</span><span className="text-xs text-white/60 mt-1">{userBookings}/{chef.lockedSignatureDish.bookingsRequired} Bookings</span></div>}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-editorial ${!isUnlocked ? "text-white/40 blur-sm select-none" : ""}`}>{isUnlocked ? chef.lockedSignatureDish.name : "Mystery Dish Name"}</h3>
                    {isUnlocked && <Unlock className="w-4 h-4 text-amber" />}
                  </div>
                  <p className={`text-sm ${!isUnlocked ? "text-white/20 blur-sm select-none" : "text-white/60"}`}>{isUnlocked ? chef.lockedSignatureDish.description : "This is a very secret description that you cannot read until you unlock it."}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Booking card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-8 sticky top-28 border-amber/20">
            <div className="flex items-end justify-between mb-8 pb-6 border-b border-white/10">
              <div><span className="text-sm text-white/50 uppercase tracking-wider block mb-1">Starting at</span><span className="text-4xl font-space font-bold">${chef.price}</span><span className="text-sm text-white/50">/person</span></div>
            </div>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-white/70"><Shield className="w-5 h-5 text-amber" /> Aura Verified Professional</div>
              <div className="flex items-center gap-3 text-sm text-white/70"><MessageSquare className="w-5 h-5 text-cyan" /> Pre-dinner consultation included</div>
              {chef.offersTheater && <div className="flex items-center gap-3 text-sm text-white/70"><Video className="w-5 h-5 text-magenta" /> Chef Theater mode available</div>}
            </div>
            {session ? (
              <Link href={`/book/${chef._id}`} className="w-full py-4 rounded-xl bg-white text-obsidian font-space font-bold text-lg hover:bg-amber transition-colors flex items-center justify-center gap-2">Request Booking <ArrowRight className="w-5 h-5" /></Link>
            ) : (
              <Link href="/sign-in" className="w-full py-4 rounded-xl bg-white text-obsidian font-space font-bold text-lg hover:bg-amber transition-colors flex items-center justify-center gap-2">Sign in to Book <ArrowRight className="w-5 h-5" /></Link>
            )}
            <p className="text-xs text-center text-white/40 mt-4">Free to request • Pay only on confirmation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
