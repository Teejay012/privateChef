"use client";
import { useState } from "react";

const STEPS = [
  {
    q: "What's your flavor soul?",
    opts: [
      { emoji: "🔥", label: "Fiery & Bold", desc: "Chilis, spice, intensity" },
      { emoji: "🌿", label: "Fresh & Clean", desc: "Herbs, citrus, light" },
      { emoji: "🍫", label: "Deep & Umami", desc: "Rich, earthy, layered" },
      { emoji: "🍋", label: "Bright & Tangy", desc: "Acid, zest, vibrant" },
    ],
  },
  {
    q: "How adventurous are you?",
    opts: [
      { emoji: "🗺️", label: "Explorer", desc: "Bring the unknown" },
      { emoji: "🏠", label: "Comfort Seeker", desc: "Familiar elevated" },
      { emoji: "⚖️", label: "Balanced", desc: "Mix of both worlds" },
      { emoji: "🎯", label: "Purist", desc: "Classic, perfected" },
    ],
  },
  {
    q: "Tonight's vibe?",
    opts: [
      { emoji: "💑", label: "Romantic", desc: "Intimate, luxurious" },
      { emoji: "🥂", label: "Celebration", desc: "Showstopper moments" },
      { emoji: "👨‍👩‍👧", label: "Family Feast", desc: "Abundant, inclusive" },
      { emoji: "🧘", label: "Ritual Meal", desc: "Mindful, soulful" },
    ],
  },
];

const PROFILES: Record<string, { name: string; desc: string; cuisines: string[]; color: string }> = {
  "0-0-0": { name: "The Dragon", desc: "You crave maximum impact — a bold, fire-kissed explorer who wants drama on every plate.", cuisines: ["Sichuan", "Mexican", "Korean BBQ", "Ethiopian"], color: "fire" },
  "0-0-1": { name: "The Alchemist", desc: "Fiery soul with a taste for spectacle. You want every dish to be a moment.", cuisines: ["Peruvian", "Thai", "Lebanese", "Basque"], color: "fire" },
  "1-0-0": { name: "The Nomad", desc: "A clean palate paired with fearless wanderlust. Freshness meets the unfamiliar.", cuisines: ["Japanese", "Vietnamese", "Nordic", "Israeli"], color: "teal" },
  "2-2-0": { name: "The Romanticist", desc: "You crave depth and intimacy — slow-cooked love on a plate.", cuisines: ["French", "Italian", "Spanish", "Moroccan"], color: "gold" },
  "default": { name: "The Connoisseur", desc: "A refined palate that demands nothing but extraordinary execution from every cuisine.", cuisines: ["Omakase", "Modern European", "Peruvian-Japanese", "Nordic"], color: "teal" },
};

export default function FlavorQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const pick = (i: number) => {
    const newAns = [...answers, i];
    if (step < STEPS.length - 1) {
      setAnswers(newAns);
      setStep(step + 1);
    } else {
      setAnswers(newAns);
      setDone(true);
    }
  };

  const key = answers.slice(0, 3).join("-");
  const profile = PROFILES[key] || PROFILES["default"];

  const reset = () => { setStep(0); setAnswers([]); setDone(false); };

  return (
    <section id="quiz" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(0,212,180,0.02)] to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-mono text-xs text-[var(--accent-teal)] tracking-[0.4em] mb-4 uppercase">◆ Feature</div>
          <h2 className="font-display text-4xl md:text-5xl mb-4">
            AI <span className="text-gradient-teal">FLAVOR DNA</span>
          </h2>
          <p className="text-[var(--text-muted)] font-body">
            3 questions. A lifetime of perfectly matched chefs.
          </p>
        </div>

        <div className="glow-border-teal bg-[var(--bg-card)] p-8 md:p-12 relative scanline">
          {/* Progress bar */}
          {!done && (
            <div className="mb-10">
              <div className="flex justify-between font-mono text-xs text-[var(--text-dim)] mb-2">
                <span>QUESTION {step + 1} OF {STEPS.length}</span>
                <span>{Math.round(((step) / STEPS.length) * 100)}% COMPLETE</span>
              </div>
              <div className="h-px bg-[var(--text-dim)]">
                <div
                  className="h-full bg-gradient-to-r from-[var(--accent-teal)] to-[#00a8ff] transition-all duration-700"
                  style={{ width: `${(step / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!done ? (
            <>
              <h3 className="font-display text-2xl md:text-3xl text-[var(--text-primary)] mb-10 text-center">
                {STEPS[step].q}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {STEPS[step].opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    className="group p-6 border border-[var(--border-glow)] bg-[var(--bg-deep)] hover:border-[var(--accent-teal)] hover:bg-[rgba(0,212,180,0.05)] transition-all duration-300 text-left"
                  >
                    <div className="text-3xl mb-3">{opt.emoji}</div>
                    <div className="font-display text-sm text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-teal)] transition-colors">
                      {opt.label}
                    </div>
                    <div className="font-mono text-xs text-[var(--text-dim)]">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="font-mono text-xs text-[var(--accent-teal)] tracking-widest mb-4">YOUR FLAVOR DNA</div>
              <h3 className={`font-display text-4xl md:text-5xl mb-4 text-gradient-${profile.color}`}>
                {profile.name}
              </h3>
              <p className="text-[var(--text-muted)] font-body max-w-md mx-auto mb-8">
                {profile.desc}
              </p>
              <div className="mb-8">
                <div className="font-mono text-xs text-[var(--text-dim)] mb-4 tracking-widest">MATCHED CUISINES</div>
                <div className="flex flex-wrap justify-center gap-3">
                  {profile.cuisines.map((c) => (
                    <span key={c} className={`tag tag-${profile.color}`}>{c}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="btn-primary">Find My Chefs →</button>
                <button className="btn-ghost" onClick={reset}>Retake Quiz</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
