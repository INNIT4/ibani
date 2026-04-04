const fs = require('fs');

// Bronce is the master template now — perfectly refined
const master = fs.readFileSync('servicios/sitios-corporativos/bronce.html', 'utf8');

const plans = [
  {
    slug: 'silver', name: 'Silver', num: '02', numPad: '02', price: '$25,000 MXN', priceRaw: '25,000', priceEnc: '%2425%2C000%20MXN',
    pages: '10', secciones: '8',
    currentClass: 'silver',
    qA: 'Crecimiento de la matriz corporativa a 10 páginas. Un sistema web con mayor anchura navegacional para empresas con departamentos segmentados o portafolio extenso.',
    qFor: 'Ideal para constructoras, agencias o empresas que necesitan dedicar una página entera a cada especialidad, producto o unidad de servicio.',
    qEx: 'Imagina una empresa constructora.<br><span style="display:block;margin-top:6px;padding-left:12px;border-left:2px solid var(--accent);font-size:0.95em;display:flex;flex-direction:column;gap:4px;"><span><strong>1. Inicio Institucional:</strong> Perfil directivo y misión.</span><span><strong>2-7. (Especialidades):</strong> Asfalto, Obra Civil, Remodelaciones, Proyectos, Maquinaria, Permisos.</span><span><strong>8. Portafolio de Obras:</strong> Catálogo de proyectos culminados.</span><span><strong>9. Bolsa de Trabajo / Maquinaria en Renta:</strong> Landing paralela estratégica.</span><span><strong>10. Contacto y Solicitud de Cotización.</strong></span></span>',
    idealFor: 'Constructoras, agencias de publicidad, hospitales o empresas con múltiples departamentos que necesitan una página dedicada para cada uno.',
    sidebarItems: ['10 páginas principales', '8 secciones promedio', 'Correos profesionales incluidos', 'SEO corporativo básico', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    specPages: '10', specSec: '8',
    renewalPrice: '$1,800 MXN/año',
    deliveryDays: '15 días',
  },
  {
    slug: 'gold', name: 'Gold', num: '03', numPad: '03', price: '$29,000 MXN', priceRaw: '29,000', priceEnc: '%2429%2C000%20MXN',
    pages: '15', secciones: '8',
    currentClass: 'gold',
    qA: 'La matriz estándar corporativa con alcance dinámico de 15 páginas. Integración nativa a blogs informacionales, taxonomías y categorías activas para SEO pasivo.',
    qFor: 'Instituciones educativas, aseguradoras o medios corporativos que dependen de la publicación activa de contenidos para incrementar su tráfico orgánico mes a mes.',
    qEx: 'Imagina un sistema universitario privado.<br><span style="display:block;margin-top:6px;padding-left:12px;border-left:2px solid var(--accent);font-size:0.95em;display:flex;flex-direction:column;gap:4px;"><span><strong>1. Campus Principal:</strong> Presentación e historial de logros.</span><span><strong>2-6. (Oferta Académica):</strong> Carreras, Maestrías, Doctorados, Cursos, Seminarios.</span><span><strong>7-8. Becas, Admisiones y Proceso de Ingreso.</strong></span><span><strong>9-15. Blog y Noticias Universitarias:</strong> Ecosistema dinámico que atrae prospectos de forma orgánica.</span></span>',
    idealFor: 'Corporativos con necesidad de publicar contenido frecuente como noticias, artículos de blog o novedades de industria para posicionarse en buscadores.',
    sidebarItems: ['15 páginas principales', '8 secciones promedio', 'Correos profesionales incluidos', 'SEO corporativo + Blog activo', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    specPages: '15', specSec: '8',
    renewalPrice: '$2,100 MXN/año',
    deliveryDays: '15 días',
  },
  {
    slug: 'platino', name: 'Platino', num: '04', numPad: '04', price: '$34,000 MXN', priceRaw: '34,000', priceEnc: '%2434%2C000%20MXN',
    pages: '20', secciones: '9',
    currentClass: 'platino',
    qA: 'Extensión máxima modular. Sitio web de 20 subpáginas construido para empresas con operaciones a gran escala o divisiones muy contrastantes organizadas bajo un solo paraguas.',
    qFor: 'Corporativos que manejan divisiones independientes (B2B, B2C, Inversiones, Manufactura) y necesitan agruparlas internamente sin confundir al usuario.',
    qEx: 'Imagina una red nacional de logística y aduanas.<br><span style="display:block;margin-top:6px;padding-left:12px;border-left:2px solid var(--accent);font-size:0.95em;display:flex;flex-direction:column;gap:4px;"><span><strong>20 páginas organizando:</strong> Importación, Exportación, Seguros Aduanales, Cadena de Frío, Rastreo Satelital, Intranet de personal, Bolsa de Trabajo, Cotizaciones Online — todo bajo un solo dominio central.</span></span>',
    idealFor: 'Grupos empresariales con múltiples divisiones B2B y B2C, franquicias con catálogos extensos, o empresas con necesidades informativas masivas.',
    sidebarItems: ['20 páginas principales', '9 secciones promedio', 'Correos profesionales incluidos', 'SEO corporativo avanzado', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    specPages: '20', specSec: '9',
    renewalPrice: '$2,400 MXN/año',
    deliveryDays: '15 días',
  },
  {
    slug: 'diamante', name: 'Diamante', num: '05', numPad: '05', price: '$38,000 MXN', priceRaw: '38,000', priceEnc: '%2438%2C000%20MXN',
    pages: '25', secciones: '9',
    currentClass: 'diamante',
    qA: 'Mega despliegue ejecutivo de 25 páginas. Ideal para empresas que requieren páginas exclusivas de soporte, talento, perfiles regionales y sub-marcas dentro de un mismo ecosistema web.',
    qFor: 'Franquicias a nivel república, grupos restauranteros o redes de retail que necesitan páginas independientes por estado o ciudad con promociones locales formales.',
    qEx: 'Imagina una casa financiera y crediticia multinacional.<br><span style="display:block;margin-top:6px;padding-left:12px;border-left:2px solid var(--accent);font-size:0.95em;display:flex;flex-direction:column;gap:4px;"><span><strong>25 páginas absolutas:</strong> Crédito Personal, Crédito Nómina, Refaccionario, Tarjetas Empresariales — cada una con sus propias tablas de amortización interactivas y perfiles de sucursales por ciudad.</span></span>',
    idealFor: 'Empresas con presencia nacional que requieren páginas dedicadas por región, servicio o filial con información y diseño completamente individualizado.',
    sidebarItems: ['25 páginas principales', '9 secciones promedio', 'Correos profesionales incluidos', 'SEO corporativo avanzado multi-página', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    specPages: '25', specSec: '9',
    renewalPrice: '$2,700 MXN/año',
    deliveryDays: '15 días',
  },
  {
    slug: 'esmeralda', name: 'Esmeralda', num: '06', numPad: '06', price: '$44,500 MXN', priceRaw: '44,500', priceEnc: '%2444%2C500%20MXN',
    pages: '30', secciones: '9',
    currentClass: 'esmeralda',
    qA: 'El grado final: 30 subpáginas que operan como ecosistemas digitales simultáneos con mega-navegaciones anidadas y arquitecturas de información a nivel corporativo global.',
    qFor: 'Compañías paraguas, grandes armadoras o grupos industriales que importan decenas de modelos, catálogos de repuestos y manejan bases informativas saturadas de keywords SEO.',
    qEx: 'Imagina el Imperio Web Total.<br><span style="display:block;margin-top:6px;padding-left:12px;border-left:2px solid var(--accent);font-size:0.95em;display:flex;flex-direction:column;gap:4px;"><span><strong>30 pestañas maestras:</strong> Un MegaMenú donde el cursor revela columnas completas de divisiones comerciales. Formularios exclusivos por área, sistemas de seguimiento por unidad de negocio, y dominación absoluta del buscador local con contenido multi-nivel.</span></span>',
    idealFor: 'Corporativos globales, grupos industriales o empresas con ecosistemas informativos masivos que requieren la máxima escala en presencia digital.',
    sidebarItems: ['30 páginas principales', '9 secciones promedio', 'Correos profesionales ilimitados', 'SEO corporativo full coverage', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    specPages: '30', specSec: '9',
    renewalPrice: '$3,500 MXN/año',
    deliveryDays: '15 días',
  }
];

for (const p of plans) {
  let hd = master;

  // --- SEO ---
  hd = hd.replace(/Plan Corporativo Bronce — IBANI Digital/, `Plan Corporativo ${p.name} — IBANI Digital`);
  hd = hd.replace(/Sitio corporativo Plan Bronce\./, `Sitio corporativo Plan ${p.name}.`);
  hd = hd.replace(/Plan Bronce Corporativo — IBANI Digital/, `Plan ${p.name} Corporativo — IBANI Digital`);
  hd = hd.replace(/sitios-corporativos\/bronce"/, `sitios-corporativos/${p.slug}"`);
  hd = hd.replace(/"price": "22000"/, `"price": "${p.priceRaw.replace(',','')}"`);

  // --- Breadcrumb ---
  hd = hd.replace(/Plan Bronce<\/li>/, `Plan ${p.name}</li>`);

  // --- Tier track (dots): mark correct position active ---
  // bronce has: <span class="tier-seg on"></span> then 5 empty
  // we need plan N-1 "on"
  const numOn = parseInt(p.num) - 1;
  let tierHtml = '';
  for (let i = 0; i < 6; i++) {
    tierHtml += `<span class="tier-seg${i < numOn ? ' on' : ''}"></span> `;
  }
  hd = hd.replace(/<span class="tier-seg on"><\/span> (<span class="tier-seg"><\/span> ){5}/, tierHtml);

  // --- Hero label ---
  hd = hd.replace(/Plan 01 de 6 · Sitios Web/, `Plan ${p.num} de 6 · Corporativos`);
  hd = hd.replace(/Sitio <em>Bronce<\/em>/, `Sitio <em>${p.name}</em>`);
  hd = hd.replace(/\$22,000 MXN<\/span>\s*<span class="plan-hero__price-note">/, `${p.price}</span>\n          <span class="plan-hero__price-note">`);

  // --- Ideal para (hero) ---
  hd = hd.replace(/<strong>Ideal para:<\/strong> Consultoras, despachos legales, constructoras locales o firmas de servicios que ya requieren formalidad corporativa\./, `<strong>Ideal para:</strong> ${p.idealFor}`);

  // --- Descriptions ---
  hd = hd.replace(/Es el arranque de la sede corporativa de la empresa en internet\. Un ecosistema inicial de hasta 7 páginas estratégicas organizadas a través de su propio menú\./, p.qA);
  hd = hd.replace(/Recomendado para consultoras o bufetes de nueva creación que ya requieren presentarse institucionalmente ante clientes, mostrando su catálogo de servicios de forma separada\./, p.qFor);
  hd = hd.replace(/Imagina una firma legal pequeña\.<br><span[\s\S]*?<\/span><\/p>/, `${p.qEx}</p>`);

  // --- Buy buttons ---
  hd = hd.replace(/Plan%20Bronce%20%2422%2C000%20MXN/g, `Plan%20${p.name}%20${p.priceEnc}`);

  // --- Ver todos los planes (hero button) ---
  hd = hd.replace(/href="\/servicios\/landing-pages#planes" class="btn btn--outline">Ver todos los planes/g,
    `href="/servicios/sitios-corporativos" class="btn btn--outline">Ver todos los planes`);

  // --- Black card sidebar ---
  hd = hd.replace(/<p class="plan-card__name">Sitio Bronce<\/p>/, `<p class="plan-card__name">Sitio ${p.name}</p>`);
  hd = hd.replace(/<p class="plan-card__price">\$22,000 MXN<\/p>/, `<p class="plan-card__price">${p.price}</p>`);

  // Sidebar checklist items
  let oldSidebarList = hd.match(/<ul class="plan-card__features"[\s\S]*?<\/ul>/);
  if (oldSidebarList) {
    const newList = `<ul class="plan-card__features" style="font-size:var(--text-sm);color:inherit;opacity:.8">
          ${p.sidebarItems.map(item => `<li style="display:flex;align-items:flex-start;gap:var(--space-2)"><span style="color:var(--accent)">✓</span> ${item}</li>`).join('\n          ')}
        </ul>`;
    hd = hd.replace(oldSidebarList[0], newList);
  }

  // --- Spec table ---
  hd = hd.replace(/<td class="spec-label">Páginas Maestras<\/td>\s*<td class="spec-val">7<\/td>/, 
    `<td class="spec-label">Páginas Maestras</td>\n                    <td class="spec-val">${p.specPages}</td>`);
  hd = hd.replace(/<td class="spec-label">Secciones por página<\/td>\s*<td class="spec-val">8<\/td>/, 
    `<td class="spec-label">Secciones por página</td>\n                    <td class="spec-val">${p.specSec}</td>`);

  // --- Main include list (first 2 lines refer to pages) ---
  hd = hd.replace(/7 Páginas Maestras \(ej\./, `${p.specPages} Páginas Maestras (ej.`);

  // --- Compare table header - highlight current plan column ---
  // plan-1 through plan-6
  hd = hd.replace(/class="compare-table plan-1"/, `class="compare-table plan-${p.num}"`);

  // --- Plan nav: mark current ---
  // Remove all "current" classes and add it to the right one
  hd = hd.replace(/class="plan-nav__item current"/g, 'class="plan-nav__item"');
  hd = hd.replace(new RegExp(`href="/servicios/sitios-corporativos/${p.slug}.html" class="plan-nav__item"`), 
    `href="/servicios/sitios-corporativos/${p.slug}.html" class="plan-nav__item current"`);

  // --- Watermark number ---
  hd = hd.replace(/<span class="plan-watermark" aria-hidden="true">01<\/span>/, `<span class="plan-watermark" aria-hidden="true">${p.num}</span>`);

  // --- CTA section ---
  hd = hd.replace(/Sitio Bronce · \$22,000 MXN · Entrega en 3 días/, `Sitio ${p.name} · ${p.price} · Entrega en ${p.deliveryDays}`);
  hd = hd.replace(/Comprar Sitio Bronce/, `Comprar Sitio ${p.name}`);

  // --- Hero sub-label  ---
  hd = hd.replace(/Sitio Bronce\n/, `Sitio ${p.name}\n`);

  fs.writeFileSync(`servicios/sitios-corporativos/${p.slug}.html`, hd, 'utf8');
  console.log(`✓ ${p.name} generated`);
}

console.log('\nAll 5 corporate plans generated from Bronce master!');
