const fs = require('fs');

// ── MASTER DATA ─────────────────────────────────────────────
const plans = [
  {
    slug: 'bronce', name: 'Bronce', num: '01', planNum: '1',
    price: '$22,000 MXN', priceRaw: '22000', priceEnc: 'Plan%20Bronce%20%2422%2C000%20MXN',
    maintenance: '$7,260', pages: '7', sec: '8',
    watermark: '01',
    idealFor: 'Consultoras, despachos jurídicos, médicos independientes o cualquier firma de servicios profesionales que ya opera formalmente y necesita una sede web institucional de primer nivel.',
    qA: 'Es el arranque de la sede corporativa de la empresa en internet. Un ecosistema inicial de hasta 7 páginas estratégicas organizadas a través de su propio menú de navegación.',
    qFor: 'Recomendado para consultoras o bufetes de nueva creación que ya requieren presentarse institucionalmente ante clientes, mostrando su catálogo de servicios de forma separada.',
    qEx: 'Imagina una firma legal pequeña.',
    sidebarItems: ['7 páginas principales', '8 secciones por página', 'Correos profesionales incluidos', 'SEO corporativo básico', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    exampleTitle: 'Firma Legal Pequeña',
    exampleSub: 'Imaginemos que eres un despacho jurídico.',
    navCurrent: 'bronce',
  },
  {
    slug: 'silver', name: 'Silver', num: '02', planNum: '2',
    price: '$25,000 MXN', priceRaw: '25000', priceEnc: 'Plan%20Silver%20%2425%2C000%20MXN',
    maintenance: '$8,250', pages: '10', sec: '8',
    watermark: '02',
    idealFor: 'Empresas en crecimiento con múltiples especialidades: constructoras, agencias, hospitales y grupos de consultoría que requieren una página exclusiva para cada departamento o línea de negocio.',
    qA: 'Crecimiento de la matriz corporativa a 10 páginas. Un sistema web con mayor anchura navegacional para empresas con departamentos segmentados o portafolio extenso.',
    qFor: 'Ideal para constructoras, agencias o empresas que necesitan dedicar una página entera a cada especialidad, producto o unidad de servicio independiente.',
    qEx: 'Imagina una empresa constructora regional.',
    sidebarItems: ['10 páginas principales', '8 secciones por página', 'Correos profesionales incluidos', 'SEO corporativo básico', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    exampleTitle: 'Empresa Constructora Regional',
    exampleSub: 'Imaginemos que diriges una constructora en expansión.',
    navCurrent: 'silver',
  },
  {
    slug: 'gold', name: 'Gold', num: '03', planNum: '3',
    price: '$29,000 MXN', priceRaw: '29000', priceEnc: 'Plan%20Gold%20%2429%2C000%20MXN',
    maintenance: '$9,570', pages: '15', sec: '8',
    watermark: '03',
    idealFor: 'Instituciones educativas, aseguradoras y organizaciones que dependen de la publicación activa de contenido para generar tráfico orgánico y captar prospectos mes a mes sin invertir en publicidad pagada.',
    qA: 'La matriz estándar corporativa con alcance dinámico de 15 páginas. Integración nativa a blogs, taxonomías y categorías activas para posicionamiento SEO pasivo y acumulativo.',
    qFor: 'Instituciones educativas, aseguradoras o medios corporativos que dependen de publicar contenido activamente para incrementar su tráfico orgánico mes a mes.',
    qEx: 'Imagina un sistema universitario privado.',
    sidebarItems: ['15 páginas principales', '8 secciones por página', 'Correos profesionales incluidos', 'SEO corporativo + Blog activo', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    exampleTitle: 'Sistema Universitario Privado',
    exampleSub: 'Imaginemos que gestionas una institución educativa en crecimiento.',
    navCurrent: 'gold',
  },
  {
    slug: 'platino', name: 'Platino', num: '04', planNum: '4',
    price: '$34,000 MXN', priceRaw: '34000', priceEnc: 'Plan%20Platino%20%2434%2C000%20MXN',
    maintenance: '$11,220', pages: '20', sec: '9',
    watermark: '04',
    idealFor: 'Grupos empresariales con divisiones contrastantes (B2B, B2C, logística, manufactura) que operan bajo un mismo nombre corporativo y necesitan presentar cada área con identidad propia dentro de un portal único.',
    qA: 'Extensión máxima modular de 20 subpáginas. Construido para empresas con operaciones a gran escala o divisiones muy contrastantes bajo un mismo paraguas corporativo.',
    qFor: 'Corporativos que manejan divisiones independientes y necesitan agruparlas internamente sin confundir al usuario ni diluir la marca.',
    qEx: 'Imagina una red nacional de logística y aduanas.',
    sidebarItems: ['20 páginas principales', '9 secciones por página', 'Correos profesionales incluidos', 'SEO corporativo avanzado', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    exampleTitle: 'Red Nacional de Logística y Aduanas',
    exampleSub: 'Imaginemos que administras una red logística con operaciones en varios estados.',
    navCurrent: 'platino',
  },
  {
    slug: 'diamante', name: 'Diamante', num: '05', planNum: '5',
    price: '$38,000 MXN', priceRaw: '38000', priceEnc: 'Plan%20Diamante%20%2438%2C000%20MXN',
    maintenance: '$12,540', pages: '25', sec: '9',
    watermark: '05',
    idealFor: 'Franquicias nacionales, redes financieras, grupos retailers o consorcios con presencia en múltiples estados que requieren páginas individualizadas por región, sucursal o línea de producto.',
    qA: 'Mega despliegue ejecutivo de 25 páginas. Ideal para empresas con páginas exclusivas de soporte, talento, perfiles regionales y sub-marcas dentro de un mismo ecosistema web.',
    qFor: 'Franquicias a nivel república, grupos restauranteros o redes de retail que necesitan páginas independientes por estado con promociones locales formales.',
    qEx: 'Imagina una casa financiera y crediticia multinacional.',
    sidebarItems: ['25 páginas principales', '9 secciones por página', 'Correos profesionales incluidos', 'SEO corporativo avanzado multi-página', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    exampleTitle: 'Casa Financiera y Crediticia',
    exampleSub: 'Imaginemos que operas una institución financiera con múltiples productos.',
    navCurrent: 'diamante',
  },
  {
    slug: 'esmeralda', name: 'Esmeralda', num: '06', planNum: '6',
    price: '$44,500 MXN', priceRaw: '44500', priceEnc: 'Plan%20Esmeralda%20%2444%2C500%20MXN',
    maintenance: '$14,685', pages: '30', sec: '9',
    watermark: '06',
    idealFor: 'Corporativos globales, grupos industriales o holdings multinacionales con docenas de divisiones activas, múltiples países de operación y la necesidad de dominar orgánicamente decenas de keywords simultáneos.',
    qA: 'El grado final: 30 subpáginas que operan como ecosistemas digitales simultáneos con mega-navegaciones anidadas y arquitecturas de información a nivel corporativo global.',
    qFor: 'Compañías paraguas, grandes armadoras o grupos industriales que importan decenas de modelos, catálogos de repuestos y manejan bases informativas saturadas de keywords SEO.',
    qEx: 'Imagina un grupo industrial y fabricante de alcance global.',
    sidebarItems: ['30 páginas principales', '9 secciones por página', 'Correos profesionales ilimitados', 'SEO corporativo full coverage', '2 Rondas de revisión', '100% Personalizado y Responsivo'],
    exampleTitle: 'Grupo Industrial y Fabricante Global',
    exampleSub: 'Imaginemos que lideras un corporativo industrial con múltiples divisiones internacionales.',
    navCurrent: 'esmeralda',
  }
];

// ── READ MASTER (bronce) for CSS/structure ─────────────────
// We'll rebuild each file from the current bronce.html as base
// since bronce has the right CSS and structure (just borked from the regex earlier)
// First let's print what's in bronce to verify
const bronce = fs.readFileSync('servicios/sitios-corporativos/bronce.html', 'utf8');
console.log('Bronce lines:', bronce.split('\n').length);
console.log('Has compare-table:', bronce.includes('compare-table'));
console.log('Has Mantenimiento:', bronce.includes('Mantenimiento'));
console.log('Has corp-example-section:', bronce.includes('corp-example-section'));
