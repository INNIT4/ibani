"use client";

import { useEffect, useRef, useState } from "react";
import {
  getComprobantesPaginados, updateComprobanteStatus, updateComprobanteComentario,
  getBoletoByFolio, markBoletoPagadoConNumeros, Comprobante,
} from "@/lib/firestore";
import { DocumentSnapshot } from "firebase/firestore";

const PAGE_SIZE = 20;

export default function AdminComprobantesPage() {
  const [comprobantes, setComprobantes] = useState<Comprobante[]>([]);
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendiente" | "revisado">("todos");
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Comprobante | null>(null);
  const [commenting, setCommenting] = useState<Comprobante | null>(null);

  const cursorStack = useRef<(DocumentSnapshot | null)[]>([null]);
  const [pageIdx, setPageIdx] = useState(0);

  const filtersRef = useRef({ filterStatus, pageIdx });
  useEffect(() => { filtersRef.current = { filterStatus, pageIdx }; });

  async function loadPage(idx: number, stack: (DocumentSnapshot | null)[]) {
    setLoading(true);
    const { filterStatus: status } = filtersRef.current;
    try {
      const { comprobantes: cs, hasMore: more, lastDoc } = await getComprobantesPaginados({
        status: status !== "todos" ? status : undefined,
        pageSize: PAGE_SIZE,
        cursor: stack[idx] ?? null,
      });
      setComprobantes(cs);
      setHasMore(more);
      if (more && lastDoc && stack.length <= idx + 1) {
        stack.push(lastDoc);
      }
    } catch (e) {
      console.error("Error cargando comprobantes:", e);
    } finally {
      setLoading(false);
    }
  }

  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadPage(0, cursorStack.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    cursorStack.current = [null];
    setPageIdx(0);
    loadPage(0, cursorStack.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus]);

  function goNext() {
    const next = pageIdx + 1;
    setPageIdx(next);
    loadPage(next, cursorStack.current);
  }

  function goPrev() {
    const prev = pageIdx - 1;
    setPageIdx(prev);
    loadPage(prev, cursorStack.current);
  }

  async function handleMarcarPagado(c: Comprobante) {
    if (!confirm(`¿Marcar boletos ${c.folios.join(", ")} como PAGADOS?`)) return;
    setMarking(c.id!);
    try {
      for (const folio of c.folios) {
        const boleto = await getBoletoByFolio(folio);
        if (boleto && boleto.status === "pendiente") {
          await markBoletoPagadoConNumeros({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
        }
      }
      await updateComprobanteStatus(c.id!, "revisado");
      await loadPage(pageIdx, cursorStack.current);
    } catch (e) {
      console.error(e);
      alert("Error al marcar como pagado.");
    }
    setMarking(null);
  }

  async function handleMarcarRevisado(c: Comprobante) {
    setMarking(c.id!);
    await updateComprobanteStatus(c.id!, "revisado");
    setMarking(null);
    await loadPage(pageIdx, cursorStack.current);
  }

  return (
    <div className="max-w-7xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-slate-900 mb-1">Mesa de Validación</h1>
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revisión de comprobantes de pago</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-6 mb-10">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
          className="rounded-2xl border border-slate-100 bg-white px-6 py-3.5 text-xs font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-4 focus:ring-rose-500/5 focus:border-rose-300 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23cbd5e1%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] pr-12 shadow-sm"
        >
          <option value="todos">Todos los comprobantes</option>
          <option value="pendiente">Sólo Pendientes</option>
          <option value="revisado">Ya Revisados</option>
        </select>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          {loading ? "Actualizando..." : `${comprobantes.length} comprobantes encontrados`}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Titular / Cliente</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Folios Asociados</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Monto Reportado</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha Envío</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && pageIdx === 0 && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-8 py-6">
                      <div className="h-4 bg-slate-50 rounded-xl animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && comprobantes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 leading-none mb-1 text-base">{c.nombre}</p>
                    {c.admin_comentario && (
                      <span className="text-[9px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full border border-amber-100/50 inline-flex items-center gap-1.5 mt-2">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
                        Nota enviada
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-wrap gap-1.5">
                      {c.folios.map(f => (
                        <span key={f} className="font-mono font-black text-brand-red text-[10px] bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">{f}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-slate-900">${c.monto_total.toLocaleString("es-MX")}</td>
                  <td className="px-6 py-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {c.created_at?.toDate?.()?.toLocaleDateString("es-MX", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) ?? "—"}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border ${
                      c.status === "revisado"
                        ? "bg-green-50 text-green-600 border-green-100"
                        : "bg-amber-50 text-amber-600 border-amber-100"
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setViewing(c)}
                        className="w-10 h-10 flex items-center justify-center bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100" title="Ver archivo"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                      </button>
                      <button
                        onClick={() => setCommenting(c)}
                        className="w-10 h-10 flex items-center justify-center bg-amber-50 text-amber-500 rounded-xl hover:bg-amber-100 transition-all border border-amber-100/50" title="Añadir Nota"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/></svg>
                      </button>
                      {c.status === "pendiente" && (
                        <button
                          onClick={() => handleMarcarPagado(c)}
                          disabled={marking === c.id}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-100 border border-green-500"
                        >
                          {marking === c.id ? "..." : "Aprobar"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && comprobantes.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] mb-2">Sin comprobantes pendientes</p>
            <p className="text-sm font-medium text-slate-300">Todo está al día por aquí</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {(pageIdx > 0 || hasMore) && (
        <div className="flex items-center justify-between mt-10">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Página {pageIdx + 1}</p>
          <div className="flex gap-3">
            <button onClick={goPrev} disabled={pageIdx === 0 || loading}
              className="px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 disabled:opacity-30 hover:bg-white hover:border-slate-900 transition-all">
              Anterior
            </button>
            <button onClick={goNext} disabled={!hasMore || loading}
              className="px-8 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 disabled:opacity-30 hover:bg-white hover:border-slate-900 transition-all">
              Siguiente
            </button>
          </div>
        </div>
      )}

      {viewing && (
        <ComprobanteViewModal comprobante={viewing} onClose={() => setViewing(null)} />
      )}
      {commenting && (
        <ComentarioModal
          comprobante={commenting}
          onClose={() => setCommenting(null)}
          onSaved={async () => {
            setCommenting(null);
            await loadPage(pageIdx, cursorStack.current);
          }}
        />
      )}
    </div>
  );
}

// ─── Ver comprobante ──────────────────────────────────────────────────────────

function ComprobanteViewModal({ comprobante, onClose }: { comprobante: Comprobante; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[3rem] w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50 flex-shrink-0">
          <div>
            <p className="font-black text-slate-900 text-xl leading-none mb-1.5">{comprobante.nombre}</p>
            <div className="flex gap-2">
              {comprobante.folios.map(f => (
                <span key={f} className="text-[10px] text-brand-red font-black uppercase tracking-widest bg-rose-50 px-2.5 py-1 rounded-lg">Folio {f}</span>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-[1.25rem] bg-slate-50 hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto p-10 bg-slate-50/30">
          {comprobante.archivo_tipo === "pdf" ? (
            <iframe
              src={comprobante.archivo_url}
              className="w-full h-[68vh] rounded-[2rem] border border-slate-200 bg-white shadow-inner"
              title="Comprobante PDF"
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={comprobante.archivo_url} alt="Comprobante" className="max-w-full mx-auto rounded-[2rem] shadow-2xl shadow-slate-200 border-8 border-white" />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal comentario admin ───────────────────────────────────────────────────

function ComentarioModal({
  comprobante,
  onClose,
  onSaved,
}: {
  comprobante: Comprobante;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [texto, setTexto] = useState(comprobante.admin_comentario ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave() {
    if (!texto.trim()) return;
    setSaving(true);
    await updateComprobanteComentario(comprobante.id!, texto.trim());
    await onSaved();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-400">
        <div className="flex items-center justify-between px-10 py-8 border-b border-slate-50">
          <div>
            <p className="font-black text-slate-900 text-lg leading-none mb-1.5">Nota para Cliente</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Folios: {comprobante.folios.join(", ")}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-rose-50 text-slate-300 hover:text-rose-600 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-10 space-y-8">
          <div className="bg-amber-50 border border-amber-100/50 rounded-2xl p-5">
            <p className="text-xs font-bold text-amber-700 leading-relaxed italic text-center">
              &ldquo;Este mensaje será visible para el comprador en la pantalla de consulta de boleto.&rdquo;
            </p>
          </div>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ej: El archivo no es legible, por favor sube una captura completa de la transferencia..."
            rows={5}
            className="w-full rounded-[1.5rem] border border-slate-200 bg-slate-50 px-6 py-5 text-sm font-bold text-slate-800 placeholder:text-slate-300 resize-none focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 transition-all"
          />
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all"
            >
              Cerrar
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !texto.trim()}
              className="flex-[1.5] py-4 text-[10px] font-black uppercase tracking-widest bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-2xl transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
            >
              {saving && <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {saving ? "Guardando" : "Guardar Nota"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
