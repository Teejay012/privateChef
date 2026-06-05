"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Map, Lock, Award, Globe } from "lucide-react";
import { useSession } from "next-auth/react";

const ALL_BADGES = [
  { id:"b1",country:"Italy",name:"Pasta Master" },
  { id:"b2",country:"Japan",name:"Umami Seeker" },
  { id:"b3",country:"Spain",name:"Tapas Wanderer" },
  { id:"b4",country:"India",name:"Spice Alchemist" },
  { id:"b5",country:"Mexico",name:"Mole Devotee" },
  { id:"b6",country:"France",name:"Haute Cuisine" },
  { id:"b7",country:"Thailand",name:"Balance of Five" },
  { id:"b8",country:"Peru",name:"Andean Heights" },
  { id:"b9",country:"Lebanon",name:"Mezze Maestro" },
  { id:"b10",country:"China",name:"Dim Sum Disciple" },
  { id:"b11",country:"Vietnam",name:"Pho Pilgrim" },
  { id:"b12",country:"Morocco",name:"Tagine Traveler" },
  { id:"b13",country:"Greece",name:"Aegean Aficionado" },
  { id:"b14",country:"Korea",name:"Banchan Believer" },
  { id:"b15",country:"Argentina",name:"Asado Adept" },
  { id:"b16",country:"Ethiopia",name:"Injera Initiate" },
  { id:"b17",country:"Turkey",name:"Bazaar Wanderer" },
  { id:"b18",country:"Brazil",name:"Churrasco Champion" },
  { id:"b19",country:"Nigeria",name:"Jollof Royalty" },
  { id:"b20",country:"Iceland",name:"Nordic Forager" },
];

export default function PassportPage() {
  const { data: session } = useSession();
  const [earned, setEarned] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      fetch("/api/user").then(r=>r.json()).then(u => {
        if (u?.passportBadges) setEarned(u.passportBadges);
        else setEarned(["b1","b2","b3","b4","b5"]); // demo for signed-in
      });
    } else {
      setEarned(["b1","b2","b3","b4","b5"]); // demo preview for logged-out
    }
  }, [session]);

  const unlockedCount = earned.length;
  const progress = unlockedCount / ALL_BADGES.length * 100;

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 max-w-7xl mx-auto flex-grow">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-8">
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-space font-bold mb-4 flex items-center gap-4">
            <Map className="w-10 h-10 text-[#4DE5FF]" />
            Culinary <span className="font-editorial italic text-gradient-cyan">Passport</span>
          </h1>
          <p className="text-white/60 max-w-xl">Travel the world through taste. Collect stamps by booking chefs from different culinary backgrounds.</p>
        </div>
        <div className="glass-card p-6 min-w-[300px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-space text-white/60 uppercase">Global Explorer Level</span>
            <span className="font-bold text-[#4DE5FF]">{unlockedCount}/{ALL_BADGES.length}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div initial={{ width:0 }} animate={{ width:`${progress}%` }} transition={{ duration:1, ease:"easeOut" }} className="h-full bg-gradient-to-r from-[#4DE5FF] to-blue-500" />
          </div>
          <p className="text-xs text-white/40 text-right">{ALL_BADGES.length - unlockedCount} more stamps to collect</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {ALL_BADGES.map((badge, idx) => {
          const isUnlocked = earned.includes(badge.id);
          return (
            <motion.div key={badge.id} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay:idx*0.04 }}
              className={`relative aspect-square rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all duration-500 ${isUnlocked ? "glass-card border-[#4DE5FF]/30 hover:border-[#4DE5FF]/60 bg-[#4DE5FF]/5" : "border border-white/5 bg-white/5 grayscale opacity-50"}`}>
              {isUnlocked ? (
                <>
                  <div className="absolute top-4 right-4 text-[#4DE5FF]/30"><Award className="w-6 h-6" /></div>
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#4DE5FF]/50 flex items-center justify-center mb-4 bg-[#4DE5FF]/10 text-[#4DE5FF]">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-space font-bold text-white mb-1">{badge.country}</h3>
                  <p className="text-xs text-[#4DE5FF] font-medium">{badge.name}</p>
                </>
              ) : (
                <>
                  <div className="absolute top-4 right-4 text-white/20"><Lock className="w-6 h-6" /></div>
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4 bg-white/5 text-white/30">
                    <Globe className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-space font-bold text-white/50 mb-1">{badge.country}</h3>
                  <p className="text-xs text-white/30 font-medium">Locked</p>
                </>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
