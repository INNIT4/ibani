"use client";

import { useEffect, useRef, useState } from "react";
import {
  getBoletosPaginados, markBoletoPagadoConNumeros, getRifas,
  cancelApartado, cancelPagado, cancelarBoletosExpirados,
  revertPagadoToApartado, getAppSettings, Boleto, Rifa,
} from "@/lib/firestore";
import { DocumentSnapshot } from "firebase/firestore";
import { 
  Search, 
  Download, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  RotateCcw, 
  X, 
  Filter,
  Ticket,
  Clock,
  User,
  Hash,
  Activity
} from "lucide-react";

const PAGE_SIZE = 25;

export default function AdminBoletosPage() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [rifas, setRifas] = useState<Map<string, Rifa>>(new Map());
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendiente" | "pagado" | "cancelado">("todos");
  const [filterRifa, setFilterRifa] = useState("");
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [marking, setMarking] = useState<string | null>(null);
  const [canceladosMsg, setCanceladosMsg] = useState<string | null>(null);
  const [limitHoras, setLimitHoras] = useState(24);
  const [cancelacionActiva, setCancelacionActiva] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const cursorStack = useRef<(DocumentSnapshot | null)[]>([null]);
  const [pageIdx, setPageIdx] = useState(0);

  const isSearching = search.trim().length > 0;
  const filtersRef = useRef({ filterStatus, filterRifa, isSearching, pageIdx });
  
  useEffect(() => { 
    filtersRef.current = { filterStatus, filterRifa, isSearching, pageIdx }; 
  });

  async function loadPage(idx: number, stack: (DocumentSnapshot | null)[]) {
    setLoading(true);
    const { filterStatus: status, filterRifa: rifaId, isSearching: searching } = filtersRef.current;
    try {
      const { boletos: bs, hasMore: more, lastDoc } = await getBoletosPaginados({
        status: status !== "todos" ? status : undefined,
        rifaId: rifaId || undefined,
        pageSize: PAGE_SIZE,
        cursor: stack[idx] ?? null,
        loadAll: searching,
      });
      setBoletos(bs);
      setHasMore(!searching && more);
      if (!searching && lastDoc && stack.length <= idx + 1) {
        stack.push(lastDoc);
      }
    } catch (e) {
      console.error("Error cargando boletos:", e);
    } finally {
      setLoading(false);
    }
  }

  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    getRifas().then((rs) => setRifas(new Map(rs.map((r) => [r.id!, r]))));

    getAppSettings().then(async (s) => {
      setLimitHoras(s.cancelacion_horas);
      setCancelacionActiva(s.cancelacion_activa);
      if (s.cancelacion_activa) {
        const cancelados = await cancelarBoletosExpirados(s.cancelacion_horas);
        if (cancelados > 0) {
          setCanceladosMsg(`${cancelados} boleto${cancelados > 1 ? "s" : ""} cancelado${cancelados > 1 ? "s" : ""} automáticamente.`);
        }
      }
    }).finally(() => loadPage(0, cursorStack.current));
  }, []);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    cursorStack.current = [null];
    setPageIdx(0);
    loadPage(0, cursorStack.current);
  }, [filterStatus, filterRifa, search]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

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

  async function reloadCurrentPage() {
    await loadPage(pageIdx, cursorStack.current);
  }

  async function handleMarkPagado(boleto: Boleto) {
    if (!confirm(`¿Marcar boleto ${boleto.folio} como pagado?`)) return;
    setMarking(boleto.id!);
    await markBoletoPagadoConNumeros({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
    setMarking(null);
    await reloadCurrentPage();
  }

  async function handleCancel(boleto: Boleto) {
    if (!confirm(`¿Cancelar boleto ${boleto.folio}?`)) return;
    setMarking(boleto.id!);
    if (boleto.status === "pendiente") {
      await cancelApartado({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
    } else {
      await cancelPagado({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
    }
    setMarking(null);
    await reloadCurrentPage();
  }

  async function handleRevertir(boleto: Boleto) {
    if (!confirm(`¿Revertir boleto ${boleto.folio} a "pendiente"? Los números volverán a estado apartado.`)) return;
    setMarking(boleto.id!);
    await revertPagadoToApartado({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
    setMarking(null);
    await reloadCurrentPage();
  }

  const q = search.trim().toUpperCase();
  const STATUS_PRIORITY: Record<string, number> = { pendiente: 0, pagado: 1, cancelado: 2 };

  const displayed = (q
    ? boletos.filter((b) => {
        const nombre = `${b.nombre} ${b.apellidos}`.toUpperCase();
        return b.folio.includes(q) || nombre.includes(q) || b.celular.includes(q);
      })
    : boletos
  ).slice().sort((a, b) => {
    const pa = STATUS_PRIORITY[a.status] ?? 3;
    const pb = STATUS_PRIORITY[b.status] ?? 3;
    if (pa !== pb) return pa - pb;
    return (b.created_at?.toMillis?.() ?? 0) - (a.created_at?.toMillis?.() ?? 0);
  });

  const rifaOptions = Array.from(rifas.values());

  async function exportCSV() {
    const { boletos: all } = await getBoletosPaginados({
      status: filterStatus !== "todos" ? filterStatus : undefined,
      rifaId: filterRifa || undefined,
      pageSize: 9999,
      loadAll: true,
    });
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const headers = ["Folio", "Rifa", "Nombre", "Apellidos", "Celular", "Estado MX", "Números", "Total (MXN)", "Status", "Fecha"];
    const rows = all.map((b) => [
      b.folio,
      rifas.get(b.rifa_id)?.nombre ?? b.rifa_id,
      b.nombre,
      b.apellidos,
      b.celular,
      b.estado,
      b.numeros.join(" | "),
      String(b.precio_total),
      b.status,
      b.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ?? "",
    ].map(escape).join(","));
    const csv = "\uFEFF" + [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boletos-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black text-slate-900 leading-none mb-2">Relación de Boletos</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Control integral de participaciones y estados</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2.5 px-6 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-100 font-black rounded-[1.5rem] text-[10px] uppercase tracking-[0.2em] transition-all shadow-sm"
          >
            <Download size={16} strokeWidth={3} />
            Exportar Listado
          </button>
        </div>
      </div>

      {canceladosMsg && (
        <div className="flex items-center gap-4 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-6 mb-8 shadow-xl shadow-indigo-100/10 animate-in slide-in-from-top duration-500">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
            <AlertCircle size={20} strokeWidth={3} />
          </div>
          <p className="text-sm font-bold text-indigo-900 flex-1">{canceladosMsg}</p>
          <button onClick={() => setCanceladosMsg(null)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-indigo-300 hover:text-indigo-600 transition-all">
            <X size={18} strokeWidth={3} />
          </button>
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 mb-10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative group flex-1">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors">
              <Search size={20} strokeWidth={3} />
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtro rápido de participaciones..."
              className="w-full h-16 rounded-[1.5rem] border border-slate-50 bg-slate-50 pl-16 pr-6 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group min-w-[200px]">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                <Activity size={18} strokeWidth={3} />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="w-full h-16 rounded-[1.5rem] border border-slate-50 bg-slate-50 pl-14 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="todos">Estados: Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="pagado">Pagados</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>
            
            <div className="relative group min-w-[200px]">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                <Filter size={18} strokeWidth={3} />
              </div>
              <select
                value={filterRifa}
                onChange={(e) => setFilterRifa(e.target.value)}
                className="w-full h-16 rounded-[1.5rem] border border-slate-50 bg-slate-50 pl-14 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="">Rifas: Todas</option>
                {rifaOptions.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Folio</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Participante</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Inversión</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Estado</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Temporalidad</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 6 }).map((_, j) => (
                        <td key={j} className="px-8 py-8">
                          <div className="h-3 bg-slate-100 rounded-full w-24" />
                        </td>
                      ))}
                    </tr>
                  ))
                : displayed.map((b) => (
                  <tr key={b.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-1.5">
                        <span className="font-mono font-black text-slate-900 tracking-wider text-base">{b.folio}</span>
                        <div className="flex items-center gap-2">
                          <Ticket size={12} className="text-slate-300" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
                            {rifas.get(b.rifa_id)?.nombre ?? "Campaña"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-slate-300" />
                          <span className="font-black text-slate-900 tracking-tight">{b.nombre} {b.apellidos}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-slate-400 font-mono">{b.celular}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <div className="flex gap-1">
                            {b.numeros.slice(0, 3).map(n => (
                              <span key={n} className="text-[9px] font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                {n}
                              </span>
                            ))}
                            {b.numeros.length > 3 && <span className="text-[9px] font-black text-indigo-500">+{b.numeros.length - 3}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                      <span className="font-black text-slate-900 text-base leading-none tracking-tighter">
                        ${b.precio_total.toLocaleString("es-MX")} <span className="text-[10px] text-slate-300 font-bold tracking-widest ml-0.5">MXN</span>
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                        b.status === "pagado"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : b.status === "cancelado"
                          ? "bg-slate-50 text-slate-400 border-slate-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          b.status === "pagado" ? "bg-green-500" : b.status === "cancelado" ? "bg-slate-300" : "bg-amber-500"
                        }`} />
                        {b.status}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      {b.status === "pendiente" && b.created_at
                        ? (() => {
                            const creado = b.created_at.toDate().getTime();
                            const transcurridoMs = now - creado;
                            const restanteMs = limitHoras * 3_600_000 - transcurridoMs;
                            const hRestantes = restanteMs / 3_600_000;
                            const expirado = cancelacionActiva && restanteMs <= 0;
                            const urgente = cancelacionActiva && !expirado && hRestantes < 2;
                            
                            return (
                              <div className="flex flex-col gap-1">
                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${
                                  expirado ? "text-rose-600" : urgente ? "text-amber-600" : "text-slate-400"
                                }`}>
                                  <Clock size={12} strokeWidth={3} />
                                  <span>{expirado ? "Expirado" : `T - ${hRestantes.toFixed(1)}h`}</span>
                                </div>
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full transition-all duration-1000 ${
                                      expirado ? "bg-rose-500" : urgente ? "bg-amber-500" : "bg-indigo-500"
                                    }`}
                                    style={{ width: `${Math.max(0, Math.min(100, (transcurridoMs / (limitHoras * 3_600_000)) * 100))}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })()
                        : (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-black text-slate-900">
                              {b.created_at?.toDate?.()?.toLocaleDateString("es-MX", { day: '2-digit', month: 'short' })}
                            </span>
                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                              {b.created_at?.toDate?.()?.toLocaleTimeString("es-MX", { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )
                      }
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-center gap-2">
                        {b.status === "pendiente" && (
                          <button 
                            onClick={() => handleMarkPagado(b)} 
                            disabled={marking === b.id}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-green-500 hover:bg-green-600 hover:text-white hover:border-green-600 transition-all shadow-sm"
                            title="Aprobar Pago"
                          >
                            <Check size={18} strokeWidth={3} />
                          </button>
                        )}
                        {b.status === "pagado" && (
                          <button 
                            onClick={() => handleRevertir(b)} 
                            disabled={marking === b.id}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-amber-500 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all shadow-sm"
                            title="Revertir a Pendiente"
                          >
                            <RotateCcw size={18} strokeWidth={3} />
                          </button>
                        )}
                        {(b.status === "pendiente" || b.status === "pagado") && (
                          <button 
                            onClick={() => handleCancel(b)} 
                            disabled={marking === b.id}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-slate-400 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-sm"
                            title="Anular Participación"
                          >
                            <X size={18} strokeWidth={3} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        
        {!loading && displayed.length === 0 && (
          <div className="py-32 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Hash size={32} className="text-slate-200" />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Sin registros que mostrar</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!isSearching && (pageIdx > 0 || hasMore) && (
        <div className="flex items-center justify-between mt-12 bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Página Actual</span>
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs">
              {pageIdx + 1}
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={goPrev} 
              disabled={pageIdx === 0 || loading}
              className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-100 hover:bg-slate-50 disabled:opacity-30 transition-all"
            >
              <ChevronLeft size={16} strokeWidth={3} />
              Anterior
            </button>
            <button 
              onClick={goNext} 
              disabled={!hasMore || loading}
              className="flex items-center gap-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl bg-slate-900 border border-slate-900 text-white hover:bg-slate-800 disabled:opacity-30 transition-all shadow-xl shadow-slate-200"
            >
              Siguiente
              <ChevronRight size={16} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
