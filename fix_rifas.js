const fs = require('fs');
const path = require('path');

const file1 = path.join(__dirname, 'servicios', 'rifas', 'mensual.html');
const file2 = path.join(__dirname, 'servicios', 'rifas', 'por-evento.html');

let content1 = fs.readFileSync(file1, 'utf8');

// Replace Hero for MENSUAL
content1 = content1.replace(
  /<section class="plan-hero">[\s\S]*?<\/section>/,
  `<section class="plan-hero">
      <span class="plan-watermark" aria-hidden="true">02</span>
      <div class="container plan-hero__inner-grid">
        <div class="plan-hero__content">
          <nav aria-label="Migas de pan" style="margin-bottom:var(--space-8)">
            <ol style="display:flex;gap:var(--space-2);align-items:center;list-style:none;padding:0;font-size:var(--text-sm);color:var(--ink-3);flex-wrap:wrap">
              <li><a href="/" style="color:var(--ink-3)">Inicio</a></li>
              <li aria-hidden="true" style="color:var(--border)">›</li>
              <li><a href="/servicios/rifas" style="color:var(--ink-3)">Plataformas de Rifas</a></li>
              <li aria-hidden="true" style="color:var(--border)">›</li>
              <li aria-current="page" style="color:var(--ink-2)">Mensual</li>
            </ol>
          </nav>
          <div class="tier-track anim-l" style="--delay:.05s;max-width:160px">
            <span class="tier-seg on"></span>
            <span class="tier-seg on"></span>
          </div>
          <div class="plan-hero__label anim-l" style="--delay:.1s">
            <span class="plan-hero__dot"></span>
            <span class="plan-hero__num">Plan 02 de 2 · Plataformas de Rifas · ⭐ Más popular</span>
          </div>
          <h1 class="plan-hero__name anim-l" style="--delay:.18s">
            Rifa <em>Mensual</em>
          </h1>
          <div class="plan-hero__price-row anim-l" style="--delay:.26s">
            <span class="plan-hero__price">$5,000 MXN</span>
            <span class="plan-hero__price-note">por mes · rifas ilimitadas</span>
          </div>
          <p class="plan-hero__ideal anim-r" style="--delay:.32s">
            <strong>Ideal para:</strong> organizadores que hacen rifas frecuentes y necesitan la plataforma activa todo el tiempo con control automático y escalabilidad total.
          </p>
          <p class="plan-hero__desc anim-r" style="--delay:.38s">
            La misma plataforma completa del plan Por evento — con la diferencia de que corres rifas ilimitadas sin reiniciar el sistema: WhatsApp multi-número con rotación automática, códigos de descuento, métricas avanzadas y soporte prioritario incluido.
          </p>
          <div class="anim-u" style="--delay:.46s;display:flex;gap:var(--space-4);flex-wrap:wrap">
            <a href="https://wa.me/526625044016?text=Hola%2C%20me%20interesa%20el%20plan%20mensual%20de%20rifas%20%245%2C000%20de%20IBANI%20Digital." target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">Empezar ahora →</a>
            <a href="/servicios/rifas#planes" class="btn btn--outline">Ver todos los planes</a>
          </div>
        </div>
        <div class="plan-hero__visual anim-l" style="--delay:.4s">
          <img class="mc-desktop" src="/img/rifa-mensual-mockup.png" alt="Plataforma de Rifas Mensual" loading="lazy" onerror="this.src='https://via.placeholder.com/1200x800/1A1714/FFFFFF?text=Rifas+Mensual'">
          <img class="mc-mobile" src="/img/rifa-mensual-mob.png" alt="Rifas móvil" loading="lazy" onerror="this.src='https://via.placeholder.com/400x800/FAF8F1/1A1714?text=Movil'">
        </div>
      </div>
    </section>`
);

let content2 = fs.readFileSync(file2, 'utf8');

// Replace Hero for POR-EVENTO
content2 = content2.replace(
  /<section class="plan-hero">[\s\S]*?<\/section>/,
  `<section class="plan-hero">
      <span class="plan-watermark" aria-hidden="true">01</span>
      <div class="container plan-hero__inner-grid">
        <div class="plan-hero__content">
          <nav aria-label="Migas de pan" style="margin-bottom:var(--space-8)">
            <ol style="display:flex;gap:var(--space-2);align-items:center;list-style:none;padding:0;font-size:var(--text-sm);color:var(--ink-3);flex-wrap:wrap">
              <li><a href="/" style="color:var(--ink-3)">Inicio</a></li>
              <li aria-hidden="true" style="color:var(--border)">›</li>
              <li><a href="/servicios/rifas" style="color:var(--ink-3)">Plataformas de Rifas</a></li>
              <li aria-hidden="true" style="color:var(--border)">›</li>
              <li aria-current="page" style="color:var(--ink-2)">Por Evento</li>
            </ol>
          </nav>
          <div class="tier-track anim-l" style="--delay:.05s;max-width:160px">
            <span class="tier-seg on"></span>
            <span class="tier-seg"></span>
          </div>
          <div class="plan-hero__label anim-l" style="--delay:.1s">
            <span class="plan-hero__dot"></span>
            <span class="plan-hero__num">Plan 01 de 2 · Plataformas de Rifas</span>
          </div>
          <h1 class="plan-hero__name anim-l" style="--delay:.18s">
            Rifa <em>Por Evento</em>
          </h1>
          <div class="plan-hero__price-row anim-l" style="--delay:.26s">
            <span class="plan-hero__price">$7,500 MXN</span>
            <span class="plan-hero__price-note">pago único · 1 rifa activa</span>
          </div>
          <p class="plan-hero__ideal anim-r" style="--delay:.32s">
            <strong>Ideal para:</strong> sorteos únicos o esporádicos (hasta 3 meses de duración) que necesitan automatización de apartados, comprobantes y validación.
          </p>
          <p class="plan-hero__desc anim-r" style="--delay:.38s">
            Obtén tu propia plataforma de rifas en línea. Seleccionador visual de boletos, folios únicos, comprobantes en PDF y confirmación por WhatsApp en tiempo real. Máximo control administrativo, total transparencia y cobro sin comisiones de terceros.
          </p>
          <div class="anim-u" style="--delay:.46s;display:flex;gap:var(--space-4);flex-wrap:wrap">
            <a href="https://wa.me/526625044016?text=Hola%2C%20me%20interesa%20el%20plan%20por%20evento%20de%20rifas%20%247%2C500%20de%20IBANI%20Digital." target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">Vender boletos hoy →</a>
            <a href="/servicios/rifas#planes" class="btn btn--outline">Conoce el Plan Mensual</a>
          </div>
        </div>
        <div class="plan-hero__visual anim-l" style="--delay:.4s">
          <img class="mc-desktop" src="/img/rifa-evento-mockup.png" alt="Plataforma de Rifas Por Evento" loading="lazy" onerror="this.src='https://via.placeholder.com/1200x800/1A1714/FFFFFF?text=Rifas+Evento'">
          <img class="mc-mobile" src="/img/rifa-evento-mob.png" alt="Rifas móvil" loading="lazy" onerror="this.src='https://via.placeholder.com/400x800/FAF8F1/1A1714?text=Movil'">
        </div>
      </div>
    </section>`
);

// Save them back
fs.writeFileSync(file1, content1, 'utf8');
fs.writeFileSync(file2, content2, 'utf8');
console.log("Updated Hero sections purely for rifas plans");
