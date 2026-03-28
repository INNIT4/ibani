import Link from "next/link";
import Image from "next/image";
import { getRifas, Rifa } from "@/lib/firestore";
import CountdownTimer from "@/components/CountdownTimer";
import { Ticket, Trophy, Calendar, ArrowRight, Timer } from "lucide-react";

export const revalidate = 60;

export default async function RifasPage() {
  let rifas: Rifa[] = [];
  try {
    const all = await getRifas();
    rifas = all.filter((r) => r.activa);
  } catch {
    // Firebase not configured
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 selection:bg-slate-900 selection:text-white animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-20">
        <div className="w-16 h-1 bg-slate-900 rounded-full mb-8" />
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4">Sorteos Activos</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-xl leading-relaxed">
          Inicie su participación en nuestras campañas de alta fidelidad con premios certificados.
        </p>
      </div>

      {rifas.length === 0 ? (
        <div className="text-center py-32 bg-slate-50 rounded-[4rem] border border-slate-100 shadow-inner">
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-8 shadow-sm">
             <Ticket size={40} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">Sin Sorteos Vigentes</h2>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Próximas campañas en proceso de certificación.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {rifas.map((rifa) => {
            const principalPrize = rifa.premios?.find(p => p.es_principal);
            return (
              <Link
                key={rifa.id}
                href={`/rifas/${rifa.id}`}
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-100 flex flex-col"
              >
                {rifa.imagen_url ? (
                  <div className="relative w-full h-72 overflow-hidden">
                    <Image src={rifa.imagen_url} alt={rifa.nombre} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {principalPrize && (
                      <div className="absolute top-6 left-6 z-10">
                        <div className="bg-white/95 backdrop-blur-md text-slate-900 text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-xl flex items-center gap-2 border border-white/20">
                          <Trophy size={14} className="text-indigo-600" strokeWidth={2.5} />
                          <span>{principalPrize.nombre}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-72 bg-slate-50 flex items-center justify-center text-slate-200">
                    <Ticket size={64} strokeWidth={1.5} />
                  </div>
                )}

                <div className="p-10 flex-1 flex flex-col">
                  <div className="mb-8 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="flex items-center gap-3 text-slate-400 mb-3">
                       <Timer size={14} strokeWidth={2.5} />
                       <span className="text-[9px] font-black uppercase tracking-widest">Cierre de Campaña</span>
                    </div>
                    <CountdownTimer targetDate={rifa.fecha_sorteo} />
                  </div>

                  <h2 className="font-black text-2xl mb-4 text-slate-900 tracking-tighter uppercase leading-none group-hover:text-indigo-600 transition-colors uppercase">{rifa.nombre}</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase leading-relaxed tracking-wider mb-8 line-clamp-2">{rifa.descripcion}</p>

                  <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-2 leading-none">Inversión Boleto</p>
                      <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">
                        ${rifa.precio_boleto.toLocaleString("es-MX")}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
                       <ArrowRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
