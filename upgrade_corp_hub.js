const fs = require('fs');

let content = fs.readFileSync('servicios/sitios-corporativos.html', 'utf8');

const baseExplanation = `
    <!-- CONCEPT -->
    <section class="section--lg" style="background:var(--bg-2); padding-top: var(--space-16); padding-bottom: var(--space-16);">
      <div class="container">
        <div style="max-width:800px; margin:0 auto; text-align:center">
          <div class="section-head__eyebrow" style="justify-content:center; margin-bottom:var(--space-4)"><span class="label">Concepto Fundamental</span></div>
          <h2 class="section-head__title" style="margin-bottom:var(--space-6)">¿Qué es un <br><em style="color:var(--accent)">Sitio Corporativo?</em></h2>
          <p style="font-size:var(--text-lg); color:var(--ink-2); line-height:1.7; margin-bottom:var(--space-8)">
            A diferencia de una Landing Page de un solo flujo, un sitio corporativo es la <strong>sede oficial, interactiva y robusta de tu empresa</strong>. Cuenta con un menú de navegación complejo, múltiples páginas internas dedicadas a explicar divisiones de la empresa, filosofía, políticas, y atrae a inversores, talento o prospectos VIP mediante pura autoridad.
          </p>
          
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-8); text-align:left; background:var(--bg); border:1px solid var(--border); padding:var(--space-8); border-radius:calc(var(--radius)*1.5)">
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.3rem; margin-bottom:var(--space-3)">¿Para quién NO es?</h3>
              <p style="color:var(--ink-3); line-height:1.6; font-size:calc(var(--text-sm)*1.1)">No es para campañas relámpago de Facebook Ads, ni ofertas exprés de un solo modelo de producto, ni emprendedores ofreciendo su primer servicio informal.</p>
            </div>
            <div>
              <h3 style="font-family:var(--font-display); font-size:1.3rem; margin-bottom:var(--space-3); color:var(--accent)">¿Para quién SÍ es?</h3>
              <p style="color:var(--ink-2); line-height:1.6; font-size:calc(var(--text-sm)*1.1)">Firmas consolidadas, grandes despachos, consultoras B2B, desarrolladoras inmobiliarias y corporativos que requieren múltiples secciones organizacionales (Misión, Equipo, Sucursales, Relación con Inversores).</p>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

if(!content.includes('¿Qué es un <br><em style="color:var(--accent)">Sitio Corporativo?</em>')) {
   content = content.replace('</section>\n\n    <!-- WHAT\'S INCLUDED -->', '</section>\n' + baseExplanation + '\n    <!-- WHAT\'S INCLUDED -->');
}

const updates = {
  'Sitio Bronce': 'Sitio corporativo inicial de 7 páginas. Establece una presencia sólida y formal con espacio suficiente para desglosar detalladamente tus 3 servicios clave.',
  'Sitio Silver': 'Expansión corporativa a 10 páginas. Perfecto si requieres mayor profundidad estructural, destacando 6 servicios y una sección robusta de portafolio o proyectos.',
  'Sitio Gold': '15 páginas. La matriz estándar. Añade integraciones dinámicas como artículos de blog y categorías extendidas para atraer tráfico orgánico pasivo en buscadores.',
  'Sitio Platino': '20 páginas de puro despliegue corporativo. Diseño para firmas a nivel nacional que separan por completo sus divisiones y unidades de negocio internas.',
  'Sitio Diamante': 'Autoridad masiva. 25 páginas internas exclusivas para grupos empresariales complejos que integran múltiples filiales, departamentos y embudos de cotización.',
  'Sitio Esmeralda': 'La plataforma total de 30 páginas maestras. Interfaz extensa dedicada a empresas colosales que controlan masivos ecosistemas de bases informativas.'
};

for(const [name, desc] of Object.entries(updates)) {
  const regex = new RegExp(`(<p class="pc-name">${name}<\/p><\/div>[\\s\\S]*?<hr class="pc-hr">\\s*<p class="pc-payment"[\\s\\S]*?⏱ Entrega en [0-9]+ días<\/p>\\s*<ul class="pc-features">)`);
  // wait, earlier `sitios-corporativos.html` did not have `<p class="pc-desc">` AT ALL inside its pricing card!!
  // Look at lines 231+:
  // <div><span class="pc-badge">Corporativo</span><p class="pc-name">Sitio Bronce</p></div>
  // <div class="pc-price"><span class="pc-currency">$</span>...
  // Ah! There is NO `pc-desc` in corporativos!
  // I must inject the description block below the title div!
}

// Write a regex injector for pc-desc since it doesn't exist
for(const [name, desc] of Object.entries(updates)) {
  const r2 = new RegExp(`(<p class="pc-name">${name}<\/p><\/div>)\\s*(<div class="pc-price">)`);
  content = content.replace(r2, `$1\n            <p class="pc-desc">${desc}</p>\n            $2`);
}

// Add the "Características" outline button to match Landing pages format
// Currently pc-actions only has "Comprar ahora".
// Find: <div class="pc-actions"> ... Comprar ahora ... </div>
const slugs = {
  'Sitio Bronce': 'bronce',
  'Sitio Silver': 'silver',
  'Sitio Gold': 'gold',
  'Sitio Platino': 'platino',
  'Sitio Diamante': 'diamante',
  'Sitio Esmeralda': 'esmeralda'
};

for(const [name, slug] of Object.entries(slugs)) {
   const actionRegex = new RegExp(`(<div class="pc-actions">[\\s\\S]*?)(<\/div>)`, 'g');
   // Wait, there are multiple pc-actions, how do I target the specific plan?
   // I'll grab the whole card HTML by the name
   const cardRegex = new RegExp(`(<p class="pc-name">${name}<\/p>[\\s\\S]*?<div class="pc-actions">\\s*<a href=".*?" target="_blank" rel="noopener noreferrer" class="btn btn--primary">Comprar ahora<\/a>\\s*)(<\/div>)`);
   content = content.replace(cardRegex, `$1<a href="/servicios/sitios-corporativos/${slug}" class="btn btn--outline">Características</a>\n            $2`);
}

fs.writeFileSync('servicios/sitios-corporativos.html', content, 'utf8');
console.log('Hub corporativo updated and prepped with sub-links!');
