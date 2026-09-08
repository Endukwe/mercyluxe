"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "@phosphor-icons/react";

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-onyx px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <div className="text-center">
          <span className="font-display text-3xl tracking-[0.14em] text-ivory">MERCY LUXE</span>
          <p className="label-luxe mt-2 text-[10px] text-gold">Studio Admin</p>
        </div>
        <div className="mt-10">
          <label htmlFor="pw" className="label-luxe mb-2 block text-[10px] text-ivory/50">
            Password
          </label>
          <input
            id="pw"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-ivory/15 bg-ivory/5 px-4 py-3 text-ivory outline-none transition-colors focus:border-gold"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="label-luxe mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-4 text-[11px] text-onyx transition-transform hover:bg-gold-bright active:scale-[0.98] disabled:opacity-60"
        >
          <Lock size={15} weight="fill" /> {loading ? "Signing in" : "Enter Studio"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
