document.addEventListener('DOMContentLoaded', function() {

  // ── PLATFORM TABS ──
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var target = btn.getAttribute('aria-controls');
      var tabs = btn.closest('.platform-tabs');
      tabs.querySelectorAll('.tab-btn').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabs.querySelectorAll('.tab-panel').forEach(function(p) {
        p.classList.remove('active');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  // ── COST CALCULATOR ──
  var BASE = 13500;
  var display = document.getElementById('calcPrice');

  function fmt(n) {
    return '$' + n.toLocaleString('es-MX') + ' MXN';
  }

  function recalc() {
    var total = BASE;
    document.querySelectorAll('#calcOptions .calc-opt[data-cost]').forEach(function(opt) {
      if (opt.classList.contains('always-checked')) return;
      if (opt.classList.contains('checked')) {
        total += parseInt(opt.dataset.cost, 10) || 0;
      }
    });
    if (display) display.textContent = fmt(total);
  }

  document.querySelectorAll('#calcOptions .calc-opt[data-cost]').forEach(function(opt) {
    if (opt.classList.contains('always-checked')) return;

    function toggle() {
      var isChecked = opt.classList.contains('checked');
      opt.classList.toggle('checked', !isChecked);
      opt.setAttribute('aria-checked', String(!isChecked));
      recalc();
    }

    opt.addEventListener('click', toggle);
    opt.addEventListener('keydown', function(e) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(); }
    });
  });

  // ── FAQ ACCORDION ──
  document.querySelectorAll('.faq-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      var answerId = btn.getAttribute('aria-controls');
      var answer = document.getElementById(answerId);

      document.querySelectorAll('.faq-btn').forEach(function(b) {
        b.setAttribute('aria-expanded', 'false');
        var a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.style.maxHeight = '0px';
      });

      if (!isOpen && answer) {
        btn.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = 'none';
        var h = answer.scrollHeight;
        answer.style.maxHeight = '0px';
        answer.offsetHeight;
        answer.style.maxHeight = h + 'px';
      }
    });
  });

});
