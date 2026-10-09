# Rumah Tipe 21/72 — Paket Desain Arsitektur + Model 3D

Paket desain lengkap rumah tinggal **tipe 21** (luas bangunan 21 m²) dalam satu aplikasi HTML:
**15 lembar gambar kerja (blueprint)**, **model 3D interaktif di HTML Canvas**, detail per ruang,
spesifikasi teknis, dan Rencana Anggaran Biaya.

> Buka **`index.html`** di peramban modern. Tidak perlu server, tidak perlu internet
> (font web hanya untuk estetika; tanpa internet tampilan tetap terbaca).

---

## Ringkasan rancangan

| Parameter | Nilai |
|---|---|
| Tipe | Rumah kopel satu lantai, tipe 21/72 |
| Luas bangunan | **21,00 m²** (3,00 × 7,00 m) |
| Luas tanah | 72,00 m² (6,00 × 12,00 m) |
| GSB / KDB / KLB | 3,00 m / 50 % / 0,29 |
| Ruang | Teras · Ruang Tamu+Keluarga · Kamar Tidur · Koridor · Dapur · Kamar Mandi |
| Tinggi plafon | 2,80 m (kamar mandi 2,60 m) |
| Atap | Pelana 30°, nok sejajar sumbu z, puncak +3,88 m |
| Pondasi | Batu belah trapesium 60/25, dasar −0,85 m |

### Pembagian ruang (dimensi as-ke-as)

| # | Ruang | Ukuran (m) | Bruto (m²) | Bersih (m) | Bersih (m²) |
|---|-------|-----------|-----------|-----------|------------|
| 1 | Teras Sambut | 3,00 × 0,90 | 2,70 | 2,92 × 0,82 | 2,41 |
| 2 | Ruang Tamu & Keluarga | 3,00 × 2,10 | 6,30 | 2,85 × 1,95 | 5,56 |
| 3 | Koridor | 0,95 × 2,50 | 2,38 | 0,80 × 2,42 | 1,94 |
| 4 | Kamar Tidur | 2,05 × 2,50 | 5,13 | 1,90 × 2,35 | 4,46 |
| 5 | Dapur & Area Cuci | 1,65 × 1,50 | 2,48 | 1,50 × 1,35 | 2,03 |
| 6 | Kamar Mandi | 1,35 × 1,50 | 2,03 | 1,20 × 1,35 | 1,62 |
| | **Total** | | **21,00** | | **18,02** |

*Angka "bersih" = dikurangi ½ tebal dinding (0,075 m) pada setiap sisi yang tertutup dinding.*

---

## Isi aplikasi

| Tab | Isi |
|---|---|
| **01 Ringkasan** | Parameter utama, rekapitulasi luas, 8 catatan rasional desain |
| **02 Model 3D** | Model 3D interaktif di HTML Canvas + 8 mode tampilan + 7 sudut pandang + pemilihan per ruang |
| **03 Detail Ruang** | Kartu detail setiap ruang: dimensi, material, daftar furnitur berspesifikasi, pencahayaan, catatan |
| **04 Blueprint** | 15 lembar gambar A3 (SVG, siap cetak) |
| **05 Spesifikasi** | 9 kelompok spesifikasi teknis (tanah/pondasi → finishing) |
| **06 RAB & Jadwal** | RAB 9 kategori + rekapitulasi lingkup, termin pembayaran, kurva-S, milestone, pengendalian mutu |
| **07 Catatan** | 8 kesalahan umum, 8 trik rumah mungguil, roadmap pengembangan, checklist perawatan, acuan standar |

### Kontrol pada tab Model 3D

| Aksi | Cara |
|---|---|
| Putar | Seret mouse / 1 jari |
| Zoom | Roda mouse / cubit 2 jari |
| Geser (pan) | Tombol kanan seret, atau **Shift** + seret |
| **Gerakkan kamera** | **`W` `A` `S` `D`** (maju · kiri · mundur · kanan), **`Q` `E`** (turun · naik) |
| Percepat gerak | Tahan **Shift** (2,6×) |
| Kembalikan sudut pandang | **`R`** |
| Pilih ruang | Klik ruangan pada model, atau klik daftar ruang di panel kiri |

Kamera bergerak **relatif terhadap arah hadap**, jadi `W` selalu menuju arah pandang dan `D` selalu ke kanan layar. Kecepatan menyesuaikan jarak kamera (semakin dekat semakin halus). Tombol panah juga berfungsi sebagai alias `W A S D`.

**Mode tampilan:** Seluruh Rumah · Potongan (cutaway) · Tapak & Lingkungan · Struktur ·
Instalasi Listrik · Air Bersih · Air Kotor & Sanitasi · Bidang Atap

**Efek:** angkat atap 0–3 m (slider) · varian kamar mandi (**servis** / **ensuite**) ·
toggle furnitur · label ruang · wireframe · mode malam · putar otomatis · plafon

---

## Daftar gambar (blueprint)

| No. | Gambar | Skala |
|---|---|---|
| A-01 | Denah Bangunan + tabel ruang | 1:50 |
| A-02 | Denah Tapak & Situasi + data tapak + key plan | 1:80 |
| A-03 | Tampak Depan | 1:40 |
| A-04 | Tampak Belakang | 1:40 |
| A-05 | Tampak Samping Kanan | 1:32 |
| A-06 | Potongan A-A (melintang) | 1:38 |
| A-07 | Potongan B-B (memanjang) | 1:32 |
| A-08 | Rencana Atap + perhitungan material | 1:40 |
| A-09 | Rencana Pondasi & Sloof + volume galian | 1:40 |
| A-10 | Rencana Plafon & Titik Lampu | 1:40 |
| A-11 | Detail & Jadwal Kusen (8 tipe) | 1:20 |
| A-12 | Detail Konstruksi (kolom, kuda-kuda, lantai, sanitasi) | 1:20 / 1:25 |
| ME-01 | Instalasi Listrik + pembagian grup | 1:40 |
| ME-02 | Instalasi Air Bersih + skema hidrolik | 1:40 |
| ME-03 | Instalasi Air Kotor, Air Hujan & Sanitasi | 1:40 |

Semua gambar digambar sebagai **SVG** di dalam halaman, sehingga bisa dizoom tanpa pecah,
dibuka di tab baru, dan dicetak (tombol **Cetak** → A3 landscape).

---

## Struktur berkas

```
/apps/home-design-arch/            (di situs ini)
├── index.html          Aplikasi utama (shell + design system)
├── js/
│   ├── geo.js          Matematika vektor, palet material, kelas Mesh (box/ramp/cyl/extrude)
│   ├── model.js        ★ SUMBER TUNGGAL DATA: ruang, dinding+bukaan, atap, kusen,
│   │                     struktur, listrik, plumbing, tapak, RAB, jadwal, rasional
│   ├── scene.js        Membangun geometri 3D dari model + daftar furnitur berspesifikasi
│   ├── render3d.js     Renderer 3D software → canvas 2D (painter's algorithm, flat shading,
│   │                     near-plane clipping, picking ruang, preset kamera)
│   ├── blueprint.js    Generator 15 gambar SVG (denah, tampak, potongan, MEP, detail)
│   ├── docs.js         Dokumen teknis: ringkasan, detail ruang, spesifikasi, RAB, jadwal
│   └── app.js          Pengendali UI: tab, viewer 3D, lembar gambar, interaksi
└── README.md
```

### Prinsip: satu sumber data

`js/model.js` adalah **satu-satunya sumber kebenaran**. Denah 2D, tampak, potongan, potongan
dinding 3D, jadwal kusen, RAB, dan tabel ruang semuanya **diturunkan** dari berkas ini.
Mengubah satu angka (misalnya lebar kamar) akan otomatis memperbarui:

- denah + rantai dimensi + tabel ruang (A-01)
- potongan A-A dan B-B (A-06, A-07)
- geometri dinding 3D, kusen, kusen jendela, dan label ruang pada model 3D
- kartu detail ruang (tab 03) dan luas bersih pada semua tabel

### Cara mengubah desain

1. Buka `js/model.js`.
2. Ubah dimensi ruang pada array `rooms` **dan** sumbu dinding yang bersangkutan pada `walls`
   (properti `at`, `a`, `b`). Keduanya harus konsisten.
3. Jika perlu memindahkan pintu/jendela, ubah `openings` pada dinding terkait
   (`a`, `b` = posisi sepanjang dinding; `sill`, `head` = elevasi ambang & kepala).
4. Muat ulang halaman. Semua gambar dan model 3D ikut berubah.

Furnitur dan materialnya diatur di array `FURN` pada `js/scene.js`
(format: `[namaMaterial, x0, y0, z0, x1, y1, z1]` dalam meter).

---

## Catatan teknis renderer 3D

- **Tanpa dependensi.** Tidak memakai Three.js/WebGL — semua transformasi, culling,
  near-plane clipping, pengurutan kedalaman, dan bayangan datar ditulis sendiri
  (± 300 baris pada `render3d.js`).
- **Cahaya:** key light + fill light + termin langit (hemisphere), sehingga bidang vertikal
  tidak menjadi hitam pekat.
- **Pengurutan:** painter's algorithm berbasis centroid kedalaman. Bidang atap dan kanopi
  **dipecah menjadi 8 (dan 4) strip memanjang** agar pengurutan tetap akurat pada bidang besar
  yang saling menindih dengan timpak/gevel.
- **Kinerja:** ± 2.600–3.000 bidang dirender dalam **≈ 9 ms** per frame (canvas 806 × 707,
  devicePixelRatio 1) — nyaman untuk orbit interaktif.
- **Picking ruang:** uji titik-dalam-poligon pada proyeksi lantai tiap ruang, dipilih yang
  paling dekat ke kamera.

---

## Asumsi & batasan

1. **Harga RAB** bersifat indikatif (Jabodetabek, awal 2026) dan **harus** diverifikasi dengan
   penawaran kontraktor setempat. Total mencakup paket lengkap: bangunan inti + pagar +
   gerbang + carport + septictank + tandon + lansekap + perizinan + pengawasan + cadangan.
   Rincian pembanding ada di tab **RAB & Jadwal → Rekapitulasi Ruang Lingkup**.
2. **Gambar ini adalah gambar kerja pra-DED**, bukan gambar tender. Sebelum pelaksanaan
   diperlukan: penyelidikan tanah (sondir), perhitungan struktur oleh ahli struktur,
   dan pengesahan PBG/IMT oleh dinas setempat.
3. Kamar mandi 1,20 × 1,35 m (bersih) — layout basah *walk-in shower* tanpa bak, kloset duduk,
   dan wastafel gantung. Pintu KM **bukaan keluar** untuk menghemat ruang.
4. Kamar tidur 1,90 × 2,35 m (bersih) hanya cukup untuk **kasur maksimal 120 × 200 cm** +
   lemari 0,62 m + meja kerja di bawah jendela. Kasur 160 × 200 tidak muat.
5. Varian **ensuite** memindahkan pintu KM ke dinding kamar tidur (dinding z = 8,50);
   konsekuensinya KM hanya dapat diakses dari dalam kamar.

## Acuan standar

- Kepmen Kimpraswil No. 403/KPTS/M/2002 — Pedoman Teknis Pembangunan Rumah Sederhana Sehat
  (luas min. 9 m²/orang; tinggi langit-langit rata-rata 2,80 m).
- SNI 03-1733-2004 — Tata Cara Perencanaan Lingkungan Perumahan di Perkotaan.
- SNI 03-1979-1990 / SNI 03-0675-1989 — Spesifikasi Ukuran Kusen, Daun Pintu & Jendela Kayu.
- SNI 2847-2019 — Persyaratan Beton Struktural untuk Bangunan Gedung.
- SNI 1726-2019 — Ketahanan Gempa untuk Struktur Bangunan Gedung.
- Permenkes RI No. 1077/Menkes/Per/V/2011 — Pedoman Penyehatan Udara dalam Ruang Rumah.
- Peraturan daerah setempat tentang KDB, KLB, dan GSB.
