/* ===== ANIMAÇÕES — Bicalho & Partners v3 ===== */

/* ---------- SPLASH SCREEN ---------- */
(function () {
  var splash = document.getElementById('splash');
  if (!splash) return;
  var delay = parseInt(splash.getAttribute('data-delay') || '1400', 10);
  setTimeout(function () {
    splash.classList.add('hide');
    setTimeout(function () { splash.style.display = 'none'; }, 850);
  }, delay);
})();

/* ---------- NAVBAR SCROLL ---------- */
(function () {
  var header = document.querySelector('header');
  if (!header) return;
  function onScroll() {
    header.classList.toggle('scrolled', (window.scrollY || window.pageYOffset) > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ---------- HERO CANVAS — partículas e linhas animadas ---------- */
(function () {
  var canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles = [], lines = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* Paleta alinhada ao tema: verde-escuro e dourado */
  var COLORS = [
    'rgba(26,90,94,',
    'rgba(212,165,116,',
    'rgba(13,44,46,',
    'rgba(225,197,141,',
  ];

  /* ---- Partículas flutuantes ---- */
  function Particle() { this.reset(true); }
  Particle.prototype.reset = function (init) {
    this.x  = Math.random() * (W || 800);
    this.y  = init ? Math.random() * (H || 400) : (H || 400) + 8;
    this.r  = 1.2 + Math.random() * 2.2;
    this.vx = (Math.random() - 0.5) * 0.22;
    this.vy = -(0.18 + Math.random() * 0.28);
    this.op = 0.08 + Math.random() * 0.22;
    this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = 200 + Math.random() * 300;
  };
  Particle.prototype.update = function () {
    this.x  += this.vx;
    this.y  += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y < -10) this.reset(false);
  };
  Particle.prototype.draw = function () {
    var alpha = Math.min(this.life / 40, 1) * Math.min((this.maxLife - this.life) / 40, 1) * this.op;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.col + alpha + ')';
    ctx.fill();
  };

  /* ---- Linhas suaves flutuantes ---- */
  function Line() { this.reset(true); }
  Line.prototype.reset = function (init) {
    this.x1  = Math.random() * (W || 800);
    this.y1  = init ? Math.random() * (H || 400) : (H || 400) + 10;
    this.len = 40 + Math.random() * 90;
    this.ang = -Math.PI / 4 + (Math.random() - 0.5) * 0.8;
    this.vx  = (Math.random() - 0.5) * 0.15;
    this.vy  = -(0.12 + Math.random() * 0.18);
    this.op  = 0.04 + Math.random() * 0.1;
    this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.life = 0;
    this.maxLife = 250 + Math.random() * 350;
  };
  Line.prototype.update = function () {
    this.x1  += this.vx;
    this.y1  += this.vy;
    this.life++;
    if (this.life > this.maxLife || this.y1 < -20) this.reset(false);
  };
  Line.prototype.draw = function () {
    var alpha = Math.min(this.life / 50, 1) * Math.min((this.maxLife - this.life) / 50, 1) * this.op;
    var x2 = this.x1 + Math.cos(this.ang) * this.len;
    var y2 = this.y1 + Math.sin(this.ang) * this.len;
    var grad = ctx.createLinearGradient(this.x1, this.y1, x2, y2);
    grad.addColorStop(0,   this.col + '0)');
    grad.addColorStop(0.5, this.col + alpha + ')');
    grad.addColorStop(1,   this.col + '0)');
    ctx.beginPath();
    ctx.moveTo(this.x1, this.y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  };

  /* ---- Círculos expansivos periódicos ---- */
  var rings = [];
  function Ring(x, y) {
    this.x = x; this.y = y;
    this.r = 0; this.op = 0.18;
    this.col = COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  Ring.prototype.update = function () {
    this.r  += 0.9;
    this.op -= 0.003;
  };
  Ring.prototype.draw = function () {
    if (this.op <= 0) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = this.col + Math.max(0, this.op) + ')';
    ctx.lineWidth = 1;
    ctx.stroke();
  };
  Ring.prototype.dead = function () { return this.op <= 0; };

  setInterval(function () {
    if (!W) return;
    rings.push(new Ring(
      60 + Math.random() * (W - 120),
      60 + Math.random() * (H - 120)
    ));
  }, 2800);

  /* ---- Inicializar ---- */
  var NPARTICLES = 55, NLINES = 22;
  for (var i = 0; i < NPARTICLES; i++) particles.push(new Particle());
  for (var j = 0; j < NLINES; j++) lines.push(new Line());

  /* ---- Loop ---- */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (var k = 0; k < particles.length; k++) { particles[k].update(); particles[k].draw(); }
    for (var l = 0; l < lines.length; l++) { lines[l].update(); lines[l].draw(); }
    rings = rings.filter(function (r) { r.update(); r.draw(); return !r.dead(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ---------- SCROLL REVEAL (Intersection Observer) ---------- */
(function () {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  els.forEach(function (el, i) {
    el.style.transitionDelay = (i % 5) * 60 + 'ms';
    io.observe(el);
  });
})();

/* ---------- PROGRESS BARS ---------- */
(function () {
  var bars = document.querySelectorAll('.bar i');
  if (!bars.length) return;
  bars.forEach(function (bar) {
    var w = bar.style.width || '0%';
    bar.setAttribute('data-w', w);
    bar.style.width = '0';
    bar.style.transition = 'width 1.1s cubic-bezier(0.22,1,0.36,1)';
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-w');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(function (bar) { io.observe(bar); });
})();

/* ---------- MENU MOBILE ---------- */
(function () {
  var btn  = document.querySelector('.hamburger');
  var menu = document.querySelector('.menu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });
  /* fecha ao clicar em link */
  menu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.classList.remove('open');
    });
  });
  /* mega menu mobile: toggle */
  document.querySelectorAll('.mega-wrap > button').forEach(function (b) {
    b.addEventListener('click', function () {
      var wrap = b.closest('.mega-wrap');
      if (window.innerWidth <= 900) wrap.classList.toggle('open');
    });
  });
})();

/* ---------- JORNADA NAV ---------- */
(function () {
  var dots   = document.querySelectorAll('.jnav-dot');
  var stages = document.querySelectorAll('.jornada-stage');
  if (!dots.length || !stages.length) return;
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var t = document.querySelector('[data-jstage="' + dot.dataset.target + '"]');
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
  var jObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = entry.target.dataset.jstage;
        dots.forEach(function (d) { d.classList.remove('active'); });
        var active = document.querySelector('.jnav-dot[data-target="' + idx + '"]');
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  stages.forEach(function (s) { jObs.observe(s); });
})();

/* ---------- WHY SECTION CANVAS ---------- */
(function () {
  var canvas = document.getElementById('why-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;
  function resize() {
    W = canvas.width  = canvas.offsetWidth  || canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.offsetHeight || canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  var nodes = [];
  var N = 28;
  function Node() {
    this.x  = Math.random() * (W || 600);
    this.y  = Math.random() * (H || 400);
    this.vx = (Math.random() - 0.5) * 0.25;
    this.vy = (Math.random() - 0.5) * 0.25;
    this.r  = 1.5 + Math.random() * 1.5;
  }
  Node.prototype.update = function () {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };
  for (var i = 0; i < N; i++) nodes.push(new Node());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(function (n) { n.update(); });
    /* draw connecting lines */
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a + 1; b < nodes.length; b++) {
        var dx = nodes[a].x - nodes[b].x;
        var dy = nodes[a].y - nodes[b].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          var alpha = (1 - dist / 120) * 0.18;
          ctx.beginPath();
          ctx.moveTo(nodes[a].x, nodes[a].y);
          ctx.lineTo(nodes[b].x, nodes[b].y);
          ctx.strokeStyle = 'rgba(212,165,116,' + alpha + ')';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    /* draw nodes */
    nodes.forEach(function (n) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(212,165,116,0.25)';
      ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  /* start only when section enters viewport */
  var started = false;
  var io = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting && !started) { started = true; loop(); }
  }, { threshold: 0.1 });
  io.observe(canvas.parentElement);
})();
