---
layout: post
title:  "Basic Web Hacking - Introduction - part1"
date:   2016-12-16 10:41:00 +0700
categories: jekyll update
comments: false
---

note : sebelum masuk ke dalam materi ini, tolong untuk dipahami dari artikel berikut [RTFG==Antara budaya kebutuhan](https://medium.com/sadulur/rtfg-antara-budaya-kebutuhan-9267f995e464#.fy9nqrnt3)

"How to Hack Website" "Hack Joomla" "Hack Wordpress" bla bla bla ini salah satu keyword yang sering ditemukan di google pada saat mau mencoba menulis "hack" keyword. yahh terlalu script kiddies lah kita kalo udah nyoba hack pake ginian, biasanya hacker script kiddies nyari jalan pintas buat hack website. 

> ![Keyword Hack website](http://k1m0ch1.github.io/images/keyword-google-1.png)

Disini saya akan jelaskan tentang basic web hacking, gimana cara hacking sebuah website secara proper dan nda loncat loncat buat melakukan audit dalam sebuah website

ada beberapa aspek untuk memulai melakukan basic web hacking, karena kita butuh dasar tata cara hacking yang bisa menghasilkan mampu untuk take over server. Berikut aspek aspek nya :

# 1. RTFG ( Read The Fucking Google )

Simplenya banyak banyak googling buat dapat informasi latest untuk mendapatkan serangan serangan terbaru dan implementasi serangannya ke target, baca juga [RTFG==Antara budaya kebutuhan](https://medium.com/sadulur/rtfg-antara-budaya-kebutuhan-9267f995e464#.fy9nqrnt3)

# 2. Standarisasi

Patokan atau supaya kita memahami apa saja yang bisa kita hack, atau teknik teknik yang bisa kita gunakan sebagai cara cara untuk menyerang target, sederhananya dapat menggunakan [Top 10 OWASP 2014](https://www.owasp.org/index.php/Top_10_2013-Top_10), ini patokan jelas juga supaya kita nda asal asalan menyerang target

> ![OWASP Top 10 2014](http://k1m0ch1.github.io/images/owasp-top-10-2014.jpg)

# 3. Tools

ok ini terlalu males sih jelasinnya, soalnya karena tools ini terlalu general dan banyak sekali. Sederhananya seperti ini dilihat dari standarisasi, masing masing poin itu mempunyai tools masing masing. Jadi PR untuk yang baru ngerti tentang hacking, coba pelajari dan riset masing masing dari setiap kelemahan kelemahan Web yang di listing pada poin standarisasi.

Toolsnya banyak ko, salah satunya sqlmap, dirsearch, wpscan, joomlavs dll mungkin saya punnya materi khusus untuk tools ini.

> ![Tools Sqlmap](http://k1m0ch1.github.io/images/tools-sqlmap-1.png)

# 4. Analisa Struktur aplikasi/ website

Ini butuh pemahanan programming atau sederhananya direktori listing atau fungsi dari beberapa aplikasi atau website, karena ada kemungkinan kelemahan yang ngga sengaja developer lakukan mengakibatkan hal yang fatal

> ![Tools Sqlmap](http://k1m0ch1.github.io/images/serangan-mudah.png)

# 5. RTFG ( Read The Fucking Google )

Kalo ga nemu googling lagi
