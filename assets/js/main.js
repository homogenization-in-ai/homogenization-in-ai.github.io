// Motif: a field of varied shapes that gradually converges into identical grey dots.
// Hovering a mark "re-diversifies" its neighbourhood.
(function () {
  var root = document.getElementById('motif');
  if (!root) return;

  var HUES = ['#3346D3', '#E0772B', '#1E8A7A', '#8A4FD0', '#D94C6A', '#E8B931'];
  var GREY = '#8E9099';
  var COLS = 32, ROWS = 6;

  // Deterministic PRNG so the pattern is identical on every load.
  var seed = 7;
  function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

  var marks = [];
  for (var c = 0; c < COLS; c++) {
    var col = document.createElement('div');
    col.className = 'motif-col';
    var p = Math.pow(c / (COLS - 1), 1.4);
    for (var r = 0; r < ROWS; r++) {
      var roll = rnd();
      var m = {
        c: c, r: r,
        gray: roll < p,
        hue: HUES[Math.floor(rnd() * HUES.length)],
        size: Math.round(9 + rnd() * 13),
        shape: Math.floor(rnd() * 4)
      };
      var cell = document.createElement('div');
      cell.className = 'motif-cell';
      var el = document.createElement('div');
      el.className = 'motif-mark';
      cell.appendChild(el);
      col.appendChild(cell);
      m.el = el;
      cell.addEventListener('mouseenter', hoverAt.bind(null, c, r));
      marks.push(m);
      paint(m, null);
    }
    root.appendChild(col);
  }
  root.addEventListener('mouseleave', function () { hoverAt(null, null); });

  function apply(el, w, h, rad, bg, rot, lift, scale) {
    var s = el.style;
    s.width = w + 'px';
    s.height = h + 'px';
    s.borderRadius = rad;
    s.background = bg;
    s.transform = 'translateY(' + lift + 'px) rotate(' + rot + 'deg) scale(' + scale + ')';
  }

  function paint(m, hover) {
    var dist = hover ? Math.sqrt((m.c - hover.c) * (m.c - hover.c) + (m.r - hover.r) * (m.r - hover.r)) : 99;
    var near = dist <= 2.5;
    var lift = near ? -(3 - dist) * 2 * ((m.r + m.c) % 2 === 0 ? 1 : -1) : 0;
    var scale = near ? 1 + (3 - dist) * 0.08 : 1;
    var size = m.size, el = m.el;
    if (m.gray && !near) apply(el, 12, 12, '50%', GREY, 0, 0, 1);
    else if (m.shape === 0) apply(el, size, size, '50%', m.hue, 0, lift, scale);
    else if (m.shape === 1) apply(el, size, size, '2px', m.hue, near ? 12 : 0, lift, scale);
    else if (m.shape === 2) apply(el, Math.round(size * 0.55), size + 4, '999px', m.hue, 0, lift, scale);
    else apply(el, Math.round(size * 0.8), Math.round(size * 0.8), '2px', m.hue, 45, lift, scale);
  }

  var current = null;
  function hoverAt(c, r) {
    var next = c === null ? null : { c: c, r: r };
    if ((current && next && current.c === next.c && current.r === next.r) || (!current && !next)) return;
    current = next;
    for (var i = 0; i < marks.length; i++) paint(marks[i], current);
  }
})();

// Nav: on narrow screens, where the links wrap below the brand, fold them away
// while scrolling down and bring them back on scroll up (or near the top).
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  var brand = header.querySelector('.brand');
  var links = header.querySelector('.nav-links');
  if (!brand || !links) return;

  var lastY = window.scrollY;
  var ticking = false;

  function measure() {
    header.classList.remove('nav-wrapped', 'nav-collapsed');
    header.style.removeProperty('--nav-links-h');
    var wrapped = links.offsetTop >= brand.offsetTop + brand.offsetHeight;
    if (wrapped) {
      header.style.setProperty('--nav-links-h', links.offsetHeight + 'px');
      header.classList.add('nav-wrapped');
    }
    lastY = window.scrollY;
    update();
  }

  function update() {
    ticking = false;
    if (!header.classList.contains('nav-wrapped')) return;
    var y = window.scrollY;
    var dy = y - lastY;
    if (y <= header.offsetHeight) {
      header.classList.remove('nav-collapsed');
    } else if (dy > 6) {
      header.classList.add('nav-collapsed');
    } else if (dy < -6) {
      header.classList.remove('nav-collapsed');
    } else {
      return; // ignore tiny jitter; keep lastY as the reference point
    }
    lastY = y;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(measure, 120);
  });
  // Keyboard users tabbing into the nav should always see it.
  links.addEventListener('focusin', function () { header.classList.remove('nav-collapsed'); });

  measure();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
})();
