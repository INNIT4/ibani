"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Boleto, Rifa, getBoletos, getRifas } from "@/lib/firestore";

type ReportType =
  | "resumen"
  | "compradores"
  | "mapa"
  | "ingresos"
  | "clientes"
  | "codigos"
  | "ganador"
  | "privado"
  | "publico";

type SortField = "nombre" | "fecha" | "total" | "numeros";
type SortDir = "asc" | "desc";

const REPORTS: { id: ReportType; label: string; icon: string; needsRifa?: boolean }[] = [
  { id: "resumen",     label: "Resumen ejecutivo",   icon: "📊" },
  { id: "compradores", label: "Compradores",          icon: "👥" },
  { id: "mapa",        label: "Mapa de números",      icon: "🗺️", needsRifa: true },
  { id: "ingresos",    label: "Ingresos",             icon: "💰" },
  { id: "clientes",    label: "Clientes únicos",      icon: "👤" },
  { id: "codigos",     label: "Códigos usados",       icon: "🏷️" },
  { id: "ganador",     label: "Ganador",              icon: "🏆", needsRifa: true },
  { id: "privado",     label: "Reporte privado",      icon: "🔒" },
  { id: "publico",     label: "Reporte público",      icon: "👁️" },
];

function downloadCSV(filename: string, rows: string[][], headers: string[]) {
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(","), ...rows.map((r) => r.map(escape).join(","))];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function StatusBadge({ status }: { status: string }) {
  const cfg =
    status === "pagado"    ? { cls: "bg-green-50 text-green-700",    label: "Pagado" } :
    status === "cancelado" ? { cls: "bg-slate-50 text-slate-500",    label: "Cancelado" } :
                             { cls: "bg-amber-50 text-amber-700", label: "Pendiente" };
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full whitespace-nowrap border ${cfg.cls} ${status === 'pagado' ? 'border-green-100' : status === 'cancelado' ? 'border-slate-100' : 'border-amber-100'}`}>
      {cfg.label}
    </span>
  );
}

function SortHeader({
  label, field, sortField, sortDir, onSort,
}: {
  label: string; field: SortField; sortField: SortField; sortDir: SortDir; onSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <th
      className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400 cursor-pointer hover:text-slate-900 select-none group"
      onClick={() => onSort(field)}
    >
      <span className="flex items-center gap-1">
        {label}
        <span className={`transition-all ${active ? 'opacity-100 text-brand-red' : 'opacity-20 group-hover:opacity-100'}`}>
          {active ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </span>
    </th>
  );
}

export default function ReportesPage() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [rifas, setRifas] = useState<Rifa[]>([]);
  const [rifaMap, setRifaMap] = useState<Map<string, Rifa>>(new Map());
  const [selectedRifaId, setSelectedRifaId] = useState("");
  const [activeReport, setActiveReport] = useState<ReportType>("resumen");
  const [filterStatus, setFilterStatus] = useState<"todos" | "pendiente" | "pagado" | "cancelado">("todos");
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("fecha");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [hoveredNum, setHoveredNum] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const loadedRef = useRef({ boletos: false, rifas: false });

  useEffect(() => {
    Promise.all([getRifas(), getBoletos()]).then(([rs, bs]) => {
      setRifas(rs);
      setRifaMap(new Map(rs.map((r) => [r.id!, r])));
      setBoletos(bs);
      setLoading(false);
    });
  }, []);

  // Boletos for the selected rifa (or all)
  const rifaBoletos = useMemo(
    () => boletos.filter((b) => !selectedRifaId || b.rifa_id === selectedRifaId),
    [boletos, selectedRifaId],
  );

  // Boletos further filtered by status (for table reports)
  const filtered = useMemo(
    () => rifaBoletos.filter((b) => filterStatus === "todos" || b.status === filterStatus),
    [rifaBoletos, filterStatus],
  );

  const selectedRifa = selectedRifaId ? rifaMap.get(selectedRifaId) : undefined;

  // ── Derived data ────────────────────────────────────────────────────────────

  // Number map: prioritises pagado > pendiente > cancelado
  const numberMapData = useMemo(() => {
    if (!selectedRifa) return null;
    const priority: Record<string, number> = { pagado: 3, pendiente: 2, cancelado: 1 };
    const map = new Map<number, { status: string; boleto: Boleto }>();
    rifaBoletos.forEach((b) => {
      b.numeros.forEach((n) => {
        const existing = map.get(n);
        if (!existing || (priority[b.status] ?? 0) > (priority[existing.status] ?? 0)) {
          map.set(n, { status: b.status, boleto: b });
        }
      });
    });
    return map;
  }, [selectedRifa, rifaBoletos]);

  // Income by day
  const ingresosByDay = useMemo(() => {
    const map = new Map<string, { confirmados: number; potenciales: number }>();
    rifaBoletos.forEach((b) => {
      const date = b.created_at?.toDate?.()?.toLocaleDateString("es-MX") ?? "Sin fecha";
      const cur = map.get(date) ?? { confirmados: 0, potenciales: 0 };
      if (b.status === "pagado") { cur.confirmados += b.precio_total; cur.potenciales += b.precio_total; }
      else if (b.status === "pendiente") { cur.potenciales += b.precio_total; }
      map.set(date, cur);
    });
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [rifaBoletos]);

  // Unique clients grouped by celular
  const clientesData = useMemo(() => {
    const map = new Map<string, {
      nombre: string; apellidos: string; celular: string; estado: string;
      numeros: number[]; pagado: number; pendiente: number; boletos: number;
    }>();
    rifaBoletos.forEach((b) => {
      const key = b.celular;
      const cur = map.get(key) ?? {
        nombre: b.nombre, apellidos: b.apellidos, celular: b.celular, estado: b.estado,
        numeros: [], pagado: 0, pendiente: 0, boletos: 0,
      };
      cur.numeros.push(...b.numeros);
      cur.boletos++;
      if (b.status === "pagado") cur.pagado += b.precio_total;
      else if (b.status === "pendiente") cur.pendiente += b.precio_total;
      map.set(key, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.numeros.length - a.numeros.length);
  }, [rifaBoletos]);

  // Discount codes used
  const codigosData = useMemo(() => {
    const map = new Map<string, { codigo: string; usos: number; totalDescuento: number; totalBruto: number }>();
    rifaBoletos.forEach((b) => {
      if (!b.codigo_descuento) return;
      const cur = map.get(b.codigo_descuento) ?? { codigo: b.codigo_descuento, usos: 0, totalDescuento: 0, totalBruto: 0 };
      cur.usos++;
      const pct = b.descuento_aplicado ?? 0;
      const bruto = pct > 0 ? b.precio_total / (1 - pct / 100) : b.precio_total;
      cur.totalDescuento += bruto - b.precio_total;
      cur.totalBruto += bruto;
      map.set(b.codigo_descuento, cur);
    });
    return Array.from(map.values()).sort((a, b) => b.usos - a.usos);
  }, [rifaBoletos]);

  // Compradores with search + sort
  const compradoresData = useMemo(() => {
    let data = filtered.slice();
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((b) =>
        `${b.nombre} ${b.apellidos}`.toLowerCase().includes(q) ||
        b.celular.includes(q) ||
        b.folio.toLowerCase().includes(q),
      );
    }
    data.sort((a, b) => {
      let cmp = 0;
      if (sortField === "nombre") cmp = `${a.nombre} ${a.apellidos}`.localeCompare(`${b.nombre} ${b.apellidos}`);
      else if (sortField === "fecha") cmp = (a.created_at?.seconds ?? 0) - (b.created_at?.seconds ?? 0);
      else if (sortField === "total") cmp = a.precio_total - b.precio_total;
      else if (sortField === "numeros") cmp = a.numeros.length - b.numeros.length;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return data;
  }, [filtered, search, sortField, sortDir]);

  // Executive summary per rifa
  const summaryStats = useMemo(() => {
    const rifasList = selectedRifaId ? rifas.filter((r) => r.id === selectedRifaId) : rifas;
    return rifasList.map((r) => {
      const rb = boletos.filter((b) => b.rifa_id === r.id);
      const total = r.num_fin - r.num_inicio + 1;
      const pagados = r.num_vendidos ?? 0;
      const apartados = r.num_apartados ?? 0;
      const disponibles = total - pagados - apartados;
      const ingresos = rb.filter((b) => b.status === "pagado").reduce((s, b) => s + b.precio_total, 0);
      const potencial = rb.filter((b) => b.status !== "cancelado").reduce((s, b) => s + b.precio_total, 0);
      const boletosPagados = rb.filter((b) => b.status === "pagado").length;
      const diasSorteo = r.fecha_sorteo
        ? Math.ceil((new Date(r.fecha_sorteo).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;
      return { rifa: r, total, pagados, apartados, disponibles, ingresos, potencial, boletosPagados, diasSorteo };
    });
  }, [rifas, boletos, selectedRifaId]);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
  }

  // ── CSV Exports ─────────────────────────────────────────────────────────────

  const rifaLabel = selectedRifa?.nombre ?? "todas";

  function exportCompradores() {
    const headers = ["Folio", "Rifa", "Nombre completo", "Celular", "Números", "Cant.", "Total (MXN)", "Estado", "Fecha"];
    downloadCSV(`compradores-${rifaLabel}.csv`, compradoresData.map((b) => [
      b.folio, rifaMap.get(b.rifa_id)?.nombre ?? b.rifa_id, `${b.nombre} ${b.apellidos}`,
      b.celular, b.numeros.join(" | "), String(b.numeros.length), String(b.precio_total),
      b.status === "pagado" ? "Pagado" : b.status === "cancelado" ? "Cancelado" : "Pendiente",
      b.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ?? "",
    ]), headers);
  }

  function exportPrivado() {
    const headers = ["Folio", "Rifa", "Nombre", "Apellidos", "Celular", "Estado MX", "Números", "Cód. descuento", "Descuento %", "Total (MXN)", "Status", "Fecha"];
    downloadCSV(`privado-${rifaLabel}.csv`, filtered.map((b) => [
      b.folio, rifaMap.get(b.rifa_id)?.nombre ?? b.rifa_id, b.nombre, b.apellidos, b.celular, b.estado,
      b.numeros.join(" | "), b.codigo_descuento, String(b.descuento_aplicado), String(b.precio_total),
      b.status === "pagado" ? "Pagado" : b.status === "cancelado" ? "Cancelado" : "Pendiente",
      b.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ?? "",
    ]), headers);
  }

  function exportPublico() {
    const headers = ["Folio", "Rifa", "Números", "Estado"];
    downloadCSV(`publico-${rifaLabel}.csv`, filtered.map((b) => [
      b.folio, rifaMap.get(b.rifa_id)?.nombre ?? b.rifa_id, b.numeros.join(" | "),
      b.status === "pagado" ? "Pagado" : b.status === "cancelado" ? "Cancelado" : "Pendiente",
    ]), headers);
  }

  function exportClientes() {
    const headers = ["Nombre", "Apellidos", "Celular", "Estado MX", "Números", "Cant.", "Pagado (MXN)", "Pendiente (MXN)", "Boletos"];
    downloadCSV(`clientes-${rifaLabel}.csv`, clientesData.map((c) => [
      c.nombre, c.apellidos, c.celular, c.estado, c.numeros.join(" | "),
      String(c.numeros.length), String(c.pagado), String(c.pendiente), String(c.boletos),
    ]), headers);
  }

  function exportIngresos() {
    const headers = ["Fecha", "Confirmados (MXN)", "Potencial (MXN)"];
    downloadCSV(`ingresos-${rifaLabel}.csv`, ingresosByDay.map(([date, d]) => [date, String(d.confirmados), String(d.potenciales)]), headers);
  }

  function exportCodigos() {
    const headers = ["Código", "Usos", "Total descontado (MXN)", "Venta bruta sin descuento (MXN)"];
    downloadCSV(`codigos-${rifaLabel}.csv`, codigosData.map((c) => [
      c.codigo, String(c.usos), c.totalDescuento.toFixed(2), c.totalBruto.toFixed(2),
    ]), headers);
  }

  const exportFns: Partial<Record<ReportType, () => void>> = {
    compradores: exportCompradores,
    privado: exportPrivado,
    publico: exportPublico,
    clientes: exportClientes,
    ingresos: exportIngresos,
    codigos: exportCodigos,
  };

  const currentReportDef = REPORTS.find((r) => r.id === activeReport)!;
  const needsRifaSelect = currentReportDef.needsRifa && !selectedRifaId;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Reportes</h1>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">
            Sincronización y exportación de datos
          </p>
        </div>
        {exportFns[activeReport] && (
          <button
            onClick={exportFns[activeReport]}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-slate-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
            </svg>
            Exportar CSV
          </button>
        )}
      </div>

      {/* Rifa selector pills */}
      <div className="mb-8">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Filtrar por Campaña</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRifaId("")}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              !selectedRifaId
                ? "bg-rose-50 text-brand-red border border-rose-100"
                : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
            }`}
          >
            Todas
          </button>
          {rifas.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelectedRifaId(r.id!)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                selectedRifaId === r.id
                  ? "bg-rose-50 text-brand-red border border-rose-100"
                  : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
            >
              {r.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Selected rifa status header */}
      {selectedRifa && (
        <div className="flex items-center gap-4 mb-8 p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-in fade-in duration-500">
          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          </div>
          <div>
            <p className="font-black text-slate-900 uppercase tracking-widest text-xs leading-none mb-1">{selectedRifa.nombre}</p>
            <p className="text-xs font-bold text-slate-400">Sorteo: {selectedRifa.fecha_sorteo || "Sin fecha"}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {selectedRifa.ganador && (
              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                🏆 Con ganador
              </span>
            )}
            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
              selectedRifa.activa
                ? "bg-green-50 text-green-600 border-green-100"
                : "bg-slate-50 text-slate-400 border-slate-100"
            }`}>
              {selectedRifa.activa ? "Activa" : "Pausada"}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sidebar: report type nav */}
        <div className="lg:w-64 shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Módulos de Análisis</p>
          <div className="space-y-1">
            {REPORTS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveReport(r.id)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 border ${
                  activeReport === r.id
                    ? "bg-white border-slate-100 text-slate-900 shadow-sm"
                    : "text-slate-400 border-transparent hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                <span className={`text-lg grayscale brightness-125 ${activeReport === r.id ? 'grayscale-0 brightness-100' : ''}`}>{r.icon}</span>
                <span>{r.label}</span>
                {activeReport === r.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        {/* Report content */}
        <div className="flex-1 min-w-0">
          {needsRifaSelect ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <span className="text-4xl mb-3">👆</span>
              <p className="font-semibold">Selecciona una rifa para ver este reporte</p>
            </div>
          ) : (
            <>
              {/* ── Resumen ejecutivo ── */}
              {activeReport === "resumen" && (
                <div className="space-y-6">
                  {summaryStats.map((s) => (
                    <div key={s.rifa.id} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
                      <div className="flex items-start justify-between mb-8">
                        <div>
                          <h2 className="font-black text-2xl text-slate-900 tracking-tight">{s.rifa.nombre}</h2>
                          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest leading-none">Rango: {s.rifa.num_inicio}–{s.rifa.num_fin}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          {s.rifa.ganador && (
                            <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                              🏆 Con ganador
                            </span>
                          )}
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                            s.rifa.activa
                              ? "bg-green-50 text-green-600 border-green-100"
                              : "bg-slate-50 text-slate-400 border-slate-100"
                          }`}>
                            {s.rifa.activa ? "Activa" : "Pausada"}
                          </span>
                          {s.diasSorteo !== null && (
                            <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                              s.diasSorteo < 0
                                ? "bg-rose-50 text-brand-red border-rose-100"
                                : s.diasSorteo <= 7
                                ? "bg-orange-50 text-orange-600 border-orange-100"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                            }`}>
                              {s.diasSorteo < 0 ? `Hace ${Math.abs(s.diasSorteo)}d` : s.diasSorteo === 0 ? "Hoy" : `En ${s.diasSorteo}d`}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-10">
                        <div className="flex justify-between items-end mb-3">
                          <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Ocupación General</p>
                          <p className="text-xl font-black text-slate-900">
                             {((s.pagados + s.apartados) / Math.max(s.total, 1) * 100).toFixed(1)}% <span className="text-[10px] text-slate-400 ml-1">/ {s.total}</span>
                          </p>
                        </div>
                        <div className="h-4 rounded-full bg-slate-50 border border-slate-100 overflow-hidden flex shadow-inner">
                          <div className="h-full bg-green-500 shadow-lg shadow-green-500/20" style={{ width: `${(s.pagados / Math.max(s.total, 1)) * 100}%` }} />
                          <div className="h-full bg-amber-400 shadow-lg shadow-amber-400/20" style={{ width: `${(s.apartados / Math.max(s.total, 1)) * 100}%` }} />
                        </div>
                        <div className="flex gap-6 mt-4">
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400"><span className="w-2 h-2 rounded-full bg-green-500" />Pagados: {s.pagados}</span>
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400"><span className="w-2 h-2 rounded-full bg-amber-400" />Apartados: {s.apartados}</span>
                          <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400"><span className="w-2 h-2 rounded-full bg-slate-200" />Disponibles: {s.disponibles}</span>
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Ingresos</p>
                          <p className="text-2xl font-black text-green-600">${s.ingresos.toLocaleString("es-MX")}</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Potencial</p>
                          <p className="text-2xl font-black text-amber-600">${s.potencial.toLocaleString("es-MX")}</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Emitidos</p>
                          <p className="text-2xl font-black text-slate-900">{s.boletosPagados}</p>
                        </div>
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">Libres</p>
                          <p className="text-2xl font-black text-slate-900">{s.disponibles}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {summaryStats.length === 0 && (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No hay campañas registradas</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Compradores ── */}
              {activeReport === "compradores" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex-1 min-w-[300px] relative">
                      <input
                        type="text"
                        placeholder="Buscar por nombre, celular o folio..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-5 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-500/10 focus:border-brand-red transition-all"
                      />
                      <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222.5%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="pagado">Pagados</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 rounded-2xl">
                      {compradoresData.length} registros
                    </div>
                  </div>

                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm min-w-[800px]">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Folio</th>
                          {!selectedRifaId && <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Campaña</th>}
                          <SortHeader label="Nombre" field="nombre" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                          <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Contacto</th>
                          <SortHeader label="Boletos" field="numeros" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                          <SortHeader label="Monto" field="total" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                          <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Estado</th>
                          <SortHeader label="Fecha" field="fecha" sortField={sortField} sortDir={sortDir} onSort={toggleSort} />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {compradoresData.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-5">
                              <span className="font-mono font-black text-brand-red bg-rose-50 px-2 py-1 rounded-lg text-xs border border-rose-100">{b.folio}</span>
                            </td>
                            {!selectedRifaId && <td className="px-6 py-5 font-bold text-slate-700">{rifaMap.get(b.rifa_id)?.nombre ?? "—"}</td>}
                            <td className="px-6 py-5 whitespace-nowrap">
                              <p className="font-black text-slate-900 leading-none mb-1">{b.nombre} {b.apellidos}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{b.estado || 'México'}</p>
                            </td>
                            <td className="px-6 py-5 text-slate-500 font-mono font-bold text-xs">{b.celular}</td>
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">{b.numeros.length}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[100px]">
                                  {b.numeros.slice(0, 2).join(", ")}{b.numeros.length > 2 ? "..." : ""}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-5 font-black text-slate-900">${b.precio_total.toLocaleString("es-MX")}</td>
                            <td className="px-6 py-5"><StatusBadge status={b.status} /></td>
                            <td className="px-6 py-5 text-[10px] font-black text-slate-400 whitespace-nowrap uppercase tracking-widest">
                              {b.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {compradoresData.length === 0 && (
                      <div className="text-center py-20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sin registros encontrados</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Mapa de números ── */}
              {activeReport === "mapa" && selectedRifa && numberMapData && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="w-3 h-3 rounded-md bg-green-500 shadow-sm" />Pagado</span>
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="w-3 h-3 rounded-md bg-amber-400 shadow-sm" />Apartado</span>
                      <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="w-3 h-3 rounded-md bg-slate-200 shadow-sm" />Libre</span>
                    </div>
                  </div>

                  {/* Hover info panel */}
                  <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 min-h-[140px] flex items-center gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                      <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                    </div>
                    {hoveredNum !== null ? (
                      (() => {
                        const entry = numberMapData.get(hoveredNum);
                        return entry ? (
                          <>
                            <div className="w-20 h-20 bg-rose-50 rounded-[2rem] flex items-center justify-center text-brand-red text-3xl font-black shadow-inner border border-rose-100">
                              #{hoveredNum}
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Información del Boleto</p>
                              <p className="text-2xl font-black text-slate-900 leading-tight">{entry.boleto.nombre} {entry.boleto.apellidos}</p>
                              <p className="text-xs font-bold text-slate-400 font-mono">{entry.boleto.folio} · {entry.boleto.celular}</p>
                            </div>
                            <div className="ml-auto">
                              <StatusBadge status={entry.boleto.status} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 text-3xl font-black border border-slate-100 shadow-inner">
                              #{hoveredNum}
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</p>
                              <p className="text-2xl font-black text-slate-300 tracking-tight">Voucher No Emitido</p>
                              <p className="text-xs font-bold text-slate-400">Este número está disponible para su venta</p>
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <div className="w-full text-center py-4">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Explorar mapa de ocupación interactivo</p>
                        <p className="text-xs font-bold text-slate-300 mt-2">Pasa el cursor sobre cualquier número para ver los detalles del comprador</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-[3rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
                    <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-12 lg:grid-cols-20 gap-2">
                      {Array.from({ length: selectedRifa.num_fin - selectedRifa.num_inicio + 1 }, (_, i) => {
                        const num = selectedRifa.num_inicio + i;
                        const entry = numberMapData.get(num);
                        const colorClass = !entry
                          ? "bg-slate-50 text-slate-300 border-slate-100 hover:bg-slate-100"
                          : entry.status === "pagado"    ? "bg-green-500 text-white border-green-600 shadow-lg shadow-green-500/20"
                          : entry.status === "pendiente" ? "bg-amber-400 text-white border-amber-500 shadow-lg shadow-amber-400/20"
                          :                               "bg-slate-300 text-slate-500 border-slate-300";
                        return (
                          <button
                            key={num}
                            onMouseEnter={() => setHoveredNum(num)}
                            onMouseLeave={() => setHoveredNum(null)}
                            className={`aspect-square rounded-xl text-[10px] font-black transition-all hover:scale-110 border ${colorClass}`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Ingresos ── */}
              {activeReport === "ingresos" && (
                <div className="space-y-6">
                  {/* Summary cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {(() => {
                      const confirmados = rifaBoletos.filter((b) => b.status === "pagado").reduce((s, b) => s + b.precio_total, 0);
                      const potencial = rifaBoletos.filter((b) => b.status !== "cancelado").reduce((s, b) => s + b.precio_total, 0);
                      const totalDescuento = codigosData.reduce((s, c) => s + c.totalDescuento, 0);
                      return (
                        <>
                          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Ingresos Confirmados</p>
                            <p className="text-4xl font-black text-green-600">${confirmados.toLocaleString("es-MX")}</p>
                          </div>
                          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Monto Potencial</p>
                            <p className="text-4xl font-black text-amber-500">${potencial.toLocaleString("es-MX")}</p>
                          </div>
                          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-100/50">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Descuentos Aplicados</p>
                            <p className="text-4xl font-black text-rose-500">${Number(totalDescuento.toFixed(2)).toLocaleString("es-MX")}</p>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  {/* By day table */}
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <div className="px-8 py-6 bg-slate-50 border-b border-slate-100">
                      <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Desglose Cronológico de Ventas</h3>
                    </div>
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          {["Fecha", "Confirmados (MXN)", "Potencial (MXN)"].map((h) => (
                            <th key={h} className="text-left px-8 py-4 font-black text-slate-400 uppercase tracking-widest text-[10px]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {ingresosByDay.map(([date, d]) => (
                          <tr key={date} className="hover:bg-slate-50 group transition-colors">
                            <td className="px-8 py-5 font-black text-slate-700">{date}</td>
                            <td className="px-8 py-5 font-black text-green-600 text-lg">${d.confirmados.toLocaleString("es-MX")}</td>
                            <td className="px-8 py-5 font-bold text-amber-500">${d.potenciales.toLocaleString("es-MX")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {ingresosByDay.length === 0 && (
                      <div className="text-center py-20">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Sin movimientos financieros registrados</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Clientes únicos ── */}
              {activeReport === "clientes" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-1">
                    <div className="w-2 h-2 rounded-full bg-brand-red" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{clientesData.length} clientes únicos en la base de datos</p>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm min-w-[700px]">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          {["Nombre del Cliente", "Celular", "Estado", "Actividad", "Pagado", "Pendiente"].map((h) => (
                            <th key={h} className="text-left px-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {clientesData.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 group transition-colors">
                            <td className="px-8 py-5">
                              <p className="font-black text-slate-900 mb-0.5">{c.nombre} {c.apellidos}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Socio Premium</p>
                            </td>
                            <td className="px-8 py-5 text-slate-500 font-mono font-bold text-xs">{c.celular}</td>
                            <td className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.estado}</td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-2">
                                <span className="text-slate-900 font-black">{c.numeros.length}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({c.boletos} folio{c.boletos !== 1 ? "s" : ""})</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 font-black text-green-600">
                              {c.pagado > 0 ? `$${c.pagado.toLocaleString("es-MX")}` : "—"}
                            </td>
                            <td className="px-8 py-5 font-bold text-amber-500">
                              {c.pendiente > 0 ? `$${c.pendiente.toLocaleString("es-MX")}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {clientesData.length === 0 && (
                      <div className="text-center py-20">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No hay clientes registrados aún</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Códigos de descuento ── */}
              {activeReport === "codigos" && (
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          {["Cupón / Código", "Frecuencia", "Descuento Acumulado", "Valor Bruto"].map((h) => (
                            <th key={h} className="text-left px-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {codigosData.map((c) => (
                          <tr key={c.codigo} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5">
                              <span className="font-mono font-black text-brand-red bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 text-xs">{c.codigo}</span>
                            </td>
                            <td className="px-8 py-5 font-black text-slate-900">{c.usos} <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">Usos</span></td>
                            <td className="px-8 py-5 font-black text-brand-red">-${c.totalDescuento.toFixed(2)}</td>
                            <td className="px-8 py-5 text-slate-400 font-bold">${c.totalBruto.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {codigosData.length === 0 && (
                      <div className="text-center py-20">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No se han detectado cupones en este periodo</p>
                      </div>
                    )}
                </div>
              )}

              {/* ── Ganador ── */}
              {activeReport === "ganador" && selectedRifa && (
                <div className="animate-in zoom-in duration-700">
                  {selectedRifa.ganador ? (
                    <div className="bg-white rounded-[3rem] border border-amber-100 p-12 text-center shadow-2xl shadow-amber-100 relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200" />
                      <div className="w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner border border-amber-100 group-hover:scale-110 transition-transform duration-500">
                         🏆
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{selectedRifa.ganador.nombre} {selectedRifa.ganador.apellidos}</h2>
                      <div className="flex items-center justify-center gap-2 mb-10">
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Folio Ganador:</span>
                         <span className="font-mono font-black text-brand-red bg-rose-50 px-3 py-1 rounded-xl text-xs border border-rose-100">{selectedRifa.ganador.folio}</span>
                      </div>
                      
                      <div className="inline-flex flex-col items-center bg-slate-900 rounded-[2.5rem] px-12 py-8 shadow-2xl shadow-slate-200 border-4 border-white mb-8">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4">Número de la Suerte</p>
                        <p className="text-7xl font-black text-white">{selectedRifa.ganador.numero}</p>
                      </div>

                      <div className="flex justify-center flex-col items-center gap-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resultado Oficial</p>
                        <p className="text-xs font-bold text-slate-600">
                          {selectedRifa.ganador.anunciado_at
                            ? `Validado el ${new Date(selectedRifa.ganador.anunciado_at).toLocaleDateString("es-MX", { dateStyle: "long" })}`
                            : "Fecha pendiente de validación"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-slate-50/50 rounded-[3rem] border-4 border-dashed border-slate-200 text-center">
                      <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-4xl mb-6 shadow-xl text-slate-200">🎲</div>
                      <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-sm">Sorteo Pendiente</p>
                      <p className="text-xs font-bold text-slate-300 mt-2">Aún no se ha registrado un ticket ganador para esta campaña</p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Reporte privado ── */}
              {activeReport === "privado" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222.5%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="pagado">Pagados</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 rounded-2xl">
                      {filtered.length} auditorías disponibles
                    </div>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-xs min-w-[1000px]">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Folio</th>
                          {!selectedRifaId && <th className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Campaña</th>}
                          {["Nombre", "Apellidos", "Celular", "Estado", "Dígitos", "Cupón", "Dto", "Total", "Status", "Fecha"].map((h) => (
                            <th key={h} className="text-left px-6 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filtered.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4"><span className="font-mono font-black text-brand-red">{b.folio}</span></td>
                            {!selectedRifaId && <td className="px-6 py-4 font-bold">{rifaMap.get(b.rifa_id)?.nombre ?? "—"}</td>}
                            <td className="px-6 py-4 font-bold">{b.nombre}</td>
                            <td className="px-6 py-4 font-bold">{b.apellidos}</td>
                            <td className="px-6 py-4 font-mono font-bold text-slate-400">{b.celular}</td>
                            <td className="px-6 py-4 font-black uppercase tracking-widest text-slate-400">{b.estado}</td>
                            <td className="px-6 py-4 font-black text-slate-400 truncate max-w-[120px]">{b.numeros.join(", ")}</td>
                            <td className="px-6 py-4 font-mono font-black text-slate-900">{b.codigo_descuento || "—"}</td>
                            <td className="px-6 py-4 text-center font-black">{b.descuento_aplicado ? `${b.descuento_aplicado}%` : "—"}</td>
                            <td className="px-6 py-4 font-black text-slate-900">${b.precio_total.toLocaleString("es-MX")}</td>
                            <td className="px-6 py-4"><StatusBadge status={b.status} /></td>
                            <td className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                              {b.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ?? "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filtered.length === 0 && (
                      <div className="text-center py-20 text-slate-300">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Auditoría sin registros correspondientes</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Reporte público ── */}
              {activeReport === "publico" && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-rose-500/10 transition-all appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222.5%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
                    >
                      <option value="todos">Todos los estados</option>
                      <option value="pendiente">Pendientes</option>
                      <option value="pagado">Pagados</option>
                      <option value="cancelado">Cancelados</option>
                    </select>
                    <div className="px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 border border-slate-100 rounded-2xl">
                      {filtered.length} folios públicos
                    </div>
                  </div>
                  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                    <table className="w-full text-sm min-w-[500px]">
                      <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                          <th className="text-left px-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Folio Transacción</th>
                          {!selectedRifaId && <th className="text-left px-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Campaña</th>}
                          <th className="text-left px-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Números Adquiridos</th>
                          <th className="text-left px-8 py-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Estado Emisión</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filtered.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-5"><span className="font-mono font-black text-brand-red bg-rose-50 px-2 py-1 rounded-lg text-xs border border-rose-100">{b.folio}</span></td>
                            {!selectedRifaId && <td className="px-8 py-5 font-bold text-slate-700">{rifaMap.get(b.rifa_id)?.nombre ?? "—"}</td>}
                            <td className="px-8 py-5 text-xs font-black text-slate-400">{b.numeros.join(", ")}</td>
                            <td className="px-8 py-5"><StatusBadge status={b.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {filtered.length === 0 && (
                      <div className="text-center py-20 text-slate-300">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sin folios para mostrar</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
