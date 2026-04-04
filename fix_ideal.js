const fs = require('fs');

const idealTexts = {
  bronce: 'Consultoras, despachos jurídicos, médicos independientes o cualquier firma de servicios profesionales que ya opera formalmente y necesita una sede web institucional de primer nivel para captación corporativa.',
  silver: 'Empresas en crecimiento con múltiples especialidades o servicios diferenciados: constructoras, agencias, hospitales y grupos de consultoría que requieren una página dedicada exclusiva para cada departamento o línea de negocio.',
  gold: 'Instituciones educativas, aseguradoras, medios corporativos o cualquier organización que depende de la publicación activa de contenido para generar tráfico orgánico y captar prospectos mes a mes sin invertir en publicidad.',
  platino: 'Grupos empresariales con divisiones contrastantes (B2B, B2C, logística, manufactura) que operan bajo un mismo nombre corporativo y necesitan presentar cada área con su propia identidad dentro de un portal único y coherente.',
  diamante: 'Franquicias nacionales, redes financieras, grupos retailers o consorcios con presencia en múltiples estados que requieren páginas individualizadas por región, sucursal o línea de producto con información y precios locales.',
  esmeralda: 'Corporativos globales, grupos industriales o holdings multinacionales con docenas de divisiones activas, múltiples países de operación y la necesidad de dominar orgánicamente decenas de keywords simultáneos en buscadores.'
};

const plans = ['bronce', 'silver', 'gold', 'platino', 'diamante', 'esmeralda'];

for (const slug of plans) {
  const filepath = `servicios/sitios-corporativos/${slug}.html`;
  let c = fs.readFileSync(filepath, 'utf8');

  // Replace the plan-hero__ideal paragraph content
  c = c.replace(
    /(<p class="plan-hero__ideal anim-r"[^>]*>\s*<strong>Ideal para:<\/strong>\s*)([^<]+)(\s*<\/p>)/,
    `$1${idealTexts[slug]}$3`
  );

  fs.writeFileSync(filepath, c, 'utf8');
  console.log(`✓ ${slug} — Ideal para updated`);
}

console.log('\nAll "Ideal para" texts updated!');
