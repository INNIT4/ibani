const fs = require('fs');
const path = require('path');

const dirs = [
  path.join(__dirname, 'servicios', 'tiendas'),
  path.join(__dirname, 'servicios', 'software-administrativo'),
  path.join(__dirname, 'servicios', 'rifas')
];

for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');

      // 1. Fix Plan Hero layout
      // Look for <section class="plan-hero">
      // Ensure <div class="container plan-hero__inner-grid"> <div class="plan-hero__content"> ... </div> <div class="plan-hero__visual"> ... </div> </div>
      if (content.includes('<section class="plan-hero">') && !content.includes('plan-hero__inner-grid')) {
        content = content.replace(
          /<div class="container">([\s\S]*?)<\/section>/,
          `<div class="container plan-hero__inner-grid">
        <div class="plan-hero__content">
$1
        </div>
        <div class="plan-hero__visual anim-l" style="--delay:.4s">
          <img class="mc-desktop" src="/img/placeholder-desk.png" alt="Demo de interfaz" loading="lazy" onerror="this.src='https://via.placeholder.com/1200x800/1A1714/FFFFFF?text=Demo'">
          <img class="mc-mobile" src="/img/placeholder-mob.png" alt="Demo móvil" loading="lazy" onerror="this.src='https://via.placeholder.com/400x800/FAF8F1/1A1714?text=Movil'">
        </div>
      </div>
    </section>`
        );
      }

      // 2. Fix Plan Card
      if (content.includes('class="plan-card__price"') && !content.includes('class="plan-card__payment"')) {
        content = content.replace(
          /(<p class="plan-card__price">.*?<\/p>)/,
          '$1\n              <p class="plan-card__payment">pago único o 50/50</p>'
        );
      }
      
      // Fix plan-card cta button text formatting if it has color:rgba
      content = content.replace(/style="color:rgba\(250,248,241,\.5\);border-color:rgba\(255,255,255,\.12\)"/g, 
        'style="color:rgba(250,248,241,.5);border-color:rgba(255,255,255,.12); margin-top: 8px;"');

      // 3. Inject Servicios Extra before Compare Section
      if (content.includes('<section class="compare-section">') && !content.includes('class="extras-section"')) {
        const extrasHtml = `
    <section class="extras-section" id="servicios-extra">
      <div class="container">
        <div class="extras-head reveal s3d-l">
          <div>
            <h2 class="extras-title">Servicios <em>Extra</em></h2>
            <p class="extras-subtitle">Agrega potencia a tu plan base con estas integraciones opcionales bajo demanda.</p>
          </div>
        </div>
        <div class="extras-grid reveal">
          <div class="extra-card">
            <div style="display:flex; gap:var(--space-4); align-items:flex-start;">
              <div class="extra-card__icon">⚡</div>
              <div style="display:flex; flex-direction:column; gap:var(--space-2); flex:1;">
                <h3 class="extra-card__name">Módulo Adicional a Medida</h3>
                <p class="extra-card__desc">Agregamos funcionalidades específicas que tu modelo de negocio requiera.</p>
                <p class="extra-card__price">Desde $3,500 <small style="font-size:0.6em; color:var(--ink-3); font-weight:400; text-transform:none; letter-spacing:0;">MXN / pago único</small></p>
              </div>
            </div>
          </div>
          <div class="extra-card">
            <div style="display:flex; gap:var(--space-4); align-items:flex-start;">
              <div class="extra-card__icon">🌐</div>
              <div style="display:flex; flex-direction:column; gap:var(--space-2); flex:1;">
                <h3 class="extra-card__name">Mantenimiento y Soporte Mensual</h3>
                <p class="extra-card__desc">Actualizaciones de productos, cambios de precios y soporte técnico garantizado 24/7.</p>
                <p class="extra-card__price">$990 <small style="font-size:0.6em; color:var(--ink-3); font-weight:400; text-transform:none; letter-spacing:0;">MXN / mes</small></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    `;
        content = content.replace('<section class="compare-section">', extrasHtml + '<section class="compare-section">');
      }

      // 4. Fix plan nav items to have the number span
      // e.g. <span class="plan-nav__item-name">
      // we can just add a fake number or leave it just replacing the class format
      // Actually plan-nav__item-name works fine if we just let it be, but the user complained.
      // Let's add a dummy number like "Opción"
      let itemIndex = 1;
      content = content.replace(/<span class="plan-nav__item-name">/g, (match) => {
        return `<span class="plan-nav__item-num">Opción 0${itemIndex++}</span>\n            <span class="plan-nav__item-name">`;
      });
      // reset index for each page

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated HTML structure in ${filePath}`);
    }
  }
}
