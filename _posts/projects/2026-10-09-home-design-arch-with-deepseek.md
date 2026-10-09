---
layout: post
title:  "Home Design Arch with DeepSeek"
date:   2026-10-09 15:10:00 +0700
categories: projects project
comments: false
cover: /images/og/2026-10-09-home-design-arch-with-deepseek.png
---

Bukan cuma denah di kertas. Ini paket desain rumah **tipe 21** yang lengkap: 15 lembar gambar kerja yang bisa dicetak, model 3D yang bisa diputar dan dibedah per kamar, spesifikasi bahan, jadwal pelaksanaan, dan RAB — semuanya ada di dalam **satu halaman HTML statis**.

<div style="margin:26px 0 8px;display:flex;gap:12px;flex-wrap:wrap;align-items:center">
  <a href="/apps/home-design-arch/" target="_blank" rel="noopener"
     style="display:inline-block;background:#147a6b;color:#fff;padding:12px 22px;border-radius:6px;font-weight:600;text-decoration:none;line-height:1.2">
     Buka aplikasi layar penuh →
  </a>
  <span style="font-size:13px;opacity:.72">tanpa server · tanpa login · tanpa internet</span>
</div>

<iframe src="/apps/home-design-arch/" loading="lazy" title="Rumah Tipe 21/72 — Blueprint &amp; Model 3D"
  style="width:100%;height:min(88vh,880px);border:1px solid rgba(0,0,0,.15);border-radius:8px;background:#f5f5f5;display:block;margin:14px 0 8px"></iframe>

<p style="font-size:13px;opacity:.72;margin-top:0">Pratinjau di atas adalah aplikasinya yang asli, bukan rekaman. Untuk kontrol keyboard (WASD), <b>klik dulu di dalam pratinjau</b> supaya fokus pindah ke iframe — perilaku bawaan peramban. Dari ponsel, pratinjau terasa sempit; tombol hijau di atas membukanya di tab sendiri.</p>

## Kenapa tipe 21

Tipe 21 itu luas bangunan **21 m²**. Angka itu terdengar mustahil untuk satu rumah yang layak, dan memang di situlah seluruh persoalannya. Hampir semua desain tipe 21 di pasaran gagal di satu titik yang sama: **kamar tidur tidak punya dinding luar**, jadi tidak ada jendela, jadi rumahnya pengap.

Di desain ini masalah itu dipecahkan dengan urutan terbalik. Saya mulai dari yang tidak bisa dikompromikan:

1. **Kamar tidur wajib menyentuh dinding luar.** Tidak bisa ditawar.
2. Dinding barat adalah **dinding kopel** — menempel tetangga, jadi tidak boleh dan tidak perlu ada bukaan.
3. Maka koridor diletakkan **menempel dinding kopel** (koridor memang tidak butuh jendela), dan kamar tidur didorong ke dinding timur yang terbuka.

Dari situ semuanya jatuh ke tempatnya sendiri.

| # | Ruang | As-ke-as (m) | Bruto (m²) | Bersih (m) | Bersih (m²) |
|---|-------|--------------|-----------|------------|-------------|
| 1 | Teras Sambut | 3,00 × 0,90 | 2,70 | 2,92 × 0,82 | 2,41 |
| 2 | Ruang Tamu + Keluarga | 3,00 × 2,10 | 6,30 | 2,85 × 1,95 | 5,56 |
| 3 | Koridor | 0,95 × 2,50 | 2,38 | 0,80 × 2,42 | 1,94 |
| 4 | Kamar Tidur | 2,05 × 2,50 | 5,13 | 1,90 × 2,35 | 4,46 |
| 5 | Dapur & Area Cuci | 1,65 × 1,50 | 2,48 | 1,50 × 1,35 | 2,03 |
| 6 | Kamar Mandi | 1,35 × 1,50 | 2,03 | 1,20 × 1,35 | 1,62 |
|   | **Total** | | **21,00** | | **18,02** |

Tapak 3,00 × 7,00 m di kavling 6 × 12 m (72 m²), GSB 3 m, KDB 50 %, KLB 0,29, plafon 2,80 m (Kepmen Kimpraswil 403/2002), atap pelana 30° dengan puncak +3,88 m.

Kompromi yang saya ambil dan tidak saya sembunyikan:

- **Kamar mandi diakses dari area dapur/servis.** Dengan lebar 3 m, koridor 0,80 m hanya bisa menjangkau satu ruang di baris belakang. Ini lazim di rumah tipe 21–36 dan tetap higienis selama dapur punya exhaust fan sendiri. Kalau tidak suka, ada **toggle varian ensuite** di tab 3D yang memindahkan pintu KM ke dalam kamar tidur.
- **Kasur maksimal 120 × 200 cm.** Kamar tidurnya 4,46 m² bersih. Kasur 160 × 200 tidak muat — ini kesalahan paling sering terjadi di rumah tipe ini, dan sudah saya tulis eksplisit di kartu ruangnya.

## Isi aplikasinya

<table>
<thead><tr><th>Tab</th><th>Isi</th></tr></thead>
<tbody>
<tr><td><b>01 Ringkasan</b></td><td>Parameter utama, rekapitulasi luas, 8 catatan rasional desain</td></tr>
<tr><td><b>02 Model 3D</b></td><td>Model 3D interaktif di HTML Canvas — 8 mode, 7 sudut pandang, pilih per kamar</td></tr>
<tr><td><b>03 Detail Ruang</b></td><td>Kartu per ruang: dimensi as &amp; bersih, material tiap permukaan, daftar furnitur berspesifikasi, titik lampu &amp; saklar, catatan desain</td></tr>
<tr><td><b>04 Blueprint</b></td><td>15 lembar gambar A3 (SVG) siap cetak</td></tr>
<tr><td><b>05 Spesifikasi</b></td><td>9 kelompok spesifikasi teknis, dari galian pondasi sampai finishing</td></tr>
<tr><td><b>06 RAB &amp; Jadwal</b></td><td>RAB 9 kategori, rekapitulasi lingkup, 6 termin, kurva-S, 5 milestone, tabel pengendalian mutu</td></tr>
<tr><td><b>07 Catatan</b></td><td>8 kesalahan umum, 8 trik rumah mungil, roadmap pengembangan, checklist perawatan, acuan SNI</td></tr>
</tbody>
</table>

### Model 3D — kontrol

| Aksi | Cara |
|---|---|
| Putar | Seret mouse / satu jari |
| Zoom | Roda mouse / cubit dua jari |
| Geser (pan) | Tombol kanan seret, atau **Shift** + seret |
| **Jalan** | **`W` `A` `S` `D`** (maju · kiri · mundur · kanan), **`Q` `E`** (turun · naik) |
| Percepat | Tahan **Shift** (2,6×) |
| Kembalikan sudut pandang | **`R`** |
| Pilih ruang | Klik ruangan di model, atau klik daftar ruang di panel kiri |

Kamera bergerak **relatif terhadap arah hadap**, jadi `W` selalu ke arah pandang dan `D` selalu ke kanan layar. Kecepatannya menyesuaikan jarak kamera — dekat jadi halus, jauh jadi cepat.

Delapan mode tampilan: **Seluruh Rumah · Potongan (cutaway) · Tapak &amp; Lingkungan · Struktur · Instalasi Listrik · Air Bersih · Air Kotor &amp; Sanitasi · Bidang Atap.** Ditambah slider **angkat atap 0–3 m**, toggle **varian KM**, mode malam, wireframe, putar otomatis, dan ekspor PNG.

### 15 lembar blueprint

<table>
<thead><tr><th>No.</th><th>Gambar</th><th>Skala</th></tr></thead>
<tbody>
<tr><td>A-01</td><td>Denah Bangunan + tabel ruang</td><td>1:50</td></tr>
<tr><td>A-02</td><td>Denah Tapak &amp; Situasi + data tapak + key plan</td><td>1:80</td></tr>
<tr><td>A-03</td><td>Tampak Depan</td><td>1:40</td></tr>
<tr><td>A-04</td><td>Tampak Belakang</td><td>1:40</td></tr>
<tr><td>A-05</td><td>Tampak Samping Kanan</td><td>1:32</td></tr>
<tr><td>A-06</td><td>Potongan A-A (melintang)</td><td>1:38</td></tr>
<tr><td>A-07</td><td>Potongan B-B (memanjang, dengan kuda-kuda)</td><td>1:32</td></tr>
<tr><td>A-08</td><td>Rencana Atap + perhitungan material</td><td>1:40</td></tr>
<tr><td>A-09</td><td>Rencana Pondasi &amp; Sloof + volume galian</td><td>1:40</td></tr>
<tr><td>A-10</td><td>Rencana Plafon &amp; Titik Lampu</td><td>1:40</td></tr>
<tr><td>A-11</td><td>Detail &amp; Jadwal Kusen (8 tipe)</td><td>1:20</td></tr>
<tr><td>A-12</td><td>Detail Konstruksi (kolom, kuda-kuda, lantai, sanitasi)</td><td>1:20 / 1:25</td></tr>
<tr><td>ME-01</td><td>Instalasi Listrik + pembagian grup</td><td>1:40</td></tr>
<tr><td>ME-02</td><td>Instalasi Air Bersih + skema hidrolik</td><td>1:40</td></tr>
<tr><td>ME-03</td><td>Instalasi Air Kotor, Air Hujan &amp; Sanitasi</td><td>1:40</td></tr>
</tbody>
</table>

## Sisi teknis

Seluruh halaman **statis dan mandiri**: tidak ada backend, tidak ada build step, tidak ada framework. Bukan React, bukan Three.js, bukan D3. Nol dependensi.

- **5.283 baris / 316 KB**, 7 file JS + 1 HTML. Buka `index.html` langsung dari disk, dari flashdisk, atau dari CDN — sama saja.
- **Satu sumber data.** `js/model.js` memegang semua angka. Denah, tampak, potongan, geometri 3D, jadwal kusen, tabel ruang, dan RAB semuanya **diturunkan** dari file itu. Ubah lebar satu ruang, dan 15 gambar + model 3D + RAB ikut berubah.
- **Renderer 3D ditulis sendiri.** Transformasi, back-face culling, near-plane clipping, penyortiran kedalaman (painter's algorithm), dan flat shading dengan key + fill + hemisphere light — semuanya di canvas 2D. Sekitar 300 baris.
- **Bidang atap dipecah 8 strip memanjang.** Ini bukan hiasan: painter's algorithm gagal pada poligon besar yang saling menindih dengan timpak, dan pemecahan itu yang menyelesaikannya.
- **2.628 bidang digambar dalam ± 8 ms per frame** — cukup untuk orbit dan WASD yang mulus.
- **Blueprint digambar sebagai SVG**, jadi tajam di zoom berapa pun dan bisa langsung dicetak A3 lewat `window.print()`.
- Animasi kamera tidak bergantung pada `requestAnimationFrame` (dijeda browser saat tab tidak aktif), tapi pada timer — supaya tampilan tidak pernah "beku" saat pindah tab.

## Yang masih perlu diverifikasi sebelum dibangun

Saya perlu jujur soal batasnya. Ini **gambar kerja pra-DED**, bukan gambar tender.

1. **Harga RAB bersifat indikatif** (Jabodetabek, awal 2026) dan harus diverifikasi dengan penawaran kontraktor setempat. Angkanya Rp 210 juta untuk paket lengkap — bandingkan dengan patokan pasar "Rp 4–5 juta/m²" yang biasanya **hanya** mencakup bangunan inti tanpa pagar, gerbang, carport, septictank, tandon, lansekap, perizinan, pengawasan, dan cadangan risiko. Perbandingan per kelompok ada di tab **RAB → Rekapitulasi Ruang Lingkup**, supaya angkanya tidak menyesatkan.
2. **Penyelidikan tanah** (sondir) belum ada. Pondasi batu belah trapesium 60/25 diasumsikan tanah keras pada −0,85 m.
3. **Perhitungan struktur** oleh ahli struktur, dan **pengesahan PBG/IMT** dari dinas setempat.
4. Peraturan daerah setempat soal KDB/KLB/GSB bisa berbeda dari asumsi di sini.

Semua asumsi itu saya tulis terbuka di `README.md` di dalam folder aplikasinya, bukan disembunyikan.

## Repo

Aplikasinya ada di [`/apps/home-design-arch/`](/apps/home-design-arch/) di situs ini — tanpa proses build, tanpa minifikasi, tanpa bundling. Lihat `js/model.js` kalau mau mengubah desainnya.
