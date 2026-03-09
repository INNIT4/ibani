"use client";

import { useState } from "react";
import { getBoletoByFolio, getRifa } from "@/lib/firestore";
import { getRotatedWhatsApp, buildWhatsAppUrl } from "@/lib/whatsapp";
import { downloadComprobante } from "@/lib/pdf";

export default function TarjetasActions({ folio }: { folio: string }) {
  const [waLoading, setWaLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  async function handleWhatsApp() {
    setWaLoading(true);
    try {
      const [boleto, numero] = await Promise.all([
        getBoletoByFolio(folio),
        getRotatedWhatsApp(),
      ]);

      if (!numero) {
        alert("No hay número de WhatsApp configurado. Contacta al equipo directamente.");
        return;
      }
      if (!boleto) {
        alert("No se encontró el boleto. Intenta de nuevo.");
        return;
      }

      let rifaNombre = "Sorteos Pro";
      try {
        const rifa = await getRifa(boleto.rifa_id);
        if (rifa?.nombre) rifaNombre = rifa.nombre;
      } catch {}

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
      const fecha =
        boleto.created_at?.toDate?.()?.toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" }) ??
        new Date().toLocaleString("es-MX", { dateStyle: "short", timeStyle: "short" });
      const message =
        `👋 Hola, soy ${boleto.nombre} ${boleto.apellidos}\nSeleccioné: ${boleto.numeros.length} números\n──────────────\n` +
        `🎫 Números: ${boleto.numeros.join(", ")}\n🎯 Sorteo: ${rifaNombre}\n🏷️ Folio: ${folio}\n` +
        `📅 Fecha: ${fecha}\n💰 Total: $${boleto.precio_total.toLocaleString("es-MX")}\n──────────────\n` +
        `💳 Métodos de pago: ${siteUrl}/cuentas\n🏷️ Consulta: ${siteUrl}/consulta?f=${folio}&act=1`;

      window.open(buildWhatsAppUrl(numero, message), "_blank");
    } catch {
      alert("Error al abrir WhatsApp. Intenta de nuevo.");
    }
    setWaLoading(false);
  }

  async function handlePDF() {
    setPdfLoading(true);
    try {
      const boleto = await getBoletoByFolio(folio);
      if (!boleto) {
        alert("No se encontró el boleto.");
        return;
      }
      let rifaNombre = "Sorteos Pro";
      try {
        const rifa = await getRifa(boleto.rifa_id);
        if (rifa?.nombre) rifaNombre = rifa.nombre;
      } catch {}
      await downloadComprobante(boleto, rifaNombre);
    } catch {
      alert("Error al generar el PDF. Intenta de nuevo.");
    }
    setPdfLoading(false);
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
      <button
        onClick={handleWhatsApp}
        disabled={waLoading}
        className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] disabled:opacity-50 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-emerald-100 uppercase tracking-tight text-sm"
      >
        {waLoading ? (
          <span className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}
        {waLoading ? "Abriendo..." : "WhatsApp"}
      </button>

      <button
        onClick={handlePDF}
        disabled={pdfLoading}
        className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-slate-200 text-slate-700 font-extrabold rounded-2xl hover:bg-slate-50 disabled:opacity-50 transition-all uppercase tracking-tight text-sm"
      >
        {pdfLoading ? (
          <span className="w-5 h-5 border-3 border-slate-300 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
          </svg>
        )}
        {pdfLoading ? "Generando..." : "Descargar PDF"}
      </button>
    </div>
  );
}
