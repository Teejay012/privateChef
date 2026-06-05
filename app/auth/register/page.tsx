"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    // Auto sign in
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/dashboard");
  };

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-[#00d4b4] rotate-45 opacity-60" />
              <div className="absolute inset-1 border border-[#ff5a28] rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-[#00d4b4] text-xs">C</span>
            </div>
            <span className="font-display text-sm tracking-[0.3em] text-white">CHEF<span className="text-[#00d4b4]">HAUS</span></span>
          </Link>
          <h1 className="font-display text-2xl text-white mb-2">CREATE ACCOUNT</h1>
          <p className="text-sm text-[#5a7a8a]">Start your private dining journey</p>
        </div>

        <div className="glow-teal p-8" style={{ background: "#0a1520" }}>
          <button onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3 mb-6 border border-[rgba(255,255,255,0.1)] text-sm text-[#5a7a8a] hover:border-[#00d4b4] hover:text-white transition-all duration-200" style={{ background: "#060d14" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Sign up with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            <span className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest">OR</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label>FULL NAME</label>
              <input value={form.name} onChange={set("name")} placeholder="Your name" required />
            </div>
            <div>
              <label>EMAIL</label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required />
            </div>
            <div>
              <label>PASSWORD</label>
              <input type="password" value={form.password} onChange={set("password")} placeholder="Min 6 characters" required minLength={6} />
            </div>
            <div>
              <label>CONFIRM PASSWORD</label>
              <input type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" required />
            </div>

            {error && <p className="font-mono-custom text-xs text-[#ff5a28]">{error}</p>}

            <button type="submit" className="btn-primary w-full text-center mt-2" disabled={loading}>
              {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>

        <p className="text-center font-mono-custom text-xs text-[#2a4a5a] mt-6">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[#00d4b4] hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
