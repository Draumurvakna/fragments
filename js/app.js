(function () {
  const M = window.MUSEUM;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const app = $('#app');
  const fine = matchMedia('(pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hallOf = {};
  M.halls.forEach(h => h.figures.forEach(id => (hallOf[id] = h)));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  $('#bloglink').href = M.blog;

  /* ---------- 颗粒 ---------- */
  (function grain() {
    const c = $('#grain'), x = c.getContext('2d');
    c.width = 220; c.height = 140;
    const img = x.createImageData(220, 140);
    function draw() {
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
      x.putImageData(img, 0, 0);
    }
    draw();
  })();

  /* ---------- 光标 ---------- */
  const mouse = { x: innerWidth / 2, y: innerHeight / 2, vx: 0, moved: 0 };
  addEventListener('pointermove', e => {
    mouse.vx = e.clientX - mouse.x; mouse.x = e.clientX; mouse.y = e.clientY; mouse.moved = performance.now();
  }, { passive: true });
  if (fine) {
    document.body.classList.add('has-cursor');
    const cur = $('#cursor'), ring = $('.ring', cur), dot = $('.dot', cur), lab = $('.label', cur);
    let rx = mouse.x, ry = mouse.y;
    (function loop() {
      rx += (mouse.x - rx) * .18; ry += (mouse.y - ry) * .18;
      dot.style.transform = `translate(${mouse.x}px,${mouse.y}px)`;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      lab.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('pointerover', e => {
      const t = e.target.closest('a,button,[data-cur],.room');
      cur.classList.toggle('hover', !!t);
      lab.textContent = t ? (t.dataset.cur || '') : '';
    });
  }

  /* ---------- 小地图 ---------- */
  const CELL = { 1: [0, 0], 2: [1, 0], 3: [2, 0], 4: [2, 1], 5: [1, 1], 6: [0, 1], 7: [0, 2], 8: [1, 2], 9: [2, 2] };
  function planSVG(big) {
    const W = big ? 150 : 50, H = big ? 104 : 34, G = big ? 10 : 3, ox = big ? 40 : 4, oy = big ? 40 : 14;
    const pos = id => [ox + CELL[id][0] * (W + G), oy + CELL[id][1] * (H + G)];
    const ctr = id => { const [x, y] = pos(id); return [x + W / 2, y + H / 2]; };
    let s = `<svg class="${big ? 'bigplan' : ''}" viewBox="0 0 ${ox * 2 + W * 3 + G * 2} ${oy + H * 3 + G * 2 + (big ? 40 : 6)}" role="img" aria-label="九个展厅的平面图与动线">`;
    const route = [[ox - (big ? 30 : 4), ctr(1)[1]], ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(ctr), [ctr(9)[0] + W / 2 + (big ? 30 : 4), ctr(9)[1]]];
    M.halls.forEach(h => {
      const [x, y] = pos(h.id);
      s += `<rect class="room ${h.kind !== 'standard' ? 'special' : ''}" data-hall="${h.id}" data-cur="${big ? '进入' : h.name}" x="${x}" y="${y}" width="${W}" height="${H}"><title>第 ${h.roman} 厅 · ${h.name}</title></rect>`;
      if (big) {
        s += `<text class="rn" x="${x + 12}" y="${y + 22}">${h.roman}</text>`;
        s += `<text x="${x + 12}" y="${y + H - 30}" font-size="17" font-weight="300">${h.name}</text>`;
        s += `<text class="rn" x="${x + 12}" y="${y + H - 12}" style="font-size:9px">${h.figures.length} 幅${h.kind !== 'standard' ? ' · 特展' : ''}</text>`;
      } else s += `<text class="rn" x="${x + 4}" y="${y + 11}">${h.roman}</text>`;
    });
    s += `<polyline class="route" points="${route.map(p => p.join(',')).join(' ')}"/>`;
    if (big) {
      s += `<text class="rn" x="${ox - 30}" y="${ctr(1)[1] - 10}">入口</text>`;
      s += `<text class="rn" x="${ctr(9)[0] + W / 2 - 4}" y="${ctr(9)[1] + 26}">出口</text>`;
    }
    return { svg: s + (big ? '' : '<circle class="you" r="3.2" cx="-10" cy="-10"/>') + '</svg>', ctr, ox };
  }
  const mini = planSVG(false);
  $('#minimap').innerHTML = mini.svg + '<div class="cap"><span id="mm-where">门厅</span><span>平面图</span></div>';
  $('#minimap').addEventListener('click', e => {
    const r = e.target.closest('.room');
    if (r) location.hash = 'hall-' + r.dataset.hall;
    else if (innerWidth < 700) $('#minimap').classList.toggle('min');
  });
  if (innerWidth < 700) $('#minimap').classList.add('min');
  function setMini(hallId) {
    $$('#minimap .room').forEach(r => r.classList.toggle('on', +r.dataset.hall === hallId));
    const you = $('#minimap .you');
    if (hallId) { const [x, y] = mini.ctr(hallId); you.setAttribute('cx', x); you.setAttribute('cy', y); }
    else { const [, y] = mini.ctr(1); you.setAttribute('cx', 1); you.setAttribute('cy', y); }
    const h = M.halls[hallId - 1];
    $('#mm-where').textContent = h ? `${h.roman} · ${h.name}` : '门厅';
  }

  /* ---------- 门（转场） ---------- */
  const doors = $('#doors');
  function shut(label, sub) {
    $('.leaf.l b', doors).textContent = label;
    $('.leaf.r span', doors).textContent = sub;
    doors.classList.add('shut');
    return new Promise(r => setTimeout(r, reduced ? 0 : 440));
  }
  function open() { setTimeout(() => doors.classList.remove('shut'), 120); }

  /* ---------- 参照作品 ---------- */
  function refArt(art, fallbackFig, hall, dark) {
    if (!art) return '';
    return `<figure class="refart" style="margin:0">
      <div class="fr-frame"><img src="${esc(art.src)}" alt="${esc(art.artist + art.title)}" loading="lazy" referrerpolicy="no-referrer" data-fallback="${fallbackFig}" data-hall="${hall.id}" ${dark ? 'data-dark="1"' : ''}></div>
      <figcaption class="cap"><span class="mono">参照作品</span><br><b>${esc(art.artist)} ${esc(art.title)}</b>，${esc(art.year)}${art.cap ? '<br>' + esc(art.cap) : ''}</figcaption></figure>`;
  }
  function wireFallbacks(root) {
    $$('img[data-fallback]', root).forEach(img => {
      const fail = () => {
        const c = document.createElement('canvas');
        c.style.aspectRatio = '4 / 3';
        if (!img.isConnected) return;
        img.replaceWith(c);
        const fig = M.figures[img.dataset.fallback];
        requestAnimationFrame(() => paintFigure(c, fig, M.halls[img.dataset.hall - 1], { w: c.clientWidth || 480, h: (c.clientWidth || 480) * .75, dark: !!img.dataset.dark }));
        const cap = c.closest('figure')?.querySelector('.cap');
        if (cap) cap.insertAdjacentHTML('beforeend', '<br><span style="opacity:.7">（原画未能加载，暂以代码画代替）</span>');
      };
      let done = false;
      const f2 = () => { if (done) return; done = true; img.parentElement && img.parentElement.classList.add('fb'); fail(); };
      img.addEventListener('load', () => { if (!done) { done = true; img.parentElement.classList.add('ok'); } }, { once: true });
      if (img.complete && img.naturalWidth === 0) f2(); else { img.addEventListener('error', f2, { once: true }); setTimeout(() => { if (!img.naturalWidth) f2(); }, 9000); }
    });
  }

  /* ---------- 视图：门厅 ---------- */
  function viewLobby() {
    setMini(0);
    const S = 1100, Z0 = -1000, N = M.halls.length;
    const XS = innerWidth < 760 ? .7 : 1;
    const ZEND = Z0 - (N - 1) * S - 1500;
    app.innerHTML = `
      <section class="corridor" id="corr"><div class="stage" id="stage"><div class="world" id="world"></div>
        <div class="hud"><span id="hud-depth">距入口 0.0 米</span><span class="hint" id="hud-hint">向下滚动，往里走</span><span id="hud-next"></span></div>
      </div></section>
      <section class="preface"><div class="pre-inner"><span class="mono">PRÉFACE · 前言</span><h2>写在入口</h2>${M.preface.map(t => `<p>${esc(t)}</p>`).join('')}</div></section>
      <section class="plan"><div class="plan-inner">
        <div><span class="mono" style="color:var(--ink-3)">PLAN · 平面图</span><h2>九个展厅，一条动线</h2>
          <p>从入口进来，按 I 到 IX 的顺序走一遍，大致是一段恋情从开始到出口的样子。但巴特本人反对把这些片段排成故事，所以你也可以随便推开哪扇门。</p>
          <p>虚线框是特展厅，布展方式和别的厅不一样。第 II 厅是暗房，画像要靠近了才会显影。</p>
          <p class="notice">这座展馆是 <a href="${esc(M.blog)}">博客</a> 的一个侧厅。</p></div>
        <div id="bigplan"></div></div></section>`;
    const big = planSVG(true);
    $('#bigplan').innerHTML = big.svg;
    $('#bigplan').addEventListener('click', e => { const r = e.target.closest('.room'); if (r) location.hash = 'hall-' + r.dataset.hall; });

    const world = $('#world'), items = [];
    function add(html, o) {
      const d = document.createElement('div');
      d.className = 'p3 ' + (o.cls || ''); d.innerHTML = html;
      if (o.w) d.style.width = o.w + 'px'; if (o.h) d.style.height = o.h + 'px';
      d.style.transformOrigin = '0 0';
      world.appendChild(d);
      items.push(Object.assign({ el: d }, o));
      return d;
    }
    // 墙、地、顶：分块，走过的块会隐藏
    for (let z = 500; z > ZEND - 600; z -= 500) {
      add('', { cls: 'tile-floor', w: 1600, h: 501, x: -800, y: 360, z, rx: -90, tile: 1 });
      add('', { cls: 'tile-ceil', w: 1600, h: 501, x: -800, y: -560, z, rx: -90, tile: 1 });
      add('', { cls: 'tile-wall l', w: 501, h: 920, x: -800, y: -560, z, ry: 90, tile: 1 });
      add('', { cls: 'tile-wall r', w: 501, h: 920, x: 800, y: -560, z, ry: 90, tile: 1 });
    }
    // 入口
    const ent = add(`<div class="entrance"><div class="half l"><div class="title">恋人</div><div class="meta">ROLAND BARTHES<br>1977</div></div><div class="half r"><div class="title">絮语</div><div class="meta fr" style="font-size:20px;letter-spacing:.05em">Fragments d’un discours amoureux</div></div></div>`,
      { x: 0, y: -40, z: 0, ax: '-50%', ay: '-50%', entrance: 1 });
    // 九个画架
    M.halls.forEach((h, i) => {
      const d = add(`<a class="easel3d" href="#hall-${h.id}" data-cur="进入第 ${h.roman} 厅"><div class="panel"><canvas></canvas>
        <div class="num"><span>SALA ${h.roman}</span><span>${h.figures.length} 幅</span></div><div class="nm">${esc(h.name)}</div>
        <div class="sp">${h.kind === 'standard' ? h.en : '特展厅 · ' + h.en}</div></div><div class="leg"></div><div class="foot"></div></a>`,
        { x: (i % 2 ? 360 : -360) * XS, y: 360, z: Z0 - i * S, ry: i % 2 ? -26 : 26, ax: '-50%', ay: '-100%', hall: h });
      // 背后的灰泥墙
      add('', { cls: 'slab', w: 300, h: 620, x: (i % 2 ? 640 : -640) * XS, y: -300, z: Z0 - i * S - 220, ry: i % 2 ? -8 : 8, ax: '-50%', ay: '0', bg: h.stucco });
      paintFigure($('canvas', d), M.figures[h.figures[0]], h, { w: 300, h: 220 });
    });
    add(`<div class="endwall"><span class="mono" style="color:var(--ink-3)">走廊尽头</span><div class="big">从第一厅开始</div><a href="#hall-1" data-cur="进入">进入第 I 厅 · 相遇与心动 →</a></div>`,
      { x: 0, y: -40, z: ZEND, ax: '-50%', ay: '-50%' });
    items.forEach(it => { if (it.bg) it.el.style.background = it.bg; });

    const corr = $('#corr'), stage = $('#stage');
    const half = { l: $('.half.l', ent), r: $('.half.r', ent) };
    let last = -1, alive = true, lastM = 0;
    function frame() {
      if (!alive) return;
      const top = corr.offsetTop, H = corr.offsetHeight - innerHeight;
      const p = clamp((scrollY - top) / H);
      const key = p.toFixed(4) + mouse.moved + innerWidth;
      if (key !== last) {
        last = key;
        const cam = p * (-ZEND - 300);
        const sc = Math.min(1, Math.max(.5, innerWidth / 1100));
        stage.style.perspective = 760 * sc + 'px';
        world.style.transform = `scale3d(${sc},${sc},${sc}) translateZ(${cam}px)`;
        document.body.classList.toggle('small3d', sc < .8);
        const op = clamp(p / 0.05);
        half.l.style.transform = `translateX(${-op * 760}px)`;
        half.r.style.transform = `translateX(${op * 760}px)`;
        items.forEach(it => {
          const zv = it.z + cam;
          let vis, o = 1;
          if (it.tile) vis = zv < 620 && zv - 500 > -9000;
          else if (it.entrance) vis = zv < 600;
          else { vis = zv < (it.near || 520) && zv > -9000; o = clamp(((it.near || 560) - zv) / 260) * clamp((zv + 7000) / 3500); }
          if (!it.placed) {
            it.el.style.transform = `translate3d(${it.x}px,${it.y}px,${it.z}px) rotateX(${it.rx || 0}deg) rotateY(${it.ry || 0}deg) translate(${it.ax || 0},${it.ay || 0})`;
            it.placed = 1;
          }
          it.el.style.visibility = vis ? 'visible' : 'hidden';
          if (!it.tile) it.el.style.opacity = o;
        });
        if (fine) {
          const mx = mouse.x / innerWidth - .5, my = mouse.y / innerHeight - .5;
          stage.style.perspectiveOrigin = `${50 + mx * 8}% ${46 + my * 6}%`;
        }
        $('#hud-depth').textContent = `距入口 ${(cam / 100).toFixed(1)} 米`;
        let nx = null;
        for (let i = 0; i < N; i++) if (Z0 - i * S + cam < 200) { nx = M.halls[i]; break; }
        $('#hud-next').textContent = nx ? `前方 · 第 ${nx.roman} 厅 ${nx.name}` : '';
        $('#hud-hint').style.opacity = p > .97 ? 0 : 1;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return () => { alive = false; document.body.classList.remove('small3d'); };
  }

  /* ---------- 视图：标准展厅 ---------- */
  function easelHTML(id, h) {
    const f = M.figures[id];
    return `<a class="easel" href="#fig-${id}" data-id="${id}" data-cur="近看"><div class="panel">
      <canvas></canvas>
      <div class="sc ${f.scene ? '' : 'def'}">${esc(f.scene || f.def)}</div>
      <div class="lab"><span class="fr">${esc(f.fr)}</span><span>${esc(f.zh)}</span><span class="mono">N° ${pad(f.no)}</span></div>
      ${f.scene ? '' : '<span class="stamp">布展中</span>'}
    </div><div class="leg"></div><div class="foot"></div></a>`;
  }
  function hallHead(h) {
    const unfinished = h.figures.some(i => !M.figures[i].scene);
    return `<section class="hall-head" style="--hall-stucco:${h.stucco}"><div class="roman">${h.roman}</div><div class="inner">
      <div><span class="mono">SALA ${h.roman} · <span class="en">${h.en}</span></span><h1>${esc(h.name)}</h1>
        <p class="intro">${esc(h.intro)}</p>
        <div class="count mono"><span>${h.figures.length} 幅画像</span></div>
        ${unfinished ? '<div class="banner mono">本厅画像布展中 · 墙上暂挂释义</div>' : ''}
      </div>${refArt(h.art, h.figures[0], h)}</div></section>`;
  }
  function hallExit(h) {
    const next = M.halls[h.id];
    const door = next
      ? `<a class="doorway" href="#hall-${next.id}" data-cur="推门"><div class="glow"></div><div class="t"><span class="mono">下一厅 · SALA ${next.roman}</span><b>${esc(next.name)}</b></div></a>`
      : `<a class="doorway" href="${esc(M.blog)}" data-cur="出馆"><div class="glow"></div><div class="t"><span class="mono">展馆出口</span><b>回到博客</b></div></a>`;
    return `<section class="hall-exit"><div class="inner">${door}
      <div><span class="mono" style="color:var(--ink-3)">本厅展品</span><ul class="list-figs">
      ${h.figures.map(id => { const f = M.figures[id]; return `<li><span class="mono">${pad(f.no)}</span><a href="#fig-${id}">${esc(f.zh)} <span class="fr">${esc(f.fr)}</span></a></li>`; }).join('')}
      </ul></div></div></section>`;
  }
  function viewHallList(h) {
    setMini(h.id);
    document.documentElement.style.setProperty('--stucco', h.stucco);
    const n = h.figures.length;
    app.innerHTML = hallHead(h) + `<section class="vlist">${h.figures.map((id, i) => { const f = M.figures[id]; return `
      <a class="vcard" href="#fig-${id}" data-id="${id}"><span class="vnum mono">${pad(i + 1)} / ${pad(n)}</span><canvas></canvas>
        <div class="sc">${esc(f.scene || f.def)}</div>
        <div class="lab"><span class="fr">${esc(f.fr)}</span><span>${esc(f.zh)}</span><span class="mono">N° ${pad(f.no)}</span></div></a>`; }).join('')}</section>` + hallExit(h);
    wireFallbacks(app);
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target); e.target.classList.add('in');
      const c = $('canvas', e.target);
      paintFigure(c, M.figures[e.target.dataset.id], h, { w: c.clientWidth, h: c.clientWidth * .75 });
    }), { rootMargin: '160px' });
    $$('.vcard', app).forEach(c => io.observe(c));
    return () => { io.disconnect(); document.documentElement.style.removeProperty('--stucco'); };
  }
  function viewHall(h) {
    if (innerWidth < 760) return viewHallList(h);
    setMini(h.id);
    document.documentElement.style.setProperty('--stucco', h.stucco);
    const n = h.figures.length;
    app.innerHTML = hallHead(h) + `
      <section class="track-sec" id="tsec" style="height:${n * 58 + 90}vh"><div class="track-stage" style="--hall-stucco:${h.stucco}">
        <div class="ghost" id="ghost">${h.figures.map(i => esc(M.figures[i].fr)).join(' · ')}</div>
        <div class="slit" style="left:12%"></div><div class="slit" style="left:58%"></div><div class="slit" style="left:104%"></div>
        <div class="slabs" id="slabs">${'<i></i>'.repeat(n + 2)}</div>
        <div class="track" id="track">${h.figures.map(id => easelHTML(id, h)).join('')}</div>
        <div class="track-hud mono"><span id="th-n">01 / ${pad(n)}</span><span class="bar"><i id="th-bar"></i></span><span id="th-name"></span></div>
      </div></section>` + hallExit(h);
    wireFallbacks(app);
    const sec = $('#tsec'), track = $('#track'), ghost = $('#ghost'), slabs = $('#slabs'), slits = $$('.slit', sec);
    const easels = $$('.easel', track);
    const painted = new Set();
    let alive = true, last = '';
    function frame() {
      if (!alive) return;
      const H = sec.offsetHeight - innerHeight, p = clamp((scrollY - sec.offsetTop) / H);
      const key = p.toFixed(4) + innerWidth;
      if (key !== last) {
        last = key;
        const span = track.scrollWidth - innerWidth;
        const tx = -p * span;
        track.style.transform = `translate3d(${tx}px,0,0)`;
        ghost.style.transform = `translate3d(${tx * .35 + innerWidth * .1}px,0,0)`;
        slabs.style.transform = `translate3d(${tx * .62 + innerWidth * .3}px,0,0)`;
        slits.forEach((s, i) => (s.style.transform = `translateX(${tx * .85 + i * 40}px)`));
        let best = 0, bd = 9;
        easels.forEach((e, i) => {
          const c = e.offsetLeft + e.offsetWidth / 2 + tx;
          const d = (c - innerWidth / 2) / innerWidth;
          const panel = e.firstElementChild;
          panel.style.transform = `rotateY(${clamp(-d * 26, -18, 18)}deg) translateZ(${-Math.abs(d) * 90}px)`;
          panel.style.opacity = (1 - Math.min(Math.abs(d), 1) * .42).toFixed(3);
          e.classList.toggle('active', Math.abs(d) < .16);
          if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
          if (Math.abs(d) < 1.6 && !painted.has(i)) {
            painted.add(i);
            const cv = $('canvas', e);
            paintFigure(cv, M.figures[e.dataset.id], h, { w: cv.clientWidth, h: cv.clientWidth * .75 });
          }
        });
        $('#th-n').textContent = `${pad(best + 1)} / ${pad(n)}`;
        $('#th-bar').style.width = p * 100 + '%';
        const f = M.figures[easels[best].dataset.id];
        $('#th-name').textContent = `${f.zh} · ${f.fr}`;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return () => { alive = false; document.documentElement.style.removeProperty('--stucco'); };
  }

  /* ---------- 视图：暗房（第 II 厅） ---------- */
  function viewDarkroom(h) {
    setMini(h.id);
    document.body.classList.add('dark');
    const rows = [];
    for (let i = 0; i < h.figures.length; i += 3) rows.push(h.figures.slice(i, i + 3));
    app.innerHTML = `<div class="dark-hall"><div class="glow"></div><div class="lamp"></div>
      <section class="dark-head"><div class="inner"><div>
        <span class="mono">SALA ${h.roman} · ${h.en} · SAFELIGHT ON</span><h1>${esc(h.name)}</h1>
        <p class="intro">${esc(h.intro)}</p>
        <div class="meter mono"><span>已显影 <b id="devn">0</b> / ${h.figures.length}</span><span>${fine ? '把光标移到相纸上，停一会儿' : '把相纸滑到屏幕中间，停一会儿'}</span></div>
      </div>${refArt(h.art, h.figures[0], h, true)}</div></section>
      <section class="lines" id="lines"><div class="flash" id="flash"></div>${rows.map(r => `<div class="wire-row"><svg class="wire" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path d="M0 4 Q 50 22 100 4" fill="none" stroke="#5a2a22" stroke-width=".25"/></svg>
        ${r.map(id => { const f = M.figures[id]; return `<a class="print" href="#fig-${id}" data-id="${id}" data-cur="开灯近看"><div class="peg"></div><div class="paper">
          <canvas></canvas><div class="sc">${esc(f.scene || f.def)}</div>
          <div class="lab"><span class="fr">${esc(f.fr)}</span><span>${esc(f.zh)}</span><span class="mono">N° ${pad(f.no)}</span></div>
          <span class="fixed">已定影</span></div></a>`; }).join('')}</div>`).join('')}</section>
      <section class="tray-sec"><div class="inner"><div class="tray"><div class="liquid"></div><div class="ghostprint">下一幅还在药水里</div></div>
        <div><span class="mono" style="color:#9c5a4d">暗房规矩</span><p>显影，停显，定影。一张相纸在显影液里待够了时间，影像才会浮上来；看过的画像会盖上“已定影”的章。巴特另有一本写照片的书叫《明室》，这一间是它的反面。</p>
        <a class="next" href="#hall-3" data-cur="推门">离开暗房 · 第 III 厅 身体与接触 →</a></div></div></section>
      ${hallExit(h).replace('hall-exit', 'hall-exit" style="background:#1a0a08;color:#f1c9bd')}
      </div>`;
    wireFallbacks(app);
    const prints = $$('.print', app).map(el => ({ el, paper: $('.paper', el), dev: 0, th: 0, v: 0, ph: Math.random() * 6 }));
    let painted = false;
    requestAnimationFrame(() => {
      prints.forEach(p => { const c = $('canvas', p.el); paintFigure(c, M.figures[p.el.dataset.id], h, { w: c.clientWidth, h: c.clientWidth * .75, dark: true }); });
      painted = true;
    });
    const flash = $('#flash'), linesEl = $('#lines');
    if (!fine) flash.hidden = true;
    let alive = true, t0 = performance.now(), count = 0;
    function frame(t) {
      if (!alive) return;
      const dt = Math.min(.05, (t - t0) / 1000); t0 = t;
      const fx = fine ? mouse.x : innerWidth / 2, fy = fine ? mouse.y : innerHeight * .45;
      const lr = linesEl.getBoundingClientRect();
      flash.style.setProperty('--mx', (fx - lr.left) + 'px'); flash.style.setProperty('--my', (fy - lr.top) + 'px');
      const pvx = mouse.vx; mouse.vx *= .85;
      prints.forEach(p => {
        const r = p.el.getBoundingClientRect();
        if (r.bottom < -100 || r.top > innerHeight + 100) return;
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dist = Math.hypot(fx - cx, fy - cy);
        if (painted && dist < Math.max(220, r.width * .7) && p.dev < 1) {
          p.dev = Math.min(1, p.dev + dt * .4);
          if (p.dev >= 1) { p.el.classList.add('done'); count++; $('#devn').textContent = count; }
        }
        p.paper.style.setProperty('--dev', p.dev.toFixed(3));
        // 摆动：鼠标划过时推一下
        if (fine && Math.abs(fy - cy) < r.height / 2 + 40 && Math.abs(fx - cx) < r.width / 2 + 60) p.v += pvx * .012;
        const acc = -18 * p.th - 2.2 * p.v;
        p.v += acc * dt; p.th += p.v * dt;
        const idle = reduced ? 0 : Math.sin(t / 1400 + p.ph) * .6;
        p.el.style.transform = `rotate(${clamp(p.th + idle, -12, 12)}deg)`;
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return () => { alive = false; document.body.classList.remove('dark'); };
  }

  /* ---------- 视图：涂写（第 IV 厅） ---------- */
  function viewScribble(h) {
    setMini(h.id);
    document.body.classList.add('scrib');
    const words = ['我爱你', 'je t’aime', '我……', '算了', 'again', '说不出', '删掉', '你在吗', 'JE-T-AIME', '没什么', '其实', '我爱你', '对不起', '真的', 'encore'];
    const bg = Array.from({ length: 18 }, (_, i) => {
      const w = words[i % words.length];
      const x = (i * 37 + 11) % 96, y = (i * 53 + 7) % 100, r = ((i * 29) % 30) - 15, s = 16 + (i * 13) % 52;
      return `<span class="bgw ${i % 3 === 0 ? 'x' : ''}" style="left:${x}%;top:${y}%;transform:rotate(${r}deg);font-size:${s}px">${esc(w)}</span>`;
    }).join('');
    const rot = [-3, 2, -1.5, 3, -2.5, 1, -3.5, 2.5, -1, 1.8];
    app.innerHTML = `<div class="scrib-hall" id="sh">
      <svg class="pencil" id="pencil" aria-hidden="true"><path id="pp"></path><path id="pp2"></path></svg>
      <div class="bgwords" aria-hidden="true">${bg}</div>
      <canvas class="trail" id="trail" aria-hidden="true"></canvas>
      <section class="scrib-head"><div class="inner">
        <div>
          <span class="hand-s">第 ${h.roman} 厅 · ${h.en}</span>
          <h1 class="scrib-title"><span>${esc(h.name)}</span><svg viewBox="0 0 600 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M5 38 C 140 18, 260 52, 400 28 S 560 34, 595 20"></path></svg></h1>
          <p class="intro">${esc(h.intro)}</p>
          <div class="typing" aria-hidden="true"><span id="typed"></span><i class="caret"></i><b>发送</b></div>
        </div>
        ${refArt(h.art, h.figures[0], h)}
      </div>
      <div class="blooms" aria-hidden="true"><i></i><i></i><i></i><u></u><u></u><u></u></div>
      </section>
      <section class="sheets">${h.figures.map((id, i) => { const f = M.figures[id]; return `
        <a class="sheet" href="#fig-${id}" data-id="${id}" data-cur="近看" style="--r:${rot[i % rot.length]}deg">
          <i class="tape"></i><canvas></canvas>
          <div class="draft"><span>${esc(f.def)}</span></div>
          <div class="hw">${(f.scene || f.def).split('\n').map((l, k) => `<span style="--k:${k}">${esc(l)}</span>`).join('')}</div>
          <div class="lab"><span class="fr-hand">${esc(f.fr)}</span><span class="zh">${esc(f.zh)}</span><span class="mono">N° ${pad(f.no)}</span></div>
        </a>`; }).join('')}</section>
      ${hallExit(h)}</div>`;
    wireFallbacks(app);
    const sh = $('#sh');
    // 打字又删掉的输入框
    const phrases = ['我爱你', '我好像', '在吗', '你今天……', '算了', '没事', '我想你', '晚安'];
    let pi = 0, ci = 0, del = false, tt;
    const typed = $('#typed');
    (function tick() {
      const ph = phrases[pi];
      if (!del) { ci++; if (ci > ph.length) { del = true; tt = setTimeout(tick, 1500); return; } }
      else { ci--; if (ci < 0) { del = false; ci = 0; pi = (pi + 1) % phrases.length; tt = setTimeout(tick, 600); return; } }
      typed.textContent = ph.slice(0, ci);
      tt = setTimeout(tick, del ? 80 : 240);
    })();
    // 纸页进入视野：先划掉释义，再一行行写出画像
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add('in');
      const c = $('canvas', e.target);
      paintFigure(c, M.figures[e.target.dataset.id], h, { w: c.clientWidth, h: c.clientWidth * .75 });
    }), { threshold: .25 });
    $$('.sheet', app).forEach(s => io.observe(s));
    // 跟着滚动画下去的铅笔线
    const pencil = $('#pencil'), pp = $('#pp'), pp2 = $('#pp2');
    let L1 = 1, L2 = 1;
    function buildPath() {
      const W = sh.clientWidth, H = sh.scrollHeight;
      pencil.setAttribute('viewBox', `0 0 ${W} ${H}`);
      pencil.style.height = H + 'px';
      let d = `M ${W * .1} 80`, d2 = '';
      let x = W * .1;
      for (let y = 80, i = 0; y < H - 60; y += 170, i++) {
        const nx = W * (.08 + ((i * 47) % 84) / 100);
        d += ` C ${x} ${y + 60}, ${nx + (i % 2 ? 60 : -60)} ${y + 40}, ${nx} ${y + 170}`;
        if (i % 4 === 1) { const cx = nx, cy = y + 170; d += ` c 30 -26, 52 6, 24 26 s -40 -6, -20 -30`; d2 += `M ${cx - 30} ${cy + 10} q 20 -20 46 -4 t 40 2 `; }
        x = nx;
      }
      pp.setAttribute('d', d); pp2.setAttribute('d', d2 || 'M0 0');
      L1 = pp.getTotalLength(); L2 = Math.max(1, pp2.getTotalLength());
      pp.style.strokeDasharray = L1; pp2.style.strokeDasharray = L2;
    }
    buildPath();
    const onResize = () => { clearTimeout(onResize.t); onResize.t = setTimeout(buildPath, 200); };
    addEventListener('resize', onResize);
    // 光标留下会消散的铅笔痕
    const trail = $('#trail'), tc = trail.getContext('2d');
    function sizeTrail() { const dpr = Math.min(2, devicePixelRatio || 1); trail.width = innerWidth * dpr; trail.height = innerHeight * dpr; tc.setTransform(dpr, 0, 0, dpr, 0, 0); }
    sizeTrail(); addEventListener('resize', sizeTrail);
    let lx = null, ly = null;
    const onMove = e => {
      if (lx !== null) {
        tc.strokeStyle = 'rgba(70,64,58,.45)'; tc.lineWidth = .9 + Math.random() * .8; tc.lineCap = 'round';
        tc.beginPath(); tc.moveTo(lx + (Math.random() - .5), ly + (Math.random() - .5)); tc.lineTo(e.clientX, e.clientY); tc.stroke();
      }
      lx = e.clientX; ly = e.clientY;
    };
    if (fine && !reduced) addEventListener('pointermove', onMove, { passive: true });
    let alive = true, last = -1;
    function frame() {
      if (!alive) return;
      tc.globalCompositeOperation = 'destination-out'; tc.fillStyle = 'rgba(0,0,0,.035)'; tc.fillRect(0, 0, innerWidth, innerHeight); tc.globalCompositeOperation = 'source-over';
      const H = sh.scrollHeight - innerHeight, p = clamp((scrollY - sh.offsetTop + innerHeight * .5) / H);
      if (p !== last) { last = p; pp.style.strokeDashoffset = L1 * (1 - p); pp2.style.strokeDashoffset = L2 * (1 - p); }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return () => {
      alive = false; clearTimeout(tt); io.disconnect();
      removeEventListener('resize', onResize); removeEventListener('resize', sizeTrail); removeEventListener('pointermove', onMove);
      document.body.classList.remove('scrib');
    };
  }

  /* ---------- 视图：深渊（第 VII 厅） ---------- */
  function viewAbyss(h) {
    setMini(h.id);
    document.body.classList.add('deep');
    const n = h.figures.length, MAXD = n * 15;
    let ruler = '';
    for (let m = 0; m <= MAXD + 20; m += 5) ruler += `<div class="tick ${m % 10 ? '' : 'big'}" style="top:${m * 12}px">${m % 10 ? '' : m}</div>`;
    app.innerHTML = hallHead(h).replace('class="hall-head"', 'class="hall-head abyss-head"') + `
      <section class="shaft" id="shaft" style="height:${n * 72 + 140}vh"><div class="shaft-stage" id="sst">
        <canvas id="bub" class="bub" aria-hidden="true"></canvas>
        <svg class="surface" id="surf" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden="true"><path id="wave"></path></svg>
        <div class="surf-hint mono" id="shint">水面 · 往下滚，沉下去</div>
        <div class="ruler" aria-hidden="true"><div class="ruler-in" id="ruler">${ruler}</div><i class="needle"></i></div>
        <div class="depth mono"><span>深度</span><b id="dep">0</b><span>米</span><span id="depname" class="dn"></span></div>
        ${h.figures.map((id, i) => { const f = M.figures[id]; return `<a class="drift ${i % 2 ? 'r' : 'l'}" href="#fig-${id}" data-id="${id}" data-cur="近看"><div class="card"><canvas></canvas><div class="sc">${esc(f.scene || f.def)}</div><div class="lab"><span class="fr">${esc(f.fr)}</span><span>${esc(f.zh)}</span><span class="mono">N° ${pad(f.no)}</span></div></div></a>`; }).join('')}
        <div class="seabed" id="seabed"><span class="mono">海床 · ${MAXD} 米</span><p>到底了。巴特说，沉下去的念头常常是轻的，一点小事就能把人带回水面。</p><button type="button" id="rise" data-cur="上浮">浮上来 ↑</button></div>
      </div></section>` + hallExit(h).replace('hall-exit', 'hall-exit" style="background:#0b1116;color:#cfe0ea');
    wireFallbacks(app);
    const shaft = $('#shaft'), sst = $('#sst'), cards = $$('.drift', sst), wave = $('#wave'), surf = $('#surf');
    const seabed = $('#seabed'), rulerEl = $('#ruler');
    const painted = new Set();
    $('#rise').addEventListener('click', () => scrollTo({ top: shaft.offsetTop - innerHeight * .2, behavior: reduced ? 'auto' : 'smooth' }));
    const stops = [[0, [159, 179, 189]], [.18, [86, 116, 132]], [.45, [36, 56, 70]], [.75, [16, 26, 34]], [1, [6, 10, 14]]];
    function col(p) {
      for (let i = 1; i < stops.length; i++) if (p <= stops[i][0]) {
        const [a, A] = stops[i - 1], [b, B] = stops[i], t = (p - a) / (b - a);
        return A.map((v, k) => Math.round(v + (B[k] - v) * t));
      }
      return stops[stops.length - 1][1];
    }
    // 气泡和下沉的微粒
    const bub = $('#bub'), bc = bub.getContext('2d');
    let BW = 0, BH = 0;
    function sizeB() { const dpr = Math.min(2, devicePixelRatio || 1); BW = sst.clientWidth; BH = sst.clientHeight; bub.width = BW * dpr; bub.height = BH * dpr; bc.setTransform(dpr, 0, 0, dpr, 0, 0); }
    sizeB(); addEventListener('resize', sizeB);
    const parts = Array.from({ length: fine ? 80 : 40 }, (_, i) => ({ x: Math.random(), y: Math.random(), r: i < 40 ? 1 + Math.random() * 4 : .6 + Math.random() * 1.2, up: i < 40, s: .2 + Math.random() * .8, ph: Math.random() * 6 }));
    let alive = true, lastY = scrollY, vel = 0;
    function frame(t) {
      if (!alive) return;
      const H = shaft.offsetHeight - innerHeight, p = clamp((scrollY - shaft.offsetTop) / H);
      vel = vel * .9 + (scrollY - lastY) * .1; lastY = scrollY;
      const [r, g, b] = col(p);
      sst.style.background = `rgb(${r},${g},${b})`;
      // 水面
      const ph = t / 900;
      let d = 'M0 0 L0 100';
      for (let x = 0; x <= 1200; x += 40) d += ` L${x} ${100 + Math.sin(x / 90 + ph) * 8 + Math.sin(x / 37 - ph * 1.3) * 3}`;
      wave.setAttribute('d', d + ' L1200 0 Z');
      surf.style.transform = `translateY(${-p * innerHeight * 7}px)`;
      $('#shint').style.opacity = clamp(1 - p * 25);
      // 刻度尺
      rulerEl.style.transform = `translateY(${innerHeight * .5 - p * MAXD * 12}px)`;
      $('#dep').textContent = Math.round(p * MAXD);
      // 漂过的画像
      const S = innerHeight * .62, mid = innerHeight * .5;
      let best = null, bd = 9;
      cards.forEach((c, i) => {
        const ti = (i + 1) / (n + 1);
        const y = mid + (ti - p) * (n + 1) * S;
        const dist = Math.abs(y - mid) / innerHeight;
        if (y < -innerHeight || y > innerHeight * 2) { c.style.visibility = 'hidden'; return; }
        c.style.visibility = 'visible';
        const sway = reduced ? 0 : Math.sin(t / 1800 + i * 1.7) * 14;
        const rot = reduced ? 0 : Math.sin(t / 2600 + i) * 2.2;
        c.style.transform = `translate(${sway}px, ${y}px) translateY(-50%) rotate(${rot}deg) scale(${1 - Math.min(dist, 1) * .22})`;
        if (fine) c.style.filter = `blur(${Math.min(5, dist * 6).toFixed(2)}px)`;
        c.style.opacity = clamp(1.35 - dist * 1.5).toFixed(3);
        if (dist < bd) { bd = dist; best = c; }
        if (dist < 1.2 && !painted.has(i)) { painted.add(i); const cv = $('canvas', c); paintFigure(cv, M.figures[c.dataset.id], h, { w: cv.clientWidth, h: cv.clientWidth * .75 }); }
      });
      $('#depname').textContent = best && bd < .35 ? `${M.figures[best.dataset.id].zh} · ${M.figures[best.dataset.id].fr}` : '';
      const so = clamp((p - .9) / .08);
      seabed.style.opacity = so;
      seabed.style.transform = `translate(-50%, ${(1 - so) * 70}px)`;
      seabed.style.pointerEvents = so > .5 ? 'auto' : 'none';
      // 微粒
      bc.clearRect(0, 0, BW, BH);
      parts.forEach(q => {
        if (!reduced) {
          if (q.up) q.y -= (.0009 * q.s + Math.max(0, vel) * .00012);
          else q.y += .00025 * q.s - Math.max(0, vel) * .00004;
          q.x += Math.sin(t / 1500 + q.ph) * .0002;
          if (q.y < -.05) { q.y = 1.05; q.x = Math.random(); }
          if (q.y > 1.05) { q.y = -.05; q.x = Math.random(); }
        }
        const X = q.x * BW, Y = q.y * BH;
        if (q.up) { bc.strokeStyle = `rgba(210,232,240,${.18 + p * .2})`; bc.lineWidth = 1; bc.beginPath(); bc.arc(X, Y, q.r, 0, 6.3); bc.stroke(); }
        else { bc.fillStyle = `rgba(220,230,230,${.12 + p * .25})`; bc.fillRect(X, Y, q.r, q.r); }
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return () => { alive = false; removeEventListener('resize', sizeB); document.body.classList.remove('deep'); };
  }

  /* ---------- 视图：出口（第 IX 厅） ---------- */
  function viewExit(h) {
    setMini(h.id);
    document.body.classList.add('bright');
    const n = h.figures.length, D = 1100, END = (n + 1) * D;
    app.innerHTML = hallHead(h).replace('class="hall-head"', 'class="hall-head exit-head"') + `
      <section class="exit-corr" id="xc" style="height:${n * 80 + 160}vh"><div class="xstage" id="xst"><div class="xworld" id="xw"></div><div class="xlight" id="xl"></div>
        <div class="xhud mono"><span id="xn"></span><span>每穿过一扇门，光就多一点</span></div>
        <div class="outro" id="outro"><span class="mono">展馆出口 · SORTIE</span><h2>外面是光</h2>
          <p>八十种絮语到这里看完了。巴特没有替恋人找到出口，他只是把门一扇扇打开。</p>
          <div class="outro-links"><a href="${esc(M.blog)}" data-cur="出馆">走出展馆，回到博客 ↗</a><a href="#lobby" data-cur="回门厅">从门厅再走一遍 ↺</a><a href="#index" data-cur="总目">去藏品总目</a></div></div>
      </div></section>
      <section class="hall-exit exit-list"><div class="inner"><div><span class="mono" style="color:var(--ink-3)">本厅展品</span><ul class="list-figs">
        ${h.figures.map(id => { const f = M.figures[id]; return `<li><span class="mono">${pad(f.no)}</span><a href="#fig-${id}">${esc(f.zh)} <span class="fr">${esc(f.fr)}</span></a></li>`; }).join('')}
      </ul></div></div></section>`;
    wireFallbacks(app);
    const xw = $('#xw'), xst = $('#xst'), xc = $('#xc'), items = [];
    function add(html, o) {
      const d = document.createElement('div');
      d.className = 'p3 ' + (o.cls || ''); d.innerHTML = html; d.style.transformOrigin = '0 0';
      if (o.w) d.style.width = o.w + 'px'; if (o.h) d.style.height = o.h + 'px';
      d.style.transform = `translate3d(${o.x}px,${o.y}px,${o.z}px) rotateX(${o.rx || 0}deg) rotateY(${o.ry || 0}deg) translate(${o.ax || 0},${o.ay || 0})`;
      xw.appendChild(d); items.push(Object.assign({ el: d }, o)); return d;
    }
    for (let z = 600; z > -END - 1200; z -= 600) add('', { cls: 'xfloor', w: 2400, h: 601, x: -1200, y: 380, z, rx: -90, tile: 1 });
    h.figures.forEach((id, i) => {
      const f = M.figures[id], z = -(i + 1) * D, side = i % 2 ? 1 : -1;
      add(`<div class="xdoor"><div class="lintel fr">${esc(f.fr)}</div><div class="opening"></div></div>`, { x: 0, y: 380, z, ax: '-50%', ay: '-100%', door: 1 });
      const card = add(`<a class="xcard" href="#fig-${id}" data-id="${id}" data-cur="近看"><canvas></canvas><div class="sc">${esc(f.scene || f.def)}</div><div class="lab"><span class="fr">${esc(f.fr)}</span><span>${esc(f.zh)}</span><span class="mono">N° ${pad(f.no)}</span></div></a>`,
        { x: side * 520 * (innerWidth < 760 ? .62 : 1), y: 120, z: z + 420, ry: -side * (innerWidth < 700 ? 40 : 32), ax: '-50%', ay: '-50%', card: 1, idx: i });
      paintFigure($('canvas', card), f, h, { w: 300, h: 225 });
    });
    let alive = true, last = '';
    function frame() {
      if (!alive) return;
      const H = xc.offsetHeight - innerHeight, p = clamp((scrollY - xc.offsetTop) / H);
      const key = p.toFixed(4) + mouse.moved + innerWidth;
      if (key !== last) {
        last = key;
        const cam = p * (END + 200);
        const sc = Math.min(1, Math.max(.5, innerWidth / 1100));
        xst.style.perspective = 760 * sc + 'px';
        xw.style.transform = `scale3d(${sc},${sc},${sc}) translateZ(${cam}px)`;
        document.body.classList.toggle('small3d', sc < .8);
        let cur = -1;
        items.forEach(it => {
          const zv = it.z + cam;
          let vis = zv < (it.tile ? 700 : it.door ? 420 : 560) && zv > -7000;
          it.el.style.visibility = vis ? 'visible' : 'hidden';
          if (!it.tile) it.el.style.opacity = (clamp((620 - zv) / 300) * clamp((zv + 6500) / 3200)).toFixed(3);
          if (it.card && zv > -900 && zv < 500 && cur < 0) cur = it.idx;
        });
        const k = Math.min(1, p * 1.05);
        const c = [207 + 48 * k, 201 + 53 * k, 190 + 60 * k].map(Math.round);
        xst.style.background = `rgb(${c[0]},${c[1]},${c[2]})`;
        $('#xl').style.opacity = (Math.pow(p, 3) * .95).toFixed(3);
        const outro = $('#outro'), o = clamp((p - .9) / .07);
        outro.style.opacity = o; outro.style.pointerEvents = o > .5 ? 'auto' : 'none';
        $('#xn').textContent = cur >= 0 ? `第 ${cur + 1} 扇门 · ${M.figures[h.figures[cur]].zh}` : '';
        if (fine) xst.style.perspectiveOrigin = `${50 + (mouse.x / innerWidth - .5) * 8}% ${48 + (mouse.y / innerHeight - .5) * 6}%`;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    return () => { alive = false; document.body.classList.remove('bright', 'small3d'); };
  }

  /* ---------- 视图：藏品总目 ---------- */
  function viewIndex() {
    setMini(0);
    const all = Object.entries(M.figures).sort((a, b) => a[1].no - b[1].no);
    app.innerHTML = `<section class="index-page"><div class="inner">
      <span class="mono" style="color:var(--ink-3)">CATALOGUE · 藏品总目</span><h1>八十种絮语</h1>
      <p class="lead">按原书的法文字母顺序排列。翻过卡片看释义，点开进入所在展厅近看。色点表示它挂在哪个厅。</p>
      <div class="chips" id="chips"><button class="on" data-h="0">全部 80</button>${M.halls.map(h => `<button data-h="${h.id}">${h.roman} ${h.name}</button>`).join('')}</div>
      <div class="cards" id="cards">${all.map(([id, f]) => { const h = hallOf[id]; return `<a class="card" href="#fig-${id}" data-h="${h.id}" data-id="${id}" data-cur="近看"><div class="in">
        <div class="f"><canvas></canvas><div class="no"><span>N° ${pad(f.no)}</span><span><i class="hall-dot" style="background:${h.stucco}"></i>${h.roman}</span></div><div class="fr">${esc(f.fr)}</div><div class="zh">${esc(f.zh)}</div><p class="fdef">${esc(f.def)}</p></div>
        <div class="b"><span class="mono">第 ${h.roman} 厅 · ${esc(h.name)}</span><p>${esc(f.def)}</p><span class="mono">${f.scene ? '近看 →' : '布展中 · 释义可读'}</span></div>
      </div></a>`; }).join('')}</div></div></section>`;
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const c = $('canvas', e.target), id = e.target.dataset.id;
      paintFigure(c, M.figures[id], hallOf[id], { w: c.clientWidth, h: c.clientWidth * .75 });
    }), { rootMargin: '200px' });
    $$('.card', app).forEach(c => io.observe(c));
    $('#chips').addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('#chips button').forEach(x => x.classList.toggle('on', x === b));
      $$('.card', app).forEach(c => c.classList.toggle('hide', b.dataset.h !== '0' && c.dataset.h !== b.dataset.h));
    });
    return () => io.disconnect();
  }

  /* ---------- 近看 ---------- */
  const cu = $('#closeup');
  let cuId = null;
  function openFig(id) {
    const f = M.figures[id], h = hallOf[id];
    if (!f) return;
    cuId = id;
    const list = h.figures, i = list.indexOf(id);
    const prev = list[(i - 1 + list.length) % list.length], next = list[(i + 1) % list.length];
    const text = f.scene || f.def;
    let k = 0;
    const scene = Array.from(text).map(ch => ch === '\n' ? '<span class="br"></span>' : `<span style="animation-delay:${Math.min(2600, 300 + (k++) * 38)}ms">${esc(ch)}</span>`).join('');
    const dark = h.kind === 'darkroom';
    cu.classList.toggle('dark', dark);
    cu.classList.toggle('deep', h.kind === 'abyss');
    cu.classList.toggle('paper', h.kind === 'scribble');
    cu.classList.toggle('bright', h.kind === 'exit');
    cu.innerHTML = `<button class="close" data-cur="回到展厅" aria-label="关闭近看"><span class="k">ESC · </span>关闭</button>
      <div class="left"><div class="bgfr">${esc(f.fr)}</div><div class="art"><canvas></canvas></div><div class="scene" aria-label="${esc(text)}">${scene}</div></div>
      <div class="right"><span class="mono" style="opacity:.7">N° ${pad(f.no)} · 第 ${h.roman} 厅 ${esc(h.name)}</span>
        <div class="frbig fr">${esc(f.fr)}</div><h2>${esc(f.zh)}</h2>
        <div class="def">${esc(f.def)}</div>
        <div class="guide">${f.guide ? (Array.isArray(f.guide) ? f.guide.map((t, i) => `<p><span class="sec">§${i + 1}</span>${esc(t)}</p>`).join('') : `<p>${esc(f.guide)}</p>`) : '<p style="opacity:.6">本幅导读撰写中。</p>'}</div>
        ${f.care ? '<p class="care">如果你自己也正有类似的念头，可以找信任的人聊一聊，也可以拨打全国心理援助热线 12356。</p>' : ''}
        ${f.notes ? `<div><span class="mono" style="opacity:.6">边注 · 巴特标在页边的出处</span><div class="notes" style="margin-top:10px">${f.notes.map(n => `<div>${esc(n)}</div>`).join('')}</div></div>` : ''}
        ${f.art ? refArt(f.art, id, h, dark) : ''}

        <div class="nav"><button data-go="${prev}">← ${esc(M.figures[prev].zh)}</button><button data-go="${next}">${esc(M.figures[next].zh)} →</button></div>
      </div>`;
    wireFallbacks(cu);
    cu.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      cu.classList.add('open');
      const c = $('.art canvas', cu);
      paintFigure(c, f, h, { w: c.clientWidth, h: c.clientWidth * .75, dark });
    });
    cu.setAttribute('tabindex', '-1'); cu.focus({ preventScroll: true });
  }
  function closeFig() {
    cu.classList.remove('open'); cu.setAttribute('aria-hidden', 'true'); cuId = null;
  }
  cu.addEventListener('click', e => {
    const g = e.target.closest('[data-go]');
    if (g) location.hash = 'fig-' + g.dataset.go;
    if (e.target.closest('.close')) location.hash = 'hall-' + hallOf[cuId].id;
  });
  addEventListener('keydown', e => {
    if (!cuId) return;
    if (e.key === 'Escape') location.hash = 'hall-' + hallOf[cuId].id;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const l = hallOf[cuId].figures, i = l.indexOf(cuId);
      location.hash = 'fig-' + l[(i + (e.key === 'ArrowRight' ? 1 : -1) + l.length) % l.length];
    }
  });

  /* ---------- 路由 ---------- */
  let current = { key: null, destroy: null };
  function parse() {
    const hsh = location.hash.replace('#', '');
    let m;
    if ((m = hsh.match(/^hall-(\d)$/)) && M.halls[m[1] - 1]) return { key: 'hall-' + m[1], hall: M.halls[m[1] - 1] };
    if ((m = hsh.match(/^fig-(\w+)$/)) && M.figures[m[1]]) { const h = hallOf[m[1]]; return { key: 'hall-' + h.id, hall: h, fig: m[1] }; }
    if (hsh === 'index') return { key: 'index' };
    return { key: 'lobby' };
  }
  async function route(first) {
    const r = parse();
    $$('#top nav a[data-nav]').forEach(a => a.classList.toggle('on', a.dataset.nav === r.key.split('-')[0]));
    $$('#menu .mi').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + r.key));
    if (r.key === current.key) { r.fig ? openFig(r.fig) : closeFig(); return; }
    closeFig();
    if (!first) {
      const label = r.hall ? `第 ${r.hall.roman} 厅 · ${r.hall.name}` : r.key === 'index' ? '藏品总目' : '门厅';
      const sub = r.hall ? `SALA ${r.hall.roman} · ${r.hall.en}` : r.key === 'index' ? 'CATALOGUE' : 'ENTRÉE';
      await shut(label, sub);
    }
    current.destroy && current.destroy();
    scrollTo(0, 0);
    current.key = r.key;
    const VIEWS = { darkroom: viewDarkroom, scribble: viewScribble, abyss: viewAbyss, exit: viewExit };
    current.destroy = r.hall ? (VIEWS[r.hall.kind] || viewHall)(r.hall) : r.key === 'index' ? viewIndex() : viewLobby();
    if (!first) open();
    if (r.fig) setTimeout(() => openFig(r.fig), first ? 50 : 500);
  }
  /* ---------- 手机目录 ---------- */
  (function menu() {
    const btn = $('#menuBtn'), menu = $('#menu');
    if (!btn || !menu) return;
    menu.innerHTML = `<div class="menu-in"><a class="mi" href="#lobby"><span class="mono">ENTRÉE</span>门厅<small>前言 · 平面图</small></a>
      ${M.halls.map(h => `<a class="mi" href="#hall-${h.id}"><span class="mono">${h.roman}</span>${esc(h.name)}<small>${h.figures.length} 幅${h.kind !== 'standard' ? ' · 特展' : ''}</small></a>`).join('')}
      <a class="mi" href="#index"><span class="mono">INDEX</span>藏品总目<small>80 件</small></a>
      <a class="mi out" href="${esc(M.blog)}">回到博客 ↗</a>
      <button type="button" class="mi out" id="menuInstall" hidden>安装 App</button></div>`;
    const set = o => { menu.hidden = !o; btn.setAttribute('aria-expanded', String(o)); btn.textContent = o ? '关闭' : '目录'; document.body.classList.toggle('menu-open', o); };
    btn.addEventListener('click', () => set(menu.hidden));
    menu.addEventListener('click', e => { if (e.target.closest('a, #menuInstall')) set(false); });
    addEventListener('hashchange', () => set(false));
    addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) set(false); });
  })();

  /* ---------- 安装成 App（PWA） ---------- */
  (function pwa() {
    const btn = $('#installBtn'), tip = $('#installTip');
    if (!btn) return;
    if (tip) tip.hidden = true;
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    const framed = (() => { try { return window.top !== window; } catch (e) { return true; } })();
    if ('serviceWorker' in navigator && !framed && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' }).catch(() => {});
    }
    if (standalone || framed) return;
    let deferred = null;
    const menuBtn = $('#menuInstall');
    const show = v => { btn.hidden = !v; if (menuBtn) menuBtn.hidden = !v; };
    if (menuBtn) menuBtn.addEventListener('click', () => btn.click());
    addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; show(true); });
    addEventListener('appinstalled', () => { show(false); deferred = null; });
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    if (ios) show(true);
    btn.addEventListener('click', async () => {
      if (deferred) { deferred.prompt(); try { await deferred.userChoice; } catch (e) {} deferred = null; show(false); }
      else if (ios) tip.hidden = false;
    });
    let tipTimer;
    const hideTip = () => { tip.hidden = true; clearTimeout(tipTimer); };
    tip.addEventListener('click', hideTip);
    $('#installTipClose').addEventListener('click', e => { e.stopPropagation(); hideTip(); });
    addEventListener('keydown', e => { if (e.key === 'Escape') hideTip(); });
    btn.addEventListener('click', () => { if (!tip.hidden) { clearTimeout(tipTimer); tipTimer = setTimeout(hideTip, 12000); } });
  })();
  addEventListener('hashchange', () => route(false));
  route(true);
})();
