"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Logo from "@/components/Logo";
import { ShieldCheck, Lock, User, ArrowRight, Smartphone } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      const token = await auth.currentUser?.getIdToken();
      if (token) {
        const res = await fetch("/api/admin/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: token }),
        });
        if (!res.ok) throw new Error("session");
      }
      router.push("/admin");
    } catch {
      setError("Las credenciales proporcionadas no son válidas.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Superior Branding */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center shadow-xl shadow-indigo-100 mb-8 group transition-transform hover:scale-105 duration-500 border border-indigo-100">
            <ShieldCheck size={32} className="text-indigo-600 group-hover:rotate-12 transition-transform duration-500" strokeWidth={2.5} />
          </div>
          <div className="opacity-90 grayscale hover:grayscale-0 transition-all duration-700">
            <Logo size="lg" showText={true} />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mt-6">Infraestructura Administrativa</p>
        </div>

        {/* Login Container */}
        <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/50 p-12 lg:p-14 border border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 text-slate-900 tracking-tighter">Acceso Seguro</h2>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-10">Inicie sesión para continuar</p>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identificador de Usuario</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                     <User size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    placeholder="ejemplo@rifaspro.mx"
                    className="w-full h-16 rounded-[1.5rem] border border-slate-50 bg-slate-50 pl-16 pr-6 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Clave de Seguridad</label>
                <div className="relative group">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                     <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    placeholder="••••••••"
                    className="w-full h-16 rounded-[1.5rem] border border-slate-50 bg-slate-50 pl-16 pr-6 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                   <p className="text-rose-600 text-[11px] font-bold uppercase tracking-wider">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group w-full h-16 bg-white hover:bg-slate-50 disabled:opacity-50 text-indigo-600 border border-indigo-100 font-black rounded-[1.5rem] transition-all shadow-xl shadow-indigo-50 flex items-center justify-center gap-4 text-xs tracking-[0.2em] uppercase"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Iniciar Sesión Administrativa</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                  </>
                )}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-50"></span>
                </div>
                <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.4em]">
                  <span className="bg-white px-6 text-slate-200">Terminal Demo</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/admin")}
                className="w-full h-16 bg-white hover:bg-slate-50 text-slate-400 font-black rounded-[1.5rem] transition-all border border-slate-100 shadow-sm text-[10px] tracking-[0.2em] uppercase hover:text-slate-900 hover:border-slate-300 active:scale-95"
              >
                Acceso Directo Rápido
              </button>
            </form>
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4">
             <Smartphone size={320} strokeWidth={1} />
          </div>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-[10px] font-bold text-slate-300 uppercase tracking-[0.4em] mt-12">
          &copy; 2026 Pagina Pro Cloud Platform
        </p>
      </div>
    </div>
  );
}
