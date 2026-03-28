"use client";

import { useEffect, useState } from "react";
import {
  getDiscountCodes, createDiscountCode, updateDiscountCode,
  deleteDiscountCode, getRifas, DiscountCode, Rifa,
} from "@/lib/firestore";
import { 
  Plus, 
  Ticket, 
  Target, 
  BarChart3, 
  Copy, 
  Check, 
  Edit3, 
  RotateCcw, 
  Trash2,
  X,
  Zap,
  Tag
} from "lucide-react";

const EMPTY: Omit<DiscountCode, "id"> = {
  codigo: "", porcentaje: 10, activo: true, usos: 0, max_usos: 100, rifa_ids: [],
};

function generateCode() {
  const words = ["RIFA", "PRO", "WIN", "LUCKY", "PROMO", "VIP", "SUPER", "MEGA"];
  const word = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 90) + 10;
  return `${word}${num}`;
}

export default function AdminCodigosPage() {
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);

  async function load() { setCodes(await getDiscountCodes()); }
  useEffect(() => {
    load();
    getRifas().then(setRifas);
  }, []);

  function startNew() { setForm(EMPTY); setEditId(null); setShowForm(true); }
  function startEdit(c: DiscountCode) {
    setForm({ codigo: c.codigo, porcentaje: c.porcentaje, activo: c.activo, usos: c.usos, max_usos: c.max_usos, rifa_ids: c.rifa_ids ?? [] });
    setEditId(c.id!);
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await updateDiscountCode(editId, form);
      } else {
        await createDiscountCode({ ...form, codigo: form.codigo.toUpperCase() });
      }
      setShowForm(false);
      await load();
    } catch { alert("Error al guardar."); }
    setSaving(false);
  }

  async function toggleActivo(c: DiscountCode) {
    await updateDiscountCode(c.id!, { activo: !c.activo });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este código?")) return;
    await deleteDiscountCode(id);
    await load();
  }

  async function handleReset(c: DiscountCode) {
    if (!confirm(`¿Resetear los usos de "${c.codigo}" a 0?`)) return;
    setResetting(c.id!);
    await updateDiscountCode(c.id!, { usos: 0 });
    await load();
    setResetting(null);
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    });
  }

  // Stats
  const totalActivos = codes.filter((c) => c.activo && c.usos < c.max_usos).length;
  const totalUsos = codes.reduce((s, c) => s + c.usos, 0);
  const agotados = codes.filter((c) => c.usos >= c.max_usos).length;

  return (
    <div className="max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Estrategias de Descuento</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión de cupones y promociones exclusivas</p>
        </div>
        <button
          onClick={startNew}
          className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-100"
        >
          <Plus size={18} strokeWidth={3} />
          Crear Cupón
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
            <Ticket size={28} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Estrategias</p>
            <p className="text-3xl font-black text-slate-900 leading-none">{codes.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
            <Zap size={28} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Activos Ahora</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-green-600 leading-none">{totalActivos}</p>
              {agotados > 0 && <span className="text-[10px] font-black text-rose-500 uppercase">({agotados} agotados)</span>}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500">
            <BarChart3 size={28} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Usos Totales</p>
            <p className="text-3xl font-black text-indigo-600 leading-none">{totalUsos}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      {codes.length === 0 ? (
        <div className="bg-white rounded-[3rem] border border-dashed border-slate-200 p-24 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Tag size={32} className="text-slate-200" />
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Módulo Vacío</p>
          <button onClick={startNew} className="text-xs text-indigo-600 font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
            Empezar primera campaña
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {codes.map((c) => {
            const pct = c.max_usos > 0 ? Math.min((c.usos / c.max_usos) * 100, 100) : 0;
            const agotado = c.usos >= c.max_usos;
            const isCopied = copied === c.codigo;

            return (
              <div
                key={c.id}
                className={`group bg-white rounded-[2.5rem] border p-8 flex flex-col gap-8 transition-all hover:shadow-2xl hover:shadow-slate-100 relative overflow-hidden ${
                  c.activo && !agotado
                    ? "border-slate-100 hover:border-indigo-200"
                    : "border-slate-50 opacity-60 bg-slate-50/10"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono font-black text-2xl text-slate-900 tracking-wider">
                        {c.codigo}
                      </span>
                      <button
                        onClick={() => copyCode(c.codigo)}
                        className={`p-2 rounded-xl transition-all ${isCopied ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-slate-50 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50'}`}
                      >
                        {isCopied ? <Check size={14} strokeWidth={3} /> : <Copy size={14} strokeWidth={2.5} />}
                      </button>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-indigo-600 leading-none">{c.porcentaje}%</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Off</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleActivo(c)}
                    disabled={agotado}
                    className={`text-[9px] font-black uppercase tracking-[0.15em] px-4 py-2 rounded-full border transition-all ${
                      agotado
                        ? "bg-rose-50 text-rose-600 border-rose-100"
                        : c.activo
                        ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                        : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                    }`}
                  >
                    {agotado ? "Agotado" : c.activo ? "Activo" : "Pausado"}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Capacidad de Usos</span>
                    <span className="text-xs font-black text-slate-900">{c.usos} <span className="text-slate-300 text-[10px] font-bold">DE</span> {c.max_usos}</span>
                  </div>
                  <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100 shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        pct >= 100 ? "bg-rose-500" : pct >= 80 ? "bg-amber-500" : "bg-indigo-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  {!c.rifa_ids || c.rifa_ids.length === 0 ? (
                    <div className="inline-flex items-center gap-2 bg-indigo-50/50 text-indigo-600 px-4 py-1.5 rounded-xl border border-indigo-100/50">
                      <Target size={12} />
                      <span className="text-[10px] font-black uppercase tracking-wider">Aplicación Global</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                    {c.rifa_ids.map((rid) => {
                      const r = rifas.find((r) => r.id === rid);
                      return (
                        <span key={rid} className="text-[9px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 px-3 py-1 rounded-lg border border-slate-100">
                          {r?.nombre ?? rid}
                        </span>
                      );
                    })}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(c)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" title="Editar">
                      <Edit3 size={18} />
                    </button>
                    {c.usos > 0 && (
                      <button onClick={() => handleReset(c)} disabled={resetting === c.id} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" title="Resetear Usos">
                        <RotateCcw size={18} className={resetting === c.id ? 'animate-spin' : ''} />
                      </button>
                    )}
                  </div>
                  <button onClick={() => handleDelete(c.id!)} className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="Eliminar">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4 overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">{editId ? "Editar Estrategia" : "Nueva Estrategia"}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Configuración de beneficios</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all">
                <X size={24} strokeWidth={3} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-10 space-y-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Código Promocional</label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-300">
                      <Tag size={20} />
                    </div>
                    <input
                      value={form.codigo}
                      onChange={(e) => setForm({ ...form, codigo: e.target.value.toUpperCase().replace(/\s/g, "") })}
                      required
                      placeholder="VERANO25"
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-mono text-xl font-black tracking-widest text-slate-900 placeholder:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, codigo: generateCode() })}
                    className="px-6 bg-white border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm flex-shrink-0"
                  >
                    Auto
                  </button>
                </div>
              </div>

              <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100">
                <div className="flex justify-between items-end mb-6">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Poder de Descuento</label>
                  <span className="text-3xl font-black text-indigo-600">{form.porcentaje}<span className="text-sm ml-1">% OFF</span></span>
                </div>
                <input
                  type="range" min={1} max={100} value={form.porcentaje}
                  onChange={(e) => setForm({ ...form, porcentaje: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tope de Usos</label>
                  <input
                    type="number" min={1} value={form.max_usos}
                    onChange={(e) => setForm({ ...form, max_usos: Number(e.target.value) })}
                    required
                    className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-[1.5rem] font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] h-[64px]">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activo</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, activo: !form.activo })}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${form.activo ? "bg-green-500 shadow-lg shadow-green-100" : "bg-slate-200"}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${form.activo ? "translate-x-7" : "translate-x-1"}`} />
                    </button>
                  </div>
                </div>
              </div>

              {rifas.length > 0 && (
                <div className="space-y-4">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Restricciones de Campaña</label>
                  <div className="grid grid-cols-1 gap-3 max-h-48 overflow-y-auto pr-3 custom-scrollbar">
                    <label className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${!form.rifa_ids || form.rifa_ids.length === 0 ? "bg-indigo-50 border-indigo-200 ring-4 ring-indigo-500/5" : "bg-white border-slate-100"}`}>
                      <input
                        type="checkbox"
                        checked={!form.rifa_ids || form.rifa_ids.length === 0}
                        onChange={() => setForm({ ...form, rifa_ids: [] })}
                        className="w-5 h-5 accent-indigo-600 rounded-lg"
                      />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Válido en cualquier rifa</span>
                    </label>
                    {rifas.map((r) => {
                      const selected = (form.rifa_ids ?? []).includes(r.id!);
                      return (
                        <label key={r.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${selected ? "bg-white border-indigo-200 ring-4 ring-indigo-500/5" : "bg-white border-slate-100"}`}>
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => {
                              const current = form.rifa_ids ?? [];
                              setForm({
                                ...form,
                                rifa_ids: selected
                                  ? current.filter((id: string) => id !== r.id)
                                  : [...current, r.id!],
                              });
                            }}
                            className="w-5 h-5 accent-indigo-600 rounded-lg"
                          />
                          <span className="text-xs font-bold text-slate-500">{r.nombre}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-[1.5rem] text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-slate-200 mt-4 h-[64px]"
              >
                {saving ? "Procesando Datos..." : editId ? "Actualizar Beneficio" : "Lanzar Estrategia"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
