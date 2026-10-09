/* ============================================================
   scene.js — Membangun geometri 3D dari MODEL
   ============================================================ */
'use strict';

const SCENE = (() => {
  const M = MODEL, MT = G.MAT, ROOF = M.roof, CP = M.carport;
  const YT = M.YT, YB = M.YB;

  // ============================================================
  //  DAFTAR FURNITUR  (per ruang — dipakai 3D & lembar detail)
  //  format box: [material, x0, y0, z0, x1, y1, z1]
  // ============================================================
  const FURN = [
    // ---------------- TERAS ----------------
    { room: 'teras', nama: 'Kursi teras rotan 2 dudukan', spec: '1,40 × 0,55 × 0,78 m — rotan sintetis + busa',
      b: [['rotan', 0.22, 0.00, 3.18, 1.62, 0.12, 3.74], ['rotan', 0.22, 0.12, 3.70, 1.62, 0.78, 3.79],
          ['rotan', 0.22, 0.12, 3.18, 0.34, 0.58, 3.74], ['rotan', 1.50, 0.12, 3.18, 1.62, 0.58, 3.74],
          ['sofaBantal', 0.34, 0.12, 3.18, 1.50, 0.20, 3.70]] },
    { room: 'teras', nama: 'Meja teras', spec: '0,45 × 0,45 × 0,48 m — kayu jati + kaca 5 mm',
      b: [['mejaKayu', 1.90, 0.00, 3.28, 2.35, 0.44, 3.73], ['kaca', 1.86, 0.44, 3.24, 2.39, 0.48, 3.77]] },
    { room: 'teras', nama: 'Pot tanaman (2 buah)', spec: 'Pot gerabah Ø 30 cm + tanaman lidah mertua',
      b: [['pot', 2.50, 0.00, 3.10, 2.80, 0.34, 3.40], ['daunGelap', 2.55, 0.34, 3.15, 2.75, 0.86, 3.35],
          ['pot', 2.62, 0.00, 3.52, 2.92, 0.30, 3.82], ['daun', 2.67, 0.30, 3.57, 2.87, 0.72, 3.77]] },
    { room: 'teras', nama: 'Keset kaki + lampu dinding', spec: 'Keset microfiber 0,70 × 0,45 m; 2 × lampu dinding 7 W',
      b: [['karpet', 0.32, 0.00, 3.44, 1.02, 0.02, 3.80], ['lampu', 0.60, 2.10, 3.83, 0.75, 2.35, 3.86],
          ['lampu', 2.40, 2.10, 3.83, 2.55, 2.35, 3.86]] },

    // ---------------- RUANG TAMU / KELUARGA ----------------
    { room: 'tamu', nama: 'Sofa bed 2 dudukan', spec: 'Dibuka menjadi 1,90 × 1,40 m. Rangka kayu + busa D32.',
      b: [['sofa', 0.20, 0.10, 5.20, 1.70, 0.42, 5.90], ['sofa', 0.20, 0.42, 5.80, 1.70, 0.86, 5.90],
          ['sofa', 0.20, 0.42, 5.20, 0.34, 0.62, 5.90], ['sofa', 1.56, 0.42, 5.20, 1.70, 0.62, 5.90],
          ['sofaBantal', 0.36, 0.42, 5.24, 0.92, 0.52, 5.82], ['sofaBantal', 0.98, 0.42, 5.24, 1.54, 0.52, 5.82],
          ['kayuGelap', 0.24, 0.00, 5.24, 0.30, 0.10, 5.30], ['kayuGelap', 1.60, 0.00, 5.24, 1.66, 0.10, 5.30],
          ['kayuGelap', 0.24, 0.00, 5.80, 0.30, 0.10, 5.86], ['kayuGelap', 1.60, 0.00, 5.80, 1.66, 0.10, 5.86]] },
    { room: 'tamu', nama: 'Meja serbaguna (makan/kerja)', spec: '0,70 × 0,55 m, tinggi adjustable 0,45–0,72 m',
      b: [['mejaKayu', 0.40, 0.70, 4.38, 1.10, 0.74, 4.93], ['kayuGelap', 0.44, 0.00, 4.42, 0.50, 0.70, 4.48],
          ['kayuGelap', 1.00, 0.00, 4.42, 1.06, 0.70, 4.48], ['kayuGelap', 0.44, 0.00, 4.83, 0.50, 0.70, 4.89],
          ['kayuGelap', 1.00, 0.00, 4.83, 1.06, 0.70, 4.89]] },
    { room: 'tamu', nama: 'Kursi lipat (2 buah)', spec: '0,40 × 0,42 × 0,85 m — rangka besi + dudukan kayu',
      b: [['kayuMuda', 1.30, 0.44, 4.46, 1.72, 0.48, 4.88], ['bajaGelap', 1.30, 0.00, 4.46, 1.34, 0.44, 4.50],
          ['bajaGelap', 1.68, 0.00, 4.46, 1.72, 0.44, 4.50], ['bajaGelap', 1.30, 0.00, 4.84, 1.34, 0.44, 4.88],
          ['bajaGelap', 1.68, 0.00, 4.84, 1.72, 0.44, 4.88],
          ['kayuMuda', 0.56, 0.44, 5.04, 0.98, 0.48, 5.46], ['bajaGelap', 0.56, 0.00, 5.04, 0.60, 0.44, 5.08],
          ['bajaGelap', 0.94, 0.00, 5.04, 0.98, 0.44, 5.08], ['bajaGelap', 0.56, 0.00, 5.42, 0.60, 0.44, 5.46],
          ['bajaGelap', 0.94, 0.00, 5.42, 0.98, 0.44, 5.46]] },
    { room: 'tamu', nama: 'Konsol TV + TV LED 32"', spec: 'Konsol 1,10 × 0,35 × 0,42 m; TV bracket dinding',
      b: [['kayuGelap', 0.20, 0.06, 4.00, 1.30, 0.42, 4.35], ['bajaGelap', 0.20, 0.00, 4.00, 0.26, 0.06, 4.06],
          ['bajaGelap', 1.24, 0.00, 4.00, 1.30, 0.06, 4.06], ['tv', 0.38, 0.78, 4.00, 1.14, 1.46, 4.05],
          ['tvLayar', 0.42, 0.82, 4.045, 1.10, 1.42, 4.052]] },
    { room: 'tamu', nama: 'Niche kulkas 1 pintu', spec: '0,55 × 0,58 × 1,50 m — hemat energi 1 pintu, defrost manual',
      b: [['kulkas', 2.32, 0.02, 4.02, 2.88, 1.52, 4.58], ['baja', 2.60, 0.90, 4.56, 2.86, 0.94, 4.60],
          ['baja', 2.36, 1.20, 4.56, 2.40, 1.40, 4.60]] },
    { room: 'tamu', nama: 'Rak dinding 2 tingkat', spec: '0,55 × 0,25 m per tingkat — hollow + kayu solid',
      b: [['kayuMuda', 2.34, 1.42, 5.58, 2.89, 1.48, 5.83], ['kayuMuda', 2.34, 1.98, 5.58, 2.89, 2.04, 5.83],
          ['baja', 2.36, 1.48, 5.60, 2.40, 1.98, 5.64], ['baja', 2.83, 1.48, 5.60, 2.87, 1.98, 5.64]] },
    { room: 'tamu', nama: 'Karpet ruang tamu', spec: '1,60 × 1,30 m — polypropylene, anti-slip',
      b: [['karpet', 0.18, 0.00, 4.40, 1.78, 0.02, 5.70]] },
    { room: 'tamu', nama: 'Lampu plafon + saklar', spec: 'LED 18 W 3000K + saklar ganda',
      b: [['lampu', 1.42, 2.74, 4.86, 1.58, 2.80, 5.02]] },

    // ---------------- KORIDOR ----------------
    { room: 'koridor', nama: 'Rak sepatu gantung 3 tingkat', spec: '0,70 × 0,28 × 0,90 m — tidak menyentuh lantai',
      b: [['kayuMuda', 0.09, 0.22, 6.20, 0.37, 0.26, 6.94], ['kayuMuda', 0.09, 0.56, 6.20, 0.37, 0.60, 6.94],
          ['kayuMuda', 0.09, 0.90, 6.20, 0.37, 0.94, 6.94], ['baja', 0.09, 0.26, 6.22, 0.13, 0.90, 6.26],
          ['baja', 0.09, 0.26, 6.88, 0.13, 0.90, 6.92]] },
    { room: 'koridor', nama: 'Cermin badan dinding', spec: '0,45 × 1,50 m — cermin 5 mm + frame aluminium',
      b: [['baja', 0.08, 0.20, 7.10, 0.105, 1.72, 7.58], ['cermin', 0.105, 0.22, 7.12, 0.115, 1.70, 7.56]] },
    { room: 'koridor', nama: 'Downlight koridor (2 titik)', spec: 'LED 9 W 3000K recessed',
      b: [['lampu', 0.42, 2.76, 6.94, 0.54, 2.80, 7.06], ['lampu', 0.42, 2.76, 7.84, 0.54, 2.80, 7.96]] },

    // ---------------- KAMAR TIDUR ----------------
    { room: 'kamar', nama: 'Kasur 120 × 200 + dipan rendah', spec: 'Dipan kayu jati 0,22 m, kasur busa pegas 20 cm',
      b: [['dipan', 1.02, 0.12, 6.20, 2.22, 0.32, 8.20], ['kasur', 1.04, 0.32, 6.22, 2.20, 0.56, 8.18],
          ['bantal', 1.10, 0.56, 6.30, 1.54, 0.70, 6.70], ['bantal', 1.70, 0.56, 6.30, 2.14, 0.70, 6.70],
          ['selimut', 1.04, 0.56, 7.02, 2.20, 0.64, 8.18],
          ['kayuGelap', 1.06, 0.00, 6.24, 1.12, 0.12, 6.30], ['kayuGelap', 2.12, 0.00, 6.24, 2.18, 0.12, 6.30],
          ['kayuGelap', 1.06, 0.00, 8.10, 1.12, 0.12, 8.16], ['kayuGelap', 2.12, 0.00, 8.10, 2.18, 0.12, 8.16]] },
    { room: 'kamar', nama: 'Kepala tempat tidur (headboard)', spec: 'Kayu lapis HPL 1,24 × 1,05 m, ada rak gantung',
      b: [['kayuMuda', 1.00, 0.12, 6.10, 2.24, 1.05, 6.18], ['kayuMuda', 1.00, 1.10, 6.10, 2.24, 1.16, 6.32]] },
    { room: 'kamar', nama: 'Lemari pakaian 2 pintu', spec: '0,62 × 0,60 × 2,10 m — 1 laci + gantungan + rak atas',
      b: [['lemari', 2.30, 0.00, 7.82, 2.92, 2.10, 8.42], ['kayuGelap', 2.60, 0.02, 7.81, 2.64, 2.08, 7.825],
          ['baja', 2.50, 0.98, 7.81, 2.74, 1.32, 7.83]] },
    { room: 'kamar', nama: 'Meja multifungsi + stool', spec: 'Meja 0,62 × 0,42 m di bawah jendela; stool 0,34 m',
      b: [['mejaKayu', 2.28, 0.72, 6.14, 2.90, 0.75, 6.56], ['baja', 2.31, 0.00, 6.17, 2.35, 0.72, 6.21],
          ['baja', 2.83, 0.00, 6.17, 2.87, 0.72, 6.21], ['baja', 2.31, 0.00, 6.49, 2.35, 0.72, 6.53],
          ['baja', 2.83, 0.00, 6.49, 2.87, 0.72, 6.53],
          ['kayuMuda', 2.42, 0.42, 6.62, 2.76, 0.46, 6.96], ['bajaGelap', 2.44, 0.00, 6.64, 2.48, 0.42, 6.68],
          ['bajaGelap', 2.70, 0.00, 6.64, 2.74, 0.42, 6.68], ['bajaGelap', 2.44, 0.00, 6.90, 2.48, 0.42, 6.94],
          ['bajaGelap', 2.70, 0.00, 6.90, 2.74, 0.42, 6.94]] },
    { room: 'kamar', nama: 'Rak gantung dinding', spec: '0,62 × 0,22 m — 1 tingkat + gantungan baju',
      b: [['kayuMuda', 2.30, 1.62, 6.20, 2.92, 1.68, 6.42], ['baja', 2.32, 1.68, 6.22, 2.36, 1.90, 6.26],
          ['baja', 2.86, 1.68, 6.22, 2.90, 1.90, 6.26]] },
    { room: 'kamar', nama: 'AC 1/2 PK (opsional)', spec: 'Split wall 1/2 PK — indoor di dinding utara',
      b: [['kulkas', 2.40, 2.34, 8.06, 2.90, 2.62, 8.30], ['baja', 2.44, 2.30, 8.08, 2.86, 2.34, 8.28]] },
    { room: 'kamar', nama: 'Lampu gantung + downlight', spec: 'Lampu gantung 12 W + 1 downlight 9 W',
      b: [['lampu', 1.90, 2.42, 7.16, 2.06, 2.80, 7.32], ['lampu', 2.62, 2.76, 6.42, 2.74, 2.80, 6.54]] },

    // ---------------- DAPUR ----------------
    { room: 'dapur', nama: 'Kitchen set bawah (single line)', spec: '1,25 × 0,60 × 0,85 m — rangka PVC, top table granit hitam',
      b: [['kayuMuda', 0.10, 0.10, 8.62, 0.68, 0.83, 9.87], ['baja', 0.10, 0.00, 8.66, 0.14, 0.10, 8.70],
          ['baja', 0.10, 0.00, 9.79, 0.14, 0.10, 9.83], ['baja', 0.64, 0.00, 8.66, 0.68, 0.10, 8.70],
          ['baja', 0.64, 0.00, 9.79, 0.68, 0.10, 9.83],
          ['kayuBakar', 0.08, 0.83, 8.60, 0.71, 0.89, 9.89], ['baja', 0.34, 0.84, 8.62, 0.38, 0.885, 9.06]] },
    { room: 'dapur', nama: 'Sink stainless + keran', spec: 'Bak cuci tunggal 0,48 × 0,40 m — stainless 304',
      b: [['steel', 0.13, 0.86, 9.28, 0.63, 0.895, 9.80], ['baja', 0.17, 0.845, 9.32, 0.59, 0.875, 9.76],
          ['steel', 0.30, 0.89, 9.80, 0.36, 1.14, 9.85]] },
    { room: 'dapur', nama: 'Kompor tanam 2 tungku', spec: '0,58 × 0,36 m — stainless, kaca tempered',
      b: [['kompor', 0.16, 0.89, 8.70, 0.62, 0.925, 9.12], ['steel', 0.24, 0.925, 8.78, 0.42, 0.935, 8.96],
          ['steel', 0.24, 0.925, 9.02, 0.42, 0.935, 9.20]] },
    { room: 'dapur', nama: 'Kabinet atas + rak bumbu', spec: '1,10 × 0,35 × 0,70 m, tinggi 1,60 m dari lantai',
      b: [['kayuMuda', 0.09, 1.60, 8.66, 0.44, 2.30, 9.76], ['baja', 0.30, 1.62, 8.68, 0.42, 1.66, 9.74],
          ['baja', 0.09, 1.62, 9.74, 0.44, 1.66, 9.80]] },
    { room: 'dapur', nama: 'Kulkas 1 pintu (sudut utara)', spec: '0,50 × 0,55 × 1,20 m — kapasitas 150 L',
      b: [['kulkas', 1.05, 0.00, 9.38, 1.55, 1.20, 9.92], ['baja', 1.22, 0.72, 9.36, 1.38, 0.76, 9.38],
          ['baja', 1.48, 0.55, 9.36, 1.52, 0.90, 9.385]] },
    { room: 'dapur', nama: 'Gantungan alat masak + rak dinding', spec: 'Batang besi 0,60 m + 3 kait',
      b: [['baja', 0.09, 1.45, 9.10, 0.14, 1.49, 9.70]] },
    { room: 'dapur', nama: 'Lampu plafon dapur', spec: 'LED 12 W 4000K + exhaust fan 8"',
      b: [['lampu', 0.78, 2.74, 9.14, 0.94, 2.80, 9.30], ['baja', 1.20, 1.70, 9.92, 1.46, 1.95, 9.95]] },

    // ---------------- KAMAR MANDI ----------------
    { room: 'mandi', nama: 'Kloset duduk monoblock', spec: '0,38 × 0,70 m — dual flush 3/6 L, jarak dinding 0,30 m',
      b: [['keramikSan', 2.56, 0.10, 8.84, 2.91, 0.42, 9.28], ['keramikSan', 2.55, 0.40, 8.82, 2.91, 0.45, 9.30],
          ['keramikSan', 2.68, 0.45, 8.82, 2.91, 0.86, 9.32], ['steel', 2.62, 0.86, 8.84, 2.72, 0.90, 9.30]] },
    { room: 'mandi', nama: 'Shower set + partisi kaca', spec: 'Shower 0,80 × 0,80 m — kaca tempered 8 mm, floor drain',
      b: [['kaca', 1.78, 0.06, 9.10, 2.48, 2.00, 9.13], ['baja', 1.76, 0.00, 9.08, 2.50, 0.06, 9.15],
          ['steel', 2.42, 1.90, 9.88, 2.48, 1.96, 9.92], ['steel', 2.40, 1.10, 9.88, 2.46, 1.92, 9.92],
          ['steel', 2.20, 0.00, 9.86, 2.26, 1.95, 9.91],
          ['baja', 2.10, 0.00, 9.40, 2.22, 0.02, 9.52], ['baja', 1.85, 0.00, 9.60, 1.97, 0.02, 9.72]] },
    { room: 'mandi', nama: 'Wastafel gantung + keran + cermin', spec: '0,40 × 0,35 m gantung tinggi 0,80 m',
      b: [['keramikSan', 2.46, 0.76, 9.52, 2.90, 0.86, 9.88], ['steel', 2.62, 0.86, 9.84, 2.70, 1.06, 9.88],
          ['cermin', 2.52, 1.10, 9.90, 2.88, 1.62, 9.92], ['baja', 2.50, 0.60, 9.86, 2.86, 0.74, 9.90]] },
    { room: 'mandi', nama: 'Keramik dinding basah', spec: '20 × 40 cm glossy setinggi 2,10 m + list border',
      b: [['keramikMandi', 1.73, 0.00, 9.94, 2.93, 2.10, 9.99], ['keramikMandi', 2.90, 0.00, 8.58, 2.99, 2.10, 9.99],
          ['keramikMandi', 1.66, 0.00, 8.58, 1.72, 2.10, 9.99], ['keramikMandi', 1.73, 0.00, 9.09, 2.93, 2.10, 9.13]] },
    { room: 'mandi', nama: 'Lampu KM IP44 + exhaust fan 6"', spec: 'LED 12 W IP44 + exhaust 6" dengan timer',
      b: [['lampu', 2.22, 2.66, 9.14, 2.38, 2.72, 9.30], ['baja', 2.10, 1.90, 9.90, 2.35, 2.15, 9.95]] }
  ];

  // ============================================================
  //  Bangun geometri
  // ============================================================
  function build(opts = {}) {
    const mesh = new G.Mesh();
    const opt = Object.assign({
      varianKM: 'servis', struktur: false, site: true, mep: null, plafon: false
    }, opts);

    buildGround(mesh, opt);
    buildSiteObjects(mesh, opt);
    buildFloors(mesh, opt);
    if (opt.struktur) buildStructure(mesh, opt);
    buildWalls(mesh, opt);
    buildOpenings(mesh, opt);
    buildPlafon(mesh, opt);
    buildRoof(mesh, opt);
    buildCarport(mesh, opt);
    buildFurniture(mesh, opt);
    if (opt.mep) buildMEP(mesh, opt);
    return mesh;
  }

  // ---------- segmen dinding generik ----------
  function wallSeg(mesh, w, u0, u1, y0, y1, color, o) {
    if (u1 - u0 < 0.004 || y1 - y0 < 0.004) return;
    if (w.dir === 'x') mesh.box(u0, y0, w.at - w.t / 2, u1, y1, w.at + w.t / 2, color, o);
    else mesh.box(w.at - w.t / 2, y0, u0, w.at + w.t / 2, y1, u1, color, o);
  }

  function buildWalls(mesh, opt) {
    for (const w of M.walls) {
      const col = MT[w.mat] || MT.dinding;
      const o = { sys: 'dinding', room: roomOfWall(w) };
      // bukaan aktif
      const ops = w.openings
        .filter(o => !o.varian || o.varian === opt.varianKM)
        .slice().sort((a, b) => a.a - b.a);
      let cur = w.a;
      for (const op of ops) {
        wallSeg(mesh, w, cur, op.a, 0, w.h, col, o);
        if (op.sill > 0) wallSeg(mesh, w, op.a, op.b, 0, op.sill, col, o);
        if (op.head < w.h) wallSeg(mesh, w, op.a, op.b, op.head, w.h, col, o);
        cur = op.b;
      }
      wallSeg(mesh, w, cur, w.b, 0, w.h, col, o);

      // hiasan sudut / architrave tipis agar dinding terbaca
      for (const op of ops) {
        const t = w.t + 0.012;
        const kc = MT.kusenPutih;
        if (w.dir === 'x') {
          mesh.box(op.a - 0.03, op.sill - 0.03, w.at - t / 2, op.a, op.head + 0.03, w.at + t / 2, kc, { sys: 'kusen' });
          mesh.box(op.b, op.sill - 0.03, w.at - t / 2, op.b + 0.03, op.head + 0.03, w.at + t / 2, kc, { sys: 'kusen' });
          mesh.box(op.a, op.head, w.at - t / 2, op.b, op.head + 0.03, w.at + t / 2, kc, { sys: 'kusen' });
        } else {
          mesh.box(w.at - t / 2, op.sill - 0.03, op.a - 0.03, w.at + t / 2, op.head + 0.03, op.a, kc, { sys: 'kusen' });
          mesh.box(w.at - t / 2, op.sill - 0.03, op.b, w.at + t / 2, op.head + 0.03, op.b + 0.03, kc, { sys: 'kusen' });
          mesh.box(w.at - t / 2, op.head, op.a, w.at + t / 2, op.head + 0.03, op.b, kc, { sys: 'kusen' });
        }
      }
    }
  }

  function roomOfWall(w) {
    // tebak ruang dominan untuk keperluan highlight
    const map = { W1: 'tamu', W2: 'dapur', W3: 'teras', W4: 'kamar', W5: 'kamar', W6: 'kamar', W7: 'dapur', W8: 'mandi' };
    return map[w.id] || null;
  }

  // ---------- kusen, daun pintu, kaca, jalusi ----------
  function buildOpenings(mesh, opt) {
    for (const w of M.walls) {
      for (const op of w.openings) {
        if (op.varian && op.varian !== opt.varianKM) continue;
        const kc = MT.kusen, wc = 0.06, kt = w.t * 0.7;

        if (w.dir === 'x') buildOpeningAt(mesh, op, 'x', w.at, kt);
        else buildOpeningAt(mesh, op, 'z', w.at, kt);
      }
    }
  }

  function buildOpeningAt(mesh, op, axis, at, kt) {
    const w = op.b - op.a, h = op.head - op.sill;
    const putar = (a, b, y0, y1, ww) => ww;
    const B = (u0, y0, t0, u1, y1, t1, col, o) => {
      if (axis === 'x') mesh.box(u0, y0, at + t0, u1, y1, at + t1, col, o);
      else mesh.box(at + t0, y0, u0, at + t1, y1, u1, col, o);
    };
    const col = op.kusen === 'aluminium' ? MT.kusenPutih : MT.kusen;
    const o = { sys: 'kusen' };

    if (op.jns === 'lubang') return;

    if (op.jns === 'pintu') {
      // kusen 3 sisi
      B(op.a, op.sill, -kt / 2, op.a + 0.05, op.head, kt / 2, col, o);
      B(op.b - 0.05, op.sill, -kt / 2, op.b, op.head, kt / 2, col, o);
      B(op.a, op.head - 0.05, -kt / 2, op.b, op.head, kt / 2, col, o);
      // ambang
      B(op.a, 0, -kt / 2, op.b, 0.02, kt / 2, MT.keramikSan, o);
      // daun pintu terbuka 35°
      const leafCol = op.kusen === 'pvc' ? MT.pintuPutih : MT.daunPintu;
      const th = 0.035, lw = w - 0.04;
      const sign = op.buka && op.buka.indexOf('keluar') >= 0 ? -1 : 1;
      const hingeAtB = op.buka && op.buka.indexOf('kanan') >= 0;
      const hx = hingeAtB ? op.b - 0.03 : op.a + 0.03;
      const ang = sign * G.rad(38);
      const dirs = hingeAtB ? -1 : 1;
      const pts = [];
      const t = 0;
      // panel pada bidang dinding lalu diputar
      const bx0 = hx, bx1 = hx + dirs * lw;
      const rot = (p) => {
        const dx = p[0] - hx, dz = p[1] - at;
        const c = Math.cos(ang), s = Math.sin(ang);
        return [hx + dx * c - dz * s, at + dx * s + dz * c];
      };
      const q = [[bx0, at - th / 2], [bx1, at - th / 2], [bx1, at + th / 2], [bx0, at + th / 2]].map(rot);
      const bot = q.map(p => axis === 'x' ? [p[0], op.sill + 0.02, p[1]] : [p[1], op.sill + 0.02, p[0]]);
      const top = q.map(p => axis === 'x' ? [p[0], op.head - 0.03, p[1]] : [p[1], op.head - 0.03, p[0]]);
      mesh.poly(top, leafCol, o); mesh.poly(bot.slice().reverse(), leafCol, o);
      for (let i = 0; i < 4; i++) {
        const j = (i + 1) % 4;
        mesh.poly([bot[i], bot[j], top[j], top[i]], leafCol, { ds: true });
      }
      // handle
      const hp = rot([bx1 - dirs * 0.08, at - 0.07]);
      B(hp[0] - 0.01, 1.05, -0.03, hp[0] + 0.01, 1.05, 0.03, MT.baja, o);
      return;
    }

    // ---- jendela ----
    // kusen luar
    B(op.a, op.sill, -kt / 2, op.a + 0.05, op.head, kt / 2, col, o);
    B(op.b - 0.05, op.sill, -kt / 2, op.b, op.head, kt / 2, col, o);
    B(op.a, op.sill, -kt / 2, op.b, op.sill + 0.05, kt / 2, col, o);
    B(op.a, op.head - 0.05, -kt / 2, op.b, op.head, kt / 2, col, o);
    // ambang bawah + atas
    B(op.a - 0.04, op.sill - 0.03, -0.10, op.b + 0.04, op.sill, 0.10, MT.keramikSan, o);
    B(op.a - 0.04, op.head, -0.10, op.b + 0.04, op.head + 0.03, 0.10, MT.keramikSan, o);
    // kaca
    B(op.a + 0.04, op.sill + 0.04, -0.012, op.b - 0.04, op.head - 0.04, 0.012, MT.kaca, { sys: 'kusen', op: 0.42 });
    // daun geser: dua bingkai tipis
    const mid = (op.a + op.b) / 2;
    B(op.a + 0.05, op.sill + 0.05, -0.03, mid + 0.02, op.head - 0.05, -0.015, col, o);
    B(mid - 0.02, op.sill + 0.05, 0.015, op.b - 0.05, op.head - 0.05, 0.03, col, o);
    // jalusi / teralis
    for (let i = 1; i <= 4; i++) {
      const yy = op.sill + (op.head - op.sill) * i / 5;
      B(op.a + 0.03, yy - 0.008, 0.035, op.b - 0.03, yy + 0.008, 0.05, MT.besi, o);
    }
  }

  // ---------- lantai ----------
  function buildFloors(mesh, opt) {
    for (const r of M.rooms) {
      const c = MT[r.lantai] || MT.keramik;
      const luar = r.jenis === 'luar';
      const y = luar ? -0.02 : 0.0;
      mesh.box(r.x0, y - 0.10, r.z0, r.x1, y, r.z1, c, { room: r.id, sys: 'lantai' });
      // plint / skirting untuk ruang dalam
      if (!luar) {
        const t = 0.10, hh = 0.10;
        mesh.box(r.x0, 0, r.z0, r.x0 + t, hh, r.z1, MT.kayuGelap, { room: r.id, sys: 'lantai' });
        mesh.box(r.x1 - t, 0, r.z0, r.x1, hh, r.z1, MT.kayuGelap, { room: r.id, sys: 'lantai' });
        mesh.box(r.x0, 0, r.z0, r.x1, hh, r.z0 + t, MT.kayuGelap, { room: r.id, sys: 'lantai' });
        mesh.box(r.x0, 0, r.z1 - t, r.x1, hh, r.z1, MT.kayuGelap, { room: r.id, sys: 'lantai' });
      }
    }
  }

  // ---------- plafon (opsional) ----------
  function buildPlafon(mesh, opt) {
    if (!opt.plafon) return;
    for (const r of M.rooms) {
      if (r.jenis === 'luar') continue;
      const gh = r.id === 'mandi' ? 2.60 : M.H;
      mesh.box(r.x0, gh, r.z0, r.x1, gh + 0.06, r.z1, MT.dindingDalam, { room: r.id, sys: 'plafon', ds: true });
    }
  }

  // ---------- atap ----------
  function buildRoof(mesh, opt) {
    const R = ROOF, ang = G.rad(R.sudut);
    const yW = R.yeave, yE = R.yeave, yR = R.yridge;
    const o = { sys: 'atap' };

    // bidang barat & timur — dipecah memanjang agar pengurutan kedalaman akurat
    const NS = 8;
    for (let i = 0; i < NS; i++) {
      const t0 = i / NS, t1 = (i + 1) / NS;
      const za = G.lerp(R.zFront, R.zBack, t0), zb = G.lerp(R.zFront, R.zBack, t1);
      mesh.ramp([R.eaveW, yW, za], [R.eaveW, yW, zb], [R.ridgeX, yR, za], [R.ridgeX, yR, zb],
        0.07, MT.genteng, o);
      mesh.ramp([R.eaveE, yE, za], [R.eaveE, yE, zb], [R.ridgeX, yR, za], [R.ridgeX, yR, zb],
        0.07, MT.gentengTop, o);
    }

    // nok (menutup pertemuan dua bidang atap)
    for (let i = 0; i < NS; i++) {
      const za = G.lerp(R.zFront, R.zBack, i / NS), zb = G.lerp(R.zFront, R.zBack, (i + 1) / NS);
      mesh.box(R.ridgeX - 0.17, R.yridge - 0.04, za, R.ridgeX + 0.17, R.yridge + 0.16, zb, MT.nok, o);
    }

    // lisplang horizontal barat & timur
    mesh.box(R.eaveW - 0.03, R.yeave - 0.24, R.zFront, R.eaveW + 0.03, R.yeave + 0.02, R.zBack, MT.lisplang, o);
    mesh.box(R.eaveE - 0.03, R.yeave - 0.24, R.zFront, R.eaveE + 0.03, R.yeave + 0.02, R.zBack, MT.lisplang, o);

    // lisplang miring (rake board) depan & belakang, dua sisi
    const rake = (z, off) => {
      for (const s of [1, -1]) {
        const x0 = s > 0 ? R.eaveW : R.eaveE, x1 = R.ridgeX;
        const y0 = R.yeave, y1 = R.yridge;
        const n = 10;
        for (let i = 0; i < n; i++) {
          const t0 = i / n, t1 = (i + 1) / n;
          const ax = G.lerp(x0, x1, t0), ay = G.lerp(y0, y1, t0);
          const bx = G.lerp(x0, x1, t1), by = G.lerp(y0, y1, t1);
          mesh.poly([[ax, ay, z + off], [bx, by, z + off], [bx, by - 0.22, z + off], [ax, ay - 0.22, z + off]],
            MT.lisplang, { sys: 'atap', ds: true });
        }
      }
    };
    rake(R.zFront, -0.035); rake(R.zFront, 0.035);
    rake(R.zBack, -0.035); rake(R.zBack, 0.035);

    // talang datar sisi barat
    mesh.box(R.eaveW - 0.16, R.yeave - 0.10, R.zFront + 0.10, R.eaveW + 0.02, R.yeave - 0.02, R.zBack - 0.10,
      MT.talang, o);
    mesh.box(R.eaveW - 0.07, YT, R.zBack - 0.30, R.eaveW - 0.01, R.yeave - 0.10, R.zBack - 0.22, MT.talang, o);

    // timpak / gevel depan-belakang (pentagon mengikuti bidang atap)
    const pent = [
      [0.00, M.H], [3.00, M.H], [3.00, R.yWallE], [R.ridgeX, R.yridge], [0.00, R.yWallW]
    ];
    mesh.extrudeXY(pent, 3.825, 3.975, MT.dinding, { sys: 'dinding', room: 'tamu' });
    mesh.extrudeXY(pent.map(p => [3.00 - p[0], p[1]]).reverse(), 9.925, 10.075, MT.dinding, { sys: 'dinding', room: 'dapur' });

    // balok teras + kolom
    mesh.box(0.00, 2.62, 3.00, 3.00, 2.80, 3.16, MT.beton, { sys: 'struktur', room: 'teras' });
    mesh.box(0.00, 2.62, 3.16, 0.15, 2.80, 3.90, MT.beton, { sys: 'struktur', room: 'teras' });
    mesh.box(2.85, 0.00, 3.00, 3.00, 2.80, 3.15, MT.beton, { sys: 'struktur', room: 'teras' });
  }

  // ---------- carport ----------
  function buildCarport(mesh, opt) {
    const o = { sys: 'carport' };
    const MP = 4;
    for (let i = 0; i < MP; i++) {
      const za = G.lerp(CP.z0, CP.z1, i / MP), zb = G.lerp(CP.z0, CP.z1, (i + 1) / MP);
      mesh.ramp([3.05, CP.yW, za], [3.05, CP.yW, zb], [5.95, CP.yE, za], [5.95, CP.yE, zb],
        0.05, MT.spandek, o);
    }
    // lisplang
    mesh.box(3.00, CP.yW - 0.20, CP.z0 - 0.03, 5.98, CP.yW + 0.02, CP.z0 + 0.03, MT.lisplang, o);
    mesh.box(3.00, CP.yW - 0.20, CP.z1 - 0.03, 5.98, CP.yW + 0.02, CP.z1 + 0.03, MT.lisplang, o);
    mesh.box(5.95, CP.yE - 0.20, CP.z0 - 0.03, 6.00, CP.yE + 0.02, CP.z1 + 0.03, MT.lisplang, o);
    // tiang
    for (const [tx, tz] of CP.tiang) {
      mesh.box(tx - 0.06, 0.00, tz - 0.06, tx + 0.06, CP.yE - 0.05, tz + 0.06, MT.bajaGelap, o);
      mesh.box(tx - 0.10, -0.10, tz - 0.10, tx + 0.10, 0.04, tz + 0.10, MT.beton, o);
    }
    // balok pengikat
    mesh.box(3.00, CP.yW - 0.14, CP.z0 - 0.05, 5.98, CP.yW - 0.02, CP.z0 + 0.05, MT.bajaGelap, o);
    mesh.box(5.90, CP.yE - 0.14, CP.z0 - 0.05, 5.98, CP.yE - 0.02, CP.z1 + 0.05, MT.bajaGelap, o);
    mesh.box(3.00, CP.yW - 0.14, CP.z1 - 0.05, 5.98, CP.yE - 0.02, CP.z1 + 0.05, MT.bajaGelap, o);
    // talang carport
    mesh.box(5.98, CP.yE - 0.06, CP.z0, 6.06, CP.yE + 0.02, CP.z1, MT.talang, o);
  }

  // ---------- struktur (pondasi, sloof, kolom, ring balok, lantai) ----------
  function buildStructure(mesh, opt) {
    const o = { sys: 'pondasi' };
    const T = M.T;
    const segs = [];
    for (const w of M.walls) segs.push({ dir: w.dir, at: w.at, a: w.a, b: w.b });

    for (const s of segs) {
      // lubang galian & urugan
      const tw = 0.90;
      if (s.dir === 'x') mesh.box(s.a, YB - 0.10, s.at - tw / 2, s.b, YB, s.at + tw / 2, MT.tanah, { ...o, op: 0.35 });
      else mesh.box(s.at - tw / 2, YB - 0.10, s.a, s.at + tw / 2, YB, s.b, MT.tanah, { ...o, op: 0.35 });
      // pasir urug + aanstamping
      const p = (y0, y1, ww, col, sys) => {
        if (s.dir === 'x') mesh.box(s.a, y0, s.at - ww / 2, s.b, y1, s.at + ww / 2, col, { sys });
        else mesh.box(s.at - ww / 2, y0, s.a, s.at + ww / 2, y1, s.b, col, { sys });
      };
      p(YB - 0.10, YB, 0.80, MT.paving, 'pondasi');
      p(YB, YB + 0.15, 0.75, MT.batuKali, 'pondasi');
      // pondasi batu kali trapesium
      const trap = [[-0.30, YB + 0.15], [0.30, YB + 0.15], [0.125, -0.20], [-0.125, -0.20]];
      const pts = s.dir === 'x'
        ? trap.map(q => [s.at + q[0], q[1]])
        : trap.map(q => [s.at + q[0], q[1]]);
      // gambar sebagai 3 lapis box agar ringan
      const band = (y0, y1, w0, w1) => {
        if (s.dir === 'x') mesh.box(s.a, y0, s.at - w1 / 2, s.b, y1, s.at + w1 / 2, MT.batuKali, { sys: 'pondasi' });
        else mesh.box(s.at - w1 / 2, y0, s.a, s.at + w1 / 2, y1, s.b, MT.batuKali, { sys: 'pondasi' });
      };
      band(YB + 0.15, YB + 0.37, 0.60, 0.60);
      band(YB + 0.37, YB + 0.59, 0.44, 0.44);
      band(YB + 0.59, -0.20, 0.28, 0.28);
      // sloof 15/20
      if (s.dir === 'x') mesh.box(s.a, -0.25, s.at - T / 2, s.b, -0.05, s.at + T / 2, MT.sloof, { sys: 'struktur' });
      else mesh.box(s.at - T / 2, -0.25, s.a, s.at + T / 2, -0.05, s.b, MT.sloof, { sys: 'struktur' });
      // ring balok 15/20
      if (s.dir === 'x') mesh.box(s.a, 2.60, s.at - T / 2, s.b, 2.80, s.at + T / 2, MT.beton, { sys: 'struktur' });
      else mesh.box(s.at - T / 2, 2.60, s.a, s.at + T / 2, 2.80, s.b, MT.beton, { sys: 'struktur' });
    }

    // kolom praktis pada pertemuan dinding
    const kol = [
      [0.00, 3.00], [0.95, 6.00], [0.95, 8.50], [1.65, 8.50], [1.65, 10.00],
      [3.00, 6.00], [3.00, 8.50], [3.00, 10.00], [0.00, 6.00], [0.00, 8.50],
      [0.00, 10.00], [0.47, 8.50], [2.30, 8.50], [3.00, 3.90]
    ];
    for (const [kx, kz] of kol) {
      mesh.box(kx - 0.075, -0.05, kz - 0.075, kx + 0.075, 2.60, kz + 0.075, MT.beton, { sys: 'struktur', op: 0.95 });
      for (let i = 0; i < 4; i++) {
        const ox = (i % 2 ? 1 : -1) * 0.045, oz = (i < 2 ? 1 : -1) * 0.045;
        mesh.box(kx + ox - 0.012, -0.05, kz + oz - 0.012, kx + ox + 0.012, 2.60, kz + oz + 0.012, MT.besi,
          { sys: 'struktur', op: 0.9 });
      }
    }

    // lapisan lantai
    const l = M.struktur.lantai;
    mesh.box(0.00, -0.30, 3.90, 3.00, -0.10, 10.00, MT.tanah, { sys: 'pondasi', op: 0.5 });
    mesh.box(0.00, -0.10, 3.90, 3.00, -0.05, 10.00, MT.paving, { sys: 'pondasi' });
    mesh.box(0.00, -0.05, 3.90, 3.00, 0.00, 10.00, MT.beton, { sys: 'pondasi' });
  }

  // ---------- furnitur ----------
  function buildFurniture(mesh, opt) {
    for (const f of FURN) {
      if (opt.onlyRoom && f.room !== opt.onlyRoom) continue;
      for (const b of f.b) {
        const col = MT[b[0]] || MT.kayu;
        mesh.box(b[1], b[2], b[3], b[4], b[5], b[6], col, { room: f.room, sys: 'furnitur', furn: f.nama });
      }
    }
  }

  // ---------- tapak & lansekap ----------
  function buildGround(mesh, opt) {
    const S = M.SITE;
    // tanah pekarangan
    mesh.box(0, YT - 0.30, 0, S.w, YT, S.d, MT.tanah, { sys: 'tapak' });
    // jalan raya di depan
    mesh.box(-8, YT - 0.30, -4.0, S.w + 8, YT - 0.04, -0.20, MT.aspal, { sys: 'tapak' });
    mesh.box(-8, YT - 0.04, -4.0, S.w + 8, YT - 0.02, -3.4, MT.paving, { sys: 'tapak' });
    // saluran/kanstin
    mesh.box(-8, YT - 0.30, -0.20, S.w + 8, YT + 0.02, 0.00, MT.beton, { sys: 'tapak' });

    // rumput
    mesh.box(0.05, YT - 0.02, 0.05, 3.00, YT + 0.02, 1.95, MT.rumput, { sys: 'tapak' });
    mesh.box(3.05, YT - 0.02, 5.65, 6.00, YT + 0.02, 12.00, MT.rumput, { sys: 'tapak' });
    mesh.box(0.05, YT - 0.02, 10.05, 3.00, YT + 0.02, 12.00, MT.rumput, { sys: 'tapak' });

    // lantai kerja / jalan masuk
    const jm = M.site.jalanMasuk;
    mesh.box(jm.x0, YT - 0.02, jm.z0, jm.x1, -0.02, jm.z1, MT.paving, { sys: 'tapak' });
    const cpz = M.site.carportPaving;
    mesh.box(cpz.x0, YT - 0.02, cpz.z0, cpz.x1, -0.10, cpz.z1, MT.paving, { sys: 'tapak' });
    // area jemur
    const aj = M.site.areaJemur;
    mesh.box(aj.x0, YT - 0.02, aj.z0, aj.x1, -0.08, aj.z1, MT.keramikDapur, { sys: 'tapak' });
    // taman depan strip rumput
    mesh.box(0.05, YT - 0.01, 1.95, 3.00, YT + 0.03, 3.00, MT.rumput, { sys: 'tapak' });
  }

  function buildSiteObjects(mesh, opt) {
    if (!opt.site) return;
    const S = M.SITE, pg = M.site.pagar, o = { sys: 'tapak' };
    const gh = 1.60, gt = 0.12;
    const fence = opt.fence !== false;

    // --- pagar depan dengan 2 gerbang ---
    const gates = [[3.10, 5.90], [0.75, 1.55]];
    let x = 0;
    const fseg = (a, b) => {
      if (b - a < 0.05) return;
      if (!fence) return;
      mesh.box(a, YT, -gt / 2, b, gh, gt / 2, MT.pagar, o);
      mesh.box(a - 0.02, gh, -gt / 2 - 0.02, b + 0.02, gh + 0.09, gt / 2 + 0.02, MT.beton, o);
      mesh.box(a, YT, -gt / 2 - 0.03, a + 0.14, gh, gt / 2 + 0.03, MT.beton, o);
      mesh.box(b - 0.14, YT, -gt / 2 - 0.03, b, gh, gt / 2 + 0.03, MT.beton, o);
    };
    for (const [ga, gb] of gates.slice().sort((p, q) => p[0] - q[0])) { fseg(x, ga); x = gb; }
    fseg(x, S.w);

    // gerbang dorong besi
    if (fence) {
      mesh.box(3.10, YT, -0.04, 5.90, YT + 0.06, 0.04, MT.platBesi, o);
      for (let i = 0; i < 17; i++) {
        const gx = 3.18 + i * 0.165;
        mesh.box(gx - 0.018, YT + 0.06, -0.018, gx + 0.018, 1.55, 0.018, MT.platBesi, o);
      }
      mesh.box(3.10, 1.50, -0.03, 5.90, 1.58, 0.03, MT.platBesi, o);
      mesh.box(3.10, 0.55, -0.03, 5.90, 0.61, 0.03, MT.platBesi, o);
      // pintu pejalan kaki
      mesh.box(0.80, YT, -0.03, 1.50, 1.50, 0.03, MT.platBesi, o);
      for (let i = 0; i < 5; i++) {
        const gx = 0.86 + i * 0.15;
        mesh.box(gx - 0.015, YT, -0.018, gx + 0.015, 1.48, 0.018, MT.platBesi, o);
      }
    }

    // pagar samping & belakang
    if (fence) {
      for (const side of [-1, 1]) {
        const px = side < 0 ? 0.00 : 6.00;
        mesh.box(px - 0.06, YT, 0.00, px + 0.06, gh, 12.00, MT.pagar, o);
        mesh.box(px - 0.08, gh, 0.00, px + 0.08, gh + 0.09, 12.00, MT.beton, o);
        for (let z = 0; z <= 12; z += 3) mesh.box(px - 0.09, YT, z - 0.08, px + 0.09, gh, z + 0.08, MT.beton, o);
      }
      mesh.box(0.00, YT, 11.94, 6.00, gh, 12.06, MT.pagar, o);
      mesh.box(-0.08, gh, 11.94, 6.08, gh + 0.09, 12.06, MT.beton, o);
      for (let z = 0; z <= 6; z += 3) mesh.box(z - 0.08, YT, 11.93, z + 0.08, gh, 12.07, MT.beton, o);
    }

    // POS ronda / bak sampah? -> tempat sampah
    mesh.box(5.55, YT, 0.35, 5.90, YT + 0.75, 0.70, MT.dindingDapur, o);
    mesh.box(5.53, YT + 0.75, 0.33, 5.92, YT + 0.80, 0.72, MT.bajaGelap, o);

    // --- tandon air di atas carport + pompa ---
    mesh.box(3.55, 2.72, 4.10, 4.60, 2.80, 5.20, MT.beton, o);
    mesh.cyl(4.08, 4.65, 2.80, 3.88, 0.53, MT.toren, 16, o);
    mesh.cyl(4.08, 4.65, 3.88, 3.94, 0.24, MT.toren, 12, o);
    mesh.box(3.60, 2.80, 4.20, 3.72, 3.20, 4.32, MT.baja, o);
    mesh.box(3.35, 0.00, 5.25, 3.75, 0.62, 5.55, MT.bajaGelap, o);   // pompa

    // --- jemuran ---
    const aj = M.site.areaJemur;
    mesh.box(aj.x0 + 0.15, 1.55, aj.z0 + 0.30, aj.x1 - 0.15, 1.60, aj.z0 + 0.36, MT.besi, o);
    mesh.box(aj.x0 + 0.15, 1.20, aj.z0 + 0.30, aj.x1 - 0.15, 1.25, aj.z0 + 0.36, MT.besi, o);
    mesh.box(aj.x0 + 0.15, 0.00, aj.z0 + 0.30, aj.x0 + 0.21, 1.62, aj.z0 + 0.36, MT.besi, o);
    mesh.box(aj.x1 - 0.21, 0.00, aj.z0 + 0.30, aj.x1 - 0.15, 1.62, aj.z0 + 0.36, MT.besi, o);
    // kain jemuran
    mesh.box(aj.x0 + 0.30, 0.95, aj.z0 + 0.32, aj.x1 - 0.30, 1.55, aj.z0 + 0.35, MT.kaca, { sys: 'tapak', op: 0.6 });

    // --- septictank & resapan ---
    mesh.box(1.55, YT - 0.02, 10.85, 2.55, YT + 0.06, 11.85, MT.beton, { sys: 'sanitasi' });
    mesh.box(1.62, YT + 0.06, 10.92, 2.48, YT + 0.10, 11.78, MT.keramikDapur, { sys: 'sanitasi' });
    mesh.box(3.30, YT - 0.02, 10.80, 4.60, YT + 0.04, 11.90, MT.paving, { sys: 'sanitasi' });
    mesh.cyl(5.20, 10.20, YT - 0.02, YT + 0.06, 0.55, MT.beton, 16, { sys: 'sanitasi' });

    // --- mobil di carport ---
    const car = { x: 3.45, z: 1.15 };
    mesh.box(car.x, 0.22, car.z, car.x + 1.78, 0.72, car.z + 4.45, MT.mobil, o);
    mesh.box(car.x + 0.08, 0.72, car.z + 1.05, car.x + 1.70, 1.24, car.z + 3.05, MT.mobil, o);
    mesh.box(car.x + 0.10, 0.76, car.z + 1.10, car.x + 1.68, 1.20, car.z + 3.00, MT.kacaMobil, o);
    mesh.box(car.x - 0.03, 0.42, car.z + 0.10, car.x + 0.03, 0.60, car.z + 0.70, MT.lampu, o);
    mesh.box(car.x + 1.75, 0.42, car.z + 0.10, car.x + 1.81, 0.60, car.z + 0.70, MT.lampu, o);
    for (const [wx, wz] of [[0.30, 1.35], [1.48, 1.35], [0.30, 4.15], [1.48, 4.15]]) {
      mesh.cyl(car.x + wx, car.z + wz, 0.00, 0.30, 0.30, MT.ban, 12, o);
    }

    // --- tanaman ---
    for (const t of M.site.tanaman) {
      if (t.tipe === 'pohon') {
        mesh.cyl(t.x, t.z, YT, YT + 0.55, 0.09, MT.kayuGelap, 8, o);
        mesh.cyl(t.x, t.z, YT + 0.55, YT + t.h - 0.4, 0.42, MT.daunGelap, 10, o);
        mesh.cyl(t.x, t.z, YT + t.h - 0.5, YT + t.h, 0.26, MT.daun, 10, o);
      } else {
        mesh.cyl(t.x, t.z, YT, YT + t.h * 0.6, 0.24, MT.daun, 8, o);
        mesh.cyl(t.x, t.z, YT + t.h * 0.35, YT + t.h, 0.16, MT.daunGelap, 8, o);
      }
    }
    // pot pagar
    for (const t of M.site.tanaman.slice(1, 3)) {
      mesh.box(t.x - 0.16, YT, t.z - 0.16, t.x + 0.16, YT + 0.30, t.z + 0.16, MT.pot, o);
    }
  }

  // ---------- jalur MEP ----------
  function pipe(mesh, pts, size, color, sys, op = 1) {
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const mn = [
        Math.min(a[0], b[0]) - size / 2, Math.min(a[1], b[1]) - size / 2, Math.min(a[2], b[2]) - size / 2
      ];
      const mx = [
        Math.max(a[0], b[0]) + size / 2, Math.max(a[1], b[1]) + size / 2, Math.max(a[2], b[2]) + size / 2
      ];
      mesh.box(mn[0], mn[1], mn[2], mx[0], mx[1], mx[2], color, { sys, op });
    }
  }

  function buildMEP(mesh, opt) {
    const L = M.listrik, P = M.plumbing;
    if (opt.mep === 'listrik') {
      // panel utama
      mesh.box(0.10, 1.55, 3.98, 0.32, 1.95, 4.10, MT.dindingDalam, { sys: 'listrik' });
      // jalur utama di plafon: dari panel naik ke atas lalu menyusur
      pipe(mesh, [[0.21, 1.95, 4.04], [0.21, 2.72, 4.04], [0.21, 2.72, 9.40], [1.20, 2.72, 9.40]],
        0.045, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[0.21, 2.72, 6.40], [2.70, 2.72, 6.40]], 0.04, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[0.21, 2.72, 7.60], [2.40, 2.72, 7.60]], 0.04, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[0.21, 2.72, 8.60], [2.60, 2.72, 8.60]], 0.04, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[0.21, 2.72, 4.30], [2.70, 2.72, 4.30]], 0.04, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[0.21, 2.72, 3.30], [1.50, 2.72, 3.30], [1.50, 2.60, 3.30]], 0.04, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[2.90, 2.72, 5.90], [4.50, 2.72, 5.90], [4.50, 2.55, 3.10], [5.60, 2.55, 1.10]],
        0.04, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[4.50, 2.72, 5.90], [4.50, 2.55, 7.50]], 0.04, MT.kabel, 'listrik', 0.95);
      pipe(mesh, [[0.21, 1.40, 4.04], [0.21, 0.30, 4.04], [0.60, 0.30, 5.60]], 0.04, MT.kabel, 'listrik', 0.95);
      // titik
      for (const t of L.titik) {
        const s = t.jns === 'lampu' ? 0.11 : t.jns === 'panel' ? 0.14 : 0.06;
        const c = t.jns === 'lampu' ? MT.lampu : t.jns === 'panel' ? MT.besi : MT.kusenPutih;
        mesh.box(t.x - s, t.h - s * 0.6, t.z - s, t.x + s, t.h + s * 0.6, t.z + s, c, { sys: 'listrik' });
      }
    }
    if (opt.mep === 'air' || opt.mep === 'sanitasi') {
      if (opt.mep === 'air') {
        mesh.box(4.08, 3.94, 4.65, 4.08 + 0.03, 4.10, 4.68, MT.kabelAir, { sys: 'air' });
        pipe(mesh, [[4.08, 3.20, 4.65], [4.08, 1.10, 4.65], [4.06, 0.70, 4.65], [3.90, 0.55, 5.60]],
          0.05, MT.kabelAir, 'air');
        pipe(mesh, [[3.90, 0.45, 5.60], [3.00, 0.45, 5.60], [1.95, 0.45, 4.20], [0.20, 0.45, 5.65]],
          0.045, MT.kabelAir, 'air');
        pipe(mesh, [[1.95, 0.45, 4.20], [1.95, 0.45, 8.70], [1.20, 0.45, 8.70], [0.55, 0.45, 9.70]],
          0.04, MT.kabelAir, 'air');
        pipe(mesh, [[2.30, 0.45, 8.70], [2.30, 0.45, 9.62], [2.30, 1.05, 9.62]], 0.04, MT.kabelAir, 'air');
        pipe(mesh, [[2.30, 1.05, 9.62], [2.66, 1.05, 9.70]], 0.035, MT.kabelAir, 'air');
        pipe(mesh, [[1.20, 0.45, 8.70], [1.20, 1.20, 9.10], [1.20, 1.90, 9.70], [2.40, 1.90, 9.90]],
          0.035, MT.kabelAir, 'air');
        pipe(mesh, [[4.20, 0.45, 5.80], [4.20, 0.45, 7.30]], 0.035, MT.kabelAir2, 'air');
      } else {
        // air kotor
        pipe(mesh, [[2.30, 0.02, 9.45], [2.30, 0.02, 9.10], [2.30, 0.02, 9.10], [2.20, 0.02, 8.75],
          [1.05, 0.02, 9.90], [1.05, YT - 0.20, 10.30], [1.05, YT - 0.20, 11.05], [2.05, YT - 0.20, 11.05],
          [2.05, YT + 0.02, 11.30]], 0.075, MT.bajaGelap, 'sanitasi');
        pipe(mesh, [[0.55, YT + 0.02, 9.90], [1.05, YT + 0.02, 9.90]], 0.06, MT.bajaGelap, 'sanitasi');
        pipe(mesh, [[2.05, YT - 0.20, 11.05], [3.90, YT - 0.20, 11.05], [3.90, YT - 0.20, 11.05],
          [3.90, YT + 0.02, 11.35]], 0.06, MT.kabelAir2, 'sanitasi');
        pipe(mesh, [[1.90, 0.02, 8.75], [1.90, 0.02, 9.45]], 0.06, MT.bajaGelap, 'sanitasi');
        pipe(mesh, [[5.20, YT - 0.20, 10.20], [4.60, YT - 0.20, 10.20], [4.60, YT - 0.20, 11.05]],
          0.06, MT.kabelAir, 'sanitasi');
      }
    }
  }

  return { FURN, build, buildWalls, buildRoof, pipe };
})();

if (typeof module !== 'undefined') module.exports = SCENE;
