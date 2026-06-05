"use client";
import { useState } from "react";

interface Props {
  bookingId: string;
  chefId: string;
  chefName: string;
  mood: string;
  onDone: () => void;
  onClose: () => void;
}

export default function ReviewModal({ bookingId, chefId, chefName, mood, onDone, onClose }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!comment.trim()) { setError("Please write a comment."); return; }
    setLoading(true);
    const res = await fetch(`/api/chefs/${chefId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, rating, comment, mood }),
    });
    if (res.ok) { onDone(); }
    else { const d = await res.json(); setError(d.error || "Failed to submit."); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "rgba(2,4,8,0.85)", backdropFilter: "blur(8px)" }}>
      <div className="w-full max-w-md glow-teal p-8" style={{ background: "#0a1520" }}>
        <div className="font-mono-custom text-xs text-[#00d4b4] tracking-widest mb-2">LEAVE A REVIEW</div>
        <h2 className="font-display text-xl text-white mb-6">Rate {chefName}</h2>

        {/* Star picker */}
        <div className="mb-6">
          <label>YOUR RATING</label>
          <div className="flex gap-2 mt-2">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform hover:scale-110">
                <span style={{ color: rating >= s ? "#ffc14a" : "#2a4a5a" }}>★</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label>YOUR REVIEW</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)}
            placeholder="Describe your dining experience..." rows={4}
            style={{ resize: "none" }} />
        </div>

        {error && <p className="font-mono-custom text-xs text-[#ff5a28] mb-4">{error}</p>}

        <div className="flex gap-3">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={submit} disabled={loading} className="btn-primary flex-1">
            {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
          </button>
        </div>
      </div>
    </div>
  );
}
