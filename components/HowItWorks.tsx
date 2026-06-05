"use client";

const STEPS = [
  {
    num: "01",
    icon: "🧠",
    title: "Take the Flavor Quiz",
    desc: "Answer 3 questions. Our AI builds your Flavor DNA profile and matches it against 2,400+ chefs worldwide.",
    color: "teal",
  },
  {
    num: "02",
    icon: "💫",
    title: "Choose Your Mood",
    desc: "Select tonight's vibe — Romantic, Celebration, Comfort, or Adventure. Or let the AI decide for you.",
    color: "gold",
  },
  {
    num: "03",
    icon: "💬",
    title: "Consult Your Chef",
    desc: "Chat directly with your chef. Share dietary needs, preferences, and your kitchen setup before they arrive.",
    color: "teal",
  },
  {
    num: "04",
    icon: "🔴",
    title: "Dine & Experience",
    desc: "Your chef transforms your kitchen. Optional Theater Mode and Live Cam make it an event to remember.",
    color: "fire",
  },
  {
    num: "05",
    icon: "🌍",
    title: "Earn Your Passport",
    desc: "Every cuisine earns a country badge. Build your Culinary Passport and unlock exclusive chef access.",
    color: "gold",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[var(--bg-deep)] relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,193,74,0.3)] to-transparent" />

      {/* Diagonal lines decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.02]">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-[var(--accent-teal)]"
            style={{
              top: `${10 + i * 9}%`,
              left: 0,
              right: 0,
              transform: `rotate(-2deg)`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="font-mono text-xs text-[var(--accent-gold)] tracking-[0.4em] mb-3 uppercase">◆ The Process</div>
          <h2 className="font-display text-4xl md:text-5xl">
            HOW IT <span className="text-gradient-teal">WORKS</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--accent-teal)] via-[var(--accent-gold)] to-[var(--accent-fire)] opacity-20 hidden lg:block" />

          <div className="flex flex-col gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className={`flex flex-col lg:flex-row items-start lg:items-center gap-8 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                {/* Content */}
                <div className={`flex-1 ${i % 2 === 1 ? "lg:text-right" : ""}`}>
                  <div className="glow-border-teal bg-[var(--bg-card)] p-8 relative overflow-hidden">
                    <div className={`absolute inset-0 opacity-[0.03] bg-gradient-to-br ${
                      step.color === "teal" ? "from-[var(--accent-teal)]" :
                      step.color === "gold" ? "from-[var(--accent-gold)]" :
                      "from-[var(--accent-fire)]"
                    } to-transparent`} />
                    <div className="flex items-start gap-5">
                      <span className="text-3xl">{step.icon}</span>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`font-mono text-xs tracking-widest ${
                            step.color === "teal" ? "text-[var(--accent-teal)]" :
                            step.color === "gold" ? "text-[var(--accent-gold)]" :
                            "text-[var(--accent-fire)]"
                          }`}>
                            STEP {step.num}
                          </span>
                        </div>
                        <h3 className="font-display text-lg text-[var(--text-primary)] mb-2 tracking-wide">
                          {step.title.toUpperCase()}
                        </h3>
                        <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center node */}
                <div className="hidden lg:flex w-12 h-12 items-center justify-center flex-shrink-0 relative z-10">
                  <div className={`w-10 h-10 rotate-45 flex items-center justify-center ${
                    step.color === "teal" ? "bg-[rgba(0,212,180,0.1)] border border-[var(--accent-teal)]" :
                    step.color === "gold" ? "bg-[rgba(255,193,74,0.1)] border border-[var(--accent-gold)]" :
                    "bg-[rgba(255,90,40,0.1)] border border-[var(--accent-fire)]"
                  }`}>
                    <span className={`font-display text-xs -rotate-45 ${
                      step.color === "teal" ? "text-[var(--accent-teal)]" :
                      step.color === "gold" ? "text-[var(--accent-gold)]" :
                      "text-[var(--accent-fire)]"
                    }`}>{step.num}</span>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="flex-1 hidden lg:block" />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <p className="font-body text-[var(--text-muted)] mb-8 text-lg">
            Ready to experience dining reimagined?
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn-primary">Start Your Flavor Quiz</button>
            <button className="btn-fire">⚡ SOS Dinner — Tonight</button>
          </div>
        </div>
      </div>
    </section>
  );
}
