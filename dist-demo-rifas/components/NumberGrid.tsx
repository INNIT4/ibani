"use client";

import { useMemo, useState, useEffect } from "react";

type NumberStatus = "disponible" | "vendido" | "apartado" | "seleccionado";

interface NumberGridProps {
  numInicio: number;
  numFin: number;
  vendidos: number[];
  apartados: number[];
  seleccionados: number[];
  visibles?: number[] | null; // null = show all
  mostrarApartados?: boolean; // default true
  onToggle: (n: number) => void;
}



const STATUS_CLASSES: Record<NumberStatus, string> = {
  disponible:  "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 cursor-pointer hover:shadow-md hover:z-10",
  vendido:     "bg-slate-50 text-slate-300 border-transparent opacity-30 cursor-not-allowed",
  apartado:    "bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 cursor-pointer hover:shadow-md hover:z-10",
  seleccionado:"bg-brand-red border-brand-red text-white cursor-pointer shadow-lg shadow-rose-200 z-20 scale-110",
};

export default function NumberGrid({
  numInicio,
  numFin,
  vendidos,
  apartados,
  seleccionados,
  visibles,
  mostrarApartados = true,
  onToggle,
}: NumberGridProps) {
  const [page, setPage] = useState(1);

  const vendidosSet = useMemo(() => new Set(vendidos), [vendidos]);
  const apartadosSet = useMemo(() => new Set(apartados), [apartados]);
  const seleccionadosSet = useMemo(() => new Set(seleccionados), [seleccionados]);

  const numbers = useMemo(() => {
    const all = [];
    for (let i = numInicio; i <= numFin; i++) {
      if (!vendidosSet.has(i)) all.push(i);
    }
    return all;
  }, [numInicio, numFin, vendidosSet]);

  // When searching (visibles != null) show all results; otherwise paginate
  const toShow = visibles ?? numbers;

  // Calculate dynamic page size based on total tickets to avoid too many pages
  const dynamicPageSize = useMemo(() => {
    if (visibles) return toShow.length;
    const total = numFin - numInicio + 1;
    if (total <= 2000) return 1000;
    if (total <= 10000) return 2000;
    if (total <= 30000) return 3000;
    return 5000; // Cap at 5000 for very large raffles
  }, [numInicio, numFin, visibles, toShow.length]);

  const usePagination = visibles === null && toShow.length > dynamicPageSize;
  const totalPages = usePagination ? Math.ceil(toShow.length / dynamicPageSize) : 1;
  const pageNumbers = usePagination ? toShow.slice((page - 1) * dynamicPageSize, page * dynamicPageSize) : toShow;

  // Reset page when visibles changes
  useEffect(() => { setPage(1); }, [visibles]);

  function getStatus(n: number): NumberStatus {
    if (seleccionadosSet.has(n)) return "seleccionado";
    if (vendidosSet.has(n)) return "vendido";
    if (mostrarApartados && apartadosSet.has(n)) return "apartado";
    return "disponible";
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-lg border border-slate-200 bg-white" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-lg bg-brand-red shadow-sm" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2 opacity-50">
          <span className="w-5 h-5 rounded-lg bg-slate-200 border border-transparent" />
          <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">Vendido</span>
        </div>
      </div>

      {/* Grid wrapper */}
      <div className="relative">
        {/* Grid */}
        <div className="number-grid gap-2 sm:gap-3">
          {pageNumbers.map((n) => {
            const status = getStatus(n);
            return (
              <button
                key={n}
                onClick={() => {
                  if (status !== "vendido") onToggle(n);
                }}
                className={`w-full aspect-square rounded-xl text-xs font-extrabold flex items-center justify-center transition-all border ${STATUS_CLASSES[status]}`}
                title={`Número ${n} — ${status}`}
              >
                {n}
              </button>
            );
          })}
        </div>

        {/* Empty state when searching */}
        {toShow.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-400 font-medium">No se encontraron números disponibles.</p>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {usePagination && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-6 border-t border-slate-100 pt-8">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
            Mostrando <span className="text-slate-800">{(page - 1) * dynamicPageSize + 1}–{Math.min(page * dynamicPageSize, toShow.length)}</span> de <span className="text-slate-800">{toShow.length}</span> números
          </p>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                const el = document.querySelector('.number-grid');
                if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 120, behavior: 'smooth' });
              }}
              disabled={page === 1}
              className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border-2 border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-200 transition-all"
            >
              Anterior
            </button>
            
            <div className="relative">
              <select 
                value={page} 
                onChange={(e) => {
                  setPage(Number(e.target.value));
                  const el = document.querySelector('.number-grid');
                  if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 120, behavior: 'smooth' });
                }}
                className="appearance-none bg-white border-2 border-slate-100 text-slate-800 text-[10px] font-black uppercase tracking-widest py-3 pl-6 pr-12 rounded-2xl focus:outline-none focus:border-brand-red/30 cursor-pointer shadow-sm"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Rango {i * dynamicPageSize} - {(i + 1) * dynamicPageSize - 1}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>

            <button
              onClick={() => {
                setPage((p) => Math.min(totalPages, p + 1));
                const el = document.querySelector('.number-grid');
                if (el) window.scrollTo({ top: (el as HTMLElement).offsetTop - 120, behavior: 'smooth' });
              }}
              disabled={page === totalPages}
              className="px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border-2 border-slate-100 text-slate-400 disabled:opacity-30 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-200 transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
