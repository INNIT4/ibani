const fs = require('fs');

const tp = fs.readFileSync('servicios/sitios-corporativos.html', 'utf8');
const lf = fs.readFileSync('servicios/landing-pages.html', 'utf8');

// Get the bento css block from landing-pages.html
const bentoCssMatch = lf.match(/\/\* ── Includes \/ Bento grid[\s\S]*?\/\* Pricing section \*\//);

if(!bentoCssMatch) {
  console.log("Could not find Bento CSS");
  process.exit();
}
const bentoCss = bentoCssMatch[0].replace('/* Pricing section */', '/* ── Pricing section ─────────────────────────── */');


let newTp = tp;
// Replace features CSS definition
const oldFeaturesCssMatch = tp.match(/\/\* Features grid \*\/[\s\S]*?\/\* Pricing section \*\//);
if(oldFeaturesCssMatch) {
  newTp = newTp.replace(oldFeaturesCssMatch[0], bentoCss + '\n\n    /* Pricing section */');
}

const bentoHTML = `    <!-- WHAT'S INCLUDED -->
    <section class="includes-section">
      <div class="container">

        <div class="includes-intro">
          <div class="section-head reveal s3d-l">
            <div class="section-head__eyebrow"><span class="label">Qué incluye</span></div>
            <h2 class="section-head__title">Todo lo que<br><em>necesitas</em></h2>
          </div>
          <p class="includes-intro__sub reveal s3d-r">
            Infraestructura masiva para escalar operaciones corporativas formales 24/7 sin barreras de información.
          </p>
        </div>

        <div class="bento-grid">

          <!-- Card amplia -->
          <div class="bento-item bento-item--wide reveal s3d-l">
            <div class="bento-icon">🏢</div>
            <div class="bento-item__body">
              <h3 class="bento-item__title">Arquitectura Multi-páginas CMS</h3>
              <p class="bento-item__desc">Diseñados no solo para observarse, sino para crecer a largo plazo. Un robusto Gestor de Contenidos central (CMS) que estructura docenas de departamentos internos, servicios o portafolios masivos en un mismo lugar.</p>
              <span class="bento-item__tag">Plataforma Escalable</span>
            </div>
          </div>

          <!-- Card -->
          <div class="bento-item reveal s3d-r reveal--d1">
            <div class="bento-icon">📊</div>
            <div class="bento-item__body">
              <h3 class="bento-item__title">Sub-divisiones y Organigramas</h3>
              <p class="bento-item__desc">Divide fácilmente servicios B2B o B2C con Pestañas Internas detalladas e independientes para máxima conversión.</p>
            </div>
          </div>

          <!-- Card -->
          <div class="bento-item reveal s3d-u reveal--d1">
            <div class="bento-icon">🔎</div>
            <div class="bento-item__body">
              <h3 class="bento-item__title">Búsquedas Inteligentes</h3>
              <p class="bento-item__desc">Navegación dinámica. Filtra blogs, proyectos de portafolio y resultados con sistemas de Mega Menús anidados.</p>
              <span class="bento-item__tag">Categorización Activa</span>
            </div>
          </div>

          <!-- Card -->
          <div class="bento-item reveal s3d-l reveal--d2">
            <div class="bento-icon">🛡️</div>
            <div class="bento-item__body">
              <h3 class="bento-item__title">Privacidad y Accesos</h3>
              <p class="bento-item__desc">Políticas de cookies estructuradas y encriptaciones SSL integradas (si portas hosting) para proteger data sensible.</p>
            </div>
          </div>

          <!-- Card -->
          <div class="bento-item reveal s3d-u reveal--d2">
            <div class="bento-icon">📈</div>
            <div class="bento-item__body">
              <h3 class="bento-item__title">Dominio Nativo SEO</h3>
              <p class="bento-item__desc">Despliegue semántico óptimo multi-página que enamora al algoritmo de Google. Sube puestos orgánicamente.</p>
              <span class="bento-item__tag">Resultados Pasivos</span>
            </div>
          </div>

          <!-- Card -->
          <div class="bento-item reveal s3d-r reveal--d2">
            <div class="bento-icon">📬</div>
            <div class="bento-item__body">
              <h3 class="bento-item__title">Casillas y Embudos </h3>
              <p class="bento-item__desc">Correos profesionales (hola@tuempresa.com) y sistemas multi-formularios para capturar Leads al departamento correcto.</p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- PRICING -->`;

const oldIncludedHtmlMatch = newTp.match(/<!-- WHAT'S INCLUDED -->[\s\S]*?<!-- PRICING -->/);
if(oldIncludedHtmlMatch) {
  newTp = newTp.replace(oldIncludedHtmlMatch[0], bentoHTML);
}

fs.writeFileSync('servicios/sitios-corporativos.html', newTp, 'utf8');

console.log('Corporativos fully upgraded to Bento Grid features!');
