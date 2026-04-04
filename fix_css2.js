const fs = require('fs');
const path = require('path');

const dir = 'servicios/landing-pages';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const EXTRAS_GRID_CSS = `.extras-grid {
      display: flex;
      flex-direction: column;
      gap: 0;
      max-width: 900px;
    }

    .extra-card {
      background: transparent;
      border: none;
      border-top: 1px dashed var(--border-2);
      border-radius: 0;
      padding: var(--space-8) 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      transition: none;
    }
    
    .extra-card:first-child {
      border-top: none;
      padding-top: 0;
    }

    .extra-card:hover {
      transform: none;
      box-shadow: none;
    }

    .extra-card__icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: color-mix(in srgb, var(--accent) 12%, transparent);
      border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
    }

    .extra-card__name {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 500;
      color: var(--ink);
      line-height: 1.3;
    }

    .extra-card__desc {
      font-size: var(--text-sm);
      color: var(--ink-2);
      line-height: 1.65;
      flex: 1;
    }

    .extra-card__price {
      font-family: var(--font-display);
      font-size: 1.35rem;
      font-weight: 500;
      color: var(--accent);
      margin-top: auto;
      padding-top: 0;
      border-top: none;
    }`;


for (const f of files) {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');

  // Fix 1: Extras grid css
  let startIdx = content.indexOf('.extras-grid {');
  let endIdx = content.indexOf('/* ── Plan Nav', startIdx);
  
  if (startIdx !== -1 && endIdx !== -1) {
    content = content.substring(0, startIdx) + EXTRAS_GRID_CSS + '\n\n    ' + content.substring(endIdx);
  }

  // Fix 2: Plan Nav Grid wrapping
  content = content.replace(/grid-template-columns:\s*repeat\(6,\s*1fr\);/g, 'grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));');
  
  // Fix 3: Remove Emprendedor <br>Avanzado and rely on natural wrapping
  content = content.replace(/Emprendedor\s*<br>Avanzado/g, 'Emprendedor Avanzado');

  // Fix 4: Break word properties for item name
  content = content.replace(/\.plan-nav__item-name \{[\s\S]+?\}/, `.plan-nav__item-name {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--ink);
      line-height: 1.25;
      word-wrap: break-word;
      word-break: break-word;
      hyphens: auto;
    }`);

  fs.writeFileSync(fp, content, 'utf8');
  console.log('Fixed CSS in ' + f);
}
