import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad",
  description: "Aviso de privacidad de Sorteos Pro conforme a la LFPDPPP.",
};

export default function AvisoPrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold uppercase tracking-tight text-slate-800 mb-2">Aviso de Privacidad</h1>
      <span className="accent-bar" />
      <p className="text-slate-500 mb-12 text-sm mt-6 font-light">
        Última actualización: {new Date().toLocaleDateString("es-MX", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="max-w-none space-y-12 text-base leading-relaxed text-slate-600 font-light">

        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold mb-4 text-slate-800 uppercase tracking-tight">Identidad y domicilio del responsable</h2>
          <p>
            <strong className="text-slate-900 font-bold">Sorteos Pro</strong> (en adelante &ldquo;el Responsable&rdquo;) es responsable del tratamiento de los datos
            personales que nos proporcione, de conformidad con la <em>Ley Federal de Protección de Datos Personales
            en Posesión de los Particulares</em> (LFPDPPP) y su Reglamento.
          </p>
        </section>

        <section className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
          <h2 className="text-xl font-extrabold mb-4 text-slate-800 uppercase tracking-tight">Datos personales recabados</h2>
          <p className="mb-4">Para llevar a cabo las finalidades descritas en el presente aviso de privacidad, recabamos los siguientes datos personales:</p>
          <ul className="space-y-3 font-medium text-slate-700">
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
              Nombre y apellidos
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
              Número de teléfono celular
            </li>
            <li className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 bg-brand-red rounded-full" />
              Estado de residencia (dentro de la República Mexicana)
            </li>
          </ul>
          <p className="mt-6 text-slate-400 italic text-sm">No recabamos datos personales sensibles.</p>
        </section>

        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold mb-4 text-slate-800 uppercase tracking-tight">Finalidades del tratamiento</h2>
          <div className="space-y-6">
            <div>
              <p className="font-bold text-slate-900 mb-2">Finalidades primarias:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Registrar la adquisición de boletos para rifas y sorteos.</li>
                <li>Enviar confirmación de apartado y folio por WhatsApp.</li>
                <li>Identificar al titular del boleto en caso de resultar ganador.</li>
                <li>Atender consultas sobre el estado de su boleto.</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-slate-50">
              <p className="font-bold text-slate-900 mb-2">Finalidades secundarias:</p>
              <ul className="list-disc pl-6">
                <li>Envío de información sobre nuevas rifas y promociones.</li>
              </ul>
              <p className="mt-4 text-sm text-slate-400">
                Si no desea que sus datos sean tratados para las finalidades secundarias, puede comunicarlo a través del
                botón de soporte.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-extrabold mb-4 text-slate-800 uppercase tracking-tight">Derechos ARCO</h2>
          <p className="mb-6">
            Usted tiene derecho a <strong className="text-slate-900 font-bold">Acceder</strong>, <strong className="text-slate-900 font-bold">Rectificar</strong>, <strong className="text-slate-900 font-bold">Cancelar</strong> u
            <strong className="text-slate-900 font-bold"> Oponerse</strong> al tratamiento de sus datos personales. Para ejercerlos, envíe su solicitud indicando:
          </p>
          <div className="bg-slate-50 rounded-2xl p-6 mb-6 font-medium text-slate-700">
            <ul className="space-y-2">
              <li>• Nombre completo y folio de boleto.</li>
              <li>• Descripción clara del derecho que desea ejercer.</li>
              <li>• Copia de identificación oficial digitalizada.</li>
            </ul>
          </div>
          <p className="text-sm">
            Responderemos su solicitud en un plazo máximo de <strong className="text-slate-900 font-bold">20 días hábiles</strong>.
          </p>
        </section>

        <section className="bg-slate-900 text-white rounded-3xl p-10 text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-brand-red/5 mix-blend-overlay opacity-20" />
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold mb-4 uppercase tracking-tight">Contacto Directo</h2>
            <p className="text-slate-400 mb-0 font-light italic">
              Para cualquier duda relacionada con sus datos personales, contáctanos vía WhatsApp.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
