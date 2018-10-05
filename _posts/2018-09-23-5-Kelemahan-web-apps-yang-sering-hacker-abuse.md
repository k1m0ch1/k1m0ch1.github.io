Sering kali web developer baru menyadari betapa pentingnya keamanan setelah web atau aplikasinya sudah diretas atau mendapat ancaman dari hacker berupa email. Kesulitan dari pengembangan pun mulai meningkat karena yang harus di tangkis adalah lubang keamanan, dua hal yang berbeda antara lubang yang biasa disebut bug dimana sebuah kesalahan teknikal ataupun bisnis yang menyebabkan munculnya error pada aplikasi yang biasanya muncul dengan ukuran seperti High, Medium, Low dan keamanan yang diukur dari tingkat resiko yang muncul dibagi seperti Confidential (kerahasiaan), Integrity(keutuhan) dan Availability (ketersediaan).

![hacker sexually attracted to your vulnerable app](https://cdn-images-1.medium.com/max/2000/0*sadHMdVESMNVtNg9.jpg)*hacker sexually attracted to your vulnerable app*

Penulis ingin membagikan beberapa pro tips untuk para web developer dalam mengamankan web aplikasi kalian supaya kelemahan kelemahan yang biasa hacker manfaatkan bisa terlebih dahulu ditemukan, dan di atasi lebih awal. Terdapat 5 kelemahan umum yang biasa hacker manfaatkan diantaranya :

## Vulnerable Packages
> npm packages over 375000, 70000 publisher, ~14% carry known vulnerabilities — snyk.io

Kelemahan paling umum yang biasa hacker manfaatkan, *outdated*, *unsupported, vulnerable *libraries/packages/dependencies…..

Jangan pernah menganggap remeh vulnerable packages ini karena komunitas hacker sendiri mereka mereka pasti akan merilis jika menemukan kelemahan, dan akan di sebar lewat komunitas.

![](https://cdn-images-1.medium.com/max/2438/1*KcuGEG6-oJOwIMHm42fn8w.png)

Bahkan terdapat komunitas hacker sendiri yang menjual exclusive bug seperti bug nya twitter, facebook maupun instagram.

![](https://cdn-images-1.medium.com/max/2018/1*864t9svsp0ULCEg9BLJ1iA.png)

yang harus dilakukan web developer untuk mencegah ini adalah :

Gunakan package scanner untuk mengetahui kelemahan dari package, banyak sekali pilihan untuk package scanner salah satunya :

### [npm audit](https://docs.npmjs.com/getting-started/running-a-security-audit)

Tools ini sangat membantu developer untuk mengetahui lebih awal jika ada library yang vulnerable, cukup dengan perintah biasa **npm install** nanti muncul peringatan kalau library tersebut terdapat kelemahan dan menyarankan menjalankan **npm audit **(jangan lupa ini menggunakan npm latest bisa langsung update menggunakan **npm install npm@latest -g** )

![](https://cdn-images-1.medium.com/max/2000/1*hBDqSa0h7JpjceDqUKjyWQ.png)

setelah menjalankan npm install, pasti disaraankan untuk menjalankan npm audit, nanti hasilnya seperti berikut

![](https://cdn-images-1.medium.com/max/2288/0*ZEJvNnl4hHdscJSG.png)

untuk fixing bisa update aja versi library nya atau menggunakan perintah **npm audit fix** buat auto fixing yang vulnerable, mungkin ada beberapa library yang ga bisa di fixing biasnaya dikarenakan library nya sudah tidak di kembangkan lagi, atau harus update manual library nya.

### [snyk.io](https://snyk.io/)

Ini bukan tools melainkan Website yang menyediakan jasa untuk melakukan scanning library, menggunakan website ini dia cukup general karena dia bisa scanning untuk multi language. Cukup dengan menambahkan project yang ada di berbagai repository (github, gitlab, dll) nanti dia bakal scanning library sekarang yang dipakai. Kelebihannya untuk menggunakan snyk.io ini kita bisa melakukan daily scanning, bisa liat detail permasalahan dan rekomendasinya terutama gratis, penulis sangat menyarankan menggunakan ini 👍

![](https://cdn-images-1.medium.com/max/2000/1*jvUP95hcIgVFE2VeHbAO4Q.png)

### [github security alert](https://blog.github.com/2017-11-16-introducing-security-alerts-on-github/)

Buat developer github mungkin ini sudah tidak asing lagi, untuk enable fitur ini bisa cek pada tab Insight, lalu bagian menu dependency graph ada fitur untuk memulai cek dependencies security. Biasanya setiap minggu jika ditemukan vulnerability pada dependencies langsung di peringatkan lewat email.

![Github memberikan peringatan tentang dependencies yang lema](https://cdn-images-1.medium.com/max/2000/1*JQaUKWhVSwTX6_YOaT2cpg.png)*Github memberikan peringatan tentang dependencies yang lema*

Banyak sekali tools tools pendukung untuk cek dependencies dari lubang keamanan, contoh lainnya untuk composer libraries bisa di lakukan menggunakan tools [sensiolabs](https://security.sensiolabs.org/check) ([web ](https://security.sensiolabs.org/check)/ [github ](https://github.com/sensiolabs/security-checker)).

## Injeksi

OWASP Top 10 Vulnerability menyebutkan injeksi adalah serangan yang paling sering hacker manfaatkan, dalam arti lain serangan yang paling di favoritkan oleh hacker, disisi mudah di gunakan, tipe serangannya juga sangat banyak bahkan [varian ](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)untuk setiap masing masing sql server (mysql, postgres, oracle). Penulis akan berbagi tips untuk handle jenis serangan Injection yang umum, salah satunya :

### SQL Injection

Arti sederhananya adalah query dari data yang terstruktur dan dimanfaatkan hacker untuk mendapatkan informasi lebih, contohnya seperti pada query berikut

    select judul, highlight, deskripsi, tag from tbl_artikel where id = 1;

![hasilnya](https://cdn-images-1.medium.com/max/2000/1*PQlBIz9RzK0JBYKYUoD6Sw.png)*hasilnya*

sederhana ko, anggap saja 1 adalah variabel input, jadi kalau angka tersebut di ganti ganti artinya akan menampilkan data berita dengan spesifik id, simple kan. Nah jika “ 1 “ adalah inputan dari user, artinya user bisa menambahkan query kan, anggap lah jika user tersebut memasukkan query berikut setelah inputan.

    **union select 1,concat(table_name),3,4 from information_schema.tables where table_schema
    ="CRACKING";**

jika di gabungkan menjadi begini

    select 
     judul, highlight, deskripsi, tag 
    from tbl_artikel 
    where id = 1 **union select 1,concat(table_name),3,4 from information_schema.tables where table_schema
    ="CRACKING";**

maka hasilnya akan memberitahukan semua list tabel yang tersedia pada database “CRACKING” (contoh database yang dicoba)

![hasilnya](https://cdn-images-1.medium.com/max/2000/1*7wGv8Eq2DT7Nk2jfUwL0BQ.png)*hasilnya*

artinya memungkinkan hacker melakukan ekstrak data lainnya pada query tersebut contoh lainnya pada query ini untuk menampilkan username dan password pada tabel

    select judul, highlight, deskripsi, tag from tbl_artikel where id = 1 union select 1,concat(username,0x3a,
    password),3,4 from tbl_user;

![](https://cdn-images-1.medium.com/max/2000/1*BULmzjJzS-yrvASQxTBCRw.png)

Mungkin ribet ya, simple nya gini, kalo nyatanya bisa seperti ini.

![](https://cdn-images-1.medium.com/max/2000/1*KimkYKKuir6u4G1sFWQf_Q.png)

Serangan SQL Injection ini paling umum, paling banyak varian nya, paling random banget muncul nya, bahkan banyak tools tools hacking yang sesimple masukkan URL dan langsung ekstrak database salah satunya Havij (one click hack, paling sering dipake noob hacker buat merasa lebih powerfull), BFSQL, paling the best itu [SQLMap](http://sqlmap.org/). Buat kawan kawan yang penasaran dan pengen coba sendiri, saya saranin menggunakan SQLMap

#*Attention disini penulis share tentang SQLMap khusus untuk testing aplikasi kalian sendiri buat kepentingan keamanan, kalo yang lain tanggung jawab masing masing*

### Test kelemahan aplikasi menggunakan SQL Map

Bahan :

> python 2.6.x atau 2.7.x

> install library python [requests](http://docs.python-requests.org/en/master/)

> clone dari project [https://github.com/sqlmapproject/sqlmap](https://github.com/sqlmapproject/sqlmap)

Kalau udah siap semua coba jalankan perintah **python sqlmap.py**

![](https://cdn-images-1.medium.com/max/2000/1*nVJDn2mwzrH29ifFmwqnZA.png)

lalu ada beberapa cara untuk mendefinisikan fungsi/ URL yang lemah :

1. berupa inputan dari user

1. untuk method GET jika menggunakan petik satu ( ‘ ) akan muncul error mysql seperti **localhost/?parent_id=91&v=portal&page=&id=93'` **artinya fungsi ini ada potensi lemah

![contoh jika menggunakan petik satu](https://cdn-images-1.medium.com/max/2000/1*O7zH7gSSzmdayn4UBs08XA.png)*contoh jika menggunakan petik satu*

3. untuk method POST masukkan variabel yang tidak sesuai dengan tipe data contoh memasukkan huruf pada nomor telepon

4. Jika muncul Error SQL Syntax artinya fungsi/ URL ini berpotensi lemah, save URL nya.

Jika sudah mempunyai URL lemah tersebut, selanjutnya adalah memasukkan URL lemah tersebut ke sqlmap tanpa petik dengan perintah

    python sqlmap.py -u "**localhost/?parent_id=91&v=portal&page=&id=93"**

Selanjutnya tools ini akan melakukan pengecekan tipe DBMS dan melakukan serangan serangan dari semua jenis sql injection, SQLMap akan melakukan beberapa pertanyaan simple dan selanjutnya jika berhasil maka akan muncul seperti berikut

![Hasil jika berhasil terdapat informasi “injectable”](https://cdn-images-1.medium.com/max/2000/1*Sg2M2qomvv7rUG6kM51Lrg.png)*Hasil jika berhasil terdapat informasi “injectable”*

Kotak merah artinya fungsi/ URL tersebut jelas jelas lemah, dan kotak hijau adalah query yang digunakan untuk menemukan kelemahan. Simple ko!! silahkan dicoba,

### Pencegahan SQL Injection

Paling efektif di antara pencegahan SQL Injection adalah menggunakan **prepared statement** untuk di setiap query yang akan di execute, karena setiap prepared statement query tidak akan langsung di eksekusi oleh database server dipisah antara variabel yang di input dan query yang akan di eksekute, menggunakan prepared statement akan mengecilkan kemungkinan hacker melakukan serangan sql injection.

    $stmt = $dbConnection->prepare('SELECT * FROM employees WHERE name = ?');
    $stmt->bind_param('s', $name); // 's' specifies the variable type => 'string'
    
    $stmt->execute();
    
    $result = $stmt->get_result();
    while ($row = $result->fetch_assoc()) {
        // do something with $row
    }

Untungnya banyak framework developement semacam laravel, express dan sebagainya yang sudah menangkal basic SQL Injection, tapi masih banyak cara untuk pencegahan sql injection, ini hanyalah salah satu dari pencegahan, karena serangan belum tentu itu itu saja.

## Tidak menggunakan HTTPS

Sudah menjadi hal umum update terbesar chrome di tahun ini adalah menandakan website yang [tidak menggunakan HTTPS akan di anggap tidak aman](https://www.theregister.co.uk/2018/07/03/google_chrome_http/), hal ini menjelaskan bahwa HTTP bukanlah protokol yang aman lagi untuk melakukan transport data karena dengan menggunakan http data yang dikirimkan dapat di ekstrak dan di manipulasi oleh orang lain dalam satu jaringan.

![HTTP ibarat website telanjang, dalam satu jaringan masih bisa di ambil datanya](https://cdn-images-1.medium.com/max/2000/1*Hf0cohVzMqNe6HVyXV94vA.png)*HTTP ibarat website telanjang, dalam satu jaringan masih bisa di ambil datanya*

HTTPS menyediakan user melakukan transportasi data melewati jalur yang aman, secara teknikal data yang dikirimkan ke HTTPS akan di encrypt supaya data tidak bisa di baca secara mentah mentah. Biarpun HTTPS itu banyak yang mahal, jangan minder bahkan masih banyak website pemerintah yang tidak menggunakan HTTPS, wajar website pemerintah lebih sering dijadikan bahan eksperimen hacker. Tidak telat buat kalian web developer untuk segera pasang HTTPS karena sudah banyak HTTPS gratis seperti letsencrypt ataupun cloudflare.

## Password

Paling sering hacker memanfaatkan password umum untuk meretas akun orang lain, karena password adalah hal sederhana yang pada dasarnya manusia sulit untuk diingat,

Kadang juga web developer lupa dengan menyimpan password sensitif ke dalam aplikasi, yang seharusnya tidak boleh contoh seperti di github jika mencari commit dengan keyword “hapus password” akan muncul banyak commit berupa credential database ataupun server

![silly commit](https://cdn-images-1.medium.com/max/2000/1*bg_qmqChjnZtWI8Ym9ayDw.png)*silly commit*
> # Cara paling aman menyimpan secret key ke dalam aplikasi adalah dengan tidak menyimpan secret key ke dalam aplikasi

Sebenarnya mudah, cukup jangan menyimpan secret key ke dalam aplikasi, bisa dipisahkan menggunakan variable enviroment atau di encrypt supaya membuat bingung orang usil.

## File Upload

Serangan terakhir yang biasanya hacker paling cari kalau sudah menemukan akses dari aplikasinya adalah file upload supaya hacker bisa menanam backdoor dan akses aplikasi/ server secara mudah. Nah sebelumnya kita cari tau dulu cara hacker hack file upload ini

**Manipulasi File Signature File Type**

Sudah umum buat di bagian file upload untuk mengkhususkan file yang akan diupload secara spesifik, khusus dokumen (pdf, doc,dll), khusus gambar (png, jpeg, svg) biasanya hacker akan melakukan manipulasi tipe data juga pada bagian header atau[ file format structure](https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format) . Setiap file terdapat format yang dibaca secara binary dan file format ini

Contohnya salah satunya file JPG dia pada header biasanya terdapat header ÿØÿà..JFIF.. dengan alamat FF D8 FF E0 00 10 4A 46 49 46 00 01

![](https://cdn-images-1.medium.com/max/2000/1*cL2avBrZA4OPhy17NRx7_w.png)

Untuk png dengan binary .PNG... dengan alamat89 50 4E 47 0D 1A 0Aseperti berikut

![](https://cdn-images-1.medium.com/max/2000/1*Y-T5JEcY7W6Op4g61ia0WQ.png)

Dengan cukup menambahkan header ke file php tersebut hacker secara mudah memanipulasi dan file tersebut akan terdeteksi sebagai JPG/ PNG

![](https://cdn-images-1.medium.com/max/2000/1*QLqn9p6LIkU4xjs-OPNfbw.png)

Oke dalam kasus ini biasanya hacker menggunakan File upload jenis Whitelist, artinya biasanya developer PHP menggunakan fungsi get_mime_type($filename) dengan mime yang dibutuhkan image/jpeg dengan fungsi tersebut file yang di manipulasi akan tetap muncul image/jpeg

### Manipulasi EXIF key

Pada file gambar terdapat EXIF ( Exchangeable Image File Format ) untuk mendefinisikan file format pada gambar biasanya berupa lokasi file diambil, resolusi file dan sebagainya. Pada PHP disaat upload file dan filenya dibaca akan dibaca pada bagian EXIF nya juga, dan ada cara hacker menyisipkan php execution pada EXIF nya seperti berikut

    exiftool -Comment='<?php echo "<pre>"; system($_GET['cmd']); ?>' lo.jpg

Dengan EXIF ini code php tersebut akan dieksekusi

**Solusi File Upload**

Semua tujuan dari file upload itu semua adalah shell execution atau dalam artian lain melakukan eksekusi perintah pada operating sistem tersebut, sebenernya sesederhana disable eksekusi shell pada PHP atau engine web lainnya pada php bisa menggunakan [https://www.cyberciti.biz/faq/linux-unix-apache-lighttpd-phpini-disable-functions/](https://www.cyberciti.biz/faq/linux-unix-apache-lighttpd-phpini-disable-functions/)
> # Saya merasa kurang dan masih kena hacking :(

Banyak alternatif nya di internet, kalo saran saya sendiri bisa menggunakan web security checklist untuk developer, bisa cek disini
[**Web developer security checklist**
*Dari data pada website zone-h.org dijelaskan hampir satu hari hacker mampu melakukan deface sebanyak 5 sampai 20…*medium.com](https://medium.com/@yahya.kimochi/web-developer-security-checklist-920ac4421589)

## Referensi

[https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/](https://www.netsparker.com/blog/web-security/sql-injection-cheat-sheet/)
[**List of file signatures - Wikipedia**
*Many file formats are not intended to be read as text. If such a file is accidentally viewed as a text file, its…*en.wikipedia.org](https://en.wikipedia.org/wiki/List_of_file_signatures)

[http://exif.regex.info/exif.cgi](http://exif.regex.info/exif.cgi)
[**Why HTTPS Matters | Web Fundamentals | Google Developers**
*You should always protect all of your websites with HTTPS, even if they don't handle sensitive communications. HTTPS…*developers.google.com](https://developers.google.com/web/fundamentals/security/encrypt-in-transit/why-https)
