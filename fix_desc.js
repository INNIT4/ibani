const fs = require('fs');
let file = 'servicios/landing-pages/economico.html';
let content = fs.readFileSync(file, 'utf8');

let newText = `        <div class="plan-hero__desc anim-r" style="--delay:.38s">
          <p style="margin-bottom: var(--space-4);"><strong>¿Qué es?</strong><br>
          Es la base digital esencial para cualquier negocio. Un mini-sitio de 2 secciones estratégicas: <strong>Inicio</strong> (diseñada estratégicamente para atrapar la atención) y <strong>Contacto</strong> (actúa como tu recepcionista virtual 24/7 con formulario, teléfono, dirección y redes sociales). Incluimos todo para que empiece a funcionar: Dominio, Hosting y Certificado de seguridad (SSL).</p>

          <p style="margin-bottom: var(--space-4);"><strong>¿Para quién sirve?</strong><br>
          Ideal para negocios locales, profesionistas o emprendedores que ofrecen un servicio directo y necesitan consolidar su presencia real en Google para recibir prospectos por WhatsApp de forma estructurada.</p>

          <p><strong>Un ejemplo estructurado:</strong><br>
          Imagina que eres un técnico en refrigeración.<br>
          <span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;">
            <strong>1. Inicio:</strong> Mostramos el título "Reparación de Refrigeradores en Sonora", fotos de tu trabajo real, y tus beneficios competitivos (rapidez y garantía).<br>
            <strong>2. Contacto:</strong> Un espacio directo con la dirección de tu taller y un gran botón de llamada y WhatsApp para que el cliente que necesita ayuda urgente te marque inmediatamente.
          </span>
          </p>
        </div>`;

content = content.replace(/<p class="plan-hero__desc anim-r"[\s\S]+?Entrega en 3 días\.\s*<\/p>/, newText);

fs.writeFileSync(file, content, 'utf8');
console.log('Replaced successfully');
