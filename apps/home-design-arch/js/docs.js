/* ============================================================
   docs.js — Dokumen teknis: spesifikasi, RAB, jadwal, detail ruang
   ============================================================ */
'use strict';

const DOCS = (() => {
  const M = MODEL;
  const Rp = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  const num = (n, d) => n.toLocaleString('id-ID', { minimumFractionDigits: d === undefined ? 2 : d, maximumFractionDigits: d === undefined ? 2 : d });
  const f2 = n => n.toFixed(2).replace('.', ',');

  // ============================================================
  //  RINGKASAN
  // ============================================================
  function ringkasan() {
    const t = M.total();
    const kpi = [
      ['Luas bangunan', '21,00 m²', '3,00 × 7,00 m'],
      ['Luas tanah', f2(t.luasTanah) + ' m²', '6,00 × 12,00 m'],
      ['Jumlah kamar tidur', '1 unit', '2,05 × 2,50 m'],
      ['Kamar mandi', '1 unit', '1,35 × 1,50 m'],
      ['Tinggi plafon', '2,80 m', 'bersih ±2,72 m'],
      ['Kemiringan atap', '30°', 'genteng beton'],
      ['KDB / KLB', (t.kdb * 100).toFixed(1).replace('.', ',') + ' % / ' + f2(t.klb), 'carport termasuk'],
      ['Daya listrik', '1.300 VA', '4 grup MCB'],
      ['Air bersih', '600 L tandon', '± 1,7 hari cadangan'],
      ['Perkiraan biaya', Rp(totalRAB().grand), '± ' + Rp(totalRAB().grand / 21) + '/m²']
    ];
    return `<div class="kpi-grid">${kpi.map(k => `
      <div class="kpi"><span class="kpi-k">${k[0]}</span>
        <span class="kpi-v">${k[1]}</span><span class="kpi-s">${k[2]}</span></div>`).join('')}</div>
    <div class="prose">${M.rasional.map(r => `<div class="rat"><h4>${r.j}</h4><p>${r.i}</p></div>`).join('')}</div>`;
  }

  // ============================================================
  //  DETAIL PER RUANG
  // ============================================================
  function ruang() {
    return `<div class="room-grid">` + M.rooms.map(r => {
      const c = M.clear(r);
      const furn = SCENE.FURN.filter(f => f.room === r.id);
      const lampu = M.listrik.titik.filter(t => {
        if (t.jns !== 'lampu') return false;
        return t.x >= r.x0 - 0.2 && t.x <= r.x1 + 0.2 && t.z >= r.z0 - 0.2 && t.z <= r.z1 + 0.2;
      });
      const stop = M.listrik.titik.filter(t =>
        (t.jns === 'saklar' || t.jns === 'stopkontak') &&
        t.x >= r.x0 - 0.35 && t.x <= r.x1 + 0.35 && t.z >= r.z0 - 0.35 && t.z <= r.z1 + 0.35);
      return `
      <article class="roomcard" id="rc-${r.id}">
        <header class="roomcard-h" style="--rc:rgb(${r.warna.join(',')})">
          <div>
            <span class="eyebrow">${r.kode} · ${r.jenis === 'luar' ? 'RUANG LUAR' : 'RUANG DALAM'}</span>
            <h3>${r.nama}</h3>
          </div>
          <div class="roomcard-a"><b>${f2((r.x1 - r.x0) * (r.z1 - r.z0))}</b><span>m² bruto</span></div>
        </header>
        <p class="roomcard-d">${r.desc}</p>
        <div class="dimrow">
          <div><span>Lebar (as)</span><b>${f2(r.x1 - r.x0)} m</b></div>
          <div><span>Panjang (as)</span><b>${f2(r.z1 - r.z0)} m</b></div>
          <div><span>Bersih</span><b>${f2(c.w)} × ${f2(c.d)} m</b></div>
          <div><span>Luas bersih</span><b>${f2(c.w * c.d)} m²</b></div>
          <div><span>Tinggi plafon</span><b>${r.id === 'mandi' ? '2,60' : '2,80'} m</b></div>
          <div><span>Volume udara</span><b>${num(c.w * c.d * (r.id === 'mandi' ? 2.6 : 2.8), 1)} m³</b></div>
        </div>
        <div class="rgrid">
          <div class="rblock">
            <span class="eyebrow">FURNITUR & PERABOT</span>
            <table class="tbl tight"><tbody>
              ${furn.map(f => `<tr><td><b>${f.nama}</b><div class="mut">${f.spec}</div></td></tr>`).join('') || '<tr><td class="mut">—</td></tr>'}
            </tbody></table>
          </div>
          <div class="rblock">
            <span class="eyebrow">FINISHING PERMUKAAN</span>
            <table class="tbl tight"><tbody>
              <tr><td>Lantai</td><td class="r">${labelLantai(r)}</td></tr>
              <tr><td>Dinding</td><td class="r">${labelDinding(r)}</td></tr>
              <tr><td>Plafon</td><td class="r">${r.plafon}</td></tr>
              <tr><td>Plint</td><td class="r">${r.jenis === 'luar' ? '—' : 'Kayu / HPL h = 100 mm'}</td></tr>
              <tr><td>Cat</td><td class="r">${r.jenis === 'luar' ? 'Eksterior weathershield' : 'Interior akrilik 2 lapis'}</td></tr>
            </tbody></table>
            <span class="eyebrow" style="margin-top:14px">PENCAHAYAAN & UDARA</span>
            <table class="tbl tight"><tbody>
              ${lampu.map(l => `<tr><td>${l.id} · Lampu</td><td class="r">${l.ket.replace(/^Lampu /, '')}</td></tr>`).join('')}
              ${stop.map(l => `<tr><td>${l.id} · ${l.jns === 'saklar' ? 'Saklar' : 'Stop kontak'}</td><td class="r">h = ${f2(l.h)} m</td></tr>`).join('')}
              <tr><td>Ventilasi</td><td class="r">${r.id === 'teras' ? 'Terbuka (ruang luar)' : r.id === 'koridor' ? 'Lintas dari ruang tamu & dapur' : 'Jendela + ventilasi silang'}</td></tr>
              <tr><td>Estimasi udara segar</td><td class="r">≥ 2× pergantian/jam</td></tr>
            </tbody></table>
          </div>
        </div>
        <div class="rblock" style="margin-top:14px">
          <span class="eyebrow">CATATAN DESAIN</span>
          <ul class="ulist">${r.poin.map(p => `<li>${p}</li>`).join('')}</ul>
        </div>
      </article>`;
    }).join('') + `</div>`;
  }

  const LBL = {
    keramik: 'Keramik 25×25 batu alam (anti-slip)',
    keramikKamar: 'Keramik / vinyl motif kayu 60×60',
    keramikDapur: 'Keramik 40×40 (mudah dibersihkan)',
    keramikMandi: 'Keramik 25×25 anti-slip, kemiringan 1 %',
    granit: 'Granit tile 60×60 (glazed porcelain)',
    batuAlam: 'Batu andesit / beton ekspos'
  };
  const DBL = {
    dinding: 'Bata merah + plester 1:4 + acian + cat eksterior',
    dindingDalam: 'Bata merah + plester + acian + cat interior',
    dindingKamar: 'Bata ringan/bata merah + cat interior low-VOC',
    dindingDapur: 'Bata + keramik 30×60 tinggi 0,90 m di area basah',
    dindingMandi: 'Bata + keramik 20×40 sampai tinggi 2,10 m',
    dindingKopel: 'Bata merah + plester + acian (tanpa bukaan)',
    acian: 'Plester + acian + cat eksterior'
  };
  const labelLantai = r => LBL[r.lantai] || r.lantai;
  const labelDinding = r => DBL[r.dinding] || r.dinding;

  // ============================================================
  //  SPESIFIKASI TEKNIS
  // ============================================================
  function spesifikasi() {
    const S = M.struktur;
    const blok = [
      ['A. Pekerjaan Tanah & Pondasi', [
        ['Pembersihan lahan', 'Striping 20 cm, buang akar & sampah organik'],
        ['Galian pondasi', 'Lebar 0,80 m × dalam 0,85 m, dinding galian tegak'],
        ['Dasar pondasi', 'Dipadatkan, capai tanah keras (Sondir ≥ 10 kg/cm²)'],
        ['Pasir urug', 't = 100 mm, pasir pasang bersih'],
        ['Aanstamping', 'Batu kosong t = 150 mm, disusun tegak & dipadatkan'],
        [S.pondasi.nama, S.pondasi.penampang + ' — dasar ' + S.pondasi.dasar + ' m'],
        [S.sloof.nama, S.sloof.besi + ' — elevasi ' + S.sloof.elevasi],
        ['Urugan kembali', 'Tanah sisa dipadatkan per lapis 200 mm']
      ]],
      ['B. Struktur', [
        [S.kolom.nama, S.kolom.besi + ' — ' + S.kolom.jarak + ' (total ' + S.kolom.jml + ' titik)'],
        [S.ringbalok.nama, S.ringbalok.besi + ' — elevasi ' + S.ringbalok.elevasi],
        [S.kudakuda.nama, S.kudakuda.bahan],
        ['Gording', S.kudakuda.gording],
        ['Usuk & reng', S.kudakuda.usuk + ' ; ' + S.kudakuda.reng],
        ['Mutu beton', "fc' 19,3 MPa (setara K-225), slump 8–12 cm"],
        ['Baja tulangan', 'BjTS 420 (ulir) untuk Ø10; BjTP 280 (polos) untuk Ø6'],
        ['Selimut beton', '25 mm (terlindung dari korosi)'],
        ['Bekisting', 'Multipleks 12 mm + perancah, dibuka setelah 7 hari']
      ]],
      ['C. Dinding & Plesteran', [
        [S.dindingPengisi.nama, 'Bata merah 5×11×22 cm, mutu min. kelas 50'],
        ['Spesi pemasangan', '1 PC : 4 PS, tebal nat 10–15 mm'],
        [S.dindingPengisi.plester, 'Diplester rata, sudut siku 90°'],
        [S.dindingPengisi.acian, 'Finishing halus siap cat'],
        ['Kolom praktis', 'Dipasang tiap ≤ 3 m dan tiap pertemuan dinding'],
        ['Angkur', 'Stek besi Ø8 tiap 6 lapis bata, tertanam ke kolom']
      ]],
      ['D. Lantai', [
        [S.lantai.urugan, 'Per lapis 200 mm, disiram & dipadatkan'],
        [S.lantai.pasir, 'Pasir urug bawah pelat'],
        [S.lantai.lantaiKerja, 'Penyapuan + curing 3 hari'],
        [S.lantai.pelat, 'Mutu beton sama dengan sloof'],
        [S.lantai.finish, 'Nat keramik 2 mm, finishing grouting'],
        ['Elevasi lantai', 'Lantai bangunan +0,00; pekarangan −0,45 m'],
        ['Anti hawa dingin', 'Lantai ruang dalam dapat ditambah acid-proof / underlayer (opsional)']
      ]],
      ['E. Atap & Plafon', [
        [M.roof.tipe, 'Kemiringan ' + M.roof.sudut + '° — minimal 25° untuk genteng beton'],
        ['Penutup atap', 'Genteng beton flat, berat ± 42 kg/m², modulus 11 bh/m²'],
        ['Nok', 'Genteng nok beton + mortar + sealant PU'],
        ['Lisplang', 'GRC board 3/20 mm, dicat 2 lapis'],
        [M.roof.talang, 'Kemiringan talang minimal 0,5 %'],
        ['Talang carport', 'Air dibuang ke taman samping timur'],
        ['Plafon', 'GRC board 9 mm + rangka hollow galvanis 40×40'],
        ['List plafon', 'Shadowline 20 mm (kesan plafon mengambang)'],
        ['Manhole', '0,60 × 0,60 m di koridor untuk pemeliharaan']
      ]],
      ['F. Kusen, Pintu & Jendela', [
        ['Kusen pintu & jendela', 'Kayu kamper oven / meranti, kadar air < 19 %'],
        ['Ukuran kayu kusen', '6 × 12 cm (pintu & jendela utama), 5 × 10 cm (kusen dalam)'],
        ['Pintu kamar mandi', 'PVC foam board 8 mm — tahan air, tidak mengembang'],
        ['Jendela aluminium', 'Aluminium powder coating 3" (dapur & kamar mandi)'],
        ['Kaca', 'Kaca bening 5 mm (ruang utama), kaca buram 5 mm (KM)'],
        ['Kasa nyamuk', 'Stainless 18 mesh pada seluruh bukaan'],
        ['Finishing', 'Duco / melamik 1 lapis dasar + 2 lapis akhir'],
        ['Aksesoris', 'Engsel stainless 4", handle, kunci silinder, door closer (opsional)']
      ]],
      ['G. Sanitasi & Plumbing', [
        ['Pipa air bersih', M.plumbing.jalur],
        ['Sumber air', M.plumbing.sumber],
        ['Tandon', M.plumbing.tandon.kapasitas + ' — ' + M.plumbing.tandon.posisi],
        ['Pompa', M.plumbing.pompa.nama],
        ['Kloset', 'Duduk monoblock, dual flush 3/6 L, jarak septic ≤ 5 m'],
        ['Shower', 'Shower set + kran mixer, tekanan air min. 0,5 bar'],
        ['Wastafel', 'Gantung keramik 0,40 × 0,35 m'],
        ['Floor drain', 'Stainless grill 4", kemiringan lantai 1 % ke arah drain'],
        ['Septictank', '1,20 × 2,00 m, 3 kompartemen + biofilter sarang tawon'],
        ['Ventilasi pipa', 'Ø2" naik ≥ 60 cm di atas atap'],
        ['Sumur resapan', 'Ø1,00 × 1,50 m, dinding bata berlubang + ijuk']
      ]],
      ['H. Elektrikal', [
        ['Daya terpasang', M.listrik.daya],
        ['Titik lampu', '10 titik — LED 9–18 W (total ± 130 W)'],
        ['Saklar & stop kontak', '11 titik, tinggi 1,20–1,40 m'],
        ['Kabel', M.listrik.kabel],
        ['Conduit', 'PVC 20 mm (dalam dinding) & 25 mm (plafon)'],
        ['Panel', 'Box MCB 4 grup + kWh meter di dinding teras'],
        ['Pentanahan', 'Batang tembaga 1,5 m + BC 6 mm², tahanan ≤ 5 ohm'],
        ['Proteksi', 'MCB 6 A (lampu), 10 A (stop kontak), ELCB 30 mA'],
        ['Penangkal petir', 'Opsional — elektrostatis / franklin, radius proteksi 25 m']
      ]],
      ['I. Finishing & Pengecatan', [
        ['Cat eksterior', 'Weathershield akrilik, 1 lapis dasar + 2 lapis akhir'],
        ['Cat interior', 'Interior emulsion low-VOC, 2 lapis'],
        ['Cat plafon', 'Plafon emulsion putih, 2 lapis'],
        ['Cat kayu', 'Duco / melamik, dempul + 2 lapis akhir'],
        ['Cat besi', 'Zinc chromate primer + 2 lapis top coat'],
        ['Nat & grouting', 'Grouting semen warna, nat 2 mm'],
        ['Pembersihan', 'Pembersihan akhir + poles keramik sebelum serah terima']
      ]]
    ];
    return blok.map(b => `
      <section class="spec-block">
        <h3>${b[0]}</h3>
        <table class="tbl spec">
          <colgroup><col style="width:34%"><col></colgroup>
          <tbody>${b[1].map(r => `<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join('')}</tbody>
        </table>
      </section>`).join('');
  }

  // ============================================================
  //  RAB
  // ============================================================
  function hitungRAB() {
    return M.rab.kategori.map(k => {
      const items = k.item.map(i => Object.assign({}, i, { jml: i.v * i.h }));
      const sub = items.reduce((s, i) => s + i.jml, 0);
      return Object.assign({}, k, { items, sub });
    });
  }

  function totalRAB() {
    const kat = hitungRAB();
    const konstruksi = kat.reduce((s, k) => s + k.sub, 0);
    const tambahan = M.rab.tambahan.reduce((s, i) => s + i.v * i.h, 0);
    return { kat, konstruksi, tambahan, grand: konstruksi + tambahan };
  }

  function rekapScope(T) {
    const get = kode => (T.kat.find(k => k.k === kode) || { sub: 0 }).sub;
    const bangunanInti = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].reduce((s, k) => s + get(k), 0);
    const tapak = get('I');
    const J = T.tambahan;
    const rows = [
      ['Bangunan inti (A–H)', 'Struktur, dinding, lantai, atap, plafon, kusen, cat, sanitasi dalam, elektrikal', bangunanInti, 1],
      ['Tapak & lansekap (I)', 'Pagar 52 m², gerbang 2,8 m, paving carport, taman, area jemur', tapak, 0],
      ['Perizinan, pengawasan, cadangan (J)', 'PBG/IMB, gambar kerja, mandor, cadangan risiko 7 %', J, 0]
    ];
    return `<section class="spec-block">
      <h3>Rekapitulasi Ruang Lingkup</h3>
      <table class="tbl">
        <colgroup><col style="width:24%"><col><col style="width:16%"><col style="width:15%"></colgroup>
        <thead><tr><th>Kelompok</th><th>Cakupan</th><th class="r">Jumlah</th><th class="r">per m² bangunan</th></tr></thead>
        <tbody>
          ${rows.map(r => `<tr><td><b>${r[0]}</b></td><td class="mut" style="color:#7a8399;font-size:12px">${r[1]}</td><td class="r b">${Rp(r[2])}</td><td class="r">${Rp(r[2] / 21)}</td></tr>`).join('')}
          <tr class="sub"><td colspan="2">Total</td><td class="r">${Rp(T.grand)}</td><td class="r">${Rp(T.grand / 21)}</td></tr>
          <tr><td colspan="2"><b>Pembanding — hanya bangunan inti (A–H)</b></td><td class="r b">${Rp(bangunanInti)}</td><td class="r b">${Rp(bangunanInti / 21)}</td></tr>
        </tbody>
      </table>
      <p class="note">Angka <b>${Rp(bangunanInti / 21)}/m²</b> untuk bangunan inti setara dengan paket borongan menengah lengkap (keramik granit, plafon GRC, kusen kayu, sanitair, kitchen set, panel listrik) — masih dalam rentang wajar pasar Rp 4,5–8 juta/m² untuk bangunan mungil, karena biaya per m² selalu naik ketika luas bangunan menyusut (biaya tetap seperti pondasi, atap, dan instalasi tersebar ke luas yang lebih kecil).</p>
    </section>`;
  }

  function rab() {
    const T = totalRAB();
    const pct = T.grand;
    return `
    <div class="rab-head">
      <div class="rab-box"><span>Biaya konstruksi (A–I)</span><b>${Rp(T.konstruksi)}</b></div>
      <div class="rab-box"><span>Perizinan, pengawasan & cadangan</span><b>${Rp(T.tambahan)}</b></div>
      <div class="rab-box accent"><span>Total anggaran</span><b>${Rp(T.grand)}</b></div>
      <div class="rab-box"><span>Biaya per m² bangunan</span><b>${Rp(T.grand / M.luasBangunan)}</b></div>
    </div>
    <p class="note">${M.rab.satuanKet} — harga satuan bersifat indikatif dan perlu diverifikasi ulang dengan penawaran kontraktor setempat saat pelaksanaan.</p>
    <div class="scope-note">
      <b>Ruang lingkup yang membuat angka ini lebih tinggi dari patokan "Rp 4–5 juta/m²".</b>
      Patokan pasar tersebut umumnya hanya mencakup <em>struktur + finishing dasar bangunan inti</em>, tanpa pagar, gerbang, kanopi carport, septictank, tandon + pompa, lansekap, perizinan, pengawasan, dan cadangan risiko. Rincian pembanding:
    </div>
    ${rekapScope(T)}

    <div class="bars">${T.kat.map(k => `
      <div class="bar-row"><span class="bar-k">${k.k}. ${k.nama}</span>
      <span class="bar-t"><i style="width:${(k.sub / pct * 100).toFixed(1)}%"></i></span>
      <b class="bar-v">${Rp(k.sub)}</b></div>`).join('')}
      <div class="bar-row"><span class="bar-k">J. Perizinan, pengawasan &amp; cadangan</span>
      <span class="bar-t"><i style="width:${(T.tambahan / pct * 100).toFixed(1)}%"></i></span>
      <b class="bar-v">${Rp(T.tambahan)}</b></div>
    </div>

    ${T.kat.map(k => `
      <section class="spec-block">
        <h3>${k.k}. ${k.nama}</h3>
        <table class="tbl rab">
          <colgroup><col style="width:44%"><col style="width:10%"><col style="width:8%"><col style="width:18%"><col style="width:20%"></colgroup>
          <thead><tr><th>Uraian pekerjaan</th><th>Volume</th><th>Sat.</th><th>Harga satuan</th><th>Jumlah</th></tr></thead>
          <tbody>${k.items.map(i => `<tr><td>${i.u}</td><td class="r">${num(i.v, i.v % 1 ? 2 : 0)}</td><td>${i.s}</td><td class="r">${Rp(i.h)}</td><td class="r b">${Rp(i.jml)}</td></tr>`).join('')}
          <tr class="sub"><td colspan="4">Subtotal ${k.k}</td><td class="r">${Rp(k.sub)}</td></tr></tbody>
        </table>
      </section>`).join('')}

    <section class="spec-block">
      <h3>J. Perizinan, Pengawasan &amp; Cadangan</h3>
      <table class="tbl rab">
        <colgroup><col style="width:44%"><col style="width:10%"><col style="width:8%"><col style="width:18%"><col style="width:20%"></colgroup>
        <tbody>${M.rab.tambahan.map(i => `<tr><td>${i.u}</td><td class="r">${num(i.v, 0)}</td><td>${i.s}</td><td class="r">${Rp(i.h)}</td><td class="r b">${Rp(i.v * i.h)}</td></tr>`).join('')}
        <tr class="sub"><td colspan="4">Subtotal J</td><td class="r">${Rp(T.tambahan)}</td></tr></tbody>
      </table>
    </section>

    <section class="spec-block total">
      <table class="tbl rab">
        <tbody>
          <tr class="sub"><td>Total A + B + … + I (konstruksi)</td><td class="r">${Rp(T.konstruksi)}</td></tr>
          <tr class="sub"><td>Total J (perizinan, pengawasan, cadangan)</td><td class="r">${Rp(T.tambahan)}</td></tr>
          <tr class="grand"><td>TOTAL ANGGARAN</td><td class="r">${Rp(T.grand)}</td></tr>
          <tr><td>Pembulatan</td><td class="r">${Rp(Math.ceil(T.grand / 1e6) * 1e6)}</td></tr>
          <tr><td>Biaya per m² luas bangunan (21,00 m²)</td><td class="r">${Rp(T.grand / 21)}</td></tr>
          <tr><td>Biaya per m² luas tanah (72,00 m²)</td><td class="r">${Rp(T.grand / 72)}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="spec-block">
      <h3>Rencana Pembayaran (Termin)</h3>
      <table class="tbl">
        <thead><tr><th>Termin</th><th>Pekerjaan tercapai</th><th class="r">Porsi</th><th class="r">Nilai</th></tr></thead>
        <tbody>
          ${[['I', 'Mobilisasi + pondasi selesai', 0.15], ['II', 'Struktur & dinding selesai', 0.20],
        ['III', 'Kusen & atap selesai', 0.20], ['IV', 'Lantai, plafon, MEP selesai', 0.20],
        ['V', 'Finishing & tapak selesai', 0.15], ['VI', 'Serah terima + retensi', 0.10]]
        .map(t => `<tr><td><b>${t[0]}</b></td><td>${t[1]}</td><td class="r">${(t[2] * 100).toFixed(0)} %</td><td class="r b">${Rp(T.grand * t[2])}</td></tr>`).join('')}
        </tbody>
      </table>
      <p class="note">Retensi 5 % ditahan dari termin VI selama masa pemeliharaan 3 bulan untuk menjamin perbaikan cacat pelaksanaan.</p>
    </section>

    <section class="spec-block">
      <h3>Alternatif Penghematan &amp; Peningkatan</h3>
      <table class="tbl">
        <thead><tr><th>Pilihan</th><th>Dampak biaya</th><th>Keterangan</th></tr></thead>
        <tbody>
          <tr><td>Struktur baja ringan (ganti kayu)</td><td class="r save">− ${Rp(2_600_000)}</td><td>Lebih tahan rayap, umur pakai lebih panjang, tapi gema hujan lebih berisik.</td></tr>
          <tr><td>Genteng metal pasir</td><td class="r save">− ${Rp(1_900_000)}</td><td>Bobot 1/6 genteng beton sehingga rangka bisa lebih ringan.</td></tr>
          <tr><td>Dinding bata ringan (hebel)</td><td class="r save">− ${Rp(1_400_000)}</td><td>Menghemat 2–3 minggu waktu pelaksanaan, perlu plesteran khusus.</td></tr>
          <tr><td>Paving block carport (ganti beton)</td><td class="r save">− ${Rp(900_000)}</td><td>Resapan air lebih baik, mudah dibongkar bila ada perbaikan pipa.</td></tr>
          <tr><td>Kitchen set custom HPL</td><td class="r add">+ ${Rp(6_500_000)}</td><td>Naik dari standard menjadi bentuk L dengan penyimpanan penuh.</td></tr>
          <tr><td>Kanopi transparan polycarbonate</td><td class="r add">+ ${Rp(3_200_000)}</td><td>Carport lebih terang, tidak mengurangi pencahayaan taman.</td></tr>
          <tr><td>Penambahan kamar tidur kedua (mezzanine)</td><td class="r add">+ ${Rp(42_000_000)}</td><td>Memakai ruang loteng 1,0 m; perlu penguatan kolom & pondasi setempat.</td></tr>
          <tr><td>Panel surya 1 kWp on-grid</td><td class="r add">+ ${Rp(14_500_000)}</td><td>Menurunkan tagihan listrik ± 60 %, balik modal 6–8 tahun.</td></tr>
        </tbody>
      </table>
    </section>`;
  }

  // ============================================================
  //  JADWAL
  // ============================================================
  function jadwal() {
    const total = M.jadwal.reduce((s, j) => s + j.dur, 0);
    let acc = 0;
    const rows = M.jadwal.map(j => {
      const start = acc; acc += j.dur;
      return `<tr>
        <td class="jh"><b>${j.t}</b><span>${j.k}</span></td>
        <td><ul class="ulist tight">${j.d.map(d => `<li>${d}</li>`).join('')}</ul></td>
        <td class="gantt"><span class="gt" style="margin-left:${start / total * 100}%;width:${j.dur / total * 100}%">${j.dur} mgg</span></td>
      </tr>`;
    }).join('');
    return `
    <p class="note">Total masa pelaksanaan <b>${total} minggu (± ${(total / 4.3).toFixed(1)} bulan)</b> untuk pekerjaan konstruksi, belum termasuk perizinan PBG (± 3–6 minggu) dan masa pemeliharaan 3 bulan.</p>
    <table class="tbl jadwal">
      <thead><tr><th style="width:16%">Periode</th><th style="width:44%">Lingkup pekerjaan</th><th>Kurva waktu</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <h3 class="h3s">Kurva S — Rencana Progres Kumulatif</h3>
    <div class="kurva">${kurvaS()}</div>
    <h3 class="h3s">Tahapan Kritis (milestone)</h3>
    <table class="tbl">
      <thead><tr><th>Milestone</th><th>Kriteria selesai</th><th>Pengaruh bila terlambat</th></tr></thead>
      <tbody>
        <tr><td>M1 — Pondasi selesai</td><td>Seluruh pondasi batu belah + sloof tercor & curing 7 hari</td><td>Menunda seluruh pekerjaan di atasnya; curing tidak boleh dipercepat.</td></tr>
        <tr><td>M2 — Struktur atas selesai</td><td>Dinding, kolom praktis, dan ring balok selesai</td><td>Kusen & atap tidak dapat dimulai; risiko dinding rembes bila dibiarkan lama terbuka.</td></tr>
        <tr><td>M3 — Atap tertutup (bebas hujan)</td><td>Genteng terpasang 100 % + nok + talang</td><td>Pekerjaan dalam (plafon, listrik, cat) tidak dapat dimulai dan basah terancam.</td></tr>
        <tr><td>M4 — Instalasi tertutup</td><td>Semua jalur MEP selesai sebelum plafon ditutup</td><td>Perbaikan setelah plafon tertutup memerlukan bongkar-pasang plafon.</td></tr>
        <tr><td>M5 — Serah terima</td><td>Testing & commissioning + daftar cacat selesai</td><td>Retensi tidak dicairkan; garansi mulai berjalan setelah BAST.</td></tr>
      </tbody>
    </table>
    <h3 class="h3s">Pengendalian Mutu (quality control) pada Tahap Kritis</h3>
    <table class="tbl">
      <thead><tr><th>Tahap</th><th>Yang diperiksa</th><th>Cara & alat</th></tr></thead>
      <tbody>
        <tr><td>Sebelum cor sloof/kolom</td><td>Diameter, jumlah, jarak, dan selimut besi</td><td>Visual + meteran; foto dokumentasi tiap sebelum pengecoran</td></tr>
        <tr><td>Pengecoran</td><td>Slump 8–12 cm, tidak ada segregasi, dipadatkan</td><td>Slump test per truk; vibrator internal</td></tr>
        <tr><td>Pasangan dinding</td><td>Tegak, lurus, nat terisi penuh, angkur terpasang</td><td>Waterpass, lot (unting-unting), benang</td></tr>
        <tr><td>Rangka atap</td><td>Kemiringan 30°, jarak usuk, sekrup/baut lengkap</td><td>Meteran, waterpass, kencang baut</td></tr>
        <tr><td>Instalasi listrik</td><td>Tahanan isolasi & pentanahan</td><td>Megger 500 V, earth tester</td></tr>
        <tr><td>Instalasi pipa</td><td>Tidak bocor pada uji tekan</td><td>Uji 10 bar selama 30 menit</td></tr>
        <tr><td>Sebelum serah terima</td><td>Keramik tidak kopong, tidak ada retak/rembes</td><td>Ketuk keramik, uji siram, periksa plafon</td></tr>
      </tbody>
    </table>`;
  }

  function kurvaS() {
    // progres kumulatif per minggu
    const bobot = [3, 6, 7, 9, 10, 11, 11, 10, 9, 8, 8, 8]; // sum 100
    let cum = 0;
    const pts = [0].concat(bobot.map(b => (cum += b)));
    const W = 720, H = 210, pad = 40;
    const x = i => pad + i / pts.length * (W - pad * 2);
    const y = v => H - pad - v / 100 * (H - pad * 2);
    let path = '', area = '';
    pts.forEach((v, i) => { path += (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1) + ' '; });
    area = path + `L${x(pts.length - 1).toFixed(1)} ${y(0)} L${pad} ${y(0)} Z`;
    let grid = '';
    for (let g = 0; g <= 100; g += 20) {
      grid += `<line x1="${pad}" y1="${y(g)}" x2="${W - pad}" y2="${y(g)}" stroke="rgba(45,49,66,0.10)" stroke-width="1"/>`;
      grid += `<text x="${pad - 6}" y="${y(g) + 3}" text-anchor="end" font-size="10" fill="#7a8399" font-family="Geist Mono">${g}%</text>`;
    }
    for (let i = 0; i <= pts.length; i++) {
      grid += `<line x1="${x(i)}" y1="${y(0)}" x2="${x(i)}" y2="${y(0) + 4}" stroke="rgba(45,49,66,0.25)"/>`;
      if (i < pts.length) grid += `<text x="${x(i + 0.5)}" y="${y(0) + 16}" text-anchor="middle" font-size="9.5" fill="#4f5d75" font-family="Geist Mono">M${i + 1}</text>`;
    }
    let dots = '';
    pts.forEach((v, i) => {
      if (i % 2 === 0 || i === pts.length) dots += `<circle cx="${x(i).toFixed(1)}" cy="${y(v).toFixed(1)}" r="3" fill="#eb6c36"/><text x="${x(i).toFixed(1)}" y="${(y(v) - 8).toFixed(1)}" text-anchor="middle" font-size="9.5" fill="#2d3142" font-family="Geist Mono">${v}%</text>`;
    });
    return `<svg viewBox="0 0 ${W} ${H}" class="kurva-svg">
      ${grid}
      <path d="${area}" fill="rgba(235,108,54,0.10)"/>
      <path d="${path}" fill="none" stroke="#eb6c36" stroke-width="2"/>
      ${dots}
      <text x="${pad}" y="${H - 4}" font-size="10" fill="#4f5d75" font-family="Geist Mono">MINGGU 0</text>
      <text x="${W - pad}" y="${H - 4}" text-anchor="end" font-size="10" fill="#4f5d75" font-family="Geist Mono">MINGGU ${pts.length}</text>
    </svg>`;
  }

  // ============================================================
  //  CATATAN & REKOMENDASI
  // ============================================================
  function catatan() {
    return `
    <div class="cols2">
      <section class="spec-block">
        <h3>Hal yang paling sering salah pada rumah tipe 21</h3>
        <table class="tbl">
          <thead><tr><th>Kesalahan</th><th>Akibat</th><th>Seharusnya</th></tr></thead>
          <tbody>
            <tr><td>Memakai kasur 160×200 di kamar 1,9×2,35 m</td><td>Pintu tidak bisa dibuka penuh, lemari tidak masuk</td><td>Maksimal kasur 120×200 m</td></tr>
            <tr><td>Membuat 2 kamar dari luas 21 m²</td><td>Kamar 2×2 m tanpa jendela, rumah pengap</td><td>1 kamar + ruang serbaguna (denah ini)</td></tr>
            <tr><td>Menyekat ruang tamu penuh</td><td>Rumah terasa 30 % lebih sempit</td><td>Open plan ke koridor &amp; dapur</td></tr>
            <tr><td>Kamar mandi tanpa jendela/exhaust</td><td>Jamur, bau, dinding cepat rusak</td><td>Jendela 0,70×0,60 + exhaust fan 6"</td></tr>
            <tr><td>Plafon lebih rendah dari 2,70 m</td><td>Panas, pengap, gagal syarat rumah sehat</td><td>2,80 m sesuai Kepmen Kimpraswil</td></tr>
            <tr><td>Mengabaikan kemiringan lantai KM</td><td>Air menggenang, keramik lepas</td><td>Slope 1 % ke floor drain, 2 titik drain</td></tr>
            <tr><td>Tidak memisahkan air hujan &amp; air kotor</td><td>Septictank cepat penuh &amp; meluap</td><td>Air hujan → sumur resapan langsung</td></tr>
            <tr><td>Tidak menyiapkan jalur pengembangan</td><td>Renovasi harus bongkar struktur</td><td>Ring balok &amp; kolom disiapkan untuk lantai 2 parsial</td></tr>
          </tbody>
        </table>
      </section>
      <section class="spec-block">
        <h3>Trik membuat 21 m² terasa 30 m²</h3>
        <ul class="ulist">
          <li><b>Pandangan tembus (sight line).</b> Dari pintu masuk, mata harus dapat melihat sampai dinding terjauh. Open plan ke koridor membuat rumah terasa memanjang.</li>
          <li><b>Warna plafon lebih muda dari dinding.</b> Plafon putih dan dinding off-white membuat langit-langit terasa meninggi.</li>
          <li><b>Perabot rendah &amp; berkaki.</b> Sofa dan tempat tidur berkaki menampakkan lantai — lantai yang terlihat = luas yang terasa.</li>
          <li><b>Satu warna lantai menerus.</b> Granit 60×60 satu warna dari teras ke dapur menghilangkan garis pemisah ruang.</li>
          <li><b>Cermin dinding besar.</b> Cermin 0,45 × 1,50 m di koridor menggandakan kesan kedalaman tanpa memakan lantai.</li>
          <li><b>Pencahayaan berlapis.</b> Lampu utama + downlight + lampu dinding memberi kesan ruang bernuansa, bukan sekadar kotak terang.</li>
          <li><b>Penyimpanan vertikal.</b> Semua lemar diletakkan menggantung atau sampai plafon; tidak ada barang berserakan di lantai.</li>
          <li><b>Overstek &amp; teras hijau.</b> Satu pot besar di teras mengalihkan perhatian dari ukuran bangunan ke suasana.</li>
        </ul>
      </section>
    </div>
    <section class="spec-block">
      <h3>Rekomendasi lanjutan (roadmap pengembangan)</h3>
      <table class="tbl">
        <thead><tr><th>Tahap</th><th>Kegiatan</th><th>Perkiraan biaya</th><th>Catatan teknis</th></tr></thead>
        <tbody>
          <tr><td>0–1 tahun</td><td>Settling, pengamatan retak rambut, penyesuaian lanskap</td><td>${Rp(1_500_000)}</td><td>Retak rambut pada plester normal; perbaiki dengan dempul elastis.</td></tr>
          <tr><td>1–2 tahun</td><td>Tambah kanopi area jemur + gudang kecil 1,5 m² di belakang</td><td>${Rp(9_000_000)}</td><td>Gunakan rangka baja ringan, tidak membebani pondasi utama.</td></tr>
          <tr><td>2–4 tahun</td><td>Mezzanine 1 kamar tidur anak di atas zona depan</td><td>${Rp(42_000_000)}</td><td>Periksa kolom &amp; pondasi setempat; tinggi loteng bersih 0,9–1,0 m perlu ditambah dengan menaikkan nok atau memakai atap baru.</td></tr>
          <tr><td>3–5 tahun</td><td>Panel surya 1 kWp + pemanas air matahari</td><td>${Rp(18_000_000)}</td><td>Arahkan panel ke utara dengan kemiringan 10–15° agar optimal di lintang selatan.</td></tr>
          <tr><td>5+ tahun</td><td>Pengecatan ulang eksterior + perawatan atap</td><td>${Rp(7_500_000)}</td><td>Siklus 5 tahunan; periksa sealant nok dan kebersihan talang setiap musim hujan.</td></tr>
        </tbody>
      </table>
    </section>
    <section class="spec-block">
      <h3>Perawatan rutin (checklist tahunan)</h3>
      <table class="tbl">
        <thead><tr><th>Frekuensi</th><th>Kegiatan</th></tr></thead>
        <tbody>
          <tr><td>Bulanan</td><td>Bersihkan talang &amp; saringan air; periksa kebocoran keran; bersihkan floor drain.</td></tr>
          <tr><td>3 bulan</td><td>Periksa sealant nok atap; kencangkan engsel &amp; handle pintu; bersihkan filter exhaust fan.</td></tr>
          <tr><td>6 bulan</td><td>Kuras tandon air; periksa tekanan pompa; cek tanda kebocoran pada plafon; lumut pada dinding luar.</td></tr>
          <tr><td>1 tahun</td><td>Sedot septictank bila sudah ≥ 70 % penuh; periksa pentanahan listrik; cat ulang bagian yang mengelupas.</td></tr>
          <tr><td>5 tahun</td><td>Pengecatan ulang eksterior menyeluruh; periksa kuda-kuda &amp; gording dari serangan rayap.</td></tr>
        </tbody>
      </table>
    </section>
    <section class="spec-block">
      <h3>Dasar acuan &amp; standar</h3>
      <ul class="ulist">
        <li>Keputusan Menteri Permukiman dan Prasarana Wilayah No. 403/KPTS/M/2002 tentang Pedoman Teknis Pembangunan Rumah Sederhana Sehat — luas minimal 9 m²/orang, tinggi langit-langit rata-rata 2,80 m.</li>
        <li>SNI 03-1733-2004 tentang Tata Cara Perencanaan Lingkungan Perumahan di Perkotaan — kebutuhan luas minimal 36 m² untuk 4 orang.</li>
        <li>SNI 03-1979-1990 / SNI 03-0675-1989 tentang Spesifikasi Ukuran Kusen, Daun Pintu &amp; Daun Jendela Kayu.</li>
        <li>SNI 2847-2019 tentang Persyaratan Beton Struktural untuk Bangunan Gedung.</li>
        <li>SNI 1726-2019 tentang Tata Cara Perencanaan Ketahanan Gempa untuk Struktur Bangunan Gedung.</li>
        <li>Permenkes RI No. 1077/Menkes/Per/V/2011 tentang Pedoman Penyehatan Udara dalam Ruang Rumah.</li>
        <li>Peraturan Daerah setempat tentang Koefisien Dasar Bangunan (KDB) dan Garis Sempadan Bangunan (GSB).</li>
      </ul>
    </section>`;
  }

  return { ringkasan, ruang, spesifikasi, rab, jadwal, catatan, totalRAB, Rp, f2 };
})();

if (typeof module !== 'undefined') module.exports = DOCS;
