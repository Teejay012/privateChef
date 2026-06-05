"use client";
import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen grid-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="font-display text-6xl text-[#ff5a28] mb-4">⚠</div>
        <h1 className="font-display text-2xl text-white mb-4">AUTH ERROR</h1>
        <p className="text-[#5a7a8a] mb-8">Something went wrong during sign in. Please try again.</p>
        <Link href="/auth/login" className="btn-primary">Back to Login</Link>
      </div>
    </main>
  );
}
