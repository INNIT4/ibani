import Link from "next/link";
import Image from "next/image";
import { getRifas, Rifa } from "@/lib/firestore";
import { Trophy, Calendar, Ticket, ArrowRight, User } from "lucide-react";

export const revalidate = 300;

export default async function RifasPreviasPage() {
  let pastRifas: Rifa[] = [];
  try {
    const all = await getRifas();
    pastRifas = all.filter((r) => !r.activa);
  } catch {
    // Error logic
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 selection:bg-slate-900 selection:text-white animate-in fade-in duration-1000">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-20">
        <div className="w-16 h-1 bg-slate-900 rounded-full mb-8" />
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4">Campañas Concluidas</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-xl leading-relaxed">
          Histórico de resultados, transparencia absoluta y entrega de premios certificados.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {pastRifas.map((rifa) => (
          <Link
            key={rifa.id}
            href={`/rifas-previas/${rifa.id}`}
            className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 border border-slate-100 flex flex-col grayscale hover:grayscale-0"
          >
            <div className="relative h-64 overflow-hidden bg-slate-100 text-slate-300">
              {rifa.imagen_url ? (
                 <Image src={rifa.imagen_url} alt={rifa.nombre} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
              ) : (
                <div className="flex items-center justify-center h-full">
                   <Ticket size={48} />
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 p-8">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/20">
                    <Calendar size={12} strokeWidth={2.5} />
                    <span>Concluido el {new Date(rifa.fecha_sorteo).toLocaleDateString("es-MX", { dateStyle: 'medium' })}</span>
                 </div>
              </div>
            </div>

            <div className="p-10 flex-1 flex flex-col">
              <h2 className="font-black text-xl mb-4 text-slate-900 tracking-tighter uppercase leading-tight group-hover:text-indigo-600 transition-colors uppercase">{rifa.nombre}</h2>
              
              {rifa.ganador && (
                <div className="mb-8 p-6 bg-emerald-50 border border-emerald-100 rounded-[1.5rem] relative overflow-hidden group/winner text-left">
                   <div className="absolute -right-2 -bottom-2 text-emerald-100 opacity-50 group-hover/winner:rotate-12 transition-transform">
                      <Trophy size={80} strokeWidth={1} />
                   </div>
                   <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-3 leading-none text-left">Afortunado Ganador</p>
                   <div className="flex items-center gap-4 relative z-10 text-left">
                      <div className="w-10 h-10 rounded-xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                         <User size={18} strokeWidth={2.5} />
                      </div>
                      <div className="text-left">
                         <p className="text-base font-black text-slate-900 tracking-tight leading-none uppercase">#{rifa.ganador.numero} · {rifa.ganador.nombre}</p>
                         <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mt-1">Folio {rifa.ganador.folio}</p>
                      </div>
                   </div>
                </div>
              )}

              <p className="text-slate-400 text-xs font-bold uppercase leading-relaxed tracking-wider mb-8 line-clamp-2">{rifa.descripcion}</p>

              <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                 <p className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] leading-none">Evento Histórico</p>
                 <div className="flex items-center gap-2 text-slate-300 group-hover:text-slate-900 transition-colors">
                    <span className="text-[9px] font-black uppercase tracking-widest">Ver Detalles</span>
                    <ArrowRight size={14} strokeWidth={2.5} />
                 </div>
              </div>
            </div>
          </Link>
        ))}

        {pastRifas.length === 0 && (
          <div className="lg:col-span-3 py-32 text-center bg-slate-50 rounded-[4rem] border border-slate-100">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Sin Histórico Registrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
