"use client";

import { useEffect, useState } from "react";
import { getRifas, updateRifa, deleteRifa, anunciarGanador, Rifa, Ganador } from "@/lib/firestore";
import RifaFormModal from "@/components/admin/RifaFormModal";
import RifaToggleGrid from "@/components/admin/RifaToggleGrid";

function GanadorModal({ rifa, onClose, onDone }: { rifa: Rifa; onClose: () => void; onDone: () => void }) {
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resultado, setResultado] = useState<Ganador | null>(null);

  async function handleConfirmar() {
    const n = parseInt(numero);
    if (isNaN(n) || n < rifa.num_inicio || n > rifa.num_fin) {
      setError(`Número inválido. Debe estar entre ${rifa.num_inicio} y ${rifa.num_fin}.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const g = await anunciarGanador(rifa.id!, n);
      setResultado(g);
      onDone();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al anunciar ganador.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 border border-slate-100 animate-in zoom-in-95 duration-200">
        {resultado ? (
          <div className="text-center">
            <div className="text-6xl mb-6">🏆</div>
            <h2 className="text-2xl font-black mb-2 text-slate-900">¡Ganador anunciado!</h2>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-8">Número registrado con éxito</p>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 mb-8 text-left">
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Detalles del Ganador</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-amber-100">
                  #{resultado.numero}
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg leading-tight">{resultado.nombre} {resultado.apellidos}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Folio: {resultado.folio}</p>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-200 uppercase text-xs tracking-widest">
              Cerrar Ventana
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-black mb-2 text-slate-900">Anunciar Ganador</h2>
            <p className="text-slate-500 font-medium text-sm mb-8">
              Ingresa el número ganador de <span className="font-black text-slate-900">{rifa.nombre}</span> según el sorteo oficial.
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Número Ganador</label>
                <input
                  type="number"
                  min={rifa.num_inicio}
                  max={rifa.num_fin}
                  value={numero}
                  onChange={(e) => { setNumero(e.target.value); setError(""); }}
                  placeholder={`${rifa.num_inicio} – ${rifa.num_fin}`}
                  className="w-full border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold bg-slate-50 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-400 transition-all"
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-2">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>
                   {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={onClose} disabled={loading} className="flex-1 py-4 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                  Cancelar
                </button>
                <button onClick={handleConfirmar} disabled={loading || !numero} className="flex-[1.5] py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black rounded-2xl transition-all shadow-lg shadow-amber-100 uppercase text-xs tracking-widest flex items-center justify-center gap-2">
                  {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
                  {loading ? "Registrando..." : "Confirmar"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function AdminRifasPage() {
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [editRifa, setEditRifa] = useState<Rifa | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [ganadorRifa, setGanadorRifa] = useState<Rifa | null>(null);

  async function load() { setRifas(await getRifas()); }
  useEffect(() => { load(); }, []);

  function openNew() { setEditRifa(null); setShowForm(true); }
  function openEdit(r: Rifa) { setEditRifa(r); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditRifa(null); }
  async function handleSaved() { closeForm(); await load(); }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar esta rifa?")) return;
    await deleteRifa(id);
    await load();
  }

  async function toggleActiva(r: Rifa) {
    await updateRifa(r.id!, { activa: !r.activa });
    await load();
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Campañas de Rifas</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Control central de sorteos y premios</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-6 py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl text-xs uppercase tracking-widest transition-all shadow-xl shadow-rose-200">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
          Nueva Rifa
        </button>
      </div>

      <div className="mb-10">
        <RifaToggleGrid rifas={rifas} onToggle={toggleActiva} />
      </div>

      {showForm && (
        <RifaFormModal editRifa={editRifa} onClose={closeForm} onSaved={handleSaved} />
      )}

      {ganadorRifa && (
        <GanadorModal
          rifa={ganadorRifa}
          onClose={() => setGanadorRifa(null)}
          onDone={() => { load(); }}
        />
      )}

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 w-24 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Portada</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Campaña y Sorteo</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Precio Unit.</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rango Folios</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Imágenes</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rifas.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    {(r.imagenes_url?.[0] || r.imagen_url) ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={r.imagenes_url?.[0] ?? r.imagen_url}
                        alt={r.nombre}
                        className="w-14 h-14 rounded-2xl object-cover bg-slate-50 border border-slate-100 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                        <svg className="w-6 h-6 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-black text-slate-900 text-base leading-tight mb-1">{r.nombre}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(r.fecha_sorteo).toLocaleDateString("es-MX", { dateStyle: 'long' })}</p>
                    {r.ganador && (
                      <div className="text-[10px] text-amber-600 font-black mt-2 inline-flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 uppercase tracking-wider">
                        🏆 #{r.ganador.numero} — {r.ganador.nombre}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-black text-slate-700 text-sm">${r.precio_boleto.toLocaleString("es-MX")}</p>
                  </td>
                  <td className="px-6 py-6">
                    <p className="font-bold text-slate-400 text-xs lowercase">{r.num_inicio} <span className="mx-1 text-slate-200">al</span> {r.num_fin}</p>
                  </td>
                  <td className="px-6 py-6">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 font-black text-[10px]">{r.imagenes_url?.length ?? 0}</span>
                  </td>
                  <td className="px-6 py-6">
                    <button onClick={() => toggleActiva(r)}
                      className={`text-[9px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full transition-all border ${r.activa ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                      {r.activa ? "Activa" : "Pausada"}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      {!r.ganador && (
                        <button onClick={() => setGanadorRifa(r)} className="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-all" title="Anunciar Ganador">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/></svg>
                        </button>
                      )}
                      <button onClick={() => openEdit(r)} className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all" title="Editar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                      </button>
                      <button onClick={() => handleDelete(r.id!)} className="w-10 h-10 flex items-center justify-center bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all" title="Eliminar">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rifas.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] mb-2">No se encontraron rifas</p>
            <p className="text-sm font-medium text-slate-300">Comienza creando tu primera campaña</p>
          </div>
        )}
      </div>
    </div>
  );
}
