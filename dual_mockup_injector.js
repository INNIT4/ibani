const fs = require('fs');

const oldCss = `    .plan-hero__visual {
      position: relative;
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: 0 40px 80px rgba(0,0,0,0.15);
      border: 1px solid var(--border-2);
      background: var(--bg-2);
      transform: perspective(1200px) rotateY(-8deg) rotateX(2deg);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s;
      z-index: 1;
    }
    .plan-hero__visual:hover {
      transform: perspective(1200px) rotateY(-2deg) rotateX(1deg) translateY(-10px);
      box-shadow: 0 60px 100px rgba(0,0,0,0.2);
    }
    .plan-hero__visual img {
      width: 100%;
      height: auto;
      display: block;
    }
    .plan-hero__visual::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%);
      pointer-events: none;
    }`;

const newCss = `    .plan-hero__visual {
      position: relative;
      transform: perspective(1200px) rotateY(-8deg) rotateX(2deg);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1;
      display: flex;
      justify-content: flex-end;
    }
    .plan-hero__visual:hover {
      transform: perspective(1200px) rotateY(-2deg) rotateX(1deg) translateY(-10px);
    }
    .mc-desktop {
      width: 88%;
      height: auto;
      display: block;
      border-radius: var(--radius-lg);
      box-shadow: 0 40px 80px rgba(0,0,0,0.15);
      border: 1px solid var(--border-2);
      background: var(--bg-2);
    }
    .mc-mobile {
      position: absolute;
      bottom: -8%;
      left: 0;
      width: 32%;
      height: auto;
      display: block;
      border-radius: calc(var(--radius) * 1.5);
      box-shadow: 0 50px 100px rgba(0,0,0,0.3);
      border: 1px solid rgba(250,248,241,0.15);
      background: var(--ink);
      z-index: 2;
    }`;

// In mobile query, old CSS already adjusts .plan-hero__visual
/*
    @media (max-width: 900px) { ...
       .plan-hero__visual { order: -1; transform: none; }
    }
    We can leave that alone! Although mc-mobile absolute positioning might look weird or good.
    Wait, let's inject a fix for mobile just in case:
*/

const oldMobileCss = `      .plan-hero__visual {
        order: -1;
        transform: none;
      }
      .plan-hero__visual:hover {
        transform: translateY(-5px);
      }`;

const newMobileCss = `      .plan-hero__visual {
        order: -1;
        transform: none;
        justify-content: center;
        margin-bottom: var(--space-4);
      }
      .plan-hero__visual:hover {
        transform: translateY(-5px);
      }
      .mc-desktop { width: 92%; }
      .mc-mobile { width: 36%; bottom: -12%; left: -2%; }`;


const slugs = ['economico', 'emprendedor', 'emprendedor-pro', 'emprendedor-plus', 'emprendedor-avanzado', 'emprendedor-elite'];

for(const slug of slugs) {
  const filepath = 'servicios/landing-pages/' + slug + '.html';
  let content = fs.readFileSync(filepath, 'utf8');

  // Replace CSS
  content = content.replace(oldCss, newCss);
  content = content.replace(oldMobileCss, newMobileCss);

  // Replace HTML visual 
  // We match the wrapper and image
  const visualRegex = /<div class="plan-hero__visual anim-l" style="--delay:\.4s">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/;
  
  const placeholders = {
     'economico': 'eco',
     'emprendedor': 'emp',
     'emprendedor-pro': 'pro',
     'emprendedor-plus': 'plus',
     'emprendedor-avanzado': 'avanzado',
     'emprendedor-elite': 'elite'
  };
  const prefix = placeholders[slug];

  const newHtml = `<div class="plan-hero__visual anim-l" style="--delay:.4s">
          <img class="mc-desktop" src="/img/${prefix}-desktop.png" alt="Demo de interfaz de escritorio" loading="lazy" onerror="this.src='https://via.placeholder.com/1200x800/1A1714/FFFFFF?text=Escritorio+Placeholder'">
          <img class="mc-mobile" src="/img/${prefix}-mobile.png" alt="Demo de interfaz móvil" loading="lazy" onerror="this.src='https://via.placeholder.com/400x800/FAF8F1/1A1714?text=Movil+Placeholder'">
        </div>
      </div>
    </section>`;

  content = content.replace(visualRegex, newHtml);
  fs.writeFileSync(filepath, content, 'utf8');
}
console.log('Dual-Mockups injected perfectly!');
