"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [time, setTime] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass border-b border-[rgba(0,212,180,0.1)]" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <div className="absolute inset-0 border-2 border-[#00d4b4] rotate-45 opacity-60" />
            <div className="absolute inset-1 border border-[#ff5a28] rotate-45" />
            <span className="absolute inset-0 flex items-center justify-center font-display text-[#00d4b4] text-xs font-bold">C</span>
          </div>
          <span className="font-display text-sm tracking-[0.3em] text-white">CHEF<span className="text-[#00d4b4]">HAUS</span></span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { href: "/chefs", label: "Explore Chefs" },
            { href: "/#features", label: "Features" },
            { href: "/#how-it-works", label: "How It Works" },
          ].map((item) => (
            <Link key={item.href} href={item.href}
              className={`font-mono-custom text-xs tracking-widest uppercase transition-colors ${isActive(item.href) ? "text-[#00d4b4]" : "text-[#5a7a8a] hover:text-[#00d4b4]"}`}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="hidden lg:block font-mono-custom text-xs text-[#2a4a5a] tracking-widest">{time}</span>
          {session ? (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/dashboard" className="btn-ghost py-2 px-4 text-xs">Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })}
                className="font-mono-custom text-xs text-[#5a7a8a] hover:text-[#ff5a28] transition-colors tracking-widest">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link href="/auth/login" className="btn-ghost py-2 px-4 text-xs">Log In</Link>
              <Link href="/auth/register" className="btn-primary py-2 px-4 text-xs">Get Started</Link>
            </div>
          )}
          {/* Mobile toggle */}
          <button className="md:hidden flex flex-col gap-1.5 w-6 py-1" onClick={() => setMenuOpen(!menuOpen)}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={`block h-px bg-[#00d4b4] transition-all duration-300 ${menuOpen && i === 0 ? "rotate-45 translate-y-2" : menuOpen && i === 1 ? "opacity-0" : menuOpen && i === 2 ? "-rotate-45 -translate-y-2" : ""}`} />
            ))}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden glass border-t border-[rgba(0,212,180,0.1)] px-6 py-6 flex flex-col gap-4">
          <Link href="/chefs" className="font-mono-custom text-xs text-[#5a7a8a] hover:text-[#00d4b4] tracking-widest" onClick={() => setMenuOpen(false)}>Explore Chefs</Link>
          {session ? (
            <>
              <Link href="/dashboard" className="font-mono-custom text-xs text-[#5a7a8a] hover:text-[#00d4b4] tracking-widest" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => signOut({ callbackUrl: "/" })} className="font-mono-custom text-xs text-[#ff5a28] tracking-widest text-left">Sign Out</button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-2">
              <Link href="/auth/login" className="btn-ghost text-center" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link href="/auth/register" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
