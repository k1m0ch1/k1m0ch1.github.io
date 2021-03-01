---
layout: post
title:  "1 Minggu dengan VIM : bagaimana saya meningkatkan produktifitas ngoding dengan mengurangi penggunaan mouse"
date:   2020-10-22 02:00:00 +0700
categories: vim blogs blog
comments: true
---

Beberapa orang pasti pernah panik, terjebak di terminal tiba tiba buka editor dan ga bisa keluar, antara bakal nanya orang atau terminalnya di force close, akhirnya bisa keluar dengan perintah `:!q`

![](https://miro.medium.com/max/638/1*lu1ks_Ac1YyXmyeRa0Dk9A.png)

VIM, File text editor yang jalan di terminal, agak aneh sebenernya ngoding di terminal, percaya ga percaya ini membuat ngoding kita jadi lebih produktif. Singkat cerita saya sering banget nontonin videonya William Lin di youtube, dia suka share solving coding challenge dari google, biasanya solving algorith problem, kagumnya saya dia bisa solving semua masalahnya cukup 1 jam saja, dan saya liat dia ngoding ga muluk muluk cukup pake VIM, yang artinya interaksi ngoding dia lebih banyak menggunakan keyboard, karena sesungguhnya seberapa banyak kita menghabiskan waktu pindah tangan dari keyboard ke mouse cuman buat cari file yang mau di buka, hapus baris ataupun men-highlight text.

Setelah mencari referensi tentang VIM, akhirnya saya menantang diri saya sendiri untuk mencoba menggunakan VIM selama satu minggu, demi meningkatkan produktifitas ngoding, biarpun terkadang masih “cheat” pake VSCode 👀.

# Hari Pertama
Baca baca dulu tentang VIM, beberapa artikel menarik tentang VIM bisa baca disini :
https://medium.com/better-programming/understanding-the-efficiency-of-vim-d6a5ab8feb2d

Setelah itu coba terjun main game VIM, bisa akses disini https://vim-adventures.com/, gamenya seru dan interaktif

![](https://miro.medium.com/max/649/1*6m_wb_Zoa_c09fyB_gvdyA.png)

#Hari Kedua
Install VIM langsung buka project dan start ngoding pake VIM, aku disini pakai `gnome-terminal` dimana banyak shortcutnya juga buat swithching window, dimana hari ini saya mengetahui

1. bikin tab baru `Ctrl + Shift + n`
2. switching window `Alt + 1` `Alt + 2` `Alt + angka` dan dari sini saya menyadari switching tab chrome juga bisa pake itu
3. start ngoding dengan `vim namafile.py`
4. membiasakan apa itu `Normal Mode (esc)` `Insert Mode ( i/a )` `Visual Mode (v)`
5. membiasakan save file dengan `:w` buat save file tanpa close editor dan juga `:wq` atau `:x` save file dan close editor, dan `:q!` close editor tanpa simpan file

# Hari Ketiga

setelah terbiasa buka file dan file switching dengan switching window, baru lanjut ke split editor dan copy paste code

1.menggunakan `:vsplit namafile` untuk mensplit window vertical, kalau mau horizontal tinggal `:split namafile` tampilannya jadi seperti berikut

![](https://miro.medium.com/max/700/1*McZX0wNEsjKN8aa8Q2acBQ.png)

2. membiasakan copy paste dengan `Visual mode` dan copy dengan `yank mode`, caranya setelah di highlight pada `Visual mode` langsung tekan  `y` dan untuk paste langsung tekan `p`

3. membiasakan menghapus pada `Normal mode` , `dd` untuk hapus baris, `x` untuk hapus karakter

4. membiasakan untuk undo dengan pencet `u` pada `Normal mode` dan `<C-R>` untuk redo biasanya itu tombol `Enter`

5. membiasakan mencari text pada `Normal mode` , dan ketik `/katayangdicari` dan pencet `n` untuk lanjut cari

saya biasakan ini sampai hari ke tujuh.

Hasilnya, cukup produktif, saya ga lama lagi buat ngoding, masalahnya adalah belajarnya emang harus tekun banget, dan emang susah banget buat di awal kalau di realisasikan pada learning curve kira kira seperti ini

![](https://miro.medium.com/max/700/0*aq4f42lTdu3QMvPJ.jpeg)

Kurang lebih itu pengalaman saya satu minggu menggunakan VIM dengan langsung terjun ngoding di keseharian kerja saya, mungkin nanti aku share lagi setelah pengalaman saya setelah menggunakan VIM selama satu bulan.