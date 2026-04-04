const fs = require('fs');

if(!fs.existsSync('servicios/sitios-corporativos')) {
  fs.mkdirSync('servicios/sitios-corporativos');
}

const template = fs.readFileSync('servicios/landing-pages/economico.html', 'utf8');

const plans = [
  { slug: 'bronce', name: 'Bronce', num: '01', price: '$22,000 MXN',
    qA: 'Es el arranque de la sede corporativa de la empresa en internet. Un ecosistema inicial de hasta 7 páginas estratégicas organizadas a través de su propio menú.',
    qFor: 'Recomendado para consultoras o bufetes de nueva creación que ya requieren presentarse institucionalmente ante clientes, mostrando su catálogo de servicios de forma separada.',
    qEx: 'Imagina una firma legal pequeña.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;"><span><strong>1. Inicio:</strong> Presentación institucional.</span><span><strong>2. Nosotros:</strong> La historia del bufete.</span><span><strong>3 a 5. (Servicios):</strong> Pestañas exclusivas y afiladas para Litigio Penal, Divorcios, Corporativo.</span><span><strong>6. Portafolio/Casos:</strong> Victorias recientes en la corte.</span><span><strong>7. Contacto.</strong></span></span>'
  },
  { slug: 'silver', name: 'Silver', num: '02', price: '$25,000 MXN',
    qA: 'Crecimiento de la matriz a 10 páginas. Un sistema web con mucha mayor anchura navegacional para empresas con departamentos segmentados y un portafolio más extenso.',
    qFor: 'Ideal para constructoras, agencias de publicidad u hospitales que necesitan dedicar una página entera a cada una de sus especialidades médicas o unidades de servicio individuales.',
    qEx: 'Imagina una Empresa Constructora.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;"><span><strong>1. Institucional:</strong> Perfil directivo y misión.</span><span><strong>2 a 7. (Especialidades):</strong> Asfalto, Obra Civil, Remodelaciones...</span><span><strong>8. Proyectos/Portafolio:</strong> Catálogo de obras culminadas.</span><span><strong>9. Rentas/Maquinaria:</strong> Landing paralela de equipo.</span><span><strong>10. Contacto General.</strong></span></span>'
  },
  { slug: 'gold', name: 'Gold', num: '03', price: '$29,000 MXN',
    qA: 'La matriz estándar corporativa con un alcance dinámico orgánico de 15 páginas. Integración nativa a blogs informacionales, taxonomías, categorías y sub-categorías.',
    qFor: 'Destinado a instituciones educativas, aseguradoras o medios de comunicación empresarial cuyo modelo de negocio dependa de la publicación activa de contenidos para atracción por SEO.',
    qEx: 'Imagina un Sistema Universitario Privado.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;"><span><strong>1. Principal:</strong> Campus y prestigio académico.</span><span><strong>2-6. (Oferta):</strong> Carreras, Maestrías, Doctorados, Cursos.</span><span><strong>7. Becas y Ayudas y Admisiones.</strong></span><span><strong>8-15. (Noticias/Blog Universitario y Exámenes de Admisión):</strong> Un ecosistema dinámico de reclutamiento vivo.</span></span>'
  },
  { slug: 'platino', name: 'Platino', num: '04', price: '$34,000 MXN',
    qA: 'Extensión máxima modular. Sitio web monumental de 20 subpáginas. Construido específicamente para desentrañar un negocio con operaciones a gran escala o divisiones muy contrastantes.',
    qFor: 'Corporativos que manejan divisiones independientes (B2B, B2C, Inversiones, Manufactura) bajo un solo paraguas maestro que debe englobar todo sin colapsar la experiencia del usuario.',
    qEx: 'Imagina una Red Nacional Logística y Aduanal.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;"><span><strong>Subdividiendo todo ordenadamente:</strong></span><span>20 páginas organizando: Importación, Exportación, Seguros Aduanales, Cadenas de Frío, Intranet, Rastreo satelital interno visual, Bolsa de Trabajo. Todo en un dominio central.</span></span>'
  },
  { slug: 'diamante', name: 'Diamante', num: '05', price: '$38,000 MXN',
    qA: 'Mega despliegue ejecutivo de 25 páginas. Incluye la orquestación y redacción en múltiples niveles jerárquicos de páginas de apoyo para SEO agresivo, grupos satélite e intranet de personal.',
    qFor: 'Empresas como franquicias o grupos restaurantes a nivel república que requieren páginas exclusivas para cada estado e individualizar promociones locales formalmente.',
    qEx: 'Imagina una Casa Financiera y Crediticia Multinacional.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;"><span><strong>25 Páginas Absalutas:</strong> Pestaña de Créditos Personales, Créditos Nómina, Refaccionarios, Tarjetas... cada una abriendo su propio conjunto de sub-páginas, comisiones, tablas de amortización interactiva y perfiles por sucursal a lo largo del país.</span></span>'
  },
  { slug: 'esmeralda', name: 'Esmeralda', num: '06', price: '$44,500 MXN',
    qA: 'El grado final en infraestructuras informáticas web informativas. 30 subpáginas operando como ecosistemas digitales simultáneos con menús ultra complejos y mega-navigaciones.',
    qFor: 'Compañías paraguas mundiales. Grandes armadoras de maquinarias que importan decenas de modelos y catálogos de repuestos informativos estáticos, en los que cada hoja cuenta fuertemente en indexación Google.',
    qEx: 'Imagina el Imperio Web Total.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em; display: flex; flex-direction: column; gap: 4px;"><span><strong>30 pestañas masivas:</strong> Cuidando un MegaMenú donde el cursor pase y revele columnas enormes de divisiones comerciales. Formularios y sistemas de seguimiento únicos inyectados en páginas exclusivas, asegurándole al corporativo el dominio local.</span></span>'
  }
];

let tableHeaders = '';
for(let p of plans) {
   tableHeaders += `<th><span class="th-name">Sitio ${p.name}</span><span class="th-price">${p.price.split(' ')[0]}</span></th>\n`;
}

for(const p of plans) {
  let ht = template;
  
  // Replace SEO titles
  ht = ht.replace(/<title>.*?<\/title>/, `<title>Plan Corporativo ${p.name} — IBANI Digital</title>`);
  ht = ht.replace(/<meta name="description".*?>/, `<meta name="description" content="Sitio corporativo Plan ${p.name}. Estructura monumental en internet.">`);
  ht = ht.replace(/<meta property="og:title".*?>/, `<meta property="og:title" content="Plan ${p.name} Corporativo — IBANI Digital">`);

  // Breadcrumbs fixes
  ht = ht.replace(/<li><a href="\/servicios\/landing-pages".*?>Sitios Web<\/a><\/li>/, `<li><a href="/servicios/sitios-corporativos" style="color:var(--ink-3)">Corporativos</a></li>`);
  ht = ht.replace(/<li aria-current="page".*?>Plan Económico<\/li>/, `<li aria-current="page" style="color:var(--ink-2)">Plan ${p.name}</li>`);

  // Hero Texts
  ht = ht.replace(/Servicio 01 · 6 Planes/, 'Corporativos · Múltiples Páginas');
  ht = ht.replace(/<span class="plan-hero__num">Plan 01 de 6 · Sitios Web<\/span>/, `<span class="plan-hero__num">Sitio ${p.num} de 6 · Corporativos</span>`);
  ht = ht.replace(/Plan <em>Económico<\/em>/, `Sitio <em>${p.name}</em>`);
  ht = ht.replace(/\$3,500 MXN/g, p.price);
  
  // Replace the WhatsApp button text
  ht = ht.replace(/Plan%20Econ%C3%B3mico[^&"]*/g, "Plan%20" + p.name + "%20" + encodeURIComponent(p.price));

  // The Descriptions
  ht = ht.replace(/<p style="margin-bottom: var\(--space-4\);"><strong>¿Qué es\?<\/strong><br>[\s\S]*?<\/p>\s*<\/div>\s*<div class="anim-u"/, 
    `<p style="margin-bottom: var(--space-4);"><strong>¿Qué es?</strong><br>${p.qA}</p>\n<p style="margin-bottom: var(--space-4);"><strong>¿Para quién sirve?</strong><br>${p.qFor}</p>\n<p><strong>Un ejemplo estructurado:</strong><br>${p.qEx}</p>\n</div>\n<div class="anim-u"`);

  // The Mockup Path Fix
  // Since we don't have corp mockup images yet, we will just keep the placeholders we injected earlier
  ht = ht.replace(/img\/eco-desktop/g, 'img/corp-desktop');
  ht = ht.replace(/img\/eco-mobile/g, 'img/corp-mobile');

  // Black Card Sidebar Fixes
  ht = ht.replace(/Comienza con el Plan Económico/, `Comienza con el Sitio ${p.name}`);
  ht = ht.replace(/<span class="plan-card__price-val" style="color:#FFF">\$3,500 MXN<\/span>/, `<span class="plan-card__price-val" style="color:#FFF">${p.price}</span>`);

  // List Items inside Black Card (The Checkmarks)
  // Just generalizing them roughly
  ht = ht.replace(/2 secciones de información — Inicio y Contacto/, `${p.num === '01' ? '7' : (p.num === '02' ? '10' : (p.num === '03' ? '15' : '20+'))} páginas maestras`);

  // Replace Table Headers
  ht = ht.replace(/<thead>[\s\S]*?<\/thead>/, `<thead>\n<tr>\n<th class="th-features">Características</th>\n${tableHeaders}</tr>\n</thead>`);
  
  // Nav Grid
  ht = ht.replace(/\/servicios\/landing-pages\/economico"/g, '/servicios/sitios-corporativos/bronce"');
  ht = ht.replace(/\/servicios\/landing-pages\/emprendedor"/g, '/servicios/sitios-corporativos/silver"');
  ht = ht.replace(/\/servicios\/landing-pages\/emprendedor-pro"/g, '/servicios/sitios-corporativos/gold"');
  ht = ht.replace(/\/servicios\/landing-pages\/emprendedor-plus"/g, '/servicios/sitios-corporativos/platino"');
  ht = ht.replace(/\/servicios\/landing-pages\/emprendedor-avanzado"/g, '/servicios/sitios-corporativos/diamante"');
  ht = ht.replace(/\/servicios\/landing-pages\/emprendedor-elite"/g, '/servicios/sitios-corporativos/esmeralda"');
  
  ht = ht.replace(/Plan Económico/g, 'Sitio Bronce');
  ht = ht.replace(/Plan Emprendedor Pro/g, 'Sitio Gold');
  ht = ht.replace(/Plan Emprendedor Plus/g, 'Sitio Platino');
  ht = ht.replace(/Plan Emprendedor Avanzado/g, 'Sitio Diamante');
  ht = ht.replace(/Plan Emprendedor Elite/g, 'Sitio Esmeralda');
  ht = ht.replace(/Plan Emprendedor/g, 'Sitio Silver'); // Place this below Emprendedor checks to avoid matching sub-strings!

  fs.writeFileSync('servicios/sitios-corporativos/' + p.slug + '.html', ht, 'utf8');
}
console.log('Sub-pages generadas!');
