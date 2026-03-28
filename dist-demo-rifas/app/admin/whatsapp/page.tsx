"use client";

import { useEffect, useState } from "react";
import { getWhatsAppConfig, setWhatsAppConfig } from "@/lib/firestore";
import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  Phone,
  Settings,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from "lucide-react";

export default function AdminWhatsAppPage() {
  const [numeros, setNumeros] = useState<string[]>([]);
  const [indiceActual, setIndiceActual] = useState(0);
  const [nuevo, setNuevo] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ayudaNumero, setAyudaNumero] = useState("");

  useEffect(() => {
    getWhatsAppConfig().then((c) => {
      if (c) {
        setNumeros(c.numeros ?? []);
        setIndiceActual(c.indice_actual ?? 0);
        setAyudaNumero(c.ayuda_numero ?? "");
      }
      setLoading(false);
    });
  }, []);

  async function save(nuevosNumeros: string[], nuevoIndice: number, nuevoAyuda?: string) {
    setSaving(true);
    await setWhatsAppConfig({ 
      numeros: nuevosNumeros, 
      indice_actual: nuevoIndice,
      ayuda_numero: nuevoAyuda !== undefined ? nuevoAyuda : ayudaNumero
    });
    setNumeros(nuevosNumeros);
    setIndiceActual(nuevoIndice);
    if (nuevoAyuda !== undefined) setAyudaNumero(nuevoAyuda);
    setSaving(false);
  }

  async function agregar() {
    const num = nuevo.trim().replace(/\D/g, "");
    if (num.length < 10) { alert("Ingresa un número válido de 10 dígitos."); return; }
    if (numeros.includes(num)) { alert("Ese número ya está en la lista."); return; }
    await save([...numeros, num], indiceActual);
    setNuevo("");
  }

  async function eliminar(idx: number) {
    const nuevos = numeros.filter((_, i) => i !== idx);
    const nuevoIndice = nuevos.length === 0 ? 0 : indiceActual % nuevos.length;
    await save(nuevos, nuevoIndice);
  }

  async function setActivo(idx: number) {
    await save(numeros, idx);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 animate-pulse">Sincronizando WhatsApp</p>
      </div>
    );
  }

  const indiceVivo = numeros.length ? indiceActual % numeros.length : 0;

  return (
    <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-rose-50 rounded-[1.5rem] flex items-center justify-center text-rose-600 shadow-sm border border-rose-100/50">
            <MessageSquare size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Canales de WhatsApp</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Rotación automática de agentes de venta</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-12 space-y-10">
          
          {/* Main Config */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Lista */}
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full">
              <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div>
                  <h2 className="font-black text-slate-900 text-base leading-none mb-1">Agentes Activos</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total: {numeros.length}</p>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100 text-slate-300">
                  <RefreshCw size={16} />
                </div>
              </div>

              <div className="flex-1 divide-y divide-slate-50">
                {numeros.length > 0 ? (
                  numeros.map((n, i) => (
                    <div key={n} className={`group flex items-center gap-4 px-8 py-6 transition-colors ${i === indiceVivo ? 'bg-green-50/20' : 'hover:bg-slate-50/50'}`}>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${i === indiceVivo ? 'bg-white border-green-200 text-green-500 shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                        <Phone size={20} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-lg font-black text-slate-900 leading-none mb-1">{n}</p>
                        {i === indiceVivo && (
                          <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                            <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">En Turno</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        {i !== indiceVivo && (
                          <button
                            onClick={() => setActivo(i)}
                            disabled={saving}
                            className="px-4 py-2 text-[9px] font-black tracking-widest uppercase text-slate-400 hover:text-slate-900 transition-all bg-white border border-slate-100 rounded-xl"
                          >
                            Activar
                          </button>
                        )}
                        <button
                          onClick={() => eliminar(i)}
                          disabled={saving}
                          className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-4">
                      <Phone size={24} />
                    </div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">No hay números</p>
                  </div>
                )}
              </div>
            </section>

            {/* Acciones & Soporte */}
            <div className="space-y-10 flex flex-col">
              {/* Agregar */}
              <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10 flex flex-col flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-600 border border-rose-100/50">
                    <Plus size={24} strokeWidth={3} />
                  </div>
                  <h2 className="font-black text-slate-900 text-base leading-none">Añadir Número</h2>
                </div>
                
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Nuevo Agente (10 dígitos)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300">
                        <Phone size={20} />
                      </div>
                      <input
                        value={nuevo}
                        onChange={(e) => setNuevo(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && agregar()}
                        placeholder="55 1234 5678"
                        maxLength={10}
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-mono text-xl text-slate-900 placeholder:text-slate-200 focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={agregar}
                    disabled={saving || !nuevo}
                    className="w-full py-5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] transition-all shadow-xl shadow-rose-100"
                  >
                    {saving ? "Guardando..." : "Confirmar Agente"}
                  </button>
                </div>
              </section>

              {/* Soporte */}
              <section className="bg-slate-900 rounded-[2.5rem] shadow-xl p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <ShieldCheck size={120} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white/50 backdrop-blur-sm">
                      <HelpCircle size={24} />
                    </div>
                    <div>
                      <h2 className="font-black text-white text-base leading-none mb-1">Soporte Técnico</h2>
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Número de Ayuda Global</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/50 font-medium mb-8 leading-relaxed max-w-[240px]">
                    Este número se utiliza para tickets de soporte y consultas técnicas.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      value={ayudaNumero}
                      onChange={(e) => setAyudaNumero(e.target.value.replace(/\D/g, ""))}
                      placeholder="Ayuda técnica"
                      maxLength={10}
                      className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-2xl font-mono text-lg text-white placeholder:text-white/20 focus:ring-4 focus:ring-white/5 outline-none transition-all"
                    />
                    <button
                      onClick={() => save(numeros, indiceActual, ayudaNumero)}
                      disabled={saving}
                      className="px-8 py-4 bg-white text-slate-900 hover:bg-slate-50 disabled:opacity-50 font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-lg"
                    >
                      Actualizar
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
