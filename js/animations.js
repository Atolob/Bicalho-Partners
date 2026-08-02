/* ===== ANIMAÇÕES JS — Bicalho & Partners v2 ===== */

// ---------- SPLASH SCREEN ----------
(function () {
  var splash = document.getElementById('splash');
  if (!splash) return;
  var delay = parseInt(splash.getAttribute('data-delay') || '1400', 10);
  setTimeout(function () {
    splash.classList.add('hide');
    setTimeout(function () {
      splash.style.display = 'none';
    }, 750);
  }, delay);
})();

// ---------- NAVBAR SCROLL ----------
(function () {
  var header = document.querySelector('header');
  if (!header) return;
  var last = 0;
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    last = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ---------- SCROLL REVEAL (Intersection Observer) ----------
(function () {
  var selectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
  var els = document.querySelectorAll(selectors);
  if (!els.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el, i) {
    // staggered delay per row of 4
    var delay = (i % 5) * 65;
    el.style.transitionDelay = delay + 'ms';
    io.observe(el);
  });
})();

// ---------- PROGRESS BARS ANIMATE ON REVEAL ----------
(function () {
  var bars = document.querySelectorAll('.bar i');
  if (!bars.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-w') || entry.target.style.width;
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(function (bar) {
    var w = bar.style.width;
    bar.setAttribute('data-w', w);
    bar.style.width = '0';
    setTimeout(function () { io.observe(bar); }, 100);
  });
})();

// ---------- COUNTER ANIMATE (stat numbers) ----------
(function () {
  var stats = document.querySelectorAll('.stat strong');
  if (!stats.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('counted');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(function (s) { io.observe(s); });
})();

// ---------- JORNADA NAV (existing logic preserved) ----------
var jnavDots = document.querySelectorAll('.jnav-dot');
var jstages = document.querySelectorAll('.jornada-stage');
if (jnavDots.length && jstages.length) {
  jnavDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = document.querySelector('[data-jstage="' + dot.dataset.target + '"]');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  var jObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = entry.target.dataset.jstage;
        jnavDots.forEach(function (d) { d.classList.remove('active'); });
        var active = document.querySelector('.jnav-dot[data-target="' + idx + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  jstages.forEach(function (s) { jObs.observe(s); });
}
