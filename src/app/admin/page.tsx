"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ADMIN_TOKEN_KEY = "admin_token";

export default function HalamanMasukAdmin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login gagal. Periksa kredensial Anda."); return; }
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Koneksi gagal. Periksa jaringan Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 100%)" }}>

      {/* Dekorasi latar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#818cf8,transparent 70%)" }}></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20" style={{ background: "radial-gradient(circle,#a78bfa,transparent 70%)" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 border border-white"></div>
      </div>

      {/* Tombol Kembali ke Beranda */}
      <Link
        href="/"
        className="absolute top-6 left-6 sm:top-8 sm:left-8 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-indigo-200 hover:text-white text-xs font-semibold uppercase tracking-wider backdrop-blur-md transition-all duration-300"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Beranda
      </Link>

      {/* Kartu login */}
      <div className="relative w-full max-w-sm">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-3 shadow-xl"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              N
            </div>
            <h1 className="text-xl font-bold text-white">Niken Furniture</h1>
            <p className="text-indigo-200 text-xs mt-1">Panel Administrasi</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-indigo-200 text-xs font-semibold uppercase tracking-wide">
                Nama Pengguna
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                  placeholder="Masukkan nama pengguna"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-indigo-200 text-xs font-semibold uppercase tracking-wide">
                Kata Sandi
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPass ? "text" : "password"}
                  className="w-full h-11 pl-10 pr-11 rounded-xl bg-white/10 border border-white/20 text-white placeholder-indigo-300 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 transition-all duration-200"
                  placeholder="Masukkan kata sandi"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-300 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/40 text-red-200 text-xs px-3.5 py-2.5 rounded-xl">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-sm font-bold text-white transition-all duration-200 mt-2 relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed active:scale-[.98] shadow-lg hover:shadow-xl"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Memproses…
                </span>
              ) : "Masuk ke Dashboard"}
            </button>
          </form>

          <p className="text-center text-indigo-300/60 text-[10px] mt-6">
            © {new Date().getFullYear()} Niken Furniture · Panel Administrasi
          </p>
        </div>
      </div>
    </div>
  );
}
