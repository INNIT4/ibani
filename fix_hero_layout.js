const fs = require('fs');

let file = 'servicios/landing-pages/economico.html';
let content = fs.readFileSync(file, 'utf8');

const newCSS = `    /* ── Plan Hero Split Layout ───────────────────────────── */
    .plan-hero__inner-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-12);
      align-items: center;
    }
    .plan-hero__content {
      z-index: 2;
    }
    .plan-hero__visual {
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
    }
    @media (max-width: 900px) {
      .plan-hero__inner-grid {
        grid-template-columns: 1fr;
        gap: var(--space-10);
      }
      .plan-hero__visual {
        order: -1;
        transform: none;
      }
      .plan-hero__visual:hover {
        transform: translateY(-5px);
      }
    }
    
    /* ── Body`;

content = content.replace('    /* ── Body', newCSS);

const heroStart = content.indexOf('<section class="plan-hero">');
const heroEnd = content.indexOf('</section> <!-- BODY -->', heroStart);

if (heroStart !== -1 && heroEnd !== -1) {
    let heroBlock = content.substring(heroStart, heroEnd);
    
    // Replace <div class="container"> with <div class="container plan-hero__inner-grid"><div class="plan-hero__content">
    heroBlock = heroBlock.replace('<div class="container">', '<div class="container plan-hero__inner-grid">\n        <div class="plan-hero__content">');
    
    // Append the visual block and close the div
    let visualBlock = `\n        </div>\n        <div class="plan-hero__visual anim-l" style="--delay:.4s">\n          <img src="/img/eco-mockup.png" alt="Demo de interfaz de celular Landing Page" loading="lazy">\n        </div>\n      `;
    
    // Replace the closing </div> of container
    let lastDivIdx = heroBlock.lastIndexOf('</div>');
    heroBlock = heroBlock.substring(0, lastDivIdx) + visualBlock + heroBlock.substring(lastDivIdx);
    
    content = content.substring(0, heroStart) + heroBlock + content.substring(heroEnd);
}

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed hero layout layout');
