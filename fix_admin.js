const fs = require('fs');

const path = 'servicios/software-administrativo/admin.html';
let content = fs.readFileSync(path, 'utf8');

const replacement = `    <section class="plan-hero">
      <div class="plan-watermark" aria-hidden="true">03</div>
      <div class="container plan-hero__inner-grid">
        <div class="plan-hero__content">
          <nav aria-label="Migas de pan" style="margin-bottom:var(--space-8)">
            <ol style="display:flex;gap:var(--space-2);align-items:center;list-style:none;padding:0;font-size:var(--text-sm);color:var(--ink-3)">
              <li><a href="/" style="color:var(--ink-3)">Inicio</a></li>
              <li aria-hidden="true" style="color:var(--border)">›</li>
              <li><a href="/servicios/software-administrativo" style="color:var(--ink-3)">Software Administrativo</a></li>
              <li aria-hidden="true" style="color:var(--border)">›</li>
              <li aria-current="page" style="color:var(--ink-2)">Admin</li>
            </ol>
          </nav>
          <div class="tier-track anim-u" style="--delay:.05s;max-width:260px">
            <div class="tier-seg on"></div>
            <div class="tier-seg on"></div>
            <div class="tier-seg on"></div>
            <div class="tier-seg"></div>
          </div>
          <div class="plan-hero__label anim-l" style="--delay:.1s">
            <span class="plan-hero__num">Plan 03 de 04</span>
            <span class="plan-hero__dot"></span>
            <span class="plan-hero__num">⭐ Más popular</span>
          </div>
          <h1 class="plan-hero__name anim-l" style="--delay:.2s">Software<br><em>Admin</em></h1>
          <div class="plan-hero__price-row anim-l" style="--delay:.3s">
            <span class="plan-hero__price">$20,000 MXN</span>
            <span class="plan-hero__price-note">pago único / 50·50</span>
          </div>
          <p class="plan-hero__desc anim-r" style="--delay:.38s">
            El sistema completo para negocios en crecimiento: ventas, gastos, apartados con abonos, control de trabajadores y asistencia, todo con roles diferenciados por acceso.
          </p>
          <div class="plan-hero__ideal anim-u" style="--delay:.42s">
            <strong>Ideal para →</strong> negocios con equipo de trabajo que necesitan controlar ventas, gastos, asistencia y tener visibilidad total de su operación diaria.
          </div>
          <div class="anim-u" style="--delay:.46s;display:flex;gap:var(--space-4);flex-wrap:wrap">
            <a href="https://wa.me/526625044016?text=Hola%2C%20me%20interesa%20el%20Software%20Admin%20%2420%2C000%20de%20IBANI%20Digital." target="_blank" rel="noopener noreferrer" class="btn btn--primary btn--lg">Empezar ahora →</a>
            <a href="/servicios/software-administrativo#planes" class="btn btn--outline">Ver todos los planes</a>
          </div>
        </div>
        <div class="plan-hero__visual anim-l" style="--delay:.4s">
          <img class="mc-desktop" src="/img/soft-admin-mockup.png" alt="Plataforma de Software Admin" loading="lazy" onerror="this.src='https://via.placeholder.com/1200x800/1A1714/FFFFFF?text=Software'">
          <img class="mc-mobile" src="/img/soft-admin-mob.png" alt="Software móvil" loading="lazy" onerror="this.src='https://via.placeholder.com/400x800/FAF8F1/1A1714?text=Movil'">
        </div>
      </div>
    </section>`;

content = content.replace(/<section class="plan-hero">[\s\S]*?<\/section>/, replacement);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed admin.html');
