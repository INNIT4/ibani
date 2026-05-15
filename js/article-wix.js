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
        // force reflow before transition
        answer.offsetHeight;
        answer.style.maxHeight = h + 'px';
      }
    });
  });

  // ── SPEED-BAR DIAGRAM (animated on scroll into view) ──
  var speedDiagram = document.querySelector('[data-speed-diagram]');
  if (speedDiagram && 'IntersectionObserver' in window) {
    var animated = false;
    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting && !animated) {
          animated = true;
          var fills = speedDiagram.querySelectorAll('.speed-bar__fill[data-fill]');
          fills.forEach(function(fill, idx) {
            var pct = parseFloat(fill.getAttribute('data-fill')) || 0;
            setTimeout(function() {
              fill.style.width = pct + '%';
            }, idx * 220);
          });
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    io.observe(speedDiagram);
  } else if (speedDiagram) {
    // Fallback: no IntersectionObserver — fill immediately
    var fills = speedDiagram.querySelectorAll('.speed-bar__fill[data-fill]');
    fills.forEach(function(fill) {
      var pct = parseFloat(fill.getAttribute('data-fill')) || 0;
      fill.style.width = pct + '%';
    });
  }

});
