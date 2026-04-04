const fs = require('fs');

const extrasHtml = `        <div class="extras-grid">
          <div class="extra-card reveal s3d-l">
            <div class="extra-card__icon">⚙️</div>
            <p class="extra-card__name">Administrador de contenidos</p>
            <p class="extra-card__desc">Actualiza texto e imágenes sin depender de nadie directamente desde tu panel de administrador de Wordpress.</p>
            <p class="extra-card__price">+ $3,500 MXN</p>
          </div>
          <div class="extra-card reveal s3d-r">
            <div class="extra-card__icon">📱</div>
            <p class="extra-card__name">App para Android</p>
            <p class="extra-card__desc">Imagina a tus prospectos abriendo tu app como abren cualquier otra app de sus telefonos. Convertimos tu sitio web en una App descargable.</p>
            <p class="extra-card__price">+ $12,000 MXN</p>
          </div>
        </div>`;

const details = {
  'economico': {
    qA: 'Es una Landing Page (página de aterrizaje) enfocada 100% en captura de prospectos. Cuenta con 2 secciones clave: <strong>Inicio</strong> (tu oferta principal) y <strong>Contacto</strong> (para asegurar conversiones rápidas). Ya incluye Dominio y Hosting.',
    qFor: 'Ideal para quienes inician pautas básicas en Google Ads o Facebook Ads y requieren una sola página que muestre su oferta inmediata sin distracciones.',
    qEx: 'Imagina que ofreces asesoría legal rápida.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Inicio:</strong> "Defensa Legal en 24h" y tus garantías.<br><strong>2. Contacto:</strong> Formulario directo y botón de WhatsApp urgente para captar el caso hoy mismo.</span>'
  },
  'emprendedor': {
    qA: 'Es una Landing Page estratégica estructurada en 4 secciones. Permite extender más la venta al sumar el perfil de tu empresa. Usualmente: <strong>Inicio, Servicios, Galería y Contacto</strong>.',
    qFor: 'Ideal para profesionistas o PyMEs que, además de vender, necesitan generar confianza mostrando fotos reales de su trabajo (galería) antes de que el usuario cotice.',
    qEx: 'Imagina que tienes una clínica estética.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Inicio / Intro:</strong> Promoción del mes.<br><strong>2. Galería:</strong> Fotos del antes y después de tus procedimientos faciales para construir confianza inmediata.</span>'
  },
  'emprendedor-pro': {
    qA: 'Es una Landing Page persuasiva de recorrido amplio (6 secciones). Te permite derribar objeciones al añadir apartados clave como: <strong>Nosotros, Testimonios y Precios</strong> junto con el embudo estándar.',
    qFor: 'Perfecta para servicios de ticket medio que necesitan "calentar" al cliente potencial probando autoridad mediante reseñas, listados de precios y el respaldo de la empresa.',
    qEx: 'Imagina una agencia de viajes.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Beneficios/Nosotros:</strong> Por qué viajar contigo (seguros, guías premium).<br><strong>2. Testimonios:</strong> "Mi luna de miel fue perfecta, gracias", garantizando seguridad al visitante.</span>'
  },
  'emprendedor-plus': {
    qA: 'Una Landing Page de alta conversión y nivel premium desarrollada con 8 secciones de diseño impecable. Agrega módulos como <strong>Preguntas Frecuentes, Productos/Programas y Garantías</strong>.',
    qFor: 'Ideal para embudos de productos físicos únicos (ej. aparatos médicos, suplementos) o software, donde el usuario tiene dudas profundas que deben responderse en la propia página.',
    qEx: 'Imagina que vendes un Sistema de Purificación de Agua.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Productos/Garantías:</strong> Desglose técnico de tus filtros.<br><strong>2. FAQ (Preguntas):</strong> Módulo que responde "¿Cada cuánto cambio el filtro?", eliminando las fricciones de compra.</span>'
  },
  'emprendedor-avanzado': {
    qA: 'Landing Page de formato largo ("Long-form sales page") con 10 secciones impactantes. Incorpora todas las herramientas previas y expande apartados con <strong>Políticas, Metodología exhaustiva y Casos de Estudio</strong>.',
    qFor: 'Ideal para infoproductores, venta de tickets altos (High-ticket coaching) o diplomados en línea, que imponen a la página el arduo trabajo de convencer sobre una oferta costosa.',
    qEx: 'Imagina que ofreces un Diplomado Especializado en Finanzas.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Metodología:</strong> Cómo se imparte y qué se aprende semana a semana.<br><strong>2. Casos de Estudio/Logros:</strong> Resultados numéricos de ex-alumnos, forzando un enorme deseo antes del CTA.</span>'
  },
  'emprendedor-elite': {
    qA: 'La obra maestra de las Landing Pages. Hasta 12 secciones inmersivas enfocadas en conversiones asombrosas a prueba de balas. Un ecosistema gráfico, animado y textualmente hipnótico con múltiples formularios y anclas.',
    qFor: 'Pensado para lanzamientos corporativos nivel "SaaS", mega eventos, y empresas masivas donde un solo lead calificado equivale a enormes ganancias.',
    qEx: 'Imagina el lanzamiento de un Proyecto Inmobiliario de Lujo.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Masterclass Visual:</strong> Renders 3D, mapas incrustados, amenidades detalladas.<br><strong>2. Diferentes CTAs:</strong> Distintos formularios: "Descargar Brochure", "Agendar Visita" y "Cotizar Crédito". Todo en una página perfecta.</span>'
  }
};

const files = ['economico', 'emprendedor', 'emprendedor-pro', 'emprendedor-plus', 'emprendedor-avanzado', 'emprendedor-elite'];

for(const file of files) {
   let content = fs.readFileSync('servicios/landing-pages/' + file + '.html', 'utf8');
   
   // Apply specific extras 
   const extrasMatch = content.match(/<div class="extras-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/);
   if(extrasMatch) {
       content = content.replace(/<div class="extras-grid">[\s\S]*?(<\/section>)/, extrasHtml + '\n      </div>\n    </section>');
   }

   // Apply correct descriptions to heroes
   const d = details[file];
   if(d) {
     const p1 = `<p style="margin-bottom: var(--space-4);"><strong>¿Qué es?</strong><br>\n          ${d.qA}</p>`;
     const p2 = `<p style="margin-bottom: var(--space-4);"><strong>¿Para quién sirve?</strong><br>\n          ${d.qFor}</p>`;
     const p3 = `<p><strong>Un ejemplo estructurado:</strong><br>\n          ${d.qEx}\n          </p>`;
     
     content = content.replace(/<p style="margin-bottom: var\(--space-4\);"><strong>¿Qué es\?<\/strong><br>[\s\S]*?<\/p>\s*<\/div>\s*<div class="anim-u"/, 
       p1 + '\n\n          ' + p2 + '\n\n          ' + p3 + '\n        </div>\n        <div class="anim-u"');
   }

   fs.writeFileSync('servicios/landing-pages/' + file + '.html', content, 'utf8');
   console.log('Fixed Texts and Extras for: ' + file);
}
