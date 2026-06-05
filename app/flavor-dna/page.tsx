"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

const QUESTIONS = [
  { id:"q1", question:"When you crave a late-night snack, what are you reaching for?", options:[{id:"o1",text:"Something salty and crunchy",value:"savory"},{id:"o2",text:"Rich, decadent chocolate",value:"sweet"},{id:"o3",text:"Spicy noodles that make me sweat",value:"spicy"},{id:"o4",text:"A complex cheese board",value:"umami"}] },
  { id:"q2", question:"Choose your ideal vacation dining experience:", options:[{id:"o1",text:"Street food market hopping in Bangkok",value:"adventure"},{id:"o2",text:"A 12-course tasting menu in Paris",value:"refined"},{id:"o3",text:"A rustic farm-to-table feast in Tuscany",value:"comfort"},{id:"o4",text:"Fresh seafood caught that morning by the beach",value:"fresh"}] },
  { id:"q3", question:"How do you feel about culinary boundaries?", options:[{id:"o1",text:"Push them! I want things I've never tasted.",value:"experimental"},{id:"o2",text:"I respect the classics done perfectly.",value:"traditional"},{id:"o3",text:"I love when different cultures collide on a plate.",value:"fusion"},{id:"o4",text:"As long as it's comforting, I'm happy.",value:"comfort"}] },
];

const PROFILES: Record<string, { title:string; desc:string; cuisines:string[] }> = {
  savory_adventure_experimental: { title:"Umami Maximalist", desc:"You crave depth, complexity, and bold flavors. You aren't afraid of intensity and appreciate dishes that tell a rich, layered story.", cuisines:["Japanese Omakase","Modern French","Elevated Comfort"] },
  sweet_refined_traditional:     { title:"Refined Classicist", desc:"You appreciate precision and heritage. For you, a meal is a meditation on tradition executed flawlessly.", cuisines:["Classical French","Italian Haute","Pastry Arts"] },
  spicy_adventure_fusion:        { title:"Global Nomad", desc:"Borders don't exist on your plate. You chase heat, contrast, and the thrill of a cuisine you've never encountered.", cuisines:["Nikkei","Modern Thai","Korean-Mexican Fusion"] },
  umami_refined_fusion:          { title:"Flavor Scientist", desc:"You approach dining like an experiment. Every bite should reveal something new — a hidden spice, a technique you can't quite name.", cuisines:["Modernist","Molecular Gastronomy","Progressive Indian"] },
  default:                       { title:"Curious Epicurean", desc:"Your palate is wide open. You find beauty in every cuisine and approach every meal with genuine curiosity and joy.", cuisines:["Mediterranean","West African Contemporary","Peruvian Nikkei"] },
};

function getProfile(answers: Record<string,string>) {
  const key = [answers.q1, answers.q2, answers.q3].join("_");
  return PROFILES[key] || PROFILES.default;
}

export default function FlavorDNAPage() {
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const [isRevealing, setIsRevealing] = useState(false);
  const [result, setResult] = useState<{ title:string; desc:string; cuisines:string[] }|null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleAnswer = (qId: string, value: string) => {
    const next = { ...answers, [qId]: value };
    setAnswers(next);
    if (step < QUESTIONS.length - 1) {
      setTimeout(() => setStep(s => s+1), 400);
    } else {
      setIsRevealing(true);
      setTimeout(() => {
        setIsRevealing(false);
        setResult(getProfile(next));
      }, 2500);
    }
  };

  const saveProfile = async () => {
    if (!session || !result) return;
    setSaving(true);
    await fetch("/api/user", { method:"PATCH", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ flavorDNA: { title: result.title, desc: result.desc, cuisines: result.cuisines } }) });
    setSaving(false); setSaved(true);
  };

  const reset = () => { setStep(0); setAnswers({}); setResult(null); setSaved(false); };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 flex flex-col items-center justify-center max-w-4xl mx-auto flex-grow">
      <AnimatePresence mode="wait">
        {!isRevealing && !result && (
          <motion.div key="quiz" initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} className="w-full">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full glass-card mb-6 text-[#FFB547]">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-space font-bold mb-4">
                Discover Your <span className="text-gradient-amber">Flavor DNA</span>
              </h1>
              <p className="text-white/60">Question {step+1} of {QUESTIONS.length}</p>
              <div className="w-full max-w-md mx-auto h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                <motion.div className="h-full bg-[#FFB547]" initial={{ width:`${step/QUESTIONS.length*100}%` }} animate={{ width:`${(step+1)/QUESTIONS.length*100}%` }} transition={{ duration:0.3 }} />
              </div>
            </div>
            <div className="glass-card p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-editorial mb-8 text-center">{QUESTIONS[step].question}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUESTIONS[step].options.map(opt => (
                  <button key={opt.id} onClick={() => handleAnswer(QUESTIONS[step].id, opt.value)}
                    className={`p-6 rounded-xl border text-left transition-all duration-300 ${answers[QUESTIONS[step].id]===opt.value ? "border-[#FFB547] bg-[#FFB547]/10 text-white" : "border-white/10 hover:border-white/30 hover:bg-white/5 text-white/80"}`}>
                    <span className="font-space text-lg">{opt.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {isRevealing && (
          <motion.div key="revealing" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="text-center">
            <motion.div animate={{ rotate:360 }} transition={{ duration:2, repeat:Infinity, ease:"linear" }} className="inline-block mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FFB547] to-[#FF3D9A] flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-2xl font-space font-bold text-white/80 animate-pulse">Analysing your flavor profile…</h2>
          </motion.div>
        )}

        {result && !isRevealing && (
          <motion.div key="result" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} className="w-full max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#FFB547] to-[#FF3D9A] mb-8">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-space tracking-widest uppercase text-[#FFB547] mb-3">Your Flavor DNA</p>
            <h2 className="text-4xl md:text-5xl font-editorial italic text-gradient-amber mb-6">{result.title}</h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8 font-light">{result.desc}</p>
            <div className="glass-card p-6 mb-8">
              <p className="text-xs font-space uppercase tracking-widest text-white/40 mb-4">Your matched cuisines</p>
              <div className="flex flex-wrap justify-center gap-3">
                {result.cuisines.map(c => (
                  <span key={c} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-space font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/chefs" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-[#070710] font-space font-bold hover:bg-[#FFB547] transition-colors flex items-center justify-center gap-2">
                Find My Chefs <ArrowRight className="w-4 h-4" />
              </Link>
              {session && !saved && (
                <button onClick={saveProfile} disabled={saving} className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/10 transition-colors text-sm font-space font-medium disabled:opacity-50">
                  {saving ? "Saving…" : "Save to Profile"}
                </button>
              )}
              {saved && <span className="text-sm text-[#FFB547] font-space">✓ Saved to your profile</span>}
              <button onClick={reset} className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-space">
                <RefreshCcw className="w-4 h-4" /> Retake Quiz
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
