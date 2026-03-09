"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SETTINGS, setAppSettings, AppSettings } from "@/lib/firestore";
import Link from "next/link";
import {
  Rocket,
  Settings2,
  Clock,
  Eye,
  EyeOff,
  Zap,
  Ticket,
  Users,
  Tag,
  MessageSquare,
  CreditCard,
  ChevronRight,
  TrendingUp,
  Box,
  LayoutDashboard,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  Timer
} from "lucide-react";

export default function AdminDashboard() {
  const [settings, setSettings] = useState<AppSettings>({
    mostrar_apartados: true,
    cancelacion_activa: false,
    cancelacion_horas: 24,
  });
  const [togglingApartados, setTogglingApartados] = useState(false);
  const [savingCancelacion, setSavingCancelacion] = useState(false);
  const [horasInput, setHorasInput] = useState("24");

  useEffect(() => {
    setSettings(DEFAULT_SETTINGS);
    setHorasInput(String(DEFAULT_SETTINGS.cancelacion_horas));
  }, []);

  async function toggleApartados() {
    setTogglingApartados(true);
    const next = !settings.mostrar_apartados;
    await setAppSettings({ mostrar_apartados: next });
    setSettings((s) => ({ ...s, mostrar_apartados: next }));
    setTogglingApartados(false);
  }

  async function saveCancelacion() {
    const horas = parseInt(horasInput);
    if (isNaN(horas) || horas < 1) return;
    setSavingCancelacion(true);
    await setAppSettings({ cancelacion_activa: settings.cancelacion_activa, cancelacion_horas: horas });
    setSettings((s) => ({ ...s, cancelacion_horas: horas }));
    setSavingCancelacion(false);
  }

  async function toggleCancelacion() {
    const next = !settings.cancelacion_activa;
    await setAppSettings({ cancelacion_activa: next });
    setSettings((s) => ({ ...s, cancelacion_activa: next }));
  }

  const quickLinks = [
    { href: "/admin/rifas", title: "Configurar Rifas", desc: "Arquitectura de campañas", icon: Ticket, tint: "indigo" },
    { href: "/admin/boletos", title: "Mesa de Boletos", desc: "Control de participaciones", icon: Box, tint: "rose" },
    { href: "/admin/clientes", title: "Directorio", desc: "Inteligencia de usuarios", icon: Users, tint: "amber" },
    { href: "/admin/codigos", title: "Promociones", desc: "Incentivos y cupones", icon: Tag, tint: "emerald" },
    { href: "/admin/whatsapp", title: "Comunicaciones", desc: "Estrategia de contacto", icon: MessageSquare, tint: "sky" },
    { href: "/admin/tarjetas", title: "Pasarelas", desc: "Configuración de recaudo", icon: CreditCard, tint: "slate" },
  ];

  return (
    <div className="max-w-[1400px] animate-in fade-in duration-1000">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-2xl bg-white border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-50">
                <LayoutDashboard size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Panel Central de Comando</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none">
            Visión General
          </h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-4 max-w-lg">
            Monitoreo en tiempo real de operaciones, infraestructura y desempeño comercial de la plataforma profesional.
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-white px-6 py-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Estado Servidor</p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mt-0.5">Operativo 100%</p>
            </div>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-[1.5rem] shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <Timer size={20} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Zona Horaria</p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-none mt-0.5">GMT-6 • CDMX</p>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        {[
          { label: "Volumen Comercial", value: "$0.00", icon: TrendingUp, delta: "+0%", accent: "indigo" },
          { label: "Campañas Activas", value: "0", icon: Rocket, delta: "Online", accent: "rose" },
          { label: "Usuarios Únicos", value: "0", icon: Users, delta: "Base", accent: "amber" },
          { label: "Tasa de Rebote", value: "0.0%", icon: Zap, delta: "Avg", accent: "emerald" },
        ].map((stat, i) => (
          <div key={i} className="group relative bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col gap-6 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500`}>
                <stat.icon size={24} strokeWidth={2.5} />
              </div>
              <span className="text-[9px] font-black px-3 py-1.5 bg-slate-50 rounded-full text-slate-400 uppercase tracking-widest group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                {stat.delta}
              </span>
            </div>
            <div className="z-10">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 leading-none">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Operations Console */}
        <section className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/30 border border-slate-100 p-12 lg:p-14 overflow-hidden relative">
            <div className="flex items-center justify-between mb-16">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <Settings2 size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Consola de Operación</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Parámetros Críticos del Sistema</p>
                </div>
              </div>
              <div className="hidden sm:block">
                 <div className="w-1 bg-slate-100 h-10 rounded-full" />
              </div>
            </div>

            <div className="grid gap-12">
              {/* Apartados Module */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 group">
                <div className="flex gap-6 max-w-lg">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-xl shadow-indigo-50 border ${settings.mostrar_apartados ? 'bg-white border-indigo-200 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-200'}`}>
                    {settings.mostrar_apartados ? <Eye size={32} strokeWidth={2.5} /> : <EyeOff size={32} strokeWidth={2.5} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 uppercase">Visibilidad del Inventario</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                      {settings.mostrar_apartados
                        ? "Transparencia total: Los usuarios pueden ver el estado actual de cada boleto en tiempo real."
                        : "Modo simplificado: Se ocultan los apartados para incentivar la selección inmediata."}
                    </p>
                  </div>
                </div>
                <button
                  onClick={toggleApartados}
                  disabled={togglingApartados}
                  className={`relative w-24 h-12 flex-shrink-0 rounded-2xl p-1.5 transition-all duration-700 outline-none ${settings.mostrar_apartados ? "bg-indigo-50 border border-indigo-100" : "bg-slate-100"}`}
                >
                  <div className={`h-full aspect-square transition-all duration-700 transform rounded-xl shadow-xl ${settings.mostrar_apartados ? "translate-x-12 bg-indigo-600" : "translate-x-0 bg-white"}`} />
                </button>
              </div>

              <div className="h-px bg-slate-50 w-full" />

              {/* Automation Module */}
              <div className="space-y-10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                  <div className="flex gap-6 max-w-lg">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700 shadow-inner ${settings.cancelacion_activa ? 'bg-rose-600 text-white shadow-rose-200' : 'bg-slate-100 text-slate-300'}`}>
                      <Smartphone size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight mb-2 uppercase">Protocolo de Limpieza</h3>
                      <p className="text-xs font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
                        Ejecución automática de reciclaje de inventario para folios con pago no reportado.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleCancelacion}
                    className={`relative w-24 h-12 flex-shrink-0 rounded-2xl p-1.5 transition-all duration-700 outline-none ${settings.cancelacion_activa ? "bg-rose-600 ring-4 ring-rose-50" : "bg-slate-200"}`}
                  >
                    <div className={`h-full aspect-square bg-white rounded-xl shadow-xl transition-all duration-700 transform ${settings.cancelacion_activa ? "translate-x-12 ring-2 ring-rose-500/20" : "translate-x-0"}`} />
                  </button>
                </div>

                {settings.cancelacion_activa && (
                  <div className="sm:ml-26 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 animate-in slide-in-from-top-4 duration-500 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-8">
                       <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm">
                          <Clock size={24} strokeWidth={2.5} />
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ventana de Reporte (Horas)</p>
                          <input
                            type="number"
                            min={1}
                            max={720}
                            value={horasInput}
                            onChange={(e) => setHorasInput(e.target.value)}
                            className="w-32 bg-white border border-slate-200 rounded-xl px-4 py-3 text-2xl font-black text-slate-900 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-400 outline-none transition-all text-center tracking-tighter"
                          />
                       </div>
                    </div>
                    <button
                      onClick={saveCancelacion}
                      disabled={savingCancelacion}
                      className="group flex items-center gap-3 px-10 h-16 bg-white border border-indigo-100 hover:bg-slate-50 disabled:opacity-50 text-indigo-600 font-black rounded-2xl transition-all shadow-xl shadow-indigo-50 text-xs uppercase tracking-widest active:scale-95"
                    >
                      {savingCancelacion ? (
                        <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={16} strokeWidth={3} />
                          <span>Guardar Consola</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="absolute top-0 right-0 p-14 opacity-[0.02] pointer-events-none">
              <Settings2 size={240} />
            </div>
          </div>
        </section>

        {/* Quick Access Cluster */}
        <section className="lg:col-span-4 space-y-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Zap size={20} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">Accesos Directos</h2>
          </div>

          <div className="flex flex-col gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex items-center gap-5 overflow-hidden active:scale-95"
              >
                <div className={`p-4 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-12 transition-all duration-500 flex-shrink-0 z-10`}>
                  <item.icon size={22} strokeWidth={2.5} />
                </div>
                <div className="flex-1 z-10">
                  <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight group-hover:text-indigo-600 transition-colors mb-0.5">{item.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-70">{item.desc}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-200 group-hover:border-indigo-100 group-hover:text-indigo-400 transition-all z-10">
                   <ChevronRight size={18} strokeWidth={3} />
                </div>
                
                {/* Visual Accent */}
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-2 h-12 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-full" />
              </Link>
            ))}
          </div>
          
          <div className="bg-white border border-indigo-100 rounded-[2.5rem] p-10 text-slate-900 relative overflow-hidden group shadow-2xl shadow-indigo-100/50">
             <div className="relative z-10">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-3 leading-none">Canal Prioritario</p>
                <h4 className="text-xl font-black mb-10 leading-none tracking-tight uppercase">Mesa de Ayuda</h4>
                <button className="flex items-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl active:scale-95">
                   Iniciar Consulta
                </button>
             </div>
             <div className="absolute -right-6 -bottom-6 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000 rotate-12 text-indigo-600">
                <ShieldCheck size={180} strokeWidth={1} />
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
