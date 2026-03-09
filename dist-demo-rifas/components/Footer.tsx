import Link from "next/link";
import Image from "next/image";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-slate-50 text-slate-500 mt-auto border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="mb-6">
               <Logo size="md" />
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Sistemas de sorteos de alta fidelidad. Participe de forma segura, sencilla y con total transparencia administrativa.
            </p>
          </div>
          <div>
            <p className="text-brand-red font-bold mb-4 text-xs uppercase tracking-[0.2em]">Navegacion</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/rifas" className="hover:text-brand-red transition-colors">Rifas activas</Link></li>
              <li><Link href="/rifas-previas" className="hover:text-brand-red transition-colors">Rifas previas</Link></li>
              <li><Link href="/consulta" className="hover:text-brand-red transition-colors">Consultar boleto</Link></li>
              <li><Link href="/tarjetas" className="hover:text-brand-red transition-colors">Metodos de pago</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-brand-red font-bold mb-4 text-xs uppercase tracking-[0.2em]">Informacion</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-brand-red transition-colors">Preguntas frecuentes</Link></li>
              <li><Link href="/sobre-nosotros" className="hover:text-brand-red transition-colors">Sobre nosotros</Link></li>
              <li><Link href="/aviso-privacidad" className="hover:text-brand-red transition-colors">Aviso de privacidad</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} Sorteos Pro. Todos los derechos reservados.</p>
            <p className="text-gray-400">
              Desarrollada por{" "}
              <a 
                href="https://ibanidigital.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-slate-900 hover:text-brand-red font-bold transition-colors underline decoration-brand-red/30 decoration-2 underline-offset-4 hover:decoration-brand-red"
              >
                IBANI Digital
              </a>
            </p>
          </div>
          <Link href="/aviso-privacidad" className="hover:text-brand-red transition-colors text-slate-400">
            Aviso de privacidad
          </Link>
        </div>
      </div>
    </footer>
  );
}
