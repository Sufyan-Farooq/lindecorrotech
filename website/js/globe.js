/* Linde Corrotech: hero globe.
   An orthographic globe (d3-geo on a 2D canvas) that turns to Arabia and draws one sky-blue
   route out of Jeddah to each city, with trucks running the routes. Drag to turn it. */
(function () {
  'use strict';
  var cv = document.querySelector('canvas.globe');
  if (!cv || !window.d3 || !window.topojson || !window.LC_WORLD) return;
  var d3 = window.d3, H = document.documentElement;
  var RM = H.classList.contains('rm');
  var ctx = cv.getContext('2d');
  var DATA = window.LC_DATA, O = DATA.origin;

  var BLUE = '#1E9BFF', INK = '#111418';
  var world = window.LC_WORLD;
  var countries = topojson.feature(world, world.objects.countries).features;
  var ksa = countries.filter(function (f) { return f.id === '682'; })[0];
  var borders = topojson.mesh(world, world.objects.countries, function (a, b) { return a !== b; });
  var sphere = { type: 'Sphere' };
  var graticule = d3.geoGraticule10();

  /* land as dots. The land is rasterised once into an equirectangular mask and sampled on a grid.
     Two sets keep each frame cheap: a coarse grid for the whole planet (seen only while zoomed out)
     and a fine grid around Arabia (the zoomed-in view). Each dot keeps cos/sin of its latitude
     and its longitude in radians, so a frame costs two trig calls per dot. */
  var RAD = Math.PI / 180;
  var landMask = (function () {
    var W = 720, Hh = 360, c = document.createElement('canvas');
    c.width = W; c.height = Hh;
    var x = c.getContext('2d', { willReadFrequently: true });
    var pr = d3.geoEquirectangular().fitSize([W, Hh], sphere);
    x.fillStyle = '#000'; x.beginPath(); d3.geoPath(pr, x)({ type: 'FeatureCollection', features: countries }); x.fill();
    var img = x.getImageData(0, 0, W, Hh).data;
    return function (lon, lat) { var p = pr([lon, lat]); return img[((p[1] | 0) * W + (p[0] | 0)) * 4 + 3] > 0; };
  })();
  function sample(lon0, lon1, lat0, lat1, step) {
    var out = [];
    for (var lat = lat0; lat <= lat1; lat += step) {
      var s = step / Math.max(0.25, Math.cos(lat * RAD));
      for (var lon = lon0; lon < lon1; lon += s) {
        if (landMask(lon, lat)) out.push(Math.cos(lat * RAD), Math.sin(lat * RAD), lon * RAD);
      }
    }
    return new Float32Array(out);
  }
  var dotsWorld = sample(-180, 180, -84, 84, 1.9);
  var dotsNear = sample(14, 82, -4, 50, 0.62);

  /* routes */
  var routes = DATA.cities.map(function (c, k) {
    var a = [O.lon, O.lat], b = [c.lon, c.lat];
    var dist = d3.geoDistance(a, b);
    return {
      c: c, interp: d3.geoInterpolate(a, b), lift: 0.015 + dist * 0.55,
      delay: 2.5 + k * 0.06, dur: 0.5 + dist * 3,
      trucks: c.hub ? [Math.random(), Math.random() * 0.5 + 0.5] : [Math.random()],
      speed: 0.05 + 0.02 / Math.max(0.05, dist)
    };
  });

  var proj = d3.geoOrthographic().clipAngle(90).precision(0.3);
  var path = d3.geoPath(proj, ctx);
  var w = 0, h = 0, dpr = 1, R = 0, cx = 0, cy = 0;
  var HOME = [-45.6, -23.8, 0], userZoomed = false, SPIN = 3.1, from = [30, -6, 0], lastTick = 0;
  var rot = RM ? HOME.slice() : [30, -6, 0];
  var vel = [0, 0], drag = null, lastDrag = 0;
  var t0 = 0, started = false, running = false, visible = true, raf = 0;
  var lang = H.lang === 'ar' ? 'ar' : 'en';

  function size() {
    var r = cv.parentNode.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = Math.max(10, r.width); h = Math.max(10, r.height);
    cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    // the globe starts whole (R0), then dives in until the Kingdom fills the frame (R1)
    R0 = Math.min(w, h) * 0.34;
    R1 = Math.min(w * 1.95, h * 2.3);
    cx = w * 0.5; cy = h * 0.5;
    setZoom(zoom);
  }
  var R0 = 0, R1 = 0, zoom = RM ? 1 : 0;
  function setZoom(z) { zoom = z; R = R0 + (R1 - R0) * z; proj.scale(R).translate([cx, cy]); }
  function inOut(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function lifted(ll, k) {
    var p = proj(ll);
    return [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k];
  }
  function facing(ll) { return d3.geoDistance(ll, [-rot[0], -rot[1]]) < Math.PI / 2 - 0.02; }
  function ease(x) { return x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3); }

  function draw(now) {
    var t = started ? (now - t0) / 1000 : 0;
    if (!RM && !userZoomed) setZoom(inOut((t - 0.9) / 2.2));
    proj.rotate(rot);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    // sphere rim (fades out as we dive in); the frame fades to the page at its edges,
    // drawn here rather than with a CSS mask so the browser doesn't re-composite a mask every frame
    var fadeR = Math.min(w, h) / 2;
    ctx.beginPath(); path(sphere);
    ctx.strokeStyle = 'rgba(255,255,255,' + (0.16 * (1 - zoom)).toFixed(3) + ')'; ctx.lineWidth = 1.2; ctx.stroke();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, fadeR, 0, Math.PI * 2); ctx.clip();
    ctx.beginPath(); path(graticule); ctx.strokeStyle = 'rgba(255,255,255,0.045)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); path(borders); ctx.strokeStyle = 'rgba(255,255,255,0.07)'; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.restore();

    // land dots, batched into four brightness bands by distance from the centre
    var set = zoom > 0.45 ? dotsNear : dotsWorld;
    var lam = rot[0] * RAD, cp = Math.cos(rot[1] * RAD), sp = Math.sin(rot[1] * RAD);
    var ds = Math.max(1.1, Math.min(2.6, R / 420)), hd = ds / 2, f2 = fadeR * fadeR;
    var bands = [new Path2D(), new Path2D(), new Path2D(), new Path2D()];
    for (var i = 0; i < set.length; i += 3) {
      var cl = set[i], sl = set[i + 1], a = set[i + 2] + lam;
      var x = cl * Math.cos(a);
      if (x * cp - sl * sp < 0.03) continue;            // on the far side
      var X = cx + R * cl * Math.sin(a), Y = cy - R * (sl * cp + x * sp);
      var dx = X - cx, dy = Y - cy, d2 = (dx * dx + dy * dy) / f2;
      if (d2 >= 1) continue;                            // outside the round frame
      bands[d2 < 0.49 ? 0 : d2 < 0.64 ? 1 : d2 < 0.81 ? 2 : 3].rect(X - hd, Y - hd, ds, ds);
    }
    var BA = [0.34, 0.24, 0.14, 0.06];
    for (var b = 0; b < 4; b++) { ctx.fillStyle = 'rgba(203,214,226,' + BA[b] + ')'; ctx.fill(bands[b]); }

    // the Kingdom
    var intro = ease((t - 1.6) / 1.0);
    ctx.beginPath(); path(ksa);
    ctx.fillStyle = 'rgba(30,155,255,' + (0.14 * intro).toFixed(3) + ')'; ctx.fill();
    ctx.strokeStyle = 'rgba(30,155,255,' + (0.85 * intro).toFixed(3) + ')'; ctx.lineWidth = 1.4; ctx.stroke();

    // routes
    var N = 44;
    ctx.lineCap = 'round';
    routes.forEach(function (r) {
      var prog = RM ? 1 : ease((t - r.delay) / r.dur);
      if (prog <= 0) return;
      ctx.beginPath();
      var pen = false;
      for (var s = 0; s <= N * prog; s++) {
        var u = s / N, ll = r.interp(u);
        if (!facing(ll)) { pen = false; continue; }
        var q = lifted(ll, 1 + r.lift * Math.sin(Math.PI * u));
        if (pen) ctx.lineTo(q[0], q[1]); else { ctx.moveTo(q[0], q[1]); pen = true; }
      }
      ctx.strokeStyle = r.c.hub ? 'rgba(30,155,255,0.95)' : 'rgba(30,155,255,0.6)';
      ctx.lineWidth = r.c.hub ? 1.8 : 1.2;
      ctx.stroke();

      // destination pin
      if (prog >= 1 && facing([r.c.lon, r.c.lat])) {
        var e = proj([r.c.lon, r.c.lat]);
        ctx.beginPath(); ctx.arc(e[0], e[1], r.c.hub ? 3.2 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = '#fff'; ctx.fill();
      }
      // trucks
      if (prog >= 1 && !RM) {
        r.trucks.forEach(function (ph) {
          var u = (ph + t * r.speed) % 1, ll = r.interp(u);
          if (!facing(ll)) return;
          var q = lifted(ll, 1 + r.lift * Math.sin(Math.PI * u));
          ctx.beginPath(); ctx.arc(q[0], q[1], 2.6, 0, Math.PI * 2);
          ctx.fillStyle = '#fff'; ctx.fill();
          ctx.lineWidth = 1.4; ctx.strokeStyle = BLUE; ctx.stroke();
        });
      }
    });

    // Jeddah: the gate every route leaves from
    var J = [O.lon, O.lat];
    if (facing(J)) {
      var jp = proj(J);
      if (!RM) for (var k = 0; k < 3; k++) {
        var ph = ((t * 0.55) + k / 3) % 1;
        ctx.beginPath(); ctx.arc(jp[0], jp[1], 5 + ph * 26, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(30,155,255,' + (0.7 * (1 - ph)).toFixed(3) + ')'; ctx.lineWidth = 1.2; ctx.stroke();
      }
      ctx.beginPath(); ctx.arc(jp[0], jp[1], 5.5, 0, Math.PI * 2); ctx.fillStyle = BLUE; ctx.fill();
      ctx.beginPath(); ctx.arc(jp[0], jp[1], 2.2, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    }

    // labels for the main cities
    var lab = ease((t - 3.4) / 0.8);
    if (lab > 0 || RM) {
      var fs = Math.max(12, Math.min(17, Math.round(R / 44)));
      ctx.font = (lang === 'ar' ? '600 ' + fs + 'px Cairo, sans-serif' : '600 ' + (fs + 1) + 'px "Barlow Semi Condensed", sans-serif');
      ctx.textBaseline = 'middle';
      ctx.globalAlpha = RM ? 1 : lab;
      [O].concat(DATA.cities.filter(function (c) { return c.hub; })).forEach(function (c) {
        var ll = [c.lon, c.lat];
        if (!facing(ll)) return;
        var p = proj(ll), pos = { jed: 'w', tuu: 'w', med: 'w', ruh: 's', dmm: 'e', ahb: 'e' }[c.id] || 'e';
        var txt = c[lang];
        ctx.textAlign = pos === 'w' ? 'right' : pos === 's' ? 'center' : 'left';
        ctx.fillStyle = c.id === 'jed' ? BLUE : 'rgba(255,255,255,0.9)';
        ctx.fillText(txt, p[0] + (pos === 'w' ? -12 : pos === 's' ? 0 : 11), p[1] + (pos === 's' ? fs + 2 : 0));
      });
      ctx.globalAlpha = 1;
    }
  }

  function tick(now) {
    raf = 0;
    if (!running) return;
    var t = (now - t0) / 1000;
    // time-based, so the globe lands on Arabia on time even when frames come slowly
    var dt = Math.min(0.25, Math.max(0, (now - (lastTick || now)) / 1000)); lastTick = now;
    if (!drag) {
      var target = [HOME[0] + Math.sin(t * 0.12) * 6, HOME[1] + Math.sin(t * 0.09) * 2, 0];
      if (t < SPIN && lastDrag < t0) {
        // spin in from the Atlantic side to Arabia, timed with the dive
        var e = inOut(t / SPIN);
        rot[0] = from[0] + (target[0] - from[0]) * e;
        rot[1] = from[1] + (target[1] - from[1]) * e;
      } else {
        // after a drag, coast, then drift home with a slow breathing motion
        var idle = (now - lastDrag) / 1000, f = Math.pow(0.93, dt * 60);
        rot[0] += vel[0] * dt * 60; rot[1] += vel[1] * dt * 60;
        vel[0] *= f; vel[1] *= f;
        var k = idle > 2.5 ? 1 - Math.exp(-dt * 1.4) : 0;
        rot[0] += (target[0] - rot[0]) * k;
        rot[1] += (target[1] - rot[1]) * k;
      }
    }
    rot[1] = Math.max(-60, Math.min(30, rot[1]));
    // while the page is being scrolled, give the frame to the scroll (the opening dive always plays)
    if (drag || t < SPIN + 1.5 || now - lastScroll > 160) draw(now);
    if (visible && !document.hidden) raf = requestAnimationFrame(tick);
  }
  var lastScroll = 0;
  window.addEventListener('scroll', function () { lastScroll = performance.now(); }, { passive: true });
  function loop() { if (!raf && running) raf = requestAnimationFrame(tick); }

  /* drag to turn */
  cv.addEventListener('pointerdown', function (e) {
    drag = { x: e.clientX, y: e.clientY, r: rot.slice() }; vel = [0, 0];
    cv.setPointerCapture(e.pointerId); cv.classList.add('grab');
  });
  cv.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var k = 90 / R;
    var nr0 = drag.r[0] + (e.clientX - drag.x) * k, nr1 = drag.r[1] - (e.clientY - drag.y) * k;
    vel = [nr0 - rot[0], nr1 - rot[1]];
    rot[0] = nr0; rot[1] = nr1;
    if (RM) draw(performance.now());
  });
  function up() { if (!drag) return; drag = null; lastDrag = performance.now(); cv.classList.remove('grab'); }
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  // keyboard: arrows turn the globe
  cv.tabIndex = 0;
  cv.addEventListener('keydown', function (e) {
    var m = { ArrowLeft: [-6, 0], ArrowRight: [6, 0], ArrowUp: [0, 4], ArrowDown: [0, -4] }[e.key];
    if (!m) return; e.preventDefault();
    rot[0] += m[0]; rot[1] += m[1]; lastDrag = performance.now();
    if (RM) draw(performance.now());
  });

  // animate only while a useful part of the globe is on screen
  new IntersectionObserver(function (es) {
    visible = es[0].isIntersecting && es[0].intersectionRatio > 0.2; loop();
  }, { threshold: [0, 0.2, 0.5] }).observe(cv);
  document.addEventListener('visibilitychange', loop);
  window.addEventListener('resize', function () { size(); draw(performance.now()); });

  size();
  draw(0);

  window.LCGlobe = {
    start: function () {
      if (started) return;
      started = true; t0 = performance.now(); lastDrag = -1e9; lastTick = 0; from = rot.slice();
      if (RM) { draw(t0 + 1e6); return; }
      running = true; loop();
    },
    setLang: function (l) { lang = l; draw(performance.now()); },
    // back to the whole globe, ready to dive in again
    reset: function () {
      if (RM) return;
      started = false; running = false; rot = [30, -6, 0]; vel = [0, 0]; setZoom(0); draw(0);
    }
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { draw(performance.now()); });
})();
