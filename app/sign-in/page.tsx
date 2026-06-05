"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles, ChefHat } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) { setError("Invalid email or password."); setLoading(false); }
    else router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row pt-20 flex-grow">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden p-12 xl:p-20 flex-col justify-between">
        <div className="absolute inset-0 bg-gradient-to-br from-magenta/10 via-transparent to-amber/10 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-magenta/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-96 h-96 rounded-full bg-amber/20 blur-[120px] pointer-events-none" />
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }} className="relative z-10">
          <div className="flex items-center gap-2 text-white/60 text-sm font-space tracking-widest uppercase mb-8"><Sparkles className="w-4 h-4 text-amber" /> Welcome back</div>
          <h1 className="text-5xl xl:text-6xl font-space font-bold mb-6 leading-tight">Your table is <br /><span className="font-editorial italic text-gradient-amber">always waiting.</span></h1>
          <p className="text-lg text-white/60 max-w-md font-light leading-relaxed">Sign in to revisit your Flavor DNA, manage upcoming dinners, and unlock your chefs' signature dishes.</p>
        </motion.div>
        <motion.figure initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8, delay:0.3 }} className="relative z-10 max-w-md">
          <blockquote className="font-editorial italic text-2xl text-white/80 leading-snug mb-4">"The most exquisite dinner I've had this year — and it was in my own kitchen."</blockquote>
          <figcaption className="text-sm text-white/50 font-space tracking-wider uppercase">— Olivia M., Aura member since 2024</figcaption>
        </motion.figure>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber to-magenta flex items-center justify-center"><ChefHat className="w-4 h-4 text-white" /></div>
            <span className="font-space font-bold text-lg tracking-wider">AURA<span className="font-light">CHEFS</span></span>
          </div>
          <div className="glass-card p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber via-magenta to-cyan" />
            <h2 className="text-3xl font-space font-bold mb-2">Sign in</h2>
            <p className="text-sm text-white/60 mb-8">Enter your credentials to continue.</p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-space tracking-widest uppercase text-white/50 mb-2">Email</label>
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" /><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@yourtable.com" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber/50 focus:bg-white/10 transition-all" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2"><label className="block text-xs font-space tracking-widest uppercase text-white/50">Password</label></div>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" /><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-amber/50 focus:bg-white/10 transition-all" /></div>
              </div>
              {error && <p className="text-sm text-magenta">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-white text-obsidian font-space font-bold hover:bg-amber transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? "Signing in..." : <><span>Sign in</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
            <div className="my-7 flex items-center gap-3 text-xs text-white/40 uppercase tracking-widest font-space"><div className="flex-1 h-px bg-white/10" />or<div className="flex-1 h-px bg-white/10" /></div>
            <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })} className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium">Continue with Google</button>
          </div>
          <p className="text-center text-sm text-white/60 mt-6">New to Aura? <Link href="/register" className="text-amber hover:underline font-medium">Create an account</Link></p>
        </motion.div>
      </div>
    </div>
  );
}
