"use client";

import { useEffect, useState } from "react";
import { getBoletosPaginados, Boleto } from "@/lib/firestore";
import { DocumentSnapshot } from "firebase/firestore";

interface Cliente {
  nombre: string;
  apellidos: string;
  celular: string;
  estado: string;
  boletos: Boleto[];
  totalGastado: number;
}

export default function AdminClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filterEstado, setFilterEstado] = useState("");
  const [filterCelular, setFilterCelular] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    async function loadAll() {
      const map = new Map<string, Cliente>();
      let cursor: DocumentSnapshot | null = null;
      let total = 0;
      while (true) {
        const { boletos, hasMore, lastDoc } = await getBoletosPaginados({ pageSize: 500, cursor });
        boletos.forEach((b) => {
          const key = b.celular;
          if (!map.has(key)) {
            map.set(key, { nombre: b.nombre, apellidos: b.apellidos, celular: b.celular, estado: b.estado, boletos: [], totalGastado: 0 });
          }
          const c = map.get(key)!;
          c.boletos.push(b);
          if (b.status === "pagado") c.totalGastado += b.precio_total;
        });
        total += boletos.length;
        setLoadedCount(total);
        if (!hasMore || !lastDoc) break;
        cursor = lastDoc;
      }
      setClientes(Array.from(map.values()));
      setLoading(false);
    }
    loadAll();
  }, []);

  const filtered = clientes.filter((c) => {
    if (filterEstado && c.estado !== filterEstado) return false;
    if (filterCelular && !c.celular.includes(filterCelular)) return false;
    return true;
  });

  const estados = Array.from(new Set(clientes.map((c) => c.estado))).sort();

  function exportCSV() {
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
    const headers = ["Nombre", "Apellidos", "Celular", "Estado MX", "Boletos", "Total pagado (MXN)"];
    const rows = filtered.map((c) => [
      c.nombre, c.apellidos, c.celular, c.estado,
      String(c.boletos.length), String(c.totalGastado),
    ].map(escape).join(","));
    const csv = "\uFEFF" + [headers.map(escape).join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-pro.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="max-w-7xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1">Directorio de Clientes</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
            {loading ? `Sincronizando ${loadedCount} registros...` : `${filtered.length} clientes registrados`}
          </p>
        </div>
        {!loading && (
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-200 border border-slate-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Exportar CSV
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-4 mb-10">
        <div className="relative group flex-1 max-w-sm">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-rose-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            value={filterCelular}
            onChange={(e) => setFilterCelular(e.target.value)}
            placeholder="Buscar por teléfono..."
            className="w-full rounded-2xl border border-slate-100 bg-white pl-11 pr-5 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 transition-all shadow-sm"
          />
        </div>
        <select
          value={filterEstado}
          onChange={(e) => setFilterEstado(e.target.value)}
          className="rounded-2xl border border-slate-100 bg-white px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-500 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%23cbd5e1%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] pr-12 shadow-sm"
        >
          <option value="">Todos los Estados</option>
          {estados.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Cliente</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contacto Celular</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ubicación</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Cant. Boletos</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inversión Acumulada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-8 py-6">
                      <div className="h-4 bg-slate-50 rounded-xl animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
              {!loading && filtered.map((c) => (
                <tr key={c.celular} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-black text-slate-900 text-base leading-tight">
                      {c.nombre} {c.apellidos}
                    </p>
                  </td>
                  <td className="px-6 py-6 font-mono text-slate-400 font-bold text-xs">{c.celular}</td>
                  <td className="px-6 py-6 font-bold text-slate-400 text-xs">
                    <span className="inline-flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                      {c.estado}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className="w-8 h-8 inline-flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-400 rounded-xl font-black text-[10px]">
                      {c.boletos.length}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-slate-900 text-right text-base">
                    ${c.totalGastado.toLocaleString("es-MX")}
                    <span className="block text-[8px] text-slate-300 font-black uppercase tracking-widest mt-1">MXN Neto</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 bg-slate-50/20">
            <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.5em] mb-2">Sin coincidencias</p>
            <p className="text-sm font-medium text-slate-300">Intenta con otros criterios de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  );
}
