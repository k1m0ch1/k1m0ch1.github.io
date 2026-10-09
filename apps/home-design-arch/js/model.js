/* ============================================================
   model.js — DATA PROYEK (sumber tunggal untuk 2D & 3D)
   Proyek : Rumah Tinggal Tipe 21/72
   Lokasi : Kavling 6.00 x 12.00 m, GSB 3.00 m
   ============================================================
   SISTEM KOORDINAT
     x : 0.00 = batas kiri (dinding kopel)  -> 3.00 = sisi timur bangunan
     z : 0.00 = batas depan (jalan)         -> 12.00 = batas belakang
     y : 0.00 = elevasi lantai bangunan     (tanah di -0.45)
   Dinding digambar pada SUMBU (as) dengan tebal 0.15 m.
   ============================================================ */
'use strict';

const MODEL = (() => {

  // ---------- parameter utama ----------
  const T = 0.15;          // tebal dinding (1/2 bata + plester)
  const H = 2.80;          // tinggi plafon / dinding
  const YT = -0.45;        // elevasi tanah pekarangan
  const YB = -0.85;        // dasar galian pondasi

  const B = { x0: 0.00, x1: 3.00, z0: 3.00, z1: 10.00 };   // tapak bangunan
  const SITE = { w: 6.00, d: 12.00, gsb: 3.00 };            // kavling

  // ============================================================
  // 1. RUANG  (dimensi as-ke-as, gross = 21.00 m2)
  // ============================================================
  const rooms = [
    {
      id: 'teras', kode: 'T', nama: 'Teras Sambut', short: 'Teras',
      x0: 0.00, x1: 3.00, z0: 3.00, z1: 3.90,
      jenis: 'luar', lantai: 'keramikMandi', dinding: 'acian',
      plafon: 'plafon GRC board 9 mm, rangka hollow 40x40',
      warna: [216, 168, 122],
      desc: 'Teras beratap dengan plat lantai ditinggikan 5 cm dari pekarangan. Cukup untuk 2 kursi rotan + pot tanaman. Lantai keramik 25x25 motif batu alam anti-slip.',
      poin: ['Dudukan 2 kursi + meja kecil', 'Kanopi dari overstek atap utama 0,95 m',
             'Lampu dinding 2 titik + lampu nomor rumah', 'Drainase lantai ke taman depan']
    },
    {
      id: 'tamu', kode: 'RT', nama: 'Ruang Tamu & Keluarga', short: 'R. Tamu',
      x0: 0.00, x1: 3.00, z0: 3.90, z1: 6.00,
      jenis: 'dalam', lantai: 'granit', dinding: 'dindingDalam',
      plafon: 'plafon GRC board 9 mm, drop ceiling 15 cm di tepi',
      warna: [196, 200, 178],
      desc: 'Ruang multifungsi: tamu, keluarga, makan, dan area kerja. Konsep <em>open plan</em> tanpa sekat ke koridor sehingga rumah terasa lebih luas. Sofa 2 dudukan dapat dibuka menjadi tempat tidur tamu (sofa bed).',
      poin: ['Sofa bed 2 dudukan (1,50 x 0,70 m)', 'Meja serbaguna tinggi adjustable (makan/kerja)',
             'Konsol TV + bracket TV LED 32"', 'Niche kulkas 1 pintu di sudut timur',
             'Rak dinding 2 tingkat', 'Jendela utama 1,40 x 1,20 m menghadap teras']
    },
    {
      id: 'koridor', kode: 'KR', nama: 'Koridor', short: 'Koridor',
      x0: 0.00, x1: 0.95, z0: 6.00, z1: 8.50,
      jenis: 'dalam', lantai: 'granit', dinding: 'dindingDalam',
      plafon: 'plafon GRC board 9 mm',
      warna: [188, 176, 196],
      desc: 'Sirkulasi utama selebar 0,80 m bersih (as 0,95 m) menghubungkan ruang tamu ke area servis. Sisi barat menempel dinding kopel sehingga tidak ada luas terbuang untuk jendela. Dipasang rak dinding berongga agar tidak menghabiskan luas lantai.',
      poin: ['Rak sepatu gantung 3 tingkat (0,32 m dalam)', 'Cermin badan dinding 0,45 x 1,50 m',
             'Lampu downlight 2 titik', 'Lubang pintu darurat / akses plafon 0,60 x 0,60 m']
    },
    {
      id: 'kamar', kode: 'KT', nama: 'Kamar Tidur Utama', short: 'Kamar Tidur',
      x0: 0.95, x1: 3.00, z0: 6.00, z1: 8.50,
      jenis: 'dalam', lantai: 'keramikKamar', dinding: 'dindingKamar',
      plafon: 'plafon GRC board 9 mm + lampu gantung',
      warna: [172, 186, 208],
      desc: 'Kamar tidur dengan bukaan jendela timur 1,20 x 1,20 m menghadap taman belakang, sehingga mendapat cahaya pagi dan sirkulasi silang. Dimensi 2,05 x 2,50 m as-ke-as; <em>clear</em> 1,90 x 2,35 m (4,46 m² bersih). Kasur yang disarankan maksimal 120 x 200 cm — bukan 160 x 200. Sesuai Kepmen Kimpraswil 403/2002, luas minimal dihitung per penghuni untuk keseluruhan rumah (min. 7,2 m²/orang): rumah 21 m² ini memenuhi untuk 2–3 penghuni, dan kamar seukuran ini cukup untuk kasur 120 cm + lemari 62 cm + meja kerja di bawah jendela.',
      poin: ['Kasur 120 x 200 cm + dipan rendah (kaki kayu)', 'Lemari pakaian 2 pintu 0,62 x 0,60 x 2,10 m di sudut utara-timur',
             'Meja multifungsi 0,80 m (rias / kerja) di bawah jendela', 'Rak gantung + cermin dinding',
             'AC 1/2 PK opsional di dinding utara', 'Jendela timur 1,20 x 1,20 m + tirai blackout']
    },
    {
      id: 'dapur', kode: 'DP', nama: 'Dapur & Area Cuci', short: 'Dapur',
      x0: 0.00, x1: 1.65, z0: 8.50, z1: 10.00,
      jenis: 'dalam', lantai: 'keramikDapur', dinding: 'dindingDapur',
      plafon: 'plafon GRC board 9 mm, cat waterproof',
      warna: [214, 190, 158],
      desc: 'Dapur satu baris (single line) menghadap barat dengan panjang meja 1,25 m. Jalur gerak (walkway) 0,85 m — memenuhi standar minimum dapur rumah kecil. Terhubung langsung dengan area cuci dan pintu kamar mandi.',
      poin: ['Kitchen set bawah 1,25 x 0,60 x 0,85 m (sink + kompor tanam 2 tungku)',
             'Kabinet atas 1,00 x 0,35 x 0,70 m', 'Kulkas 1 pintu 0,50 x 0,55 x 1,20 m di sudut utara',
             'Jendela 0,80 x 0,90 m + kipas isap (exhaust fan 8")', 'Bak cuci + keran air bersih',
             'Tempat sampah tertutup 2 bak (organik / anorganik)']
    },
    {
      id: 'mandi', kode: 'KM', nama: 'Kamar Mandi', short: 'Kamar Mandi',
      x0: 1.65, x1: 3.00, z0: 8.50, z1: 10.00,
      jenis: 'dalam', lantai: 'keramikMandi', dinding: 'dindingMandi',
      plafon: 'plafon PVC / GRC cat waterproof',
      warna: [160, 196, 208],
      desc: 'Kamar mandi basah <em>walk-in shower</em> tanpa bak, ukuran 1,35 x 1,50 m as-ke-as (<em>clear</em> 1,20 x 1,35 m). Dinding dilapisi keramik sampai tinggi 2,10 m, lantai keramik 25x25 anti-slip bersudut kemiringan 1% ke floor drain.',
      poin: ['Kloset duduk monoblock 0,38 x 0,70 m', 'Shower set + kaca partisi 0,80 x 2,00 m',
             'Wastafel gantung 0,40 x 0,35 m', 'Keramik dinding 20x40 glossy setinggi 2,10 m',
             'Exhaust fan 6" + jendela 0,60 x 0,60 m (sill 1,60 m)', 'Pintu PVC 0,70 x 2,10 m bukaan keluar',
             'Floor drain 2 titik + floor trap berbau']
    }
  ];

  // ============================================================
  // 2. DINDING  (as + tebal 0.15)  beserta BUKAAN
  // ============================================================
  const walls = [
    {
      id: 'W1', dir: 'x', at: 3.90, a: 0.00, b: 3.00, t: T, h: H, type: 'ext',
      mat: 'dinding', ket: 'Dinding muka (menghadap teras)',
      openings: [
        { id: 'P1', jns: 'pintu', a: 0.25, b: 1.15, sill: 0.00, head: 2.10, kusen: 'kayu', daun: 1,
          buka: 'masuk-kiri', nama: 'Pintu Utama 0,90 x 2,10' },
        { id: 'J1', jns: 'jendela', a: 1.45, b: 2.85, sill: 0.70, head: 1.90, kusen: 'kayu', daun: 2,
          buka: 'geser', nama: 'Jendela R.Tamu 1,40 x 1,20' }
      ]
    },
    {
      id: 'W2', dir: 'x', at: 10.00, a: 0.00, b: 3.00, t: T, h: H, type: 'ext',
      mat: 'dinding', ket: 'Dinding belakang',
      openings: [
        { id: 'J3', jns: 'jendela', a: 0.20, b: 1.00, sill: 1.20, head: 2.10, kusen: 'aluminium', daun: 2,
          buka: 'geser', nama: 'Jendela Dapur 0,80 x 0,90' },
        { id: 'J4', jns: 'jendela', a: 2.00, b: 2.70, sill: 1.60, head: 2.20, kusen: 'aluminium', daun: 1,
          buka: 'awning', nama: 'Jendela KM 0,70 x 0,60 (bouvenlicht)' },
        { id: 'EF1', jns: 'lubang', a: 1.20, b: 1.45, sill: 1.70, head: 1.95, kusen: 'aluminium',
          nama: 'Exhaust fan dapur 8"' }
      ]
    },
    {
      id: 'W3', dir: 'z', at: 0.00, a: 3.00, b: 10.00, t: T, h: H, type: 'kopel',
      mat: 'dindingKopel', ket: 'Dinding kopel / batas tetangga (tanpa bukaan)',
      openings: []
    },
    {
      id: 'W4', dir: 'z', at: 3.00, a: 3.90, b: 10.00, t: T, h: H, type: 'ext',
      mat: 'dinding', ket: 'Dinding timur (menghadap carport & taman belakang)',
      openings: [
        { id: 'J2', jns: 'jendela', a: 6.60, b: 7.80, sill: 0.80, head: 2.00, kusen: 'kayu', daun: 2,
          buka: 'geser', nama: 'Jendela Kamar 1,20 x 1,20' },
        { id: 'EF2', jns: 'lubang', a: 9.60, b: 9.85, sill: 1.90, head: 2.15, kusen: 'aluminium',
          nama: 'Exhaust fan KM 6"' }
      ]
    },
    {
      id: 'W5', dir: 'x', at: 6.00, a: 0.95, b: 3.00, t: T, h: H, type: 'int',
      mat: 'dindingDalam', ket: 'Dinding kamar tidur — sisi selatan',
      openings: []
    },
    {
      id: 'W6', dir: 'z', at: 0.95, a: 6.00, b: 8.50, t: T, h: H, type: 'int',
      mat: 'dindingDalam', ket: 'Dinding kamar tidur — sisi barat (ke koridor)',
      openings: [
        { id: 'P2', jns: 'pintu', a: 7.00, b: 7.80, sill: 0.00, head: 2.10, kusen: 'kayu', daun: 1,
          buka: 'masuk-kanan', nama: 'Pintu Kamar 0,80 x 2,10' }
      ]
    },
    {
      id: 'W7', dir: 'x', at: 8.50, a: 0.00, b: 3.00, t: T, h: H, type: 'int',
      mat: 'dindingDalam', ket: 'Dinding pemisah zona servis',
      openings: [
        { id: 'P4', jns: 'lubang', a: 0.05, b: 0.75, sill: 0.00, head: 2.10, kusen: 'kayu',
          nama: 'Lubang pintu koridor -> dapur 0,70 x 2,10' },
        { id: 'P5', jns: 'pintu', a: 2.10, b: 2.80, sill: 0.00, head: 2.10, kusen: 'pvc', daun: 1,
          buka: 'keluar', nama: 'Pintu KM varian ensuite 0,70 x 2,10', varian: 'ensuite' }
      ]
    },
    {
      id: 'W8', dir: 'z', at: 1.65, a: 8.50, b: 10.00, t: T, h: H, type: 'int',
      mat: 'dindingMandi', ket: 'Dinding pemisah dapur & kamar mandi',
      openings: [
        { id: 'P3', jns: 'pintu', a: 8.65, b: 9.35, sill: 0.00, head: 2.10, kusen: 'pvc', daun: 1,
          buka: 'keluar', nama: 'Pintu KM 0,70 x 2,10', varian: 'servis' }
      ]
    }
  ];

  // ============================================================
  // 3. ATAP
  // ============================================================
  const roof = {
    tipe: 'Atap pelana (gable), kemiringan 30°, nok sejajar sumbu z',
    sudut: 30,
    eaveW: -0.20, eaveE: 3.55,        // garis tepi atap barat & timur
    overFront: 0.95, overBack: 0.55,  // overstek depan & belakang
    yeave: H,                         // tinggi tepi atap
    mat: 'Genteng beton flat + usuk 4/6 + reng 2/3 + gording 5/7',
    talang: 'Talang datar zincalume 0,30 m di sisi barat (dinding kopel) + pipa turun 3"'
  };
  roof.ridgeX = (roof.eaveW + roof.eaveE) / 2;                       // 1.675
  roof.halfSpan = (roof.eaveE - roof.eaveW) / 2;                     // 1.875
  roof.rise = roof.halfSpan * Math.tan(roof.sudut * Math.PI / 180);   // 1.0825
  roof.yridge = roof.yeave + roof.rise;                              // 3.8825
  roof.zFront = B.z0 - roof.overFront;                               // 2.05
  roof.zBack = B.z1 + roof.overBack;                                 // 10.55

  // tinggi dinding tepat di atas as dinding barat & timur (mengikuti bidang atap)
  roof.yWallW = roof.yeave + (0.00 - roof.eaveW) * Math.tan(roof.sudut * Math.PI / 180);
  roof.yWallE = roof.yeave + (roof.eaveE - 3.00) * Math.tan(roof.sudut * Math.PI / 180);

  // kanopi carport
  const carport = {
    x0: 3.00, x1: 6.00, z0: 0.60, z1: 5.60,
    yW: 2.65, yE: 2.30,
    mat: 'Atap spandek pasir 0,35 mm + rangka besi hollow 40x60',
    tiang: [[3.30, 0.90], [5.70, 0.90], [5.70, 5.30]]
  };

  // ============================================================
  // 4. KUSEN / JADWAL PINTU JENDELA
  // ============================================================
  const kusen = [
    { kode: 'P1', nama: 'Pintu Utama', jml: 1, lebar: 0.90, tinggi: 2.10, bahan: 'Kayu kamper Oven / Kaca 5 mm',
      rangka: 'Kusen 6x12 kayu kamper', daun: 'Panel kayu + kaca riben', aksesoris: 'Engsel 3 bh, handle 1 set, kunci silinder' },
    { kode: 'P2', nama: 'Pintu Kamar Tidur', jml: 1, lebar: 0.80, tinggi: 2.10, bahan: 'Kayu kamper Oven',
      rangka: 'Kusen 6x12 kayu kamper', daun: 'Panel kayu HDF finishing HPL', aksesoris: 'Engsel 3 bh, handle bulat, kunci kamar' },
    { kode: 'P3', nama: 'Pintu Kamar Mandi', jml: 1, lebar: 0.70, tinggi: 2.10, bahan: 'PVC Foam Board 8 mm',
      rangka: 'Kusen PVC + list aluminium', daun: 'PVC warna putih', aksesoris: 'Engsel 3 bh, handle + kunci putar (bukaan keluar)' },
    { kode: 'P4', nama: 'Lubang Pintu Koridor-Dapur', jml: 1, lebar: 0.70, tinggi: 2.10, bahan: 'Tanpa daun (cased opening)',
      rangka: 'Kusen 5x10 kayu + architrave', daun: '—', aksesoris: '—' },
    { kode: 'J1', nama: 'Jendela Ruang Tamu', jml: 1, lebar: 1.40, tinggi: 1.20, bahan: 'Kayu kamper + kaca bening 5 mm',
      rangka: 'Kusen 6x12 kayu', daun: '2 daun geser + kasa nyamuk', aksesoris: 'Roda geser, handle, sealer' },
    { kode: 'J2', nama: 'Jendela Kamar Tidur', jml: 1, lebar: 1.20, tinggi: 1.20, bahan: 'Kayu kamper + kaca bening 5 mm',
      rangka: 'Kusen 6x12 kayu', daun: '2 daun geser + kasa nyamuk', aksesoris: 'Roda geser, handle, sealer' },
    { kode: 'J3', nama: 'Jendela Dapur', jml: 1, lebar: 0.80, tinggi: 0.90, bahan: 'Aluminium powder coating + kaca 5 mm',
      rangka: 'Aluminium 3"', daun: '2 daun geser + kasa nyamuk', aksesoris: 'Roda, handle, sealer' },
    { kode: 'J4', nama: 'Jendela KM (bouvenlicht)', jml: 1, lebar: 0.70, tinggi: 0.60, bahan: 'Aluminium + kaca buram 5 mm',
      rangka: 'Aluminium 2"', daun: '1 daun awning (jungkit)', aksesoris: 'Stay arm, handle' },
    { kode: 'EF1', nama: 'Exhaust Fan Dapur', jml: 1, lebar: 0.25, tinggi: 0.25, bahan: 'Plastik + motor 8"',
      rangka: 'Bukaan dinding + list', daun: 'Blade PVC', aksesoris: 'Switch terpisah' },
    { kode: 'EF2', nama: 'Exhaust Fan KM', jml: 1, lebar: 0.25, tinggi: 0.25, bahan: 'Plastik + motor 6"',
      rangka: 'Bukaan dinding + list', daun: 'Blade PVC', aksesoris: 'Switch + timer' }
  ];

  // ============================================================
  // 5. STRUKTUR
  // ============================================================
  const struktur = {
    pondasi: {
      nama: 'Pondasi batu belah (batu kali) 1:4',
      penampang: 'Trapesium — lebar bawah 0,60 m, lebar atas 0,25 m, tinggi 0,65 m',
      dasar: YB, atas: -0.20,
      pasir: 'Pasir urug bawah pondasi t=0,10 m, dipadatkan',
      aanstamping: 'Batu kosong (aanstamping) t=0,15 m',
      volume: 'Panjang total as pondasi 23,50 m'
    },
    sloof: { nama: 'Sloof beton bertulang 15/20, fc\' 19,3 MPa (K-225)', besi: '4 Ø10 + begel Ø6-200', elevasi: '-0,25 s/d -0,05' },
    kolom: { nama: 'Kolom praktis 15/15', besi: '4 Ø10 + begel Ø6-200',
             jarak: 'Maksimal tiap 3,00 m dan pada setiap pertemuan/persilangan dinding', jml: 14 },
    ringbalok: { nama: 'Ring balok 15/20, fc\' 19,3 MPa', besi: '4 Ø10 + begel Ø6-200', elevasi: '2,60 s/d 2,80 m' },
    kudakuda: { nama: 'Kuda-kuda kayu/baja ringan, jarak antar kuda-kuda 1,00 m', bahan: 'Kayu kruing 8/12 atau baja ringan C75',
                gording: 'Kayu 5/7 atau baja ringan C75 - jarak 1,00 m', usuk: 'Kayu 4/6 - jarak 0,50 m', reng: 'Kayu 2/3 - jarak 0,31 m' },
    lantai: {
      urugan: 'Tanah urug dipadatkan 20 cm/lapis',
      pasir: 'Pasir urug t=10 cm',
      lantaiKerja: 'Beton lantai kerja t=5 cm (semen 1:5)',
      pelat: 'Pelat beton bertulang t=8 cm, wiremesh M5-150',
      finish: 'Keramik granit 60x60 (ruang dalam), keramik 25x25 anti-slip (KM & teras)'
    },
    dindingPengisi: { nama: 'Dinding bata merah 1/2 bata', plester: 'Semen 1:4 t=15 mm', acian: 'Semen putih 2 mm',
                      tinggi: '2,80 m dari lantai ke ring balok' }
  };

  // ============================================================
  // 6. INSTALASI LISTRIK  (titik & jalur)
  // ============================================================
  const listrik = {
    daya: '1.300 VA (PLN) / MCB utama 6 A',
    titik: [
      { id: 'L1', jns: 'lampu', x: 1.50, z: 4.95, h: 2.80, ket: 'Lampu plafon LED 18 W — Ruang Tamu' },
      { id: 'L2', jns: 'lampu', x: 0.40, z: 7.00, h: 2.80, ket: 'Downlight LED 9 W — Koridor' },
      { id: 'L3', jns: 'lampu', x: 0.40, z: 7.90, h: 2.80, ket: 'Downlight LED 9 W — Koridor' },
      { id: 'L4', jns: 'lampu', x: 1.90, z: 7.25, h: 2.80, ket: 'Lampu gantung + downlight 12 W — Kamar' },
      { id: 'L5', jns: 'lampu', x: 0.85, z: 9.20, h: 2.80, ket: 'Lampu plafon LED 12 W — Dapur' },
      { id: 'L6', jns: 'lampu', x: 2.30, z: 9.20, h: 2.70, ket: 'Lampu LED 12 W IP44 — Kamar Mandi' },
      { id: 'L7', jns: 'lampu', x: 1.50, z: 3.45, h: 2.60, ket: 'Lampu dinding 2 x 7 W — Teras' },
      { id: 'L8', jns: 'lampu', x: 1.50, z: 3.15, h: 2.20, ket: 'Lampu nomor rumah + lampu taman' },
      { id: 'L9', jns: 'lampu', x: 4.50, z: 3.10, h: 2.40, ket: 'Lampu carport LED 15 W IP65' },
      { id: 'L10', jns: 'lampu', x: 4.50, z: 7.50, h: 2.40, ket: 'Lampu taman belakang 10 W IP65' },
      { id: 'S1', jns: 'saklar', x: 0.30, z: 4.05, h: 1.40, ket: 'Saklar ganda — R.Tamu + Teras' },
      { id: 'S2', jns: 'saklar', x: 0.30, z: 6.20, h: 1.40, ket: 'Saklar ganda — Koridor + Dapur' },
      { id: 'S3', jns: 'saklar', x: 0.95, z: 6.20, h: 1.40, ket: 'Saklar tunggal — Kamar' },
      { id: 'S4', jns: 'saklar', x: 1.60, z: 8.70, h: 1.40, ket: 'Saklar tunggal + timer — KM & Exhaust' },
      { id: 'K1', jns: 'stopkontak', x: 2.75, z: 4.10, h: 1.40, ket: 'Stop kontak ganda — TV + Kulkas' },
      { id: 'K2', jns: 'stopkontak', x: 0.30, z: 5.60, h: 1.40, ket: 'Stop kontak ganda — Sofa / charger' },
      { id: 'K3', jns: 'stopkontak', x: 2.80, z: 6.35, h: 1.20, ket: 'Stop kontak ganda — Meja kamar' },
      { id: 'K4', jns: 'stopkontak', x: 0.35, z: 9.30, h: 1.20, ket: 'Stop kontak ganda — Dapur (kompor listrik cadangan)' },
      { id: 'K5', jns: 'stopkontak', x: 5.65, z: 1.10, h: 1.40, ket: 'Stop kontak + lampu carport' },
      { id: 'K6', jns: 'stopkontak', x: 2.85, z: 7.60, h: 2.30, ket: 'Titik AC 1/2 PK (opsional) — Kamar' },
      { id: 'K7', jns: 'stopkontak', x: 4.60, z: 5.65, h: 1.40, ket: 'Stop kontak pompa air + lampu taman' },
      { id: 'MCB', jns: 'panel', x: 0.25, z: 4.00, h: 1.70, ket: 'Box MCB 4 grup + kWh meter (di dinding teras)' }
    ],
    grup: [
      { g: 'Grup 1', mcb: '6 A', beban: 'Lampu teras, ruang tamu, koridor' },
      { g: 'Grup 2', mcb: '6 A', beban: 'Lampu kamar, dapur, kamar mandi, exhaust fan' },
      { g: 'Grup 3', mcb: '10 A', beban: 'Stop kontak ruang tamu, kamar, TV, kulkas' },
      { g: 'Grup 4', mcb: '10 A', beban: 'Stop kontak dapur, pompa air, carport, taman' }
    ],
    kabel: 'NYM 3x2,5 mm² (stop kontak), NYM 3x1,5 mm² (lampu), dalam conduit PVC 20 mm'
  };

  // ============================================================
  // 7. INSTALASI AIR BERSIH & AIR KOTOR
  // ============================================================
  const plumbing = {
    sumber: 'Sambungan PDAM / sumur bor kedalaman 30 m',
    tandon: { kapasitas: '600 liter', posisi: 'Di atas atap carport (elevasi +2,90 m)', bahan: 'Tandon PE 600 L' },
    pompa: { nama: 'Pompa air semi-jet 125 W + pressure switch', posisi: 'Di bawah tandon (carport)' },
    airBersih: [
      { id: 'A1', x: 0.20, z: 5.65, ket: 'Keran taman depan + mesin cuci opsional' },
      { id: 'A2', x: 0.55, z: 9.70, ket: 'Keran bak cuci dapur (sink)' },
      { id: 'A3', x: 2.65, z: 9.85, ket: 'Keran wastafel KM' },
      { id: 'A4', x: 2.30, z: 9.65, ket: 'Shower + keran kloset' },
      { id: 'A5', x: 4.20, z: 5.80, ket: 'Keran area jemur / cuci' }
    ],
    airKotor: [
      { id: 'B1', x: 2.30, z: 9.45, ket: 'Floor drain KM 1' },
      { id: 'B2', x: 1.90, z: 8.75, ket: 'Floor drain KM 2 + floor trap' },
      { id: 'B3', x: 0.55, z: 9.90, ket: 'Air kotor dapur -> grease trap' },
      { id: 'B4', x: 1.05, z: 10.60, ket: 'Bak kontrol / grease trap 0,40 x 0,40' },
      { id: 'B5', x: 2.20, z: 11.20, ket: 'Septictank 1,20 x 2,00 (biofilter)' },
      { id: 'B6', x: 3.80, z: 11.20, ket: 'Bidang resapan 1,00 x 1,50' },
      { id: 'B7', x: 5.20, z: 10.20, ket: 'Sumur resapan air hujan Ø1,00 m dalam 1,50 m' }
    ],
    jalur: 'Pipa air bersih PPR PN10 Ø1/2" & 3/4"; air kotor PVC D 3" & 2"; ventilasi PVC 2"'
  };

  // ============================================================
  // 8. TAPAK / LANSEKAP
  // ============================================================
  const site = {
    luas: SITE.w * SITE.d,
    kdb: null, klb: null,
    pagar: {
      depan: { x0: 0.00, x1: 6.00, z: 0.00, h: 1.60, gerbang: [[3.10, 5.90, 'gerbang dorong besi 2,80 m'],
                                                               [0.75, 1.55, 'pintu pejalan kaki 0,80 m']] },
      kiri:  { x: 0.00, z0: 0.00, z1: 12.00, h: 1.60 },
      kanan: { x: 6.00, z0: 0.00, z1: 12.00, h: 1.60 },
      belakang: { x0: 0.00, x1: 6.00, z: 12.00, h: 1.60 }
    },
    tamanDepan: { x0: 0.00, x1: 3.00, z0: 0.00, z1: 3.00, luas: 9.00 },
    jalanMasuk: { x0: 0.75, x1: 1.95, z0: 0.00, z1: 3.00 },
    carportPaving: { x0: 3.00, x1: 6.00, z0: 0.60, z1: 5.60, luas: 15.00 },
    tamanBelakang: { x0: 3.00, x1: 6.00, z0: 5.60, z1: 12.00, luas: 19.20 },
    areaJemur: { x0: 3.40, x1: 5.60, z0: 6.20, z1: 7.60, luas: 3.52 },
    tanaman: [
      { x: 0.45, z: 1.10, tipe: 'pohon', h: 2.60, nama: 'Kamboja / Tabebuya (pot besar)' },
      { x: 2.55, z: 0.60, tipe: 'semak', h: 0.70, nama: 'Lidah mertua 6 pot' },
      { x: 2.70, z: 1.90, tipe: 'semak', h: 0.60, nama: 'Sri rejeki + Rumput gajah mini' },
      { x: 4.00, z: 9.20, tipe: 'semak', h: 0.85, nama: 'Bambu jepang (pembatas)' },
      { x: 5.40, z: 8.40, tipe: 'pohon', h: 2.20, nama: 'Belimbing / Jeruk (tabulampot)' },
      { x: 5.50, z: 11.20, tipe: 'semak', h: 0.50, nama: 'Pandan + jahe merah' }
    ]
  };
  site.kdb = (21.00 + 15.00) / site.luas;   // 50%
  site.klb = 21.00 / site.luas;             // 0.29

  // ============================================================
  // 9. RAB (Rencana Anggaran Biaya)
  // ============================================================
  const rab = {
    hargaSatuan: 4_200_000,
    satuanKet: 'Harga borongan per m² (standar menengah, Jabodetabek 2026)',
    kategori: [
      { k: 'A', nama: 'Pekerjaan Persiapan', item: [
        { u: 'Pembersihan lahan & pengukuran (bouwplank)', v: 72, s: 'm²', h: 18_000 },
        { u: 'Papan nama proyek + direksi kit', v: 1, s: 'ls', h: 650_000 },
        { u: 'Pagar sementara seng + penyiraman', v: 1, s: 'ls', h: 800_000 }
      ]},
      { k: 'B', nama: 'Pekerjaan Tanah & Pondasi', item: [
        { u: 'Galian tanah pondasi 0,70 x 0,80 m', v: 13.2, s: 'm³', h: 95_000 },
        { u: 'Urugan kembali + pemadatan', v: 5.5, s: 'm³', h: 75_000 },
        { u: 'Pasir urug bawah pondasi t=10 cm', v: 1.4, s: 'm³', h: 320_000 },
        { u: 'Pondasi batu belah 1:4 (trapesium 60/25)', v: 7.6, s: 'm³', h: 1_150_000 },
        { u: 'Aanstamping batu kosong t=15 cm', v: 2.1, s: 'm³', h: 620_000 },
        { u: 'Sloof beton bertulang 15/20 K-225', v: 0.71, s: 'm³', h: 5_400_000 },
        { u: 'Kolom praktis 15/15 + pembesian', v: 14, s: 'bh', h: 285_000 },
        { u: 'Ring balok 15/20 K-225', v: 0.72, s: 'm³', h: 5_400_000 }
      ]},
      { k: 'C', nama: 'Pekerjaan Dinding & Plesteran', item: [
        { u: 'Dinding bata merah 1/2 bata (1 pc : 4 ps)', v: 72.5, s: 'm²', h: 165_000 },
        { u: 'Plesteran 1:4 tebal 15 mm', v: 145, s: 'm²', h: 58_000 },
        { u: 'Acian semen putih tebal 2 mm', v: 145, s: 'm²', h: 42_000 },
        { u: 'Pekerjaan kusen, pintu & jendela (10 unit)', v: 1, s: 'ls', h: 9_800_000 },
        { u: 'Angkur + stek besi dinding', v: 14, s: 'ttk', h: 65_000 }
      ]},
      { k: 'D', nama: 'Pekerjaan Lantai', item: [
        { u: 'Urugan tanah lantai + pemadatan', v: 12.6, s: 'm³', h: 75_000 },
        { u: 'Pasir urug lantai t=10 cm', v: 2.1, s: 'm³', h: 320_000 },
        { u: 'Lantai kerja beton t=5 cm', v: 21, s: 'm²', h: 78_000 },
        { u: 'Pelat lantai beton t=8 cm + wiremesh M5', v: 21, s: 'm²', h: 195_000 },
        { u: 'Keramik granit 60x60 (ruang dalam)', v: 15.5, s: 'm²', h: 175_000 },
        { u: 'Keramik 25x25 anti-slip (KM & teras)', v: 5.5, s: 'm²', h: 135_000 },
        { u: 'Paving block / beton stamp carport 15 m²', v: 15, s: 'm²', h: 165_000 }
      ]},
      { k: 'E', nama: 'Pekerjaan Atap & Plafon', item: [
        { u: 'Kuda-kuda + gording + usuk + reng', v: 33, s: 'm²', h: 195_000 },
        { u: 'Penutup atap genteng beton flat', v: 33, s: 'm²', h: 210_000 },
        { u: 'Nok / ridge genteng + sealant', v: 8.5, s: 'm', h: 95_000 },
        { u: 'Lisplang GRC 3/20 + list profil', v: 18, s: 'm', h: 115_000 },
        { u: 'Talang datar zincalume 0,30 m + pipa turun 3"', v: 12, s: 'm', h: 165_000 },
        { u: 'Kanopi carport spandek + rangka hollow', v: 15, s: 'm²', h: 385_000 },
        { u: 'Plafon GRC board 9 mm + rangka hollow 40x40', v: 21, s: 'm²', h: 165_000 },
        { u: 'List plafon gypsum + shadowline', v: 26, s: 'm', h: 45_000 }
      ]},
      { k: 'F', nama: 'Pekerjaan Pengecatan', item: [
        { u: 'Cat dinding interior (dasar + 2 lapis)', v: 145, s: 'm²', h: 42_000 },
        { u: 'Cat dinding eksterior weathershield', v: 78, s: 'm²', h: 55_000 },
        { u: 'Cat plafon + list', v: 21, s: 'm²', h: 35_000 },
        { u: 'Cat kusen, pintu & lisplang (dasar + top coat)', v: 1, s: 'ls', h: 1_850_000 }
      ]},
      { k: 'G', nama: 'Pekerjaan Sanitasi & Plumbing', item: [
        { u: 'Kloset duduk monoblock + aksesoris', v: 1, s: 'unit', h: 1_650_000 },
        { u: 'Shower set + keran + floor drain + floor trap', v: 1, s: 'set', h: 1_250_000 },
        { u: 'Wastafel gantung + keran', v: 1, s: 'unit', h: 950_000 },
        { u: 'Bak cuci dapur stainless + keran', v: 1, s: 'unit', h: 780_000 },
        { u: 'Instalasi pipa air bersih PPR + fitting', v: 1, s: 'ls', h: 2_400_000 },
        { u: 'Instalasi pipa air kotor PVC 3" & 2"', v: 1, s: 'ls', h: 2_100_000 },
        { u: 'Septictank biofilter + bidang resapan', v: 1, s: 'unit', h: 6_500_000 },
        { u: 'Sumur resapan air hujan Ø1,0 x 1,5 m', v: 1, s: 'unit', h: 1_850_000 },
        { u: 'Tandon 600 L + pompa semi-jet 125 W + rangka', v: 1, s: 'set', h: 3_200_000 },
        { u: 'Grease trap / bak kontrol 0,40 x 0,40', v: 2, s: 'unit', h: 450_000 }
      ]},
      { k: 'H', nama: 'Pekerjaan Elektrikal', item: [
        { u: 'Titik lampu (10 titik) + armatur LED', v: 10, s: 'ttk', h: 245_000 },
        { u: 'Saklar + stop kontak (11 titik)', v: 11, s: 'ttk', h: 165_000 },
        { u: 'Instalasi kabel NYM + conduit PVC', v: 1, s: 'ls', h: 3_600_000 },
        { u: 'Box MCB 4 grup + MCB + kWh meter', v: 1, s: 'set', h: 1_450_000 },
        { u: 'Instalasi penangkal petir + grounding', v: 1, s: 'set', h: 1_250_000 }
      ]},
      { k: 'I', nama: 'Pekerjaan Tapak & Lansekap', item: [
        { u: 'Pagar dinding batako + plester + cat (52 m²)', v: 52, s: 'm²', h: 385_000 },
        { u: 'Gerbang besi dorong 2,80 m + pintu pejalan kaki', v: 1, s: 'set', h: 8_500_000 },
        { u: 'Jalan masuk + carport beton / paving', v: 15, s: 'm²', h: 185_000 },
        { u: 'Taman, tanah subur + rumput gajah mini', v: 28, s: 'm²', h: 85_000 },
        { u: 'Tanaman & pot (6 kelompok)', v: 1, s: 'ls', h: 2_400_000 },
        { u: 'Area jemur + kanopi jemuran', v: 1, s: 'ls', h: 1_750_000 }
      ]}
    ],
    tambahan: [
      { u: 'Perizinan PBG/IMB + gambar kerja arsitek', v: 1, s: 'ls', h: 7_500_000 },
      { u: 'Jasa pengawasan / mandor (5% konstruksi)', v: 1, s: 'ls', h: 5_600_000 },
      { u: 'Cadangan risiko 7%', v: 1, s: 'ls', h: 8_900_000 }
    ]
  };

  // ============================================================
  // 10. JADWAL PELAKSANAAN
  // ============================================================
  const jadwal = [
    { t: 'Minggu 1', k: 'Persiapan', d: ['Pembersihan lahan & bouwplank', 'Papan nama + direksi kit', 'Pemesanan material utama'], dur: 1 },
    { t: 'Minggu 2–3', k: 'Tanah & Pondasi', d: ['Galian pondasi', 'Pasir urug + aanstamping', 'Pondasi batu belah', 'Urugan kembali'], dur: 2 },
    { t: 'Minggu 4', k: 'Struktur Bawah', d: ['Sloof beton + curing 7 hari', 'Kolom praktis tahap 1'], dur: 1 },
    { t: 'Minggu 5–7', k: 'Dinding & Struktur Atas', d: ['Pasang dinding bata', 'Plesteran & acian', 'Ring balok + kolom praktis'], dur: 3 },
    { t: 'Minggu 7–8', k: 'Kusen & Atap', d: ['Pasang kusen pintu/jendela', 'Kuda-kuda + gording + usuk', 'Penutup atap + nok + talang', 'Kanopi carport'], dur: 2 },
    { t: 'Minggu 9', k: 'Lantai & Plafon', d: ['Urugan + lantai kerja', 'Pelat lantai + keramik', 'Plafon GRC + list'], dur: 1 },
    { t: 'Minggu 10', k: 'MEP (Mekanikal-Elektrikal-Plumbing)', d: ['Instalasi listrik + panel', 'Instalasi air bersih & kotor', 'Septictank + resapan', 'Tandon + pompa'], dur: 1 },
    { t: 'Minggu 11', k: 'Finishing', d: ['Pengecatan interior & eksterior', 'Sanitair + aksesoris', 'Pembersihan akhir'], dur: 1 },
    { t: 'Minggu 12', k: 'Tapak & Serah Terima', d: ['Pagar + gerbang', 'Taman & lansekap', 'Testing & commissioning', 'Serah terima + garansi 1 tahun'], dur: 1 }
  ];

  // ============================================================
  // 11. CATATAN DESAIN / RASIONAL
  // ============================================================
  const rasional = [
    { j: 'Mengapa 3,00 x 7,00 m?', i: 'Kombinasi 3 x 7 m adalah salah satu dimensi tapak baku rumah tipe 21 selain 4 x 5,25 m dan 6 x 3,5 m. Bentuk memanjang (sempit-depan) memberi dua keuntungan: (1) seluruh ruang utama dapat memperoleh bukaan ke depan atau ke belakang, dan (2) sisi barat menjadi dinding kopel sehingga tidak ada kehilangan luas lahan untuk jarak samping.' },
    { j: 'Mengapa koridor di sisi barat (dinding kopel)?', i: 'Koridor tidak membutuhkan jendela, sehingga paling logis ditempatkan menempel pada dinding kopel yang memang tidak boleh/jarang diberi bukaan. Kamar tidur lalu menempel pada dinding timur yang terbuka, sehingga tetap mendapat cahaya dan ventilasi silang.' },
    { j: 'Mengapa kamar mandi di sudut belakang?', i: 'Zona basah dikumpulkan di belakang dekat dapur dan saluran pembuangan, memperpendek jaringan pipa, memudahkan kemiringan lantai ke floor drain, serta menjaga bagian depan rumah tetap kering dan bersih untuk menerima tamu.' },
    { j: 'Mengapa kamar mandi diakses dari dapur?', i: 'Ini konsekuensi wajar dari tapak 3 m: koridor selebar 0,80 m hanya bisa menjangkau satu ruang di baris belakang. Menempatkan pintu KM dari area dapur/servis adalah solusi yang lazim pada rumah tipe 21–36, dan tetap higienis selama dapur memiliki exhaust fan dan bak kontrol tersendiri. <strong>Alternatif:</strong> aplikasi ini menyediakan varian <em>ensuite</em> — pintu KM dipindah ke dinding kamar tidur (lihat tombol "Varian KM" di tab 3D).' },
    { j: 'Mengapa ruang tamu tidak disekat?', i: 'Pada luas 6,3 m², sekat akan menghabiskan 0,15 m tiap sisi plus ruang gerak pintu. Open plan ke koridor membuat pandangan tembus sampai ke dapur — trik klasik agar rumah mungil terasa 30% lebih luas. Zonasi tetap jelas lewat perbedaan lantai, plafon drop, dan pencahayaan.' },
    { j: 'Mengapa tinggi plafon 2,80 m?', i: 'Kepmen Kimpraswil 403/KPTS/M/2002 mensyaratkan tinggi langit-langit rata-rata minimal 2,80 m untuk rumah sederhana sehat. Tinggi ini juga memberi volume udara sehat ≈ 58,8 m³ untuk ruang tamu, cukup untuk 3–4 orang per 8 jam.' },
    { j: 'Kenyamanan termal pasif', i: 'Overstek atap 0,95 m di depan membayangi teras dan jendela utama, memotong radiasi matahari sore. Jendela silang (depan J1 ↔ belakang J3/J4) menghasilkan ventilasi lintas (cross ventilation) minimal 2 kali pergantian udara per jam. Dinding kopel di barat menghalangi panas barat yang paling menyengat.' },
    { j: 'Kesiapan pengembangan', i: 'Dinding kopel x = 0 m dan ring balok dirancang mampu menahan beban lantai dua parsial di atas zona depan, sehingga penambahan 1 kamar tidur di lantai 2 (mezzanine) dapat dilakukan tanpa membongkar struktur — cukup memeriksa ulang kolom dan pondasi setempat.' }
  ];

  // ============================================================
  // 12. REKAP LUAS
  // ============================================================
  const rekapLuas = [
    { n: 'Teras Sambut', a: 2.70 }, { n: 'Ruang Tamu & Keluarga', a: 6.30 },
    { n: 'Koridor', a: 2.375 }, { n: 'Kamar Tidur Utama', a: 5.125 },
    { n: 'Dapur & Area Cuci', a: 2.475 }, { n: 'Kamar Mandi', a: 2.025 }
  ];
  const luasBangunan = rekapLuas.reduce((s, r) => s + r.a, 0);   // 21.00

  // luas bersih (clear) — dikurangi 1/2 tebal dinding tiap sisi yang tertutup
  const OPEN = { teras: { e: 1, s: 1 }, koridor: { s: 1 } };
  function clear(r) {
    const o = OPEN[r.id] || {};
    const w = (r.x1 - r.x0) - (o.w ? 0 : T / 2) - (o.e ? 0 : T / 2);
    const d = (r.z1 - r.z0) - (o.s ? 0 : T / 2) - (o.n ? 0 : T / 2);
    return { w: Math.round(w * 1000) / 1000, d: Math.round(d * 1000) / 1000 };
  }

  return {
    meta: {
      judul: 'Rumah Tinggal Tipe 21',
      sub: 'Rumah Kopel Satu Lantai — 21,00 m²',
      kode: 'RT21-2026',
      pemilik: 'Klien',
      arsitek: 'Studio Desain Rumah Mungil',
      tanggal: 'Maret 2026',
      skala: 'Denah 1:50 — Tampak & Potongan 1:50',
      tinjauan: 'Kepmen Kimpraswil 403/KPTS/M/2002 & SNI 03-1733-2004'
    },
    T, H, YT, YB, B, SITE,
    rooms, walls, roof, carport, kusen, struktur, listrik, plumbing, site, rab, jadwal, rasional,
    rekapLuas, luasBangunan, clear,
    total() { return { luasTanah: site.luas, luasBangunan, kdb: site.kdb, klb: site.klb }; }
  };
})();

if (typeof module !== 'undefined') module.exports = MODEL;
