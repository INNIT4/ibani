const fs = require('fs');

let content = fs.readFileSync('servicios/sitios-corporativos/bronce.html', 'utf8');

// The replacement logic for plan-nav items
const correctNavHtml = `
        <p class="plan-nav__label">Planes corporativos disponibles</p>
        <div class="plan-nav__grid">
          <a href="/servicios/sitios-corporativos/bronce.html" class="plan-nav__item current">
            <span class="plan-nav__item-num">Plan 01</span>
            <span class="plan-nav__item-name">Sitio Bronce</span>
            <span class="plan-nav__item-price">$22,000 MXN</span>
          </a>
          <a href="/servicios/sitios-corporativos/silver.html" class="plan-nav__item">
            <span class="plan-nav__item-num">Plan 02</span>
            <span class="plan-nav__item-name">Sitio Silver</span>
            <span class="plan-nav__item-price">$25,000 MXN</span>
          </a>
          <a href="/servicios/sitios-corporativos/gold.html" class="plan-nav__item">
            <span class="plan-nav__item-num">Plan 03</span>
            <span class="plan-nav__item-name">Sitio Gold</span>
            <span class="plan-nav__item-price">$29,000 MXN</span>
          </a>
          <a href="/servicios/sitios-corporativos/platino.html" class="plan-nav__item">
            <span class="plan-nav__item-num">Plan 04</span>
            <span class="plan-nav__item-name">Sitio Platino</span>
            <span class="plan-nav__item-price">$34,000 MXN</span>
          </a>
          <a href="/servicios/sitios-corporativos/diamante.html" class="plan-nav__item">
            <span class="plan-nav__item-num">Plan 05</span>
            <span class="plan-nav__item-name">Sitio Diamante</span>
            <span class="plan-nav__item-price">$38,000 MXN</span>
          </a>
          <a href="/servicios/sitios-corporativos/esmeralda.html" class="plan-nav__item">
            <span class="plan-nav__item-num">Plan 06</span>
            <span class="plan-nav__item-name">Sitio Esmeralda</span>
            <span class="plan-nav__item-price">$44,500 MXN</span>
          </a>
        </div>
`;

// match the whole nav block
const navRegex = /<p class="plan-nav__label">Otros planes disponibles<\/p>\s*<div class="plan-nav__grid">[\s\S]*?<\/div>/;
content = content.replace(navRegex, correctNavHtml);

// Just make sure any straggler dynamic strings are gone in <a> class
content = content.replace(/ \$\{currentSlug === '.*?' \? 'current' : ''\}/g, '');

fs.writeFileSync('servicios/sitios-corporativos/bronce.html', content, 'utf8');

console.log('Fixed nav panel on Bronce!');
