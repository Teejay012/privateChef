"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Sparkles, ChefHat, Check, Utensils, Award } from "lucide-react";

type Role = "diner"|"chef";
const DINER_BENEFITS = ["Personal Flavor DNA profile tailored to your palate","Priority access to SOS Dinner emergency dispatch","Unlock signature dishes after 3 bookings per chef","Build your Culinary Passport — 20 countries to explore"];
const CHEF_BENEFITS = ["Set your own rates, menus, and availability","Get matched with diners by mood and Flavor DNA","Showcase a locked Signature Dish that builds loyalty","Earn featured placement on SOS Dinner dispatch"];
const CUISINES = ["Italian","Japanese","French","Spanish","Indian","Peruvian","Lebanese","Chinese","West African","Other"];

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("diner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cuisine, setCuisine] = useState("Italian");
  const [years, setYears] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isChef = role === "chef";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ name, email, password, role }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    const sr = await signIn("credentials", { email, password, redirect:false });
    if (sr?.ok) router.push(isChef ? "/chef-studio" : "/flavor-dna");
    else { setError("Login failed after register"); setLoading(false); }
  };

  const benefits = isChef ? CHEF_BENEFITS : DINER_BENEFITS;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-20 flex-grow">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 xl:p-20 flex-col justify-between">
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${isChef ? "bg-gradient-to-br from-amber/10 via-transparent to-magenta/10" : "bg-gradient-to-br from-cyan/10 via-transparent to-magenta/10"}`} />
        <motion.div key={isChef?"chef-orb":"diner-orb"} initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.6 }} className={`absolute -top-20 -right-20 w-96 h-96 rounded-full blur-[120px] pointer-events-none ${isChef ? "bg-amber/20" : "bg-cyan/20"}`} />
        <div className="absolute -bottom-20 -left-10 w-96 h-96 rounded-full bg-magenta/20 blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm font-space tracking-widest uppercase mb-8">
            <Sparkles className={`w-4 h-4 ${isChef ? "text-amber" : "text-cyan"}`} />
            {isChef ? "Join as a chef" : "Join the table"}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={role} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} transition={{ duration:0.3 }}>
              {isChef ? (
                <><h1 className="text-5xl xl:text-6xl font-space font-bold mb-6 leading-tight">Your kitchen, <br /><span className="font-editorial italic text-gradient-amber">their constellation.</span></h1><p className="text-lg text-white/60 max-w-md font-light leading-relaxed mb-10">Aura connects extraordinary chefs with diners who actually care about your craft.</p></>
              ) : (
                <><h1 className="text-5xl xl:text-6xl font-space font-bold mb-6 leading-tight">Every meal, <br /><span className="font-editorial italic text-gradient-cyan">a small constellation.</span></h1><p className="text-lg text-white/60 max-w-md font-light leading-relaxed mb-10">Aura matches you with extraordinary private chefs based on your taste personality.</p></>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.3 }} className="relative z-10 space-y-3 max-w-md">
          <AnimatePresence mode="wait">
            <motion.div key={role+"-benefits"} initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }} className="space-y-3">
              {benefits.map((b, idx) => (
                <motion.div key={b} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} transition={{ delay:idx*0.08 }} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isChef ? "bg-amber/20" : "bg-cyan/20"}`}>
                    <Check className={`w-3 h-3 ${isChef ? "text-amber" : "text-cyan"}`} />
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">{b}</p>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-magenta flex items-center justify-center"><ChefHat className="w-4 h-4 text-white" /></div>
            <span className="font-space font-bold text-lg tracking-wider">AURA<span className="font-light">CHEFS</span></span>
          </div>

          {/* Role toggle */}
          <div className="flex rounded-2xl overflow-hidden border border-white/10 mb-8">
            {(["diner","chef"] as Role[]).map(r => (
              <button key={r} onClick={() => setRole(r)} className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-space font-bold transition-all ${role===r ? "bg-white text-obsidian" : "bg-white/5 text-white/60 hover:text-white"}`}>
                {r==="chef" ? <Utensils className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                {r==="diner" ? "I'm a Diner" : "I'm a Chef"}
              </button>
            ))}
          </div>

          <div className="glass-card p-8 md:p-10 relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isChef ? "from-amber to-magenta" : "from-cyan to-magenta"}`} />
            <h2 className="text-3xl font-space font-bold mb-2">Create account</h2>
            <p className="text-sm text-white/60 mb-8">{isChef ? "Join as a culinary artist." : "Start your private dining journey."}</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Full Name</label>
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" /><input required value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber/50 focus:bg-white/10 transition-all" /></div>
              </div>
              <div>
                <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Email</label>
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" /><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@yourtable.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber/50 focus:bg-white/10 transition-all" /></div>
              </div>
              <div>
                <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Password</label>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" /><input type="password" required minLength={6} value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber/50 focus:bg-white/10 transition-all" /></div>
              </div>
              {isChef && (
                <>
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Primary Cuisine</label>
                    <select value={cuisine} onChange={e=>setCuisine(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-amber/50 transition-all appearance-none">
                      {CUISINES.map(c => <option key={c} className="bg-obsidian">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Years of Experience</label>
                    <input type="number" min={1} value={years} onChange={e=>setYears(e.target.value)} placeholder="e.g. 8" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-amber/50 focus:bg-white/10 transition-all" />
                  </div>
                </>
              )}
              {error && <p className="text-sm text-magenta">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-white text-obsidian font-space font-bold hover:bg-amber transition-colors flex items-center justify-center gap-2 disabled:opacity-60 mt-2">
                {loading ? "Creating account..." : <><span>Create account</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-white/60 mt-6">Already have an account? <Link href="/sign-in" className="text-amber hover:underline font-medium">Sign in</Link></p>
        </motion.div>
      </div>
    </div>
  );
}
