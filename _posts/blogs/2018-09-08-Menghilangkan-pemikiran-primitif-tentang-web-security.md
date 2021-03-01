---
layout: post
title:  "Menghilangkan pemikiran primitif tentang web security"
date:   2018-09-08 22:33:00 +0700
categories: stressfull daily blogs blog
comments: true
---


Modern ini web security belum menjadi salah satu kebutuhan penting untuk developer pada pengembangan aplikasi web, karena pada umumnya developer akan melakukan pengembangan keamanan setelah masuk ke dalam masa production ataupun setelah mendapatkan hasil testing. Hal ini adalah hal wajar karena banyak pengembangan web menggunakan model agile. Dalam pembahasan ini penulis akan menjelaskan tentang pemikiran awam tentang security dan best practice dalam melakukan pengamanan web.

Buat para orang awam kalo berbicara tentang security pada umumnya terpintas pikiran “**aplikasi atau alat untuk mengamankan sistem**” atau biasa disebut “firewall”, dan biasanya kita sebagai orang awam cukup dengan memasang firewall **terbaru dan terupdate **saja sudah merasa cukup aman. Pada dasarnya pemikiran ini wajar akan tetapi dengan pemikiran ini pula banyak muncul pertanyaan yang meragukan, salah satunya “gimana jadinya kalo firewall-nya kena hack?”, “apakah firewall saja cukup?”, “apakah memasang firewall di dalam firewall lebih aman?".

![](https://cdn-images-1.medium.com/max/2000/0*r57Vc4yToIajbWCW.gif)

Hal yang sama terjadi dengan dasar pemikiran kita untuk mengamankan sistem seperti contoh kasus berikut:

Anggaplah kita mempunyai web aplikasi yang cukup menarik perhatian banyak orang, jika load website semakin besar artinya kemungkinan 1 dari 10 customer adalah orang jahil. Artinya disaat sistem aplikasi ini berhasil di ambil alih oleh hacker kita pasti terpikir untuk melakukan pengamanan dengan memasang node security pada sistem kita supaya tidak terulang lagi.

![1 dari 10 user adalah hacker](https://cdn-images-1.medium.com/max/2000/1*EYgb4XR3w5KipQls0C1M6Q.png)*1 dari 10 user adalah hacker*

Setelah terpasang security node ke dalam sistem dengan berbagai cara untuk mengusir hacker supaya tidak lagi main-main dengan sistem ini, jangan lupakan satu hal, dengan memasang security node ke dalam sistem kita ada kemungkinan load web akan lebih berat dari biasanya, karena pada dasarnya setiap data yang masuk dan keluar akan divalidasi oleh **“firewall”**.
> # Bagaimana jika hacker masih tembus setelah dia pasang firewall ini ke dalam sistemnya ?

Jika hal tersebut terjadi ada beberapa hal yang perlu dilakukan:

1. **Jangan panik, lakukan perlindungan pertama untuk top priority **bayangkan jika pada saat liburan ditengah pulau, sinyal internet 2G dan dapet sms “mas database production terhapus”, dunia seakan berhenti berjalan dan otomatis heart rate naik menjadi 150RPM, bingung mau ngapain, jangan panik, lakukan perlindungan pertama untuk top priority seperti perlindungan data customer ataupun melakukan backup data. (penjelasan lebih lengkap pada best practice)

1. **Jangan memasang firewall di dalam firewall, lakukan hal yang terbaik untuk mencari tahu inti masalah**, sangat tidak efektif untuk memasang inception firewall karena akan memberatkan load user, anggaplah tidak akan ada masalah dengan user, bagaimana jadinya kalo hacker ga menyerah dan malah bawa teman temannya buat menyerang? isi websitenya lama lama cuman hacker semua.

![Terlalu banyak node security yang membuat tidak nyaman customer malah bisa jadi saran experimen hacker](https://cdn-images-1.medium.com/max/2218/1*0e0DH9xVB1b8Eub5jt9A7A.png)*Terlalu banyak node security yang membuat tidak nyaman customer malah bisa jadi saran experimen hacker*

***3. Seek to be preventative not defensive**, *pastikan semua orang yang terlibat dalam pengembangan atau operator sistem tidak menjalankan aplikasi mencurigakan ataupun berkontribusi terhadap serangan hacking. Kadang human error bisa merujuk pada serangan hacking yang lebih besar, biarpun kita mempunyai top class profesional security terpasang pada sistem kita, kita juga harus memastikan semua orang yg terlibat pada pengembangan atau operator sistem tidak membawa backdoor ke dalam sistem kita.

Maksud dari cerita di atas adalah untuk melakukan pengamanan terhadap sistem tersebut tidak cukup dengan melakukan **patch**, **upgrade** atau **install security node **saja, ada beberapa praktisi yang perlu dilakukan seperti 4 poin berikut :

## 1. Continuous Monitoring

Kemampuan backdoor yang sangat efektif adalah menyembunyikan diri dari website owner. Terkadang terdapat *visual sign* yang dapat dilihat contoh seperti berikut :

* Informasi akun berubah tiba tiba

* files website berubah atau terhapus tanpa sepengetahuan

* website mudah freeze atau crash

* traffic tiba tiba drop atau naik

* executable file pada folder upload atau tempat aneh

* terdapat proses remote yang berjalan pada aplikasi

* Terdapat akun baru yang mencurigakan aktifitasnya

* Terdapat pesan dari hacker

Cukup dengan mengenal salah satu dari visual sign ini bisa mengindikasi kalau website kena hack atau tidak, jika dirasa sudah kena hack bisa lanjut ke bagian selanjutnya **Auditing**

## 2. Auditing

Selain dengan melakukan monitoring dengan *visual sign* untuk mengetahui jika terdapat celah keamanan, ada cara yang lebih mudah menggunakan auditing atau istilah lainnya scanning, scanning dapat di kerjakan secara **otomatis **ataupun **manual**

### Otomatis

Beberapa scanner mampu mendeteksi lubang keamanan yang susah di deteksi oleh visual sign, ada beberapa banyak tools yang bisa di pilah dan terbilang mudah untuk penggunaannya dapat di cek disini [https://github.com/qazbnm456/awesome-web-security#detecting](https://github.com/qazbnm456/awesome-web-security#detecting)

![Automated Scanner menggunakan WPSCAN](https://cdn-images-1.medium.com/max/2400/0*-HwHHJBi6fSwKUu-.png)*Automated Scanner menggunakan WPSCAN*

Bahkan Github pun menyediakan fitur keamanan khusus untuk scanning libraries, biasanya github akan mendeteksi file yang berisi listing libraries seperti **composer.json** atau **package.json**, atau dapat menggunakan snyk.io salah satu opensource security platform yang menyediakan jasa vulnerability scanning untuk repository.

### Manual

Untuk metode manual auditing tidak jauh beda dengan Continuous Monitoring, melakukan manual analisis dengan melihat tanda tanda visual tentu dapat di bantu dengan bantuan Tools (dapat cek di [https://github.com/sbilly/awesome-security#monitoring--logging](https://github.com/sbilly/awesome-security#monitoring--logging) )atau dapat juga melakukan pengencekan dengan checklist yang tersedia.

### Checklist

Sekitar 3 bulan yang lalu sampai sekarang saya masih mengembangkan checklist security best practice yang mudah di pahami oleh web developer, checklist ini bisa jadi patokan kemanan standar.
[**Web developer security checklist**
*Dari data pada website zone-h.org dijelaskan hampir satu hari hacker mampu melakukan deface sebanyak 5 sampai 20…*medium.com](https://medium.com/@yahya.kimochi/web-developer-security-checklist-920ac4421589)

## 3. Fixing

Kalau sudah menemukan celah keamanan yang terdapat pada aplikasi, tentunya melakukan fixing, fixing ini belum cukup dengan update dependencies, kadang jika tidak tersedia upgrade nantinya , contohlah jika menemukan celah keamanan dengan code base dan tidak cukup dengan upgrade saja kita butuh melakukan varian, dari security checklist yang saya buat juga sudah termasuk beberapa cara melakukan fixing yang seharusnya.

## **4. Repeat**

Ulangi langkah awal jika ragu masih terdapat lubang keamanan, best practice ini cocok digunakan oleh web developer yang garap ilmu masih menggunakan search google dan minim pengetahuan security.

Kesimpulannya kita sebagai web developer perlu menghilangkan dasar pemikiran tentang pengamanan dimana menggunakan firewall adalah standar cukup, ibarat aplikasi kena hack itu bagaikan anak sendiri yang lagi di bully sama orang lain, yang perlu di jaga dan di rawat sama kita sendiri yang mengembangkan dari awal.

Referensi
[**enaqx/awesome-pentest**
*A collection of awesome penetration testing resources, tools and other shiny things - enaqx/awesome-pentest*github.com](https://github.com/enaqx/awesome-pentest)

[https://www.exploit-db.com/docs/persian/44898-database-security-threats-and-injection-technique.pdf](https://www.exploit-db.com/docs/persian/44898-database-security-threats-and-injection-technique.pdf)

<iframe src="https://medium.com/media/366e98810ba538efb92e5a87890b0d8d" frameborder=0></iframe>
