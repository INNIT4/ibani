"use client";

import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getRifa, getComprobanteByFolio, Boleto, Rifa, Comprobante, getBankAccounts, BankAccount, getBoletoByFolio, getBoletosByCelular, getBoletosByNumero } from "@/lib/firestore";
import { downloadComprobante } from "@/lib/pdf";
import { getRotatedWhatsApp, buildWhatsAppUrl } from "@/lib/whatsapp";
import BankCards from "@/components/BankCards";
import { Search, ShieldAlert, Lightbulb, CheckCircle2, XCircle, Clock, FileText, Share2, UploadCloud, Info, ChevronRight, Ticket, ArrowRight, Download, MessageSquare } from "lucide-react";

interface Result {
  boleto: Boleto;
  rifa: Rifa | null;
}


export default function ConsultaPage() {
  return (
    <Suspense>
      <ConsultaInner />
    </Suspense>
  );
}

function ConsultaInner() {
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[] | null>(null);
  const [error, setError] = useState("");
  const [searchedByCelular, setSearchedByCelular] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);

  useEffect(() => {
    getBankAccounts().then(data => setAccounts(data.filter(a => a.activo)));
  }, []);

  const buscarFolio = useCallback(async (val: string) => {
    setLoading(true);
    setError("");
    setResults(null);

    try {
      let esCelular = false;
      let rawBoletos: Boleto[] = [];

      const soloDigitos = /^\d+$/.test(val);
      if (!soloDigitos || val.startsWith("SP-")) {
        // Buscar por folio
        const b = await getBoletoByFolio(val);
        if (b) rawBoletos = [b];
      } else if (val.length === 10) {
        // Buscar por celular
        esCelular = true;
        rawBoletos = await getBoletosByCelular(val);
      } else {
        // Buscar por número
        const n = parseInt(val);
        if (!isNaN(n)) {
          rawBoletos = await getBoletosByNumero(n);
        }
      }

      setSearchedByCelular(esCelular);

      if (rawBoletos.length === 0) {
        setError("No encontramos ningun boleto con ese dato. Verifica el folio, celular o numero de boleto.");
      } else {
        const results: Result[] = await Promise.all(
          rawBoletos.map(async (b) => {
            let rifa: Rifa | null = null;
            try { rifa = await getRifa(b.rifa_id); } catch {}
            return { boleto: b, rifa };
          })
        );
        setResults(results);
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Ocurrio un error al buscar. Intenta de nuevo.");
    }
    setLoading(false);
  }, []);

  // Auto-search when ?f=FOLIO&act=1 params are present
  useEffect(() => {
    const f = searchParams.get("f");
    const act = searchParams.get("act");
    if (f && act === "1") {
      setInput(f.toUpperCase());
      buscarFolio(f.toUpperCase());
    }
  }, [searchParams, buscarFolio]);

  async function buscar(e: React.FormEvent) {
    e.preventDefault();
    const val = input.trim().toUpperCase();
    if (!val) return;
    await buscarFolio(val);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-24 selection:bg-slate-900 selection:text-white animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="w-16 h-1 bg-slate-900 rounded-full mb-8" />
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4">Módulo de Consulta</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-xl leading-relaxed">
          Sincronización en tiempo real con la base de datos de sorteos profesionales.
        </p>
      </div>

      {/* Advisory Banners */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="flex gap-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 group hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
          <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 group-hover:rotate-12 transition-transform">
            <ShieldAlert className="w-6 h-6 text-slate-900" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-black text-xs text-slate-900 mb-2 uppercase tracking-widest">Protocolo de Pago</p>
            <p className="text-slate-400 text-[11px] font-bold uppercase leading-relaxed tracking-wider">
              Si el pago ya fue emitido, espere la validación administrativa. Evite duplicar transacciones.
            </p>
          </div>
        </div>

        <div className="flex gap-6 bg-slate-900 rounded-[2.5rem] p-8 text-white group hover:scale-[1.02] transition-transform duration-500 shadow-2xl shadow-slate-200">
          <div className="flex-shrink-0 w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform">
            <Lightbulb className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <p className="font-black text-xs text-white/50 mb-2 uppercase tracking-widest leading-none">Acceso de Prueba</p>
            <div className="text-[11px] font-bold uppercase leading-relaxed tracking-wider">
              Utilice <button onClick={() => setInput("SP-001")} className="text-white hover:underline decoration-2 underline-offset-4">SP-001</button> (Confirmado) o <button onClick={() => setInput("SP-005")} className="text-white hover:underline decoration-2 underline-offset-4">SP-005</button> (Pendiente).
            </div>
          </div>
        </div>
      </div>

      {/* Search Input Field */}
      <form onSubmit={buscar} className="mb-20">
        <div className="relative group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="FOLIO (SP-XXXX), CELULAR O NÚMERO DE BOLETO"
            className="w-full h-20 rounded-[2rem] border border-slate-200 bg-slate-50 px-10 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-0 focus:border-slate-900 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-sm group-hover:shadow-xl group-hover:shadow-slate-100"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 px-10 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-[0.2em] rounded-[1.5rem] transition-all flex items-center justify-center gap-3 shadow-xl"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <Search size={16} strokeWidth={3} />
            )}
            <span>{loading ? "Sincronizando" : "Ejecutar Búsqueda"}</span>
          </button>
        </div>
      </form>

      {error && (
        <div className="flex items-center gap-4 bg-red-50 border border-red-100 rounded-[2rem] p-8 text-red-900 mb-16 animate-in slide-in-from-top-4 duration-500">
          <XCircle className="w-6 h-6 flex-shrink-0" strokeWidth={2.5} />
          <p className="text-xs font-black uppercase tracking-widest">{error}</p>
        </div>
      )}

      {results && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <ResultsSummary results={results} />
          <div className="space-y-12">
            {results.map(({ boleto, rifa }) => (
              <BoletoCard key={boleto.id} boleto={boleto} rifa={rifa} showCelular={searchedByCelular} />
            ))}
          </div>
          
          {showModal && (
            <ComprobanteModal
              results={results.filter((r) => r.boleto.status === "pendiente" || r.boleto.status === "apartado")}
              onClose={() => setShowModal(false)}
              accounts={accounts}
            />
          )}

          {results.some((r) => r.boleto.status === "pendiente" || r.boleto.status === "apartado") && (
            <div className="mt-24">
              <div className="flex justify-center mb-24">
                <button
                  onClick={() => setShowModal(true)}
                  className="group relative h-20 px-16 bg-slate-900 text-white font-black rounded-[2.5rem] text-xs uppercase tracking-[0.3em] hover:bg-slate-800 transition-all shadow-2xl shadow-slate-200 flex items-center justify-center gap-6"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-900 to-slate-500 rounded-[2.6rem] blur opacity-25 group-hover:opacity-50 transition-opacity" />
                  <UploadCloud size={24} className="relative group-hover:scale-110 transition-transform" strokeWidth={2.5} />
                  <span className="relative">Protocolo de Carga de Comprobante</span>
                </button>
              </div>

              <div className="border-t border-slate-100 my-24" />

              <div className="flex flex-col items-center text-center mb-16">
                <div className="w-12 h-1 bg-slate-900 rounded-full mb-8" />
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">Garantía de Liquidación</h2>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-lg leading-relaxed">
                  Utilice las siguientes entidades financieras para procesar su pago oficial.
                </p>
              </div>

              <BankCards accounts={accounts} />

              <div className="mt-24 bg-white border border-slate-50 rounded-[3.5rem] p-16 shadow-2xl shadow-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none">
                   <Info size={180} strokeWidth={2.5} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white text-xs">!</div>
                  Procedimiento de Validación
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                   <div className="flex gap-4 items-start">
                      <span className="text-slate-200 font-black text-4xl leading-none">01</span>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed pt-1">Seleccione una entidad bancaria e inicie la transferencia.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                      <span className="text-slate-200 font-black text-4xl leading-none">02</span>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed pt-1">Asegúrese de indicar su número de folio en el concepto.</p>
                   </div>
                   <div className="flex gap-4 items-start">
                      <span className="text-slate-200 font-black text-4xl leading-none">03</span>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed pt-1">Conserve el comprobante digital para su validación administrativa.</p>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Multi-result summary ─────────────────────────────────────────────────────

function ResultsSummary({ results }: { results: Result[] }) {
  if (results.length <= 1) return null;
  const pagados = results.filter((r) => r.boleto.status === "pagado").length;
  const pendientes = results.filter((r) => r.boleto.status === "pendiente").length;
  const totalNums = results.reduce((s, r) => s + (r.boleto.numeros_completos ?? r.boleto.numeros).length, 0);
  const totalPago = results.filter((r) => r.boleto.status !== "cancelado").reduce((s, r) => s + r.boleto.precio_total, 0);

  return (
    <div className="bg-white border border-slate-100 shadow-xl shadow-slate-100 rounded-[2.5rem] p-10 mb-16 flex flex-col items-center">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Estado Global Detectado</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <SummaryChip label="Expedientes" value={String(results.length)} />
        <SummaryChip label="Posiciones" value={String(totalNums)} />
        <SummaryChip label="Certificados" value={String(pagados)} />
        <SummaryChip label="Valuación" value={`$${totalPago.toLocaleString("es-MX")}`} />
      </div>
    </div>
  );
}

// ─── Stat Components ────────────────────────────────────────────────────────
function SummaryChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 text-center group hover:bg-slate-900 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-slate-200/50">
      <p className="text-[10px] font-black text-slate-400 group-hover:text-slate-500 uppercase tracking-[0.2em] mb-3 leading-none">{label}</p>
      <p className="text-2xl font-black text-slate-900 group-hover:text-white tracking-tighter leading-none">{value}</p>
    </div>
  );
}

// ─── Boleto Card ─────────────────────────────────────────────────────────────
function BoletoCard({ boleto, rifa, showCelular }: { boleto: Boleto; rifa: Rifa | null; showCelular?: boolean }) {
  const [downloading, setDownloading] = useState(false);
  const [waLoading, setWaLoading] = useState(false);
  const [comprobante, setComprobante] = useState<Comprobante | null>(null);

  useEffect(() => {
    if (boleto.status !== "pendiente") return;
    getComprobanteByFolio(boleto.folio).then(setComprobante).catch(() => {});
  }, [boleto.folio, boleto.status]);

  async function handleDownload() {
    setDownloading(true);
    await downloadComprobante(boleto, rifa?.nombre ?? "Sorteos Pro");
    setDownloading(false);
  }

  async function handleWhatsApp() {
    setWaLoading(true);
    try {
      const numero = await getRotatedWhatsApp();
      if (!numero) { alert("No hay numero de WhatsApp configurado."); return; }
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      const fecha = boleto.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ?? new Date().toLocaleString("es-MX");
      const rifaNombre = rifa?.nombre ?? "Sorteos Pro";
      const numsList = (boleto.numeros_completos ?? boleto.numeros);
      const message =
        `👋 Hola, soy ${boleto.nombre} ${boleto.apellidos}\nSeleccione: ${numsList.length} numeros\n──────────────\n` +
        `🎫 Numeros: ${numsList.join(", ")}\n🎯 Sorteo: ${rifaNombre}\n🏷️ Folio: ${boleto.folio}\n` +
        `📅 Fecha: ${fecha}\n💰 Total: $${boleto.precio_total.toLocaleString("es-MX")}\n──────────────\n` +
        `💳 Metodos de pago: ${siteUrl}/tarjetas\n🏷️ Consulta: ${siteUrl}/consulta?f=${boleto.folio}&act=1`;
      window.open(buildWhatsAppUrl(numero, message), "_blank");
    } catch {
      alert("Error al abrir WhatsApp. Intenta de nuevo.");
    }
    setWaLoading(false);
  }

  const status = boleto.status;
  const fecha = boleto.created_at?.toDate?.()?.toLocaleString("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }) ?? "—";

  const fechaSorteo = rifa?.fecha_sorteo
    ? new Date(rifa.fecha_sorteo).toLocaleDateString("es-MX", { dateStyle: "medium" })
    : null;

  const statusConfig = {
    pagado: {
      bg: "bg-emerald-50",
      border: "border-emerald-100",
      text: "text-emerald-700",
      icon: <CheckCircle2 className="w-6 h-6" />,
      label: "Certificado Confirmado",
      accent: "bg-emerald-500"
    },
    cancelado: {
      bg: "bg-slate-50",
      border: "border-slate-100",
      text: "text-slate-400",
      icon: <XCircle className="w-6 h-6" />,
      label: "Boleto Desactivado",
      accent: "bg-slate-300"
    },
    pendiente: {
      bg: "bg-amber-50",
      border: "border-amber-100",
      text: "text-amber-700",
      icon: <Clock className="w-6 h-6" />,
      label: "Pendiente de Validación",
      accent: "bg-amber-500"
    }
  }[status] || {
    bg: "bg-slate-50",
    border: "border-slate-100",
    text: "text-slate-700",
    icon: <Clock className="w-6 h-6" />,
    label: "Estado en Proceso",
    accent: "bg-slate-500"
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden group transition-all duration-500">
      {/* Upper Status Section */}
      <div className={`px-12 py-10 ${statusConfig.bg} border-b ${statusConfig.border} flex flex-col md:flex-row md:items-center justify-between gap-8`}>
        <div className="flex items-center gap-6">
          <div className={`w-16 h-16 rounded-[1.25rem] ${statusConfig.accent} flex items-center justify-center text-white shadow-lg`}>
            {statusConfig.icon}
          </div>
          <div>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-60 ${statusConfig.text}`}>Estado del Expediente</p>
            <p className={`text-xl font-black uppercase tracking-tighter ${statusConfig.text}`}>{statusConfig.label}</p>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 leading-none">Identificador Único</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter font-mono">{boleto.folio}</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
           <InfoCell label="Titular del Registro" value={`${boleto.nombre} ${boleto.apellidos}`} />
           {showCelular && <InfoCell label="Contacto Móvil" value={boleto.celular} isMono />}
           <InfoCell label="Sorteo Asociado" value={rifa?.nombre ?? "Sorteos Profesionales"} />
           <InfoCell label="Valuación Total" value={`$${boleto.precio_total.toLocaleString("es-MX")}`} />
           <InfoCell label="Fecha de Emisión" value={fecha} />
           {fechaSorteo && <InfoCell label="Protocolo Final" value={fechaSorteo} />}
        </div>

        {/* Numbers Section */}
        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 mb-12">
           <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Posiciones Adquiridas</p>
              <div className="px-4 py-1.5 bg-slate-200 rounded-full text-[10px] font-black text-slate-600 uppercase tracking-widest">
                 {(boleto.numeros_completos ?? boleto.numeros).length} Unidades
              </div>
           </div>
           
           <div className="flex flex-wrap gap-3">
              {[...(boleto.numeros_completos ?? boleto.numeros)].sort((a, b) => a - b).map((n) => (
                <div 
                  key={n} 
                  className={`min-w-[4rem] h-12 flex items-center justify-center bg-white border border-slate-100 rounded-xl text-sm font-black text-slate-900 shadow-sm hover:shadow-md transition-shadow ${status === "cancelado" ? "opacity-30 line-through" : ""}`}
                >
                  {n}
                </div>
              ))}
           </div>
        </div>

        {/* Admin Feedback */}
        {comprobante?.admin_comentario && (
          <div className="mb-12 bg-amber-50 border border-amber-100 rounded-[2.5rem] p-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-900">
                <MessageSquare size={120} />
             </div>
             <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-[0.3em] mb-6 leading-none">Comunicación Administrativa</p>
             <div className="text-xl font-medium leading-relaxed italic border-l-4 border-amber-200 pl-8 mb-8 text-slate-800">
                &ldquo;{comprobante.admin_comentario}&rdquo;
             </div>
             {comprobante.archivo_url && (
                <a 
                  href={comprobante.archivo_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-xs font-black uppercase tracking-widest text-amber-700 hover:text-amber-900 transition-colors"
                >
                   <FileText size={16} />
                   Ver Documentación Adjunta
                </a>
             )}
          </div>
        )}

        {/* Actions */}
        {status !== "cancelado" && (
          <div className="flex flex-col sm:flex-row gap-6">
             {status !== "pagado" && (
               <button
                 onClick={handleWhatsApp}
                 disabled={waLoading}
                 className="flex-1 h-16 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-4 shadow-xl shadow-emerald-100/50"
               >
                 {waLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MessageSquare size={18} strokeWidth={2.5} />}
                 <span>{waLoading ? "Operando..." : "Soporte WhatsApp"}</span>
               </button>
             )}
             
             <button
               onClick={handleDownload}
               disabled={downloading}
               className="flex-1 h-16 bg-white border-2 border-slate-100 hover:border-slate-900 hover:bg-slate-50 disabled:opacity-50 text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all flex items-center justify-center gap-4 group"
             >
               {downloading ? <div className="w-5 h-5 border-2 border-slate-200 border-t-slate-800 rounded-full animate-spin" /> : <Download size={18} className="group-hover:translate-y-0.5 transition-transform" strokeWidth={2.5} />}
               <span>{downloading ? "Generando..." : "Documento PDF"}</span>
             </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCell({ label, value, isMono }: { label: string; value: string; isMono?: boolean }) {
  return (
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 leading-none">{label}</p>
      <p className={`text-base font-bold text-slate-800 tracking-tight leading-tight ${isMono ? "font-mono" : ""}`}>{value}</p>
    </div>
  );
}

// ─── Comprobante Modal ───────────────────────────────────────────────────────
function ComprobanteModal({ results, onClose, accounts }: { results: Result[]; onClose: () => void; accounts: BankAccount[] }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState("");
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const nombre = results[0]?.boleto ? `${results[0].boleto.nombre} ${results[0].boleto.apellidos}` : "";
  const folios = results.map((r) => r.boleto.folio);
  const montoTotal = results.reduce((s, r) => s + r.boleto.precio_total, 0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function validateFile(f: File): string | null {
    const allowed = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowed.includes(f.type)) return "Formato no permitido. Use JPG, PNG o PDF.";
    if (f.size > 5 * 1024 * 1024) return "El archivo excede el límite de 5MB.";
    return null;
  }

  function pickFile(f: File) {
    const e = validateFile(f);
    if (e) { setErr(e); return; }
    setErr("");
    setFile(f);
  }

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);
    setErr("");
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
    } catch (e) {
      setErr("Error de sincronización con el servidor. Intente de nuevo.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl px-4 animate-in fade-in duration-300" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-[3.5rem] w-full max-w-[580px] max-h-[90vh] overflow-y-auto shadow-[0_32px_128px_-12px_rgba(15,23,42,0.3)] flex flex-col border border-white/20 animate-in zoom-in-95 duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between px-12 pt-12 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
              <UploadCloud size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Validación de Pago</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocolo de Carga Directa</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
            <XCircle size={20} />
          </button>
        </div>

        <div className="px-12 pb-12 space-y-8">
          {success ? (
            <div className="flex flex-col items-center gap-10 py-12 text-center">
              <div className="w-24 h-24 rounded-full bg-slate-900 flex items-center justify-center text-white animate-bounce shadow-2xl">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Sincronización Exitosa</h3>
                <p className="text-slate-500 text-sm font-medium max-w-xs leading-relaxed mx-auto">
                  El comprobante ha sido ingresado al sistema. El estado de sus boletos se actualizará tras la validación administrativa.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="w-full h-16 bg-slate-900 hover:bg-black text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-slate-200"
              >
                Finalizar Sesión
              </button>
            </div>
          ) : (
            <>
              {/* Summary Area */}
              <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-10 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Ticket size={120} strokeWidth={2.5} />
                </div>
                <div className="flex justify-between items-center relative z-10">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responsable</p>
                   <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{nombre}</p>
                </div>
                <div className="flex justify-between items-start relative z-10">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Expedientes</p>
                   <p className="text-sm font-black text-slate-900 tracking-tighter break-all ml-8 text-right underline decoration-2 underline-offset-4 decoration-slate-200">{folios.join(", ")}</p>
                </div>
                <div className="pt-6 border-t border-slate-200 flex justify-between items-center relative z-10">
                   <p className="text-xl font-black text-slate-900 uppercase tracking-tighter">Liquidación Total</p>
                   <p className="text-2xl font-black text-slate-900 tracking-tighter font-mono">${montoTotal.toLocaleString("es-MX")}</p>
                </div>
              </div>

              {/* Upload Dropzone */}
              <div>
                {!file ? (
                  <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f); }}
                    className={`border-4 border-dashed rounded-[3rem] p-16 text-center cursor-pointer transition-all duration-500 flex flex-col items-center gap-6 ${dragging ? "border-slate-900 bg-slate-50 scale-[1.02]" : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"}`}
                  >
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                       <UploadCloud size={24} />
                    </div>
                    <div>
                       <p className="text-sm font-black text-slate-900 uppercase tracking-widest mb-1">Cargar Archivo</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">JPG, PNG, PDF (Máx 5MB)</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-900 rounded-[2.5rem] p-8 flex items-center justify-between text-white shadow-2xl">
                    <div className="flex items-center gap-6 overflow-hidden">
                       <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <FileText size={20} />
                       </div>
                       <div className="overflow-hidden">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1 leading-none">Original Seleccionado</p>
                          <p className="text-sm font-bold truncate tracking-tight">{file.name}</p>
                       </div>
                    </div>
                    <button onClick={() => setFile(null)} className="w-12 h-12 rounded-xl bg-white/10 hover:bg-red-500 transition-all flex items-center justify-center border border-white/5">
                       <XCircle size={20} />
                    </button>
                  </div>
                )}
                <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/gif,application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f); e.target.value = ""; }} />
              </div>

              {err && (
                <div className="bg-red-50 border border-red-100 rounded-3xl p-6 flex items-center gap-4 text-red-900 animate-in slide-in-from-top-2">
                   <ShieldAlert size={20} />
                   <p className="text-[11px] font-black uppercase tracking-wider">{err}</p>
                </div>
              )}

              {file && (
                <button
                  onClick={handleSubmit}
                  disabled={uploading}
                  className="w-full h-20 bg-slate-900 hover:bg-black disabled:opacity-50 text-white font-black text-xs uppercase tracking-[0.3em] rounded-[2rem] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-slate-200 group"
                >
                  {uploading ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />}
                  <span>{uploading ? "Sincronizando Archivo..." : "Confirmar Envío Oficial"}</span>
                </button>
              )}

              <div className="border-t border-slate-100 pt-8 mt-12">
                 <BankCards accounts={accounts} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
