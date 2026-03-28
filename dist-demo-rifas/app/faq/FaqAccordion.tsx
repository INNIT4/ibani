"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/firestore";
import SupportButton from "@/components/ui/SupportButton";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <button
            className="w-full text-left px-8 py-5 flex items-center justify-between font-bold text-slate-800 hover:bg-slate-50 transition-colors uppercase tracking-tight text-sm"
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
            <span className={`text-brand-red transition-all duration-300 ${open === i ? "rotate-180" : ""}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          {open === i && (
            <div className="px-8 pb-6 text-slate-500 text-base leading-relaxed font-light border-t border-slate-50 pt-4">
              {item.a}
            </div>
          )}
        </div>
      ))}

      <div className="mt-16 text-center bg-slate-900 border border-slate-800 rounded-3xl p-12 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-red/5 mix-blend-overlay opacity-20" />
        <div className="relative z-10">
          <h3 className="text-2xl font-extrabold text-white mb-4 uppercase tracking-tight">¿Aún tienes dudas?</h3>
          <p className="text-slate-400 mb-10 italic max-w-sm mx-auto font-light leading-relaxed">Nuestro equipo de soporte está listo para ayudarte personalmente a través de WhatsApp.</p>
          <SupportButton variant="whatsapp" label="Chatear con Soporte" message="Hola, tengo una duda que no encontré en las FAQ." />
        </div>
      </div>
    </div>
  );
}
