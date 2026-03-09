"use client";

import { useEffect, useState } from "react";
import { getBankAccounts, upsertBankAccount, deleteBankAccount, BankAccount } from "@/lib/firestore";
import { CARD_COLORS } from "@/components/BankCards";
import { 
  Plus, 
  CreditCard, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  ChevronRight,
  Info,
  Hash,
  ShieldCheck
} from "lucide-react";

const EMPTY_FORM = { banco: "", titular: "", clabe: "", num_cuenta: "", activo: true, color: "slate" };

export default function AdminTarjetasPage() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Omit<BankAccount, "id">>(EMPTY_FORM);
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<Omit<BankAccount, "id">>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await getBankAccounts();
    setAccounts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  // ── Edit ──────────────────────────────────────────────────────────────────

  function startEdit(acc: BankAccount) {
    setEditingId(acc.id!);
    setEditForm({ 
      banco: acc.banco, 
      titular: acc.titular, 
      clabe: acc.clabe, 
      num_cuenta: acc.num_cuenta, 
      activo: acc.activo, 
      color: acc.color ?? "slate" 
    });
    setShowAdd(false);
  }

  async function saveEdit() {
    if (!editingId) return;
    if (!editForm.banco || !editForm.titular || editForm.clabe.length < 18) {
      alert("Banco, titular y CLABE de 18 dígitos son obligatorios."); return;
    }
    setSaving(true);
    await upsertBankAccount(editingId, editForm);
    setEditingId(null);
    await load();
    setSaving(false);
  }

  // ── Add ───────────────────────────────────────────────────────────────────

  async function saveAdd() {
    if (!addForm.banco || !addForm.titular || addForm.clabe.length < 18) {
      alert("Banco, titular y CLABE de 18 dígitos son obligatorios."); return;
    }
    setSaving(true);
    const id = addForm.banco.toLowerCase().replace(/\s+/g, "_") + "_" + Date.now();
    await upsertBankAccount(id, addForm);
    setAddForm(EMPTY_FORM);
    setShowAdd(false);
    await load();
    setSaving(false);
  }

  // ── Delete ────────────────────────────────────────────────────────────────

  async function handleDelete(acc: BankAccount) {
    if (!confirm(`¿Eliminar la cuenta de ${acc.banco} (${acc.titular})?`)) return;
    await deleteBankAccount(acc.id!);
    await load();
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Sincronizando Cuentas...</p>
    </div>
  );

  return (
    <div className="max-w-5xl animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Canales de Pago</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Gestión de identidades bancarias para checkout</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); }}
          className="group flex items-center gap-3 px-8 py-5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-[2rem] text-xs uppercase tracking-widest transition-all shadow-2xl shadow-indigo-100"
        >
          <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
            <Plus size={16} strokeWidth={3} />
          </div>
          Nueva Credencial
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main List */}
        <div className="lg:col-span-12 space-y-6">
          {accounts.length === 0 && !showAdd && (
            <div className="bg-white rounded-[3rem] p-32 text-center border border-slate-100 border-dashed">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <CreditCard size={32} className="text-slate-200" />
              </div>
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Bóveda de Pagos Vacía</p>
              <p className="text-sm font-bold text-slate-400 mt-2">Registra tu primera cuenta para recibir depósitos</p>
            </div>
          )}

          {/* Form Overlay/Section */}
          {(showAdd || editingId) && (
            <div className="bg-white rounded-[3rem] border border-slate-100 p-10 lg:p-12 shadow-2xl shadow-slate-200/50 mb-12 animate-in slide-in-from-top-8 duration-500">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                    {editingId ? <Edit3 size={20} /> : <Plus size={24} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-1">
                      {editingId ? "Editar Credencial Bancaria" : "Registrar Nueva Cuenta"}
                    </h3>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Configuración Técnica</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowAdd(false); setEditingId(null); }}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"
                >
                  <X size={20} strokeWidth={3} />
                </button>
              </div>

              <AccountForm 
                form={editingId ? editForm : addForm} 
                onChange={editingId ? setEditForm : setAddForm} 
              />

              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-10 border-t border-slate-50">
                <button 
                  onClick={editingId ? saveEdit : saveAdd} 
                  disabled={saving}
                  className="flex-1 h-16 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 uppercase text-xs tracking-[0.2em]"
                >
                  {saving ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>PROCESANDO</span>
                    </div>
                  ) : (
                    editingId ? "Guardar Cambios" : "Verificar y Guardar"
                  )}
                </button>
                <button 
                  onClick={() => { setShowAdd(false); setEditingId(null); }}
                  className="px-10 h-16 bg-white border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:bg-slate-50 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Compact List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accounts.map((acc, idx) => (
              <div 
                key={acc.id} 
                className="group relative bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Active Indicator Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${acc.activo ? "bg-indigo-500" : "bg-slate-200"}`} />

                <div className="flex items-start justify-between mb-8">
                  {acc.color && CARD_COLORS[acc.color] ? (
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black shadow-xl ${CARD_COLORS[acc.color].preview}`}>
                      {acc.banco.slice(0, 2).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-slate-900 text-white text-lg font-black shadow-xl">
                      {acc.banco.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                    <button 
                      onClick={() => startEdit(acc)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg hover:scale-105 transition-all"
                      title="Especificaciones"
                    >
                      <Edit3 size={16} strokeWidth={2.5} />
                    </button>
                    <button 
                      onClick={() => handleDelete(acc)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                      title="Retirar"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-black text-xl text-slate-900 tracking-tight">{acc.banco}</span>
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                      acc.activo ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${acc.activo ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
                      {acc.activo ? "Canal Activo" : "Fuera de Servicio"}
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Identificador de Fondos</p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-400">
                      <ShieldCheck size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Titularidad</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-tighter truncate max-w-[150px]">{acc.titular}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Hash size={14} strokeWidth={3} />
                      <span className="text-[10px] font-black uppercase tracking-widest">CLABE</span>
                    </div>
                    <span className="text-xs font-mono font-black text-slate-900 tracking-widest">{acc.clabe}</span>
                  </div>
                </div>

                <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-1000">
                   <CreditCard size={120} strokeWidth={3} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountForm({
  form,
  onChange,
}: {
  form: Omit<BankAccount, "id">;
  onChange: (f: Omit<BankAccount, "id">) => void;
}) {
  function set(field: keyof Omit<BankAccount, "id">, value: string | boolean) {
    onChange({ ...form, [field]: value });
  }
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
             Banco / Entidad
          </label>
          <div className="relative">
            <input 
              value={form.banco} 
              onChange={(e) => set("banco", e.target.value)}
              className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50 px-6 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
              placeholder="Indica la institución…" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none transition-colors border-l border-slate-100 pl-4">
              <CreditCard size={18} />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
            Nombre Legal de Cuenta
          </label>
          <div className="relative">
            <input 
              value={form.titular} 
              onChange={(e) => set("titular", e.target.value)}
              className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50 px-6 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
              placeholder="Titularidad de pagos…" 
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-200 pointer-events-none border-l border-slate-100 pl-4">
              <ChevronRight size={18} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1">
          Estructura CLABE (18 posiciones)
        </label>
        <div className="relative">
          <input 
            value={form.clabe} 
            onChange={(e) => set("clabe", e.target.value.replace(/\D/g, ""))}
            maxLength={18}
            className="w-full h-16 rounded-2xl border border-slate-100 bg-slate-50 px-6 text-base font-black font-mono focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all tracking-[0.4em] placeholder:text-slate-200"
            placeholder="000000000000000000" 
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 pointer-events-none">
            {form.clabe.length}/18
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2 ml-1 block">
          Codificación Visual de la Marca
        </label>
        <div className="flex flex-wrap gap-4">
          {Object.entries(CARD_COLORS).map(([key, c]) => (
            <button
              key={key}
              type="button"
              onClick={() => set("color", key)}
              className={`w-14 h-14 rounded-2xl ${c.preview} transition-all relative overflow-hidden group shadow-sm ${
                form.color === key
                  ? "ring-4 ring-indigo-500 ring-offset-4 scale-110 z-10 shadow-2xl shadow-indigo-200"
                  : "grayscale-[0.8] opacity-30 hover:grayscale-0 hover:opacity-100"
              }`}
            >
               {form.color === key && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/10">
                    <Check size={24} strokeWidth={4} className="text-white" />
                 </div>
               )}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl shadow-inner flex items-center justify-center transition-all duration-500 ${form.activo ? "bg-green-500 text-white" : "bg-slate-200 text-slate-400"}`}>
               {form.activo ? <Eye size={24} strokeWidth={2.5} /> : <EyeOff size={24} strokeWidth={2.5} />}
            </div>
            <div>
              <p className="text-sm font-black text-slate-900 leading-none mb-2">Visibilidad de la Credencial</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                {form.activo 
                  ? "Sincronizada con el sistema de pagos público" 
                  : "Efectivo únicamente para registros internos"
                }
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => set("activo", !form.activo)}
            className={`relative w-24 h-12 rounded-2xl transition-all duration-500 p-1.5 ${form.activo ? "bg-slate-900" : "bg-slate-200"}`}
          >
            <div className={`h-full aspect-square bg-white rounded-xl shadow-lg transition-all duration-500 transform ${form.activo ? "translate-x-12 ring-4 ring-indigo-500/20" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
      
      <div className="flex items-start gap-4 p-8 bg-indigo-50/30 rounded-[2rem] border border-indigo-100/50">
        <Info size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] font-bold text-indigo-700/60 uppercase tracking-widest leading-relaxed">
          Asegúrate de que los datos coincidan exactamente con tu identidad bancaria para evitar devoluciones o confusiones en la conciliación.
        </p>
      </div>
    </div>
  );
}
