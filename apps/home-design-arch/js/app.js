/* ============================================================
   app.js — Pengendali antarmuka: tab, viewer 3D, lembar gambar
   ============================================================ */
'use strict';

(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const el = (t, c, h) => { const n = document.createElement(t); if (c) n.className = c; if (h !== undefined) n.innerHTML = h; return n; };

  // ============================================================
  //  TAB
  // ============================================================
  const TABS = [
    { id: 'ringkasan', label: 'Ringkasan', n: '01' },
    { id: 'tiga-d', label: 'Model 3D', n: '02' },
    { id: 'ruang', label: 'Detail Ruang', n: '03' },
    { id: 'blueprint', label: 'Blueprint', n: '04' },
    { id: 'spesifikasi', label: 'Spesifikasi', n: '05' },
    { id: 'rab', label: 'RAB & Jadwal', n: '06' },
    { id: 'catatan', label: 'Catatan', n: '07' }
  ];

  function buildTabs() {
    const nav = $('#tabs');
    nav.innerHTML = TABS.map((t, i) => `<button class="tab${i === 0 ? ' on' : ''}" data-tab="${t.id}">
      <span class="tab-n">${t.n}</span><span class="tab-l">${t.label}</span></button>`).join('');
    nav.addEventListener('click', e => {
      const b = e.target.closest('.tab'); if (!b) return;
      setTab(b.dataset.tab);
    });
  }

  function setTab(id) {
    $$('.tab').forEach(b => b.classList.toggle('on', b.dataset.tab === id));
    $$('.panel').forEach(p => p.classList.toggle('on', p.id === 'panel-' + id));
    if (id === 'tiga-d') { resizeCanvas(); dirty = true; loop(); }
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }

  // ============================================================
  //  ISI PANEL
  // ============================================================
  function fillPanels() {
    $('#panel-ringkasan').innerHTML = docHeader('Ringkasan Desain', 'Parameter utama, rekapitulasi luas, dan rasional desain') + DOCS.ringkasan();
    $('#panel-ruang').innerHTML = docHeader('Detail per Ruang', 'Dimensi, material, furnitur, pencahayaan, dan catatan desain setiap ruang') + DOCS.ruang();
    $('#panel-spesifikasi').innerHTML = docHeader('Spesifikasi Teknis', 'Uraian bahan dan cara pelaksanaan per pekerjaan') + DOCS.spesifikasi();
    $('#panel-rab').innerHTML = docHeader('RAB & Jadwal Pelaksanaan', 'Rencana Anggaran Biaya, termin, kurva-S, dan pengendalian mutu') + DOCS.rab() + `<hr class="hr">` + DOCS.jadwal();
    $('#panel-catatan').innerHTML = docHeader('Catatan, Rekomendasi & Perawatan', 'Kesalahan umum, trik rumah mungil, roadmap pengembangan, dan acuan standar') + DOCS.catatan();
  }

  function docHeader(t, s) {
    return `<header class="doc-head"><h2>${t}</h2><p>${s}</p></header>`;
  }

  // ============================================================
  //  VIEWER 3D
  // ============================================================
  const V = {
    canvas: null, ctx: null, dpr: 1,
    cam: { target: [2.2, 0.9, 5.4], yaw: G.rad(162), pitch: G.rad(29), dist: 15.2, fov: 42 },
    mode: 'rumah', selected: null, varian: 'servis',
    hideRoof: false, cutFront: false, showFurn: true, showPlafon: false,
    labels: true, night: false, wire: false, autoRot: false, lift: 0,
    cache: {}, mesh: null
  };

  const MODES = [
    { id: 'rumah', label: 'Seluruh Rumah', opt: { fence: false }, cam: 'iso' },
    { id: 'potongan', label: 'Potongan', opt: { hideRoof: true, fence: false }, cam: 'iso' },
    { id: 'tapak', label: 'Tapak & Lingkungan', opt: {}, cam: 'tapak' },
    { id: 'struktur', label: 'Struktur', opt: { struktur: true, site: false, hideRoof: true, cutFront: true }, cam: 'atas' },
    { id: 'listrik', label: 'Instalasi Listrik', opt: { mep: 'listrik', site: false, hideRoof: true, cutFront: true }, cam: 'atas' },
    { id: 'air', label: 'Air Bersih', opt: { mep: 'air', site: false, hideRoof: true, cutFront: true }, cam: 'atas' },
    { id: 'sanitasi', label: 'Air Kotor & Sanitasi', opt: { mep: 'sanitasi', site: false, hideRoof: true, cutFront: true }, cam: 'atas' },
    { id: 'atap', label: 'Bidang Atap', opt: { site: false, hideRoof: false, roofOnly: true }, cam: 'iso' }
  ];

  function buildMesh() {
    const md = MODES.find(m => m.id === V.mode) || MODES[0];
    const key = V.mode + '|' + V.varian;
    if (V.cache[key]) return V.cache[key];
    const opt = Object.assign({ site: true, struktur: false, mep: null, plafon: true, varianKM: V.varian },
      md.opt);
    const mesh = SCENE.build(opt);
    // label ruang
    for (const r of M0.rooms) {
      mesh.label((r.x0 + r.x1) / 2, r.jenis === 'luar' ? 1.2 : 1.65, (r.z0 + r.z1) / 2,
        r.short + ' · ' + M0.clear(r).w.toFixed(2).replace('.', ',') + '×' + M0.clear(r).d.toFixed(2).replace('.', ',') + ' m',
        { kind: 'room', room: r.id });
    }
    // label dimensi utama bangunan
    mesh.label(1.5, 0.25, 2.55, '3,00 m', { kind: 'dim' });
    mesh.label(3.85, 0.25, 6.5, '7,00 m', { kind: 'dim' });
    mesh.label(3.40, 2.95, 3.10, 'kanopi carport 3,00 × 5,00 m', { kind: 'dim' });
    mesh.label(1.5, 4.15, 6.5, 'puncak atap +3,88 m · kemiringan 30°', { kind: 'dim' });
    V.cache[key] = { mesh, opt };
    return V.cache[key];
  }

  const M0 = MODEL;

  function resizeCanvas() {
    const c = V.canvas; if (!c) return;
    const r = c.parentElement;
    V.dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(320, Math.floor(r.clientWidth || r.getBoundingClientRect().width));
    const h = Math.max(240, Math.floor(r.clientHeight || r.getBoundingClientRect().height));
    if (!w || !h) return;
    c.width = Math.floor(w * V.dpr); c.height = Math.floor(h * V.dpr);
  }

  let raf = null, dirty = true;
  // Render dijalankan sinkron (tidak bergantung pada requestAnimationFrame)
  // sehingga tampilan tetap benar walau tab sedang tidak aktif.
  function loop() {
    if (dirty) { render3D(); dirty = false; }
    if (V.autoRot && !raf) raf = requestAnimationFrame(rotTick);
  }
  function rotTick() {
    raf = null;
    if (!V.autoRot) return;
    V.cam.yaw += 0.005;
    render3D();
    raf = requestAnimationFrame(rotTick);
  }

  // ------------------------------------------------------------
  //  Kontrol keyboard: W A S D menggerakkan kamera (dolly/strafe),
  //  Q/E turun-naik, Shift mempercepat, R mengembalikan sudut awal.
  // ------------------------------------------------------------
  const KEYS = Object.create(null);
  let moveTimer = null, moveLast = 0, moveTicks = 0;

  const MOVE_CODES = {
    KeyW: 1, KeyA: 1, KeyS: 1, KeyD: 1, KeyQ: 1, KeyE: 1, KeyR: 1,
    ArrowUp: 1, ArrowDown: 1, ArrowLeft: 1, ArrowRight: 1,
    ShiftLeft: 1, ShiftRight: 1
  };
  const HINT_CODES = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'KeyQ', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  function is3DVisible() {
    const p = document.getElementById('panel-tiga-d');
    return !!p && p.classList.contains('on');
  }
  function isTyping(t) {
    return !!t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
  }
  function clearKeys() { for (const k in KEYS) delete KEYS[k]; }

  function bindKeys() {
    window.addEventListener('keydown', e => {
      if (!is3DVisible() || isTyping(e.target)) return;
      if (!MOVE_CODES[e.code]) return;
      e.preventDefault();
      if (e.repeat) return;
      if (e.code === 'KeyR') { KEYS.KeyR = 1; resetView(); return; }
      KEYS[e.code] = 1;
      startMove();
    });
    window.addEventListener('keyup', e => {
      if (!MOVE_CODES[e.code]) return;
      delete KEYS[e.code];
      if (!anyMoveDown()) stopMove();
    });
    window.addEventListener('blur', () => { clearKeys(); stopMove(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) { clearKeys(); stopMove(); } });
  }

  function anyMoveDown() {
    for (const k of HINT_CODES) if (KEYS[k]) return true;
    return false;
  }

  // Digerakkan oleh timer, bukan requestAnimationFrame, supaya tetap jalan
  // walau tab sedang tidak aktif (rAF dijeda pada tab background).
  function startMove() {
    if (moveTimer) return;
    moveLast = performance.now();
    moveTimer = setInterval(moveStep, 16);
  }
  function stopMove() {
    if (moveTimer) { clearInterval(moveTimer); moveTimer = null; }
  }

  function moveStep() {
    if (!is3DVisible()) { clearKeys(); stopMove(); return; }
    const now = performance.now();
    const dt = Math.min(0.06, Math.max(0.001, (now - moveLast) / 1000));
    moveLast = now;
    moveTicks++;

    let f = 0, r = 0, u = 0;
    if (KEYS.KeyW || KEYS.ArrowUp) f += 1;
    if (KEYS.KeyS || KEYS.ArrowDown) f -= 1;
    if (KEYS.KeyD || KEYS.ArrowRight) r += 1;
    if (KEYS.KeyA || KEYS.ArrowLeft) r -= 1;
    if (KEYS.KeyE) u += 1;
    if (KEYS.KeyQ) u -= 1;

    if (f || r || u) {
      const boost = (KEYS.ShiftLeft || KEYS.ShiftRight) ? 2.6 : 1;
      const sp = Math.max(0.9, V.cam.dist * 0.25) * boost * dt;
      const yaw = V.cam.yaw;
      const fx = -Math.sin(yaw), fz = -Math.cos(yaw);   // arah hadap kamera (horizontal)
      const rx = Math.cos(yaw), rz = -Math.sin(yaw);    // arah kanan kamera
      V.cam.target[0] = G.clamp(V.cam.target[0] + (fx * f + rx * r) * sp, -16, 22);
      V.cam.target[2] = G.clamp(V.cam.target[2] + (fz * f + rz * r) * sp, -16, 28);
      V.cam.target[1] = G.clamp(V.cam.target[1] + u * sp, -0.8, 18);
      anim = null;
      dirty = true;
      loop();
    }
    if (!anyMoveDown()) stopMove();
  }

  function render3D() {
    const { mesh, opt } = buildMesh();
    const layers = opt.roofOnly ? { atap: true, carport: true } : null;
    V.lastMs = performance.now();
    R3D.render(V.canvas, mesh, animCam(), {
      dpr: V.dpr, selected: V.selected, night: V.night, wire: V.wire,
      labels: V.labels, hideRoof: V.hideRoof || !!opt.hideRoof || !!V.selected,
      hideCeil: !V.showPlafon, roofLift: V.lift, cutFront: V.cutFront || !!opt.cutFront,
      layers, showFurn: V.showFurn, dim: 0.10
    });
    V.lastMs = performance.now() - V.lastMs;
  }

  // animasi kamera
  let anim = null;
  function animCam() {
    if (!anim) return V.cam;
    const t = Math.min(1, (performance.now() - anim.t0) / anim.dur);
    const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const a = anim.from, b = anim.to;
    const c = {
      target: a.target.map((v, i) => v + (b.target[i] - v) * e),
      yaw: a.yaw + (b.yaw - a.yaw) * e,
      pitch: a.pitch + (b.pitch - a.pitch) * e,
      dist: a.dist + (b.dist - a.dist) * e,
      fov: a.fov + (b.fov - a.fov) * e
    };
    if (t >= 1) { Object.assign(V.cam, b); anim = null; }
    return c;
  }
  function flyTo(to, dur) {
    const from = Object.assign({}, V.cam, { target: V.cam.target.slice() });
    // putar lewat jalur terpendek
    let dy = to.yaw - from.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    to = Object.assign({}, to, { yaw: from.yaw + dy });
    anim = { from, to, t0: performance.now(), dur: dur || 750 };
    const tick = () => {
      dirty = true; loop();
      if (anim) requestAnimationFrame(tick);
      else { Object.assign(V.cam, to); dirty = true; loop(); }
    };
    dirty = true; loop();
    requestAnimationFrame(tick);
    // cadangan bila requestAnimationFrame tidak berjalan (mis. tab tidak aktif)
    setTimeout(() => {
      if (anim) { anim = null; Object.assign(V.cam, to); dirty = true; loop(); }
    }, (dur || 750) + 80);
  }

  // ---------------- interaksi ----------------
  function bindCanvas() {
    const c = V.canvas;
    let drag = null, moved = 0, pinch = null;

    const pos = e => ({ x: e.clientX, y: e.clientY });

    c.addEventListener('pointerdown', e => {
      c.setPointerCapture(e.pointerId);
      drag = { x: e.clientX, y: e.clientY, b: e.button, shift: e.shiftKey, ctrl: e.ctrlKey };
      moved = 0;
      c.classList.add('grabbing');
    });
    c.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      moved += Math.abs(dx) + Math.abs(dy);
      if (drag.b === 2 || drag.shift || drag.ctrl) {
        // pan
        const k = V.cam.dist * 0.0016;
        const cy = Math.cos(V.cam.yaw), sy = Math.sin(V.cam.yaw);
        const rx = cy, rz = -sy;             // kanan relatif kamera (bidang xz)
        V.cam.target[0] -= (dx * rx) * k;
        V.cam.target[2] -= (dx * rz) * k;
        V.cam.target[1] += dy * k;
      } else {
        V.cam.yaw -= dx * 0.0075;
        V.cam.pitch = G.clamp(V.cam.pitch + dy * 0.006, G.rad(-8), G.rad(88));
      }
      anim = null; dirty = true; loop();
    });
    const up = e => { drag = null; c.classList.remove('grabbing'); };
    c.addEventListener('pointerup', up);
    c.addEventListener('pointercancel', up);
    c.addEventListener('contextmenu', e => e.preventDefault());

    c.addEventListener('click', e => {
      if (moved > 6) return;
      const r = c.getBoundingClientRect();
      const room = R3D.pickRoom(c, buildMesh().mesh, animCam(), M0.rooms, e.clientX - r.left, e.clientY - r.top, V.dpr);
      if (room) selectRoom(room.id); else selectRoom(null);
    });

    c.addEventListener('wheel', e => {
      e.preventDefault();
      V.cam.dist = G.clamp(V.cam.dist * (1 + Math.sign(e.deltaY) * 0.09), 2.2, 70);
      anim = null; dirty = true; loop();
    }, { passive: false });

    // sentuh: pinch
    c.addEventListener('touchmove', e => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
        if (pinch) {
          V.cam.dist = G.clamp(V.cam.dist * (pinch / d), 2.2, 70);
          dirty = true; loop();
        }
        pinch = d;
      }
    }, { passive: false });
    c.addEventListener('touchend', () => { pinch = null; });
  }

  function selectRoom(id) {
    V.selected = id;
    $$('.roomlist button').forEach(b => b.classList.toggle('on', b.dataset.room === (id || '')));
    renderInfo();
    if (id) {
      const r = M0.rooms.find(x => x.id === id);
      if (r) flyTo(R3D.roomCam(r), 720);
      else dirty = true;
    } else { dirty = true; }
    loop();
  }

  function renderInfo() {
    const box = $('#v-info');
    const r = V.selected && M0.rooms.find(x => x.id === V.selected);
    if (!r) {
      const t = M0.total();
      box.innerHTML = `
        <div class="v-info-head"><span class="eyebrow">TERPILIH</span><h4>Seluruh Rumah</h4></div>
        <table class="tbl tight"><tbody>
          <tr><td>Luas bangunan</td><td class="r"><b>21,00 m²</b></td></tr>
          <tr><td>Jumlah ruang</td><td class="r">6 zona</td></tr>
          <tr><td>Tinggi plafon</td><td class="r">2,80 m</td></tr>
          <tr><td>Puncak atap</td><td class="r">+3,88 m</td></tr>
          <tr><td>KDB / KLB</td><td class="r">${(t.kdb * 100).toFixed(1).replace('.', ',')} % / ${t.klb.toFixed(2).replace('.', ',')}</td></tr>
        </tbody></table>
        <p class="v-hint">Klik salah satu ruang pada model atau daftar di atas untuk melihat detail ruang tersebut.</p>`;
      return;
    }
    const c = M0.clear(r);
    const furn = SCENE.FURN.filter(f => f.room === r.id);
    box.innerHTML = `
      <div class="v-info-head"><span class="eyebrow">${r.kode} · RUANG TERPILIH</span><h4>${r.nama}</h4></div>
      <table class="tbl tight"><tbody>
        <tr><td>Dimensi as</td><td class="r"><b>${(r.x1 - r.x0).toFixed(2).replace('.', ',')} × ${(r.z1 - r.z0).toFixed(2).replace('.', ',')} m</b></td></tr>
        <tr><td>Dimensi bersih</td><td class="r">${c.w.toFixed(2).replace('.', ',')} × ${c.d.toFixed(2).replace('.', ',')} m</td></tr>
        <tr><td>Luas bruto</td><td class="r">${((r.x1 - r.x0) * (r.z1 - r.z0)).toFixed(2).replace('.', ',')} m²</td></tr>
        <tr><td>Luas bersih</td><td class="r"><b>${(c.w * c.d).toFixed(2).replace('.', ',')} m²</b></td></tr>
        <tr><td>Tinggi plafon</td><td class="r">${r.id === 'mandi' ? '2,60' : '2,80'} m</td></tr>
      </tbody></table>
      <p class="v-desc">${r.desc}</p>
      <span class="eyebrow" style="margin-top:10px;display:block">ISI RUANG (${furn.length})</span>
      <ul class="v-list">${furn.map(f => `<li><b>${f.nama}</b><span>${f.spec}</span></li>`).join('')}</ul>
      <button class="btn small" onclick="window.__reset3d()">Kembali ke seluruh rumah</button>`;
  }

  // ---------------- kontrol UI 3D ----------------
  function build3DUI() {
    const bar = $('#v-modes');
    bar.innerHTML = MODES.map(m => `<button class="chip${m.id === 'rumah' ? ' on' : ''}" data-mode="${m.id}">${m.label}</button>`).join('');
    bar.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $$('#v-modes .chip').forEach(x => x.classList.toggle('on', x === b));
      V.mode = b.dataset.mode;
      V.selected = null;
      const md = MODES.find(m => m.id === V.mode);
      flyTo(R3D.preset(md.cam), 800);
      renderInfo(); updateRooms();
      dirty = true; loop();
    });

    const vl = $('#v-views');
    const presets = [['iso', 'Isometrik'], ['depan', 'Tampak Depan'], ['belakang', 'Tampak Belakang'],
    ['samping', 'Tampak Samping'], ['atas', 'Dari Atas'], ['burung', 'Mata Burung'], ['tapak', 'Tapak']];
    vl.innerHTML = presets.map(p => `<button class="btn small" data-v="${p[0]}">${p[1]}</button>`).join('');
    vl.addEventListener('click', e => { const b = e.target.closest('button'); if (b) flyTo(R3D.preset(b.dataset.v), 700); });

    const tl = $('#v-toggles');
    const toggles = [
      ['furn', 'Furnitur', true], ['roof', 'Atap & Plafon Atas', true], ['lab', 'Label Ruang', true],
      ['wire', 'Wireframe', false], ['night', 'Mode Malam', false], ['rot', 'Putar Otomatis', false],
      ['ceil', 'Plafon', false]
    ];
    tl.innerHTML = toggles.map(t => `<label class="sw"><input type="checkbox" data-t="${t[0]}" ${t[2] ? 'checked' : ''}><span class="sw-t">${t[1]}</span></label>`).join('');
    tl.addEventListener('change', e => {
      const k = e.target.dataset.t, on = e.target.checked;
      if (k === 'furn') V.showFurn = on;
      if (k === 'roof') { V.hideRoof = !on; if (!on) V.lift = Math.max(V.lift, 0); }
      if (k === 'lab') V.labels = on;
      if (k === 'wire') V.wire = on;
      if (k === 'night') V.night = on;
      if (k === 'rot') { V.autoRot = on; loop(); }      if (k === 'ceil') V.showPlafon = on;
      dirty = true; loop();
    });

    const sl = $('#v-lift');
    sl.addEventListener('input', () => {
      V.lift = parseFloat(sl.value);
      $('#v-lift-v').textContent = V.lift.toFixed(1) + ' m';
      dirty = true; loop();
    });

    const vb = $('#v-varian');
    vb.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      V.varian = b.dataset.v;
      $$('#v-varian button').forEach(x => x.classList.toggle('on', x === b));
      V.cache = {}; V.mesh = null; dirty = true; loop();
      toast(V.varian === 'ensuite'
        ? 'Varian ENSUITE: pintu kamar mandi dipindah ke dalam kamar tidur (kamar mandi dalam).'
        : 'Varian SERVIS: pintu kamar mandi diakses dari area dapur/servis.');
    });

    $('#v-shot').addEventListener('click', () => {
      render3D();
      const a = document.createElement('a');
      a.download = 'rumah-tipe-21-' + V.mode + (V.selected ? '-' + V.selected : '') + '.png';
      a.href = V.canvas.toDataURL('image/png');
      a.click();
    });
    window.__reset3d = resetView;
    $('#v-reset').addEventListener('click', resetView);
    $('#v-full').addEventListener('click', () => {
      const w = $('#v-stage');
      if (!document.fullscreenElement) w.requestFullscreen && w.requestFullscreen();
      else document.exitFullscreen();
      setTimeout(resizeCanvas, 120);
    });
  }

  // Kembalikan kamera + setel ulang seluruh efek tampilan
  function resetView() {
    V.selected = null; V.lift = 0;
    const sl = $('#v-lift');
    if (sl) { sl.value = 0; $('#v-lift-v').textContent = '0.0 m'; }
    $$('.roombtn').forEach(b => b.classList.remove('on'));
    const md = MODES.find(m => m.id === V.mode) || MODES[0];
    flyTo(R3D.preset(md.cam), 700);
    renderInfo(); dirty = true; loop();
  }

  function updateRooms() {
    const wrap = $('#v-rooms');
    wrap.innerHTML = `<button class="roombtn" data-room=""><b>Seluruh Rumah</b><span>6 zona · 21,00 m²</span></button>` +
      M0.rooms.map(r => `<button class="roombtn" data-room="${r.id}">
        <b>${r.nama}</b><span>${(r.x1 - r.x0).toFixed(2).replace('.', ',')} × ${(r.z1 - r.z0).toFixed(2).replace('.', ',')} m · ${((r.x1 - r.x0) * (r.z1 - r.z0)).toFixed(2).replace('.', ',')} m²</span></button>`).join('');
    wrap.querySelectorAll('.roombtn').forEach(b => b.addEventListener('click', () => selectRoom(b.dataset.room || null)));
  }

  // ============================================================
  //  BLUEPRINT
  // ============================================================
  const BP_CACHE = {};
  let bpZoom = 1, bpActive = 'A-01';

  function buildBlueprintUI() {
    const list = $('#bp-list');
    list.innerHTML = BP.DAFTAR.map(d => `<button class="bpitem" data-bp="${d[0]}">
      <span class="bpno">${d[0]}</span><span class="bpnm">${d[1]}<em>${d[3]}</em></span><span class="bpsc">${d[2]}</span></button>`).join('');
    list.addEventListener('click', e => {
      const b = e.target.closest('.bpitem'); if (!b) return;
      showBlueprint(b.dataset.bp);
    });
    $('#bp-zoom-in').addEventListener('click', () => setZoom(bpZoom * 1.25));
    $('#bp-zoom-out').addEventListener('click', () => setZoom(bpZoom / 1.25));
    $('#bp-zoom-fit').addEventListener('click', () => setZoom(1));
    $('#bp-print').addEventListener('click', () => window.print());
    $('#bp-open').addEventListener('click', () => {
      const w = window.open('', '_blank');
      w.document.write(`<!doctype html><title>${bpActive} — Rumah Tipe 21</title>
        <style>body{margin:0;background:#e8e6e1}svg{width:100%;height:auto;display:block}</style>
        ${getBlueprint(bpActive)}`);
      w.document.close();
    });
    showBlueprint('A-01');
  }

  const BP_FN = {
    'A-01': () => BP.denah(V.varian), 'A-02': () => BP.siteplan(),
    'A-03': () => BP.tampakDepan(), 'A-04': () => BP.tampakBelakang(),
    'A-05': () => BP.tampakSamping(), 'A-06': () => BP.potonganAA(V.varian),
    'A-07': () => BP.potonganBB(V.varian), 'A-08': () => BP.rencanaAtap(),
    'A-09': () => BP.rencanaPondasi(), 'A-10': () => BP.rencanaPlafon(),
    'A-11': () => BP.detailKusen(), 'A-12': () => BP.detailKonstruksi(),
    'ME-01': () => BP.instalasiListrik(), 'ME-02': () => BP.airBersih(),
    'ME-03': () => BP.airKotor()
  };

  function getBlueprint(id) {
    const key = id + '|' + V.varian;
    if (!BP_CACHE[key]) BP_CACHE[key] = (BP_FN[id] || BP_FN['A-01'])();
    return BP_CACHE[key];
  }

  function showBlueprint(id) {
    bpActive = id;
    $$('.bpitem').forEach(b => b.classList.toggle('on', b.dataset.bp === id));
    const host = $('#bp-stage');
    host.innerHTML = `<div class="bp-sheet">${getBlueprint(id)}</div>`;
    const d = BP.DAFTAR.find(x => x[0] === id);
    $('#bp-title').textContent = d ? d[0] + ' — ' + d[1] : id;
    $('#bp-sub').textContent = d ? d[3] + ' · skala ' + d[2] : '';
    setZoom(bpZoom);
  }

  function setZoom(z) {
    bpZoom = G.clamp(z, 0.45, 4);
    const s = $('#bp-stage .bp-sheet');
    if (s) s.style.width = (100 * bpZoom) + '%';
    $('#bp-zoom-v').textContent = Math.round(bpZoom * 100) + '%';
  }

  // ============================================================
  //  TOAST
  // ============================================================
  let toastT = null;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove('on'), 4200);
  }

  // ============================================================
  //  INIT
  // ============================================================
  function init() {
    buildTabs();
    fillPanels();
    build3DUI();
    updateRooms();
    renderInfo();
    V.canvas = $('#v-canvas');
    bindCanvas();
    bindKeys();
    resizeCanvas();
    buildBlueprintUI();
    window.addEventListener('resize', () => { resizeCanvas(); dirty = true; loop(); });
    selectRoom(null);
    loop();
    window.__V = V; window.__MODEL = MODEL; window.__SCENE = SCENE; window.__R3D = R3D;
    window.__KEYS = KEYS; window.__ticks = () => moveTicks;
    setTimeout(() => { resizeCanvas(); dirty = true; loop(); }, 60);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
