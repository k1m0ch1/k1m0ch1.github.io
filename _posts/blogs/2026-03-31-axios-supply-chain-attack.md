---
layout: post
title:  "axios kena supply chain attack"
date:   2026-03-31 12:00:00 +0700
categories: security blogs blog supplychain nodejs
comments: true
---

AXIOS kena supply chain attack ANJENGGGG  😂 😂😂😂😂😂😂

akun master maintenainer

TL;DR nih gw bikin thread simplenya bro 

https://x.com/BukanYahya/status/2038840805956472884

bukan bug. bukan salah lo. ada yang masuk ke akun maintainernya, diem-diem publish versi baru yang isinya trojan.

dan dramanya terjadi live. di depan mata semua orang.

---

## sedikit konteks

axios itu http client buat javascript. 109k stars, diunduh ratusan juta kali per minggu. hampir ga ada project modern yang ga pake ini.

makanya ini gede.

---

## yang terjadi

sekitar jam 03:00 UTC, researcher namanya **ashish kurmi** buka issue di github:

> *"axios@1.14.1 and axios@0.30.4 are compromised"*

dua versi baru dipublish ke npm, keduanya bawa **Remote Access Trojan (RAT)**. bukan celah keamanan, bukan misconfiguration. kode jahatnya langsung disisip ke package yang lo percaya.

ini supply chain attack.

---

## cara kerjanya

dari analisa stepsecurity, ternyata lebih rapi dari yang gw kira.

**18 jam sebelum serangan**, attacker publish dulu package palsu namanya `plain-crypto-js@4.2.1` ke npm. package ini ga pernah ada di axios sebelumnya. kenapa? biar waktu axios@1.14.1 tiba-tiba punya dependency baru, ga keliatan aneh-aneh.

pas lo install axios versi itu, `plain-crypto-js` ikut masuk. terus dia jalanin `postinstall` hook yang aktifin dropper.

alurnya:
```
npm install axios
-> plain-crypto-js ikut masuk
-> postinstall hook jalan otomatis
-> dropper aktif
-> sistem lo dikuasai
```

cross-platform pula. ada payload beda buat windows (vbscript + powershell), macos (applescript), dan linux (python). ga ada yang aman.

abis dropper jalan, dia hapus dirinya sendiri dan ganti manifest dengan file bersih. ga ada log, ga ada sisa. forensik jadi susah.

semua platform kirim data ke satu c2 server: `sfrclak.com:8000`.

---

## drama live di github

ini bagian yang paling gila.

waktu komunitas mulai rame lapor, issue-nya ilang. bukan dihapus github. tapi dihapus sama si attacker yang masih login sebagai **jasonsaayman**, maintainer utama axios, buat nutupin jejaknya secara real-time.

ashish sendiri nulis:

> *"a maintainer's GitHub and npm accounts are compromised as these issues are getting deleted"*

orang-orang liat laporan mereka dihapus langsung di depan mata. untung ada yang sempet screenshot.

terus **digitalbrain.js**, kolaborator lain, coba turun tangan. tapi nemuin masalah lebih gede:

> *"since access to git and npm is compromised, and his git permissions are higher than mine... whatever I fix, he will 'fix' it after me."*

si attacker punya permission lebih tinggi. jadi ngejar-kejaran real-time antara defender sama attacker di github.

```
03:00 UTC - issue dibuka, mulai viral
03:00-03:20 - attacker hapus issue satu-satu
03:20 UTC - npm revoke semua token jasonsaayman
03:30 UTC - versi malicious dihapus dari registry
```

dari laporan masuk sampai paket dihapus: kurang dari 30 menit.

---

## soal jasonsaayman

**jay** itu maintainer utama axios, dari africa selatan. kontributor open source yang udah lama. ga ada tanda-tanda dia terlibat secara sadar, ini murni credential compromise. kemungkinan phishing atau bocor dari service lain.

pengingat bahwa maintainer berpengalaman pun bisa jadi korban hal kayak gini.

---

## ini bukan yang pertama

- event-stream (2018) - malicious code buat curi bitcoin wallet
- node-ipc (2022) - maintainer sengaja rusak package karena protes perang ukraine
- xz-utils (2024) - serangan multi-tahun yang hampir tembus ssh daemon linux
- axios (2026) - ini

polanya sama terus. package populer, trust tinggi, satu titik kegagalan, dampak masif.

---

## yang harus lo lakuin sekarang

cek versi lo dulu:

```bash
npm ls axios
```

kalau hasilnya `1.14.1` atau `0.30.4`, update sekarang:

```bash
npm install axios@1.14.0
```

kalau udah terlanjur install versi itu, anggap sistem lo perlu audit serius. rotasi credentials, cek traffic ke `sfrclak.com`, dan kalau ini server production pertimbangin reinstall.

buat CI/CD ke depannya, harusnya ini jadi default:

```bash
npm ci --ignore-scripts
```

kalau nemu axios@1.14.1 di jsdelivr atau unpkg, masih ada di cache, jangan install juga. sama aja.

---

kalau lo developer javascript dan belum audit dependencies hari ini, mungkin sekarang waktu yang bagus.

serangan berikutnya mungkin ga seeksplosif ini. mungkin diem-diem, berbulan-bulan, sebelum ada yang sadar.

---

**referensi:**
- [github issue #10604](https://github.com/axios/axios/issues/10604)
- stepsecurity - axios compromised on npm: malicious versions drop remote access trojan
- socket.dev - supply chain attack on axios pulls malicious dependency from npm
- strix ai - our ai traced the axios npm attack and found how the payload hid itself
