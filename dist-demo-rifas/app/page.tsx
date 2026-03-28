import Link from "next/link";
import Image from "next/image";
import { getRifas, getSiteTexts, DEFAULT_SITE_TEXTS, getBankAccounts, BankAccount } from "@/lib/firestore";
import BankCards from "@/components/BankCards";
import CountdownTimer from "@/components/CountdownTimer";
import { ArrowRight, ShieldCheck, Ticket, Users, Timer, CreditCard, ChevronRight, HelpCircle, Info } from "lucide-react";

export const revalidate = 60;

export default async function HomePage() {
  let rifasActivas: Awaited<ReturnType<typeof getRifas>> = [];
  let texts = DEFAULT_SITE_TEXTS;
  let accounts: BankAccount[] = [];
  try {
    const [all, t, accs] = await Promise.all([getRifas(), getSiteTexts(), getBankAccounts()]);
    rifasActivas = all.filter((r) => r.activa).slice(0, 3);
    texts = t;
    accounts = accs.filter(a => a.activo);
  } catch {
    // Firebase not configured yet
  }

  return (
    <div className="selection:bg-slate-900 selection:text-white">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-slate-50/30">
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/1.jpeg"
            alt=""
            fill
            className="object-cover object-center opacity-40 scale-105"
            priority
            unoptimized={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/80 to-white" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 border border-slate-900/10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8">
            <ShieldCheck size={14} className="text-slate-900" strokeWidth={3} />
            Sorteos Profesionales • 100% Certificados
          </div>

          <div className="flex justify-center mb-10">
            <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden ring-8 ring-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] relative group transition-transform hover:scale-105 duration-500">
              <Image src="/images/3.jpeg" alt="Sorteos Pro" fill className="object-cover" priority sizes="160px" />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.9] uppercase">
            {texts.hero_title.includes("Sorteos Pro") ? (
              <>
                {texts.hero_title.split("Sorteos Pro")[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-500">Sorteos Pro</span>
                {texts.hero_title.split("Sorteos Pro")[1]}
              </>
            ) : (
              texts.hero_title
            )}
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
            {texts.hero_subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              href="/rifas"
              className="group h-16 px-10 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-100 rounded-2xl flex items-center gap-3"
            >
              <span>Participar Ahora</span>
              <Ticket size={16} className="text-indigo-600 group-hover:rotate-12 transition-transform" />
            </Link>
            <Link
              href="/consulta"
              className="h-16 px-10 border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs uppercase tracking-[0.2em] transition-all rounded-2xl flex items-center gap-3"
            >
              <span>Consultar Folio</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Trust Badge */}
          <Link
            href="#metodos-pago"
            className="inline-flex items-center gap-6 bg-white/70 backdrop-blur-md border border-slate-100 hover:border-slate-300 px-10 py-5 transition-all group rounded-3xl shadow-xl shadow-slate-100"
          >
            <div className="w-14 h-10 rounded-xl bg-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg">
              <CreditCard size={20} className="text-white" strokeWidth={2.5} />
            </div>
            <div className="text-left border-l border-slate-100 pl-6">
              <p className="text-slate-900 font-black text-[10px] leading-none uppercase tracking-widest">Entidades Compatibles</p>
              <p className="text-slate-400 text-[11px] font-bold mt-2 uppercase tracking-tight">{texts.hero_banks_text}</p>
            </div>
          </Link>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-slate-300 animate-bounce">
           <div className="w-px h-12 bg-gradient-to-b from-transparent to-slate-200" />
        </div>
      </section>

      {/* Procedural Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <div className="w-12 h-1 bg-slate-900 rounded-full mb-8" />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-2">Protocolo de Operación</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">{texts.how_it_works_title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 lg:gap-8">
            {texts.how_it_works_steps.map((item, i) => (
              <div key={i} className="group text-center relative px-4">
                {/* Connector on desktop */}
                {i < texts.how_it_works_steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[70%] w-[60%] h-px border-t-2 border-dashed border-slate-100 z-0" />
                )}
                
                <div className="relative z-10 w-20 h-20 bg-slate-50 group-hover:bg-slate-900 group-hover:text-white text-slate-900 text-2xl font-black flex items-center justify-center mx-auto mb-8 rounded-[2rem] shadow-sm border border-slate-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {i + 1}
                </div>
                <h3 className="font-black text-xs uppercase tracking-widest mb-4 text-slate-900">{item.title}</h3>
                <p className="text-slate-400 text-[11px] font-bold uppercase leading-relaxed tracking-wider">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Listings Preview */}
      {rifasActivas.length > 0 && (
        <section className="py-32 px-4 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-12 h-1 bg-slate-900 rounded-full" />
                   <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Escaparate Activo</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase">Sorteos Disponibles</h2>
              </div>
              <Link href="/rifas" className="group h-12 px-8 bg-white border border-slate-200 hover:border-slate-900 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] transition-all rounded-xl flex items-center gap-4">
                <span>Catálogo Completo</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {rifasActivas.map((rifa) => (
                <Link
                  key={rifa.id}
                  href={`/rifas/${rifa.id}`}
                  className="group bg-white rounded-[3rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 border border-slate-50 border-t-slate-100 flex flex-col h-full"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {rifa.imagen_url ? (
                      <Image 
                        src={rifa.imagen_url} 
                        alt={rifa.nombre} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                        <Ticket size={48} className="text-slate-200" strokeWidth={1} />
                      </div>
                    )}
                    
                    {/* Floating Status */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                       <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">En Curso</span>
                       </div>
                       
                       {rifa.premios && rifa.premios.find(p => p.es_principal) && (
                         <div className="bg-slate-900 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
                            <span className="text-[9px] font-black uppercase tracking-widest">Principal: {rifa.premios.find(p => p.es_principal)?.nombre}</span>
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-1">
                    {rifa.ganador ? (
                      <div className="mb-8 bg-slate-50 border border-slate-100 rounded-[2rem] p-6">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 leading-none">Resultado Oficial</p>
                        <p className="font-black text-slate-900 text-lg uppercase tracking-tight leading-tight">#{rifa.ganador.numero} • {rifa.ganador.nombre}</p>
                      </div>
                    ) : (
                      <div className="mb-8">
                        <CountdownTimer targetDate={rifa.fecha_sorteo} />
                      </div>
                    )}
                    
                    <h3 className="font-black text-xl mb-3 text-slate-900 group-hover:text-slate-500 transition-colors uppercase tracking-tight leading-tight">{rifa.nombre}</h3>
                    <p className="text-slate-400 text-[11px] font-bold uppercase mb-10 line-clamp-2 leading-relaxed tracking-wider flex-1">{rifa.descripcion}</p>
                    
                    <div className="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                      <div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Precio Unitario</p>
                        <span className="text-slate-900 font-black text-3xl tracking-tighter">
                          ${rifa.precio_boleto.toLocaleString("es-MX")}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500">
                         <ChevronRight size={20} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Payment Information */}
      <section id="metodos-pago" className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-24">
            <div className="w-12 h-1 bg-slate-900 rounded-full mb-8" />
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Garantía de Recaudo</h2>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] max-w-lg leading-relaxed">
               Seguridad en cada transacción mediante enlaces directos y validación de comprobantes oficiales.
            </p>
          </div>
          
          <BankCards accounts={accounts} />
          
          <div className="mt-20 flex flex-col items-center">
             <div className="flex items-center gap-4 bg-slate-50 px-8 py-5 rounded-[2rem] border border-slate-100 max-w-2xl">
                <Info size={20} className="text-slate-400" />
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed text-center sm:text-left">
                  Importante: Todos los depósitos y transferencias deben incluir su número de folio de reservación en el concepto de pago para una validación automatizada.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Support CTA */}
      <section className="bg-slate-50 py-32 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 opacity-[0.03] pointer-events-none">
           <HelpCircle size={400} />
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex h-20 w-20 bg-white shadow-2xl shadow-slate-200 rounded-[2rem] items-center justify-center text-slate-900 mb-10">
             <HelpCircle size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-8 leading-tight">¿Alguna Interrogante?</h2>
          <p className="text-lg font-bold text-slate-400 uppercase tracking-widest mb-16 max-w-2xl mx-auto leading-relaxed italic">Expertos disponibles para optimizar tu experiencia de participación comercial.</p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/faq"
              className="h-16 px-12 bg-white text-slate-600 border border-slate-200 font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all shadow-xl shadow-slate-100 flex items-center justify-center gap-4 group"
            >
              <span>Preguntas Frecuentes</span>
              <ArrowRight size={16} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/sobre-nosotros"
              className="h-16 px-12 bg-white text-slate-900 border border-slate-200 font-black rounded-2xl text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all flex items-center justify-center gap-4"
            >
              <span>Nuestra Visión</span>
              <Users size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
