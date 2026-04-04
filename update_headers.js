const fs = require('fs');
const path = require('path');

const newHeader = `<header class="header" id="header">
    <div class="container header__inner">
      <a href="/" class="logo" aria-label="IBANI Digital">
        <span class="logo__name">IBANI</span>
        <span class="logo__sub">Digital</span>
      </a>
      <nav class="nav" aria-label="Navegación principal">
        <ul class="nav__list">
          <li><a href="/" class="nav__link">Inicio</a></li>
          <li class="nav__item--has-dropdown">
            <a href="/servicios" class="nav__link">Servicios <span class="nav__caret">▾</span></a>
            <div class="nav__dropdown nav__dropdown--wide">
              <p class="nav__dropdown__label">¿Qué necesitas?</p>
              <a href="/servicios#landing">
                <span class="dd-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="1" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M4 13h6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M7 10v3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                </span>
                <span class="dd-content"><strong>Landing Pages</strong><small>desde $4,500 MXN</small></span>
              </a>
              <a href="/servicios/sitios-corporativos">
                <span class="dd-icon">🏢</span>
                <span class="dd-content"><strong>Sitios Corporativos</strong><small>desde $22,000 MXN</small></span>
              </a>
              <a href="/servicios#tiendas">
                <span class="dd-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M1 1h1.5l1.8 7h6.4l1.3-5H4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6" cy="12" r="1" fill="currentColor"/><circle cx="11" cy="12" r="1" fill="currentColor"/></svg>
                </span>
                <span class="dd-content"><strong>Tiendas Online</strong><small>precio a consulta</small></span>
              </a>
              <a href="/servicios#rifas">
                <span class="dd-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M4 6h6M4 9h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                </span>
                <span class="dd-content"><strong>Plataformas de Rifas</strong><small>desde $5,000/mes</small></span>
              </a>
              <a href="/servicios#software">
                <span class="dd-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="1" y="1" width="12" height="12" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M4 5h6M4 8h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                </span>
                <span class="dd-content"><strong>Software Administrativo</strong><small>desde $6,000 MXN</small></span>
              </a>
              <a href="/servicios#citas">
                <span class="dd-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" stroke-width="1.4"/><path d="M5 1v2M9 1v2M2 5h10" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                </span>
                <span class="dd-content"><strong>Sistema de Reservaciones</strong><small>Precio a consulta</small></span>
              </a>
              <a href="/servicios#sistemas">
                <span class="dd-icon">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7h10M7 2v10M4 4l6 6M10 4l-6 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                </span>
                <span class="dd-content"><strong>Sistemas a Medida</strong><small>Precio a consulta</small></span>
              </a>
            </div>
          </li>
          <li><a href="/portafolio" class="nav__link">Portafolio</a></li>
          <li><a href="/proceso"    class="nav__link">Proceso</a></li>
          <li><a href="/blog"       class="nav__link">Blog</a></li>
        </ul>
        <a href="https://wa.me/526625044016?text=Hola%2C%20me%20interesa%20una%20p%C3%A1gina%20web%20con%20IBANI%20Digital."
           target="_blank" rel="noopener noreferrer" class="btn btn--primary" style="padding:0.7rem 1.5rem">Cotizar →</a>
        <button class="nav__toggle" aria-label="Menú" aria-expanded="false" style="padding:4px 0">
          <span></span><span></span><span></span>
        </button>
      </nav>
    </div>
    <div class="nav__mobile" role="navigation" aria-label="Menú móvil">
      <a href="/">Inicio</a>
      <a href="/servicios" style="margin-bottom:0.2rem">Servicios:</a>
      <a href="/servicios#landing"      style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Landing Pages</a>
      <a href="/servicios/sitios-corporativos" style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Sitios Corporativos</a>
      <a href="/servicios#tiendas"      style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Tiendas Online</a>
      <a href="/servicios#rifas"        style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Plataformas de Rifas</a>
      <a href="/servicios#software"     style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Software Admin</a>
      <a href="/servicios#citas"        style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Citas / Reservas</a>
      <a href="/servicios#sistemas"     style="font-size:1.4rem;padding-left:1.2rem;color:var(--ink-2)">↳ Sistemas a Medida</a>
      <a href="/portafolio" style="margin-top:0.4rem">Portafolio</a>
      <a href="/proceso">Proceso</a>
      <a href="/blog">Blog</a>
      <a href="https://wa.me/526625044016" target="_blank" rel="noopener noreferrer" style="color:var(--accent);margin-top:0.5rem">Contactar →</a>
    </div>
  </header>`;

function updateHeaders(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      updateHeaders(fullPath);
    } else if (fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Match both formats of header tags
      const regex1 = /<header class="header"[^>]*>[\s\S]*?<\/header>/ig;
      const regex2 = /<header id="header"[^>]*>[\s\S]*?<\/header>/ig;
      const regex3 = /<header role="banner"[^>]*>[\s\S]*?<\/header>/ig;
      
      let newContent = content.replace(regex1, newHeader);
      // In case regex1 didn't match (index.html is <header id="header" class="header">)
      if (newContent === content) {
        newContent = content.replace(regex2, newHeader);
      }
      if (newContent === content) {
        newContent = content.replace(regex3, newHeader);
      }
      
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log("Updated header in " + fullPath);
      }
    }
  }
}

updateHeaders('.');
