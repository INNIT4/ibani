"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  getBoletosPaginados, getRifas, Boleto, Rifa,
  cancelApartado, revertPagadoToApartado, cancelPagado, markBoletoPagadoConNumeros,
} from "@/lib/firestore";
import { 
  ArrowRight, 
  AlertTriangle, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Trash2,
  Wrench,
  Hash,
  User,
  Ticket
} from "lucide-react";

type ServiceType = "apartado-pagado" | "apartado-disponible" | "pagado-apartado" | "pagado-disponible";

const SERVICES: { 
  id: ServiceType; 
  label: string; 
  from: string; 
  to: string; 
  fromColor: string; 
  toColor: string; 
  desc: string; 
  filterStatus: "pendiente" | "pagado";
  icon: any;
  accent: string;
}[] = [
  {
    id: "apartado-pagado",
    label: "Validar Pago de Apartado",
    from: "Pendiente",
    to: "Pagado",
    fromColor: "bg-amber-50 text-amber-600 border-amber-100",
    toColor: "bg-green-50 text-green-600 border-green-100",
    desc: "Confirma el pago de un boleto pendiente. Los números pasan de apartados a vendidos.",
    filterStatus: "pendiente",
    icon: CheckCircle2,
    accent: "green"
  },
  {
    id: "apartado-disponible",
    label: "Liberar Boletos Apartados",
    from: "Pendiente",
    to: "Libre",
    fromColor: "bg-amber-50 text-amber-600 border-amber-100",
    toColor: "bg-slate-50 text-slate-400 border-slate-100",
    desc: "Cancela un boleto pendiente de pago y libera sus números para volver a seleccionarse.",
    filterStatus: "pendiente",
    icon: Trash2,
    accent: "rose"
  },
  {
    id: "pagado-apartado",
    label: "Retroceder a Pendiente",
    from: "Pagado",
    to: "Pendiente",
    fromColor: "bg-green-50 text-green-600 border-green-100",
    toColor: "bg-amber-50 text-amber-600 border-amber-100",
    desc: "Revierte un boleto confirmado de vuelta a pendiente. Los números pasan a apartados.",
    filterStatus: "pagado",
    icon: RefreshCcw,
    accent: "indigo"
  },
  {
    id: "pagado-disponible",
    label: "Anulación Total de Venta",
    from: "Pagado",
    to: "Libre",
    fromColor: "bg-green-50 text-green-600 border-green-100",
    toColor: "bg-slate-50 text-slate-400 border-slate-100",
    desc: "Cancela completamente un boleto pagado y libera sus números como disponibles.",
    filterStatus: "pagado",
    icon: XCircle,
    accent: "slate"
  },
];

export default function ServiciosPage() {
  const [boletos, setBoletos] = useState<Boleto[]>([]);
  const [rifaMap, setRifaMap] = useState<Map<string, Rifa>>(new Map());
  const [activeTab, setActiveTab] = useState<ServiceType>("apartado-pagado");
  const [filterRifa, setFilterRifa] = useState("");
  const [search, setSearch] = useState("");
  const [processing, setProcessing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [rifas, setRifas] = useState<Rifa[]>([]);

  const rifasLoaded = useRef(false);
  const lastLoadedStatus = useRef<string | null>(null);

  async function loadForStatus(status: "pendiente" | "pagado") {
    setLoading(true);
    try {
      const { boletos: bs } = await getBoletosPaginados({ status, pageSize: 9999, loadAll: true });
      setBoletos(bs);
      if (!rifasLoaded.current) {
        const rs = await getRifas();
        setRifas(rs);
        setRifaMap(new Map(rs.map((r) => [r.id!, r])));
        rifasLoaded.current = true;
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const s = SERVICES.find((s) => s.id === activeTab)!;
    if (s.filterStatus === lastLoadedStatus.current) return;
    lastLoadedStatus.current = s.filterStatus;
    loadForStatus(s.filterStatus);
  }, [activeTab]);

  const service = SERVICES.find((s) => s.id === activeTab)!;

  const filtered = useMemo(() => {
    return boletos.filter((b) => {
      if (b.status !== service.filterStatus) return false;
      if (filterRifa && b.rifa_id !== filterRifa) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.folio.toLowerCase().includes(q) &&
          !b.nombre.toLowerCase().includes(q) &&
          !b.apellidos.toLowerCase().includes(q) &&
          !b.celular.includes(q)
        ) return false;
      }
      return true;
    });
  }, [boletos, service.filterStatus, filterRifa, search]);

  async function handleAction(boleto: Boleto) {
    const confirmMsg =
      activeTab === "apartado-pagado"
        ? `¿Confirmar pago del folio ${boleto.folio}?`
        : activeTab === "apartado-disponible"
        ? `¿Cancelar apartado del folio ${boleto.folio} y liberar sus números?`
        : activeTab === "pagado-apartado"
        ? `¿Revertir el folio ${boleto.folio} de Pagado a Apartado?`
        : `¿Cancelar completamente el folio ${boleto.folio} y liberar sus números como disponibles?`;

    if (!confirm(confirmMsg)) return;

    setProcessing(boleto.id!);
    try {
      if (activeTab === "apartado-pagado") {
        await markBoletoPagadoConNumeros({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
      } else if (activeTab === "apartado-disponible") {
        await cancelApartado({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
      } else if (activeTab === "pagado-apartado") {
        await revertPagadoToApartado({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
      } else {
        await cancelPagado({ id: boleto.id!, rifa_id: boleto.rifa_id, numeros: boleto.numeros });
      }
      await loadForStatus(service.filterStatus);
    } catch {
      alert("Error al procesar la acción. Intenta de nuevo.");
    }
    setProcessing(null);
  }

  const actionLabel: Record<ServiceType, string> = {
    "apartado-pagado": "Aprobar Venta",
    "apartado-disponible": "Anular Apartado",
    "pagado-apartado": "Regresar a Pendiente",
    "pagado-disponible": "Inhabilitar Venta",
  };

  const actionColor: Record<ServiceType, string> = {
    "apartado-pagado": "bg-slate-900 hover:bg-slate-800 shadow-slate-200",
    "apartado-disponible": "bg-slate-900 hover:bg-slate-800 shadow-slate-200",
    "pagado-apartado": "bg-slate-900 hover:bg-slate-800 shadow-slate-200",
    "pagado-disponible": "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4" />
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Cargando Procesos...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 leading-none">Ingeniería de Estados</h1>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
            Modificación estructural de participaciones e inventario
          </p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
          <Wrench size={24} />
        </div>
      </div>

      {/* Warning Area */}
      <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] p-8 mb-16 flex flex-col md:flex-row items-center gap-8 shadow-sm">
         <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0">
            <AlertTriangle size={28} strokeWidth={2.5} />
         </div>
         <div className="text-center md:text-left">
            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest mb-1">Zona de Modificación Permanente</h3>
            <p className="text-xs font-bold text-indigo-700/70 leading-relaxed uppercase tracking-wider">
              Estas herramientas alteran directamente la base de datos de folios e inventario de números. 
              Toda acción aquí es irreversible y afecta la disponibilidad pública.
            </p>
         </div>
      </div>

      {/* Tool Selection Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const isActive = activeTab === s.id;
          return (
            <button
              key={s.id}
              onClick={() => { setActiveTab(s.id); setSearch(""); setFilterRifa(""); }}
              className={`group relative text-left p-8 rounded-[2.5rem] border transition-all duration-500 overflow-hidden ${
                isActive
                  ? "border-slate-900 bg-slate-900 text-white shadow-2xl shadow-indigo-200"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-100"
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className={`p-4 rounded-2xl transition-all duration-500 ${isActive ? "bg-white/10 text-white" : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900"}`}>
                  <Icon size={24} strokeWidth={isActive ? 3 : 2} />
                </div>
                <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border transition-colors ${isActive ? "border-white/20 text-white/50" : "border-slate-50 text-slate-300"}`}>
                  Tool {s.id.split('-')[0].charAt(0).toUpperCase()}{s.id.split('-')[1].charAt(0).toUpperCase()}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 opacity-70">
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${isActive ? "border-white/20 text-white/70 bg-white/5" : s.fromColor}`}>{s.from}</span>
                <ArrowRight size={10} strokeWidth={3} className={isActive ? "text-white/40" : "text-slate-200"} />
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${isActive ? "border-white/20 text-white/70 bg-white/5" : s.toColor}`}>{s.to}</span>
              </div>
              
              <h3 className={`font-black text-sm mb-3 tracking-tight ${isActive ? "text-white" : "text-slate-900"}`}>
                {s.label}
              </h3>
              <p className={`text-[10px] font-bold leading-relaxed tracking-wider uppercase ${isActive ? "text-white/40" : "text-slate-400"}`}>
                {s.desc}
              </p>
              
              {isActive && (
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full blur-2xl" />
              )}
            </button>
          )
        })}
      </div>

      {/* Control Area */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 p-10 mb-10 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative group flex-1">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
                <Search size={22} strokeWidth={3} />
             </div>
             <input
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               placeholder="Busqueda activa de participaciones..."
               className="w-full h-16 rounded-[1.5rem] border border-slate-50 bg-slate-50 pl-16 pr-6 text-sm font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all placeholder:text-slate-200"
             />
          </div>
          <div className="relative group min-w-[280px]">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors pointer-events-none">
              <Filter size={18} strokeWidth={3} />
            </div>
            <select
              value={filterRifa}
              onChange={(e) => setFilterRifa(e.target.value)}
              className="w-full h-16 rounded-[1.5rem] border border-slate-50 bg-slate-50 pl-14 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-500/5 focus:border-slate-300 focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">Rifas: Mostrar Todas</option>
              {rifas.map((r) => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Identificación</th>
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Campaña Origen</th>
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Participante</th>
                <th className="px-8 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Números</th>
                <th className="px-8 py-6 text-center text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Capital</th>
                <th className="px-10 py-6 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Operativo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono font-black text-slate-900 text-base tracking-widest">{b.folio}</span>
                      <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Verificado</span>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400">
                        <Ticket size={14} />
                      </div>
                      <p className="font-black text-slate-900 tracking-tight text-sm truncate max-w-[180px]">
                        {rifaMap.get(b.rifa_id)?.nombre ?? "Campaña General"}
                      </p>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                        <User size={14} />
                      </div>
                      <div className="flex flex-col">
                        <p className="font-black text-slate-900 leading-none text-sm tracking-tight">{b.nombre} {b.apellidos}</p>
                        <p className="text-[11px] font-bold text-slate-400 mt-1 font-mono">{b.celular}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex flex-wrap gap-1 max-w-[160px]">
                       {b.numeros.slice(0, 4).map(n => (
                         <span key={n} className="text-[9px] font-black text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded-md">
                           {n}
                         </span>
                       ))}
                       {b.numeros.length > 4 && <span className="text-[9px] font-black text-indigo-400">+{b.numeros.length - 4}</span>}
                    </div>
                  </td>
                  <td className="px-8 py-8 text-center">
                    <span className="font-black text-slate-900 text-base leading-none tracking-tighter">
                      ${b.precio_total.toLocaleString()} <span className="text-[9px] text-slate-300 ml-0.5">MXN</span>
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button
                      onClick={() => handleAction(b)}
                      disabled={processing === b.id}
                      className={`h-11 px-8 text-[11px] font-black uppercase tracking-widest text-white rounded-2xl transition-all shadow-xl disabled:opacity-30 ${actionColor[activeTab]}`}
                    >
                      {processing === b.id ? (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>EJECUTANDO</span>
                        </div>
                      ) : (
                        actionLabel[activeTab]
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && (
          <div className="py-40 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Hash size={32} className="text-slate-200" />
            </div>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-3">Sin registros activos</p>
            <p className="text-sm font-bold text-slate-400 tracking-tight">No se encontraron tickets con el estado seleccionado</p>
          </div>
        )}
      </div>
    </div>
  );
}
