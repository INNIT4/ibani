const fs = require("fs");
let file = "servicios.html";
let content = fs.readFileSync(file, "utf8");

// 1. Update pills
content = content.replace(
  '<a href="#tiendas"      class="svc-nav__pill"><span class="svc-nav__pill-num">02</span> Tiendas Online</a>',
  '<a href="/servicios/sitios-corporativos" class="svc-nav__pill"><span class="svc-nav__pill-num">02</span> Sitios Corporativos</a>\n          <a href="#tiendas"      class="svc-nav__pill"><span class="svc-nav__pill-num">03</span> Tiendas Online</a>'
);
content = content.replace('<span class="svc-nav__pill-num">03</span> Rifas', '<span class="svc-nav__pill-num">04</span> Rifas');
content = content.replace('<span class="svc-nav__pill-num">04</span> Software Administrativo', '<span class="svc-nav__pill-num">05</span> Software Administrativo');
content = content.replace('<span class="svc-nav__pill-num">05</span> Citas Online', '<span class="svc-nav__pill-num">06</span> Citas Online');
content = content.replace('<span class="svc-nav__pill-num">06</span> Sistemas a Medida', '<span class="svc-nav__pill-num">07</span> Sistemas a Medida');

// 2. Update section blocks headers
content = content.replace('<!-- 02 · TIENDAS ONLINE', '<!-- 03 · TIENDAS ONLINE');
content = content.replace('aria-hidden="true">02</div>', 'aria-hidden="true">03</div>');
content = content.replace('<span class="svc-content__index-label">Servicio 02</span>', '<span class="svc-content__index-label">Servicio 03</span>');

content = content.replace('<!-- 03 · RIFAS ONLINE', '<!-- 04 · RIFAS ONLINE');
content = content.replace('aria-hidden="true">03</div>', 'aria-hidden="true">04</div>');
content = content.replace('<span class="svc-content__index-label">Servicio 03</span>', '<span class="svc-content__index-label">Servicio 04</span>');

content = content.replace('<!-- 04 · SOFTWARE', '<!-- 05 · SOFTWARE');
content = content.replace('aria-hidden="true">04</div>', 'aria-hidden="true">05</div>');
content = content.replace('<span class="svc-content__index-label">Servicio 04</span>', '<span class="svc-content__index-label">Servicio 05</span>');

content = content.replace('<!-- 05 · CITAS ONLINE', '<!-- 06 · CITAS ONLINE');
content = content.replace('aria-hidden="true">05</div>', 'aria-hidden="true">06</div>');
content = content.replace('<span class="svc-content__index-label">Servicio 05</span>', '<span class="svc-content__index-label">Servicio 06</span>');

content = content.replace('<!-- 06 · SISTEMAS A MEDIDA', '<!-- 07 · SISTEMAS A MEDIDA');
content = content.replace('aria-hidden="true">06</div>', 'aria-hidden="true">07</div>');
content = content.replace('<span class="svc-content__index-label">Servicio 06</span>', '<span class="svc-content__index-label">Servicio 07</span>');

// 3. Inject new block for Sitios Corporativos right after Landing pages block ends
let blockCode = `
    <!-- ══════════════════════════════════════════════════════════ -->
    <!-- 02 · SITIOS CORPORATIVOS                                  -->
    <!-- ══════════════════════════════════════════════════════════ -->
    <section class="svc-block" id="corporativos">
      <div class="svc-block__bg-num" aria-hidden="true">02</div>
      <div class="container">
        <div class="svc-block__inner">
          <div class="svc-content">
            <div class="svc-content__index reveal s3d-r">
              <span class="svc-content__index-line"></span>
              <span class="svc-content__index-label">Servicio 02</span>
            </div>
            <h2 class="svc-content__title reveal s3d-r" style="--delay:.08s">
              Sitios web<br><em>Corporativos</em>
            </h2>
            <p class="svc-content__text reveal s3d-r" style="--delay:.14s">
              Desarrollamos la presencia institucional de tu empresa en internet con un sitio completo de múltiples páginas: Inicio, Servicios, Nosotros, Contacto y más.
            </p>
            <p class="svc-content__text reveal s3d-r" style="--delay:.18s">
              Incluye diseño web profesional para Desktop y Celulares, dominio, correos con tu marca, revisiones garantizadas y SEO Básico. La solución corporativa integral.
            </p>
            <div class="svc-content__divider reveal" style="--delay:.22s"></div>
            <div class="svc-content__tags reveal" style="--delay:.26s">
              <span class="svc-tag">Múltiples páginas</span>
              <span class="svc-tag">Correos profesionales</span>
              <span class="svc-tag">Institucional</span>
              <span class="svc-tag">15 días</span>
            </div>
            <a href="/servicios/sitios-corporativos" class="svc-cta reveal" style="--delay:.32s">
              Ver planes corporativos
              <span class="svc-cta__arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 13 L13 3 M6 3 H13 V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </span>
            </a>
          </div>
          <div class="svc-visual reveal s3d-l" style="--delay:.1s">
             <!-- Placeholder empty for now -->
             <div class="svc-img-frame" style="background:#ddd;display:flex;align-items:center;justify-content:center;color:#666">
               <img src="/img/proyectos/lamina-floresta.jpg" alt="Sitio Corporativo diseñado por IBANI Digital" loading="lazy" width="1200" height="900" style="object-fit:cover">
             </div>
          </div>
        </div>
      </div>
    </section>
`;

let searchMarker = '          </div>\n\n        </div>\n      </div>\n    </section>\n\n    <!-- ══════════════════════════════════════════════════════════ -->\n    <!-- 02 · TIENDAS ONLINE                                       -->';

if (content.indexOf('<!-- 02 · SITIOS CORPORATIVOS') === -1) {
    content = content.replace('    <!-- ══════════════════════════════════════════════════════════ -->\n    <!-- 03 · TIENDAS ONLINE', blockCode + '\n    <!-- ══════════════════════════════════════════════════════════ -->\n    <!-- 03 · TIENDAS ONLINE');
}

fs.writeFileSync(file, content);
console.log("Updated servicios.html with block 02");
