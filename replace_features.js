const fs = require("fs");
let file = "servicios/sitios-corporativos.html";
let content = fs.readFileSync(file, "utf8");

let startIdx = content.indexOf('<div class="features-grid">');
let endIdx = content.indexOf('</section>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  let before = content.substring(0, startIdx);
  let after = content.substring(endIdx);
  
  let newBlock = `
        <div class="reveal s3d-u" style="--delay:.1s">
          <h3 style="font-size:1.5rem; margin-bottom:1rem;color:var(--ink)">Incluido en todos los Paquetes</h3>
          <ul style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:0.75rem 1rem;list-style:none;padding:0;color:var(--ink-2);margin-bottom:3rem">
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Desarrollo en WordPress / CMS Administrable</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Optimizado para SEO Básico (Alta en Google/Bing)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Optimización de Usabilidad (UX) e Interfaz (UI)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Diseños Modernos, Botones y Banners llamativos</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Imágenes y Galería de Imágenes Optimizada</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Optimización de Velocidad</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Plugins y Herramientas Profesionales</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Mapa de Ubicación y Enlaces a Redes Sociales</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Header y Footer dinámicos</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Chat en Línea (WhatsApp) y Formulario de Contacto</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Reproducción de Videos Integrada</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Copias de Seguridad Periódicas y Analíticas</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Sitio Web Escalable (más Páginas / Tienda)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>100% Responsivo y Accesible (Tabletas y Móviles)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Certificado SSL y Correos Profesionales **</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Revisiones de Cambios en todos los niveles</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>Páginas de Políticas de Privacidad y Cookies</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);line-height:1.5">✓</span> <span>PopUp / Banner de Aceptación de Cookies</span></li>
          </ul>
          <p style="font-size:0.85rem;color:var(--ink-3);margin-top:-2rem;margin-bottom:4rem">
            ** Correos y SSL aplicables únicamente al contratar el servicio de hosting con nosotros.
          </p>
          
          <h3 style="font-size:1.5rem; margin-bottom:1rem;color:var(--ink)">Módulos Extra (Agregados Especiales)</h3>
          <ul style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:0.75rem 1rem;list-style:none;padding:0;color:var(--ink-2);margin-bottom:3rem">
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Diseños 100% Personalizados y de Marca (Identidad)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Capacitación de Manejo (Videotutoriales a medida)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Hosting, Dominio y Licencias PRO (Elementor, etc.) ***</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Diseño de Logotipo, Imágenes con IA o Recursos Stock</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Google Mi Negocio, Bing Negocios y Google Ads</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Creación de Contenido y Publicación Automática (Blogs/Redes)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Conversión a Tienda en Línea o Catálogo</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Múltiples Idiomas Adicionales y SEO Avanzado</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Servicio de Fotografía, Video y Marca de Agua</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Mantenimiento Continuo y Soporte Avanzado</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>ChatBot Automatizado y Gestor CRM de Ventas</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Mega Menús, Menús Dinámicos y Accesibilidad (WCAG)</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Mapas Térmicos y Grabaciones de Comportamiento</span></li>
            <li style="display:flex;align-items:flex-start;gap:0.5rem"><span style="color:var(--accent);font-weight:bold;line-height:1.5">+</span> <span>Formulario Complejo con Firma Electrónica</span></li>
          </ul>
        </div>
      </div>
    `;
    
  fs.writeFileSync(file, before + newBlock + after);
  console.log("Updated sitios-corporativos.html");
} else {
  console.log("Could not find section");
}
