import Link from "next/link";
import { ChefHat, Share2, ExternalLink, Tv, Globe } from "lucide-react";

const COLS = [
  { title:"Explore", links:[{label:"Browse Chefs",to:"/chefs"},{label:"Mood Booking",to:"/mood"},{label:"SOS Dinner",to:"/sos"},{label:"Culinary Passport",to:"/passport"}] },
  { title:"Features", links:[{label:"Flavor DNA",to:"/flavor-dna"},{label:"Chef Theater Mode",to:"/chefs"},{label:"Live Kitchen Cam",to:"/chefs"},{label:"Signature Reveal",to:"/chefs"}] },
  { title:"Company", links:[{label:"About",to:"/"},{label:"For Chefs",to:"/register"},{label:"Press",to:"/"},{label:"Careers",to:"/"}] },
  { title:"Legal", links:[{label:"Terms",to:"/"},{label:"Privacy",to:"/"},{label:"Safety",to:"/"},{label:"Contact",to:"/"}] },
];

export function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-[#070710]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-10">
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FFB547] to-[#FF3D9A] flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-white" />
              </div>
              <span className="font-space font-bold text-xl tracking-wider group-hover:text-[#FFB547] transition-colors">
                AURA<span className="font-light">CHEFS</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs font-editorial italic">
              Private dining, reimagined for the next decade. Hand-picked chefs. Personalized menus. Unforgettable nights.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {[Share2, ExternalLink, Tv, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-[#FFB547] hover:border-[#FFB547]/40 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {COLS.map(col => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-space text-xs uppercase tracking-widest text-white/40">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.label}><Link href={l.to} className="text-sm text-white/70 hover:text-white transition-colors">{l.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-xs text-white/40">© 2026 Aura Chefs. Crafted for those who linger over dinner.</p>
          <p className="text-xs text-white/40 font-editorial italic">"Every meal is a small constellation."</p>
        </div>
      </div>
    </footer>
  );
}
