"use client";

import { useEffect, useState } from "react";
import { getRifas, createBoleto, getNumerosOcupados, registrarNumerosVendidos, getBoletoByFolio, Rifa } from "@/lib/firestore";
import { generateFolio } from "@/lib/folio";
import { Timestamp } from "firebase/firestore";
import NumberGrid from "@/components/NumberGrid";
import { Gift, CheckCircle2, Info, ChevronRight, Hash, Trash2 } from "lucide-react";

export default function RegalosPage() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [rifaId, setRifaId] = useState("");
  const [rifa, setRifa] = useState<Rifa | null>(null);
  const [vendidosArr, setVendidosArr] = useState<number[]>([]);
  const [apartadosArr, setApartadosArr] = useState<number[]>([]);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [form, setForm] = useState({ nombre: "", apellidos: "", celular: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState<{ folio: string; count: number } | null>(null);

  useEffect(() => {
    getRifas().then((rs) => setRifas(rs.filter((r) => r.activa)));
  }, []);

  useEffect(() => {
    if (!rifaId) { setRifa(null); setVendidosArr([]); setApartadosArr([]); setSeleccionados([]); return; }
    const found = rifas.find((r) => r.id === rifaId) ?? null;
    setRifa(found);
    setSeleccionados([]);
    if (found) {
      getNumerosOcupados(rifaId).then(({ vendidos, apartados }) => {
        setVendidosArr(vendidos);
        setApartadosArr(apartados);
      });
    }
  }, [rifaId, rifas]);

  function toggleNumber(n: number) {
    setSeleccionados((prev) =>
      prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]
    );
  }

  async function handleRegalar(e: React.FormEvent) {
    e.preventDefault();
    if (!rifa || seleccionados.length === 0) return;
    if (!confirm(`¿Regalar ${seleccionados.length} boleto(s) a ${form.nombre || "sin nombre"}? Los números quedarán marcados como vendidos.`)) return;

    setSaving(true);
    setSuccess(null);
    try {
      let folio = generateFolio();
      for (let i = 0; i < 5; i++) {
        const exists = await getBoletoByFolio(folio);
        if (!exists) break;
        folio = generateFolio();
      }

      await createBoleto({
        folio,
        rifa_id: rifa.id!,
        numeros: seleccionados,
        nombre: form.nombre || "Regalo",
        apellidos: form.apellidos,
        celular: form.celular,
        estado: "",
        codigo_descuento: "REGALO",
        descuento_aplicado: 100,
        precio_total: 0,
        status: "pagado",
        created_at: Timestamp.now(),
      });

      // Mark numbers directly as vendido in subcollection
      await registrarNumerosVendidos(rifa.id!, seleccionados);

      // Refresh grid
      const { vendidos, apartados } = await getNumerosOcupados(rifa.id!);
      setVendidosArr(vendidos);
      setApartadosArr(apartados);

      setSuccess({ folio, count: seleccionados.length });
      setSeleccionados([]);
      setForm({ nombre: "", apellidos: "", celular: "" });
    } catch {
      alert("Error al registrar el regalo. Intenta de nuevo.");
    }
    setSaving(false);
  }

  return (
    <div className="max-w-7xl animate-in fade-in duration-700 pb-20">
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-amber-50 rounded-[1.5rem] flex items-center justify-center text-amber-600 shadow-sm border border-amber-100/50">
            <Gift size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Cortesías y Regalos</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Asigna boletos gratuitos manualmente a tus clientes</p>
          </div>
        </div>
      </div>

      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-5 bg-green-50/50 border border-green-100 rounded-[2.5rem] p-8 mb-12 shadow-xl shadow-green-100/20 animate-in slide-in-from-top duration-500">
          <div className="w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center text-green-500 shadow-sm border border-green-100 flex-shrink-0">
            <CheckCircle2 size={32} />
          </div>
          <div className="flex-1">
            <p className="font-black text-green-900 uppercase tracking-[0.2em] text-[10px] mb-1">Operación Exitosa</p>
            <p className="text-sm font-bold text-green-700/80 leading-relaxed">
              Se han registrado <span className="text-green-900 font-black">{success.count} boletos</span> con éxito. <br/>
              Folio de seguimiento: <span className="font-mono font-black text-white bg-green-600 px-3 py-1 rounded-xl ml-1 shadow-md uppercase tracking-widest text-xs">{success.folio}</span>
            </p>
          </div>
          <button onClick={() => setSuccess(null)} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-white text-green-300 hover:text-green-500 transition-all">
            <Trash2 size={24} />
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-10">

        {/* Left: configuration */}
        <div className="lg:col-span-4 space-y-10">

          <div className="space-y-10">
            {/* Step 1: Rifa selector */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                <Hash size={80} />
              </div>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px] tracking-tighter">01</span>
                <h2 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Campaña Destino</h2>
              </div>
              
              <div className="relative group">
                <select
                  value={rifaId}
                  onChange={(e) => setRifaId(e.target.value)}
                  className="w-full rounded-[1.5rem] border border-slate-100 bg-slate-50 px-6 py-5 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all appearance-none cursor-pointer pr-12"
                >
                  <option value="">Seleccionar Sorteo</option>
                  {rifas.map((r) => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:text-slate-900 transition-colors">
                  <ChevronRight size={20} className="rotate-90" />
                </div>
              </div>

              {rifa && (
                <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100/50">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Rango Total</p>
                    <p className="text-sm font-black text-slate-900">{rifa.num_inicio}—{rifa.num_fin}</p>
                  </div>
                  <div className="bg-green-50/30 rounded-2xl p-4 border border-green-100/30">
                    <p className="text-[9px] font-black text-green-300 uppercase tracking-widest mb-1">Disponibles</p>
                    <p className="text-sm font-black text-green-600">{(rifa.num_fin - rifa.num_inicio + 1) - (rifa.num_vendidos ?? 0) - (rifa.num_apartados ?? 0)}</p>
                  </div>
                </div>
              )}
            </section>

            {/* Step 2: Recipient */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10">
              <div className="flex items-center gap-4 mb-8">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px] tracking-tighter">02</span>
                <h2 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Beneficiario</h2>
              </div>
              <form id="regalo-form" onSubmit={handleRegalar} className="space-y-6">
                <div className="space-y-4">
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Nombre del cliente"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
                  />
                  <input
                    value={form.apellidos}
                    onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                    placeholder="Apellidos"
                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
                  />
                  <div className="relative">
                    <input
                      value={form.celular}
                      onChange={(e) => setForm({ ...form, celular: e.target.value })}
                      placeholder="WhatsApp (10 dígitos)"
                      maxLength={10}
                      className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-4 text-sm font-black font-mono text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
                    />
                  </div>
                </div>
              </form>
            </section>

            {/* Step 3: Action */}
            {rifa && (
              <section className={`rounded-[3rem] p-10 transition-all duration-700 border-2 ${
                seleccionados.length > 0
                  ? "border-green-100 bg-white shadow-2xl shadow-green-100/20 translate-y-[-10px]"
                  : "border-slate-50 bg-slate-50/20 opacity-40 shadow-none border-dashed"
              }`}>
                <div className="flex items-center gap-4 mb-8">
                  <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[10px] tracking-tighter transition-all duration-500 ${seleccionados.length > 0 ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-slate-200 text-slate-400'}`}>03</span>
                  <h2 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">Confirmación Final</h2>
                </div>

                {seleccionados.length === 0 ? (
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <Info size={16} className="text-slate-300" />
                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-wider leading-relaxed">Selecciona tus números en la cuadrícula para habilitar</p>
                  </div>
                ) : (
                  <div className="space-y-8 animate-in zoom-in-95 duration-500">
                    <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto pr-3 custom-scrollbar">
                      {seleccionados.map((n) => (
                        <div key={n} className="bg-slate-50 border border-slate-100 text-slate-900 rounded-xl py-2 flex items-center justify-center font-mono font-black text-[10px] shadow-sm">
                          #{n}
                        </div>
                      ))}
                    </div>
                    
                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-200">
                      <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Gift size={80} />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                          <span>Boletos a Regalar</span>
                          <span className="text-white">{seleccionados.length}</span>
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Inversión</span>
                          <span className="font-black text-white text-2xl tracking-tighter">$0.00 <span className="text-[10px] text-white/30 tracking-widest font-bold">MXN</span></span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      form="regalo-form"
                      disabled={saving}
                      className="w-full py-6 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-black rounded-3xl transition-all shadow-2xl shadow-green-100 text-xs uppercase tracking-[0.4em] flex items-center justify-center gap-3 h-[72px]"
                    >
                      {saving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Procesando...</span>
                        </>
                      ) : (
                        `Entregar ${seleccionados.length} Regalos`
                      )}
                    </button>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>

        {/* Right: grid */}
        <div className="lg:col-span-8 h-full">
          {!rifa ? (
            <div className="h-full min-h-[600px] flex items-center justify-center bg-white rounded-[3rem] border border-slate-100 shadow-sm p-16 text-center group transition-all">
              <div className="max-w-xs space-y-8">
                <div className="relative mx-auto">
                  <div className="absolute inset-0 bg-slate-50 rounded-[2.5rem] rotate-6 group-hover:rotate-12 transition-transform duration-700" />
                  <div className="relative w-32 h-32 bg-white border border-slate-100 rounded-[2.5rem] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                    <Hash size={48} className="text-slate-100" strokeWidth={3} />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="font-black text-slate-900 uppercase tracking-[0.4em] text-[10px]">Tablero de Selección</p>
                  <p className="text-slate-400 font-bold text-sm leading-relaxed">Selecciona una campaña activa para visualizar la cuadrícula de boletos disponibles.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[4rem] border border-slate-100 shadow-sm p-10 lg:p-14 min-h-full">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <div>
                  <h2 className="font-black text-3xl text-slate-900 tracking-tight leading-none mb-3">{rifa.nombre}</h2>
                  <div className="flex items-center gap-3">
                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Panel de Entrega Directa</p>
                  </div>
                </div>
                {seleccionados.length > 0 && (
                  <button
                    onClick={() => setSeleccionados([])}
                    className="px-6 py-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-slate-100 flex items-center gap-2"
                  >
                    <Trash2 size={14} />
                    Limpiar Todo
                  </button>
                )}
              </div>
              
              <div className="mt-4">
                <NumberGrid
                  numInicio={rifa.num_inicio}
                  numFin={rifa.num_fin}
                  vendidos={vendidosArr}
                  apartados={apartadosArr}
                  seleccionados={seleccionados}
                  onToggle={toggleNumber}
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
