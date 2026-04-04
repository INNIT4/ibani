const fs = require('fs');

let hd = fs.readFileSync('servicios/sitios-corporativos/bronce.html', 'utf8');

const featuresList = `
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>7 Páginas Maestras (ej. Inicio, 3 Servicios separados, Nosotros, Contacto, Portafolio)</li>
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>Arquitectura de hasta 8 secciones por cada página</li>
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>Diseño 100% Personalizado a la Institución</li>
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>Buzón Corporativo: Hasta 5 correos profesionales incluidos (hola@tuempresa.com)</li>
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>Despliegue Semántico y SEO Básico (Indexación y Meta-tags)</li>
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>2 Rondas de Revisiones completas con el equipo de diseño</li>
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>Botón WhatsApp, Integración de Mapas y Formularios dedicados por departamento</li>
              <li class="inc-item"><span class="inc-check"><svg viewBox="0 0 12 12"><polyline points="2,6 5,9 10,3" /></svg></span>Certificado SSL de máxima seguridad e Integración de Analíticas web</li>
`;

// Replace the main body features list (the big ul in the middle of the page)
const oldListMatch = hd.match(/<ul class="plan-card__list">[\s\S]*?<\/ul>/);
if(oldListMatch) {
  hd = hd.replace(oldListMatch[0], `<ul class="plan-card__list">\n${featuresList}\n            </ul>`);
}

// Replace the black plan-card sidebar list
const oldSidebarList = hd.match(/<ul class="plan-card__features" style="font-size:var\(--text-sm\);color:inherit;opacity:\.8">[\s\S]*?<\/ul>/);
const newSidebarList = `
        <ul class="plan-card__features" style="font-size:var(--text-sm);color:inherit;opacity:.8">
          <li style="display:flex;align-items:flex-start;gap:var(--space-2)"><span style="color:var(--accent)">✓</span> 7 Páginas principales</li>
          <li style="display:flex;align-items:flex-start;gap:var(--space-2)"><span style="color:var(--accent)">✓</span> 8 Secciones promedio</li>
          <li style="display:flex;align-items:flex-start;gap:var(--space-2)"><span style="color:var(--accent)">✓</span> 5 Correos profesionales</li>
          <li style="display:flex;align-items:flex-start;gap:var(--space-2)"><span style="color:var(--accent)">✓</span> SEO corporativo básico</li>
          <li style="display:flex;align-items:flex-start;gap:var(--space-2)"><span style="color:var(--accent)">✓</span> 2 Rondas de revisión</li>
          <li style="display:flex;align-items:flex-start;gap:var(--space-2)"><span style="color:var(--accent)">✓</span> 100% Personalizado y Responsivo</li>
        </ul>`;
if(oldSidebarList) {
  hd = hd.replace(oldSidebarList[0], newSidebarList);
}

// Ideal para
hd = hd.replace(/<strong>Ideal para:<\/strong> pequeños negocios locales, profesionistas o campañas express\./, '<strong>Ideal para:</strong> Consultoras, despachos legales, constructoras locales o firmas de servicios que ya requieren formalidad corporativa.');

// Otros planes disponibles (Plan nav grid)
hd = hd.replace(/<span class="plan-nav__name">Económico<\/span>/g, '<span class="plan-nav__name">Bronce</span>');
hd = hd.replace(/<span class="plan-nav__name">Emprendedor<\/span>/g, '<span class="plan-nav__name">Silver</span>');
hd = hd.replace(/<span class="plan-nav__name">Emprendedor Pro<\/span>/g, '<span class="plan-nav__name">Gold</span>');
hd = hd.replace(/<span class="plan-nav__name">Emprendedor Plus<\/span>/g, '<span class="plan-nav__name">Platino</span>');
hd = hd.replace(/<span class="plan-nav__name">Emprendedor Avanzado<\/span>/g, '<span class="plan-nav__name">Diamante</span>');
hd = hd.replace(/<span class="plan-nav__name">Emprendedor Elite<\/span>/g, '<span class="plan-nav__name">Esmeralda</span>');

// Nav links were already correctly pointing to bronce/silver/etc in the initial generation, let's just make absolutely sure:
hd = hd.replace(/"\/servicios\/sitios-corporativos\/bronce"/g, '"/servicios/sitios-corporativos/bronce.html"');
hd = hd.replace(/"\/servicios\/sitios-corporativos\/silver"/g, '"/servicios/sitios-corporativos/silver.html"');
hd = hd.replace(/"\/servicios\/sitios-corporativos\/gold"/g, '"/servicios/sitios-corporativos/gold.html"');
hd = hd.replace(/"\/servicios\/sitios-corporativos\/platino"/g, '"/servicios/sitios-corporativos/platino.html"');
hd = hd.replace(/"\/servicios\/sitios-corporativos\/diamante"/g, '"/servicios/sitios-corporativos/diamante.html"');
hd = hd.replace(/"\/servicios\/sitios-corporativos\/esmeralda"/g, '"/servicios/sitios-corporativos/esmeralda.html"');

fs.writeFileSync('servicios/sitios-corporativos/bronce.html', hd, 'utf8');
console.log('Bronce refined!');
