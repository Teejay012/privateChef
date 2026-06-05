import Link from "next/link";
import { ChefHat } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center flex-grow">
      <div className="w-20 h-20 rounded-full glass-card flex items-center justify-center mb-8">
        <ChefHat className="w-10 h-10 text-white/30" />
      </div>
      <h1 className="text-8xl font-space font-bold text-gradient-amber mb-4">404</h1>
      <h2 className="text-2xl font-editorial italic text-white/70 mb-4">This table doesn't exist.</h2>
      <p className="text-white/40 max-w-sm mb-10">Looks like this dish has been 86'd from the menu. Let us take you back to the dining room.</p>
      <Link href="/" className="px-8 py-4 rounded-full bg-white text-[#070710] font-space font-bold hover:bg-[#FFB547] transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
