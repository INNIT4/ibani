(function () {
  'use strict';

  // ----- Router SPA: cada pestaña es una vista, URL con #/ruta (sin recargar) -----
  const ROUTES = ['inicio', 'caracteristicas', 'como-funciona', 'precios', 'para-quien', 'seguridad', 'faq', 'contacto'];
  const TITLES = {
    inicio: 'Inicio - IBANI',
    caracteristicas: 'Características - IBANI',
    'como-funciona': 'Cómo Funciona - IBANI',
    precios: 'Precios - IBANI',
    'para-quien': '¿Para quién es IBANI? - IBANI',
    seguridad: 'Seguridad - IBANI',
    faq: 'Preguntas Frecuentes - IBANI',
    contacto: 'Contacto - IBANI',
  };

  function getRoute() {
    var hash = location.hash || '';
    if (hash.indexOf('#/') === 0) {
      var r = hash.slice(2).split('/')[0].toLowerCase();
      if (ROUTES.indexOf(r) !== -1) return r;
    }
    return 'inicio';
  }

  function hasHash() {
    return location.hash && location.hash.indexOf('#/') === 0;
  }

  function updateNavActive(route) {
    document.querySelectorAll('.nav__link[data-route]').forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-route') === route);
    });
  }

  function showPage(route, skipAnimation) {
    var app = document.getElementById('app');
    if (!app) return;
    var next = app.querySelector('.page[data-route="' + route + '"]');
    if (!next) return;
    var current = app.querySelector('.page.active');
    if (current === next) {
      if (document.querySelector('.nav__list.open')) {
        var navList = document.querySelector('.nav__list');
        if (navList) navList.classList.remove('open');
        document.querySelector('.nav__toggle') && document.querySelector('.nav__toggle').setAttribute('aria-expanded', 'false');
      }
      return;
    }

    function finish() {
      app.querySelectorAll('.page').forEach(function (p) {
        p.classList.remove('active', 'page-leave');
        p.style.position = '';
      });
      next.classList.add('active');
      updateNavActive(route);
      document.title = TITLES[route] || 'IBANI';
      window.scrollTo(0, 0);
      var navList = document.querySelector('.nav__list');
      if (navList) navList.classList.remove('open');
      var navToggle = document.querySelector('.nav__toggle');
      if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
    }

    if (current && !skipAnimation) {
      current.classList.add('page-leave');
      setTimeout(finish, 350);
    } else {
      if (current) current.classList.remove('active');
      finish();
    }
  }

  function navigateTo(route, push) {
    if (ROUTES.indexOf(route) === -1) route = 'inicio';
    showPage(route, false);
    // Si es inicio, usamos URL limpia (sin hash) para no mostrar #/inicio
    var url = route === 'inicio'
      ? location.pathname + location.search
      : location.pathname + location.search + '#/' + route;
    if (push !== false) {
      window.history.pushState({ route: route }, '', url);
    } else {
      window.history.replaceState({ route: route }, '', url);
    }
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a.nav-link[href^="#/"]');
    if (!a) return;
    e.preventDefault();
    var route = (a.getAttribute('href') || '').replace('#/', '').split('/')[0].trim() || 'inicio';
    if (ROUTES.indexOf(route) === -1) return;
    navigateTo(route, true);
  });

  window.addEventListener('popstate', function () {
    showPage(getRoute(), true);
    updateNavActive(getRoute());
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      var initial = getRoute();
      showPage(initial, true);
      updateNavActive(initial);
      document.title = TITLES[initial] || 'IBANI';
      // Solo reescribir la URL si ya había un hash; si no, dejar la URL limpia
      if (hasHash()) {
        window.history.replaceState({ route: initial }, '', location.pathname + location.search + '#/' + initial);
      }
    });
  } else {
    var initial = getRoute();
    showPage(initial, true);
    updateNavActive(initial);
    document.title = TITLES[initial] || 'IBANI';
    // Solo reescribir la URL si ya había un hash; si no, dejar la URL limpia
    if (hasHash()) {
      window.history.replaceState({ route: initial }, '', location.pathname + location.search + '#/' + initial);
    }
  }

  // ----- Tiers de precios (número -> { price, perNum }) -----
  const PRICE_TIERS = [
    { min: 1, max: 99, price: 29, perNum: 0.29 },
    { min: 100, max: 499, price: 20, perNum: 0.2 },
    { min: 500, max: 999, price: 40, perNum: 0.08 },
    { min: 1000, max: 4999, price: 50, perNum: 0.05 },
    { min: 5000, max: 9999, price: 125, perNum: 0.025 },
    { min: 10000, max: 24999, price: 159, perNum: 0.0159 },
    { min: 25000, max: 100000, price: 300, perNum: 0.012 },
  ];

  function getPriceForQty(qty) {
    const n = Math.max(1, Number(qty) || 0);
    const tier = PRICE_TIERS.find((t) => n >= t.min && n <= t.max);
    if (tier) return { price: tier.price, perNum: tier.perNum };
    const last = PRICE_TIERS[PRICE_TIERS.length - 1];
    return { price: Math.round(n * last.perNum), perNum: last.perNum };
  }

  function formatNum(x) {
    return Number(x).toLocaleString('es');
  }

  function formatPrice(x) {
    return Number(x).toFixed(2);
  }

  // ----- Header: scroll + menú móvil -----
  const header = document.getElementById('header');
  const navList = document.querySelector('.nav__list');
  const navToggle = document.querySelector('.nav__toggle');

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });
  }

  if (navToggle && navList) {
    navToggle.addEventListener('click', function () {
      const open = navList.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  // ----- Hero: animar números (contador) -----
  const statEls = document.querySelectorAll('.hero__stats .stat');
  function animateValue(el, end, duration) {
    const start = 0;
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;
    function step(now) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 2);
      let value = start + (end - start) * ease;
      el.textContent = isDecimal ? value.toFixed(1) : Math.round(value);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observerStats = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const count = parseFloat(el.getAttribute('data-count')) || 0;
        animateValue(el, count, 1500);
        observerStats.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );
  statEls.forEach(function (el) {
    observerStats.observe(el);
  });

  // ----- Feature cards: AOS simple -----
  const featureCards = document.querySelectorAll('.feature-card[data-aos]');
  const observerCards = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  featureCards.forEach(function (card) {
    observerCards.observe(card);
  });

  // ----- Ruleta principal (feature) -----
  const raffleWheel = document.getElementById('raffleWheel');
  const btnIniciarSorteo = document.getElementById('btnIniciarSorteo');
  const winnerDisplay = document.getElementById('winnerDisplay');

  if (raffleWheel && btnIniciarSorteo && winnerDisplay) {
    const circle = raffleWheel.querySelector('.raffle-wheel__circle');
    btnIniciarSorteo.addEventListener('click', function () {
      if (raffleWheel.classList.contains('spinning')) return;
      raffleWheel.classList.add('spinning');
      winnerDisplay.textContent = 'Girando...';
      btnIniciarSorteo.disabled = true;
      setTimeout(function () {
        const winner = Math.floor(Math.random() * 9999) + 1;
        winnerDisplay.textContent = 'Ganador: ' + winner;
        btnIniciarSorteo.disabled = false;
        raffleWheel.classList.remove('spinning');
      }, 4000);
    });
  }

  // ----- Mini ruleta (paso 5) -----
  const miniWheel = document.getElementById('miniWheel');
  const miniWinnerNum = document.getElementById('miniWinnerNum');
  if (miniWheel && miniWinnerNum) {
    miniWheel.addEventListener('click', function () {
      if (miniWheel.classList.contains('spin')) return;
      miniWheel.classList.add('spin');
      miniWinnerNum.textContent = '...';
      setTimeout(function () {
        miniWinnerNum.textContent = String(Math.floor(Math.random() * 9999) + 1);
        miniWheel.classList.remove('spin');
      }, 3000);
    });
  }

  // ----- Calculadora de precios -----
  const qtyInput = document.getElementById('qtyInput');
  const qtySlider = document.getElementById('qtySlider');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const displayPrice = document.getElementById('displayPrice');
  const displayNums = document.getElementById('displayNums');
  const perNum = document.getElementById('perNum');
  const presetBtns = document.querySelectorAll('.pricing-calc .preset-btn');
  const tableRows = document.querySelectorAll('.pricing-table__row[data-tier]');

  function updatePricing(qty) {
    const num = Math.max(1, Math.min(100000, Math.round(Number(qty) || 1)));
    const { price, perNum: pn } = getPriceForQty(num);

    if (qtyInput) qtyInput.value = num;
    if (qtySlider) qtySlider.value = Math.min(num, 25000);
    if (displayPrice) displayPrice.textContent = formatPrice(price);
    if (displayNums) displayNums.textContent = formatNum(num);
    if (perNum) perNum.textContent = formatPrice(pn) + ' US$';

    presetBtns.forEach(function (btn) {
      const dataQty = parseInt(btn.getAttribute('data-qty'), 10);
      btn.classList.toggle('active', dataQty === num);
    });

    tableRows.forEach(function (row) {
      const tier = parseInt(row.getAttribute('data-tier'), 10);
      row.classList.toggle('highlight', tier === num);
    });
  }

  function syncFromInput() {
    const val = parseInt(qtyInput?.value, 10) || 10000;
    updatePricing(val);
  }

  if (qtyInput) {
    qtyInput.addEventListener('input', syncFromInput);
    qtyInput.addEventListener('change', syncFromInput);
  }
  if (qtySlider) {
    qtySlider.addEventListener('input', function () {
      updatePricing(qtySlider.value);
    });
  }
  if (qtyMinus) {
    qtyMinus.addEventListener('click', function () {
      const step = parseInt(qtyInput?.value, 10) >= 1000 ? 1000 : 100;
      updatePricing(Math.max(1, (parseInt(qtyInput?.value, 10) || 10000) - step));
    });
  }
  if (qtyPlus) {
    qtyPlus.addEventListener('click', function () {
      const step = parseInt(qtyInput?.value, 10) >= 1000 ? 1000 : 100;
      updatePricing((parseInt(qtyInput?.value, 10) || 0) + step);
    });
  }
  presetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const qty = parseInt(btn.getAttribute('data-qty'), 10);
      updatePricing(qty);
    });
  });
  updatePricing(10000);

  // ----- FAQ: acordeón -----
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    const btn = item.querySelector('.faq-item__q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      const isOpen = item.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });
  });

  // ----- FAQ: búsqueda -----
  const faqSearch = document.getElementById('faqSearch');
  if (faqSearch) {
    faqSearch.addEventListener('input', function () {
      const q = this.value.trim().toLowerCase();
      faqItems.forEach(function (item) {
        const text = (item.querySelector('.faq-item__q')?.textContent || '').toLowerCase();
        const answer = (item.querySelector('.faq-item__a')?.textContent || '').toLowerCase();
        const match = !q || text.includes(q) || answer.includes(q);
        item.classList.toggle('hidden', !match);
      });
    });
  }

  // ----- FAQ: categorías -----
  const faqCats = document.querySelectorAll('.faq-cat');
  faqCats.forEach(function (cat) {
    cat.addEventListener('click', function () {
      faqCats.forEach(function (c) {
        c.classList.remove('active');
      });
      cat.classList.add('active');
      const category = cat.getAttribute('data-category');
      faqItems.forEach(function (item) {
        const itemCat = item.getAttribute('data-category');
        const show = category === 'general' || itemCat === category;
        item.classList.toggle('hidden', !show);
      });
      if (faqSearch) faqSearch.value = '';
    });
  });

  // ----- Formulario de contacto -----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const queryType = document.getElementById('queryType');
      const subject = contactForm.querySelector('[name="subject"]');
      const message = document.getElementById('message');
      const privacy = contactForm.querySelector('[name="privacy"]');

      let valid = true;
      [name, email, queryType, subject, message].forEach(function (field) {
        if (!field || !field.value.trim()) {
          valid = false;
          field?.classList.add('error');
        } else {
          field?.classList.remove('error');
        }
      });
      if (!privacy?.checked) {
        valid = false;
        privacy?.closest('.checkbox-label')?.classList.add('error');
      } else {
        privacy?.closest('.checkbox-label')?.classList.remove('error');
      }

      if (!valid) {
        return;
      }

      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn?.textContent;
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Enviando...';
      }
      setTimeout(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = originalText;
        }
        alert('Mensaje enviado. Te responderemos lo antes posible.');
        contactForm.reset();
      }, 800);
    });
  }

  // Enlaces # (anclas) que no son rutas #/ siguen con scroll suave
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === '#' || href.indexOf('#/') === 0) return;
    a.addEventListener('click', function (e) {
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (navList) navList.classList.remove('open');
      }
    });
  });
})();
