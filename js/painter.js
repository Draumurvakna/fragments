/* 代码画：每个 figure 一幅，按编号做种子，同一幅每次画出来都一样 */
(function () {
  function rng(seed) {
    let s = (seed * 9301 + 49297) % 233280 || 1;
    return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function hexToRgb(h) {
    const n = parseInt(h.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function rgba(h, a) { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; }
  function mix(a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
  }

  function Painter(ctx, w, h, R, pal) {
    this.c = ctx; this.w = w; this.h = h; this.R = R; this.p = pal;
  }
  const P = Painter.prototype;
  P.wash = function (x, y, w, h, col, alpha = 0.08, n = 26) {
    const c = this.c, R = this.R;
    for (let i = 0; i < n; i++) {
      c.fillStyle = rgba(col, alpha * (0.5 + R()));
      c.beginPath();
      const j = Math.min(w, h) * 0.06;
      c.moveTo(x + (R() - .5) * j, y + (R() - .5) * j);
      c.lineTo(x + w + (R() - .5) * j, y + (R() - .5) * j);
      c.lineTo(x + w + (R() - .5) * j, y + h + (R() - .5) * j);
      c.lineTo(x + (R() - .5) * j, y + h + (R() - .5) * j);
      c.closePath(); c.fill();
    }
  };
  P.blot = function (x, y, r, col, alpha = 0.07, n = 30) {
    const c = this.c, R = this.R;
    for (let i = 0; i < n; i++) {
      c.fillStyle = rgba(col, alpha * (0.4 + R()));
      c.beginPath();
      const rr = r * (0.7 + R() * 0.45);
      c.ellipse(x + (R() - .5) * r * .25, y + (R() - .5) * r * .25, rr, rr * (0.8 + R() * .35), R() * 3, 0, Math.PI * 2);
      c.fill();
    }
  };
  // 一笔：沿折线画多条细线，模拟毛笔/炭笔的纤维
  P.stroke = function (pts, width, col, alpha = 0.55) {
    const c = this.c, R = this.R;
    const fibers = Math.max(4, Math.round(width * 1.4));
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (let f = 0; f < fibers; f++) {
      const off = (f / (fibers - 1) - .5) * width;
      c.strokeStyle = rgba(col, alpha * (0.35 + R() * 0.65));
      c.lineWidth = 0.6 + R() * 1.4;
      c.beginPath();
      pts.forEach(([x, y], i) => {
        const jx = x + off * 0.7 + (R() - .5) * 1.6, jy = y + off * 0.7 + (R() - .5) * 1.6;
        i ? c.lineTo(jx, jy) : c.moveTo(jx, jy);
      });
      c.stroke();
    }
  };
  P.curve = function (fn, steps = 40) { const a = []; for (let i = 0; i <= steps; i++) a.push(fn(i / steps)); return a; };
  P.circle = function (cx, cy, r, w, col, from = 0, to = Math.PI * 2) {
    this.stroke(this.curve(t => [cx + Math.cos(from + (to - from) * t) * r, cy + Math.sin(from + (to - from) * t) * r], 60), w, col);
  };
  P.rect = function (x, y, w, h, sw, col) {
    this.stroke([[x, y], [x + w, y]], sw, col); this.stroke([[x + w, y], [x + w, y + h]], sw, col);
    this.stroke([[x + w, y + h], [x, y + h]], sw, col); this.stroke([[x, y + h], [x, y]], sw, col);
  };
  P.line = function (x1, y1, x2, y2, sw, col) { this.stroke([[x1, y1], [x2, y2]], sw, col); };

  const MOTIFS = {
    window(p, w, h, ink, acc) {
      const x = w * .3, y = h * .14, ww = w * .4, hh = h * .62;
      p.wash(x, y, ww, hh, '#f4ead0', .12, 18);
      p.rect(x, y, ww, hh, 6, ink); p.line(x + ww / 2, y, x + ww / 2, y + hh, 4, ink); p.line(x, y + hh * .45, x + ww, y + hh * .45, 4, ink);
      p.wash(x + ww, y + hh * .2, w - x - ww, hh * .9, '#f4ead0', .05, 12);
      p.blot(w * .22, h * .82, 14, acc, .2, 12);
    },
    chair(p, w, h, ink, acc) {
      const x = w * .4, y = h * .3;
      p.line(x, y, x, y + h * .5, 5, ink); p.line(x, y + h * .28, x + w * .2, y + h * .28, 5, ink);
      p.line(x + w * .2, y + h * .28, x + w * .2, y + h * .5, 5, ink); p.line(x, y, x + w * .05, y - h * .02, 4, ink);
      p.wash(w * .1, h * .8, w * .8, h * .02, ink, .06, 8); p.blot(w * .72, h * .26, 20, acc, .15, 14);
    },
    clock(p, w, h, ink, acc) {
      const cx = w * .5, cy = h * .46, r = Math.min(w, h) * .26;
      p.blot(cx, cy, r * 1.1, acc, .06, 20); p.circle(cx, cy, r, 5, ink);
      p.line(cx, cy, cx + r * .05, cy - r * .7, 5, ink); p.line(cx, cy, cx + r * .62, cy + r * .2, 3, ink);
      for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; p.line(cx + Math.cos(a) * r * .85, cy + Math.sin(a) * r * .85, cx + Math.cos(a) * r * .95, cy + Math.sin(a) * r * .95, 2, ink); }
    },
    moon(p, w, h, ink, acc) {
      p.wash(0, 0, w, h, ink, .05, 14); p.blot(w * .62, h * .34, Math.min(w, h) * .16, '#f2e6c4', .22, 26);
      p.blot(w * .62, h * .34, Math.min(w, h) * .32, '#f2e6c4', .03, 20);
      p.stroke(p.curve(t => [w * .05 + t * w * .9, h * .78 + Math.sin(t * 6) * 6], 50), 4, ink, .4);
    },
    letter(p, w, h, ink, acc) {
      const x = w * .24, y = h * .3, ww = w * .52, hh = h * .36;
      p.wash(x, y, ww, hh, '#f5ecd6', .16, 18); p.rect(x, y, ww, hh, 4, ink);
      p.stroke([[x, y], [x + ww / 2, y + hh * .55], [x + ww, y]], 3, ink); p.blot(x + ww / 2, y + hh * .55, 12, acc, .35, 14);
    },
    phone(p, w, h, ink, acc) {
      p.stroke(p.curve(t => [w * .25 + t * w * .5, h * .4 - Math.sin(t * Math.PI) * h * .12], 30), 12, ink, .6);
      p.stroke(p.curve(t => [w * .5 + Math.sin(t * 22) * 12, h * .45 + t * h * .4], 80), 2, ink, .5);
      p.blot(w * .3, h * .75, 26, acc, .1, 14);
    },
    hands(p, w, h, ink, acc) {
      p.stroke(p.curve(t => [w * .05 + t * w * .4, h * .55 - Math.sin(t * 2) * h * .08], 30), 9, ink);
      p.stroke(p.curve(t => [w * .95 - t * w * .4, h * .5 + Math.sin(t * 2) * h * .06], 30), 9, ink);
      p.blot(w * .5, h * .52, 14, acc, .4, 18);
    },
    two(p, w, h, ink, acc) {
      p.blot(w * .38, h * .5, h * .2, ink, .08, 20); p.blot(w * .62, h * .5, h * .2, acc, .1, 20);
      p.line(w * .38, h * .3, w * .38, h * .8, 6, ink); p.line(w * .62, h * .3, w * .62, h * .8, 6, ink);
    },
    door(p, w, h, ink, acc) {
      const x = w * .36, y = h * .16, ww = w * .28, hh = h * .7;
      p.wash(x, y, ww, hh, '#fbf3dc', .14, 16); p.rect(x, y, ww, hh, 6, ink);
      p.stroke([[x + ww, y], [x + ww * 1.35, y + hh * .08], [x + ww * 1.35, y + hh * .92], [x + ww, y + hh]], 4, ink, .45);
      p.wash(x - w * .2, y + hh, ww + w * .4, h * .06, '#fbf3dc', .08, 10);
    },
    wave(p, w, h, ink, acc) {
      for (let k = 0; k < 5; k++) p.stroke(p.curve(t => [t * w, h * (.35 + k * .12) + Math.sin(t * 9 + k) * 10], 60), 4, k % 2 ? acc : ink, .45);
    },
    spiral(p, w, h, ink, acc) {
      p.stroke(p.curve(t => [w * .5 + Math.cos(t * 22) * t * h * .36, h * .5 + Math.sin(t * 22) * t * h * .36], 160), 3, ink, .6);
      p.blot(w * .5, h * .5, 10, acc, .5, 10);
    },
    star(p, w, h, ink, acc) {
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; p.line(w * .5, h * .48, w * .5 + Math.cos(a) * h * .3, h * .48 + Math.sin(a) * h * .3, 3, ink); }
      p.blot(w * .5, h * .48, 16, acc, .5, 14);
    },
    mirror(p, w, h, ink, acc) {
      p.wash(w * .32, h * .16, w * .36, h * .66, '#e8eef0', .1, 14);
      p.stroke(p.curve(t => [w * .5 + Math.cos(t * 6.3) * w * .18, h * .49 + Math.sin(t * 6.3) * h * .33], 70), 5, ink);
      p.line(w * .38, h * .3, w * .56, h * .66, 2, acc);
    },
    frame(p, w, h, ink, acc) {
      p.rect(w * .2, h * .16, w * .6, h * .66, 8, ink); p.rect(w * .28, h * .26, w * .44, h * .46, 3, ink);
      p.blot(w * .5, h * .49, 20, acc, .12, 16);
    },
    candle(p, w, h, ink, acc) {
      p.wash(w * .45, h * .45, w * .1, h * .38, '#f2e8d2', .2, 12); p.rect(w * .45, h * .45, w * .1, h * .38, 3, ink);
      p.blot(w * .5, h * .37, 12, acc, .45, 16); p.blot(w * .5, h * .37, 60, acc, .03, 20);
    },
    cliff(p, w, h, ink, acc) {
      p.stroke([[0, h * .5], [w * .45, h * .48], [w * .5, h * .95]], 10, ink, .6); p.wash(0, h * .5, w * .48, h * .5, ink, .07, 14);
      p.blot(w * .8, h * .25, 18, acc, .2, 12);
    },
    circle(p, w, h, ink, acc) { p.circle(w * .5, h * .48, h * .28, 7, ink); p.blot(w * .5, h * .48, h * .1, acc, .2, 14); },
    heart(p, w, h, ink, acc) {
      p.blot(w * .5, h * .5, h * .2, acc, .12, 20);
      p.stroke(p.curve(t => { const a = t * Math.PI * 2; const x = 16 * Math.sin(a) ** 3; const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a); return [w * .5 + x * h * .014, h * .48 - y * h * .014]; }, 90), 4, ink);
    },
    knot(p, w, h, ink, acc) { p.stroke(p.curve(t => [w * .5 + Math.sin(t * 6.3 * 2) * w * .25, h * .5 + Math.sin(t * 6.3 * 3) * h * .25], 120), 4, ink); p.blot(w * .5, h * .5, 10, acc, .3, 10); },
    fork(p, w, h, ink, acc) { p.line(w * .5, h * .9, w * .5, h * .5, 6, ink); p.line(w * .5, h * .5, w * .25, h * .15, 5, ink); p.line(w * .5, h * .5, w * .75, h * .15, 5, acc); },
    dots(p, w, h, ink, acc) { for (let i = 0; i < 28; i++) p.blot(p.R() * w, p.R() * h, 3 + p.R() * 8, i % 4 ? ink : acc, .25, 6); },
    figure(p, w, h, ink, acc) { p.blot(w * .5, h * .3, h * .07, ink, .3, 16); p.line(w * .5, h * .38, w * .5, h * .78, 8, ink); p.wash(w * .1, h * .82, w * .8, h * .02, ink, .08, 8); p.blot(w * .75, h * .5, 30, acc, .08, 14); },
    mouth(p, w, h, ink, acc) {
      p.stroke(p.curve(t => [w * .28 + t * w * .44, h * .5 - Math.sin(t * Math.PI) * h * .1], 30), 5, ink);
      p.stroke(p.curve(t => [w * .28 + t * w * .44, h * .5 + Math.sin(t * Math.PI) * h * .12], 30), 5, ink);
      p.blot(w * .5, h * .5, 20, acc, .2, 14);
    },
    gift(p, w, h, ink, acc) { p.wash(w * .32, h * .38, w * .36, h * .36, acc, .1, 14); p.rect(w * .32, h * .38, w * .36, h * .36, 4, ink); p.line(w * .5, h * .38, w * .5, h * .74, 3, ink); p.circle(w * .45, h * .33, 16, 3, ink); p.circle(w * .55, h * .33, 16, 3, ink); },
    flame(p, w, h, ink, acc) { p.blot(w * .5, h * .55, h * .18, acc, .14, 26); p.stroke(p.curve(t => [w * .5 + Math.sin(t * 12) * (1 - t) * 30, h * .8 - t * h * .6], 50), 5, ink); },
    thread(p, w, h, ink, acc) { p.stroke(p.curve(t => [w * .2 + t * w * .6, h * .1 + t * h * .5 + Math.sin(t * 8) * 10], 50), 2, ink); p.blot(w * .8, h * .62, 18, acc, .4, 12); p.blot(w * .2, h * .1, 10, ink, .4, 10); },
    coins(p, w, h, ink, acc) { for (let i = 0; i < 6; i++) p.circle(w * (.25 + i * .1), h * (.7 - i * .06), 18, 3, i % 2 ? acc : ink); },
    fog(p, w, h, ink, acc) { for (let i = 0; i < 7; i++) p.wash(-20, h * (.15 + i * .1), w + 40, h * .07, i % 3 ? '#ffffff' : ink, .06, 10); p.blot(w * .5, h * .5, 26, acc, .08, 12); },
    curtain(p, w, h, ink, acc) { for (let i = 0; i < 9; i++) p.stroke(p.curve(t => [w * (.08 + i * .1) + Math.sin(t * 5 + i) * 8, t * h], 30), 6, i % 3 ? acc : ink, .35); },
    scratch(p, w, h, ink, acc) { for (let i = 0; i < 14; i++) { const x = p.R() * w; p.line(x, h * .2, x + 40, h * .8, 2, i % 3 ? ink : acc); } },
    pen(p, w, h, ink, acc) { p.line(w * .25, h * .8, w * .7, h * .2, 5, ink); p.stroke(p.curve(t => [w * .1 + t * w * .8, h * .86 + Math.sin(t * 20) * 4], 80), 2, acc); },
    path(p, w, h, ink, acc) { for (let i = 0; i < 14; i++) { const t = i / 13; p.blot(w * (.1 + t * .8), h * (.8 - Math.sin(t * 3) * .4), 5, ink, .4, 6); } p.blot(w * .9, h * .2, 20, acc, .2, 12); },
    embrace(p, w, h, ink, acc) {
      p.stroke(p.curve(t => [w * .42 + Math.cos(t * 6.3) * w * .16, h * .5 + Math.sin(t * 6.3) * h * .3], 60), 6, ink);
      p.stroke(p.curve(t => [w * .58 + Math.cos(t * 6.3) * w * .16, h * .5 + Math.sin(t * 6.3) * h * .3], 60), 6, acc);
    },
    cat(p, w, h, ink, acc) { p.blot(w * .5, h * .62, h * .16, ink, .18, 20); p.blot(w * .5, h * .4, h * .08, ink, .3, 14); p.stroke([[w * .45, h * .34], [w * .46, h * .27], [w * .49, h * .33]], 3, ink); p.stroke([[w * .51, h * .33], [w * .54, h * .27], [w * .55, h * .34]], 3, ink); p.stroke(p.curve(t => [w * .64 + t * w * .15, h * .72 - Math.sin(t * 3) * 30], 20), 4, ink); },
    crack(p, w, h, ink, acc) { p.wash(w * .1, h * .1, w * .8, h * .8, acc, .06, 10); p.stroke([[w * .5, h * .05], [w * .44, h * .3], [w * .56, h * .45], [w * .46, h * .7], [w * .52, h * .95]], 3, ink); },
    lantern(p, w, h, ink, acc) { for (let i = 0; i < 4; i++) { p.blot(w * (.2 + i * .2), h * (.4 + (i % 2) * .1), 22, acc, .25, 18); p.line(w * (.2 + i * .2), 0, w * (.2 + i * .2), h * (.33 + (i % 2) * .1), 1.5, ink); } p.stroke(p.curve(t => [t * w, h * .05 + Math.sin(t * 3.1) * 10], 40), 2, ink); },
    table(p, w, h, ink, acc) { p.line(w * .15, h * .55, w * .85, h * .55, 7, ink); p.line(w * .22, h * .55, w * .22, h * .85, 4, ink); p.line(w * .78, h * .55, w * .78, h * .85, 4, ink); for (let i = 0; i < 3; i++) p.blot(w * (.3 + i * .2), h * .45, 14, i == 1 ? acc : ink, .3, 10); },
    step(p, w, h, ink, acc) { for (let i = 0; i < 5; i++) p.blot(w * (.2 + i * .15), h * (.75 - i * .1) + (i % 2) * 20, 10, i == 4 ? acc : ink, .35, 10); },
    coat(p, w, h, ink, acc) { p.wash(w * .34, h * .25, w * .32, h * .55, acc, .12, 16); p.stroke([[w * .38, h * .22], [w * .3, h * .8], [w * .7, h * .8], [w * .62, h * .22], [w * .5, h * .3], [w * .38, h * .22]], 5, ink); p.line(w * .5, h * .02, w * .5, h * .2, 2, ink); },
    arrow(p, w, h, ink, acc) { p.line(w * .15, h * .7, w * .8, h * .3, 5, ink); p.stroke([[w * .68, h * .27], [w * .8, h * .3], [w * .74, h * .42]], 5, ink); p.blot(w * .15, h * .7, 16, acc, .4, 10); },
    ear(p, w, h, ink, acc) { p.stroke(p.curve(t => [w * .5 + Math.cos(t * 4.5 - 1.6) * w * .16 * (1 - t * .3), h * .45 + Math.sin(t * 4.5 - 1.6) * h * .28 * (1 - t * .3)], 50), 6, ink); p.blot(w * .25, h * .45, 20, acc, .2, 10); },
    weight(p, w, h, ink, acc) { p.wash(w * .25, h * .45, w * .5, h * .4, ink, .16, 20); p.line(w * .5, 0, w * .5, h * .45, 2, ink); p.blot(w * .5, h * .9, 30, acc, .08, 10); },
    wilt(p, w, h, ink, acc) { p.stroke(p.curve(t => [w * .5 + Math.sin(t * 2.4) * w * .2, h * .9 - t * h * .55], 30), 3, ink); p.blot(w * .5 + Math.sin(2.4) * w * .2 + 8, h * .4, 22, acc, .3, 18); },
    lines(p, w, h, ink, acc) { for (let i = 0; i < 12; i++) p.line(w * .12, h * (.12 + i * .065), w * (.5 + p.R() * .38), h * (.12 + i * .065), 2, i == 7 ? acc : ink); },
    veil(p, w, h, ink, acc) { p.blot(w * .5, h * .45, h * .16, acc, .2, 18); for (let i = 0; i < 18; i++) p.stroke(p.curve(t => [w * (.2 + i * .035) + Math.sin(t * 4) * 6, h * .1 + t * h * .8], 20), 3, '#efe7d6', .3); },
    grid(p, w, h, ink, acc) { for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) p.rect(w * (.12 + i * .2), h * (.15 + j * .24), w * .16, h * .18, 2, ink); p.blot(w * .88, h * .85, 14, acc, .45, 10); },
    cup(p, w, h, ink, acc) { p.stroke([[w * .38, h * .4], [w * .42, h * .75], [w * .58, h * .75], [w * .62, h * .4]], 5, ink); p.circle(w * .66, h * .55, 20, 3, ink, -1.4, 1.4); p.blot(w * .5, h * .4, 18, acc, .2, 10); },
    shadow(p, w, h, ink, acc) { p.blot(w * .55, h * .55, h * .32, ink, .12, 30); p.blot(w * .35, h * .35, 12, acc, .5, 10); },
    cloud(p, w, h, ink, acc) { for (let i = 0; i < 6; i++) p.blot(w * (.3 + i * .08), h * (.4 + Math.sin(i) * .05), 40, ink, .06, 14); p.stroke(p.curve(t => [w * .3 + t * w * .4, h * .7 + t * 40], 10), 2, acc); },
    question(p, w, h, ink, acc) { p.circle(w * .5, h * .35, h * .14, 6, ink, Math.PI, Math.PI * 2.4); p.line(w * .5 + h * .06, h * .45, w * .5, h * .62, 6, ink); p.blot(w * .5, h * .74, 8, acc, .6, 10); },
    ripple(p, w, h, ink, acc) { for (let i = 1; i < 6; i++) p.circle(w * .5, h * .5, i * h * .07, 2.5, i == 1 ? acc : ink); },
    dawn(p, w, h, ink, acc) { p.wash(0, h * .62, w, h * .38, ink, .1, 14); p.blot(w * .5, h * .62, h * .16, acc, .2, 20); p.line(0, h * .62, w, h * .62, 3, ink); },
    zigzag(p, w, h, ink, acc) { const a = []; for (let i = 0; i <= 10; i++) a.push([w * (.1 + i * .08), h * (i % 2 ? .3 : .7)]); p.stroke(a, 4, ink); p.blot(w * .5, h * .5, 26, acc, .12, 12); },
    leaf(p, w, h, ink, acc) { p.blot(w * .5, h * .5, h * .18, acc, .12, 18); p.stroke(p.curve(t => [w * .5 + Math.sin(t * 3.1) * w * .15, h * .2 + t * h * .6], 30), 4, ink); p.stroke(p.curve(t => [w * .5 - Math.sin(t * 3.1) * w * .15, h * .2 + t * h * .6], 30), 4, ink); p.line(w * .5, h * .2, w * .5, h * .9, 2, ink); },
    light(p, w, h, ink, acc) { for (let i = 0; i < 6; i++) p.wash(w * (.3 + i * .05), 0, w * .03, h, '#fff6dc', .08, 8); p.blot(w * .5, h * .7, 20, acc, .4, 12); },
    open(p, w, h, ink, acc) { p.circle(w * .5, h * .5, h * .28, 6, ink, .3, Math.PI * 2 - .3); p.blot(w * .5 + h * .3, h * .5, 10, acc, .5, 10); },
    sun(p, w, h, ink, acc) { p.blot(w * .5, h * .45, h * .22, acc, .14, 26); p.circle(w * .5, h * .45, h * .2, 3, ink); },
    eye(p, w, h, ink, acc) { p.stroke(p.curve(t => [w * .2 + t * w * .6, h * .5 - Math.sin(t * Math.PI) * h * .16], 30), 4, ink); p.stroke(p.curve(t => [w * .2 + t * w * .6, h * .5 + Math.sin(t * Math.PI) * h * .16], 30), 4, ink); p.blot(w * .5, h * .5, h * .08, acc, .5, 14); },
    fade(p, w, h, ink, acc) { for (let i = 0; i < 8; i++) p.blot(w * (.2 + i * .09), h * .5, h * .12, ink, .12 - i * .013, 12); }
  };

  window.paintFigure = function (canvas, fig, hall, opts = {}) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = opts.w || canvas.clientWidth || 300, h = opts.h || canvas.clientHeight || 225;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const R = rng(fig.no * 131 + 7);
    const dark = opts.dark;
    const ground = dark ? '#d9c6b6' : mix('#efe8da', hall.stucco, 0.06);
    const ink = dark ? '#2a1410' : '#26221c';
    const acc = dark ? '#a3291a' : hall.stucco;
    ctx.fillStyle = ground; ctx.fillRect(0, 0, w, h);
    const p = new Painter(ctx, w, h, R);
    // 底色：两块色域
    p.wash(w * (.05 + R() * .2), h * (.05 + R() * .2), w * (.5 + R() * .3), h * (.5 + R() * .3), acc, .045, 24);
    p.wash(w * R() * .5, h * (.55 + R() * .2), w * .7, h * .4, ink, .02, 14);
    (MOTIFS[fig.motif] || MOTIFS.frame)(p, w, h, ink, acc);
    // 纸纹
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (R() - .5) * 18; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    ctx.putImageData(img, 0, 0);
  };
})();
