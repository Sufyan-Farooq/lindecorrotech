/* Linde Corrotech: page behaviour and motion. */
(function () {
  'use strict';
  var D = document, H = D.documentElement, W = window;
  W.__lcok = true;
  var RM = H.classList.contains('rm');
  var DATA = W.LC_DATA;
  var $ = function (s, el) { return (el || D).querySelector(s); };
  var $$ = function (s, el) { return [].slice.call((el || D).querySelectorAll(s)); };
  var lang = function () { return H.lang === 'ar' ? 'ar' : 'en'; };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var easeOut = function (x) { return 1 - Math.pow(1 - x, 3); };

  /* ---------------- words for the dynamic parts ---------------- */
  var T = {
    en: {
      road: function (d) { return d <= 0 ? 'Same day, door to door' : 'About ' + d + (d === 1 ? ' day' : ' days') + ' on the road'; },
      cargo: { container20: '20 ft container', container40: '40 ft container', flatbed: 'Flatbed load' },
      port: 'Jeddah Islamic Port', city: 'Jeddah',
      msg: function (o) { return 'Hello Linde Corrotech, I would like a quote: ' + o.cargo + ' from ' + o.from + ' to ' + o.to + (o.km ? ' (about ' + o.km + ' km)' : '') + '.'; },
      subject: 'Quote request',
      copied: 'Copied', copy: 'Copy',
      err: 'Add your name, mobile number and destination so we can quote.',
      form: function (f) {
        return ['Hello Linde Corrotech, I would like a quote.',
          'Name: ' + f.name, f.company ? 'Company: ' + f.company : '', 'Mobile: ' + f.phone,
          'Load: ' + f.qty + ' × ' + f.cargo, 'From: ' + f.from, 'To: ' + f.to,
          f.date ? 'Loading date: ' + f.date : '', f.notes ? 'Notes: ' + f.notes : ''].filter(Boolean).join('\n');
      },
      title: 'Linde Corrotech | Container and flatbed haulage from Jeddah'
    },
    ar: {
      road: function (d) { return d <= 0 ? 'في نفس اليوم' : 'نحو ' + (d === 1 ? 'يوم واحد' : d === 2 ? 'يومين' : d + ' أيام') + ' على الطريق'; },
      cargo: { container20: 'حاوية ٢٠ قدمًا', container40: 'حاوية ٤٠ قدمًا', flatbed: 'حمولة سطحة' },
      port: 'ميناء جدة الإسلامي', city: 'جدة',
      msg: function (o) { return 'مرحبًا ليندي كوروتيك، أرغب في عرض سعر: ' + o.cargo + ' من ' + o.from + ' إلى ' + o.to + (o.km ? ' (نحو ' + o.km + ' كم)' : '') + '.'; },
      subject: 'طلب عرض سعر',
      copied: 'تم النسخ', copy: 'نسخ',
      err: 'أضف اسمك ورقم جوالك والوجهة لنرسل لك عرض السعر.',
      form: function (f) {
        return ['مرحبًا ليندي كوروتيك، أرغب في عرض سعر.',
          'الاسم: ' + f.name, f.company ? 'الشركة: ' + f.company : '', 'الجوال: ' + f.phone,
          'الحمولة: ' + f.qty + ' × ' + f.cargo, 'من: ' + f.from, 'إلى: ' + f.to,
          f.date ? 'تاريخ التحميل: ' + f.date : '', f.notes ? 'ملاحظات: ' + f.notes : ''].filter(Boolean).join('\n');
      },
      title: 'ليندي كوروتيك | نقل الحاويات والسطحات من جدة'
    }
  };
  var t = function () { return T[lang()]; };

  /* ---------------- kinetic headings: split into words ---------------- */
  function split(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var o = D.createElement('span'), u = D.createElement('span');
      o.className = 'w'; u.className = 'wi'; u.style.setProperty('--i', i); u.textContent = w;
      o.appendChild(u); el.appendChild(o);
      if (i < words.length - 1) el.appendChild(D.createTextNode(' '));
    });
    el.classList.add('split');
    el.setAttribute('aria-label', words.join(' '));
    $$('.w', el).forEach(function (s) { s.setAttribute('aria-hidden', 'true'); });
  }
  if (!RM) $$('.kin').forEach(split);

  /* lede: words that light up as you read down the page */
  function splitLede(el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="lw">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
  }
  var lede = $('.lede');
  if (lede && !RM) splitLede(lede);

  /* ---------------- reveal on enter ---------------- */
  var io = new IntersectionObserver(function (es) {
    var batch = 0;
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.classList.contains('rv')) el.style.setProperty('--d', (batch++ * 85) + 'ms');
      if (el.classList.contains('kin')) el.style.setProperty('--kd', '0ms');
      el.classList.add('in');
      if (el.hasAttribute('data-count')) countUp(el);
      io.unobserve(el);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.01 });
  function watch() {
    $$('.kin:not(.in), .rv:not(.in), .clip:not(.in), .steps:not(.in), [data-count]').forEach(function (el) {
      if (el.closest('.hero')) return; // the hero has its own choreography
      io.observe(el);
    });
  }

  function countUp(el) {
    var n = +el.getAttribute('data-count'), t0 = performance.now();
    if (RM) { el.textContent = n; return; }
    (function f(now) {
      var p = clamp((now - t0) / 1400, 0, 1);
      el.textContent = Math.round(easeOut(p) * n);
      if (p < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* ---------------- hero choreography, after the intro ---------------- */
  var heroDone = false;
  function startHero() {
    if (heroDone) return; heroDone = true;
    var h1 = $('.hero-h');
    if (h1) { h1.style.setProperty('--kd', '120ms'); h1.classList.add('in'); }
    $$('.hero .rv').forEach(function (el, i) { el.style.setProperty('--d', (450 + i * 120) + 'ms'); el.classList.add('in'); });
    var g = $('.hero-globe'); if (g) g.classList.add('in');
    if (W.LCGlobe) setTimeout(function () { W.LCGlobe.start(); }, RM ? 0 : 250);
    if (lenis) lenis.start();
    watch();
  }

  var intro = $('.intro');
  function endIntro() {
    if (!H.classList.contains('intro-on')) return;
    H.classList.remove('intro-on', 'intro-skip-now');
    try { sessionStorage.setItem('lc-intro', '1'); } catch (e) {}
    startHero();
  }
  function bindIntro(node) {
    node.addEventListener('animationend', function (e) { if (e.target === node) endIntro(); });
    $('.intro-skip', node).addEventListener('click', function () { H.classList.add('intro-skip-now'); });
    D.addEventListener('keydown', function k(e) { if (e.key === 'Escape' && H.classList.contains('intro-on')) { H.classList.add('intro-skip-now'); D.removeEventListener('keydown', k); } });
    setTimeout(endIntro, 3600);
  }
  if (H.classList.contains('intro-on') && intro) bindIntro(intro);

  /* replay: a fresh copy of the intro restarts its CSS animations; the globe dives in again after it */
  var replay = $('.replay');
  if (replay && RM) replay.hidden = true;
  if (replay && !RM) replay.addEventListener('click', function () {
    var fresh = intro.cloneNode(true);
    intro.parentNode.replaceChild(fresh, intro); intro = fresh;
    var h1 = $('.hero-h'); if (h1) h1.classList.remove('in');
    $$('.hero .rv').forEach(function (el) { el.classList.remove('in'); });
    var g = $('.hero-globe'); if (g) g.classList.remove('in');
    if (W.LCGlobe) W.LCGlobe.reset();
    heroDone = false;
    if (lenis) { lenis.scrollTo(0, { immediate: true }); lenis.stop(); } else W.scrollTo(0, 0);
    H.classList.add('intro-on');
    bindIntro(fresh);
  });

  /* ---------------- smooth scroll ---------------- */
  var lenis = null;
  if (!RM && W.Lenis && W.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    lenis = new W.Lenis({ lerp: 0.16, wheelMultiplier: 1 }); // smooth, but close behind the wheel
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());
    if (H.classList.contains('intro-on')) lenis.stop();
  }
  function goTo(target) {
    var bar = $('.bar').offsetHeight;
    if (lenis) lenis.scrollTo(target, { offset: -bar - 8, duration: 1.3 });
    else target.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  }
  D.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var target = id === '#top' ? D.body : $(id);
    if (!target) return;
    e.preventDefault();
    closeMenu();
    if (id === '#top') { if (lenis) lenis.scrollTo(0); else W.scrollTo({ top: 0, behavior: RM ? 'auto' : 'smooth' }); }
    else goTo(target);
    var cargo = a.getAttribute('data-quote-cargo');
    if (cargo) { $('#qCargo').value = cargo; }
    if (id === '#quote') setTimeout(function () { $('#qName').focus({ preventScroll: true }); }, 900);
  });

  /* ---------------- header, progress, scroll-linked pieces ---------------- */
  var bar = $('.bar'), prog = $('.progress span');
  var darkSecs = $$('.hero, .coverage, .statement, .licences, .foot');
  var navLinks = $$('.nav a');
  var lastY = W.scrollY, ticking = false;
  var st = $('.statement'), stBg = $('.statement-bg'), lws = lede ? $$('.lw', lede) : [];

  function onScroll() {
    ticking = false;
    var y = W.scrollY, vh = W.innerHeight, max = D.documentElement.scrollHeight - vh;
    prog.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    // hide on the way down, show on the way up
    if (!bar.classList.contains('open')) bar.classList.toggle('hide', y > 480 && y > lastY + 2);
    if (y < lastY - 2) bar.classList.remove('hide');
    lastY = y;
    // tone under the bar
    var probe = bar.offsetHeight + 1, dark = false;
    darkSecs.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) dark = true; });
    bar.setAttribute('data-tone', dark ? 'dark' : 'light');
    // statement: parallax + words lighting up
    if (st) {
      var r = st.getBoundingClientRect();
      if (r.bottom > 0 && r.top < vh) {
        if (!RM && stBg) stBg.style.transform = 'translate3d(0,' + (r.top * -0.12).toFixed(1) + 'px,0)';
        if (lws.length) {
          var p = clamp((vh * 0.9 - r.top) / (r.height * 0.75), 0, 1), n = Math.round(p * lws.length);
          for (var i = 0; i < lws.length; i++) lws[i].classList.toggle('on', i < n);
        }
      }
    }
    // phone bar steps aside once the quote form is on screen
    var mb = $('.mbar'), qs = $('#quote');
    if (mb && qs) { var qr = qs.getBoundingClientRect(); mb.classList.toggle('away', qr.top < vh * 0.6 && qr.bottom > vh * 0.4); }
    // current section in the nav
    var cur = null;
    navLinks.forEach(function (a) { var s = $(a.getAttribute('href')); if (s && s.getBoundingClientRect().top < vh * 0.4) cur = a; });
    navLinks.forEach(function (a) { a.classList.toggle('on', a === cur); });
  }
  W.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  W.addEventListener('resize', onScroll);

  /* ---------------- mobile menu ---------------- */
  var mBtn = $('.menu-btn');
  function closeMenu() { bar.classList.remove('open'); mBtn.setAttribute('aria-expanded', 'false'); }
  mBtn.addEventListener('click', function () {
    var open = !bar.classList.contains('open');
    bar.classList.toggle('open', open); mBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    bar.classList.remove('hide');
  });
  D.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ---------------- route board ticker: drifts, and runs faster while you scroll ---------------- */
  var track = $('.ticker-track'), tx = 0, tw = 0, vel = 0, prevY = W.scrollY;
  var arrow = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3 10h13M12 5l5 5-5 5"/></svg>';
  function buildTicker() {
    var L = lang(), O = DATA.origin;
    var picks = DATA.cities.filter(function (c) { return c.hub || ['mak', 'ynb', 'gzn', 'jbl', 'hal', 'bur'].indexOf(c.id) > -1; });
    var one = picks.map(function (c) {
      return '<span dir="auto">' + O[L] + ' ' + (L === 'ar' ? arrow.replace('M3 10h13M12 5l5 5-5 5', 'M17 10H4M8 5l-5 5 5 5') : arrow) + ' ' + c[L] + ' <b>' + c.km + (L === 'ar' ? ' كم' : ' km') + '</b></span>';
    }).join('');
    track.innerHTML = one + one;
    tw = track.scrollWidth / 2;
  }
  buildTicker();
  (function tick() {
    var y = W.scrollY; vel = vel * 0.9 + Math.abs(y - prevY) * 0.1; prevY = y;
    if (!RM && tw) {
      tx -= (0.45 + Math.min(vel, 60) * 0.18) * (lang() === 'ar' ? -1 : 1);
      if (tx <= -tw) tx += tw; if (tx > 0) tx -= tw;
      track.style.transform = 'translate3d(' + tx.toFixed(1) + 'px,0,0)';
    }
    requestAnimationFrame(tick);
  })();

  /* ---------------- route planner ---------------- */
  var plTo = $('#plTo'), plFrom = $('#plFrom'), plForm = $('#plForm');
  var svg = $('.pl-map'), NS = 'http://www.w3.org/2000/svg';
  var mapProj = null, routeEl = null, curKm = 0, lblC = null, lblJ = null;
  function fillCities() {
    var L = lang(), v = plTo.value || 'ruh';
    plTo.innerHTML = DATA.cities.slice().sort(function (a, b) { return a.km - b.km; })
      .map(function (c) { return '<option value="' + c.id + '">' + c[L] + '</option>'; }).join('');
    plTo.value = v;
  }
  function el(name, attrs, parent) {
    var n = D.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(n); return n;
  }
  function buildMap() {
    if (!W.d3 || !W.topojson || !W.LC_WORLD) return;
    var d3 = W.d3, wd = W.LC_WORLD;
    var feats = topojson.feature(wd, wd.objects.countries).features;
    var ksa = feats.filter(function (f) { return f.id === '682'; })[0];
    mapProj = d3.geoMercator().fitExtent([[40, 30], [560, 490]], ksa);
    var path = d3.geoPath(mapProj);
    svg.innerHTML = '';
    var g = el('g', {});
    feats.forEach(function (f) { if (f.id !== '682') el('path', { d: path(f), class: 'land' }, g); });
    el('path', { d: path(ksa), class: 'ksa' }, g);
    var O = DATA.origin, J = mapProj([O.lon, O.lat]);
    DATA.cities.forEach(function (c) {
      var p = mapProj([c.lon, c.lat]);
      el('line', { x1: J[0], y1: J[1], x2: p[0], y2: p[1], class: 'ghost' });
    });
    DATA.cities.forEach(function (c) {
      var p = mapProj([c.lon, c.lat]);
      el('circle', { cx: p[0], cy: p[1], r: 3.5, class: 'town', 'data-id': c.id });
    });
    routeEl = el('path', { class: 'route', d: '' });
    el('circle', { cx: J[0], cy: J[1], r: 7, class: 'jed' });
    lblJ = el('text', { x: J[0] - 12, y: J[1] + 5, class: 'lbl j', 'text-anchor': 'end' });
    lblC = el('text', { class: 'lbl' });
  }
  function roadDays(km) { return km <= 250 ? 0 : Math.ceil((km / 72) / 10); }
  function plan(animate) {
    var c = DATA.cities.filter(function (x) { return x.id === plTo.value; })[0] || DATA.cities[0];
    var cargo = (plForm.querySelector('input[name=cargo]:checked') || {}).value || 'container40';
    var extra = plFrom.value === 'port' ? 0 : 6;
    var km = c.km + extra, L = lang(), O = DATA.origin;
    var fromName = plFrom.value === 'port' ? t().port : t().city;
    // number
    var from = curKm, numEl = $('#plKm'), t0 = performance.now();
    curKm = km;
    if (RM || !animate) numEl.textContent = km;
    else (function f(now) { var p = clamp((now - t0) / 700, 0, 1); numEl.textContent = Math.round(from + (km - from) * easeOut(p)); if (p < 1) requestAnimationFrame(f); })(t0);
    $('#plRoute').textContent = fromName + (L === 'ar' ? ' ← ' : ' → ') + c[L];
    $('#plTime').textContent = t().road(roadDays(km));
    // map
    if (mapProj && routeEl) {
      var J = mapProj([O.lon, O.lat]), P = mapProj([c.lon, c.lat]);
      var mx = (J[0] + P[0]) / 2, my = (J[1] + P[1]) / 2, dx = P[0] - J[0], dy = P[1] - J[1];
      var bend = 0.18, qx = mx - dy * bend, qy = my + dx * bend;
      routeEl.setAttribute('d', 'M' + J[0] + ' ' + J[1] + ' Q' + qx + ' ' + qy + ' ' + P[0] + ' ' + P[1]);
      var len = routeEl.getTotalLength();
      routeEl.style.transition = 'none';
      routeEl.style.strokeDasharray = len; routeEl.style.strokeDashoffset = RM || !animate ? 0 : len;
      routeEl.getBoundingClientRect();
      if (!RM && animate) { routeEl.style.transition = 'stroke-dashoffset .9s cubic-bezier(.65,0,.35,1)'; routeEl.style.strokeDashoffset = 0; }
      $$('.town', svg).forEach(function (n) { n.classList.toggle('sel', n.getAttribute('data-id') === c.id); n.setAttribute('r', n.getAttribute('data-id') === c.id ? 6 : 3.5); });
      lblJ.textContent = O[L];
      var right = P[0] > 300;
      lblC.textContent = c[L];
      lblC.setAttribute('x', P[0] + (right ? -12 : 12)); lblC.setAttribute('y', P[1] - 10);
      lblC.setAttribute('text-anchor', right ? 'end' : 'start');
    }
    // hand-off links
    var o = { cargo: t().cargo[cargo], from: fromName, to: c[L], km: km };
    $('#plWa').href = 'https://wa.me/' + DATA.whatsapp + '?text=' + encodeURIComponent(t().msg(o));
    $('#plMail').href = 'mailto:' + DATA.email + '?subject=' + encodeURIComponent(t().subject + ': ' + o.from + ' - ' + o.to) + '&body=' + encodeURIComponent(t().msg(o));
    // carry the choice into the quote form
    $('#qTo').value = c[L];
    $('#qCargo').value = cargo;
  }
  fillCities(); buildMap(); plan(false);
  plForm.addEventListener('change', function () { plan(true); });

  /* ---------------- quote form ---------------- */
  var qForm = $('#qForm'), qErr = $('#qErr');
  function readForm() {
    var f = {}; ['name', 'company', 'phone', 'from', 'to', 'date', 'notes', 'qty'].forEach(function (k) { f[k] = (qForm.elements[k].value || '').trim(); });
    f.cargo = t().cargo[qForm.elements.cargo.value]; f.qty = f.qty || '1';
    return f;
  }
  function valid() {
    var ok = true;
    ['name', 'phone', 'to'].forEach(function (k) {
      var inp = qForm.elements[k], bad = !inp.value.trim();
      inp.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad && ok) inp.focus();
      if (bad) ok = false;
    });
    qErr.hidden = ok; if (!ok) qErr.textContent = t().err;
    return ok;
  }
  qForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!valid()) return;
    W.open('https://wa.me/' + DATA.whatsapp + '?text=' + encodeURIComponent(t().form(readForm())), '_blank', 'noopener');
  });
  $('#qMail').addEventListener('click', function () {
    if (!valid()) return;
    var f = readForm();
    W.location.href = 'mailto:' + DATA.email + '?subject=' + encodeURIComponent(t().subject + ': ' + f.from + ' - ' + f.to) + '&body=' + encodeURIComponent(t().form(f));
  });
  qForm.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid') === 'true' && e.target.value.trim()) e.target.setAttribute('aria-invalid', 'false'); });

  /* ---------------- copy licence numbers ---------------- */
  $$('.copy').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      var done = function () { b.textContent = t().copied; b.classList.add('done'); setTimeout(function () { b.textContent = t().copy; b.classList.remove('done'); }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(v).then(done, done); else done();
    });
  });

  /* ---------------- language ---------------- */
  function setLang(L, first) {
    H.lang = L; H.dir = L === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('lc-lang', L); } catch (e) {}
    $$('[data-ar]').forEach(function (n) {
      if (!n.hasAttribute('data-en')) n.setAttribute('data-en', n.classList.contains('split') ? n.getAttribute('aria-label') : n.textContent.trim());
      var txt = n.getAttribute(L === 'ar' ? 'data-ar' : 'data-en');
      if (n.classList.contains('kin')) {
        var wasIn = n.classList.contains('in');
        n.classList.remove('split'); n.textContent = txt;
        if (!RM) split(n);
        if (wasIn) n.classList.add('in');
      } else if (n.classList.contains('lede')) {
        n.textContent = txt; if (!RM) { splitLede(n); lws = $$('.lw', n); }
      } else n.textContent = txt;
    });
    $$('[data-ar-alt]').forEach(function (n) { if (!n.hasAttribute('data-en-alt')) n.setAttribute('data-en-alt', n.alt); n.alt = n.getAttribute(L === 'ar' ? 'data-ar-alt' : 'data-en-alt'); });
    $$('[data-ar-label]').forEach(function (n) { if (!n.hasAttribute('data-en-label')) n.setAttribute('data-en-label', n.getAttribute('aria-label')); n.setAttribute('aria-label', n.getAttribute(L === 'ar' ? 'data-ar-label' : 'data-en-label')); });
    $$('[data-ar-value]').forEach(function (n) {
      if (!n.hasAttribute('data-en-value')) n.setAttribute('data-en-value', n.defaultValue);
      var other = n.getAttribute(L === 'ar' ? 'data-en-value' : 'data-ar-value');
      if (!n.value || n.value === other || first) n.value = n.getAttribute(L === 'ar' ? 'data-ar-value' : 'data-en-value');
    });
    D.title = T[L].title;
    if (W.LCGlobe) W.LCGlobe.setLang(L);
    fillCities(); plan(false); buildTicker(); onScroll();
  }
  // each language is its own pre-rendered page (/ and /ar/); setLang is kept for tooling

  /* ---------------- light / dark ----------------
     Follows the system until the visitor picks one; picking the same as the system goes back to following it. */
  var themeBtn = $('[data-theme-toggle]');
  var sysDark = W.matchMedia ? W.matchMedia('(prefers-color-scheme: dark)') : null;
  function saved() { try { return localStorage.getItem('lc-theme'); } catch (e) { return null; } }
  function applyTheme(t) {
    H.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.setAttribute('aria-label', t === 'dark'
      ? (lang() === 'ar' ? 'التبديل إلى الوضع الفاتح' : 'Switch to light mode')
      : (lang() === 'ar' ? 'التبديل إلى الوضع الداكن' : 'Switch to dark mode'));
    onScroll();
  }
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = H.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    var sys = sysDark && sysDark.matches ? 'dark' : 'light';
    try { if (next === sys) localStorage.removeItem('lc-theme'); else localStorage.setItem('lc-theme', next); } catch (e) {}
    applyTheme(next);
  });
  if (sysDark) {
    var follow = function (e) { if (!saved()) applyTheme(e.matches ? 'dark' : 'light'); };
    if (sysDark.addEventListener) sysDark.addEventListener('change', follow); else if (sysDark.addListener) sysDark.addListener(follow);
  }
  applyTheme(H.getAttribute('data-theme') || 'light');

  /* ---------------- go ---------------- */
  onScroll();
  if (!H.classList.contains('intro-on')) startHero();
})();
