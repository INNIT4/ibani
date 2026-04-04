const fs = require('fs');
const path = require('path');

const dir = 'servicios/landing-pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const cssReplacement = `/* ── Plan Nav ────────────────────────────────────────────── */
    .plan-nav {
      padding: var(--space-16) 0;
      border-top: 1px solid var(--border);
      background: var(--bg);
      scroll-margin-top: 72px;
    }

    .plan-nav__label {
      font-size: .82rem;
      font-weight: 600;
      letter-spacing: .06em;
      text-transform: uppercase;
      color: var(--ink-2);
      margin-bottom: var(--space-6);
      display: flex;
      align-items: center;
      gap: var(--space-3);
    }
    .plan-nav__label::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .plan-nav__grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--space-3);
    }

    @media (max-width:1024px) {
      .plan-nav__grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width:560px) {
      .plan-nav__grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .plan-nav__item {
      display: flex;
      flex-direction: column;
      gap: var(--space-1);
      padding: var(--space-6) var(--space-5);
      border: 1px solid var(--border);
      border-radius: calc(var(--radius)*1.5);
      text-decoration: none;
      background: var(--bg-2);
      transition: border-color .2s, background .2s, transform .2s, box-shadow .2s;
    }

    .plan-nav__item:hover {
      border-color: var(--border-2);
      background: var(--bg);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, .08);
    }

    .plan-nav__item.current {
      border-color: var(--accent);
      background: color-mix(in srgb, var(--accent) 8%, transparent);
      pointer-events: none;
    }

    .plan-nav__item-num {
      font-size: .6rem;
      font-weight: 700;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: var(--ink-3);
    }

    .plan-nav__item.current .plan-nav__item-num {
      color: var(--accent);
    }

    .plan-nav__item-name {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--ink);
      line-height: 1.25;
    }

    .plan-nav__item.current .plan-nav__item-name {
      color: var(--accent);
    }

    .plan-nav__item-price {
      font-size: .82rem;
      color: var(--ink-3);
      margin-top: var(--space-1);
      font-weight: 500;
    }

    /* ──`;

const HTML_REPLACEMENT = function(currentSlug) {
  return `<section class="plan-nav">
      <div class="container">
        <p class="plan-nav__label">Otros planes disponibles</p>
        <div class="plan-nav__grid">
          <a href="/servicios/landing-pages/economico" class="plan-nav__item \${currentSlug === 'economico' ? 'current' : ''}">
            <span class="plan-nav__item-num">Plan 01</span>
            <span class="plan-nav__item-name">Económico</span>
            <span class="plan-nav__item-price">$3,500 MXN</span>
          </a>
          <a href="/servicios/landing-pages/emprendedor" class="plan-nav__item \${currentSlug === 'emprendedor' ? 'current' : ''}">
            <span class="plan-nav__item-num">Plan 02</span>
            <span class="plan-nav__item-name">Emprendedor</span>
            <span class="plan-nav__item-price">$5,500 MXN</span>
          </a>
          <a href="/servicios/landing-pages/emprendedor-pro" class="plan-nav__item \${currentSlug === 'emprendedor-pro' ? 'current' : ''}">
            <span class="plan-nav__item-num">Plan 03</span>
            <span class="plan-nav__item-name">Emprendedor Pro</span>
            <span class="plan-nav__item-price">$7,500 MXN</span>
          </a>
          <a href="/servicios/landing-pages/emprendedor-plus" class="plan-nav__item \${currentSlug === 'emprendedor-plus' ? 'current' : ''}">
            <span class="plan-nav__item-num">Plan 04</span>
            <span class="plan-nav__item-name">Emprendedor Plus</span>
            <span class="plan-nav__item-price">$13,000 MXN</span>
          </a>
          <a href="/servicios/landing-pages/emprendedor-avanzado" class="plan-nav__item \${currentSlug === 'emprendedor-avanzado' ? 'current' : ''}">
            <span class="plan-nav__item-num">Plan 05</span>
            <span class="plan-nav__item-name">Emprendedor <br>Avanzado</span>
            <span class="plan-nav__item-price">$16,000 MXN</span>
          </a>
          <a href="/servicios/landing-pages/emprendedor-elite" class="plan-nav__item \${currentSlug === 'emprendedor-elite' ? 'current' : ''}">
            <span class="plan-nav__item-num">Plan 06</span>
            <span class="plan-nav__item-name">Emprendedor Elite</span>
            <span class="plan-nav__item-price">$20,000 MXN</span>
          </a>
        </div>
      </div>
    </section>`;
};

for (const f of files) {
  if (f === 'index.html') continue;
  const fp = path.join(dir, f);
  const slug = path.basename(f, '.html');
  let content = fs.readFileSync(fp, 'utf8');

  // Replace CSS
  const cssStartIdentifier = "/* \u2500\u2500 Plan Nav";
  const cssEndIdentifier = "/* \u2500\u2500 Compare Table";
  const altCssEndIdentifier1 = "/* \u2500\u2500 Feature Comparison Table";

  const cssStartIndex = content.indexOf(cssStartIdentifier);
  let cssEndIndex = content.indexOf(cssEndIdentifier, cssStartIndex);
  if (cssEndIndex === -1) cssEndIndex = content.indexOf(altCssEndIdentifier1, cssStartIndex);

  if (cssStartIndex !== -1 && cssEndIndex !== -1) {
    content = content.substring(0, cssStartIndex) + cssReplacement + content.substring(cssEndIndex + 6);
  }

  // Replace HTML plan nav block
  const htmlStartIdentifier = '<section class="plan-nav">';
  const htmlEndIdentifier = '</section>\n\n    <!-- CTA -->';
  const altHtmlEndIdentifier = '</section>\n    <!-- CTA -->';
  let htmlStartIndex = content.indexOf(htmlStartIdentifier);
  let htmlEndIndex = content.indexOf(htmlEndIdentifier, htmlStartIndex);
  let offset = 10;
  if (htmlEndIndex === -1) {
     htmlEndIndex = content.indexOf(altHtmlEndIdentifier, htmlStartIndex);
     offset = 10;
  }
  if (htmlEndIndex === -1) {
     htmlEndIndex = content.indexOf('</section>', htmlStartIndex);
     offset = 10;
  }

  if (htmlStartIndex !== -1 && htmlEndIndex !== -1) {
    content = content.substring(0, htmlStartIndex) + HTML_REPLACEMENT(slug) + content.substring(htmlEndIndex + offset);
  }

  // Apply specific changes ONLY to economico.html as requested
  if (slug === 'economico') {
      content = content.replace(/<div class=\"extra-card reveal s3d-u\">\s*<div class=\"extra-card__icon\">💬<\/div>\s*<p class=\"extra-card__name\">Chat en línea \(tawk\.to\)<\/p>[\s\S]*?\+ \$500 MXN<\/p>\s*<\/div>/g, '');
      content = content.replace(/<div class=\"extra-card reveal s3d-u\">\s*<div class=\"extra-card__icon\">📍<\/div>\s*<p class=\"extra-card__name\">Publicación en Google Maps<\/p>[\s\S]*?\+ \$2,000 MXN<\/p>\s*<\/div>/g, '');
  }

  // Update compare tables across ALL files if we want them synced
  content = content.replace(/<span class="th-name">Emprendedor Plus<\/span><span class="th-price">\$[0-9,]+<\/span>/g, '<span class="th-name">Emprendedor Plus</span><span class="th-price">$13,000</span>');
  content = content.replace(/<span class="th-name">Emprendedor Avanzado<\/span><span class="th-price">\$[0-9,]+<\/span>/g, '<span class="th-name">Emprendedor Avanzado</span><span class="th-price">$16,000</span>');
  content = content.replace(/<span class="th-name">Emprendedor Elite<\/span><span class="th-price">\$[0-9,]+<\/span>/g, '<span class="th-name">Emprendedor Elite</span><span class="th-price">$20,000</span>');
  
  // They also have "Microempresa" etc in some tables. Let's fix those old ones
  content = content.replace(/<th><span class="th-name">Microempresa<\/span><span class="th-price">\$9,500<\/span><\/th>/g, '<th><span class="th-name">Emprendedor Plus</span><span class="th-price">$13,000</span></th>');
  content = content.replace(/<th><span class="th-name">PyME<\/span><span class="th-price">\$11,500<\/span><\/th>/g, '<th><span class="th-name">Emprendedor Avanzado</span><span class="th-price">$16,000</span></th>');
  content = content.replace(/<th><span class="th-name">Empresarial<\/span><span class="th-price">\$14,000<\/span><\/th>/g, '<th><span class="th-name">Emprendedor Elite</span><span class="th-price">$20,000</span></th>');

  fs.writeFileSync(fp, content, 'utf8');
  console.log('Updated ' + slug);
}
