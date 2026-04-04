const fs = require('fs');

const eco = fs.readFileSync('servicios/landing-pages/economico.html', 'utf8');

const getChunk = (str, start, end) => {
  const i = str.indexOf(start);
  if (i === -1) return null;
  const j = str.indexOf(end, i);
  if (j === -1) return null;
  return str.substring(i, j + end.length);
};

const cssBlock = getChunk(eco, '  <style>', '  </style>');
const compareBlock = getChunk(eco, '<section class="compare">', '</section>');
const extrasBlock = getChunk(eco, '<section id="extras">', '</section>');
const planNavBlock = getChunk(eco, '<section class="plan-nav">', '</section>');
const footerBlock = getChunk(eco, '<footer class="footer">', '</footer>');

const details = {
  'emprendedor': {
    name: 'Emprendedor',
    num: '02',
    price: '$5,500 MXN',
    img: '/img/emprendedor-mockup.png',
    qA: 'Es una plataforma sólida para presentar tus productos. Un sitio de hasta 5 secciones (Inicio, Nosotros, Servicios, Galería y Contacto). Incluye Dominio, Hosting y Certificado SSL listos para ti.',
    qFor: 'Ideal para PyMEs, restaurantes, panaderías, clínicas o tiendas que desean mostrar un catálogo detallado de sus servicios y tener múltiples vías de contacto para sus clientes.',
    qEx: 'Imagina que tienes una panadería local.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Inicio y Galería:</strong> Mostramos tus mejores panes y pasteles con fotos tentadoras.<br><strong>2. Contacto:</strong> Contamos tu historia y añadimos un formulario directo acoplado a WhatsApp para agendar pedidos.</span>',
  },
  'emprendedor-pro': {
    name: 'Emprendedor Pro',
    num: '03',
    price: '$7,500 MXN',
    img: '/img/emprendedor-pro-mockup.png',
    qA: 'Es una web corporativa completa y profesional de hasta 7 páginas. Cuenta con blog autoadministrable, diseño hecho a medida corporativo. Hosting y Dominio incluidos.',
    qFor: 'Ideal para despachos contables, firmas de abogados, consultoras y agencias B2B que necesitan proyectar absoluta autoridad y confianza antes de que el cliente agende una cita.',
    qEx: 'Imagina que tienes un despacho contable y legal.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Servicios y Blog:</strong> Detallas tus especialidades y subes artículos de asesoría que atraen búsqueda de clientes locales.<br><strong>2. Equipo y Citas:</strong> Presentas a los socios de la firma y permites agendar asesorías.</span>',
  },
  'emprendedor-plus': {
    name: 'Emprendedor Plus',
    num: '04',
    price: '$13,000 MXN',
    img: '/img/emprendedor-plus-mockup.png',
    qA: 'Una plataforma web avanzada que integra catálogos dinámicos complejos, listados filtrables y arquitectura enfocada en propiedades inmobiliarias o flotillas. Dominio y hosting ultra-rápido.',
    qFor: 'Ideal para inmobiliarias, agencias automotrices o empresas de renta industrial que necesitan mostrar decenas de activos de forma hermosa, permitiendo filtros y búsquedas dinámicas exactas.',
    qEx: 'Imagina que administras una Agencia de Bienes Raíces.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Buscador Dinámico:</strong> El usuario entra y filtra propiedades directamente (ej. "Casas de 3 recámaras" con jardín).<br><strong>2. Fichas de Propiedades:</strong> Cada casa tiene su propia galería interna y un botón de "Agendar Visita" que va hacia tus vendedores.</span>',
  },
  'emprendedor-avanzado': {
    name: 'Emprendedor Avanzado',
    num: '05',
    price: '$16,000 MXN',
    img: '/img/emprendedor-avanzado-mockup.png',
    qA: 'Una tienda en línea (E-commerce) con carrito de compras, pasarela de pagos, inventario, cálculos de envío automáticos y herramientas de marketing digital. Tu sucursal abierta al mundo 24/7.',
    qFor: 'Ideal para boutiques, proveedores, marcas de moda y mayoristas que desean escalar sus ventas cobrando con tarjeta de crédito desde donde sea en piloto automático.',
    qEx: 'Imagina que tienes una marca de ropa.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Tienda y Catálogo:</strong> El cliente explora la "Nueva Colección", elige talla, color y cantidad y lo añade al carrito.<br><strong>2. Checkout de Pagos:</strong> El sistema calcula mensajerías y cobra seguro con tarjeta para que solo ocupes empaquetar y entregar tu producto.</span>',
  },
  'emprendedor-elite': {
    name: 'Emprendedor Elite',
    num: '06',
    price: '$20,000 MXN',
    img: '/img/emprendedor-elite-mockup.png',
    qA: 'El sistema empresarial definitivo. Un desarrollo que unifica web corporativa, e-learning interno si lo requieres, embudos de ventas complejos y portal integral. El ecosistema maestro.',
    qFor: 'Pensado para corporativos con intranet, SaaS, negocios que requieren flujos de ventas extremadamente personalizados, manejo de usuarios, suscripciones y arquitecturas personalizadas complejas.',
    qEx: 'Imagina que diriges un Corporativo Educativo y Comercial.<br><span style="display: block; margin-top: 6px; padding-left: 12px; border-left: 2px solid var(--accent); font-size: 0.95em;"><strong>1. Portal Empresarial:</strong> Tus clientes adquieren tu servicio online y obtienen un dashboard avanzado para darles seguimiento o ver contenido privado.<br><strong>2. Automatización Comercial:</strong> Completa integración de API para registrar operaciones masivas con extrema seguridad.</span>',
  }
};

const files = ['emprendedor', 'emprendedor-pro', 'emprendedor-plus', 'emprendedor-avanzado', 'emprendedor-elite'];

for (const slug of files) {
  const file = 'servicios/landing-pages/' + slug + '.html';
  let target = fs.readFileSync(file, 'utf8');
  
  const d = details[slug];
  
  // 1. Replace CSS
  const oldCss = getChunk(target, '  <style>', '  </style>');
  if(oldCss && cssBlock) target = target.replace(oldCss, cssBlock);
  
  // 2. Replace Hero
  const oldHero = getChunk(target, '<section class="plan-hero">', '</section>');
  if (oldHero) {
    const newHero = `<section class="plan-hero"> <span class="plan-watermark" aria-hidden="true">${d.num}</span>
      <div class="container plan-hero__inner-grid">
        <div class="plan-hero__content">
        <nav aria-label="Migas de pan" style="margin-bottom:var(--space-8)">
          <ol
            style="display:flex;gap:var(--space-2);align-items:center;list-style:none;padding:0;font-size:var(--text-sm);color:var(--ink-3);flex-wrap:wrap">
            <li><a href="/" style="color:var(--ink-3)">Inicio</a></li>
            <li aria-hidden="true" style="color:var(--border)">›</li>
            <li><a href="/servicios/landing-pages" style="color:var(--ink-3)">Sitios Web</a></li>
            <li aria-hidden="true" style="color:var(--border)">›</li>
            <li aria-current="page" style="color:var(--ink-2)">Plan ${d.name}</li>
          </ol>
        </nav>
        <div class="tier-track anim-l" style="--delay:.05s;max-width:260px">
          <span class="tier-seg on"></span>
          <span class="tier-seg ${parseInt(d.num)>=2?'on':''}"></span>
          <span class="tier-seg ${parseInt(d.num)>=3?'on':''}"></span>
          <span class="tier-seg ${parseInt(d.num)>=4?'on':''}"></span>
          <span class="tier-seg ${parseInt(d.num)>=5?'on':''}"></span>
          <span class="tier-seg ${parseInt(d.num)>=6?'on':''}"></span>
        </div>
        <div class="plan-hero__label anim-l" style="--delay:.1s"> <span class="plan-hero__dot"></span> <span
            class="plan-hero__num">Plan ${d.num} de 6 · Sitios Web</span> </div>
        <h1 class="plan-hero__name anim-l" style="--delay:.18s"> ${d.name.includes(' ') ? 'Plan <em>' + d.name.substring(d.name.indexOf(' ')+1) + '</em>' : 'Plan <em>' + d.name + '</em>'} </h1>
        <div class="plan-hero__price-row anim-l" style="--delay:.26s"> <span class="plan-hero__price">${d.price}</span>
          <span class="plan-hero__price-note">pago único o 50/50</span>
        </div>
        <div class="plan-hero__desc anim-r" style="--delay:.38s">
          <p style="margin-bottom: var(--space-4);"><strong>¿Qué es?</strong><br>
          ${d.qA}</p>

          <p style="margin-bottom: var(--space-4);"><strong>¿Para quién sirve?</strong><br>
          ${d.qFor}</p>

          <p><strong>Un ejemplo estructurado:</strong><br>
          ${d.qEx}
          </p>
        </div>
        <div class="anim-u" style="--delay:.46s;display:flex;gap:var(--space-4);flex-wrap:wrap"> <a
            href="https://wa.me/526625044016?text=Hola%2C%20quiero%20el%20Plan%20${encodeURIComponent(d.name)}%20${encodeURIComponent(d.price)}."
            target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">Comprar ahora →</a> <a
            href="/servicios/landing-pages#planes" class="btn btn--outline">Ver todos los planes</a> </div>
        </div>
        <div class="plan-hero__visual anim-l" style="--delay:.4s">
          <img src="${d.img}" alt="Demo de interfaz de celular Landing Page" loading="lazy">
        </div>
      </div>
    </section>`;
    target = target.replace(oldHero, newHero);
  }

  // 3. Black Card
  // replace <div class="plan-card"> with black card styling and make the label correct
  target = target.replace(/<div class="plan-card">/g, '<div class="plan-card" style="position:sticky;top:90px;background:var(--ink);color:rgba(250,248,241,.8);--border:rgba(250,248,241,.1)">');
  // if already has style, ensure it's black
  target = target.replace(/<div class="plan-card" style=".*?">/g, '<div class="plan-card" style="position:sticky;top:90px;background:var(--ink);color:rgba(250,248,241,.8);--border:rgba(250,248,241,.1)">');
  // replace the text inside plan-card__overline
  target = target.replace(/"plan-card__overline">.*?<\/p>/g, `"plan-card__overline" style="color:var(--accent)">Comienza con el Plan ${d.name}</p>`);
  // Update price in black box
  target = target.replace(/<span class="plan-card__price-val">.*?<\/span>/g, `<span class="plan-card__price-val" style="color:#FFF">${d.price}</span>`);

  // 4. Set Compare 
  const oldCompare = getChunk(target, '<section class="compare">', '</section>');
  if(oldCompare && compareBlock) {
     let newCompare = compareBlock;
     // remove any current tags
     newCompare = newCompare.replace(/class="current"/g, '');
     newCompare = newCompare.replace(/class="tr-foot current"/g, 'class="tr-foot"');
     // based on num index, the td should be nth-child (01=1, 02=2, etc up to 6. But table columns 0=th, 1=1, 2=2...)
     // wait, easier: I can just inject "current" in the right place, but it's simpler to just not have highlighting than breaking the regex. Actually we know where to inject.
     // Economico = 01 -> string "<th><span class="th-name">Económico" -> '<th class="current"><span class="th-name">Económico'
     // I'll skip highlighting in the script for safety, it's better than breaking HTML. Actually, I will highlight!
     const identifiers = {
        '01': '<th><span class="th-name">Económico',
        '02': '<th><span class="th-name">Emprendedor</span>',
        '03': '<th><span class="th-name">Emprendedor Pro',
        '04': '<th><span class="th-name">Emprendedor Plus',
        '05': '<th><span class="th-name">Emprendedor Avanzado',
        '06': '<th><span class="th-name">Emprendedor Elite'
     };
     const idn = identifiers[d.num];
     newCompare = newCompare.replace(idn, idn.replace('<th>', '<th class="current">'));
     target = target.replace(oldCompare, newCompare);
  }

  // 5. Extras
  const oldExtras = getChunk(target, '<section id="extras">', '</section>');
  if(oldExtras && extrasBlock) target = target.replace(oldExtras, extrasBlock);

  // 6. Plan Nav
  const oldPlanNav = getChunk(target, '<section class="plan-nav">', '</section>');
  let newPlanNav = planNavBlock;
  // Make sure the current plan active highlighted is this one
  newPlanNav = newPlanNav.replace(/class="plan-nav__item current"/g, 'class="plan-nav__item"');
  newPlanNav = newPlanNav.replace(`a href="/servicios/landing-pages/${slug}" class="plan-nav__item"`, `a href="/servicios/landing-pages/${slug}" class="plan-nav__item current"`);
  if(oldPlanNav && newPlanNav) target = target.replace(oldPlanNav, newPlanNav);

  // 7. Footer
  const oldFooter = getChunk(target, '<footer class="footer">', '</footer>');
  if(oldFooter && footerBlock) target = target.replace(oldFooter, footerBlock);

  fs.writeFileSync(file, target, 'utf8');
  console.log('Synced ' + slug);
}
