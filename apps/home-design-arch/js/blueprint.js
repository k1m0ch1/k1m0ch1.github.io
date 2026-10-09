/* ============================================================
   blueprint.js — Generator gambar arsitektur (SVG, lembar A3)
   Semua gambar diturunkan dari MODEL (sumber tunggal)
   ============================================================ */
'use strict';

const BP = (() => {
  const M = MODEL, R = M.roof, T = M.T, H = M.H, YT = M.YT, YB = M.YB;

  // ============================================================
  //  UTILITAS SVG
  // ============================================================
  const F = n => (Math.round(n * 100) / 100).toString();
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const L = (x1, y1, x2, y2, cls, extra) =>
    `<line x1="${F(x1)}" y1="${F(y1)}" x2="${F(x2)}" y2="${F(y2)}" class="${cls || 'thin'}" ${extra || ''}/>`;
  const RC = (x, y, w, h, cls, extra) =>
    `<rect x="${F(x)}" y="${F(y)}" width="${F(w)}" height="${F(h)}" class="${cls || 'thin'}" ${extra || ''}/>`;
  const PG = (pts, cls, extra) => `<polygon points="${pts.map(p => F(p[0]) + ',' + F(p[1])).join(' ')}" class="${cls || 'thin'}" ${extra || ''}/>`;
  const PL = (pts, cls, extra) => `<polyline points="${pts.map(p => F(p[0]) + ',' + F(p[1])).join(' ')}" class="${cls || 'thin'}" ${extra || ''}/>`;
  const CI = (cx, cy, r, cls, extra) => `<circle cx="${F(cx)}" cy="${F(cy)}" r="${F(r)}" class="${cls || 'thin'}" ${extra || ''}/>`;
  // Perhatikan: aturan CSS di dalam <style> mengalahkan presentation attribute,
  // jadi atribut font-size / text-anchor / fill / letter-spacing diubah ke style inline.
  const TX = (x, y, s, cls, extra) => {
    let st = [];
    const cleaned = String(extra || '').replace(
      /(font-size|text-anchor|letter-spacing|fill)\s*=\s*"([^"]*)"/g,
      (m, k, v) => { st.push(k + ':' + v); return ''; }
    );
    const style = st.length ? ` style="${st.join(';')}"` : '';
    return `<text x="${F(x)}" y="${F(y)}" class="${cls || 'lbl'}"${style} ${cleaned}>${esc(s)}</text>`;
  };

  function arcPts(cx, cy, r, a0, a1, n = 14) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const a = a0 + (a1 - a0) * i / n;
      out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    return out;
  }

  // ============================================================
  //  DEFINISI STYLE & SHEET
  // ============================================================
  const DEFS = `
<defs>
  <pattern id="hatch" width="2.2" height="2.2" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="2.2" stroke="#2d3142" stroke-width="0.45"/>
  </pattern>
  <pattern id="hatchSoft" width="3" height="3" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
    <line x1="0" y1="0" x2="0" y2="3" stroke="#7a8399" stroke-width="0.25"/>
  </pattern>
  <pattern id="paving" width="4" height="4" patternUnits="userSpaceOnUse">
    <path d="M0 0 H4 M0 0 V4" stroke="rgba(45,49,66,0.18)" stroke-width="0.2" fill="none"/>
  </pattern>
  <pattern id="tile" width="5" height="5" patternUnits="userSpaceOnUse">
    <path d="M0 0 H5 M0 0 V5" stroke="rgba(45,49,66,0.10)" stroke-width="0.16" fill="none"/>
  </pattern>
  <pattern id="grass" width="3.4" height="3.4" patternUnits="userSpaceOnUse">
    <path d="M0.6 3.4 Q1.2 1.2 0.9 0 M2.4 3.4 Q2.2 1.6 2.9 0.4" stroke="rgba(90,122,74,0.55)" stroke-width="0.22" fill="none"/>
  </pattern>
  <marker id="arw" markerWidth="6" markerHeight="6" refX="4.6" refY="3" orient="auto">
    <polygon points="0 0, 6 3, 0 6" fill="#4f5d75"/>
  </marker>
  <marker id="arwA" markerWidth="6" markerHeight="6" refX="4.6" refY="3" orient="auto">
    <polygon points="0 0, 6 3, 0 6" fill="#eb6c36"/>
  </marker>
</defs>`;

  const STYLE = `
<style>
  .thin   { fill:none; stroke:#2d3142; stroke-width:0.3; stroke-linecap:round; }
  .med    { fill:none; stroke:#2d3142; stroke-width:0.55; }
  .thick  { fill:none; stroke:#2d3142; stroke-width:1.0; }
  .xthick { fill:none; stroke:#2d3142; stroke-width:1.5; }
  .soft   { fill:none; stroke:#7a8399; stroke-width:0.3; }
  .soft2  { fill:none; stroke:#7a8399; stroke-width:0.22; stroke-dasharray:2 1.4; }
  .accent { fill:none; stroke:#eb6c36; stroke-width:0.7; }
  .accent2{ fill:none; stroke:#eb6c36; stroke-width:0.35; stroke-dasharray:1.6 1.2; }
  .hid    { fill:none; stroke:#7a8399; stroke-width:0.3; stroke-dasharray:3 1.4; }
  .cut    { fill:url(#hatch); stroke:#2d3142; stroke-width:0.5; }
  .cut2   { fill:url(#hatchSoft); stroke:#7a8399; stroke-width:0.35; }
  .solid  { fill:#2d3142; stroke:none; }
  .lbl    { font:600 6.4px Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif; fill:#2d3142; text-anchor:middle; }
  .lbl.sm { font-size:5.2px; }
  .sub    { font:500 4.6px 'Geist Mono', 'SFMono-Regular', Consolas, monospace; fill:#4f5d75; text-anchor:middle; letter-spacing:0.02em; }
  .area   { font:400 4.4px 'Geist Mono', 'SFMono-Regular', Consolas, monospace; fill:#7a8399; text-anchor:middle; }
  .dimt   { font:400 4.4px 'Geist Mono', 'SFMono-Regular', Consolas, monospace; fill:#4f5d75; text-anchor:middle; }
  .dimt.s { font-size:3.8px; }
  .note   { font:400 4.6px Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif; fill:#2d3142; }
  .noteB  { font:600 5px Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif; fill:#2d3142; }
  .ttl    { font:600 7.6px Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif; fill:#2d3142; }
  .sheetid{ font:600 20px Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif; fill:#2d3142; text-anchor:end; }
  .legend { font:400 4.4px Geist, 'Helvetica Neue', Helvetica, Arial, sans-serif; fill:#4f5d75; }
</style>`;

  function titleBlock(o) {
    const W = 420, Hh = 297, bw = 150, bh = 30, x0 = W - 8 - bw, y0 = Hh - 8 - bh;
    const cA = x0 + 78;
    return `
<g>
  ${RC(x0, y0, bw, bh, 'thin', 'fill="#f5f5f5" stroke-width="0.5"')}
  ${L(cA, y0, cA, y0 + bh, 'soft')}
  ${L(x0, y0 + 8, x0 + bw, y0 + 8, 'soft')}
  ${L(x0, y0 + 15, x0 + bw, y0 + 15, 'soft')}
  ${L(x0, y0 + 22, x0 + bw, y0 + 22, 'soft')}
  ${TX(x0 + 3, y0 + 5.6, 'PROYEK', 'sub', 'text-anchor="start" font-size="3.6"')}
  ${TX(x0 + 3, y0 + 12.8, 'RUMAH TIPE 21/72', 'noteB', 'text-anchor="start" font-size="4.6"')}
  ${TX(x0 + 3, y0 + 19.6, 'Kavling 6,00 × 12,00 m  ·  GSB 3,00 m', 'note', 'text-anchor="start" font-size="3.4"')}
  ${TX(x0 + 3, y0 + 26.6, 'Kepmen Kimpraswil 403/2002  ·  SNI 03-1733-2004', 'note', 'text-anchor="start" font-size="3.4"')}
  ${TX(cA + 3, y0 + 5.6, 'NAMA GAMBAR', 'sub', 'text-anchor="start" font-size="3.6"')}
  ${TX(cA + 3, y0 + 12.8, o.judul, 'noteB', 'text-anchor="start" font-size="4.6"')}
  ${TX(cA + 3, y0 + 19.6, 'Skala ' + o.skala + '   ·   satuan mm', 'note', 'text-anchor="start" font-size="3.4"')}
  ${TX(cA + 3, y0 + 26.6, M.meta.tanggal + '   ·   Rev 00', 'note', 'text-anchor="start" font-size="3.4"')}
  ${TX(x0 + bw - 4, y0 - 2.5, o.no, 'sheetid', 'font-size="22"')}
</g>`;
  }

  function sheet(o) {
    const W = 420, Hh = 297, m = 8;
    return `<svg viewBox="0 0 ${W} ${Hh}" xmlns="http://www.w3.org/2000/svg" font-family="Geist, system-ui, sans-serif">
${DEFS}${STYLE}
  <rect width="${W}" height="${Hh}" fill="#f5f5f5"/>
  ${RC(m, m, W - 2 * m, Hh - 2 * m, 'med')}
  ${RC(m + 1.6, m + 1.6, W - 2 * m - 3.2, Hh - 2 * m - 3.2, 'thin')}
  ${o.head !== false ? `
  <g>
    ${TX(m + 6, m + 9.5, o.judul, 'ttl', 'text-anchor="start" font-size="8.4"')}
    ${TX(m + 6, m + 14, o.sub || '', 'sub', 'text-anchor="start" font-size="4.8"')}
    <line x1="${m + 6}" y1="${m + 17}" x2="${W - m - 6}" y2="${m + 17}" stroke="rgba(45,49,66,0.18)" stroke-width="0.35"/>
  </g>` : ''}
  ${o.content}
  ${titleBlock(o)}
</svg>`;
  }

  // transformasi denah :  x -> kanan,  z -> ke atas (depan di bawah)
  function planT(k, ox, oy, zRef) {
    return {
      k, ox, oy, zRef,
      X: x => ox + x * k,
      Y: z => oy + (zRef - z) * k,
      L: v => v * k
    };
  }

  // ============================================================
  //  DIMENSI (rantai ukur)
  // ============================================================
  function tick(x, y, ang) {
    const d = 1.1, a = ang === undefined ? Math.PI / 4 : ang;
    return L(x - Math.cos(a) * d, y + Math.sin(a) * d, x + Math.cos(a) * d, y - Math.sin(a) * d, 'soft');
  }
  function dimH(x1, x2, y, text, cls, ext) {
    let s = '';
    if (ext) s += L(x1, ext[0], x1, y - 1.6, 'soft2') + L(x2, ext[0], x2, y - 1.6, 'soft2');
    s += L(x1, y, x2, y, 'soft');
    s += tick(x1, y) + tick(x2, y);
    if (text) s += TX((x1 + x2) / 2, y - 1.3, text, 'dimt ' + (cls || ''));
    return s;
  }
  function dimV(y1, y2, x, text, cls, ext) {
    let s = '';
    if (ext) s += L(ext[0], y1, x - 1.6, y1, 'soft2') + L(ext[0], y2, x - 1.6, y2, 'soft2');
    s += L(x, y1, x, y2, 'soft');
    s += tick(x, y1, -Math.PI / 4) + tick(x, y2, -Math.PI / 4);
    if (text) s += `<text x="${F(x - 1.4)}" y="${F((y1 + y2) / 2)}" class="dimt ${cls || ''}" text-anchor="middle" transform="rotate(-90 ${F(x - 1.4)} ${F((y1 + y2) / 2)})">${esc(text)}</text>`;
    return s;
  }
  // panah vertikal untuk tampak/potongan
  function dimVup(x, y1, y2, text) { return dimV(y1, y2, x, text); }

  // ============================================================
  //  POTONGAN DINDING UNTUK DENAH
  // ============================================================
  function wallParts(w, varian) {
    const ops = w.openings.filter(o => !o.varian || o.varian === varian).slice().sort((a, b) => a.a - b.a);
    const segs = []; let cur = w.a;
    for (const op of ops) { segs.push([cur, op.a]); cur = op.b; }
    segs.push([cur, w.b]);
    return { segs: segs.filter(s => s[1] - s[0] > 0.004), ops };
  }

  function wallRectPlan(P, w, u0, u1, cls) {
    const t = w.t;
    if (w.dir === 'x') {
      const x0 = P.X(u0), x1 = P.X(u1);
      const y0 = P.Y(w.at + t / 2), y1 = P.Y(w.at - t / 2);
      return RC(x0, y0, x1 - x0, y1 - y0, cls || 'cut');
    }
    const y0 = P.Y(u0), y1 = P.Y(u1);
    const x0 = P.X(w.at - t / 2), x1 = P.X(w.at + t / 2);
    return RC(x0, Math.min(y0, y1), x1 - x0, Math.abs(y1 - y0), cls || 'cut');
  }

  // ============================================================
  //  GAMBAR 1 — DENAH BANGUNAN
  // ============================================================
  function denah(varian) {
    const k = 20, P = planT(k, 104, 30, 11.30);
    let s = '';

    // lantai per ruang
    for (const r of M.rooms) {
      const x0 = P.X(r.x0 + 0.075), x1 = P.X(r.x1 - (r.id === 'teras' ? 0 : 0.075));
      const y0 = P.Y(r.z1 - (r.id === 'teras' ? 0 : 0.075)), y1 = P.Y(r.z0 + (r.z0 === 3.0 ? 0 : 0.075));
      const wet = (r.id === 'mandi' || r.id === 'dapur');
      s += RC(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0),
        'thin', `fill="${r.jenis === 'luar' ? '#ece7de' : wet ? '#e7eef1' : '#f2efe8'}" stroke="none"`);
      s += RC(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0), 'thin',
        `fill="url(#tile)" stroke="none"`);
    }

    // kusen & daun pintu (digambar sebelum dinding agar tertutup rapi)
    for (const w of M.walls) {
      const wp = wallParts(w, varian);
      for (const op of wp.ops) {
        const isX = w.dir === 'x';
        if (op.jns === 'pintu' || op.jns === 'lubang') {
          // daun pintu + busur bukaan
          const sign = (op.buka || '').indexOf('keluar') >= 0 ? -1 : 1;
          const hingeB = (op.buka || '').indexOf('kanan') >= 0;
          const kiri = hingeB ? -1 : 1;
          const r = (op.b - op.a) * k;
          const hx = isX ? (hingeB ? op.b : op.a) : w.at;
          const hz = isX ? w.at : (hingeB ? op.b : op.a);
          const off = isX ? (w.at + sign * (w.t / 2 + 0.02)) : (w.at + sign * (w.t / 2 + 0.02));
          const cxp = isX ? P.X(hx) : P.X(off);
          const cyp = isX ? P.Y(off) : P.Y(hz);
          const ex = isX ? P.X(hx + kiri * (op.b - op.a)) : P.X(off);
          const ey = isX ? P.Y(off) : P.Y(hz + kiri * (op.b - op.a));
          if (op.jns === 'pintu') {
            const a0 = Math.atan2(cyp - P.Y(hz), cxp - P.X(hx));
            const a1 = Math.atan2(ey - cyp, ex - cxp);
            s += PL(arcPts(cxp, cyp, r, a0, a1, 16), 'soft');
            s += L(cxp, cyp, ex, ey, 'med');
            s += CI(cxp, cyp, 0.7, 'soft');
          } else {
            s += L(P.X(isX ? op.a : off), P.Y(isX ? off : op.a), P.X(isX ? op.b : off), P.Y(isX ? off : op.b), 'soft2');
            s += TX(isX ? P.X((op.a + op.b) / 2) : P.X(off + 0.35), isX ? P.Y(off) - 1 : P.Y((op.a + op.b) / 2), op.id, 'sub', 'font-size="3.6"');
          }
        }
        if (op.jns === 'jendela') {
          const a0 = op.a, b0 = op.b, t2 = w.t / 2;
          if (isX) {
            for (const dz of [-t2, 0, t2]) {
              s += L(P.X(a0), P.Y(w.at + dz), P.X(b0), P.Y(w.at + dz), dz === 0 ? 'thin' : 'med');
            }
            s += L(P.X(a0), P.Y(w.at - t2), P.X(a0), P.Y(w.at + t2), 'med');
            s += L(P.X(b0), P.Y(w.at - t2), P.X(b0), P.Y(w.at + t2), 'med');
            s += TX(P.X((a0 + b0) / 2), P.Y(w.at) + 1.2, op.id, 'sub', 'font-size="3.6"');
          } else {
            for (const dx of [-t2, 0, t2]) {
              s += L(P.X(w.at + dx), P.Y(a0), P.X(w.at + dx), P.Y(b0), dx === 0 ? 'thin' : 'med');
            }
            s += L(P.X(w.at - t2), P.Y(a0), P.X(w.at + t2), P.Y(a0), 'med');
            s += L(P.X(w.at - t2), P.Y(b0), P.X(w.at + t2), P.Y(b0), 'med');
            s += TX(P.X(w.at) + 1.2, P.Y((a0 + b0) / 2), op.id, 'sub', 'font-size="3.6"', 'transform="rotate(-90 ' + F(P.X(w.at) + 1.2) + ' ' + F(P.Y((a0 + b0) / 2)) + ')"');
          }
        }
        if (op.jns === 'lubang' && op.id !== 'P4') {
          s += CI(P.X(isX ? (op.a + op.b) / 2 : w.at), P.Y(isX ? w.at : (op.a + op.b) / 2), 1.1, 'soft2');
          s += CI(P.X(isX ? (op.a + op.b) / 2 : w.at), P.Y(isX ? w.at : (op.a + op.b) / 2), 0.35, 'solid');
        }
      }
      // dinding terpotong
      for (const sg of wp.segs) s += wallRectPlan(P, w, sg[0], sg[1], w.type === 'kopel' ? 'cut2' : 'cut');
    }

    // furnitur (siluet)
    for (const f of SCENE.FURN) {
      for (const b of f.b) {
        const x0 = P.X(b[1]), x1 = P.X(b[4]), y0 = P.Y(b[6]), y1 = P.Y(b[3]);
        s += RC(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0), 'thin',
          'fill="#ddd8cc" stroke="none" opacity="0.75"');
      }
    }
    for (const f of SCENE.FURN) {
      let mx = -9, mx2 = 9, mz = 9, mz2 = -9;
      for (const b of f.b) { mx = Math.max(mx, b[4]); mx2 = Math.min(mx2, b[1]); mz = Math.min(mz, b[3]); mz2 = Math.max(mz2, b[6]); }
      s += RC(P.X(mx2), P.Y(mz2), P.X(mx) - P.X(mx2), P.Y(mz) - P.Y(mz2), 'soft', 'fill="none" stroke-width="0.22" opacity="0.55"');
    }

    // label ruang (nama pendek + luas) + penomoran zona
    M.rooms.forEach((r, i) => {
      const cx = P.X((r.x0 + r.x1) / 2), cy = P.Y((r.z0 + r.z1) / 2);
      const cl = M.clear(r);
      const netto = cl.w * cl.d;
      const sempit = (r.x1 - r.x0) * k < 38;
      s += CI(cx, cy - (sempit ? 11 : 12.5), 3.1, 'thin', 'fill="#f5f5f5"');
      s += TX(cx, cy - 9.6, String(i + 1), 'sub', 'font-size="3.8"');
      if (!sempit) s += TX(cx, cy - 2.4, r.short.toUpperCase(), 'lbl', 'font-size="5.0"');
      s += TX(cx, cy + (sempit ? 0.6 : 2.6), netto.toFixed(2).replace('.', ',') + ' m²', 'area', 'font-size="4.2"');
      if (sempit) s += TX(cx + 0, cy + 5.4, r.short.toUpperCase(), 'sub', 'font-size="3.0"');
    });
    s += roomTable(215, 66);

    // penanda potongan A-A dan B-B
    s += `<g>${L(P.X(-0.6), P.Y(7.00), P.X(3.6), P.Y(7.00), 'accent2')}
      ${TX(P.X(-1.55), P.Y(7.0), 'A', 'lbl', 'fill="#eb6c36" font-size="5.5"')}
      ${TX(P.X(4.25), P.Y(7.0), 'A', 'lbl', 'fill="#eb6c36" font-size="5.5"')}</g>`;
    s += `<g>${L(P.X(1.50), P.Y(2.4), P.X(1.50), P.Y(10.6), 'accent2')}
      ${TX(P.X(1.50), P.Y(10.9), 'B', 'lbl', 'fill="#eb6c36" font-size="5.5"')}
      ${TX(P.X(1.50), P.Y(2.1), 'B', 'lbl', 'fill="#eb6c36" font-size="5.5"')}</g>`;
    s += TX(P.X(1.5), P.Y(11.05), '', 'sub');

    // ---- rantai dimensi ----
    const zB = 11.30;
    // horizontal (bawah) — di bawah teras (z = 3.00)
    const yDim1 = P.Y(2.55), yDim2 = P.Y(1.95), yDim3 = P.Y(1.35);
    s += dimH(P.X(0), P.X(0.95), yDim1, '950', 's', [P.Y(3.0)]);
    s += dimH(P.X(0.95), P.X(1.65), yDim1, '700', 's');
    s += dimH(P.X(1.65), P.X(3.00), yDim1, '1.350', 's');
    s += dimH(P.X(0), P.X(3.00), yDim2, '3.000', '', [P.Y(3.0)]);
    s += dimH(P.X(-0.20), P.X(3.55), yDim3, 'overstek atap 3.750', 's');
    // partisi atas (belakang) — di atas z=10
    const yDimT = P.Y(10.45), yDimT2 = P.Y(11.05);
    s += dimH(P.X(0), P.X(1.50), yDimT, '1.500', 's');
    s += dimH(P.X(1.50), P.X(3.00), yDimT, '1.500', 's');
    s += dimH(P.X(0), P.X(3.00), yDimT2, '3.000', '');
    // vertikal (kiri & kanan)
    const xDimL = P.X(-0.55), xDimL2 = P.X(-1.15);
    s += dimV(P.Y(3.00), P.Y(3.90), xDimL, '900', 's', [P.X(0)]);
    s += dimV(P.Y(3.90), P.Y(6.00), xDimL, '2.100', 's');
    s += dimV(P.Y(6.00), P.Y(8.50), xDimL, '2.500', 's');
    s += dimV(P.Y(8.50), P.Y(10.00), xDimL, '1.500', 's');
    s += dimV(P.Y(3.00), P.Y(10.00), xDimL2, '7.000', '', [P.X(-0.55)]);
    const xDimR = P.X(3.55), xDimR2 = P.X(4.15);
    s += dimV(P.Y(3.90), P.Y(6.00), xDimR, '2.100', 's', [P.X(3.0)]);
    s += dimV(P.Y(6.60), P.Y(7.80), xDimR, '1.200', 's');

    // ---- grid struktur ----
    for (const [gx, gn] of [[0, 'A'], [0.95, 'B'], [1.65, 'C'], [3.00, 'D']]) {
      s += CI(P.X(gx) + 4, P.Y(10.75) - 4, 3.4, 'soft');
      s += TX(P.X(gx) + 4, P.Y(10.75) - 2.6, gn, 'sub', 'font-size="3.8"');
    }
    for (const [gz, gn] of [[3.00, '1'], [3.90, '2'], [6.00, '3'], [8.50, '4'], [10.00, '5']]) {
      s += CI(P.X(-0.55) - 4.5, P.Y(gz), 3.4, 'soft');
      s += TX(P.X(-0.55) - 4.5, P.Y(gz) + 1.3, gn, 'sub', 'font-size="3.8"');
    }

    // ---- legenda & catatan ----
    s += legendBox(215, 34, [
      ['cut', 'Dinding dipotong setinggi 1,00 m'],
      ['thin', 'Dinding / objek terlihat'],
      ['hid', 'Objek di atas bidang potong'],
      ['accent2', 'Garis potongan A-A dan B-B']
    ]);

    const notes = [
      'DENAH skala 1:40 — potongan horizontal pada ketinggian 1,00 m di atas lantai ±0,00.',
      'Dinding digambar pada as (sumbu) dengan tebal 15 cm (bata merah ½ bata + plester 15 mm dua sisi).',
      'Semua ukuran dalam milimeter (mm) kecuali dinyatakan lain. Luas bangunan bruto 21,00 m².',
      'Angka pada kolom = luas bersih (dikurangi ½ tebal dinding keliling).',
      'Bukaan P = pintu, J = jendela, EF = exhaust fan. Jadwal kusen pada gambar A-10.',
      'Lantai ruang tamu, kamar, dan koridor: granit 60×60. Kamar mandi & dapur: keramik anti-slip.'
    ];
    s += notesBox(notes, 8);

    return sheet({
      judul: 'DENAH BANGUNAN', sub: 'Rumah Tipe 21/72 — denah lantai 1, skala 1:40, potongan horizontal +1,00 m',
      no: 'A-01', skala: '1:40', content: s
    });
  }

  function roomTable(x, y) {
    const rows = M.rooms.map((r, i) => {
      const cl = M.clear(r);
      return [String(i + 1), r.short, (r.x1 - r.x0).toFixed(2).replace('.', ',') + ' × ' + (r.z1 - r.z0).toFixed(2).replace('.', ','),
      cl.w.toFixed(2).replace('.', ',') + ' × ' + cl.d.toFixed(2).replace('.', ','), (cl.w * cl.d).toFixed(2).replace('.', ',')];
    });
    const W = 94, Hh = 16 + rows.length * 5.6 + 8;
    let s = RC(x, y, W, Hh, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(x + 3, y + 5, 'TABEL RUANG', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.4"');
    const cy0 = y + 10.5;
    const col = [x + 3, x + 10, x + 38, x + 63, x + 93];
    ['NO', 'RUANG', 'AS (m)', 'BERSIH (m)', 'LUAS'].forEach((t, i) => s += TX(col[i], cy0, t, 'sub', 'text-anchor="start" font-size="2.8"'));
    s += L(x + 2, cy0 + 1.6, x + W - 2, cy0 + 1.6, 'soft');
    rows.forEach((r, i) => {
      const yy = cy0 + 6.2 + i * 5.6;
      s += TX(col[0], yy, r[0], 'note', 'text-anchor="start" font-size="3.7"');
      s += TX(col[1], yy, r[1], 'noteB', 'text-anchor="start" font-size="3.4"');
      s += TX(col[2], yy, r[2], 'note', 'text-anchor="start" font-size="3.4"');
      s += TX(col[3], yy, r[3], 'note', 'text-anchor="start" font-size="3.4"');
      s += TX(col[4] + 4, yy, r[4], 'noteB', 'text-anchor="end" font-size="3.4"');
      s += L(x + 2, yy + 1.6, x + W - 2, yy + 1.6, 'soft2');
    });
    const ty = cy0 + 6.2 + rows.length * 5.6;
    s += L(x + 2, ty - 3, x + W - 2, ty - 3, 'soft');
    s += TX(col[1], ty + 1.4, 'TOTAL LUAS BANGUNAN', 'noteB', 'text-anchor="start" font-size="3.8" fill="#eb6c36"');
    s += TX(col[4] + 4, ty + 1.4, '21,00', 'noteB', 'text-anchor="end" font-size="3.8" fill="#eb6c36"');
    s += TX(x + 3, ty + 6.6, 'Angka "bersih" = dikurangi ½ tebal dinding keliling (0,075 m tiap sisi tertutup).', 'note', 'text-anchor="start" font-size="3.0"');
    return s;
  }

  function legendBox(x, y, items) {
    let s = RC(x, y, 66, 6 + items.length * 5.2, 'thin', 'fill="#f5f5f5" stroke-width="0.35"');
    s += TX(x + 2, y + 4.2, 'LEGENDA', 'sub', 'text-anchor="start"');
    items.forEach((it, i) => {
      const yy = y + 9 + i * 5.2;
      s += L(x + 3, yy, x + 11, yy, it[0]);
      s += TX(x + 13.5, yy + 1.4, it[1], 'legend', 'text-anchor="start" font-size="4.2"');
    });
    return s;
  }

  function notesBox(notes, x) {
    const y0 = 238;
    let s = TX(x, y0, 'CATATAN PELAKSANAAN', 'sub', 'text-anchor="start" font-size="4.6" fill="#eb6c36"');
    notes.forEach((n, i) => {
      s += TX(x, y0 + 5 + i * 4.4, (i + 1) + '.  ' + n, 'note', 'text-anchor="start" font-size="4.2"');
    });
    return s;
  }

  // versi denah bersih untuk gambar MEP (tanpa furnitur & dimensi)
  function denahBersih(varian, o) {
    const k = 25, P = planT(k, o.ox || 105, o.oy || 258, o.zRef || 11.30);
    let s = '';
    for (const r of M.rooms) {
      const x0 = P.X(r.x0 + 0.075), x1 = P.X(r.x1 - (r.id === 'teras' ? 0 : 0.075));
      const y0 = P.Y(r.z1 - (r.id === 'teras' ? 0 : 0.075)), y1 = P.Y(r.z0 + (r.z0 === 3.0 ? 0 : 0.075));
      s += RC(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0), 'thin',
        'fill="#f3f1ec" stroke="none"');
    }
    // furnitur tipis
    for (const f of SCENE.FURN) for (const b of f.b) {
      const x0 = P.X(b[1]), x1 = P.X(b[4]), y0 = P.Y(b[6]), y1 = P.Y(b[3]);
      s += RC(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0), 'thin',
        'fill="#e3ded2" stroke="none" opacity="0.6"');
    }
    for (const w of M.walls) {
      const wp = wallParts(w, varian);
      for (const sg of wp.segs) s += wallRectPlan(P, w, sg[0], sg[1], 'cut');
      for (const op of wp.ops) {
        if (w.dir === 'x') s += RC(P.X(op.a), P.Y(w.at + w.t / 2), P.X(op.b) - P.X(op.a), P.L(w.t), 'thin', 'fill="#f5f5f5" stroke="none"');
        else s += RC(P.X(w.at - w.t / 2), P.Y(op.b), P.L(w.t), P.Y(op.a) - P.Y(op.b), 'thin', 'fill="#f5f5f5" stroke="none"');
      }
    }
    for (const r of M.rooms) {
      const cx = P.X((r.x0 + r.x1) / 2), cy = P.Y((r.z0 + r.z1) / 2);
      s += TX(cx, cy + 1.4, r.short.toUpperCase(), 'lbl sm', 'fill="#7a8399"');
    }
    return { s, P };
  }

  // ============================================================
  //  GAMBAR 2 — DENAH TAPAK & SITUASI
  // ============================================================
  function siteplan() {
    const k = 12.4, S = M.SITE;
    const P = {
      k, X: x => 66 + x * k, Y: z => 205 - z * k, L: v => v * k
    };
    let s = '';

    // kavling
    s += RC(P.X(0), P.Y(S.d), P.L(S.w), P.L(S.d), 'thin', 'fill="#efece4" stroke-width="0.4"');
    // rumput
    s += RC(P.X(0), P.Y(S.d), P.L(S.w), P.L(S.d), 'thin', 'fill="url(#grass)" stroke="none"');

    // jalan
    s += RC(P.X(-4), P.Y(0), P.L(14), P.L(4), 'thin', 'fill="#e6e4df" stroke="none"');
    for (let i = -4; i < 10; i += 1.5) s += L(P.X(i), P.Y(0), P.X(i + 0.8), P.Y(-4), 'soft2');
    s += RC(P.X(-4), P.Y(0), P.L(14), P.L(0.8), 'thin', 'fill="#d8d5cf" stroke="none"');
    s += TX(P.X(3), P.Y(-1.9), 'JALAN LINGKUNGAN — LEBAR 4,00 m  (ROW 6,00 m)', 'sub', 'font-size="4"');

    // carport + jalan masuk + area jemur
    const cp = M.site.carportPaving, jm = M.site.jalanMasuk, aj = M.site.areaJemur;
    s += RC(P.X(cp.x0), P.Y(cp.z1), P.L(cp.x1 - cp.x0), P.L(cp.z1 - cp.z0), 'thin', 'fill="#e2ded6" stroke-width="0.35"');
    s += RC(P.X(cp.x0), P.Y(cp.z1), P.L(cp.x1 - cp.x0), P.L(cp.z1 - cp.z0), 'thin', 'fill="url(#paving)" stroke="none"');
    s += RC(P.X(jm.x0), P.Y(jm.z1), P.L(jm.x1 - jm.x0), P.L(jm.z1 - jm.z0), 'thin', 'fill="url(#paving)" stroke-width="0.35"');
    s += RC(P.X(aj.x0), P.Y(aj.z1), P.L(aj.x1 - aj.x0), P.L(aj.z1 - aj.z0), 'thin', 'fill="#e7eef1" stroke-width="0.35"');

    // bangunan
    s += RC(P.X(M.B.x0), P.Y(M.B.z1), P.L(3.0), P.L(7.0), 'thick', 'fill="#ddd8cc"');
    for (const r of M.rooms) {
      s += RC(P.X(r.x0), P.Y(r.z1), P.L(r.x1 - r.x0), P.L(r.z1 - r.z0), 'thin', 'fill="none" stroke-width="0.3"');
      s += TX(P.X((r.x0 + r.x1) / 2), P.Y((r.z0 + r.z1) / 2) + 1, r.short.toUpperCase(), 'sub', 'font-size="3.4"');
    }
    // teras
    s += RC(P.X(0), P.Y(3.90), P.L(3.0), P.L(0.9), 'thin', 'fill="#ece7de" stroke-width="0.35"');

    // atap (garis putus-putus)
    s += PG([[P.X(R.eaveW), P.Y(R.zFront)], [P.X(R.eaveE), P.Y(R.zFront)], [P.X(R.eaveE), P.Y(R.zBack)], [P.X(R.eaveW), P.Y(R.zBack)]], 'hid');
    s += L(P.X(R.ridgeX), P.Y(R.zFront), P.X(R.ridgeX), P.Y(R.zBack), 'hid');
    s += PG([[P.X(3.0), P.Y(0.6)], [P.X(6.0), P.Y(0.6)], [P.X(6.0), P.Y(5.6)], [P.X(3.0), P.Y(5.6)]], 'hid');

    // pagar & gerbang
    s += L(P.X(0), P.Y(0), P.X(0.75), P.Y(0), 'thick');
    s += L(P.X(1.55), P.Y(0), P.X(3.10), P.Y(0), 'thick');
    s += L(P.X(5.90), P.Y(0), P.X(6.0), P.Y(0), 'thick');
    s += L(P.X(0.75), P.Y(0), P.X(1.55), P.Y(0), 'accent');
    s += L(P.X(3.10), P.Y(0), P.X(5.90), P.Y(0), 'accent');
    s += TX(P.X(4.5), P.Y(0.35), 'GERBANG DORONG 2,80 m', 'sub', 'font-size="3.4" fill="#eb6c36"');
    s += TX(P.X(1.15), P.Y(0.35), 'PINTU 0,80 m', 'sub', 'font-size="3.2" fill="#eb6c36"');
    s += L(P.X(0), P.Y(0), P.X(0), P.Y(S.d), 'thick');
    s += L(P.X(6), P.Y(0), P.X(6), P.Y(S.d), 'thick');
    s += L(P.X(0), P.Y(S.d), P.X(6), P.Y(S.d), 'thick');

    // tanaman
    for (const t of M.site.tanaman) {
      const r = t.tipe === 'pohon' ? 0.55 : 0.32;
      s += CI(P.X(t.x), P.Y(t.z), P.L(r), 'soft');
      s += CI(P.X(t.x), P.Y(t.z), 0.8, 'soft');
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2;
        s += L(P.X(t.x), P.Y(t.z), P.X(t.x + Math.cos(a) * r * 0.95), P.Y(t.z + Math.sin(a) * r * 0.95), 'soft2');
      }
    }

    // instalasi
    s += RC(P.X(1.55), P.Y(11.85), P.L(1.0), P.L(1.0), 'soft2', 'fill="none"');
    s += TX(P.X(2.05), P.Y(11.35), 'SEPTICTANK', 'sub', 'font-size="3.2"');
    s += RC(P.X(3.30), P.Y(11.90), P.L(1.30), P.L(1.10), 'soft2');
    s += TX(P.X(3.95), P.Y(11.35), 'RESAPAN', 'sub', 'font-size="3.2"');
    s += CI(P.X(5.20), P.Y(10.20), P.L(0.5), 'soft2');
    s += TX(P.X(5.20), P.Y(10.95), 'SUMUR RESAPAN', 'sub', 'font-size="3.0"');
    s += RC(P.X(3.9), P.Y(5.0), P.L(0.95), P.L(0.95), 'soft2');
    s += TX(P.X(4.38), P.Y(4.5), 'TANDON 600 L', 'sub', 'font-size="3.0"');

    // dimensi kavling
    s += dimH(P.X(0), P.X(6), P.Y(-0.9), '6.000', '', [P.Y(0)]);
    s += dimV(P.Y(0), P.Y(12), P.X(6.9), '12.000', '', [P.X(6)]);
    s += dimH(P.X(0), P.X(3), P.Y(3.35), 'BANGUNAN 3.000', 's');
    s += dimV(P.Y(3), P.Y(10), P.X(3.65), '7.000', 's');

    // arah utara
    s += `<g transform="translate(${F(P.X(0) - 28)},${F(P.Y(11.4))})">
      ${CI(0, 0, 8, 'thin')}
      ${PG([[0, -10.5], [3.2, 4.5], [0, 2.2], [-3.2, 4.5]], 'thin', 'fill="#2d3142"')}
      ${TX(0, 12.2, 'U', 'lbl', 'font-size="7"')}
      ${TX(0, -11.6, 'N', 'sub', 'font-size="3.4"')}
    </g>`;

    // tabel data tapak
    const tx = 250, ty = 42;
    s += RC(tx, ty, 108, 54, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(tx + 3, ty + 5.6, 'DATA TAPAK', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.8"');
    const rows = [
      ['Luas tanah (kavling)', '6,00 × 12,00 m', S.w * S.d + ' m²'],
      ['Luas bangunan bruto', '3,00 × 7,00 m', '21,00 m²'],
      ['Luas carport (kanopi)', '3,00 × 5,00 m', '15,00 m²'],
      ['Koefisien Dasar Bangunan (KDB)', '(21 + 15) / 72', (M.site.kdb * 100).toFixed(1).replace('.', ',') + ' %'],
      ['Koefisien Lantai Bangunan (KLB)', '21 / 72', M.site.klb.toFixed(2).replace('.', ',')],
      ['Garis Sempadan Bangunan (GSB)', '3,00 m dari batas depan', '—'],
      ['Jarak bebas samping (barat)', '0,00 m (dinding kopel)', '—'],
      ['Luas taman & area terbuka', '72 − 21 − 15 m²', '36,00 m²'],
      ['Tinggi plafon', '2,80 m', '—'],
      ['Tinggi puncak atap', '+3,88 m dari lantai', '—'],
      ['Kebutuhan air bersih', '3 orang × 120 L/hari', '360 L/hari'],
      ['Daya listrik terpasang', '1.300 VA', '—']
    ];
    rows.forEach((r, i) => {
      const yy = ty + 11 + i * 3.5;
      s += TX(tx + 3, yy, r[0], 'note', 'text-anchor="start" font-size="4"');
      s += TX(tx + 62, yy, r[1], 'note', 'text-anchor="start" font-size="4" fill="#7a8399"');
      s += TX(tx + 105, yy, r[2], 'noteB', 'text-anchor="end" font-size="4"');
      if (i < rows.length - 1) s += L(tx + 2, yy + 1.4, tx + 106, yy + 1.4, 'soft2');
    });

    // rekapitulasi luas
    const rx = 250, ry = 104;
    s += RC(rx, ry, 108, 42, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(rx + 3, ry + 5.6, 'REKAPITULASI LUAS RUANG (BRUTO)', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.8"');
    M.rekapLuas.forEach((r, i) => {
      const yy = ry + 11 + i * 4.4;
      s += TX(rx + 3, yy, r.n, 'note', 'text-anchor="start" font-size="4.2"');
      s += TX(rx + 105, yy, r.a.toFixed(2).replace('.', ',') + ' m²', 'noteB', 'text-anchor="end" font-size="4.2"');
      s += L(rx + 60, yy + 0.8, rx + 78, yy + 0.8, 'soft2');
    });
    s += L(rx + 2, ry + 37.6, rx + 106, ry + 37.6, 'soft');
    s += TX(rx + 3, ry + 41.2, 'TOTAL LUAS BANGUNAN', 'noteB', 'text-anchor="start" font-size="4.4" fill="#eb6c36"');
    s += TX(rx + 105, ry + 41.2, '21,00 m²', 'noteB', 'text-anchor="end" font-size="4.4" fill="#eb6c36"');

    // legenda
    s += legendBox(250, 152, [
      ['thick', 'Pagar & batas kavling'],
      ['hid', 'Garis atap (overstek)'],
      ['accent', 'Gerbang & pintu masuk'],
      ['soft2', 'Instalasi bawah tanah']
    ]);

    // keyplan
    const kx = 250, ky = 176;
    s += RC(kx, ky, 108, 46, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(kx + 3, ky + 5.6, 'KEY PLAN — KEDUDUKAN UNIT DALAM BLOK', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.4"');
    for (let i = 0; i < 5; i++) {
      const ux = kx + 6 + i * 19.5;
      s += RC(ux, ky + 12, 17, 26, 'thin', 'fill="none" stroke-width="0.3"');
      s += RC(ux, ky + 12 + 22, 17, 4, 'thin', 'fill="#e2ded6" stroke-width="0.25"');
      if (i === 1) { s += RC(ux, ky + 12, 17, 26, 'thick', 'fill="#eb6c36" opacity="0.20" stroke="#eb6c36"'); }
      s += TX(ux + 8.5, ky + 27, '21/72', 'sub', 'font-size="3"');
    }
    s += TX(kx + 3, ky + 43, 'Unit bertanda warna = unit yang dirancang. Modul blok 6,00 m.', 'note', 'text-anchor="start" font-size="3.8"');

    s += notesBox([
      'DENAH TAPAK skala 1:80 — menggambarkan hubungan bangunan, carport, taman, dan batas kavling.',
      'GSB 3,00 m diukur dari batas pagar depan ke bidang terluar bangunan yang tertutup.',
      'Carport terbuka (kanopi) tidak dihitung sebagai luas lantai bangunan, namun diperhitungkan dalam KDB.',
      'Bidang resapan & sumur resapan wajib ada agar air hujan tidak membebani saluran lingkungan.',
      'Setback samping kiri 0,00 m karena bangunan bersifat kopel (dinding berimpit dengan tetangga).'
    ], 8);

    return sheet({
      judul: 'DENAH TAPAK & SITUASI', sub: 'Kavling 6,00 × 12,00 m = 72 m² — skala 1:80, GSB 3,00 m',
      no: 'A-02', skala: '1:80', content: s
    });
  }

  // ============================================================
  //  TAMPAK
  // ============================================================
  function elevBase(k, ox, oy) {
    // view: x -> kanan, y -> naik ; oy = garis tanah (y = YT)
    return {
      k, ox, oy,
      X: x => ox + x * k,
      Y: y => oy - (y - YT) * k,
      L: v => v * k
    };
  }

  function drawWallElev(E, x0, x1, y0, y1, ops, opt = {}) {
    let s = '';
    s += RC(E.X(x0), E.Y(y1), E.L(x1 - x0), E.L(y1 - y0), 'med', 'fill="#f1eee7" stroke-width="0.45"');
    for (const op of ops) {
      if (!op) continue;
      const ox0 = E.X(op.a), ox1 = E.X(op.b), oy0 = E.Y(op.head), oy1 = E.Y(op.sill);
      s += RC(ox0, oy0, ox1 - ox0, oy1 - oy0, 'med', 'fill="#fbfaf7"');
      if (op.jns === 'pintu') {
        // daun pintu + panel
        s += RC(ox0 + 0.8, oy0 + 0.8, ox1 - ox0 - 1.6, oy1 - oy0 - 1.6, 'thin', 'fill="#e0d3bd"');
        s += RC(ox0 + 2.4, oy0 + 3, ox1 - ox0 - 4.8, oy1 - oy0 - 4.6, 'thin', 'fill="#efe7d8"');
        s += CI(ox1 - 3.4, (oy0 + oy1) / 2, 0.9, 'solid');
      } else if (op.jns === 'jendela') {
        s += L(ox0, (oy0 + oy1) / 2, ox1, (oy0 + oy1) / 2, 'med');
        s += RC(ox0 + 1, oy0 + 1, ox1 - ox0 - 2, oy1 - oy0 - 2, 'thin', 'fill="#cfe0e8"');
        s += L((ox0 + ox1) / 2, oy0, (ox0 + ox1) / 2, oy1, 'med');
        // teralis
        for (let i = 1; i < 5; i++) s += L(ox0 + (ox1 - ox0) * i / 5, oy0, ox0 + (ox1 - ox0) * i / 5, oy1, 'soft2');
      } else {
        s += RC(ox0 + 1, oy0 + 1, ox1 - ox0 - 2, oy1 - oy0 - 2, 'thin', 'fill="#e6e3dc"');
        for (let i = 0; i < 4; i++) s += L(ox0 + 1, oy0 + 1 + (oy1 - oy0 - 2) * i / 4, ox1 - 1, oy0 + 1 + (oy1 - oy0 - 2) * i / 4, 'soft2');
      }
      // kode
      if (opt.kode !== false) s += TX((ox0 + ox1) / 2, oy0 - 1.4, op.id, 'sub', 'font-size="3.4"');
    }
    return s;
  }

  function gableElev(E, z) {
    const pent = [[0, H], [3.00, H], [3.00, R.yWallE], [R.ridgeX, R.yridge], [0, R.yWallW]];
    const pts = pent.map(p => [E.X(p[0]), E.Y(p[1])]);
    return PG(pts, 'med', 'fill="#f1eee7" stroke-width="0.45"');
  }

  function roofRakeElev(E, zEdge) {
    // profil tepi atap (dua sisi) pada bidang z
    let s = '';
    const seg = (xa, ya, xb, yb) => L(E.X(xa), E.Y(ya), E.X(xb), E.Y(yb), 'thick');
    s += seg(R.eaveW, R.yeave, R.ridgeX, R.yridge);
    s += seg(R.ridgeX, R.yridge, R.eaveE, R.yeave);
    // ketebalan lisplang
    s += L(E.X(R.eaveW), E.Y(R.yeave - 0.20), E.X(R.ridgeX), E.Y(R.yridge - 0.20), 'med');
    s += L(E.X(R.ridgeX), E.Y(R.yridge - 0.20), E.X(R.eaveE), E.Y(R.yeave - 0.20), 'med');
    // nok
    s += RC(E.X(R.ridgeX - 0.14), E.Y(R.yridge + 0.10), E.L(0.28), E.L(0.12), 'thin', 'fill="#c2bdb4"');
    return s;
  }

  function grd(E, x0, x1) {
    let s = L(E.X(x0) - 6, E.Y(YT), E.X(x1) + 6, E.Y(YT), 'med');
    for (let x = x0 - 0.4; x < x1 + 0.4; x += 0.3) {
      s += L(E.X(x), E.Y(YT), E.X(x + 0.15), E.Y(YT - 0.12), 'soft2');
    }
    return s;
  }

  function tampakDepan() {
    const k = 25, E = elevBase(k, 150, 200);
    let s = '';
    s += grd(E, -1.0, 6.4);
    // tanah & pekarangan
    s += RC(E.X(-0.6), E.Y(YT), E.L(6.6), E.L(-YT), 'thin', 'fill="#eae7de" stroke="none" opacity="0.6"');
    // carport di belakang (kanan)
    s += RC(E.X(3.0), E.Y(CP().yW), E.L(3.0), E.L(CP().yW - CP().yE), 'med', 'fill="#dfe3e6"');
    s += L(E.X(3.0), E.Y(CP().yE - 0.20), E.X(6.0), E.Y(CP().yE - 0.20), 'thin');
    for (const [tx, tz] of M.carport.tiang) s += RC(E.X(tx - 0.06), E.Y(CP().yE - 0.05), E.L(0.12), E.L(CP().yE - 0.05 - YT), 'thin', 'fill="#c9ccd0"');
    // tandon
    s += RC(E.X(3.60), E.Y(3.94), E.L(0.95), E.L(1.14), 'med', 'fill="#dfe3e6"');
    // teras
    s += RC(E.X(0), E.Y(-0.02), E.L(3.0), E.L(0.43), 'med', 'fill="#e2dcd0"');
    s += L(E.X(0), E.Y(-0.02), E.X(3.0), E.Y(-0.02), 'med');
    // dinding muka + bukaan
    const w1 = M.walls[0];
    s += drawWallElev(E, 0, 3.0, 0, H, w1.openings);
    // kolom teras
    s += RC(E.X(2.85), E.Y(2.80), E.L(0.15), E.L(2.80), 'med', 'fill="#e6e2da"');
    s += RC(E.X(0.00), E.Y(2.80), E.L(0.15), E.L(2.80), 'med', 'fill="#e6e2da"');
    s += RC(E.X(0.00), E.Y(2.80), E.L(3.00), E.L(0.18), 'med', 'fill="#e6e2da"');
    // timpak
    s += gableElev(E, 'front');
    // atap
    s += roofRakeElev(E);
    // garis atap carport di belakang
    s += L(E.X(3.0), E.Y(CP().yW), E.X(6.0), E.Y(CP().yE), 'thin');
    // dimensi vertikal
    s += dimV(E.Y(YT), E.Y(0), E.X(-0.95), '450', 's', [E.X(-0.45)]);
    s += dimV(E.Y(0), E.Y(H), E.X(-0.95), '2.800', '', [E.X(-0.45)]);
    s += dimV(E.Y(H), E.Y(R.yridge), E.X(-0.95), '1.083', 's');
    s += dimV(E.Y(YT), E.Y(R.yridge), E.X(-1.55), '4.333', '', [E.X(-0.95)]);
    s += dimV(E.Y(0), E.Y(0.70), E.X(4.45), '700', 's', [E.X(3.35)]);
    s += dimV(E.Y(0.70), E.Y(1.90), E.X(4.45), '1.200', 's');
    s += dimV(E.Y(0), E.Y(2.10), E.X(4.95), '2.100', 's', [E.X(4.45)]);
    // dimensi horizontal
    s += dimH(E.X(0), E.X(0.25), E.Y(YT + 0.55), '250', 's');
    s += dimH(E.X(0.25), E.X(1.15), E.Y(YT + 0.55), '900', 's', [E.X(-0.45)]);
    s += dimH(E.X(1.45), E.X(2.85), E.Y(YT + 0.55), '1.400', 's');
    s += dimH(E.X(0), E.X(3.00), E.Y(YT + 0.15), '3.000');
    s += dimH(E.X(R.eaveW), E.X(R.eaveE), E.Y(R.yridge + 0.60), '3.750 (overstek atap)', 's');
    s += dimH(E.X(3.00), E.X(6.00), E.Y(YT + 0.90), 'CARPORT 3.000', 's');

    // label material
    s += callout(E.X(2.30), E.Y(R.yridge - 0.35), E.X(4.6), E.Y(R.yridge + 0.9), 'Genteng beton flat');
    s += callout(E.X(2.20), E.Y(H - 0.35), E.X(4.6), E.Y(H + 0.55), 'Dinding bata plester + acian\ncat weathershield 2 lapis');
    s += callout(E.X(0.70), E.Y(2.55), E.X(-3.3), E.Y(2.6), 'P1 Pintu utama kayu\n0,90 × 2,10 m');
    s += callout(E.X(2.15), E.Y(1.30), E.X(4.6), E.Y(1.15), 'J1 Jendela kayu + teralis\n1,40 × 1,20 m');
    s += callout(E.X(1.50), E.Y(-0.02), E.X(-3.3), E.Y(-0.05), 'Teras keramik 25×25\nditinggikan 5 cm');
    s += callout(E.X(1.50), E.Y(YT), E.X(1.5), E.Y(YT - 1.1), 'Pekarangan +5 cm dari jalan');

    s += notesBox([
      'TAMPAK DEPAN skala 1:40 — arah pandang dari jalan (sumbu −z), mata pada ketinggian 1,50 m.',
      'Overstek atap depan 0,95 m berfungsi sebagai kanopi teras sekaligus peneduh jendela utama.',
      'Seluruh permukaan dinding luar memakai cat eksterior berbasis akrilik (2 lapis).',
      'Timpak (gevel) diberi lisplang GRC 3/20 untuk melindungi tepi dinding dari rembesan air.',
      'Tinggi ambang jendela J1 = 70 cm dari lantai; tinggi ambang pintu P1 = 0 (tanpa ambang).'
    ], 8);

    return sheet({
      judul: 'TAMPAK DEPAN', sub: 'Rumah Tipe 21/72 — skala 1:40, arah pandang dari jalan',
      no: 'A-03', skala: '1:40', content: s
    });
  }

  const CP = () => M.carport;

  function callout(x, y, tx, ty, text, accent) {
    const lines = String(text).split('\n');
    let s = L(x, y, tx + (tx > x ? -3 : 3), ty, accent ? 'accent2' : 'soft2');
    s += CI(x, y, 0.7, accent ? 'accent' : 'soft');
    const anchor = tx > x ? 'start' : 'end';
    const bx = tx + (tx > x ? 0 : 0);
    lines.forEach((ln, i) => {
      s += TX(bx, ty + 3 + i * 4, ln, 'note', `text-anchor="${anchor}" font-size="4.1"`);
    });
    return s;
  }

  function tampakBelakang() {
    const k = 25, E = elevBase(k, 150, 200);
    let s = '';
    s += grd(E, -2.0, 6.2);
    s += RC(E.X(-1.8), E.Y(YT), E.L(7.8), E.L(-YT), 'thin', 'fill="#eae7de" stroke="none" opacity="0.6"');
    // pagar belakang
    s += RC(E.X(-1.8), E.Y(1.60), E.L(7.8), E.L(1.60 - YT), 'med', 'fill="#eeebe3"');
    s += L(E.X(-1.8), E.Y(1.69), E.X(6.0), E.Y(1.69), 'med');
    // dinding belakang + bukaan
    s += drawWallElev(E, 0, 3.0, 0, H, M.walls[1].openings);
    // timpak
    s += PG([[E.X(0), E.Y(H)], [E.X(3.00), E.Y(H)], [E.X(3.00), E.Y(R.yWallE)],
      [E.X(3.00 - R.ridgeX), E.Y(R.yridge)], [E.X(0), E.Y(R.yWallW)]], 'med', 'fill="#f1eee7" stroke-width="0.45"');
    // atap dari belakang
    s += roofRakeElev(E);
    // talang & pipa
    s += L(E.X(R.eaveW), E.Y(R.yeave - 0.10), E.X(R.eaveW), E.Y(-0.30), 'med');
    s += L(E.X(R.eaveE), E.Y(R.yeave - 0.10), E.X(R.eaveE), E.Y(-0.30), 'med');
    // taman belakang, jemuran, septictank
    s += L(E.X(3.35), E.Y(1.62), E.X(5.55), E.Y(1.62), 'med');
    s += L(E.X(3.35), E.Y(0), E.X(3.35), E.Y(1.62), 'thin');
    s += L(E.X(5.55), E.Y(0), E.X(5.55), E.Y(1.62), 'thin');
    s += RC(E.X(3.35), E.Y(1.30), E.L(2.2), E.L(0.5), 'thin', 'fill="#dfe6ea" opacity="0.8"');
    s += TX(E.X(4.45), E.Y(1.85), 'JEMURAN + KANOPI', 'sub', 'font-size="3.4"');
    s += RC(E.X(1.55), E.Y(YT + 0.08), E.L(1.0), E.L(0.1), 'soft2');
    s += TX(E.X(2.05), E.Y(YT - 0.25), 'SEPTICTANK', 'sub', 'font-size="3.0"');

    s += dimV(E.Y(YT), E.Y(0), E.X(-0.95), '450', 's', [E.X(-0.45)]);
    s += dimV(E.Y(0), E.Y(H), E.X(-0.95), '2.800', '');
    s += dimV(E.Y(H), E.Y(R.yridge), E.X(-0.95), '1.083', 's');
    s += dimV(E.Y(YT), E.Y(R.yridge), E.X(-1.55), '4.333', '', [E.X(-0.95)]);
    s += dimV(E.Y(0), E.Y(1.20), E.X(4.45), '1.200', 's', [E.X(3.35)]);
    s += dimV(E.Y(1.20), E.Y(2.10), E.X(4.45), '900', 's');
    s += dimV(E.Y(0), E.Y(1.60), E.X(4.95), '1.600', 's');
    s += dimH(E.X(0.20), E.X(1.00), E.Y(YT + 0.55), 'J3  800', 's');
    s += dimH(E.X(2.00), E.X(2.70), E.Y(YT + 0.55), 'J4  700', 's');
    s += dimH(E.X(0), E.X(3.00), E.Y(YT + 0.15), '3.000');
    s += dimH(E.X(R.eaveW), E.X(R.eaveE), E.Y(R.yridge + 0.60), '3.750 (overstek atap)', 's');

    s += callout(E.X(0.60), E.Y(1.65), E.X(-3.2), E.Y(1.70), 'J3 Jendela dapur aluminium\n0,80 × 0,90 m, sill 1,20 m');
    s += callout(E.X(2.35), E.Y(1.90), E.X(4.7), E.Y(2.05), 'J4 Bouvenlicht KM\n0,70 × 0,60 m, sill 1,60 m');
    s += callout(E.X(1.30), E.Y(H - 0.3), E.X(-3.2), E.Y(H + 0.4), 'Talang datar zincalume\n+ pipa turun 3"');
    s += callout(E.X(4.45), E.Y(1.30), E.X(4.7), E.Y(0.7), 'Area jemur + kanopi\n3,5 m² beton ekspos');

    s += notesBox([
      'TAMPAK BELAKANG skala 1:40 — arah pandang sejajar sumbu +z.',
      'Dinding belakang menampung seluruh bukaan zona servis (dapur & kamar mandi) agar sisi depan tetap bersih.',
      'Jendela J4 dipasang tinggi (sill 1,60 m) agar tetap memberi ventilasi meski terhalang bidang cuci.',
      'Talang datar di kedua tepi atap meneruskan air hujan ke pipa turun Ø3" menuju sumur resapan.',
      'Pagar belakang tinggi 1,60 m dari muka tanah; pada sisi ini juga diletakkan tempat sampah dan jemuran.'
    ], 8);

    return sheet({
      judul: 'TAMPAK BELAKANG', sub: 'Rumah Tipe 21/72 — skala 1:40, arah pandang dari taman belakang',
      no: 'A-04', skala: '1:40', content: s
    });
  }

  function tampakSamping() {
    const k = 20, E = elevBase(k, 110, 200);
    // z diplot sebagai sumbu horizontal
    const Ez = {
      k, ox: 110, oy: 200,
      X: z => 110 + (z - 1.6) * k,
      Y: y => 200 - (y - YT) * k,
      L: v => v * k
    };
    let s = '';
    s += grd(Ez, 1.6, 11.2);
    s += RC(Ez.X(1.6), Ez.Y(YT), Ez.L(9.6), Ez.L(-YT), 'thin', 'fill="#eae7de" stroke="none" opacity="0.6"');
    // carport
    s += RC(Ez.X(0.60), Ez.Y(CP().yW), Ez.L(5.0), Ez.L(CP().yW - CP().yE), 'med', 'fill="#dfe3e6"');
    s += L(Ez.X(0.60), Ez.Y(CP().yE - 0.20), Ez.X(5.60), Ez.Y(CP().yE - 0.20), 'thin');
    s += RC(Ez.X(0.90 - 0.06), Ez.Y(CP().yE - 0.05), Ez.L(0.12), Ez.L(CP().yE - 0.05 - YT), 'thin', 'fill="#c9ccd0"');
    s += RC(Ez.X(5.30 - 0.06), Ez.Y(CP().yE - 0.05), Ez.L(0.12), Ez.L(CP().yE - 0.05 - YT), 'thin', 'fill="#c9ccd0"');
    // tandon
    s += RC(Ez.X(4.10), Ez.Y(3.94), Ez.L(1.10), Ez.L(1.14), 'med', 'fill="#dfe3e6"');
    s += TX(Ez.X(4.65), Ez.Y(4.25), 'TANDON 600 L', 'sub', 'font-size="3.2"');
    // mobil siluet
    s += L(Ez.X(1.15), Ez.Y(0.22), Ez.X(5.60), Ez.Y(0.22), 'hid');
    s += L(Ez.X(2.30), Ez.Y(1.24), Ez.X(4.30), Ez.Y(1.24), 'hid');
    s += CI(Ez.X(2.50), Ez.Y(0.30), 1.6, 'hid');
    s += CI(Ez.X(5.25), Ez.Y(0.30), 1.6, 'hid');
    // dinding timur + bukaan (z sebagai absis)
    const w4 = M.walls[3];
    s += RC(Ez.X(3.90), Ez.Y(H), Ez.L(10.00 - 3.90), Ez.L(H), 'med', 'fill="#f1eee7" stroke-width="0.45"');
    for (const op of w4.openings) {
      const x0 = Ez.X(op.a), x1 = Ez.X(op.b), y0 = Ez.Y(op.head), y1 = Ez.Y(op.sill);
      s += RC(x0, y0, x1 - x0, y1 - y0, 'med', 'fill="#fbfaf7"');
      if (op.jns === 'jendela') {
        s += RC(x0 + 1, y0 + 1, x1 - x0 - 2, y1 - y0 - 2, 'thin', 'fill="#cfe0e8"');
        s += L((x0 + x1) / 2, y0, (x0 + x1) / 2, y1, 'med');
        for (let i = 1; i < 5; i++) s += L(x0 + (x1 - x0) * i / 5, y0, x0 + (x1 - x0) * i / 5, y1, 'soft2');
      } else {
        s += RC(x0 + 1, y0 + 1, x1 - x0 - 2, y1 - y0 - 2, 'thin', 'fill="#e6e3dc"');
      }
      s += TX((x0 + x1) / 2, y0 - 1.4, op.id, 'sub', 'font-size="3.2"');
    }
    // atap (tampak samping: lisplang + tebal atap)
    s += RC(Ez.X(R.zFront), Ez.Y(R.yeave), Ez.L(R.zBack - R.zFront), Ez.L(0.22), 'thick', 'fill="#e0dbd2"');
    s += L(Ez.X(R.zFront), Ez.Y(R.yeave), Ez.X(R.zBack), Ez.Y(R.yeave), 'thick');
    s += L(Ez.X(R.zFront), Ez.Y(R.yeave - 0.20), Ez.X(R.zBack), Ez.Y(R.yeave - 0.20), 'med');
    // nok (garis tersembunyi)
    s += L(Ez.X(R.zFront), Ez.Y(R.yridge), Ez.X(R.zBack), Ez.Y(R.yridge), 'hid');
    s += TX(Ez.X(6.6), Ez.Y(R.yridge) - 2, 'nok atap +3,88 (garis tersembunyi)', 'sub', 'font-size="3.4"');
    // talang & pipa turun
    s += RC(Ez.X(0.60), Ez.Y(R.yeave - 0.02), Ez.L(0.24), Ez.L(0.14), 'thin', 'fill="#c4c8cb"');
    s += L(Ez.X(10.20), Ez.Y(R.yeave - 0.10), Ez.X(10.20), Ez.Y(-0.30), 'med');
    // teras & pagar samping
    s += RC(Ez.X(3.00), Ez.Y(-0.02), Ez.L(0.90), Ez.L(0.43), 'med', 'fill="#e2dcd0"');
    s += L(Ez.X(0.00), Ez.Y(1.60), Ez.X(12.00), Ez.Y(1.60), 'hid');

    s += dimV(Ez.Y(YT), Ez.Y(0), Ez.X(11.15), '450', 's', [Ez.X(10.6)]);
    s += dimV(Ez.Y(0), Ez.Y(H), Ez.X(11.15), '2.800', '');
    s += dimV(Ez.Y(H), Ez.Y(R.yridge), Ez.X(11.15), '1.083', 's');
    s += dimV(Ez.Y(YT), Ez.Y(R.yridge), Ez.X(11.75), '4.333', '', [Ez.X(11.15)]);
    s += dimH(Ez.X(R.zFront), Ez.X(R.zBack), Ez.Y(YT + 0.2), '8.500 (termasuk overstek)', 's');
    s += dimH(Ez.X(3.90), Ez.X(6.60), Ez.Y(YT + 0.6), 'J2 1.200', 's');
    s += dimH(Ez.X(3.00), Ez.X(10.00), Ez.Y(YT + 0.95), '7.000');
    s += dimH(Ez.X(0.60), Ez.X(5.60), Ez.Y(YT + 1.35), 'CARPORT 5.000', 's');

    s += callout(Ez.X(6.00), Ez.Y(1.40), Ez.X(6.4), Ez.Y(2.3), 'J2 Jendela kamar timur\n1,20 × 1,20 m, sill 0,80 m');
    s += callout(Ez.X(4.65), Ez.Y(3.50), Ez.X(7.6), Ez.Y(3.6), 'Tandon PE 600 L + pompa\nrangka baja di atas carport');
    s += callout(Ez.X(2.00), Ez.Y(0.30), Ez.X(1.3), Ez.Y(1.1), 'Carport + paving\n3,00 × 5,00 m');
    s += callout(Ez.X(R.ridgeX), Ez.Y(R.yridge), Ez.X(2.4), Ez.Y(R.yridge + 0.35), 'Nok atap +3,88 m');

    s += notesBox([
      'TAMPAK SAMPING KANAN (TIMUR) skala 1:32 — arah pandang sejajar sumbu −x.',
      'Karena nok atap sejajar sumbu z, tampak samping hanya memperlihatkan lisplang tepi atap; bidang atap menjauhi pengamat.',
      'Baris rongga di atas muka dinding = lisplang GRC 3/20, dicat warna senada dinding.',
      'Jendela kamar (J2) diletakkan pada dinding timur agar kamar memperoleh cahaya pagi dan ventilasi silang dari jendela depan.',
      'Kanopi carport dibaut pada ring balok dinding timur dengan pelat angkur M10 setiap 1,00 m.'
    ], 8);

    return sheet({
      judul: 'TAMPAK SAMPING KANAN', sub: 'Rumah Tipe 21/72 — skala 1:32, arah pandang dari sisi timur',
      no: 'A-05', skala: '1:32', content: s
    });
  }

  // ============================================================
  //  POTONGAN
  // ============================================================
  function potonganAA(varian) {
    // potongan melintang pada z = 7,00 (memotong koridor + kamar tidur)
    const k = 24, E = elevBase(k, 156, 175);
    let s = '';
    s += grd(E, -0.9, 3.9);
    // tanah & pondasi
    s += RC(E.X(-0.9), E.Y(YB), E.L(4.8), E.L(YB - YT + 0.85), 'thin', 'fill="#efece4" stroke="none" opacity="0.55"');
    // galian
    s += RC(E.X(0.85), E.Y(YB), E.L(0.60), E.L(YT - YB), 'thin', 'fill="#f7f5f0"');
    s += RC(E.X(2.25), E.Y(YB), E.L(0.60), E.L(YT - YB), 'thin', 'fill="#f7f5f0"');
    // pondasi batu kali trapesium (dua sisi)
    const trap = (cx) => PG([
      [E.X(cx - 0.30), E.Y(YB + 0.15)], [E.X(cx + 0.30), E.Y(YB + 0.15)],
      [E.X(cx + 0.125), E.Y(-0.20)], [E.X(cx - 0.125), E.Y(-0.20)]
    ], 'cut');
    s += trap(1.15); s += trap(2.55);
    s += RC(E.X(0.85), E.Y(YB + 0.15), E.L(0.60), E.L(0.15), 'thin', 'fill="#d9d5cc"');
    s += RC(E.X(2.25), E.Y(YB + 0.15), E.L(0.60), E.L(0.15), 'thin', 'fill="#d9d5cc"');
    // sloof
    s += RC(E.X(1.075), E.Y(-0.05), E.L(0.15), E.L(0.20), 'cut');
    s += RC(E.X(2.475), E.Y(-0.05), E.L(0.15), E.L(0.20), 'cut');
    // lantai berlapis
    s += RC(E.X(1.225), E.Y(0.00), E.L(2.85), E.L(0.05), 'thin', 'fill="#d7d2c8"');   // pelat
    s += RC(E.X(1.225), E.Y(-0.05), E.L(2.85), E.L(0.05), 'thin', 'fill="#c6c1b6"');   // lantai kerja
    s += RC(E.X(1.225), E.Y(-0.10), E.L(2.85), E.L(0.10), 'thin', 'fill="#e0d9c8"');   // pasir
    s += RC(E.X(1.225), E.Y(-0.20), E.L(2.85), E.L(0.10), 'thin', 'fill="#e6e2da"');   // urugan
    s += RC(E.X(1.225), E.Y(-0.20), E.L(2.85), E.L(0.20), 'thin', 'fill="url(#hatchSoft)"');
    // dinding terpotong kiri & kanan
    s += RC(E.X(0.00 - 0.075), E.Y(H), E.L(0.15), E.L(H), 'cut');
    s += RC(E.X(2.925), E.Y(H), E.L(0.15), E.L(H), 'cut');
    // dinding koridor-kamar (as 0.95)
    s += RC(E.X(0.875), E.Y(H), E.L(0.15), E.L(H), 'cut');
    s += L(E.X(0.95), E.Y(H), E.X(0.95), E.Y(0), 'hid');
    // plafon
    s += RC(E.X(0.075), E.Y(H + 0.02), E.L(2.85), E.L(0.05), 'thick', 'fill="#e5e1d8"');
    s += RC(E.X(0.075), E.Y(H + 0.07), E.L(2.85), E.L(0.05), 'thin', 'fill="none" stroke-dasharray="3 1.5"');
    // ring balok
    s += RC(E.X(-0.075), E.Y(H + 0.20), E.L(0.15), E.L(0.20), 'cut');
    s += RC(E.X(0.875), E.Y(H + 0.20), E.L(0.15), E.L(0.20), 'cut');
    s += RC(E.X(2.925), E.Y(H + 0.20), E.L(0.15), E.L(0.20), 'cut');
    // atap pelana terpotong
    s += PG([[E.X(R.eaveW), E.Y(R.yeave)], [E.X(R.ridgeX), E.Y(R.yridge)], [E.X(R.eaveE), E.Y(R.yeave)]], 'thick', 'fill="none"');
    s += PG([[E.X(R.eaveW), E.Y(R.yeave - 0.07)], [E.X(R.ridgeX), E.Y(R.yridge - 0.07)], [E.X(R.eaveE), E.Y(R.yeave - 0.07)]], 'med', 'fill="none"');
    s += PG([
      [E.X(R.eaveW), E.Y(R.yeave)], [E.X(R.ridgeX), E.Y(R.yridge)], [E.X(R.eaveE), E.Y(R.yeave)],
      [E.X(R.eaveE), E.Y(R.yeave - 0.07)], [E.X(R.ridgeX), E.Y(R.yridge - 0.07)], [E.X(R.eaveW), E.Y(R.yeave - 0.07)]
    ], 'thin', 'fill="url(#hatchSoft)"');
    // kuda-kuda
    s += kudaKuda(E, 1.50);
    // timpak
    s += PG([[E.X(0.075), E.Y(H)], [E.X(2.925), E.Y(H)], [E.X(2.925), E.Y(R.yWallE)],
      [E.X(R.ridgeX), E.Y(R.yridge)], [E.X(0.075), E.Y(R.yWallW)]], 'thin', 'fill="url(#hatchSoft)"');
    // jendela kamar di dinding timur (di belakang bidang potong)
    s += L(E.X(2.925), E.Y(2.00), E.X(3.10), E.Y(2.00), 'hid');
    s += L(E.X(2.925), E.Y(0.80), E.X(3.10), E.Y(0.80), 'hid');
    // perabot terlihat
    s += RC(E.X(1.40), E.Y(0.56), E.L(0.9), E.L(0.56), 'thin', 'fill="#e0dcd2"');
    s += TX(E.X(1.48), E.Y(0.75), 'kasur', 'sub', 'font-size="3.2"', 'text-anchor="start"');

    // dimensi
    s += dimV(E.Y(YB), E.Y(0), E.X(-0.55), '850', 's', [E.X(-0.075)]);
    s += dimV(E.Y(-0.20), E.Y(0), E.X(-0.55), '200', 's');
    s += dimV(E.Y(0), E.Y(H), E.X(-0.55), '2.800', '');
    s += dimV(E.Y(H), E.Y(R.yridge), E.X(-0.55), '1.083', 's');
    s += dimV(E.Y(YB), E.Y(R.yridge), E.X(-1.15), '4.733', '', [E.X(-0.55)]);
    s += dimV(E.Y(0.80), E.Y(2.00), E.X(3.95), '1.200', 's', [E.X(3.10)]);
    s += dimH(E.X(0.00), E.X(0.95), E.Y(YB - 0.45), '950', 's');
    s += dimH(E.X(0.95), E.X(3.00), E.Y(YB - 0.45), '2.050', 's');
    s += dimH(E.X(0.00), E.X(3.00), E.Y(YB - 0.85), '3.000');
    s += dimH(E.X(R.eaveW), E.X(R.ridgeX), E.Y(R.yridge + 0.45), '1.875', 's');
    s += dimH(E.X(R.ridgeX), E.X(R.eaveE), E.Y(R.yridge + 0.45), '1.875', 's');

    // level
    s += levelMark(E.X(3.35), E.Y(0), '+0,00  Lantai', 'accent');
    s += levelMark(E.X(3.35), E.Y(H), '+2,80  Plafon / ring balok');
    s += levelMark(E.X(3.35), E.Y(R.yeave), '+2,80  Tepi atap');
    s += levelMark(E.X(3.35), E.Y(R.yridge), '+3,88  Nok atap', 'accent');
    s += levelMark(E.X(3.35), E.Y(-0.20), '−0,20  Dasar pondasi');
    s += levelMark(E.X(3.35), E.Y(YB), '−0,85  Dasar galian');
    s += levelMark(E.X(3.35), E.Y(YT), '−0,45  Muka tanah');

    s += callout(E.X(1.88), E.Y(R.yridge - 0.15), E.X(2.6), E.Y(R.yridge + 0.9), 'Nok genteng +3,88 m');
    s += callout(E.X(R.eaveW + 0.2), E.Y(R.yeave), E.X(-3.6), E.Y(R.yeave + 0.45), 'Lisplang GRC 3/20\n+ talang datar');
    s += callout(E.X(0.95), E.Y(H + 0.1), E.X(-3.6), E.Y(H - 0.3), 'Plafon GRC 9 mm\nrangka hollow 40×40');
    s += callout(E.X(1.5), E.Y(-0.06), E.X(-3.6), E.Y(-0.25), 'Pelat lantai t=8 cm\n+ wiremesh M5-150');
    s += callout(E.X(1.15), E.Y(-0.55), E.X(-3.6), E.Y(-0.75), 'Pondasi batu belah 1:4\ntrapesium 60/25, t=65 cm');
    s += callout(E.X(2.55), E.Y(-0.55), E.X(4.6), E.Y(-0.75), 'Sloof 15/20\n4Ø10 + Ø6-200');

    s += notesBox([
      'POTONGAN A-A skala 1:38 — bidang potong pada sumbu z = 7,00 m, arah pandang ke depan (−z).',
      'Pondasi batu belah trapesium: lebar bawah 600 mm, lebar atas 250 mm, tinggi 650 mm, dasar −0,85 m.',
      'Lantai: tanah urug dipadatkan 200 mm → pasir 100 mm → lantai kerja 50 mm → pelat beton 80 mm + wiremesh.',
      'Tinggi bersih ruang dari lantai ke plafon = 2.800 − 80 (rangka + plafon) ≈ 2,72 m.',
      'Elevasi muka tanah pekarangan −0,45 m; lantai bangunan ditinggikan 450 mm dari pekarangan (bebas banjir).'
    ], 8);

    return sheet({
      judul: 'POTONGAN A-A', sub: 'Potongan melintang pada sumbu z = 7,00 m — skala 1:38',
      no: 'A-06', skala: '1:38', content: s
    });
  }

  function levelMark(x, y, text, cls) {
    return L(x - 3, y, x + 3, y, cls === 'accent' ? 'accent' : 'soft') +
      TX(x + 5, y + 1.4, text, 'sub', 'text-anchor="start" font-size="3.8"');
  }

  function kudaKuda(E, cx) {
    // kuda-kuda sederhana: balok tarik, kaki kuda-kuda, tiang raja, sokong
    const yA = R.yeave, yR = R.yridge;
    let s = '';
    s += RC(E.X(R.eaveW), E.Y(yA + 0.10), E.L(R.eaveE - R.eaveW), E.L(0.10), 'thin', 'fill="#ded8ce"'); // balok tarik
    s += L(E.X(R.eaveW), E.Y(yA), E.X(R.ridgeX), E.Y(yR), 'med');
    s += L(E.X(R.ridgeX), E.Y(yR), E.X(R.eaveE), E.Y(yA), 'med');
    s += L(E.X(R.ridgeX), E.Y(yR - 0.10), E.X(R.ridgeX), E.Y(yA + 0.20), 'med');   // tiang raja
    s += L(E.X(R.eaveW + 0.3), E.Y(yA + 0.10), E.X(R.ridgeX), E.Y(yR - 0.55), 'med');
    s += L(E.X(R.eaveE - 0.3), E.Y(yA + 0.10), E.X(R.ridgeX), E.Y(yR - 0.55), 'med');
    // gording
    for (const t of [0.28, 0.5, 0.72]) {
      const xl = G.lerp(R.eaveW, R.ridgeX, t), yl = G.lerp(yA, yR, t);
      const xr = G.lerp(R.eaveE, R.ridgeX, t), yr = G.lerp(yA, yR, t);
      s += RC(E.X(xl - 0.035), E.Y(yl + 0.07), E.L(0.07), E.L(0.07), 'thin', 'fill="#c8bdac"');
      s += RC(E.X(xr - 0.035), E.Y(yr + 0.07), E.L(0.07), E.L(0.07), 'thin', 'fill="#c8bdac"');
    }
    s += TX(E.X(R.ridgeX + 0.35), E.Y((yA + yR) / 2 + 0.3), 'kuda-kuda kayu 8/12\n@ 1,00 m', 'sub', 'font-size="3.2"', 'text-anchor="start"');
    return s;
  }

  function potonganBB(varian) {
    // potongan memanjang pada x = 1,50 (sepanjang rumah)
    const k = 20, E = {
      k, ox: 128, oy: 175,
      X: z => 128 + (z - 1.8) * k,
      Y: y => 175 - (y - YT) * k,
      L: v => v * k
    };
    let s = '';
    s += grd(E, 1.8, 11.4);
    s += RC(E.X(1.8), E.Y(YB), E.L(9.6), E.L(YB - YT + 0.85), 'thin', 'fill="#efece4" stroke="none" opacity="0.55"');

    // pondasi sepanjang penampang (pada as 1.50: dinding belakang/depan saja)
    for (const zz of [3.90, 10.00]) {
      s += PG([[E.X(zz - 0.30), E.Y(YB + 0.15)], [E.X(zz + 0.30), E.Y(YB + 0.15)],
        [E.X(zz + 0.125), E.Y(-0.20)], [E.X(zz - 0.125), E.Y(-0.20)]], 'cut');
      s += RC(E.X(zz - 0.075), E.Y(-0.05), E.L(0.15), E.L(0.20), 'cut');
      s += RC(E.X(zz - 0.075), E.Y(H + 0.20), E.L(0.15), E.L(0.20), 'cut');
    }
    // dinding depan & belakang terpotong
    s += RC(E.X(3.825), E.Y(H), E.L(0.15), E.L(H), 'cut');
    s += RC(E.X(9.925), E.Y(H), E.L(0.15), E.L(H), 'cut');
    // teras
    s += RC(E.X(3.00), E.Y(-0.02), E.L(0.90), E.L(0.43), 'med', 'fill="#e2dcd0"');
    s += L(E.X(3.00), E.Y(-0.02), E.X(3.90), E.Y(-0.02), 'med');
    // lantai berlapis
    s += RC(E.X(3.975), E.Y(0.00), E.L(5.95), E.L(0.05), 'thin', 'fill="#d7d2c8"');
    s += RC(E.X(3.975), E.Y(-0.05), E.L(5.95), E.L(0.05), 'thin', 'fill="#c6c1b6"');
    s += RC(E.X(3.975), E.Y(-0.10), E.L(5.95), E.L(0.10), 'thin', 'fill="#e0d9c8"');
    s += RC(E.X(3.975), E.Y(-0.20), E.L(5.95), E.L(0.10), 'thin', 'fill="#e6e2da"');
    // plafon bertingkat: dapur/KM lebih rendah
    s += RC(E.X(3.975), E.Y(H + 0.02), E.L(5.95), E.L(0.05), 'thick', 'fill="#e5e1d8"');
    s += L(E.X(3.975), E.Y(H + 0.07), E.X(9.925), E.Y(H + 0.07), 'soft2');

    // sekat interior di belakang bidang potong (garis tersembunyi)
    for (const zz of [6.00, 8.50]) {
      s += L(E.X(zz), E.Y(H), E.X(zz), E.Y(0), 'hid');
      s += L(E.X(zz - 0.075), E.Y(H + 0.20), E.X(zz + 0.075), E.Y(H + 0.20), 'hid');
      s += L(E.X(zz), E.Y(H + 0.2), E.X(zz), E.Y(H), 'hid');
    }
    // pintu
    s += RC(E.X(7.00), E.Y(2.10), E.L(0.80), E.L(2.10), 'thin', 'fill="none" stroke-dasharray="3 1.5"');
    s += TX(E.X(7.40), E.Y(1.90), 'P2', 'sub', 'font-size="3.2"');
    s += RC(E.X(8.50), E.Y(2.10), E.L(0.70), E.L(2.10), 'thin', 'fill="none" stroke-dasharray="3 1.5"');
    s += TX(E.X(8.85), E.Y(1.90), 'P4', 'sub', 'font-size="3.2"');

    // atap memanjang: nok + lisplang
    s += RC(E.X(R.zFront), E.Y(R.yridge), E.L(R.zBack - R.zFront), E.L(0.10), 'thick', 'fill="#ded9d0"');
    s += L(E.X(R.zFront), E.Y(R.yridge), E.X(R.zBack), E.Y(R.yridge), 'thick');
    s += L(E.X(R.zFront), E.Y(R.yridge - 0.10), E.X(R.zBack), E.Y(R.yridge - 0.10), 'med');
    s += RC(E.X(R.zFront - 0.03), E.Y(R.yeave), E.L(0.06), E.L(R.yridge - R.yeave), 'thin', 'fill="#e5e1d8"');
    s += RC(E.X(R.zBack - 0.03), E.Y(R.yeave), E.L(0.06), E.L(R.yridge - R.yeave), 'thin', 'fill="#e5e1d8"');
    // gording memanjang
    for (const t of [0.26, 0.5, 0.74]) {
      const yy = G.lerp(R.yeave, R.yridge, t);
      s += RC(E.X(R.zFront), E.Y(yy + 0.07), E.L(R.zBack - R.zFront), E.L(0.07), 'thin', 'fill="#c9bda8"');
    }
    s += TX(E.X(7.2), E.Y(R.yridge - 0.45), 'Gording 5/7 + usuk 4/6 + reng 2/3', 'sub', 'font-size="3.4"');
    // ruang loteng
    s += TX(E.X(6.0), E.Y(R.yridge - 0.85), 'ruang loteng (tinggi bebas 0,9–1,0 m)', 'sub', 'font-size="3.2" fill="#7a8399"');

    // label ruang
    const lbls = [['TERAS', 3.45, -0.02], ['RUANG TAMU / KELUARGA', 4.95, 0], ['KAMAR TIDUR', 7.25, 0],
      ['DAPUR', 9.30, 0]];
    for (const [t, zz, y] of lbls) s += TX(E.X(zz), E.Y(y + 1.4) + 2, t, 'sub', 'font-size="3.6"');

    // dimensi
    s += dimV(E.Y(YB), E.Y(0), E.X(0.9), '850', 's', [E.X(1.8)]);
    s += dimV(E.Y(0), E.Y(H), E.X(0.9), '2.800', '');
    s += dimV(E.Y(H), E.Y(R.yridge), E.X(0.9), '1.083', 's');
    s += dimV(E.Y(YB), E.Y(R.yridge), E.X(0.3), '4.733', '', [E.X(0.9)]);
    s += dimH(E.X(3.00), E.X(3.90), E.Y(YB - 0.5), '900', 's');
    s += dimH(E.X(3.90), E.X(6.00), E.Y(YB - 0.5), '2.100', 's');
    s += dimH(E.X(6.00), E.X(8.50), E.Y(YB - 0.5), '2.500', 's');
    s += dimH(E.X(8.50), E.X(10.00), E.Y(YB - 0.5), '1.500', 's');
    s += dimH(E.X(3.00), E.X(10.00), E.Y(YB - 0.9), '7.000');
    s += dimH(E.X(R.zFront), E.X(R.zBack), E.Y(R.yridge + 0.6), '8.500 (memanjang termasuk overstek)', 's');

    s += levelMark(E.X(10.55), E.Y(0), '+0,00', 'accent');
    s += levelMark(E.X(10.55), E.Y(H), '+2,80 Plafon');
    s += levelMark(E.X(10.55), E.Y(R.yridge), '+3,88 Nok', 'accent');
    s += levelMark(E.X(10.55), E.Y(YT), '−0,45 Tanah');
    s += levelMark(E.X(10.55), E.Y(YB), '−0,85 Pondasi');

    s += callout(E.X(4.9), E.Y(H + 0.05), E.X(4.4), E.Y(H + 0.75), 'Plafon GRC 2,80 m');
    s += callout(E.X(6.4), E.Y(R.yridge - 0.4), E.X(5.6), E.Y(R.yridge + 0.7), 'Kuda-kuda + gording 5/7');
    s += callout(E.X(3.4), E.Y(-0.02), E.X(3.3), E.Y(-0.85), 'Teras +0,02 → pekarangan −0,45');
    s += callout(E.X(9.3), E.Y(0.9), E.X(9.9), E.Y(1.9), 'Dapur: plafon lebih rendah\ntidak diterapkan — plafon 2,80 m seragam');

    s += notesBox([
      'POTONGAN B-B skala 1:32 — bidang potong memanjang pada sumbu x = 1,50 m, arah pandang ke barat (−x).',
      'Potongan ini memperlihatkan hubungan memanjang semua zona: teras → ruang tamu → kamar → dapur.',
      'Kemiringan atap 30° menghasilkan tinggi nok +3,88 m dari lantai, dengan ruang loteng bersih ±0,9–1,0 m.',
      'Semua elevasi mengacu pada lantai bangunan ±0,00. Muka jalan berada pada −0,45 m.',
      'Rangka atap kayu harus dikeringkan (kadar air < 19%) dan diberi anti rayap sebelum dipasang.'
    ], 8);

    return sheet({
      judul: 'POTONGAN B-B', sub: 'Potongan memanjang pada sumbu x = 1,50 m — skala 1:32',
      no: 'A-07', skala: '1:32', content: s
    });
  }

  // ============================================================
  //  RENCANA ATAP
  // ============================================================
  function rencanaAtap() {
    const k = 20, P = planT(k, 112, 26, 12.10);
    let s = '';
    // bidang atap
    const quads = [
      [[R.eaveW, R.zFront], [R.ridgeX, R.zFront], [R.ridgeX, R.zBack], [R.eaveW, R.zBack], '#e6e0d6'],
      [[R.ridgeX, R.zFront], [R.eaveE, R.zFront], [R.eaveE, R.zBack], [R.ridgeX, R.zBack], '#eee8de']
    ];
    for (const q of quads) {
      s += PG(q.slice(0, 4).map(p => [P.X(p[0]), P.Y(p[1])]), 'med', `fill="${q[4]}" stroke-width="0.45"`);
    }
    // garis kemiringan (anak panah arah aliran air)
    for (const [x0, x1] of [[R.eaveW, R.ridgeX], [R.ridgeX, R.eaveE]]) {
      for (let i = 1; i <= 4; i++) {
        const zz = R.zFront + (R.zBack - R.zFront) * i / 5;
        const a = [P.X(x0), P.Y(zz)], b = [P.X(x1), P.Y(zz)];
        s += L(a[0], a[1], b[0], b[1], 'soft2');
        const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        s += L(mid[0] - 2, mid[1], mid[0] + 2, mid[1], 'soft');
      }
    }
    // nok
    s += L(P.X(R.ridgeX), P.Y(R.zFront), P.X(R.ridgeX), P.Y(R.zBack), 'thick');
    s += TX(P.X(R.ridgeX) + 3, P.Y(6.6), 'NOK / RIDGE', 'sub', 'text-anchor="start" font-size="3.4"');
    // lisplang & talang
    s += PG([[P.X(R.eaveW), P.Y(R.zFront)], [P.X(R.eaveE), P.Y(R.zFront)], [P.X(R.eaveE), P.Y(R.zBack)], [P.X(R.eaveW), P.Y(R.zBack)]], 'thick');
    s += L(P.X(R.eaveE), P.Y(R.zFront), P.X(R.eaveE), P.Y(R.zBack), 'accent');
    s += TX(P.X(R.eaveE) + 2.5, P.Y(9.6), 'TALANG ZINCALUME', 'sub', 'text-anchor="start" font-size="3" fill="#eb6c36"');
    // pipa turun
    s += CI(P.X(R.eaveW + 0.08), P.Y(R.zBack - 0.4), 2.2, 'accent');
    s += TX(P.X(R.eaveW + 0.08), P.Y(R.zBack - 0.4) + 5.5, 'PIPA TURUN 3"', 'sub', 'font-size="2.8" fill="#eb6c36"');
    // atap carport
    s += PG([[P.X(3.00), P.Y(0.60)], [P.X(6.00), P.Y(0.60)], [P.X(6.00), P.Y(5.60)], [P.X(3.00), P.Y(5.60)]], 'med', 'fill="#dfe3e6" stroke-width="0.45"');
    for (let i = 0; i < 5; i++) {
      const zz = 1.1 + i * 1.0;
      s += L(P.X(3.3), P.Y(zz), P.X(5.9), P.Y(zz), 'soft2');
    }
    s += L(P.X(5.9), P.Y(0.9), P.X(3.3), P.Y(0.9), 'soft');
    s += TX(P.X(4.5), P.Y(3.0), 'KANOPI CARPORT', 'lbl sm');
    s += TX(P.X(4.5), P.Y(3.0) + 4, 'SPANDEK 0,35 mm — 1:2,5', 'area');
    // bangunan garis di bawah atap
    s += PG([[P.X(0), P.Y(3.00)], [P.X(3.0), P.Y(3.00)], [P.X(3.0), P.Y(10.0)], [P.X(0), P.Y(10.0)]], 'hid');
    // luas
    const A = (R.eaveE - R.eaveW) * (R.zBack - R.zFront);
    s += TX(P.X(-0.9), P.Y(R.zBack + 0.2), 'Luas bidang atap', 'sub', 'text-anchor="start" font-size="3.6"');
    s += TX(P.X(-0.9), P.Y(R.zBack - 0.05), A.toFixed(2).replace('.', ',') + ' m² (3,75 × 8,50)', 'sub', 'text-anchor="start" font-size="3.4" fill="#7a8399"');
    // dimensi
    s += dimH(P.X(R.eaveW), P.X(R.ridgeX), P.Y(R.zBack + 0.75), '1.875', 's');
    s += dimH(P.X(R.ridgeX), P.X(R.eaveE), P.Y(R.zBack + 0.75), '1.875', 's');
    s += dimH(P.X(R.eaveW), P.X(R.eaveE), P.Y(R.zBack + 1.25), '3.750');
    s += dimV(P.Y(R.zFront), P.Y(R.zBack), P.X(-0.6), '8.500', '', [P.X(R.eaveW)]);
    s += dimV(P.Y(3.00), P.Y(10.00), P.X(3.9), '7.000 (bangunan)', 's', [P.X(3.0)]);
    // irisan detail
    s += detailIrisan(215, 190, 62, 30);

    // tabel
    const tx = 262, ty = 40;
    s += RC(tx, ty, 96, 56, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(tx + 3, ty + 5.6, 'SPESIFIKASI ATAP', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.8"');
    const rr = [
      ['Tipe atap', 'Pelana (gable)'],
      ['Kemiringan', '30° (min. 25°)'],
      ['Penutup', 'Genteng beton flat'],
      ['Usuk', 'Kayu 4/6 — jarak 500 mm'],
      ['Reng', 'Kayu 2/3 — jarak 310 mm'],
      ['Gording', 'Kayu 5/7 / baja C75'],
      ['Kuda-kuda', 'Kayu 8/12 — jarak 1.000 mm'],
      ['Overstek depan', '950 mm'],
      ['Overstek belakang', '550 mm'],
      ['Overstek samping', '200 / 550 mm'],
      ['Lisplang', 'GRC 3/20 + profil'],
      ['Talang', 'Zincalume 0,30 mm'],
      ['Pipa turun', 'PVC Ø3" (76 mm)'],
      ['Luas bidang atap', A.toFixed(2).replace('.', ',') + ' m²']
    ];
    rr.forEach((r, i) => {
      const yy = ty + 11 + i * 3.2;
      s += TX(tx + 3, yy, r[0], 'note', 'text-anchor="start" font-size="3.8"');
      s += TX(tx + 93, yy, r[1], 'noteB', 'text-anchor="end" font-size="3.8"');
      s += L(tx + 2, yy + 1.2, tx + 94, yy + 1.2, 'soft2');
    });

    // hitung material
    const hx = 262, hy = 104;
    s += RC(hx, hy, 96, 40, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(hx + 3, hy + 5.6, 'PERHITUNGAN MATERIAL ATAP', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.8"');
    const m = [
      ['Luas atap efektif', A.toFixed(2) + ' m²'],
      ['Genteng beton flat', Math.ceil(A * 11) + ' buah (11 bh/m²)'],
      ['Usuk 4/6 (jarak 0,5 m)', Math.ceil(A / 0.5 * 0.6) + ' m'],
      ['Reng 2/3 (jarak 0,31 m)', Math.ceil(A / 0.31 * 0.35 * 8) + ' m'],
      ['Gording 5/7 (jarak 1,0 m)', Math.ceil(8.5 / 1.0 * (R.halfSpan / Math.cos(G.rad(30))) * 2) + ' m'],
      ['Nok genteng', '8,50 m'],
      ['Paku + sealant', '1 set']
    ];
    m.forEach((r, i) => {
      const yy = hy + 11 + i * 4.0;
      s += TX(hx + 3, yy, r[0], 'note', 'text-anchor="start" font-size="3.8"');
      s += TX(hx + 93, yy, r[1], 'noteB', 'text-anchor="end" font-size="3.8"');
    });

    s += notesBox([
      'RENCANA ATAP skala 1:40 — tampak atas bidang atap, digambar tanpa dinding.',
      'Kemiringan minimal genteng beton flat adalah 25°; dipakai 30° agar aliran air lancar dan tampak proporsional.',
      'Air hujan dari bidang barat ditampung talang datar (dinding kopel) lalu dialirkan melalui pipa turun ke sumur resapan.',
      'Semua sambungan kayu diberi anti jamur dan anti rayap; baja ringan memakai sekrup self-drilling min. 4 buah per titik.',
      'Kanopi carport miring 1:2,5 ke arah timur agar air jatuh ke taman samping, bukan ke pekarangan tetangga.'
    ], 8);

    return sheet({
      judul: 'RENCANA ATAP', sub: 'Bidang atap utama + kanopi carport — skala 1:40',
      no: 'A-08', skala: '1:40', content: s
    });
  }

  function detailIrisan(x, y, w, h) {
    let s = RC(x, y, w, h, 'thin', 'fill="#f5f5f5" stroke-width="0.35"');
    s += TX(x + 2, y + 4, 'DETAIL IRISAN ATAP', 'sub', 'text-anchor="start" font-size="3.6"');
    // profil
    const ox = x + 5, oy = y + h - 5, k = 13;
    const p0 = [ox, oy - 3];
    const p1 = [ox + R.halfSpan * k, oy - 3 - R.rise * k];
    const p2 = [ox + R.halfSpan * 2 * k, oy - 3];
    s += L(p0[0], p0[1], p1[0], p1[1], 'thick');
    s += L(p1[0], p1[1], p2[0], p2[1], 'thick');
    s += L(p0[0], p0[1] - 1.4, p1[0], p1[1] - 1.4, 'med');
    s += L(p1[0], p1[1] - 1.4, p2[0], p2[1] - 1.4, 'med');
    for (let i = 1; i < 8; i++) {
      const t = i / 8;
      const gx = p0[0] + (p1[0] - p0[0]) * t, gy = p0[1] + (p1[1] - p0[1]) * t;
      s += L(gx, gy, gx, gy - 2.4, 'thin');
      const hx2 = p2[0] + (p1[0] - p2[0]) * t, hy2 = p2[1] + (p1[1] - p2[1]) * t;
      s += L(hx2, hy2, hx2, hy2 - 2.4, 'thin');
    }
    s += TX(ox + 2, oy - 1, 'genteng', 'sub', 'font-size="2.8"', 'text-anchor="start"');
    s += TX(p1[0] + 1, p1[1] - 1, '30°', 'sub', 'font-size="3"', 'text-anchor="start"');
    s += L(ox - 1, oy, ox + 52, oy, 'soft');
    s += TX(x + w / 2, y + h - 1.5, 'skala 1:20', 'sub', 'font-size="2.8"');
    return s;
  }

  // ============================================================
  //  RENCANA PONDASI
  // ============================================================
  function rencanaPondasi() {
    const k = 20, P = planT(k, 110, 30, 11.30);
    let s = '';
    s += RC(P.X(-1.2), P.Y(11.0), P.L(6.4), P.L(9.6), 'thin', 'fill="#f7f5f0" stroke="none"');

    // garis as
    for (const w of M.walls) {
      const o = { 'ext': 'med', 'int': 'med', 'kopel': 'med' }[w.type];
      if (w.dir === 'x') s += L(P.X(w.a), P.Y(w.at), P.X(w.b), P.Y(w.at), 'soft2');
      else s += L(P.X(w.at), P.Y(w.a), P.X(w.at), P.Y(w.b), 'soft2');
    }
    // pondasi: 3 lapis lebar
    for (const w of M.walls) {
      for (const [ww, cls] of [[0.80, 'cut2'], [0.60, 'cut'], [0.28, 'cut']]) {
        if (w.dir === 'x') {
          s += RC(P.X(w.a), P.Y(w.at + ww / 2), P.L(w.b - w.a), P.L(ww), cls);
        } else {
          s += RC(P.X(w.at - ww / 2), P.Y(w.b), P.L(ww), P.L(w.b - w.a), cls);
        }
      }
    }
    // sloof
    for (const w of M.walls) {
      if (w.dir === 'x') s += RC(P.X(w.a), P.Y(w.at + 0.075), P.L(w.b - w.a), P.L(0.15), 'thin', 'fill="#cbc7be"');
      else s += RC(P.X(w.at - 0.075), P.Y(w.b), P.L(0.15), P.L(w.b - w.a), 'thin', 'fill="#cbc7be"');
    }
    // kolom praktis
    const kol = [[0.00, 3.00], [0.95, 6.00], [0.95, 8.50], [1.65, 8.50], [1.65, 10.00],
      [3.00, 6.00], [3.00, 8.50], [3.00, 10.00], [0.00, 6.00], [0.00, 8.50],
      [0.00, 10.00], [0.47, 8.50], [2.30, 8.50], [3.00, 3.90]];
    kol.forEach(([kx, kz], i) => {
      s += RC(P.X(kx - 0.075), P.Y(kz + 0.075), P.L(0.15), P.L(0.15), 'thin', 'fill="#2d3142"');
      s += TX(P.X(kx), P.Y(kz) - 2.2, 'K' + (i + 1), 'sub', 'font-size="2.6"');
    });
    // label pondasi
    s += TX(P.X(1.5), P.Y(4.95), 'PONDASI BATU BELAH 1:4', 'sub', 'font-size="4.6"');
    s += TX(P.X(1.5), P.Y(4.95) + 4.6, 'trapesium — lebar bawah 600 mm, atas 250 mm, tinggi 650 mm', 'area');
    s += TX(P.X(1.5), P.Y(4.95) + 8.6, 'dasar pondasi −0,85 m dari lantai ±0,00', 'area');
    s += TX(P.X(0.40), P.Y(7.4), 'SLOOF 15/20', 'sub', 'font-size="4"', 'transform="rotate(-90 ' + F(P.X(0.40)) + ' ' + F(P.Y(7.4)) + ')"');
    s += TX(P.X(2.6), P.Y(9.2), 'SLOOF 15/20', 'sub', 'font-size="4"');

    // dimensi
    s += dimH(P.X(0), P.X(0.95), P.Y(2.55), '950', 's');
    s += dimH(P.X(0.95), P.X(1.65), P.Y(2.55), '700', 's');
    s += dimH(P.X(1.65), P.X(3.00), P.Y(2.55), '1.350', 's');
    s += dimH(P.X(0), P.X(3.00), P.Y(2.15), '3.000');
    s += dimV(P.Y(3.00), P.Y(3.90), P.X(-0.55), '900', 's');
    s += dimV(P.Y(3.90), P.Y(6.00), P.X(-0.55), '2.100', 's');
    s += dimV(P.Y(6.00), P.Y(8.50), P.X(-0.55), '2.500', 's');
    s += dimV(P.Y(8.50), P.Y(10.00), P.X(-0.55), '1.500', 's');
    s += dimV(P.Y(3.00), P.Y(10.00), P.X(-1.25), '7.000');

    // detail potongan pondasi
    s += detailPondasi(198, 212);

    // tabel
    const tx = 262, ty = 40;
    s += RC(tx, ty, 96, 48, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(tx + 3, ty + 5.6, 'SPESIFIKASI PONDASI & STRUKTUR', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.4"');
    const rr = [
      ['Jenis pondasi', 'Batu belah 1 : 4'],
      ['Penampang', 'Trapesium 60 / 25'],
      ['Tinggi pondasi', '650 mm'],
      ['Elevasi dasar', '−0,85 m'],
      ['Pasir urug', 't = 100 mm'],
      ['Aanstamping', 't = 150 mm'],
      ['Sloof', '15 / 20 — K-225'],
      ['Besi sloof', '4 Ø10 + Ø6-200'],
      ['Kolom praktis', '15 / 15 — 14 titik'],
      ['Ring balok', '15 / 20 — K-225'],
      ['Mutu beton', "fc' 19,3 MPa (K-225)"],
      ['Selimut beton', '25 mm'],
      ['Panjang total as pondasi', '23,50 m'],
      ['Volume pondasi', '± 7,60 m³']
    ];
    rr.forEach((r, i) => {
      const yy = ty + 10.4 + i * 2.75;
      s += TX(tx + 3, yy, r[0], 'note', 'text-anchor="start" font-size="3.6"');
      s += TX(tx + 93, yy, r[1], 'noteB', 'text-anchor="end" font-size="3.6"');
      s += L(tx + 2, yy + 1.0, tx + 94, yy + 1.0, 'soft2');
    });

    // galian
    const gx = 262, gy = 92;
    s += RC(gx, gy, 96, 46, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(gx + 3, gy + 5.6, 'VOLUME PEKERJAAN TANAH', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.4"');
    const gg = [
      ['Panjang pondasi', '23,50 m'],
      ['Lebar galian', '0,80 m'],
      ['Dalam galian', '0,85 m'],
      ['Volume galian', '23,50 × 0,80 × 0,70 = 13,16 m³'],
      ['Volume pasir urug', '23,50 × 0,80 × 0,10 = 1,88 m³'],
      ['Volume aanstamping', '23,50 × 0,75 × 0,15 = 2,64 m³'],
      ['Volume batu belah', '23,50 × 0,32 × 0,65 = 4,89 m³'],
      ['Urugan kembali', '± 5,50 m³'],
      ['Pembuangan tanah sisa', '± 7,60 m³']
    ];
    gg.forEach((r, i) => {
      const yy = gy + 10.4 + i * 3.8;
      s += TX(gx + 3, yy, r[0], 'note', 'text-anchor="start" font-size="3.6"');
      s += TX(gx + 93, yy, r[1], 'noteB', 'text-anchor="end" font-size="3.6"');
    });

    s += notesBox([
      'RENCANA PONDASI skala 1:40 — tampak atas, garis putus-putus = garis as dinding.',
      'Dasar galian harus mencapai tanah keras; bila belum tercapai, galian diteruskan atau dipakai pondasi setempat tambahan.',
      'Padatkan dasar galian, hampar pasir 100 mm, lalu susun batu kosong (aanstamping) 150 mm sebelum batu belah.',
      'Pondasi menerus diletakkan pada semua dinding, termasuk dinding kopel dan dinding kamar mandi.',
      'Beton sloof dan ring balok dicor menerus tanpa sambungan dingin; bila terpaksa, sambungan diberi stek besi.'
    ], 8);

    return sheet({
      judul: 'RENCANA PONDASI & SLOOF', sub: 'Pondasi batu belah + sloof beton bertulang 15/20 — skala 1:40',
      no: 'A-09', skala: '1:40', content: s
    });
  }

  function detailPondasi(x, y) {
    // detail potongan pondasi skala 1:12
    const k = 26, W = 74, Hh = 52;
    let s = RC(x, y - Hh, W, Hh, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(x + 2, y - Hh + 4.4, 'DETAIL PONDASI B1 — SKALA 1:12', 'sub', 'text-anchor="start" font-size="3.6" fill="#eb6c36"');
    const gx = x + 30, gy = y - 6;
    // tanah
    s += RC(x + 3, gy - 2.5, 68, 3.5, 'thin', 'fill="#eae7de" stroke="none"');
    s += L(x + 3, gy - 2.5, x + 71, gy - 2.5, 'med');
    // galian
    const gy2 = gy + 0.85 * k * 0.55;
    s += PG([[gx - 0.40 * k * 0.55, gy - 2.5], [gx + 0.40 * k * 0.55, gy - 2.5],
      [gx + 0.40 * k * 0.55, gy2], [gx - 0.40 * k * 0.55, gy2]], 'thin', 'fill="#f7f5f0"');
    // pasir
    s += RC(gx - 0.40 * k * 0.55, gy - 2.5 - 0.10 * k * 0.55, 0.80 * k * 0.55, 0.10 * k * 0.55, 'thin', 'fill="#e3d9bf"');
    // aanstamping
    s += RC(gx - 0.375 * k * 0.55, gy - 2.5 - 0.25 * k * 0.55, 0.75 * k * 0.55, 0.15 * k * 0.55, 'cut2');
    // batu belah
    s += PG([[gx - 0.30 * k * 0.55, gy - 2.5 - 0.25 * k * 0.55],
      [gx + 0.30 * k * 0.55, gy - 2.5 - 0.25 * k * 0.55],
      [gx + 0.125 * k * 0.55, gy - 2.5 - 0.90 * k * 0.55],
      [gx - 0.125 * k * 0.55, gy - 2.5 - 0.90 * k * 0.55]], 'cut');
    // sloof
    s += RC(gx - 0.075 * k * 0.55, gy - 2.5 - 1.15 * k * 0.55, 0.15 * k * 0.55, 0.20 * k * 0.55, 'thin', 'fill="#c9c5bc"');
    for (let i = 0; i < 4; i++) s += CI(gx - 0.045 * k * 0.55 + i * 0.03 * k * 0.55, gy - 2.5 - 1.05 * k * 0.55, 0.7, 'solid');
    // dinding di atas sloof
    s += RC(gx - 0.075 * k * 0.55, gy - 2.5 - 2.4 * k * 0.55, 0.15 * k * 0.55, 1.25 * k * 0.55, 'cut');
    // anotasi
    const an = (py, t, ax) => TX(x + 3 + (ax || 0), py, t, 'note', 'text-anchor="start" font-size="3.2"');
    an(gy - 4.2, '● Muka tanah −0,45');
    an(gy - 8.0, '● Pasir urug t=100');
    an(gy - 11.5, '● Aanstamping t=150');
    an(gy - 20, '● Batu belah 1:4');
    an(gy - 27, '● Sloof 15/20');
    an(gy - 33, '● Dinding bata');
    s += L(x + 2.4, gy - 3.4, gx - 0.38 * k * 0.55, gy - 4.6, 'soft2');
    s += L(x + 2.4, gy - 7.2, gx - 0.40 * k * 0.55, gy - 7.4, 'soft2');
    s += L(x + 2.4, gy - 10.7, gx - 0.36 * k * 0.55, gy - 10.7, 'soft2');
    s += L(x + 2.4, gy - 19.2, gx - 0.28 * k * 0.55, gy - 18.5, 'soft2');
    s += L(x + 2.4, gy - 26.2, gx - 0.10 * k * 0.55, gy - 25.2, 'soft2');
    return s;
  }

  // ============================================================
  //  RENCANA PLAFON & TITIK LAMPU
  // ============================================================
  function rencanaPlafon() {
    const P = planT(20, 104, 30, 11.30);
    let s = '';
    const d = denahBersih(null, { ox: 104, oy: 30, zRef: 11.30 });
    s += d.s;
    // garis plafon (as ruang)
    for (const r of M.rooms) {
      if (r.jenis === 'luar') continue;
      s += RC(P.X(r.x0 + 0.075), P.Y(r.z1 - 0.075), P.L(r.x1 - r.x0 - 0.15), P.L(r.z1 - r.z0 - 0.15), 'accent2');
      const cx = P.X((r.x0 + r.x1) / 2), cy = P.Y((r.z0 + r.z1) / 2);
      const gh = r.id === 'mandi' ? 2.60 : 2.80;
      s += TX(cx + 6, cy + 1.4, '↓ ' + gh.toFixed(2).replace('.', ',') + ' m', 'sub', 'font-size="3"', 'text-anchor="start"');
    }
    // drop ceiling / shadowline
    s += RC(P.X(0.075), P.Y(6.00), P.L(2.85), P.L(0.15), 'accent2');
    s += RC(P.X(0.075), P.Y(8.50), P.L(2.85), P.L(0.15), 'accent2');
    // titik lampu
    for (const t of M.listrik.titik.filter(t => t.jns === 'lampu')) {
      const x = P.X(t.x), y = P.Y(t.z);
      s += CI(x, y, 3.0, 'thin', 'fill="none" stroke-width="0.5"');
      s += L(x - 5, y, x + 5, y, 'thin') + L(x, y - 5, x, y + 5, 'thin');
      s += TX(x + 6.5, y - 1.4, t.id, 'sub', 'text-anchor="start" font-size="3.4" fill="#eb6c36"');
      s += TX(x + 6.5, y + 2.6, t.ket.replace(/^Lampu |^Downlight /, ''), 'area', 'text-anchor="start" font-size="2.9"');
    }
    // saklar
    for (const t of M.listrik.titik.filter(t => t.jns === 'saklar')) {
      const x = P.X(t.x), y = P.Y(t.z);
      s += CI(x, y, 2.2, 'thin', 'fill="#2d3142"');
      s += TX(x + 3.6, y - 1.2, t.id, 'sub', 'text-anchor="start" font-size="3"');
    }
    // legenda
    s += legendBox(P.X(4.55), P.Y(10.4), [
      ['thin', 'Garis plafon / batas ruang'],
      ['accent2', 'Drop ceiling + shadowline LED'],
      ['thin', 'Titik lampu plafon']
    ]);
    s += RC(P.X(4.55), P.Y(10.4) + 6 + 3 * 5.2 + 1, 66, 24, 'thin', 'fill="#f5f5f5" stroke-width="0.35"');
    s += TX(P.X(4.55) + 2, P.Y(10.4) + 6 + 3 * 5.2 + 5, 'SPESIFIKASI PLAFON', 'sub', 'text-anchor="start" font-size="4"');
    ['Penutup : GRC board 9 mm (ruang utama), PVC (KM)', 'Rangka : hollow galvanis 40x40 @ 600 mm',
      'Penggantung : hollow 20x40 @ 1.200 mm', 'List : shadowline 20 mm + list gypsum 50 mm',
      'Cat : plafon 2 lapis, warna putih'].forEach((t, i) => {
        s += TX(P.X(4.55) + 2, P.Y(10.4) + 10 + 3 * 5.2 + i * 3.2, t, 'note', 'text-anchor="start" font-size="3.4"');
      });

    s += dimH(P.X(0), P.X(3.00), P.Y(2.55), '3.000');
    s += dimV(P.Y(3.00), P.Y(10.00), P.X(-0.55), '7.000');

    s += notesBox([
      'RENCANA PLAFON skala 1:40 — tampak bawah plafon beserta titik lampu.',
      'Tinggi plafon 2,80 m (bersih ±2,72 m setelah rangka + penutup) pada semua ruang kecuali kamar mandi 2,60 m.',
      'Drop ceiling 15 cm dibuat memanjang pada batas ruang tamu–koridor dan koridor–dapur sebagai penanda zona + rumah lampu tersembunyi.',
      'Lubang akses (manhole) plafon 0,60 x 0,60 m di koridor untuk pemeliharaan instalasi listrik dan rangka atap.',
      'Semua lampu memakai LED hemat energi: ruang utama 18 W, kamar 12 W, koridor 9 W, kamar mandi 12 W IP44.'
    ], 8);

    return sheet({
      judul: 'RENCANA PLAFON & TITIK LAMPU', sub: 'Tinggi plafon 2,80 m — skala 1:40',
      no: 'A-10', skala: '1:40', content: s
    });
  }

  // ============================================================
  //  INSTALASI LISTRIK
  // ============================================================
  function instalasiListrik() {
    const d = denahBersih(null, { ox: 100, oy: 30, zRef: 11.30 });
    const P = d.P;
    let s = d.s;
    // jalur kabel
    const runs = [
      [[0.21, 3.98], [0.21, 9.6], [1.20, 9.6]],
      [[0.21, 4.30], [2.70, 4.30]],
      [[0.21, 6.40], [2.70, 6.40]],
      [[0.21, 7.60], [2.40, 7.60]],
      [[0.21, 8.60], [2.60, 8.60]],
      [[0.21, 3.30], [1.50, 3.30]],
      [[2.90, 5.90], [6.00, 5.90], [6.00, 1.10]],
      [[4.50, 5.90], [4.50, 7.50]],
      [[0.30, 4.05], [0.30, 3.30]],
      [[0.30, 6.20], [0.30, 8.70]]
    ];
    for (const r of runs) {
      s += PL(r.map(p => [P.X(p[0]), P.Y(p[1])]), 'accent2');
    }
    // titik
    const glyph = (t) => {
      const x = P.X(t.x), y = P.Y(t.z);
      if (t.jns === 'lampu') {
        return CI(x, y, 3.0, 'thin', 'fill="none" stroke-width="0.5"') + L(x - 5, y, x + 5, y, 'thin') + L(x, y - 5, x, y + 5, 'thin');
      }
      if (t.jns === 'saklar') return CI(x, y, 2.2, 'thin', 'fill="#2d3142"') + L(x, y, x + 4, y - 3, 'thin');
      if (t.jns === 'panel') return RC(x - 3.4, y - 2.6, 6.8, 5.2, 'thin', 'fill="#2d3142"') + TX(x, y + 1.2, 'MCB', 'sub', 'font-size="2.6" fill="#f5f5f5"');
      // stop kontak
      return CI(x, y, 2.4, 'thin', 'fill="#f5f5f5"') + CI(x, y, 1.0, 'solid');
    };
    for (const t of M.listrik.titik) {
      s += glyph(t);
      s += TX(P.X(t.x) + 4.2, P.Y(t.z) - 2.2, t.id, 'sub', 'text-anchor="start" font-size="3.2"');
      s += TX(P.X(t.x) + 4.2, P.Y(t.z) + 1.6, t.ket.replace(/^(Lampu|Downlight|Saklar|Stop kontak|Box)[^—]*— ?/, ''), 'area', 'text-anchor="start" font-size="2.7"');
    }
    // tabel grup
    const tx = 258, ty = 40;
    s += RC(tx, ty, 100, 42, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(tx + 3, ty + 5.6, 'PANEL & PEMBAGIAN GRUP', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.4"');
    s += TX(tx + 3, ty + 10.6, 'Daya terpasang ' + M.listrik.daya, 'note', 'text-anchor="start" font-size="3.6"');
    M.listrik.grup.forEach((g, i) => {
      const yy = ty + 16 + i * 6.2;
      s += TX(tx + 3, yy, g.g, 'noteB', 'text-anchor="start" font-size="3.8"');
      s += TX(tx + 20, yy, 'MCB ' + g.mcb, 'note', 'text-anchor="start" font-size="3.6" fill="#7a8399"');
      s += TX(tx + 3, yy + 3.2, g.beban, 'note', 'text-anchor="start" font-size="3.4"');
      s += L(tx + 2, yy + 4.4, tx + 98, yy + 4.4, 'soft2');
    });

    // legenda
    s += legendBox(P.X(4.35), P.Y(10.4), [
      ['thin', 'Titik lampu + armatur'],
      ['thin', 'Saklar (dinding 1,40 m)'],
      ['thin', 'Stop kontak (1,20–1,40 m)'],
      ['thin', 'Box MCB + kWh meter'],
      ['accent2', 'Jalur kabel NYM dalam conduit']
    ]);
    s += RC(P.X(4.35), P.Y(10.4) + 6 + 5 * 5.2 + 1, 68, 26, 'thin', 'fill="#f5f5f5" stroke-width="0.35"');
    s += TX(P.X(4.35) + 2, P.Y(10.4) + 6 + 5 * 5.2 + 5, 'SPESIFIKASI INSTALASI', 'sub', 'text-anchor="start" font-size="4"');
    ['Kabel : NYM 3x2,5 mm² (stop kontak)',
      'NYM 3x1,5 mm² (lampu)',
      'Conduit : PVC 20 mm dalam dinding/plafon',
      'Tinggi saklar 1,40 m; stop kontak 1,20–1,40 m',
      'Grounding : batang tembaga 1,5 m + BC 6 mm²',
      'Proteksi : MCB + ELCB 30 mA (opsional)'].forEach((t, i) => {
        s += TX(P.X(4.35) + 2, P.Y(10.4) + 10 + 5 * 5.2 + i * 3.1, t, 'note', 'text-anchor="start" font-size="3.3"');
      });

    s += dimH(P.X(0), P.X(3.00), P.Y(2.55), '3.000');
    s += dimV(P.Y(3.00), P.Y(10.00), P.X(-0.55), '7.000');

    s += notesBox([
      'INSTALASI LISTRIK skala 1:40 — denah jalur dan titik. Simbol sesuai konvensi gambar instalasi.',
      'Semua kabel ditanam dalam conduit PVC agar dapat ditarik ulang (rewiring) tanpa membongkar dinding.',
      'Tinggi titik: saklar 1,40 m; stop kontak umum 1,40 m; stop kontak dapur 1,20 m; titik AC 2,30 m.',
      'Jalur kabel luar ruangan (carport, taman) wajib memakai conduit anti-UV dan sambungan kedap air IP65.',
      'Uji akhir: tahanan isolasi minimal 1.000 ohm/volt, tahanan pentanahan maksimal 5 ohm.'
    ], 8);

    return sheet({
      judul: 'INSTALASI LISTRIK', sub: 'Denah titik lampu, saklar, stop kontak & jalur kabel — skala 1:40',
      no: 'ME-01', skala: '1:40', content: s
    });
  }

  // ============================================================
  //  AIR BERSIH & AIR KOTOR
  // ============================================================
  function airBersih() {
    const d = denahBersih(null, { ox: 100, oy: 30, zRef: 11.30 });
    const P = d.P;
    let s = d.s;
    // sumber & tandon
    s += RC(P.X(3.9), P.Y(5.0), P.L(0.95), P.L(0.95), 'med', 'fill="#dfe3e6"');
    s += TX(P.X(4.37), P.Y(4.6), 'TANDON 600 L', 'sub', 'font-size="3.4"');
    s += RC(P.X(3.4), P.Y(5.6), P.L(0.4), P.L(0.3), 'med', 'fill="#dfe3e6"');
    s += TX(P.X(3.6), P.Y(5.15), 'POMPA', 'sub', 'font-size="3"');
    // pipa utama
    const runs = [
      [[4.08, 4.65], [3.9, 5.6]],
      [[3.9, 5.6], [3.0, 5.6], [2.2, 5.6], [2.2, 9.0]],
      [[2.2, 9.0], [1.20, 9.7]],
      [[2.2, 6.4], [0.3, 5.65]],
      [[2.2, 8.6], [2.65, 9.0]],
      [[2.2, 9.0], [2.65, 9.8]],
      [[3.9, 5.6], [4.5, 5.6], [4.5, 7.3]],
      [[3.9, 5.6], [3.9, 2.0], [1.0, 2.0]]
    ];
    for (const r of runs) s += PL(r.map(p => [P.X(p[0]), P.Y(p[1])]), 'accent', 'stroke-width="0.9"');
    // fixture
    for (const t of M.plumbing.airBersih) {
      const x = P.X(t.x), y = P.Y(t.z);
      s += PG([[x, y - 3], [x + 3, y], [x, y + 3], [x - 3, y]], 'thin', 'fill="#2e5aa8"');
      s += TX(x + 5, y + 1, t.ket, 'area', 'text-anchor="start" font-size="2.9"');
    }
    // legenda + tabel
    s += legendBox(P.X(4.35), P.Y(10.4), [
      ['accent', 'Pipa air bersih PPR Ø1/2"–3/4"'],
      ['thin', 'Titik keran / sanitair'],
      ['med', 'Tandon + pompa di atas carport']
    ]);
    const tx = 258, ty = 40;
    s += RC(tx, ty, 100, 46, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(tx + 3, ty + 5.6, 'SPESIFIKASI AIR BERSIH', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.4"');
    const rr = [
      ['Sumber', M.plumbing.sumber],
      ['Kapasitas tandon', M.plumbing.tandon.kapasitas],
      ['Posisi tandon', 'Atap carport, elevasi +2,90 m'],
      ['Pompa', 'Semi-jet 125 W + pressure switch'],
      ['Pipa utama', 'PPR PN10 Ø3/4"'],
      ['Pipa cabang', 'PPR PN10 Ø1/2"'],
      ['Kecepatan aliran', '0,5 – 1,5 m/s (aman)'],
      ['Head loss total', '± 6,5 m (masih < head pompa 20 m)'],
      ['Kebutuhan air', '3 org × 120 L = 360 L/hari'],
      ['Cadangan tandon', '600 L ≈ 1,7 hari'],
      ['Penampung hujan', 'Sumur resapan Ø1,0 × 1,5 m']
    ];
    rr.forEach((r, i) => {
      const yy = ty + 10.4 + i * 3.1;
      s += TX(tx + 3, yy, r[0], 'note', 'text-anchor="start" font-size="3.5"');
      s += TX(tx + 97, yy, r[1], 'noteB', 'text-anchor="end" font-size="3.5"');
      s += L(tx + 2, yy + 1.1, tx + 98, yy + 1.1, 'soft2');
    });
    // skema
    s += skemaPipa(212, 200);

    s += dimH(P.X(0), P.X(3.00), P.Y(2.55), '3.000');
    s += dimV(P.Y(3.00), P.Y(10.00), P.X(-0.55), '7.000');

    s += notesBox([
      'INSTALASI AIR BERSIH skala 1:40 — jalur pipa dari sumber ke seluruh titik sanitair.',
      'Tandon diletakkan minimum 1,5 m di atas titik keran tertinggi agar tersedia tekanan gravitasi saat listrik mati.',
      'Setiap cabang diberi stop kran (gate valve) agar perbaikan dapat dilakukan tanpa mematikan seluruh sistem.',
      'Pipa dalam dinding dilindungi conduit; pipa di luar ruangan dilapisi insulasi + ditanam minimal 30 cm di bawah tanah.',
      'Uji tekan pipa 1,5 × tekanan kerja (minimal 10 bar) selama 30 menit tanpa penurunan tekanan.'
    ], 8);

    return sheet({
      judul: 'INSTALASI AIR BERSIH', sub: 'Jalur pipa air bersih PPR Ø1/2" – 3/4" — skala 1:40',
      no: 'ME-02', skala: '1:40', content: s
    });
  }

  function skemaPipa(x, y) {
    let s = RC(x, y, 74, 40, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(x + 2, y + 4.4, 'SKEMA HIDROLIK AIR BERSIH & AIR BUANGAN', 'sub', 'text-anchor="start" font-size="3.4" fill="#eb6c36"');
    const box = (bx, by, bw, bh, t) => RC(bx, by, bw, bh, 'thin', 'fill="#fbfaf7"') + TX(bx + bw / 2, by + bh / 2 + 1.2, t, 'sub', 'font-size="3.2"');
    s += box(x + 3, y + 8, 17, 7, 'SUMBER');
    s += box(x + 24, y + 8, 17, 7, 'TANDON');
    s += box(x + 45, y + 8, 14, 7, 'POMPA');
    s += box(x + 24, y + 21, 17, 7, 'DISTRIBUSI');
    const ar = (x1, y1, x2, y2) => L(x1, y1, x2, y2, 'soft', 'marker-end="url(#arw)"');
    s += ar(x + 20, y + 11.5, x + 24, y + 11.5);
    s += ar(x + 41, y + 11.5, x + 45, y + 11.5);
    s += L(x + 52, y + 15, x + 52, y + 24.5, 'soft') + L(x + 52, y + 24.5, x + 41, y + 24.5, 'soft');
    s += L(x + 45, y + 24.5, x + 41, y + 24.5, 'soft', 'marker-end="url(#arw)"');
    s += ar(x + 32.5, y + 15, x + 32.5, y + 21);
    const b2 = (bx, by, bw, bh, t) => RC(bx, by, bw, bh, 'thin', 'fill="#eef2f5"') + TX(bx + bw / 2, by + bh / 2 + 1.2, t, 'sub', 'font-size="3"');
    s += b2(x + 3, y + 21, 17, 7, 'SINK • WASTAFEL');
    s += b2(x + 3, y + 29, 17, 7, 'SHOWER • KLOSET');
    s += b2(x + 45, y + 29, 26, 7, 'SEPTICTANK + RESAPAN');
    s += ar(x + 20, y + 24.5, x + 24, y + 24.5);
    s += L(x + 20, y + 32.5, x + 45, y + 32.5, 'soft', 'marker-end="url(#arw)"');
    s += TX(x + 4, y + 39, 'PVC 3" & 2"  •  kemiringan 1–2 %  •  bak kontrol tiap ≤ 6 m', 'note', 'text-anchor="start" font-size="3"');
    return s;
  }

  function airKotor() {
    const d = denahBersih(null, { ox: 100, oy: 30, zRef: 11.60 });
    const P = d.P;
    let s = d.s;
    // jalur air kotor dalam bangunan
    const runs = [
      [[2.30, 9.45], [2.30, 9.10], [2.20, 8.75], [1.05, 9.90]],
      [[1.05, 9.90], [1.05, 11.05]],
      [[1.05, 11.05], [2.05, 11.05]],
      [[2.05, 11.05], [2.05, 11.35]],
      [[0.55, 9.90], [1.05, 9.90]],
      [[1.90, 8.75], [1.90, 9.45], [2.30, 9.45]],
      [[2.05, 11.05], [3.90, 11.05], [3.90, 11.35]]
    ];
    for (const r of runs) s += PL(r.map(p => [P.X(p[0]), P.Y(p[1])]), 'accent', 'stroke-width="1.1"');
    // jalur air hujan
    const hujan = [
      [[-0.12, 2.20], [-0.12, 10.40]],
      [[-0.12, 10.40], [5.20, 10.40], [5.20, 10.20]],
      [[3.62, 2.20], [3.62, 11.10], [3.62, 11.10]],
      [[6.02, 1.00], [6.02, 10.40], [5.20, 10.40]]
    ];
    for (const r of hujan) s += PL(r.map(p => [P.X(p[0]), P.Y(p[1])]), 'soft', 'stroke-width="1" stroke-dasharray="4 2"');
    // fixture
    const box = (t, cls, col) => {
      const x = P.X(t.x), y = P.Y(t.z);
      return RC(x - 4, y - 3.2, 8, 6.4, 'thin', 'fill="' + (col || '#e7eef1') + '" stroke-width="0.45"') +
        TX(x + 5.5, y + 1, t.ket, 'area', 'text-anchor="start" font-size="2.9"');
    };
    for (const t of M.plumbing.airKotor) s += box(t, null, t.id === 'B5' ? '#e2ded6' : t.id === 'B6' ? '#e6efe3' : t.id === 'B7' ? '#dfeaf0' : '#e7eef1');
    // arah aliran
    s += TX(P.X(1.55), P.Y(11.7), 'SEPTICTANK 1,20 × 2,00 m', 'sub', 'font-size="3.2"');
    s += TX(P.X(3.95), P.Y(11.95), 'BIDANG RESAPAN', 'sub', 'font-size="3"');
    s += TX(P.X(5.20), P.Y(9.75), 'SUMUR RESAPAN Ø1,0', 'sub', 'font-size="3"');

    s += legendBox(P.X(-1.15), P.Y(10.9), [
      ['accent', 'Air kotor (grey/black water) PVC 3" & 2"'],
      ['soft', 'Air hujan: talang + pipa turun 3"'],
      ['thin', 'Bak kontrol / grease trap'],
      ['thin', 'Septictank biofilter + resapan']
    ]);
    // tabel
    const tx = 258, ty = 36;
    s += RC(tx, ty, 100, 50, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
    s += TX(tx + 3, ty + 5.6, 'SPESIFIKASI SANITASI', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.4"');
    const rr = [
      ['Air kotor KM', 'PVC D3" → septictank'],
      ['Air kotor dapur', 'PVC D2" → grease trap'],
      ['Ventilasi pipa', 'PVC 2" naik di atas atap'],
      ['Kemiringan pipa', '1 – 2 % (minimal 0,5 %)'],
      ['Bak kontrol', 'Setiap ≤ 6 m & tiap belokan'],
      ['Grease trap', '0,40 × 0,40 × 0,50 m'],
      ['Septictank', '1,20 × 2,00 m, 3 kompartemen'],
      ['Biofilter', 'Media sarang tawon + bakteri'],
      ['Bidang resapan', '1,00 × 1,50 m, ijuk + kerikil'],
      ['Sumur resapan hujan', 'Ø1,00 m dalam 1,50 m'],
      ['Jarak ke sumur air', 'Minimal 10 m (aman)'],
      ['Kapasitas septictank', '± 1,5 m³ (≥ 3 tahun)']
    ];
    rr.forEach((r, i) => {
      const yy = ty + 10.4 + i * 3.2;
      s += TX(tx + 3, yy, r[0], 'note', 'text-anchor="start" font-size="3.4"');
      s += TX(tx + 97, yy, r[1], 'noteB', 'text-anchor="end" font-size="3.4"');
      s += L(tx + 2, yy + 1.1, tx + 98, yy + 1.1, 'soft2');
    });
    s += skemaPipa(212, 198);

    s += dimH(P.X(0), P.X(3.00), P.Y(2.9), '3.000');
    s += dimV(P.Y(3.00), P.Y(10.00), P.X(-0.75), '7.000');

    s += notesBox([
      'INSTALASI AIR KOTOR & SANITASI skala 1:40 — jalur pembuangan air kotor, air hujan, dan penempatan septictank.',
      'Pisahkan sistem air kotor (grey/black water) dari air hujan; air hujan langsung ke sumur resapan tanpa melewati septictank.',
      'Septictank diberi ventilasi pipa 2" yang naik melewati atap minimal 60 cm agar gas tidak masuk rumah.',
      'Bak kontrol diletakkan pada setiap belokan dan setiap jarak maksimum 6 m untuk memudahkan pembersihan.',
      'Jarak sumur resapan minimal 2 m dari batas kavling dan 10 m dari sumur air bersih tetangga.'
    ], 8);

    return sheet({
      judul: 'INSTALASI AIR KOTOR & SANITASI', sub: 'Pembuangan air kotor, air hujan, septictank & resapan — skala 1:40',
      no: 'ME-03', skala: '1:40', content: s
    });
  }

  // ============================================================
  //  DETAIL KUSEN
  // ============================================================
  function detailKusen() {
    let s = '';
    const items = [
      { kode: 'P1', lebar: 0.90, tinggi: 2.10, jns: 'pintu', nama: 'Pintu Utama' },
      { kode: 'P2', lebar: 0.80, tinggi: 2.10, jns: 'pintu', nama: 'Pintu Kamar' },
      { kode: 'P3', lebar: 0.70, tinggi: 2.10, jns: 'pintu', nama: 'Pintu KM' },
      { kode: 'J1', lebar: 1.40, tinggi: 1.20, jns: 'jendela', nama: 'Jendela R.Tamu' },
      { kode: 'J2', lebar: 1.20, tinggi: 1.20, jns: 'jendela', nama: 'Jendela Kamar' },
      { kode: 'J3', lebar: 0.80, tinggi: 0.90, jns: 'jendela', nama: 'Jendela Dapur' },
      { kode: 'J4', lebar: 0.70, tinggi: 0.60, jns: 'jendela', nama: 'Jendela KM' },
      { kode: 'EF1', lebar: 0.25, tinggi: 0.25, jns: 'fan', nama: 'Exhaust Dapur' }
    ];
    const cols = 4, cw = 96, ch = 76;
    items.forEach((it, i) => {
      const cx = 16 + (i % cols) * cw, cy = 34 + Math.floor(i / cols) * ch;
      s += RC(cx, cy, cw - 8, ch - 12, 'thin', 'fill="#fbfaf7" stroke-width="0.4"');
      s += TX(cx + 3, cy + 6, it.kode + '  ' + it.nama.toUpperCase(), 'sub', 'text-anchor="start" font-size="4.4" fill="#eb6c36"');
      s += TX(cx + 3, cy + 10.6, it.lebar.toFixed(2).replace('.', ',') + ' × ' + it.tinggi.toFixed(2).replace('.', ',') + ' m', 'note', 'text-anchor="start" font-size="3.6"');
      // gambar kusen
      const k = 20, gw = it.lebar * k, gh = it.tinggi * k;
      const bx = cx + (cw - 8 - gw) / 2, by = cy + ch - 15 - gh;
      s += RC(bx, by, gw, gh, 'thick', 'fill="#f5f3ee"');
      const fw = 3.4;
      s += RC(bx, by, fw, gh, 'thin', 'fill="#e0d5c2"');
      s += RC(bx + gw - fw, by, fw, gh, 'thin', 'fill="#e0d5c2"');
      s += RC(bx, by, gw, fw, 'thin', 'fill="#e0d5c2"');
      if (it.jns === 'pintu') {
        s += RC(bx, by + gh - fw, gw, fw, 'thin', 'fill="#ded2be"');
        const dw = (gw - fw * 2) / 1;
        s += RC(bx + fw, by + fw * 2.6, dw, gh - fw * 2, 'thin', 'fill="#eae0cd"');
        s += RC(bx + fw + 1.6, by + fw * 2.6 + 2.4, dw - 3.2, gh - fw * 2 - 5, 'thin', 'fill="#f4eee2"');
        s += RC(bx + fw + 3, by + fw * 2.6 + 6, dw - 6, (gh - fw * 2) * 0.42, 'thin', 'fill="#ded2be"');
        s += CI(bx + gw - fw - 3, by + gh / 2 + 2, 1.1, 'solid');
        // engsel
        for (const t of [0.18, 0.5, 0.82]) s += RC(bx + fw - 1, by + gh * t, 2, 3, 'thin', 'fill="#8a8f96"');
        // potongan atas
        const sy = by + gh + 4;
        s += RC(bx, sy, gw, 5, 'thin', 'fill="#f0ece3"');
        s += RC(bx + fw / 2 - 1, sy - fw * 0.4, 2.4, 2.4, 'thin', 'fill="#c9bfa8"');
        s += RC(bx + gw - fw / 2 - 1, sy - fw * 0.4, 2.4, 2.4, 'thin', 'fill="#c9bfa8"');
        s += TX(bx + gw / 2, sy + 3.6, 'potongan atas — kusen 6/12', 'sub', 'font-size="2.8"');
      } else if (it.jns === 'jendela') {
        s += RC(bx, by + gh - fw, gw, fw, 'thin', 'fill="#ded2be"');
        const n = it.lebar >= 1.2 ? 2 : 1;
        for (let j = 0; j < n; j++) {
          const dx = bx + fw + j * (gw - fw * 2) / n;
          const dww = (gw - fw * 2) / n;
          s += RC(dx + 1, by + fw + 1, dww - 2, gh - fw * 2 - 2, 'thin', 'fill="#d5e6ec"');
          s += RC(dx + 1, by + fw + 1, dww - 2, gh - fw * 2 - 2, 'thin', 'fill="none" stroke-width="0.4" stroke="#8fa9b5"');
          for (let g = 1; g < 4; g++) {
            s += L(dx + dww * g / 4, by + fw + 1, dx + dww * g / 4, by + gh - fw - 1, 'soft2');
          }
        }
        s += RC(bx - 1.6, by - 1.6, gw + 3.2, 2, 'thin', 'fill="#ded2be"');
        s += RC(bx - 1.6, by + gh + fw - 0.4, gw + 3.2, 2, 'thin', 'fill="#ded2be"');
        s += TX(bx + gw / 2, by - 3.4, 'jalusi besi 12 mm', 'sub', 'font-size="2.6"');
      } else {
        s += RC(bx, by, gw, gh, 'thin', 'fill="#e6e3dc"');
        for (let j = 0; j < 3; j++) s += L(bx, by + gh * (j + 1) / 4, bx + gw, by + gh * (j + 1) / 4, 'soft2');
        s += CI(bx + gw / 2, by + gh / 2, 3.4, 'thin');
        s += CI(bx + gw / 2, by + gh / 2, 1.0, 'solid');
      }
      // dimensi
      s += dimH(bx, bx + gw, by + gh + (it.jns === 'pintu' ? 13 : 6), (it.lebar * 1000).toFixed(0), 's');
      s += dimV(by, by + gh, bx - 4, (it.tinggi * 1000).toFixed(0), 's');
    });

    // tabel jadwal
    const ty = 182;
    s += TX(16, ty, 'JADWAL KUSEN, PINTU & JENDELA', 'sub', 'text-anchor="start" fill="#eb6c36" font-size="4.8"');
    const colsW = [16, 30, 96, 110, 164, 230, 314];
    const heads = ['KODE', 'NAMA', 'JML', 'UKURAN', 'BAHAN', 'RANGKA & DAUN', 'AKSESORIS'];
    let yy = ty + 6;
    s += L(14, yy - 3, 406, yy - 3, 'soft');
    heads.forEach((h, i) => s += TX(colsW[i], yy, h, 'sub', 'text-anchor="start" font-size="3.6"'));
    s += L(14, yy + 1.6, 406, yy + 1.6, 'soft');
    M.kusen.forEach((kk, i) => {
      const ry = yy + 6 + i * 5.0;
      s += TX(colsW[0], ry, kk.kode, 'noteB', 'text-anchor="start" font-size="3.8"');
      s += TX(colsW[1], ry, kk.nama, 'note', 'text-anchor="start" font-size="3.5"');
      s += TX(colsW[2], ry + 0.2, kk.jml + ' unit', 'note', 'text-anchor="start" font-size="3.4"');
      s += TX(colsW[3], ry + 0.2, (kk.lebar * 1000).toFixed(0) + '×' + (kk.tinggi * 1000).toFixed(0), 'note', 'text-anchor="start" font-size="3.4"');
      s += TX(colsW[4], ry + 0.2, kk.bahan, 'note', 'text-anchor="start" font-size="3.1"');
      s += TX(colsW[5], ry + 0.2, kk.rangka + ' • ' + kk.daun, 'note', 'text-anchor="start" font-size="3.1"');
      s += TX(colsW[6], ry + 0.2, kk.aksesoris, 'note', 'text-anchor="start" font-size="3.1"');
      s += L(14, ry + 2, 406, ry + 2, 'soft2');
    });

    return sheet({
      judul: 'DETAIL & JADWAL KUSEN', sub: 'Gambar tampak depan tiap tipe kusen + jadwal lengkap — skala 1:20',
      no: 'A-11', skala: '1:20', content: s
    });
  }

  // ============================================================
  //  DETAIL KONSTRUKSI
  // ============================================================
  function detailKonstruksi() {
    let s = '';
    // 1. Kolom praktis + ring balok
    const D = (x, y, w, h, t) => RC(x, y, w, h, 'thin', 'fill="#fbfaf7" stroke-width="0.4"') +
      TX(x + 3, y + 5.4, t, 'sub', 'text-anchor="start" font-size="4.2" fill="#eb6c36"');
    s += D(16, 34, 126, 84, 'D1 — KOLOM PRAKTIS + RING BALOK');
    {
      const k = 34, ox = 46, oy = 108;
      // dinding
      s += RC(ox - 0.075 * k, oy - 2.3 * k, 0.15 * k, 2.3 * k, 'cut');
      // ring balok di atas
      s += RC(ox - 0.20 * k, oy - 2.6 * k, 0.40 * k, 0.30 * k, 'thin', 'fill="#cfcbc2"');
      // kolom
      s += RC(ox - 0.075 * k, oy - 2.3 * k, 0.15 * k, 2.3 * k, 'thin', 'fill="#e9e5dd" stroke-dasharray="2 1.2"');
      // tulangan
      for (const tx of [-0.045, 0.045]) {
        s += L(ox + tx * k, oy - 0.1 * k, ox + tx * k, oy - 2.55 * k, 'med');
      }
      // begel
      for (let i = 0; i < 12; i++) {
        const yy2 = oy - 0.15 * k - i * 0.19 * k;
        s += RC(ox - 0.045 * k, yy2 - 1.6, 0.09 * k, 3.2, 'thin', 'stroke-width="0.35"');
      }
      s += TX(ox + 0.30 * k, oy - 2.7 * k, 'ring balok 15/20', 'note', 'text-anchor="start" font-size="3.4"');
      s += TX(ox + 0.30 * k, oy - 2.5 * k, "4 Ø10 + Ø6-200", 'note', 'text-anchor="start" font-size="3.2" fill="#7a8399"');
      s += TX(ox + 0.30 * k, oy - 1.4 * k, 'kolom praktis 15/15', 'note', 'text-anchor="start" font-size="3.4"');
      s += TX(ox + 0.30 * k, oy - 1.2 * k, '4 Ø10 + begel Ø6-200', 'note', 'text-anchor="start" font-size="3.2" fill="#7a8399"');
      s += TX(ox + 0.30 * k, oy - 0.6 * k, 'selimut beton 25 mm', 'note', 'text-anchor="start" font-size="3.2" fill="#7a8399"');
      s += TX(ox + 0.30 * k, oy - 0.15 * k, "mutu beton fc' 19,3 MPa (K-225)", 'note', 'text-anchor="start" font-size="3.2" fill="#7a8399"');
      s += L(ox - 0.075 * k, oy + 1, ox + 0.075 * k, oy + 1, 'med');
      s += TX(ox, oy + 4, 'lantai ±0,00', 'sub', 'font-size="3"');
      // potongan melintang
      const sx = ox + 52, sy = oy - 1.4 * k;
      s += RC(sx - 0.075 * k, sy - 0.075 * k, 0.15 * k, 0.15 * k, 'thin', 'fill="#e0dcd3"');
      for (const [dx2, dy2] of [[-0.045, -0.045], [0.045, -0.045], [-0.045, 0.045], [0.045, 0.045]]) {
        s += CI(sx + dx2 * k, sy + dy2 * k, 1.6, 'solid');
      }
      s += RC(sx - 0.045 * k - 1.6, sy - 0.045 * k - 1.6, 0.09 * k + 3.2, 0.09 * k + 3.2, 'thin', 'stroke-width="0.35"');
      s += TX(sx, sy + 0.12 * k, 'potongan kolom', 'sub', 'font-size="3"');
    }

    // 2. Kuda-kuda
    s += D(152, 34, 126, 84, 'D2 — KUDA-KUDA & SAMBUNGAN ATAP');
    {
      const k = 28, ox = 176, oy = 112;
      const y0 = oy, yR2 = oy - R.rise * 1.35 * k / 1.0 * 0.34;
      const half = R.halfSpan * 1.35;
      const px = x => ox + x * k * 0.78;
      const py = y => oy - y * k * 0.62;
      s += L(px(-half), py(0), px(half), py(0), 'med');
      s += L(px(-half), py(0.10), px(0), py(R.rise), 'med');
      s += L(px(0), py(R.rise), px(half), py(0.10), 'med');
      s += L(px(0), py(R.rise), px(0), py(0.10), 'med');
      s += L(px(-half * 0.62), py(0.10), px(0), py(R.rise - 0.42), 'med');
      s += L(px(half * 0.62), py(0.10), px(0), py(R.rise - 0.42), 'med');
      // gording
      for (let i = 1; i <= 4; i++) {
        const t = i / 5;
        s += CI(px(-half + half * t), py(R.rise * t), 1.3, 'solid');
        s += CI(px(half - half * t), py(R.rise * t), 1.3, 'solid');
      }
      s += TX(px(0), py(R.rise) - 4, 'nok +3,88 m', 'sub', 'font-size="3.2"');
      s += TX(px(-half) - 4, py(0) + 6, 'balok tarik 8/12', 'sub', 'font-size="3"', 'text-anchor="start"');
      s += TX(px(0) + 3, py(0.55), 'tiang raja 8/12', 'sub', 'font-size="3"', 'text-anchor="start"');
      s += TX(px(-half * 0.55), py(R.rise * 0.42), 'kaki kuda-kuda 8/12', 'sub', 'font-size="3"', 'text-anchor="end"');
      s += TX(px(half * 0.62), py(R.rise * 0.35), 'sokong 8/12', 'sub', 'font-size="3"', 'text-anchor="start"');
      s += TX(px(half * 0.9), py(R.rise * 0.8), 'gording 5/7', 'sub', 'font-size="3"', 'text-anchor="start"');
      s += TX(ox, oy + 10, 'kuda-kuda kayu 8/12 — jarak antar 1,00 m', 'note', 'text-anchor="middle" font-size="3.4"');
    }

    // 3. Detail lantai
    s += D(278, 34, 126, 84, 'D3 — SUSUNAN LANTAI & DINDING');
    {
      const ox = 292, oy = 104, k = 1;
      const layers = [
        ['Keramik granit 60×60', 8, '#e8e2d4'],
        ['Sprei / mortar 1:3 t=20', 5, '#dcd6c8'],
        ['Pelat beton t=80 + wiremesh M5-150', 14, '#c9c5bc'],
        ['Lantai kerja t=50 (1:5)', 9, '#d6d1c7'],
        ['Pasir urug t=100', 16, '#e2d8bf'],
        ['Tanah urug dipadatkan', 22, '#e9e5dd']
      ];
      let y = oy;
      for (const [t, h, c] of layers) {
        s += RC(ox, y, 88, h, 'thin', 'fill="' + c + '" stroke-width="0.35"');
        s += TX(ox + 90, y + h - 1.5, t, 'note', 'text-anchor="start" font-size="3.2"');
        y += h;
      }
      s += L(ox - 4, oy, ox + 84, oy, 'med');
      s += TX(ox + 84, oy + 8, '±0,00', 'sub', 'font-size="3"', 'text-anchor="start"');
      // dinding
      const wx = ox, wy = oy - 1;
      s += RC(wx + 4, oy - 62, 12, 62, 'cut');
      s += TX(wx + 20, oy - 56, 'Dinding bata merah ½ bata', 'note', 'text-anchor="start" font-size="3.2"');
      s += TX(wx + 20, oy - 52, 'Plester 1:4 t=15 mm (2 sisi)', 'note', 'text-anchor="start" font-size="3.2"');
      s += TX(wx + 20, oy - 48, 'Acian semen putih t=2 mm', 'note', 'text-anchor="start" font-size="3.2"');
      s += TX(wx + 20, oy - 44, 'Cat dasar + 2 lapis cat akhir', 'note', 'text-anchor="start" font-size="3.2"');
      s += TX(wx + 20, oy - 38, 'Total tebal dinding ± 150 mm', 'noteB', 'text-anchor="start" font-size="3.4"');
      // plint
      s += RC(wx + 3, oy - 10, 14, 10, 'thin', 'fill="#c8bda8"');
      s += TX(wx + 20, oy - 6, 'Plint / skirting kayu h=100 mm', 'note', 'text-anchor="start" font-size="3.2"');
    }

    // 4. Detail bak kontrol & septictank
    s += D(16, 126, 386, 84, 'D4 — SEPTICTANK BIOFILTER, BAK KONTROL & SUMUR RESAPAN  (skala 1:25)');
    {
      const oy = 190;
      // septictank
      let ox = 28;
      s += L(ox - 4, oy, ox + 104, oy, 'med');
      s += RC(ox, oy, 78, 26, 'thin', 'fill="#efece4" stroke-width="0.5"');
      s += RC(ox + 3, oy + 4, 72, 19, 'thin', 'fill="#e4eef3"');
      s += RC(ox + 6, oy + 6, 20, 15, 'thin', 'fill="#cfe0e8"');
      s += RC(ox + 30, oy + 6, 20, 15, 'thin', 'fill="#d8e6ec"');
      s += RC(ox + 54, oy + 6, 18, 15, 'thin', 'fill="#c6dae4"');
      s += TX(ox + 16, oy + 15, 'RUANG 1', 'sub', 'font-size="3"');
      s += TX(ox + 40, oy + 15, 'RUANG 2', 'sub', 'font-size="3"');
      s += TX(ox + 63, oy + 15, 'BIOFILTER', 'sub', 'font-size="3"');
      s += L(ox + 26, oy + 13, ox + 30, oy + 13, 'med');
      s += L(ox + 50, oy + 13, ox + 54, oy + 13, 'med');
      s += L(ox + 72, oy + 10, ox + 86, oy + 10, 'med', 'marker-end="url(#arw)"');
      s += TX(ox + 88, oy + 11.4, 'ke bidang resapan', 'note', 'text-anchor="start" font-size="3.2"');
      // pipa masuk & ventilasi
      s += L(ox + 8, oy - 14, ox + 8, oy + 6, 'med');
      s += TX(ox + 8, oy - 16, 'air kotor Ø3"', 'sub', 'font-size="3"');
      s += L(ox + 60, oy + 4, ox + 60, oy - 20, 'med');
      s += TX(ox + 60, oy - 22, 'ventilasi Ø2" naik di atas atap', 'sub', 'font-size="3"');
      s += RC(ox + 2, oy - 3, 74, 3, 'thin', 'fill="#c9c5bc"');
      s += TX(ox, oy + 30, 'SEPTICTANK 1,20 × 2,00 m — 3 KOMPARTEMEN', 'noteB', 'font-size="3.6"');

      // bak kontrol
      ox = 150;
      s += L(ox - 4, oy, ox + 60, oy, 'med');
      s += RC(ox, oy - 4, 50, 20, 'thin', 'fill="#efece4" stroke-width="0.5"');
      s += RC(ox + 3, oy, 44, 13, 'thin', 'fill="#dfe9ef"');
      s += RC(ox + 2, oy - 6, 46, 3, 'thin', 'fill="#c9c5bc"');
      s += L(ox + 10, oy - 12, ox + 10, oy, 'med');
      s += L(ox + 40, oy + 6, ox + 56, oy + 6, 'med', 'marker-end="url(#arw)"');
      s += TX(ox, oy + 22, 'BAK KONTROL 0,40 × 0,40 m', 'noteB', 'font-size="3.6"');
      s += TX(ox, oy + 25.5, 'dasar miring 2% ke arah aliran', 'note', 'font-size="3.2"');

      // sumur resapan
      ox = 232;
      s += L(ox - 4, oy, ox + 74, oy, 'med');
      s += PG([[ox + 4, oy], [ox + 60, oy], [ox + 60, oy + 30], [ox + 4, oy + 30]], 'thin', 'fill="#efece4" stroke-width="0.5"');
      s += PG([[ox + 10, oy + 2], [ox + 54, oy + 2], [ox + 54, oy + 26], [ox + 10, oy + 26]], 'thin', 'fill="#dfeaf0"');
      for (let i = 0; i < 5; i++) s += RC(ox + 12 + i * 4, oy + 4, 3, 20, 'thin', 'fill="#c8bfa8"');
      s += RC(ox + 8, oy - 3, 48, 4, 'thin', 'fill="#c9c5bc"');
      s += L(ox + 32, oy - 3, ox + 32, oy + 2, 'med');
      s += TX(ox + 32, oy - 6, 'pipa masuk Ø3"', 'sub', 'font-size="3"');
      s += TX(ox + 32, oy + 34, 'SUMUR RESAPAN Ø1,00 × 1,50 m', 'noteB', 'font-size="3.6"');
      s += TX(ox + 32, oy + 37.5, 'dinding bata berlubang, isian kerikil + ijuk', 'note', 'font-size="3.2"');

      // tabel volume
      s += RC(330, oy - 26, 68, 66, 'thin', 'fill="#f5f5f5" stroke-width="0.4"');
      s += TX(333, oy - 21, 'VOLUME SANITASI', 'sub', 'text-anchor="start" font-size="3.8" fill="#eb6c36"');
      [['Septictank', '1,20 × 2,00 × 1,50 = 3,60 m³'],
        ['Biofilter media', '0,60 m³ sarang tawon'],
        ['Bidang resapan', '1,00 × 1,50 = 1,50 m²'],
        ['Sumur resapan', 'π/4 × 1,0² × 1,5 = 1,18 m³'],
        ['Bak kontrol', '0,40 × 0,40 × 0,50 × 2 = 0,16 m³'],
        ['Grease trap', '0,40 × 0,40 × 0,50 = 0,08 m³'],
        ['Pipa air kotor', 'PVC 3" ≈ 14 m, 2" ≈ 9 m'],
        ['Jarak ke batas', '≥ 2,00 m (aman)'],
        ['Jarak ke sumur', '≥ 10,00 m (aman)']].forEach((r, i) => {
          const yy = oy - 16.6 + i * 5.4;
          s += TX(333, yy, r[0], 'note', 'text-anchor="start" font-size="3.2"');
          s += TX(396, yy + 2.6, r[1], 'note', 'text-anchor="end" font-size="3.0" fill="#7a8399"');
        });
    }

    return sheet({
      judul: 'DETAIL KONSTRUKSI', sub: 'Kolom praktis, kuda-kuda, susunan lantai-dinding, serta detail sanitasi — skala 1:20 / 1:25',
      no: 'A-12', skala: '1:20 / 1:25', content: s
    });
  }

  // ============================================================
  //  DAFTAR GAMBAR
  // ============================================================
  const DAFTAR = [
    ['A-01', 'Denah Bangunan', '1:40', 'Denah + dimensi + furnitur + penanda potongan'],
    ['A-02', 'Denah Tapak & Situasi', '1:80', 'Site plan, data tapak, key plan'],
    ['A-03', 'Tampak Depan', '1:40', 'Elevasi muka + overstek + material'],
    ['A-04', 'Tampak Belakang', '1:40', 'Elevasi belakang + area servis'],
    ['A-05', 'Tampak Samping Kanan', '1:32', 'Elevasi timur + carport + tandon'],
    ['A-06', 'Potongan A-A', '1:38', 'Potongan melintang + pondasi'],
    ['A-07', 'Potongan B-B', '1:32', 'Potongan memanjang + kuda-kuda'],
    ['A-08', 'Rencana Atap', '1:40', 'Bidang atap, talang, material'],
    ['A-09', 'Rencana Pondasi & Sloof', '1:40', 'Pondasi batu belah + volume galian'],
    ['A-10', 'Rencana Plafon & Titik Lampu', '1:40', 'Plafon GRC + tata lampu'],
    ['A-11', 'Detail & Jadwal Kusen', '1:20', '8 tipe kusen + jadwal lengkap'],
    ['A-12', 'Detail Konstruksi', '1:20/1:25', 'Kolom, kuda-kuda, lantai, sanitasi'],
    ['ME-01', 'Instalasi Listrik', '1:40', 'Titik & jalur + panel grup'],
    ['ME-02', 'Instalasi Air Bersih', '1:40', 'Pipa PPR + skema hidrolik'],
    ['ME-03', 'Instalasi Air Kotor & Sanitasi', '1:40', 'Air kotor, hujan, septictank']
  ];

  return {
    denah, siteplan, tampakDepan, tampakBelakang, tampakSamping,
    potonganAA, potonganBB, rencanaAtap, rencanaPondasi, rencanaPlafon,
    instalasiListrik, airBersih, airKotor, detailKusen, detailKonstruksi,
    DAFTAR
  };
})();

if (typeof module !== 'undefined') module.exports = BP;
