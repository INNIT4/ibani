/* ============================================================
   MAIN — Nav, Scroll Reveal, Card Scale, Counters, FAQ
   IBANI Digital · Dark Premium · 2026
   Inspirado en: moneda.com
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Header scroll state ──────────────────────────────────── */
  const header = document.getElementById('header');
  if (header) {
    const tick = () => header.classList.toggle('scrolled', window.scrollY > 30);
    window.addEventListener('scroll', tick, { passive: true });
    tick();
  }

  /* ── Mobile nav ───────────────────────────────────────────── */
  const toggle    = document.querySelector('.nav__toggle');
  const mobileNav = document.querySelector('.nav__mobile');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      mobileNav.classList.toggle('open', !open);
      document.body.style.overflow = open ? '' : 'hidden';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Smooth scroll + close mobile on anchor click ────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
      if (mobileNav) {
        toggle?.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* ── Active nav (IntersectionObserver) ───────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link[data-section]');

  if (sections.length && navLinks.length) {
    new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting)
          navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
      }),
      { rootMargin: '-40% 0px -55% 0px' }
    ).observe.call(
      new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting)
            navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
        }),
        { rootMargin: '-40% 0px -55% 0px' }
      ),
      ...sections
    );

    // Simpler loop approach:
    const sObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting)
          navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === e.target.id));
      }),
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sections.forEach(s => sObs.observe(s));
  }

  /* ── Scroll Reveal (.reveal elements) ────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const rObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); rObs.unobserve(e.target); }
      }),
      { threshold: 0.07, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => rObs.observe(el));
  }

  /* ── Card Scale Reveal (.scale-reveal) ── moneda.com style ─ */
  const scaleEls = document.querySelectorAll('.scale-reveal');
  if (scaleEls.length) {
    const sObs2 = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); sObs2.unobserve(e.target); }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    scaleEls.forEach(el => sObs2.observe(el));
  }

  /* ── Counter Animation ────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const easeOut = t => 1 - Math.pow(1 - t, 3);
    const cObs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        cObs.unobserve(e.target);
        const target   = parseInt(e.target.dataset.count, 10);
        const suffix   = e.target.dataset.suffix || '';
        const dur      = 1400;
        const start    = performance.now();
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          e.target.textContent = Math.round(easeOut(p) * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
      { threshold: 0.5 }
    );
    counters.forEach(el => cObs.observe(el));
  }

  /* ── FAQ Accordion ────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn  = item.querySelector('.faq-btn');
    const body = item.querySelector('.faq-body');
    if (!btn || !body) return;

    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-btn')?.setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-body')?.classList.remove('open');
        }
      });

      btn.setAttribute('aria-expanded', String(!open));
      body.classList.toggle('open', !open);
    });
  });

});
