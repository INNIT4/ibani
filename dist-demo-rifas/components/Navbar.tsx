"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/rifas-previas", label: "Rifas Previas" },
  { href: "/consulta", label: "Consultar Boleto" },
  { href: "/tarjetas", label: "Metodos de pago" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/">
          <Logo size="sm" showText={true} lightText={false} />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-black uppercase tracking-[0.2em] transition-all hover:text-indigo-600 ${
                pathname === l.href
                  ? "text-indigo-600"
                  : "text-slate-400"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/rifas"
            className="px-8 h-10 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-[10px] font-black uppercase tracking-[0.2em] transition-all rounded-xl shadow-xl shadow-slate-100 flex items-center"
          >
            <span>Participar</span>
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          <MenuIcon />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white shadow-xl">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-4 text-sm font-semibold uppercase tracking-wider transition-colors hover:text-brand-red hover:bg-slate-50 ${
                pathname === l.href ? "text-brand-red" : "text-slate-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/rifas"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-sm font-bold text-brand-red uppercase tracking-wider"
          >
            Comprar Boletos
          </Link>
        </div>
      )}
    </nav>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
