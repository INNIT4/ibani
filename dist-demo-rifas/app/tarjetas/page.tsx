import BankCards from "@/components/BankCards";
import TarjetasActions from "@/components/TarjetasActions";
import { getBankAccounts } from "@/lib/firestore";
import { CheckCircle2, Info, CreditCard, ShieldCheck, ArrowRight, MessageSquare, Copy } from "lucide-react";

export default async function TarjetasPage({
  searchParams,
}: {
  searchParams: { folio?: string };
}) {
  const folio = searchParams.folio;
  const accounts = (await getBankAccounts()).filter((a) => a.activo);

  return (
    <div className="max-w-6xl mx-auto px-6 py-24 selection:bg-slate-900 selection:text-white animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-20">
        <div className="w-16 h-1 bg-slate-900 rounded-full mb-8" />
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4">Mesa de Pagos</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-xl leading-relaxed">
          Sistemas de transferencia segura y protocolos de liquidación oficial.
        </p>
      </div>

      {folio && (
        <div className="relative mb-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
          <div className="relative bg-white border border-emerald-100 rounded-[3rem] p-12 lg:p-16 text-center shadow-xl shadow-emerald-100/50 overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-emerald-600">
               <CheckCircle2 size={180} />
            </div>
            
            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-10 shadow-inner">
               <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>

            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Reserva Exitosa</h2>
            <p className="text-slate-500 font-medium mb-10 text-lg max-w-lg mx-auto leading-relaxed">
              Tus boletos han sido apartados. Utiliza el siguiente identificador para tu transferencia:
            </p>

            <div className="inline-flex flex-col items-center p-1 bg-slate-50 rounded-[2.5rem] mb-10 border border-slate-100">
               <div className="bg-white px-12 py-6 rounded-[2.3rem] shadow-xl border border-slate-50 flex items-center gap-6">
                  <p className="text-4xl lg:text-5xl font-black tracking-tighter text-emerald-600 font-mono">
                    {folio}
                  </p>
                  <div className="w-px h-10 bg-slate-100 hidden sm:block" />
                  <div className="text-left hidden sm:block">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Folio Único</p>
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Generado</p>
                  </div>
               </div>
            </div>

            <div className="max-w-md mx-auto">
              <TarjetasActions folio={folio} />
            </div>
          </div>
        </div>
      )}

      {/* Payment Grid */}
      <div className="grid lg:grid-cols-12 gap-16 items-start">
        <div className="lg:col-span-7">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl">
                 <CreditCard size={20} strokeWidth={2.5} />
              </div>
              <div>
                 <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Cuentas Oficiales</h2>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Sistemas de Recaudo Autorizados</p>
              </div>
           </div>

           <div className="mb-12">
              <BankCards accounts={accounts} />
           </div>

           {folio && (
              <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-slate-200">
                 <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 mb-4 leading-none">Referencia Sugerida</p>
                    <div className="flex items-center gap-6">
                       <h3 className="text-2xl font-black tracking-tighter text-white uppercase">Concepto: <span className="text-emerald-400">{folio}</span></h3>
                    </div>
                    <p className="text-xs font-medium text-white/50 mt-4 leading-relaxed max-w-sm">
                       Escriba este folio en el campo 'Concepto' o 'Referencia' de su banca móvil para agilizar la validación.
                    </p>
                 </div>
                 <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                    <Copy size={160} strokeWidth={1} />
                 </div>
              </div>
           )}
        </div>

        <div className="lg:col-span-5 space-y-10">
           {/* Instructions Module */}
           <div className="bg-slate-50 border border-slate-100 rounded-[3.5rem] p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                 <ShieldCheck size={180} strokeWidth={2.5} />
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-10 uppercase tracking-tighter flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white text-[10px]">!</div>
                Protocolo de Pago
              </h3>
              
              <div className="space-y-10 relative z-10">
                 <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-900 font-black text-xs shadow-sm flex-shrink-0">1</div>
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 leading-none">Ejecución</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">Elija una entidad financiera y procese la transferencia por el monto exacto.</p>
                    </div>
                 </div>
                 
                 <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-900 font-black text-xs shadow-sm flex-shrink-0">2</div>
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 leading-none">Referenciación</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">Capture el folio <span className="text-slate-900">{folio ?? "SP-XXXX"}</span> como concepto de su movimiento bancario.</p>
                    </div>
                 </div>

                 <div className="flex gap-6 items-start">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-900 font-black text-xs shadow-sm flex-shrink-0">3</div>
                    <div>
                       <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 leading-none">Notificación</p>
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-relaxed">Remita el comprobante digital a nuestro soporte para activar su certificado profesional.</p>
                    </div>
                 </div>
              </div>

              <div className="mt-12 pt-10 border-t border-slate-200">
                 <div className="flex items-center gap-4 text-emerald-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">Validación de Alta Disponibilidad</p>
                 </div>
              </div>
           </div>

           <div className="p-10 bg-indigo-600 rounded-[3rem] text-white shadow-2xl shadow-indigo-100 group overflow-hidden relative">
              <div className="relative z-10">
                 <h4 className="text-xl font-black mb-6 uppercase tracking-tighter leading-tight">Asistencia Inmediata</h4>
                 <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-100 mb-8 opacity-80 decoration-indigo-300">¿Problemas con su transferencia? Inicie un canal de soporte directo.</p>
                 <button className="flex items-center gap-4 px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-50 transition-all active:scale-95 group">
                    <MessageSquare size={16} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
                    <span>Contacto Concierge</span>
                 </button>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                 <ArrowRight size={160} strokeWidth={2.5} />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
