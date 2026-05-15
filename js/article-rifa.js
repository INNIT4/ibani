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

  // ── TIMELINE STEP REVEAL (on scroll) ──
  var steps = document.querySelectorAll('.timeline__step');
  if (steps.length && 'IntersectionObserver' in window) {
    steps.forEach(function(step) {
      step.style.opacity = '0';
      step.style.transform = 'translateY(12px)';
      step.style.transition = 'opacity .5s ease, transform .5s ease';
    });

    var io = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry, idx) {
        if (entry.isIntersecting) {
          var i = Array.prototype.indexOf.call(steps, entry.target);
          setTimeout(function() {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i % 6 * 90);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    steps.forEach(function(s) { io.observe(s); });
  }

});
