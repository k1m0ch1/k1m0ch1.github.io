/* ============================================================
   render3d.js — Software renderer 3D ke <canvas> 2D
   Painter's algorithm + back-face culling + flat shading
   Tanpa dependensi eksternal.
   ============================================================ */
'use strict';

const R3D = (() => {
  const NEAR = 0.08;

  // ---------------- kamera ----------------
  function eyeOf(cam) {
    const cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
    return [
      cam.target[0] + cam.dist * cp * Math.sin(cam.yaw),
      cam.target[1] + cam.dist * sp,
      cam.target[2] + cam.dist * cp * Math.cos(cam.yaw)
    ];
  }

  function basis(cam) {
    const eye = eyeOf(cam);
    let fwd = G.norm(G.sub(cam.target, eye));
    let right = G.cross(fwd, [0, 1, 0]);
    if (G.len(right) < 1e-5) right = [1, 0, 0];
    right = G.norm(right);
    const up = G.norm(G.cross(right, fwd));
    return { eye, fwd, right, up };
  }

  // ---------------- near-plane clipping (camera space) ----------------
  function clipNear(poly, near) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const ain = a[2] >= near, bin = b[2] >= near;
      if (ain) out.push(a);
      if (ain !== bin) {
        const t = (near - a[2]) / (b[2] - a[2]);
        out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, near]);
      }
    }
    return out;
  }

  // ---------------- render utama ----------------
  function render(canvas, mesh, cam, o = {}) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const dpr = o.dpr || 1;
    const opt = Object.assign({
      selected: null, dim: 0.13, night: false, wire: false, labels: true,
      hideRoof: false, hideCeil: true, roofLift: 0, glass: true,
      cutFront: false, layers: null, showFurn: true
    }, o);

    const { eye, fwd, right, up } = basis(cam);
    const f = (H / 2) / Math.tan(G.rad(cam.fov || 42) / 2);
    const cx0 = W / 2, cy0 = H / 2;

    // ---- background ----
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    if (opt.night) { sky.addColorStop(0, '#1b2130'); sky.addColorStop(0.62, '#2a3242'); sky.addColorStop(1, '#3a4152'); }
    else { sky.addColorStop(0, '#dce6ee'); sky.addColorStop(0.55, '#eef2f4'); sky.addColorStop(1, '#e2e0d8'); }
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, H);

    // ---- sumber cahaya (key + fill + hemisphere) ----
    const L = opt.night ? G.norm([-0.35, 0.55, 0.25]) : G.norm([0.42, 0.82, 0.39]);
    const L2 = opt.night ? G.norm([0.45, 0.30, -0.60]) : G.norm([-0.62, 0.34, -0.52]);
    const AMB = opt.night ? 0.26 : 0.40;
    const DIF = opt.night ? 0.30 : 0.52;
    const FILL = opt.night ? 0.16 : 0.24;

    const cache = [];
    const lift = opt.roofLift;

    for (const face of mesh.faces) {
      if (face.hidden) continue;
      if (opt.layers && face.sys && !opt.layers[face.sys]) continue;
      if (!opt.showFurn && face.sys === 'furnitur') continue;
      if (opt.hideRoof && (face.sys === 'atap')) continue;
      if (opt.hideCeil && face.sys === 'plafon') continue;

      const isRoof = face.sys === 'atap';
      const dy = isRoof && lift ? lift : 0;

      // transform ke ruang kamera
      const cs = [];
      for (const p of face.pts) {
        const d = [p[0] - eye[0], p[1] + dy - eye[1], p[2] - eye[2]];
        cs.push([G.dot(d, right), G.dot(d, up), G.dot(d, fwd)]);
      }

      if (face.wire) {
        if (cs[0][2] < NEAR || cs[1][2] < NEAR) continue;
        const a = proj(cs[0]), b = proj(cs[1]);
        cache.push({ type: 'line', a, b, z: (cs[0][2] + cs[1][2]) / 2, color: face.color, op: face.op });
        continue;
      }

      // cut depan
      if (opt.cutFront) {
        const cz = face.pts.reduce((s, p) => s + p[2], 0) / face.pts.length;
        if (cz < 4.05 && face.sys === 'dinding') continue;
      }

      const clipped = cs.every(p => p[2] >= NEAR) ? cs : clipNear(cs, NEAR);
      if (clipped.length < 3) continue;

      // back-face culling
      if (!face.ds) {
        const mid = face.pts.reduce((s, p) => [s[0] + p[0], s[1] + p[1], s[2] + p[2]], [0, 0, 0]).map(v => v / face.pts.length);
        mid[1] += dy;
        const vd = [mid[0] - eye[0], mid[1] - eye[1], mid[2] - eye[2]];
        if (G.dot(face.n, vd) > 0) continue;
      }

      const pts = clipped.map(proj);
      let zsum = 0, zmax = -1e9;
      for (const p of clipped) { zsum += p[2]; if (p[2] > zmax) zmax = p[2]; }
      const zc = zsum / clipped.length;

      // shading — key light + fill light + term langit
      let k = AMB + DIF * Math.max(0, G.dot(face.n, L)) + FILL * Math.max(0, G.dot(face.n, L2));
      k += 0.08 * (face.n[1] * 0.5 + 0.5);
      k = Math.min(1.18, k);
      let col = G.shade(face.color, k);
      if (face.sys === 'listrik' && face.color === G.MAT.lampu) col = opt.night ? [255, 236, 170] : col;

      let op = face.op;
      if (opt.selected) {
        const isSel = face.room === opt.selected;
        const shell = face.sys === 'dinding' || face.sys === 'kusen' || face.sys === 'atap' || face.sys === 'plafon';
        if (!isSel) {
          if (face.sys === 'furnitur' || face.sys === 'dinding' || face.sys === 'lantai' || face.sys === 'plafon' ||
            face.sys === 'kusen' || face.sys === 'atap') op *= opt.dim;
        } else if (shell) {
          // dinding ruang terpilih dibuat tembus pandang agar interiornya terbaca
          op *= 0.42;
        }
      }

      cache.push({
        type: 'poly', pts, z: zc, zmax, color: col, op,
        emissive: face.sys === 'listrik' && face.color === G.MAT.lampu,
        outline: (!face.ds && face.sys !== 'atap') || face.sys === 'dinding' || face.sys === 'kusen' || face.sys === 'furnitur'
      });
    }

    // ---- urutkan jauh -> dekat ----
    cache.sort((a, b) => b.z - a.z);

    // ---- gambar ----
    ctx.lineJoin = 'round';
    for (const it of cache) {
      if (it.op <= 0.008) continue;
      ctx.globalAlpha = Math.min(1, it.op);
      if (it.type === 'line') {
        ctx.strokeStyle = rgb(it.color);
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath(); ctx.moveTo(it.a[0], it.a[1]); ctx.lineTo(it.b[0], it.b[1]); ctx.stroke();
        continue;
      }
      if (opt.wire) {
        ctx.strokeStyle = 'rgba(45,49,66,0.55)';
        ctx.lineWidth = 0.8 * dpr;
        trace(ctx, it.pts); ctx.stroke();
        continue;
      }
      const c = rgb(it.color);
      ctx.fillStyle = c;
      trace(ctx, it.pts); ctx.fill();
      if (it.outline && it.polys !== 0) {
        ctx.strokeStyle = 'rgba(45,49,66,0.28)';
        ctx.lineWidth = 0.6 * dpr;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    // ---- vignette halus ----
    const vg = ctx.createRadialGradient(cx0, cy0 * 0.9, H * 0.25, cx0, cy0, H * 0.95);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, opt.night ? 'rgba(0,0,0,0.42)' : 'rgba(45,49,66,0.10)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

    // ---- label ----
    if (opt.labels) drawLabels(ctx, mesh, cam, { eye, fwd, right, up, f }, W, H, dpr, opt);

    function proj(p) { return [cx0 + p[0] * f / p[2], cy0 - p[1] * f / p[2], p[2]]; }
    function trace(ctx, pts) {
      ctx.beginPath();
      ctx.moveTo(pts[0][0], pts[0][1]);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
      ctx.closePath();
    }
  }

  const rgb = c => 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')';

  function drawLabels(ctx, mesh, cam, B, W, H, dpr, opt) {
    const { eye, fwd, right, up, f } = B;
    const list = [];
    for (const lb of mesh.labels) {
      if (opt.layers && lb.sys && !opt.layers[lb.sys]) continue;
      const p = lb.p;
      const d = [p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]];
      const cz = G.dot(d, fwd);
      if (cz < 0.3) continue;
      const sx = W / 2 + G.dot(d, right) * f / cz;
      const sy = H / 2 - G.dot(d, up) * f / cz;
      if (sx < -80 || sx > W + 80 || sy < -40 || sy > H + 40) continue;
      list.push({ sx, sy, cz, text: lb.text, kind: lb.kind || 'room', room: lb.room });
    }
    list.sort((a, b) => b.cz - a.cz);
    for (const l of list) {
      if (opt.selected && l.room && l.room !== opt.selected) continue;
      ctx.font = (l.kind === 'room' ? 600 : 500) + ' ' + (12 * dpr) + 'px Geist, system-ui, sans-serif';
      const w = ctx.measureText(l.text).width;
      const pad = 6 * dpr, hgt = 18 * dpr;
      ctx.globalAlpha = 0.92;
      roundRect(ctx, l.sx - w / 2 - pad, l.sy - hgt / 2, w + pad * 2, hgt, 4 * dpr);
      ctx.fillStyle = l.kind === 'room' ? 'rgba(245,245,245,0.94)' : 'rgba(45,49,66,0.82)';
      ctx.fill();
      ctx.strokeStyle = l.kind === 'room' ? 'rgba(45,49,66,0.22)' : 'transparent';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = l.kind === 'room' ? '#2d3142' : '#f5f5f5';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(l.text, l.sx, l.sy + 0.5 * dpr);
      ctx.globalAlpha = 1;
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ---------------- picking ruang ----------------
  function pickRoom(canvas, mesh, cam, rooms, mx, my, dpr) {
    const W = canvas.width, H = canvas.height;
    const { eye, fwd, right, up } = basis(cam);
    const f = (H / 2) / Math.tan(G.rad(cam.fov || 42) / 2);
    const x = mx * dpr, y = my * dpr;
    let best = null, bestZ = 1e9;
    for (const r of rooms) {
      const quad = [
        [r.x0, r.jenis === 'luar' ? -0.02 : 0, r.z0],
        [r.x1, r.jenis === 'luar' ? -0.02 : 0, r.z0],
        [r.x1, r.jenis === 'luar' ? -0.02 : 0, r.z1],
        [r.x0, r.jenis === 'luar' ? -0.02 : 0, r.z1]
      ];
      const sp = [];
      let ok = true;
      for (const p of quad) {
        const d = [p[0] - eye[0], p[1] - eye[1], p[2] - eye[2]];
        const cz = G.dot(d, fwd);
        if (cz < 0.3) { ok = false; break; }
        sp.push([W / 2 + G.dot(d, right) * f / cz, H / 2 - G.dot(d, up) * f / cz, cz]);
      }
      if (!ok) continue;
      if (!inPoly(x, y, sp)) continue;
      const cz = sp.reduce((s, p) => s + p[2], 0) / 4;
      if (cz < bestZ) { bestZ = cz; best = r; }
    }
    return best;
  }

  function inPoly(x, y, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside;
    }
    return inside;
  }

  // ---------------- preset kamera ----------------
  function preset(name, mesh) {
    const base = { target: [1.5, 1.2, 6.3], yaw: 0, pitch: 0.35, dist: 20, fov: 42 };
    switch (name) {
      case 'iso':      return Object.assign(base, { target: [2.2, 0.9, 5.4], yaw: G.rad(162), pitch: G.rad(29), dist: 15.2 });
      case 'iso-back': return Object.assign(base, { target: [2.2, 1.0, 6.0], yaw: G.rad(322), pitch: G.rad(26), dist: 15.5 });
      case 'depan':    return { target: [1.5, 1.3, 6.3], yaw: 0, pitch: G.rad(6), dist: 15, fov: 34 };
      case 'belakang': return { target: [1.5, 1.3, 6.3], yaw: Math.PI, pitch: G.rad(8), dist: 15, fov: 34 };
      case 'samping':  return { target: [1.5, 1.3, 6.5], yaw: G.rad(-90), pitch: G.rad(8), dist: 15, fov: 36 };
      case 'atas':     return { target: [1.5, 0.5, 6.5], yaw: G.rad(12), pitch: G.rad(78), dist: 16, fov: 40 };
      case 'burung':   return { target: [2.6, 0.5, 6.0], yaw: G.rad(28), pitch: G.rad(46), dist: 17, fov: 44 };
      case 'tapak':    return { target: [3.0, 0, 6.0], yaw: G.rad(208), pitch: G.rad(52), dist: 20.5, fov: 46 };
      default:         return base;
    }
  }

  function roomCam(r) {
    const cx = (r.x0 + r.x1) / 2, cz = (r.z0 + r.z1) / 2;
    const span = Math.max(r.x1 - r.x0, r.z1 - r.z0);
    return { target: [cx, 0.9, cz], yaw: G.rad(36), pitch: G.rad(38), dist: Math.max(4.6, span * 2.6), fov: 46 };
  }

  return { render, pickRoom, preset, roomCam, eyeOf };
})();

if (typeof module !== 'undefined') module.exports = R3D;
