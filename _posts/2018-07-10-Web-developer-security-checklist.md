
# Web developer security checklist

Dari data pada website zone-h.org dijelaskan hampir satu hari hacker mampu melakukan deface sebanyak 5 sampai 20 website bersamaan.

![sumber zone-h.org](https://cdn-images-1.medium.com/max/2000/1*zaWCTV52MyjAq6Vx2sM1Pg.png)*sumber zone-h.org*

Sudah menjadi tuntutan untuk developer dalam tanggung jawab hal ini, bagaimana dengan developer yang benar benar belum paham dalam melakukan security check pada ruanglingkup web nya, tentu sudah menjadi hal paling rumit dan memakan waktu untuk melakukan research yang cocok, banyaknya developer berakhir dengan memasang tools “security” yang ternyata tools tersebut malah jadi backdoor juga.

So sebelum mengetahui apa yang harus di patch, penulis akan share tentang serangan serangan umum yang di lakukan oleh para hacker untuk mendapatkan hak akses tinggi pada website mu

Sebelumnya, semua yang penulis tulis adalah dalam maksud research dan serangan serangan yang di praktekan dilakukan sesuai izin pengguna.

## ScriptKiddieAttack

Mungkin terdengar bodoh, maksud dari script kiddie attack sendiri hacker modern ini biasanya melakukan serangan serangan random yang bahkan toolsnya mereka dapatkan dari internet (freeware/crackware bodoamat!) yang penting tujuan mereka serang website kalian secara random untuk mendapatkan hak akses tinggi pada website mu. Percaya ga percaya serangan ini 40% berhasil, yes 40% adalah angka yang cukup untuk melakukan serangan ini dan angka ini akan terus bertambah, kenapa ? karena di internet banyak disediakan tools tools hacking free dimana satu tombol langsung instan deface. Salah satunya exploit-db.com website ini ga pernah diem sehari pun untuk menerbitkan update vulnerability hole aplikasi yang baru beserta dengan cara penggunaan dan script exploit nya.

## HackermanAttack

Untuk kedua kalinya, jika hacker kesulitan dengan scriptkiddie attack mereka bakal lebih serius dikit dengan teknik hacking yang lebih proper, cari tau identitas kalian, clonewebsite kalian, hijacking DNS, spamming email official kalian, apapun caranya sampe nemu clue buat ambil hak akses tinggi kalian. Jarang banget hacker yang masuk tahap ini, biasanya hacker kalo udah gagal bakal cari target yang serupa atau satu rumah.

## FrustatedmanAttack

Intinya hacker ga bisa jebolin website kalian dan maksain diri nyerang pake DDoS. (jujur mereka niat banget sampe bikin bot banyak buat DDoS)
> Artinya dengan tools yang bertebaran di internet semudah itu siapapun jadi hacker.

![](https://cdn-images-1.medium.com/max/2000/1*BYsYluqQQRCg-6s6HPfZ0w.png)
> Tentu sebagai developer juga ga akan sulit untuk tangkis serangan meraka

Dengan bestpractice security dari pengalaman saya sebagai pentester, saya membuat checklist security untuk developer dalam memudahkan patch security.

![sumber [https://github.com/k1m0ch1/secguide/blob/master/general-security-development-guide-id.md](https://github.com/k1m0ch1/secguide/blob/master/general-security-development-guide-id.md)](https://cdn-images-1.medium.com/max/2044/1*enU0Vpv_7dsdj7fru6ZI_g.png)*sumber [https://github.com/k1m0ch1/secguide/blob/master/general-security-development-guide-id.md](https://github.com/k1m0ch1/secguide/blob/master/general-security-development-guide-id.md)*

Dari checklist ini mampu menangkis serangan **ScriptKiddieAttack **dan **FrustatedmanAttack.**

Bisa di cek repo saya di [https://github.com/k1m0ch1/secguide](https://github.com/k1m0ch1/secguide) , repo ini dengan leluasa jika ada update silahkan lakukan pull request :D.

Terakhir dari saya.
> # Kita ga pernah tau segala sesuatu itu aman, bayangkan jika security menjadi AI, hacking pun bisa menjadi AI
