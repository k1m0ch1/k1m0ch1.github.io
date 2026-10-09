/* ============================================================
   geo.js — matematika & primitif geometri 3D
   Rumah Tipe 21 — Rumah Kopel 3.00 x 7.00 m
   ============================================================ */
'use strict';

const G = (() => {
  const EPS = 1e-9;
  const rad = d => d * Math.PI / 180;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---- vektor (array [x,y,z]) ----
  const v = (x = 0, y = 0, z = 0) => [x, y, z];
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
  const len = a => Math.hypot(a[0], a[1], a[2]);
  const norm = a => { const L = len(a) || 1; return [a[0] / L, a[1] / L, a[2] / L]; };

  // ------------------------------------------------------------
  //  Palet warna material  (base RGB 0..255)
  // ------------------------------------------------------------
  const rgb = (r, g, b) => [r, g, b];

  const MAT = {
    // --- struktur & kulit bangunan ---
    dinding:      rgb(242, 239, 232),
    dindingKopel: rgb(226, 221, 212),
    dindingDalam: rgb(245, 243, 238),
    dindingKamar: rgb(230, 242, 236),
    dindingMandi: rgb(214, 231, 238),
    dindingDapur: rgb(238, 235, 224),
    acian:        rgb(232, 228, 220),

    beton:        rgb(196, 194, 189),
    betonGelap:   rgb(168, 166, 162),
    batuKali:     rgb(146, 143, 138),
    sloof:        rgb(186, 184, 179),
    kayu:         rgb(178, 132,  86),
    kayuGelap:    rgb(124,  88,  56),
    kayuMuda:     rgb(206, 168, 120),

    genteng:      rgb(184, 102,  78),
    gentengTop:   rgb(198, 116,  88),
    nok:          rgb(140,  70,  52),
    lisplang:     rgb(232, 228, 219),
    talang:       rgb(176, 178, 180),

    spandek:      rgb(178, 184, 190),
    polycarbon:   rgb(205, 219, 226),
    baja:         rgb(120, 124, 130),
    bajaGelap:    rgb( 86,  90,  96),

    // --- lantai ---
    keramik:      rgb(242, 238, 230),
    keramikKamar: rgb(236, 226, 210),
    keramikDapur: rgb(226, 222, 214),
    keramikMandi: rgb(198, 214, 220),
    granit:       rgb(232, 228, 218),
    batuAlam:     rgb(150, 148, 143),
    paving:       rgb(178, 174, 167),
    aspal:        rgb( 92,  94,  97),
    rumput:       rgb(136, 158, 112),
    tanah:        rgb(140, 120,  96),

    // --- kusen, kaca, pintu ---
    kusen:        rgb(150, 108,  68),
    kusenPutih:   rgb(238, 236, 231),
    daunPintu:    rgb(166, 122,  78),
    pintuPutih:   rgb(240, 238, 233),
    kaca:         rgb(176, 206, 219),
    kacaGelap:    rgb( 96, 118, 130),
    besi:         rgb( 74,  78,  84),

    // --- furnitur ---
    sofa:         rgb( 96, 112, 126),
    sofaBantal:   rgb(132, 148, 160),
    rotan:        rgb(196, 168, 122),
    mejaKayu:     rgb(172, 134,  92),
    karpet:       rgb(190, 178, 162),
    kasur:        rgb(244, 242, 238),
    selimut:      rgb(150, 168, 180),
    bantal:       rgb(250, 249, 246),
    dipan:        rgb(146, 112,  76),
    lemari:       rgb(198, 176, 144),
    cermin:       rgb(198, 218, 226),
    tv:           rgb( 34,  36,  40),
    tvLayar:      rgb( 26,  30,  38),
    kulkas:       rgb(232, 234, 236),
    keramikSan:   rgb(248, 249, 250),
    steel:        rgb(196, 200, 204),
    kompor:       rgb( 44,  46,  50),
    kayuBakar:    rgb( 72,  64,  58),

    // --- tapak / lansekap ---
    pagar:        rgb(214, 209, 199),
    platBesi:     rgb( 68,  72,  78),
    air:          rgb( 96, 146, 172),
    toren:        rgb(206, 212, 216),
    daun:         rgb( 92, 132,  78),
    daunGelap:    rgb( 74, 108,  66),
    pot:          rgb(176, 148, 122),
    mobil:        rgb(176, 178, 182),
    kacaMobil:    rgb( 88, 108, 122),
    ban:          rgb( 46,  46,  48),
    lampu:        rgb(255, 246, 214),
    kabel:        rgb(112, 116, 122),
    kabelAir:     rgb(120, 156, 190),
    kabelAir2:    rgb(190, 130, 110)
  };

  const shade = (c, k) => [
    clamp(Math.round(c[0] * k), 0, 255),
    clamp(Math.round(c[1] * k), 0, 255),
    clamp(Math.round(c[2] * k), 0, 255)
  ];

  // ============================================================
  //  Mesh builder — kumpulan face (poligon) + label
  // ============================================================
  class Mesh {
    constructor() { this.faces = []; this.labels = []; }

    /* poligon umum. n = normal (opsional, dihitung otomatis) */
    poly(pts, color, o = {}) {
      if (!pts || pts.length < 3) return null;
      const n = o.n ? norm(o.n) : norm(cross(sub(pts[1], pts[0]), sub(pts[2], pts[0])));
      const f = {
        pts: pts.map(p => [p[0], p[1], p[2]]),
        n,
        color,
        room: o.room || null,
        sys: o.sys || null,          // sistem: 'dinding','atap','pondasi','sanitasi','listrik'
        op: o.op === undefined ? 1 : o.op,
        ds: !!o.ds,                  // double sided
        line: !!o.line,              // hanya garis (wire)
        hidden: !!o.hidden,          // mulai tersembunyi
        tag: o.tag || null,
        prio: o.prio || 0
      };
      this.faces.push(f);
      return f;
    }

    /* empat persegi dari 4 titik (urutan bebas, normal dari cross) */
    quad(pts, color, o = {}) { return this.poly(pts, color, o); }

    /* balok axis-aligned. x0<x1, y0<y1, z0<z1 */
    box(x0, y0, z0, x1, y1, z1, color, o = {}) {
      if (x1 - x0 < 0) [x0, x1] = [x1, x0];
      if (y1 - y0 < 0) [y0, y1] = [y1, y0];
      if (z1 - z0 < 0) [z0, z1] = [z1, z0];
      const P = [
        [x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1],  // bawah 0-3
        [x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]   // atas 4-7
      ];
      const F = [
        [[0, 3, 2, 1], [0, -1, 0]],   // -Y
        [[4, 5, 6, 7], [0, 1, 0]],    // +Y
        [[4, 7, 3, 0], [-1, 0, 0]],   // -X
        [[5, 1, 2, 6], [1, 0, 0]],    // +X
        [[0, 1, 5, 4], [0, 0, -1]],   // -Z
        [[3, 2, 6, 7], [0, 0, 1]]     // +Z
      ];
      for (const [ids, n] of F) {
        const pts = ids.map(i => P[i]);
        // pastikan winding searah normal
        const nn = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]));
        if (dot(nn, n) < 0) pts.reverse();
        this.poly(pts, color, Object.assign({ n }, o));
      }
      return this;
    }

    /* balok dari ukuran + titik min */
    boxAt(x, y, z, w, h, d, color, o) { return this.box(x, y, z, x + w, y + h, z + d, color, o); }

    /* pelat datar horizontal */
    slab(x0, z0, x1, z1, y, color, o = {}) { return this.box(x0, y - 0.02, z0, x1, y, z1, color, o); }

    /* extrude poligon 2D (bidang xy) sepanjang z */
    extrudeXY(pts2, z0, z1, color, o = {}) {
      const front = pts2.map(p => [p[0], p[1], z1]);
      const back = pts2.map(p => [p[0], p[1], z0]);
      this.poly(front, color, Object.assign({ n: [0, 0, 1], ds: true }, o));
      this.poly(back.slice().reverse(), color, Object.assign({ n: [0, 0, -1], ds: true }, o));
      for (let i = 0; i < pts2.length; i++) {
        const a = pts2[i], b = pts2[(i + 1) % pts2.length];
        const pts = [[a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]];
        const n = cross(sub(pts[1], pts[0]), sub(pts[2], pts[0]));
        if (dot(n, [1, 0, 0]) < 0 && dot(n, [0, 0, 0]) === 0) { /* noop */ }
        this.poly(pts, color, Object.assign({}, o));
      }
      return this;
    }

    /* extrude poligon 2D (bidang xz) sepanjang y (prisma horizontal) */
    extrudeXZ(pts2, y0, y1, color, o = {}) {
      const top = pts2.map(p => [p[0], y1, p[1]]);
      const bot = pts2.map(p => [p[0], y0, p[1]]);
      this.poly(top, color, Object.assign({ n: [0, 1, 0], ds: true }, o));
      this.poly(bot.slice().reverse(), color, Object.assign({ n: [0, -1, 0], ds: true }, o));
      for (let i = 0; i < pts2.length; i++) {
        const a = pts2[i], b = pts2[(i + 1) % pts2.length];
        const pts = [[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]];
        this.poly(pts, color, Object.assign({}, o));
      }
      return this;
    }

    /* bidang miring (roof plane): dua garis sejajar p0->p1 di kiri & kanan */
    ramp(a0, b0, a1, b1, thick, color, o = {}) {
      let up = norm(cross(sub(b0, a0), sub(a1, a0)));
      if (up[1] < 0) up = mul(up, -1);
      const t = mul(up, thick);
      const A = a0, B = b0, C = b1, D = a1;
      const A2 = add(A, t), B2 = add(B, t), C2 = add(C, t), D2 = add(D, t);
      // atas
      this.poly([A2, B2, C2, D2], color, Object.assign({ n: up, ds: true }, o));
      // bawah
      this.poly([D, C, B, A], color, Object.assign({ n: mul(up, -1), ds: true }, o));
      // tepi
      this.poly([A, A2, D2, D], color, o);
      this.poly([B, C, C2, B2], color, o);
      this.poly([A2, B2, B, A], color, o);
      this.poly([D, C, C2, D2], color, o);
      return this;
    }

    /* silinder (tabung) n-segi, sumbu y */
    cyl(cx, cz, y0, y1, r, color, seg = 12, o = {}) {
      const pts = [];
      for (let i = 0; i < seg; i++) {
        const a = (i / seg) * Math.PI * 2;
        pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
      }
      const top = pts.map(p => [p[0], y1, p[1]]);
      const bot = pts.map(p => [p[0], y0, p[1]]);
      this.poly(top, color, Object.assign({ n: [0, 1, 0], ds: true }, o));
      this.poly(bot.slice().reverse(), color, Object.assign({ n: [0, -1, 0], ds: true }, o));
      for (let i = 0; i < seg; i++) {
        const a = pts[i], b = pts[(i + 1) % seg];
        this.poly([[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]], color, o);
      }
      return this;
    }

    /* label 3D -> digambar sebagai teks di layar */
    label(x, y, z, text, o = {}) {
      this.labels.push(Object.assign({ p: [x, y, z], text }, o));
      return this;
    }

    /* garis bantu (dimensi) */
    line(a, b, color, o = {}) {
      this.faces.push({
        pts: [a, b], n: [0, 1, 0], color, wire: true, op: 1, ds: true,
        room: o.room || null, sys: o.sys || 'dimensi', prio: 5
      });
      return this;
    }
  }

  return {
    EPS, rad, clamp, lerp,
    v, add, sub, mul, dot, cross, len, norm,
    rgb, shade, MAT, Mesh
  };
})();

if (typeof module !== 'undefined') module.exports = G;
