export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-grow">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full border-2 border-[#FFB547]/30 border-t-[#FFB547] animate-spin" />
        <p className="text-white/40 text-sm font-space tracking-widest uppercase animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
