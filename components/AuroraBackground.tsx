"use client";
import { motion } from "framer-motion";
export function AuroraBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full bg-obsidian overflow-hidden">
      <div className="absolute inset-0 z-0 noise-bg mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div animate={{ x:[0,50,-50,0], y:[0,-50,50,0], scale:[1,1.2,0.8,1] }} transition={{ duration:20, repeat:Infinity, ease:"linear" }} className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-glow blur-[120px] opacity-30" />
        <motion.div animate={{ x:[0,-70,70,0], y:[0,70,-70,0], scale:[1,0.9,1.1,1] }} transition={{ duration:25, repeat:Infinity, ease:"linear" }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-magenta-glow blur-[150px] opacity-20" />
        <motion.div animate={{ x:[0,100,-100,0], y:[0,50,-50,0], scale:[1,1.3,0.9,1] }} transition={{ duration:30, repeat:Infinity, ease:"linear" }} className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-cyan-glow blur-[100px] opacity-20" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">{children}</div>
    </div>
  );
}
