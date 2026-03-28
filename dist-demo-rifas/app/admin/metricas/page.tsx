"use client";

import { useEffect, useState, useMemo } from "react";
import { Boleto, Rifa, DiscountCode, getBoletos, getRifas, getDiscountCodes } from "@/lib/firestore";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(n: number, total: number) {
  return total > 0 ? ((n / total) * 100).toFixed(1) : "0.0";
}

function currency(n: number) {
  return `$${n.toLocaleString("es-MX")}`;
}

function barW(n: number, max: number) {
  return max > 0 ? `${Math.round((n / max) * 100)}%` : "0%";
}

function trendPct(curr: number, prev: number): { pct: number; up: boolean } | null {
  if (prev === 0) return null;
  const p = ((curr - prev) / prev) * 100;
  return { pct: Math.abs(p), up: p >= 0 };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label, value, sub, color, trend,
}: {
  label: string;
  value: string | number;
  sub?: string;
  color: string;
  trend?: { pct: number; up: boolean } | null;
}) {
  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm group hover:shadow-xl hover:shadow-slate-100/50 transition-all">
      <div className={`w-10 h-10 rounded-2xl ${color.replace('bg-', 'bg-')}/10 flex items-center justify-center mb-6`}>
        <div className={`w-2 h-2 rounded-full ${color}`} />
      </div>
      <p className="text-3xl font-black text-slate-900 tracking-tight mb-1">{value}</p>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      {trend ? (
        <p className={`text-[10px] font-black uppercase tracking-widest mt-4 flex items-center gap-1 ${trend.up ? "text-green-600" : "text-brand-red"}`}>
          <span className="text-lg">{trend.up ? "↑" : "↓"}</span>
          <span>{trend.pct.toFixed(1)}% vs periodo anterior</span>
        </p>
      ) : sub ? (
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4 opacity-60">{sub}</p>
      ) : null}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <div className="w-1.5 h-1.5 rounded-full bg-brand-red" />
      <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{children}</h2>
    </div>
  );
}

function HBar({ label, value, max, formatted, color = "bg-brand-red" }: {
  label: string; value: number; max: number; formatted: string; color?: string;
}) {
  return (
    <div className="flex items-center gap-4 group">
      <p className="w-36 text-[10px] font-black text-slate-500 uppercase tracking-widest truncate flex-shrink-0 group-hover:text-slate-900 transition-colors uppercase">{label}</p>
      <div className="flex-1 h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
        <div 
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-sm`} 
          style={{ width: barW(value, max) }} 
        />
      </div>
      <p className="w-24 text-[10px] font-black text-slate-900 text-right flex-shrink-0 tracking-widest">{formatted}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg =
    status === "pagado"    ? { cls: "bg-green-50 text-green-600 border-green-100", label: "PAGADO" } :
    status === "cancelado" ? { cls: "bg-slate-50 text-slate-400 border-slate-100", label: "CANCELADO" } :
                             { cls: "bg-amber-50 text-amber-600 border-amber-100", label: "PENDIENTE" };
  return (
    <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest whitespace-nowrap ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MetricasPage() {
  const [boletos, setBoletos]         = useState<Boleto[]>([]);
  const [rifas, setRifas]             = useState<Rifa[]>([]);
  const [codes, setCodes]             = useState<DiscountCode[]>([]);
  const [loading, setLoading]         = useState(true);
  const [period, setPeriod]           = useState<0 | 7 | 14 | 30>(14);
  const [selectedRifaId, setSelectedRifaId] = useState<string | null>(null);

  // ── Data retrieval (Demo Mode) ──────────────────────────────────────────────
  useEffect(() => {
    Promise.all([getBoletos(), getRifas(), getDiscountCodes()]).then(([bs, rs, cs]) => {
      setBoletos(bs);
      setRifas(rs);
      setCodes(cs);
      setLoading(false);
    });
  }, []);

  // ── Rifa seleccionada ───────────────────────────────────────────────────────
  const selectedRifa = useMemo(() =>
    selectedRifaId ? (rifas.find((r) => r.id === selectedRifaId) ?? null) : null,
  [selectedRifaId, rifas]);

  const isGlobal = selectedRifaId === null;

  // ── Boletos activos (filtrados por rifa si se seleccionó una) ───────────────
  const activeBoletos = useMemo(() =>
    selectedRifaId ? boletos.filter((b) => b.rifa_id === selectedRifaId) : boletos,
  [boletos, selectedRifaId]);

  // ── Period boundaries ───────────────────────────────────────────────────────
  const periodStart = useMemo(() => {
    if (period === 0) return null;
    return new Date(Date.now() - period * 24 * 60 * 60 * 1000);
  }, [period]);

  const prevPeriodStart = useMemo(() => {
    if (period === 0) return null;
    return new Date(Date.now() - period * 2 * 24 * 60 * 60 * 1000);
  }, [period]);

  // ── Boletos filtrados por período (sobre activeBoletos) ─────────────────────
  const boletosPeriod = useMemo(() => {
    if (!periodStart) return activeBoletos;
    return activeBoletos.filter((b) => { const d = b.created_at?.toDate?.(); return d && d >= periodStart; });
  }, [activeBoletos, periodStart]);

  const boletosPrev = useMemo(() => {
    if (!periodStart || !prevPeriodStart) return [];
    return activeBoletos.filter((b) => {
      const d = b.created_at?.toDate?.();
      return d && d >= prevPeriodStart && d < periodStart;
    });
  }, [activeBoletos, periodStart, prevPeriodStart]);

  // ── Sets base ───────────────────────────────────────────────────────────────
  const pagadosAll    = useMemo(() => activeBoletos.filter((b) => b.status === "pagado"),    [activeBoletos]);
  const pendientesAll = useMemo(() => activeBoletos.filter((b) => b.status === "pendiente"), [activeBoletos]);
  const canceladosAll = useMemo(() => activeBoletos.filter((b) => b.status === "cancelado"), [activeBoletos]);
  const regalosAll    = useMemo(() => pagadosAll.filter((b) => b.codigo_descuento === "REGALO"), [pagadosAll]);

  // Alertas siempre globales
  const pendientesGlobal = useMemo(() => boletos.filter((b) => b.status === "pendiente"), [boletos]);

  // ── Period sets ─────────────────────────────────────────────────────────────
  const pagadosPeriod = useMemo(() => boletosPeriod.filter((b) => b.status === "pagado"), [boletosPeriod]);
  const pagadosPrev   = useMemo(() => boletosPrev.filter((b) => b.status === "pagado"),   [boletosPrev]);

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const ingresoTotal      = useMemo(() => pagadosAll.reduce((s, b) => s + b.precio_total, 0), [pagadosAll]);
  const ingresoPendiente  = useMemo(() => pendientesAll.reduce((s, b) => s + b.precio_total, 0), [pendientesAll]);
  const descuentoTotal    = useMemo(() =>
    pagadosAll.reduce((s, b) => s + (b.precio_total / (1 - b.descuento_aplicado / 100) - b.precio_total || 0), 0)
  , [pagadosAll]);
  const ticketPromedio    = pagadosAll.length > 0 ? ingresoTotal / pagadosAll.length : 0;
  const clientesUnicosAll = useMemo(() =>
    new Set(activeBoletos.filter((b) => b.celular).map((b) => b.celular)).size, [activeBoletos]);
  const conversionAll     = activeBoletos.length > 0 ? (pagadosAll.length / activeBoletos.length) * 100 : 0;

  const totalNumerosVendidosPagados = useMemo(() =>
    pagadosAll.reduce((s, b) => s + b.numeros.length, 0), [pagadosAll]);
  const precioPorNumero   = totalNumerosVendidosPagados > 0 ? ingresoTotal / totalNumerosVendidosPagados : 0;
  const numPromedioCompra = pagadosAll.length > 0 ? totalNumerosVendidosPagados / pagadosAll.length : 0;

  // ── Calidad de revenue ──────────────────────────────────────────────────────
  const pagadosConDesc   = useMemo(() =>
    pagadosAll.filter((b) => b.codigo_descuento && b.codigo_descuento !== "" && b.codigo_descuento !== "REGALO"),
  [pagadosAll]);
  const pagadosSinDesc   = useMemo(() =>
    pagadosAll.filter((b) => !b.codigo_descuento || b.codigo_descuento === ""),
  [pagadosAll]);
  const boletosConCodigo = useMemo(() =>
    activeBoletos.filter((b) => b.codigo_descuento && b.codigo_descuento !== "" && b.codigo_descuento !== "REGALO"),
  [activeBoletos]);
  const boletosSinCodigo = useMemo(() =>
    activeBoletos.filter((b) => !b.codigo_descuento || b.codigo_descuento === ""),
  [activeBoletos]);
  const conversionConDesc  = boletosConCodigo.length > 0 ? (pagadosConDesc.length / boletosConCodigo.length) * 100 : 0;
  const conversionSinDesc  = boletosSinCodigo.length > 0 ? (pagadosSinDesc.length / boletosSinCodigo.length) * 100 : 0;
  const revenuePerdido     = useMemo(() => canceladosAll.reduce((s, b) => s + b.precio_total, 0), [canceladosAll]);

  // ── Pareto ─────────────────────────────────────────────────────────────────
  const paretoDatos = useMemo(() => {
    if (ingresoTotal === 0) return { top20pct: 0, top5pct: 0, top20count: 0 };
    const map = new Map<string, number>();
    pagadosAll.forEach((b) => map.set(b.celular || b.nombre, (map.get(b.celular || b.nombre) ?? 0) + b.precio_total));
    const sorted = Array.from(map.values()).sort((a, b) => b - a);
    const top20count  = Math.max(1, Math.ceil(sorted.length * 0.2));
    const top20revenue = sorted.slice(0, top20count).reduce((s, v) => s + v, 0);
    const top5revenue  = sorted.slice(0, Math.min(5, sorted.length)).reduce((s, v) => s + v, 0);
    return { top20pct: (top20revenue / ingresoTotal) * 100, top5pct: (top5revenue / ingresoTotal) * 100, top20count };
  }, [pagadosAll, ingresoTotal]);

  // ── Period KPIs (tendencias) ─────────────────────────────────────────────────
  const ingresoCurr     = useMemo(() => pagadosPeriod.reduce((s, b) => s + b.precio_total, 0), [pagadosPeriod]);
  const ingresoPrevVal  = useMemo(() => pagadosPrev.reduce((s, b) => s + b.precio_total, 0),   [pagadosPrev]);
  const clientesCurr    = useMemo(() =>
    new Set(pagadosPeriod.filter((b) => b.celular).map((b) => b.celular)).size, [pagadosPeriod]);
  const clientesPrevVal = useMemo(() =>
    new Set(pagadosPrev.filter((b) => b.celular).map((b) => b.celular)).size, [pagadosPrev]);
  const conversionCurr    = boletosPeriod.length > 0 ? (pagadosPeriod.length / boletosPeriod.length) * 100 : 0;
  const conversionPrevVal = boletosPrev.length > 0   ? (pagadosPrev.length   / boletosPrev.length)   * 100 : 0;

  const trendIngresos   = period > 0 ? trendPct(ingresoCurr,          ingresoPrevVal)     : null;
  const trendPagados    = period > 0 ? trendPct(pagadosPeriod.length,  pagadosPrev.length) : null;
  const trendClientes   = period > 0 ? trendPct(clientesCurr,          clientesPrevVal)    : null;
  const trendConversion = period > 0 ? trendPct(conversionCurr,        conversionPrevVal)  : null;

  // ── Alertas (siempre globales) ───────────────────────────────────────────────
  const riesgoVencer = useMemo(() => {
    const threshold = new Date(Date.now() - 20 * 60 * 60 * 1000);
    return pendientesGlobal.filter((b) => { const d = b.created_at?.toDate?.(); return d && d < threshold; });
  }, [pendientesGlobal]);
  const riesgoVencerValor = useMemo(() => riesgoVencer.reduce((s, b) => s + b.precio_total, 0), [riesgoVencer]);

  const rifasOcupacionBaja = useMemo(() =>
    rifas.filter((r) => {
      if (!r.activa || !r.fecha_sorteo) return false;
      const total = r.num_fin - r.num_inicio + 1;
      const ocup  = total > 0 ? ((r.num_vendidos ?? 0) + (r.num_apartados ?? 0)) / total : 0;
      if (ocup >= 0.15) return false;
      const dias = (new Date(r.fecha_sorteo).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return dias >= 0 && dias < 14;
    })
  , [rifas]);

  const codesEnRiesgo   = useMemo(() => codes.filter((c) => c.activo && c.max_usos > 0 && c.usos >= c.max_usos - 1), [codes]);
  const rifasSinGanador = useMemo(() => rifas.filter((r) => !r.activa && !r.ganador), [rifas]);
  const hasAlerts       = riesgoVencer.length > 0 || rifasOcupacionBaja.length > 0 || codesEnRiesgo.length > 0 || rifasSinGanador.length > 0;

  // ── rifaMap ─────────────────────────────────────────────────────────────────
  const rifaMap = useMemo(() => new Map(rifas.map((r) => [r.id!, r])), [rifas]);

  // ── Números: global o por rifa seleccionada ──────────────────────────────────
  const numDisplay = useMemo(() => {
    if (selectedRifa) {
      const total     = selectedRifa.num_fin - selectedRifa.num_inicio + 1;
      const vendidos  = selectedRifa.num_vendidos ?? 0;
      const apartados = selectedRifa.num_apartados ?? 0;
      return { total, vendidos, apartados, disponibles: total - vendidos - apartados };
    }
    const total     = rifas.reduce((s, r) => s + (r.num_fin - r.num_inicio + 1), 0);
    const vendidos  = rifas.reduce((s, r) => s + (r.num_vendidos ?? 0), 0);
    const apartados = rifas.reduce((s, r) => s + (r.num_apartados ?? 0), 0);
    return { total, vendidos, apartados, disponibles: total - vendidos - apartados };
  }, [selectedRifa, rifas]);

  // ── Revenue by rifa (solo en vista global) ───────────────────────────────────
  const revenueByRifa = useMemo(() => {
    const map = new Map<string, number>();
    pagadosAll.forEach((b) => map.set(b.rifa_id, (map.get(b.rifa_id) ?? 0) + b.precio_total));
    return Array.from(map.entries())
      .map(([id, total]) => ({ name: rifaMap.get(id)?.nombre ?? id, total }))
      .sort((a, b) => b.total - a.total);
  }, [pagadosAll, rifaMap]);

  const boletosByRifa = useMemo(() => {
    const map = new Map<string, number>();
    pagadosAll.forEach((b) => map.set(b.rifa_id, (map.get(b.rifa_id) ?? 0) + 1));
    return Array.from(map.entries())
      .map(([id, count]) => ({ name: rifaMap.get(id)?.nombre ?? id, count }))
      .sort((a, b) => b.count - a.count);
  }, [pagadosAll, rifaMap]);

  // ── Time series ──────────────────────────────────────────────────────────────
  const timeSeries = useMemo(() => {
    const p = period > 0 ? period : 30;
    const days: { date: string; label: string; ingresos: number }[] = [];
    const now = new Date();
    for (let i = p - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, label: d.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }), ingresos: 0 });
    }
    pagadosAll.forEach((b) => {
      const d = b.created_at?.toDate?.();
      if (!d) return;
      const key = d.toISOString().slice(0, 10);
      const entry = days.find((x) => x.date === key);
      if (entry) entry.ingresos += b.precio_total;
    });
    return days;
  }, [pagadosAll, period]);
  const maxIngresos = useMemo(() => Math.max(...timeSeries.map((d) => d.ingresos), 1), [timeSeries]);

  // ── Velocidad ────────────────────────────────────────────────────────────────
  const velocidadBoletos  = period > 0 ? pagadosPeriod.length / period : pagadosAll.length / Math.max(1, 30);
  const velocidadIngresos = period > 0 ? ingresoCurr / period          : ingresoTotal / Math.max(1, 30);
  const proyeccionMensual = velocidadIngresos * 30;

  const proyeccionRifas = useMemo(() => {
    const source = isGlobal ? rifas.filter((r) => r.activa) : (selectedRifa ? [selectedRifa] : []);
    return source.map((r) => {
      const disponibles = Math.max(0, (r.num_fin - r.num_inicio + 1) - (r.num_vendidos ?? 0) - (r.num_apartados ?? 0));
      const rifaPagadosPeriod = pagadosPeriod.filter((b) => b.rifa_id === r.id);
      const vel  = period > 0 ? rifaPagadosPeriod.length / period : 0;
      const dias = vel > 0 ? Math.ceil(disponibles / vel) : null;
      return { nombre: r.nombre, disponibles, dias, ingresoProyectado: disponibles * r.precio_boleto };
    });
  }, [rifas, selectedRifa, isGlobal, pagadosPeriod, period]);

  // ── Top customers ────────────────────────────────────────────────────────────
  const topClientes = useMemo(() => {
    const map = new Map<string, { nombre: string; total: number; boletos: number; celular: string }>();
    pagadosAll.forEach((b) => {
      const key = b.celular || b.nombre;
      const existing = map.get(key);
      if (existing) { existing.total += b.precio_total; existing.boletos += b.numeros.length; }
      else map.set(key, { nombre: `${b.nombre} ${b.apellidos}`.trim(), total: b.precio_total, boletos: b.numeros.length, celular: b.celular });
    });
    return Array.from(map.values()).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [pagadosAll]);

  // ── Distribución por estado ──────────────────────────────────────────────────
  const byEstado = useMemo(() => {
    const map = new Map<string, { count: number; revenue: number }>();
    activeBoletos.filter((b) => b.estado).forEach((b) => {
      const existing = map.get(b.estado);
      const rev = b.status === "pagado" ? b.precio_total : 0;
      if (existing) { existing.count++; existing.revenue += rev; }
      else map.set(b.estado, { count: 1, revenue: rev });
    });
    return Array.from(map.entries())
      .map(([estado, data]) => ({ estado, count: data.count, revenue: data.revenue, rpc: data.count > 0 ? data.revenue / data.count : 0 }))
      .sort((a, b) => b.count - a.count).slice(0, 10);
  }, [activeBoletos]);

  // ── Códigos de descuento ─────────────────────────────────────────────────────
  const discountUsage = useMemo(() => {
    const map = new Map<string, { usos: number; ahorro: number }>();
    pagadosAll.filter((b) => b.codigo_descuento && b.codigo_descuento !== "REGALO").forEach((b) => {
      const existing = map.get(b.codigo_descuento);
      const ahorro = b.precio_total * (b.descuento_aplicado / (100 - b.descuento_aplicado));
      if (existing) { existing.usos++; existing.ahorro += ahorro; }
      else map.set(b.codigo_descuento, { usos: 1, ahorro });
    });
    return Array.from(map.entries()).map(([codigo, data]) => ({ codigo, ...data })).sort((a, b) => b.usos - a.usos);
  }, [pagadosAll]);

  // ── Números populares ────────────────────────────────────────────────────────
  const popularNumbers = useMemo(() => {
    const map = new Map<number, number>();
    pagadosAll.forEach((b) => b.numeros.forEach((n) => map.set(n, (map.get(n) ?? 0) + 1)));
    return Array.from(map.entries()).map(([n, count]) => ({ n, count })).sort((a, b) => b.count - a.count).slice(0, 20);
  }, [pagadosAll]);

  // ── Rangos de números ────────────────────────────────────────────────────────
  const rangosNumeros = useMemo(() => {
    const srcRifas = selectedRifa ? [selectedRifa] : rifas;
    if (srcRifas.length === 0 || pagadosAll.length === 0) return [];
    const numMin     = Math.min(...srcRifas.map((r) => r.num_inicio));
    const numMax     = Math.max(...srcRifas.map((r) => r.num_fin));
    const rangeSize  = Math.ceil((numMax - numMin + 1) / 10);
    const rangos = Array.from({ length: 10 }, (_, i) => {
      const start = numMin + i * rangeSize;
      const end   = Math.min(start + rangeSize - 1, numMax);
      return { label: `${String(start).padStart(3, "0")}–${String(end).padStart(3, "0")}`, start, end, count: 0 };
    });
    pagadosAll.forEach((b) => b.numeros.forEach((n) => {
      const idx = Math.min(Math.floor((n - numMin) / rangeSize), 9);
      if (idx >= 0 && idx < rangos.length) rangos[idx].count++;
    }));
    return rangos;
  }, [selectedRifa, rifas, pagadosAll]);

  // ── Distribución de tamaño de compra ────────────────────────────────────────
  const distribucionTamano = useMemo(() => {
    const buckets = [
      { label: "1 número",      min: 1,  max: 1,       count: 0 },
      { label: "2–5 números",   min: 2,  max: 5,       count: 0 },
      { label: "6–10 números",  min: 6,  max: 10,      count: 0 },
      { label: "11–20 números", min: 11, max: 20,      count: 0 },
      { label: "21+ números",   min: 21, max: Infinity, count: 0 },
    ];
    pagadosAll.forEach((b) => {
      const n = b.numeros.length;
      const bucket = buckets.find((bk) => n >= bk.min && n <= bk.max);
      if (bucket) bucket.count++;
    });
    return buckets;
  }, [pagadosAll]);

  // ── Horas pico ───────────────────────────────────────────────────────────────
  const horasPico = useMemo(() => {
    const map = new Array(24).fill(0) as number[];
    boletosPeriod.forEach((b) => { const d = b.created_at?.toDate?.(); if (d) map[d.getHours()]++; });
    return map.map((count, h) => ({ h, count })).filter((x) => x.count > 0).sort((a, b) => b.count - a.count).slice(0, 8);
  }, [boletosPeriod]);

  // ── Días de semana (con revenue) ─────────────────────────────────────────────
  const diasSemana = useMemo(() => {
    const nombres    = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const mapCount   = new Array(7).fill(0) as number[];
    const mapRevenue = new Array(7).fill(0) as number[];
    boletosPeriod.forEach((b) => {
      const d = b.created_at?.toDate?.();
      if (d) { mapCount[d.getDay()]++; if (b.status === "pagado") mapRevenue[d.getDay()] += b.precio_total; }
    });
    return mapCount.map((count, i) => ({ dia: nombres[i], count, revenue: mapRevenue[i] }));
  }, [boletosPeriod]);

  // ── Clientes recurrentes ─────────────────────────────────────────────────────
  const clientesRecurrentes = useMemo(() => {
    const map = new Map<string, { nombre: string; rifasSet: Set<string>; total: number }>();
    pagadosAll.forEach((b) => {
      const key = b.celular || b.nombre;
      const existing = map.get(key);
      if (existing) { existing.rifasSet.add(b.rifa_id); existing.total += b.precio_total; }
      else map.set(key, { nombre: `${b.nombre} ${b.apellidos}`.trim(), rifasSet: new Set([b.rifa_id]), total: b.precio_total });
    });
    const all = Array.from(map.values());
    const recurrentes = all.filter((c) => c.rifasSet.size >= 2).sort((a, b) => b.total - a.total).map((c) => ({ nombre: c.nombre, rifas: c.rifasSet.size, total: c.total }));
    return { recurrentes, totalClientes: all.length };
  }, [pagadosAll]);

  // ── Actividad reciente ───────────────────────────────────────────────────────
  const recentBoletos = useMemo(() =>
    [...activeBoletos].sort((a, b) => {
      const da = a.created_at?.toDate?.()?.getTime() ?? 0;
      const db_ = b.created_at?.toDate?.()?.getTime() ?? 0;
      return db_ - da;
    }).slice(0, 15),
  [activeBoletos]);

  // ─────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full" />
      </div>
    );
  }

  const periodLabel = period === 0 ? "todo el tiempo" : `últimos ${period} días`;

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Métricas y Analítica</h1>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[9px] font-black text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-100 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Sincronizado
            </span>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {isGlobal
                ? `${boletos.length} boletos · ${rifas.length} rifas · ${clientesUnicosAll} clientes`
                : `${activeBoletos.length} boletos · ${clientesUnicosAll} clientes · ${selectedRifa?.nombre}`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Período */}
          <div className="flex bg-slate-50 border border-slate-100 rounded-2xl p-1">
            {([7, 14, 30, 0] as const).map((p) => (
              <button 
                key={p} 
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  period === p 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-100" 
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {p === 0 ? "Todo" : `${p}d`}
              </button>
            ))}
          </div>

          {/* Selector de rifa */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRifaId(null)}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isGlobal 
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                  : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
              }`}
            >
              Vista Global
            </button>
            {rifas.length > 0 && (
              <select
                value={selectedRifaId ?? ""}
                onChange={(e) => setSelectedRifaId(e.target.value || null)}
                className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border cursor-pointer outline-none ${
                  !isGlobal 
                    ? "bg-slate-900 border-slate-900 text-white shadow-lg" 
                    : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                }`}
              >
                <option value="">Seleccionar Rifa...</option>
                {rifas.map((r) => (
                  <option key={r.id} value={r.id} className="text-slate-900 bg-white">{r.nombre}</option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ── Card info de la rifa seleccionada ── */}
      {selectedRifa && (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm flex flex-wrap gap-8 items-center animate-in fade-in zoom-in duration-300">
          <div className="flex-1 min-w-[300px]">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{selectedRifa.nombre}</h3>
            <div className="flex flex-wrap items-center gap-4">
              <span className={`text-[9px] font-black px-2.5 py-1 rounded-lg border uppercase tracking-widest ${selectedRifa.activa ? "bg-green-50 text-green-600 border-green-100" : "bg-slate-50 text-slate-400 border-slate-100"}`}>
                {selectedRifa.activa ? "Campaña Activa" : "Campaña Finalizada"}
              </span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Rango: {selectedRifa.num_inicio}–{selectedRifa.num_fin} · {currency(selectedRifa.precio_boleto)} / boleto
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {selectedRifa.ganador && (
              <div className="bg-amber-50 border border-amber-100 px-6 py-4 rounded-[1.5rem] flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white">🏆</div>
                <div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em] mb-1">Ganador Oficial</p>
                  <p className="text-sm font-black text-slate-900">{selectedRifa.ganador.nombre} {selectedRifa.ganador.apellidos} — #{selectedRifa.ganador.numero}</p>
                </div>
              </div>
            )}
            <button 
              onClick={() => setSelectedRifaId(null)} 
              className="text-[10px] font-black text-brand-red uppercase tracking-widest hover:underline px-4 py-2"
            >
              Restablecer Filtros
            </button>
          </div>
        </div>
      )}

      {/* ── Alertas (siempre globales) ── */}
      {hasAlerts && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alertas de Operación</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {riesgoVencer.length > 0 && (
              <div className="bg-rose-50 border border-rose-100 p-6 rounded-[2rem] flex flex-col justify-between group">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-200">⚠️</div>
                  <h4 className="text-sm font-black text-rose-900 uppercase tracking-tight">{riesgoVencer.length} Boletos por Vencer</h4>
                  <p className="text-[10px] font-bold text-rose-600/70 uppercase tracking-widest mt-1">
                    Exceden 20h de espera · {currency(Math.round(riesgoVencerValor))}
                  </p>
                </div>
              </div>
            )}
            {rifasOcupacionBaja.length > 0 && (
              <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-amber-200">📉</div>
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">Ocupación Crítica</h4>
                  <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-widest mt-1">
                    &lt; 15% en {rifasOcupacionBaja.length} campañas activas
                  </p>
                </div>
              </div>
            )}
            {codesEnRiesgo.length > 0 && (
              <div className="bg-orange-50 border border-orange-100 p-6 rounded-[2rem] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-200">🏷️</div>
                  <h4 className="text-sm font-black text-orange-900 uppercase tracking-tight">Cupones Agotados</h4>
                  <p className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mt-1">
                    {codesEnRiesgo.length} códigos requieren atención
                  </p>
                </div>
              </div>
            )}
            {rifasSinGanador.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">🔍</div>
                  <h4 className="text-sm font-black text-blue-900 uppercase tracking-tight">Pendiente Ganador</h4>
                  <p className="text-[10px] font-bold text-blue-600/70 uppercase tracking-widest mt-1">
                    {rifasSinGanador.length} rifas cerradas sin asignar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── KPIs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Ingresos confirmados"  value={currency(ingresoTotal)}              color="bg-green-500"  trend={trendIngresos} />
        <KpiCard label="Escala de ingresos"   value={currency(ingresoPendiente)}           color="bg-amber-400" sub="Proyectado en espera" />
        <KpiCard label="Ticket Promedio"        value={currency(Math.round(ticketPromedio))} color="bg-blue-500" />
        <KpiCard label="Tasa de Cierre"    value={`${conversionAll.toFixed(1)}%`}       color="bg-purple-500" trend={trendConversion} sub={`${pagadosAll.length} de ${activeBoletos.length} boletos`} />
        <KpiCard label="Audiencia Única"       value={clientesUnicosAll}                    color="bg-brand-red"   trend={trendClientes} />
        <KpiCard label="Impacto Descuentos"  value={currency(Math.round(descuentoTotal))} color="bg-slate-400" />
        <KpiCard label="Costo por Folio"     value={precioPorNumero > 0 ? currency(Math.round(precioPorNumero)) : "—"} color="bg-teal-500" sub="Ingreso ÷ números" />
        <KpiCard label="Ratio de Selección"    value={numPromedioCompra > 0 ? numPromedioCompra.toFixed(1) : "—"}        color="bg-indigo-500" sub="Números por compra" />
      </div>

      {/* ── Tendencia boletos ── */}
      {period > 0 && trendPagados !== null && (
        <div className="bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-wrap gap-8 items-center shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${trendPagados.up ? "bg-green-50 text-green-600" : "bg-rose-50 text-brand-red"}`}>
              {trendPagados.up ? "↑" : "↓"}
            </div>
            <div>
              <p className="text-lg font-black text-slate-900 tracking-tight">{trendPagados.pct.toFixed(1)}% de variación</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Volumen de boletos vs periodo anterior</p>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-100 hidden md:block" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
            {pagadosPeriod.length} pagos actuales<br/>
            {pagadosPrev.length} pagos previos
          </p>
          <div className="ml-auto">
            <span className="text-[9px] font-black text-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-widest">
              Filtro: {periodLabel}
            </span>
          </div>
        </div>
      )}

      {/* ── Estado de boletos + Números ── */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>Estado de boletos</SectionTitle>
          <div className="space-y-8">
            {[
              { label: "Pagados",               count: pagadosAll.length,    color: "bg-green-500", textColor: "text-green-600" },
              { label: "Apartados (pendiente)", count: pendientesAll.length, color: "bg-amber-400", textColor: "text-amber-600" },
              { label: "Cancelados",            count: canceladosAll.length, color: "bg-slate-300", textColor: "text-slate-400" },
              { label: "Regalos",               count: regalosAll.length,    color: "bg-brand-red",   textColor: "text-brand-red" },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-3">
                  <span className="text-slate-400">{s.label}</span>
                  <span className={s.textColor}>{s.count} <span className="text-slate-300 font-bold ml-1">({pct(s.count, activeBoletos.length)}%)</span></span>
                </div>
                <div className="h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner">
                  <div className={`h-full ${s.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: barW(s.count, activeBoletos.length) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>{isGlobal ? "Inventario Global" : `Inventario — ${selectedRifa?.nombre}`}</SectionTitle>
          <div className="h-4 bg-slate-50 border border-slate-100 rounded-full overflow-hidden flex shadow-inner mb-8">
            <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: barW(numDisplay.vendidos, numDisplay.total) }} title="Vendidos" />
            <div className="h-full bg-amber-400 transition-all duration-1000 ease-out shadow-lg shadow-amber-200/50" style={{ width: barW(numDisplay.apartados, numDisplay.total) }} title="Apartados" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "VENDIDOS",    value: numDisplay.vendidos,    color: "text-green-600", bg: "bg-green-50/50" },
              { label: "APARTADOS",   value: numDisplay.apartados,   color: "text-amber-600", bg: "bg-amber-50/50" },
              { label: "DISPONIBLES", value: numDisplay.disponibles, color: "text-slate-400", bg: "bg-slate-50/50" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-3xl p-6 text-center border border-transparent hover:border-slate-100 transition-all`}>
                <p className={`text-2xl font-black ${s.color} mb-1`}>{s.value}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-[10px] font-bold text-slate-300 mt-2">{pct(s.value, numDisplay.total)}%</p>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Capacidad Total: <span className="text-slate-900">{numDisplay.total} números</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── Ingresos por día ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
        <div className="flex items-center justify-between mb-12">
          <SectionTitle>Actividad Diaria</SectionTitle>
          <span className="text-[9px] font-black text-slate-300 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-widest">
            {periodLabel}
          </span>
        </div>
        <div className="flex items-end gap-1.5 h-48 lg:h-64 mb-6">
          {timeSeries.map((d) => (
            <div key={d.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-3 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 shadow-xl translate-y-2 group-hover:translate-y-0">
                {currency(d.ingresos)}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
              </div>
              <div 
                className="w-full rounded-2xl bg-slate-50 border border-slate-100 hover:bg-brand-red hover:border-brand-red transition-all duration-500 shadow-sm relative overflow-hidden group/bar"
                style={{ height: `${maxIngresos > 0 ? Math.max((d.ingresos / maxIngresos) * 100, d.ingresos > 0 ? 5 : 0) : 0}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5 pt-4 border-t border-slate-50">
          {timeSeries.map((d, i) => (
            <div key={d.date} className="flex-1 text-center">
              {(i === 0 || i === Math.floor(timeSeries.length / 2) || i === timeSeries.length - 1) && (
                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{d.label}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Velocidad de ventas ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
        <SectionTitle>Velocidad y Proyecciones</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-center group hover:bg-white transition-all">
            <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-brand-red transition-colors">{velocidadBoletos.toFixed(1)}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Boleto / Día</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-center group hover:bg-white transition-all">
            <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-green-600 transition-colors">{currency(Math.round(velocidadIngresos))}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Ingresos / Día</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-center group hover:bg-white transition-all">
            <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">{currency(Math.round(proyeccionMensual))}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Proyección 30D</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-center group hover:bg-white transition-all">
            <p className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
              {currency(proyeccionRifas.reduce((s, r) => s + r.ingresoProyectado, 0))}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Potencial Bruto</p>
          </div>
        </div>
        {proyeccionRifas.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Desglose por Campaña</p>
            </div>
            <div className="overflow-hidden border border-slate-50 rounded-[2rem]">
              <table className="w-full border-collapse">
                <tbody>
                  {proyeccionRifas.map((r) => (
                    <tr key={r.nombre} className="border-b border-slate-50 hover:bg-slate-50 transition-colors last:border-0">
                      <td className="px-8 py-6">
                        <p className="text-sm font-black text-slate-900">{r.nombre}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{r.disponibles} boletos libres</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className="text-sm font-black text-slate-900">{currency(r.ingresoProyectado)}</p>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${r.dias !== null ? "text-blue-600" : "text-slate-300"}`}>
                          {r.dias !== null ? `Agotado en ~${r.dias} días` : "Ritmo indefinido"}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Calidad de revenue ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
        <SectionTitle>Salud del Revenue</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-green-600 mb-1">
              {pagadosAll.length > 0 ? `${((pagadosSinDesc.length / pagadosAll.length) * 100).toFixed(1)}%` : "—"}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Precio Full</p>
            <p className="text-[10px] font-bold text-slate-300 mt-2">{pagadosSinDesc.length} boletos</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-amber-600 mb-1">
              {pagadosAll.length > 0 ? `${((pagadosConDesc.length / pagadosAll.length) * 100).toFixed(1)}%` : "—"}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Con Descuento</p>
            <p className="text-[10px] font-bold text-slate-300 mt-2">{pagadosConDesc.length} boletos</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-brand-red mb-1">{currency(Math.round(revenuePerdido))}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue Perdido</p>
            <p className="text-[10px] font-bold text-slate-300 mt-2">{canceladosAll.length} folios</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
            <div className="flex justify-center items-end gap-2 mb-1">
              <p className="text-xl font-black text-indigo-600">{conversionConDesc.toFixed(0)}%</p>
              <span className="text-[8px] font-black text-slate-300 mb-1">VS</span>
              <p className="text-xl font-black text-slate-400">{conversionSinDesc.toFixed(0)}%</p>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Ratio Org vs Dto</p>
            <p className="text-[10px] font-bold text-slate-300 mt-2">Conversión por canal</p>
          </div>
        </div>
      </div>

      {/* ── Pareto + Distribución de tamaño ── */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>Concentración (Pareto)</SectionTitle>
          {ingresoTotal === 0
            ? <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin datos suficientes</p>
            : (
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-5xl font-black text-slate-900 tracking-tighter mb-2">{paretoDatos.top20pct.toFixed(0)}%</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                    del revenue total de las campañas<br/>
                    <span className="text-slate-900">proviene de solo {paretoDatos.top20count} clientes</span>
                  </p>
                </div>
                <div className="h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden shadow-inner flex">
                  <div className="h-full bg-brand-red rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.min(paretoDatos.top20pct, 100)}%` }} />
                </div>
                <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <span>Top 20% Contribución</span>
                  <span>Resto de la Base</span>
                </div>
              </div>
            )}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>Volumen por Transacción</SectionTitle>
          <div className="space-y-6">
            {distribucionTamano.map((bk) => (
              <HBar key={bk.label} label={bk.label} value={bk.count} max={Math.max(...distribucionTamano.map((x) => x.count), 1)} formatted={`${bk.count} boletos`} color="bg-indigo-500" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Comparación entre rifas (solo en global) ── */}
      {isGlobal && (
        <div className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
              <SectionTitle>Revenue por Campaña</SectionTitle>
              {revenueByRifa.length === 0
                ? <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin datos</p>
                : (
                  <div className="space-y-6">
                    {revenueByRifa.map((r) => (
                      <HBar key={r.name} label={r.name} value={r.total} max={revenueByRifa[0].total} formatted={currency(r.total)} color="bg-brand-red" />
                    ))}
                  </div>
                )}
            </div>
            <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
              <SectionTitle>Boleto por Campaña</SectionTitle>
              {boletosByRifa.length === 0
                ? <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin datos</p>
                : (
                  <div className="space-y-6">
                    {boletosByRifa.map((r) => (
                      <HBar key={r.name} label={r.name} value={r.count} max={boletosByRifa[0].count} formatted={`${r.count} bolls`} color="bg-blue-500" />
                    ))}
                  </div>
                )}
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm overflow-hidden">
            <SectionTitle>Ranking de Desempeño</SectionTitle>
            <div className="overflow-x-auto -mx-8 lg:-mx-12 px-8 lg:px-12">
              <table className="w-full text-left border-collapse min-w-[1200px]">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Rifa</th>
                    <th className="py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Estado</th>
                    <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Meta</th>
                    <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest text-green-600">Reales</th>
                    <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest text-brand-red">Venta</th>
                    <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest text-indigo-600">Conv.</th>
                    <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Ocupación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {rifas.map((r) => {
                    const total       = r.num_fin - r.num_inicio + 1;
                    const vend        = r.num_vendidos ?? 0;
                    const apart       = r.num_apartados ?? 0;
                    const rifaBoletos = boletos.filter((b) => b.rifa_id === r.id);
                    const rifaPagados = rifaBoletos.filter((b) => b.status === "pagado");
                    const ing         = rifaPagados.reduce((s, b) => s + b.precio_total, 0);
                    const conv        = rifaBoletos.length > 0 ? (rifaPagados.length / rifaBoletos.length) * 100 : 0;
                    const ocup        = total > 0 ? ((vend + apart) / total) * 100 : 0;
                    return (
                      <tr key={r.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-6 px-4">
                          <button 
                            onClick={() => setSelectedRifaId(r.id!)}
                            className="text-sm font-black text-slate-900 hover:text-brand-red transition-colors text-left"
                          >
                            {r.nombre}
                          </button>
                        </td>
                        <td className="py-6 px-4">
                          <StatusBadge status={r.activa ? "pagado" : "cancelado"} />
                        </td>
                        <td className="py-6 px-4 text-center font-bold text-slate-400">{total}</td>
                        <td className="py-6 px-4 text-center font-black text-green-600">{vend}</td>
                        <td className="py-6 px-4 text-center font-black text-brand-red">{currency(ing)}</td>
                        <td className="py-6 px-4 text-center">
                          <span className={`text-[11px] font-black ${conv >= 50 ? "text-green-600" : conv >= 25 ? "text-amber-500" : "text-brand-red"}`}>
                            {conv.toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-3 justify-center min-w-[120px]">
                            <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                              <div className="h-full bg-slate-900 group-hover:bg-brand-red transition-all duration-500" style={{ width: `${ocup}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-slate-900 w-8">{ocup.toFixed(0)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Top clientes + Estado ── */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>Elite de Compradores (Top 10)</SectionTitle>
          {topClientes.length === 0
            ? <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin registros</p>
            : (
              <div className="space-y-6">
                {topClientes.map((c, i) => (
                  <div key={c.celular || c.nombre} className="flex items-center gap-4 group">
                    <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black flex-shrink-0 transition-colors ${i < 3 ? "bg-slate-900 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100"}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black text-slate-900 truncate">{c.nombre || "Sin Nombre"}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">{c.celular} · {c.boletos} números</p>
                    </div>
                    <p className="font-black text-sm text-slate-900 flex-shrink-0">{currency(c.total)}</p>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>Distribución Regional</SectionTitle>
          {byEstado.length === 0
            ? <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin datos geográficos</p>
            : (
              <div className="space-y-6">
                {byEstado.map((e) => (
                  <div key={e.estado}>
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{e.estado || "Desconocido"}</p>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{currency(Math.round(e.revenue))} <span className="text-slate-300 ml-1">({e.count})</span></p>
                    </div>
                    <div className="h-1.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-slate-900 opacity-20" style={{ width: barW(e.count, byEstado[0].count) }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* ── Horas pico + Días de semana ── */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>Peak Performance (Horas)</SectionTitle>
          {horasPico.length === 0
            ? <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin actividad</p>
            : (
              <div className="space-y-6">
                {horasPico.map((h) => (
                  <HBar key={h.h} label={`${String(h.h).padStart(2, "0")}:00`} value={h.count} max={horasPico[0].count} formatted={`${h.count} bolls`} color="bg-teal-500" />
                ))}
              </div>
            )}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
          <SectionTitle>Distribución Semanal</SectionTitle>
          <div className="space-y-6">
            {diasSemana.map((d) => (
              <HBar key={d.dia} label={d.dia} value={d.count} max={Math.max(...diasSemana.map((x) => x.count), 1)} formatted={`${d.count} bolls`} color="bg-violet-500" />
            ))}
          </div>
        </div>
      </div>

      {/* ── Rangos + Números populares ── */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-100 dark:border-slate-700 p-6">
          <SectionTitle>Rangos de números populares</SectionTitle>
          {rangosNumeros.length === 0
            ? <p className="text-sm text-slate-400">Sin datos aún.</p>
            : (
              <div className="space-y-2">
                {rangosNumeros.map((r) => (
                  <HBar key={r.label} label={r.label} value={r.count} max={Math.max(...rangosNumeros.map((x) => x.count), 1)} formatted={`${r.count} veces`} color="bg-rose-500" />
                ))}
              </div>
            )}
          <p className="text-xs text-slate-400 mt-3">Distribución macro (todo el tiempo)</p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow border border-slate-100 dark:border-slate-700 p-6">
          <SectionTitle>Números más populares (top 20)</SectionTitle>
          {popularNumbers.length === 0
            ? <p className="text-sm text-slate-400">Sin datos aún.</p>
            : (
              <div className="flex flex-wrap gap-2">
                {popularNumbers.map((p, i) => (
                  <div key={p.n} className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 ${i < 3 ? "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800" : "bg-slate-50 dark:bg-slate-700"}`}>
                    <span className={`font-black text-lg ${i < 3 ? "text-red-700 dark:text-red-400" : ""}`}>{p.n}</span>
                    <span className="text-xs text-slate-400">{p.count}x</span>
                  </div>
                ))}
              </div>
            )}
        </div>
      </div>

      {/* ── Retención de clientes ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
        <SectionTitle>Lealtad y Retención</SectionTitle>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-indigo-600 mb-1">{clientesRecurrentes.recurrentes.length}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Recurrentes</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-slate-400 mb-1">{clientesRecurrentes.totalClientes - clientesRecurrentes.recurrentes.length}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nuevos</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
            <p className="text-3xl font-black text-green-600 mb-1">
              {clientesRecurrentes.totalClientes > 0 ? `${((clientesRecurrentes.recurrentes.length / clientesRecurrentes.totalClientes) * 100).toFixed(1)}%` : "0%"}
            </p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tasa de Retención</p>
          </div>
        </div>
        
        {clientesRecurrentes.recurrentes.length > 0 && (
          <div className="space-y-4">
             <div className="flex items-center gap-3 px-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Seguidores Fieles</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {clientesRecurrentes.recurrentes.slice(0, 8).map((c) => (
                  <div key={c.nombre} className="bg-slate-50/50 border border-slate-100 rounded-[1.5rem] p-4 flex flex-col justify-center">
                    <p className="text-xs font-black text-slate-900 truncate mb-1">{c.nombre || "—"}</p>
                    <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">
                       {c.rifas} Campañas
                    </p>
                  </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Códigos de descuento ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm">
        <SectionTitle>Eficiencia de Promociones</SectionTitle>
        {discountUsage.length === 0
          ? <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Sin cupones aplicados</p>
          : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                 {discountUsage.slice(0, 3).map((d) => (
                    <div key={d.codigo} className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center">
                       <p className="font-black text-slate-900 mb-1">{d.codigo}</p>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{d.usos} USOS</p>
                       <p className="text-[11px] font-black text-green-600 mt-2">-{currency(Math.round(d.ahorro))}</p>
                    </div>
                 ))}
              </div>
              <div className="space-y-6">
                {discountUsage.map((d) => (
                  <HBar key={d.codigo} label={d.codigo} value={d.usos} max={discountUsage[0].usos} formatted={`${d.usos} usos`} color="bg-amber-400" />
                ))}
              </div>
              <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión en Marketing (Dtos)</p>
                <p className="text-xl font-black text-slate-900">{currency(Math.round(discountUsage.reduce((s, d) => s + d.ahorro, 0)))}</p>
              </div>
            </div>
          )}
      </div>

      {/* ── Actividad reciente ── */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 lg:p-12 shadow-sm overflow-hidden">
        <SectionTitle>Timeline de Operaciones</SectionTitle>
        <div className="overflow-x-auto -mx-8 lg:-mx-12 px-8 lg:px-12">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Folio</th>
                <th className="py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Cliente</th>
                <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Refs</th>
                <th className="py-6 px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Campaña</th>
                <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Monto</th>
                <th className="py-6 px-4 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Status</th>
                <th className="py-6 px-4 text-right text-[10px] font-black text-slate-300 uppercase tracking-widest">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBoletos.map((b) => {
                const rifaNombre = rifaMap.get(b.rifa_id)?.nombre ?? "—";
                const fecha = b.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ?? "—";
                return (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-6 px-4 font-mono font-black text-xs text-brand-red">{b.folio}</td>
                    <td className="py-6 px-4 pr-10">
                      <p className="text-sm font-black text-slate-900 truncate max-w-[200px]">{b.nombre} {b.apellidos}</p>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">{b.numeros.length}</span>
                    </td>
                    <td className="py-6 px-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[150px]">{rifaNombre}</p>
                    </td>
                    <td className="py-6 px-4 text-center font-black text-slate-900">{currency(b.precio_total)}</td>
                    <td className="py-6 px-4">
                      <div className="flex justify-center">
                        <StatusBadge status={b.status} />
                      </div>
                    </td>
                    <td className="py-6 px-4 text-right">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{fecha}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
