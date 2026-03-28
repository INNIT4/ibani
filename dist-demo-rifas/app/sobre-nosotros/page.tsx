import { getSiteTexts, DEFAULT_SITE_TEXTS } from "@/lib/firestore";
import Image from "next/image";
import SupportButton from "@/components/ui/SupportButton";
import { ShieldCheck, Target, Heart, CheckCircle2, LayoutGrid, Award, Info } from "lucide-react";

export const revalidate = 300;

export default async function SobreNosotrosPage() {
  const dbTexts = await getSiteTexts();
  const texts = { ...DEFAULT_SITE_TEXTS, ...dbTexts };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-24 selection:bg-slate-900 selection:text-white animate-in fade-in duration-1000">
      {/* Header Cluster */}
      <div className="flex flex-col items-center text-center mb-24">
        <div className="w-16 h-1 bg-slate-900 rounded-full mb-8" />
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-4">Nuestra Identidad</h1>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-xl leading-relaxed">
          Arquitectura de confianza, transparencia y compromiso con la excelencia en cada sorteo nacional.
        </p>
      </div>

      {/* Main Mission Banner */}
      <div className="relative rounded-[3.5rem] overflow-hidden mb-24 min-h-[550px] shadow-2xl shadow-slate-200/50 group border border-slate-100">
        <Image 
          src="/images/2.jpeg" 
          alt="Sorteos Pro Infraestructura" 
          fill 
          className="object-cover object-center group-hover:scale-105 transition-transform duration-[3s]" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-12 lg:p-20">
          <div className="relative z-10 transition-transform duration-700 group-hover:-translate-y-2">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-8 border border-white/20">
               <Target size={32} strokeWidth={2.5} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
              {texts.about_mission_title}
            </h2>
            <p className="text-slate-200 text-lg md:text-xl leading-relaxed max-w-3xl font-medium tracking-tight">
              {texts.about_mission_text}
            </p>
          </div>
        </div>
      </div>

      {/* Philosophy Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-32">
        {(texts.about_values || []).map((item: any, idx: number) => (
          <div
            key={item.title || idx}
            className="group bg-white border border-slate-50 rounded-[2.5rem] p-12 text-center shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 relative overflow-hidden"
          >
            <div className="w-20 h-20 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-900 text-4xl flex items-center justify-center mx-auto mb-10 rounded-[2rem] border border-slate-100 transition-all duration-500 rotate-0 group-hover:rotate-6 group-hover:scale-110">
              {idx === 0 ? <ShieldCheck size={32} strokeWidth={2.5} /> : idx === 1 ? <Award size={32} strokeWidth={2.5} /> : <Heart size={32} strokeWidth={2.5} />}
            </div>
            <h3 className="font-black text-xs uppercase tracking-[0.2em] mb-4 text-slate-900 group-hover:text-slate-500 transition-colors">{item.title}</h3>
            <p className="text-slate-400 text-[11px] font-bold uppercase leading-relaxed tracking-wider">{item.desc}</p>
            
            <div className="absolute -bottom-8 -right-8 opacity-[0.02] pointer-events-none group-hover:scale-125 transition-transform duration-1000">
               <LayoutGrid size={120} />
            </div>
          </div>
        ))}
      </div>

      {/* Strategic Support CTA */}
      <div className="bg-slate-900 rounded-[3.5rem] p-16 lg:p-24 mb-32 text-center relative overflow-hidden group">
        <div className="absolute inset-0 bg-white/5 mix-blend-overlay opacity-10 group-hover:opacity-20 transition-opacity" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white mb-10 border border-white/10 group-hover:rotate-12 transition-transform duration-500">
             <Info size={30} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white leading-none">¿Consulta Presidencial?</h2>
          <p className="text-white/50 mb-12 text-lg font-bold uppercase tracking-widest max-w-xl mx-auto leading-relaxed italic">
            Atención ejecutiva para resolver cualquier interrogante sobre nuestra infraestructura de sorteos.
          </p>
          <div className="scale-110 hover:scale-125 transition-transform">
             <SupportButton variant="primary" label="Establecer Contacto Directo" message="Hola, requiero asistencia técnica corporativa desde la sección 'Sobre Nosotros'." />
          </div>
        </div>
      </div>

      {/* Differentiation Cluster */}
      <div className="bg-white border border-slate-50 rounded-[3.5rem] p-16 lg:p-20 shadow-2xl shadow-slate-100">
        <div className="flex flex-col lg:flex-row gap-16">
           <div className="lg:w-1/3">
              <div className="w-12 h-1 bg-slate-900 rounded-full mb-8" />
              <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 leading-none mb-4">
                {texts.about_why_title}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compromiso de Superioridad</p>
           </div>
           
           <div className="lg:w-2/3">
              <ul className="grid sm:grid-cols-2 gap-x-12 gap-y-6">
                {(texts.about_why_items || []).map((item: string, idx: number) => (
                  <li key={item || idx} className="flex items-start gap-4 py-4 border-b border-slate-50 last:border-0 group">
                    <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-slate-900 group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors">
                       <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed group-hover:text-slate-900 transition-colors">{item}</span>
                  </li>
                ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
}
