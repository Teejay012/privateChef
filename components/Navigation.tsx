"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  ChefHat,
  Compass,
  Sparkles,
  AlertTriangle,
  Map,
  Menu,
  X,
  User,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      path: "/chefs",
      label: "Chefs",
      icon: ChefHat
    },
    {
      path: "/mood",
      label: "Mood",
      icon: Compass
    },
    {
      path: "/flavor-dna",
      label: "Flavor DNA",
      icon: Sparkles
    },
    {
      path: "/passport",
      label: "Passport",
      icon: Map
    },
    {
      path: "/sos",
      label: "SOS Dinner",
      icon: AlertTriangle,
      urgent: true
    }
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b-0 border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB547] to-[#FF3D9A] flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-space font-bold text-xl tracking-wider group-hover:text-amber transition-colors">
              AURA<span className="font-light">CHEFS</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4 lg:gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${isActive ? "text-white" : "text-white/60 hover:text-white"} ${item.urgent ? "text-magenta hover:text-magenta animate-pulse-slow" : ""}`}>
                  
                  <Icon
                    className={`w-4 h-4 ${isActive ? item.urgent ? "text-magenta" : "text-amber" : ""}`} />
                  
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors">
                  <User className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors">
                  
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="px-5 py-2.5 rounded-full bg-white text-[#070710] font-space font-bold text-sm hover:bg-[#FFB547] transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden z-50 p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}>
            
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -20
            }}
            transition={{
              duration: 0.2
            }}
            className="fixed inset-0 z-40 bg-obsidian/95 backdrop-blur-xl pt-24 px-6 pb-6 flex flex-col overflow-y-auto">
            
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-4 text-xl font-space font-medium transition-colors ${isActive ? "text-white" : "text-white/60 hover:text-white"} ${item.urgent ? "text-magenta hover:text-magenta animate-pulse-slow" : ""}`}>
                    
                    <Icon
                      className={`w-6 h-6 ${isActive ? item.urgent ? "text-magenta" : "text-amber" : ""}`} />
                    
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              {session ? (
                <>
                  <Link
                    href="/dashboard"
                    className="w-full py-4 rounded-xl bg-white text-obsidian text-center font-space font-bold hover:bg-amber transition-colors">
                    
                    Dashboard
                  </Link>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full py-4 rounded-xl border border-white/10 text-center font-space font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                    
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/sign-in"
                    className="w-full py-4 rounded-xl border border-white/10 text-center font-space font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                    
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="w-full py-4 rounded-xl bg-white text-obsidian text-center font-space font-bold hover:bg-amber transition-colors">
                    
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};