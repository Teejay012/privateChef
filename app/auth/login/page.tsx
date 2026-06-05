"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleGoogle = () => signIn("google", { callbackUrl: "/dashboard" });

  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-6">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 border-2 border-[#00d4b4] rotate-45 opacity-60" />
              <div className="absolute inset-1 border border-[#ff5a28] rotate-45" />
              <span className="absolute inset-0 flex items-center justify-center font-display text-[#00d4b4] text-xs">C</span>
            </div>
            <span className="font-display text-sm tracking-[0.3em] text-white">CHEF<span className="text-[#00d4b4]">HAUS</span></span>
          </Link>
          <h1 className="font-display text-2xl text-white mb-2">WELCOME BACK</h1>
          <p className="text-sm text-[#5a7a8a]">Sign in to your account</p>
        </div>

        <div className="glow-teal p-8" style={{ background: "#0a1520" }}>
          {/* Google */}
          <button onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 py-3 mb-6 border border-[rgba(255,255,255,0.1)] text-sm text-[#5a7a8a] hover:border-[#00d4b4] hover:text-white transition-all duration-200"
            style={{ background: "#060d14" }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
            <span className="font-mono-custom text-xs text-[#2a4a5a] tracking-widest">OR</span>
            <div className="flex-1 h-px bg-[rgba(255,255,255,0.06)]" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label>EMAIL ADDRESS</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <label>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>

            {error && <p className="font-mono-custom text-xs text-[#ff5a28] tracking-wide">{error}</p>}

            <button type="submit" className="btn-primary w-full text-center mt-2" disabled={loading}>
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>

        <p className="text-center font-mono-custom text-xs text-[#2a4a5a] mt-6 tracking-wide">
          No account?{" "}
          <Link href="/auth/register" className="text-[#00d4b4] hover:underline">Create one free</Link>
        </p>
      </div>
    </main>
  );
}
