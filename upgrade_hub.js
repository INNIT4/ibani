const fs = require('fs');
let content = fs.readFileSync('servicios/landing-pages.html', 'utf8');

const landingExplanation = `
    <!-- WHAT IS A LANDING PAGE -->
    <section class="section--lg" style="background:var(--bg-2); padding-top: var(--space-16); padding-bottom: var(--space-16);">
      <div class="container">
        <div style="max-width:800px; margin:0 auto; text-align:center">
          <div class="section-head__eyebrow" style="justify-content:center; margin-bottom:var(--space-4)"><span class="label">Concepto Fundamental</span></div>
          <h2 class="section-head__title" style="margin-bottom:var(--space-6)">¿Qué es una <br><em style="color:var(--accent)">Landing Page?</em></h2>
          <p style="font-size:var(--text-lg); color:var(--ink-2); line-height:1.7; margin-bottom:var(--space-8)">
            Una Landing Page (página de aterrizaje) no es un sitio web tradicional con pestañas interminables donde el cliente se pierde. Es <strong>una sola página diseñada estratégicamente de arriba a abajo</strong> para lograr un único objetivo: <strong>Que el visitante te contacte, cotice o compre ahora mismo</strong>.
          </p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-8); text-align:left; background:var(--bg); border:1px solid var(--border); padding:var(--space-8); border-radius:calc(var(--radius)*1.5)">
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.3rem; margin-bottom:var(--space-3)">¿Para quién NO es?</h3>
              <p style="color:var(--ink-3); line-height:1.6; font-size:calc(var(--text-sm)*1.1)">No es para quienes buscan catálogos con cientos de productos filtrables, blogs extensos o tiendas e-commerce departamentales masivas.</p>
            </div>
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.3rem; margin-bottom:var(--space-3); color:var(--accent)">¿Para quién SÍ es?</h3>
              <p style="color:var(--ink-2); line-height:1.6; font-size:calc(var(--text-sm)*1.1)">Ideal para profesionistas, clínicas, talleres o campañas en Google Ads/Facebook que necesitan <strong>ofrecer un servicio específico</strong> y recibir prospectos directos por WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

if(!content.includes('¿Qué es una <br><em style="color:var(--accent)">Landing Page?</em>')) {
   content = content.replace('</section>\n\n    <!-- WHAT\'S INCLUDED -->', '</section>\n' + landingExplanation + '\n    <!-- WHAT\'S INCLUDED -->');
}

// Map of plan updating details
const planUpdates = {
  'Económico': 'Landing Page esencial de 2 secciones para capturar contactos rápidos sin distracciones. Ideal para asesorías o respuestas urgentes.',
  'Emprendedor': 'Landing Page de 4 secciones. Permite extender más la venta al sumar el perfil de tu clínica o empresa y una galería de resultados.',
  'Emprendedor Pro': 'Landing Page persuasiva de 6 secciones. Rompe objeciones publicando testimonios reales y desglosando al detalle lo que ofreces.',
  'Emprendedor Plus': 'Landing Page avanzada de 8 secciones enfocada en responder dudas. Añade Preguntas Frecuentes (FAQs), Garantías y Especificaciones.',
  'Emprendedor Avanzado': 'Formato largo de ventas (High-Ticket) con 10 sec. Integra casos de éxito y metodologías profundas para cerrar servicios de alto valor.',
  'Emprendedor Elite': 'La obra maestra inmersiva de 12 secciones. Múltiples llamados a la acción y máxima retención visual, pensada para lanzamientos enormes.'
};

for(const [name, newDesc] of Object.entries(planUpdates)) {
  const regex = new RegExp(`(<p class="pc-name">${name}<\/p><\/div>\\s*<p class="pc-desc">)(.*?)(<\/p>)`);
  content = content.replace(regex, `$1${newDesc}$3`);
}

fs.writeFileSync('servicios/landing-pages.html', content, 'utf8');
console.log('Hub Landing updated successfully!');
