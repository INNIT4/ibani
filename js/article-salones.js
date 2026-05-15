document.addEventListener('DOMContentLoaded', function() {

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

  // ── FUNNEL ANIMATION (on scroll into view) ──
  var funnel = document.querySelector('[data-funnel]');
  if (funnel && 'IntersectionObserver' in window) {
    var animated = false;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          var bars = funnel.querySelectorAll('.funnel__bar[data-w]');
          bars.forEach(function(bar, idx) {
            var w = parseFloat(bar.getAttribute('data-w')) || 0;
            setTimeout(function() {
              bar.style.width = w + '%';
            }, idx * 180);
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    io.observe(funnel);
  } else if (funnel) {
    var bars = funnel.querySelectorAll('.funnel__bar[data-w]');
    bars.forEach(function(bar) {
      var w = parseFloat(bar.getAttribute('data-w')) || 0;
      bar.style.width = w + '%';
    });
  }

});
