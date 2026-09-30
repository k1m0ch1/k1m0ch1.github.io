---
layout: post
title:  "Setup MCP yang Bikin Claude Code Jadi Senjata: dari Terminal Guys untuk Terminal Guys"
date:   2026-04-08 12:00:00 +0700
categories: ai mcp claudecode blogs blog
comments: true
cover: /images/og/2026-04-08-mcp-setup-terminal-guys.png
---

gw bukan orang yang suka buka IDE terus klik-klik. gw terminal guys. tmux di linux server, windows buat daily driver, dan semua kerjaan gw lewat CLI. jadi waktu AI coding tools mulai rame, gw ga tertarik sama sekali sama yang model-model kayak open-claw, nemo-claw, atau apalah nama-nama hype tool yang tiap minggu muncul terus ilang.

yang gw butuhin itu simple: AI yang bisa kerja di terminal gw, ngerti konteks project gw, dan ga bodoh.

dan jawabannya: **Claude Code + MCP**.

---

## pertama-tama: Claude Code, bukan GPT

gw udah coba semuanya. GPT, Copilot, semua. dan kesimpulan gw: **GPT itu sampah buat coding.**

bukan karena ga bisa generate code — bisa. tapi outputnya itu kayak orang yang baca dokumentasi 5 menit terus sok ngerti. halusinasi API yang ga ada, suggest library yang udah deprecated, dan yang paling nyebelin: ga bisa maintain context panjang.

Claude Code beda. ini bukan chat interface yang lo copy-paste code ke sana. ini CLI tool yang literally jalan di terminal lo, baca file lo, execute command, dan ngerti project lo. gw run ini pake `--dangerously-skip-permissions` karena gw males approve tiap tool call — ya gw tau risikonya, tapi gw juga yang control terminalnya.

yang bikin Claude Code juara:
- **web search bawaan** — dia bisa search internet langsung dari terminal. ga perlu buka browser buat cari docs.
- **image analysis** — ini yang bikin gw "what the hell is this". lo bisa kasih screenshot error, screenshot UI, screenshot diagram, dan dia BACA itu. dari terminal. screenshot → paste → dia ngerti. gw pernah kasih screenshot Grafana dashboard dan dia langsung ngerti metric mana yang anomaly.
- **sub agent** — ini game changer. lo bisa spawn agent terpisah buat research, buat explore codebase, buat review code, PARALEL. jadi gw bisa minta satu agent research API docs sementara gw lanjut ngoding. ini fitur yang gw lagi consider buat dimaksimalin lebih jauh.
- **model switching** — bisa pake Opus buat yang berat, Sonnet buat yang cepet, Haiku buat yang ringan. fleksibel.

---

## MCP: yang bikin Claude Code dari "bagus" jadi "gila"

MCP itu Model Context Protocol. intinya: lo bisa connect tools external ke Claude Code, jadi dia punya "tangan" tambahan. bukan cuma baca file dan run command, tapi bisa akses database, browser, search engine, memory system, code intelligence — semua dari terminal.

ini setup MCP gw yang sekarang jalan:

### 1. GitNexus — Code Intelligence di Server

gw install [GitNexus](https://github.com/nicholasgasior/gitnexus) di server gw sendiri. ini MCP server buat code intelligence — semantic search, symbol lookup, impact analysis, rename refactoring — semua diindex dari repo lo.

cara pakenya: `list_repos` dulu buat liat apa aja yang ke-index, terus bisa `semantic_search` buat cari code by meaning (bukan by string), atau `symbol_context` buat ngerti satu function beserta dependency-nya.

kenapa di server sendiri? karena gw ga mau code gw dikirim ke third party. self-hosted, data gw tetep di gw.

### 2. Mem0 — Persistent Memory

ini yang keren. [Mem0](https://github.com/mem0ai/mem0) itu memory layer buat AI. gw bikin MCP servernya sendiri. jadi Claude Code bisa "inget" hal-hal lintas conversation:
- project context yang udah di-discuss
- user preferences
- keputusan arsitektur yang udah dibuat

tanpa ini, tiap conversation baru lo harus jelasin ulang semuanya. dengan Mem0, Claude langsung tau konteksnya.

### 3. Playwright MCP — Control Browser dari Terminal

ini mungkin yang paling mind-blowing buat orang yang belum pernah liat. [Playwright MCP](https://github.com/anthropics/claude-code) extension yang bisa control SESSION browser lo yang lagi buka. bukan headless browser baru — browser lo yang lagi login, yang lagi buka dashboard, yang lagi di tengah-tengah workflow.

gw pake ini buat:
- scrape data dari dashboard yang butuh login (Cloudflare, GCP Console)
- automate form submission (gw literally migrate 652 R2 bucket paths pake ini)
- capture network requests buat reverse engineering API
- take screenshot buat di-analyze Claude

lo kerja di terminal, tapi lo punya mata di browser.

### 4. RTK — Token Saver dari Rust

[RTK (Rust Token Killer)](https://github.com/rtk-ai/rtk) ini hidden gem. single binary Rust yang intercept command output sebelum masuk ke context window Claude. jadi `git status` yang biasanya makan 200 token, setelah lewat RTK jadi 40 token.

claim mereka 60-90% token savings. dari experience gw, beneran kerasa — session jadi lebih panjang, context ga cepet penuh.

install, set hook, lupa. dia kerja di background.

### 5. Context7 — Documentation yang Selalu Update

[Context7](https://github.com/upstash/context7) itu MCP server yang fetch dokumentasi library LANGSUNG dari source, version-specific. jadi kalau lo nanya tentang Next.js 14, dia kasih docs Next.js 14, bukan Next.js 12 yang ada di training data.

52K stars di GitHub bukan tanpa alasan. ini solve masalah terbesar AI coding: **hallucinated APIs**.

### 6. Shodan MCP — buat pentesting

ya, gw juga punya Shodan MCP. jadi bisa `ip_lookup`, `cve_lookup`, `dns_lookup` langsung dari Claude Code. buat recon dan research, ini powerful banget.

---

## yang gw pengen explore selanjutnya

[agent-skills-for-context-engineering](https://github.com/muratcankoylan/agent-skills-for-context-engineering) — ini collection of AI agent skills yang optimize gimana LLM pake context window. 13 skills dari foundational sampe cognitive patterns. idenya bagus: instead of maximizing tokens, optimize ATTENTION. gw belum implement tapi udah di radar.

---

## daily workflow gw

```
Windows (local)
  └── Claude Code CLI (--dangerously-skip-permissions)
        ├── MCP: GitNexus (self-hosted server)
        ├── MCP: Mem0 (self-hosted, custom server)
        ├── MCP: Playwright (control active browser)
        ├── MCP: Shodan (recon)
        ├── MCP: Context7 (live docs)
        ├── RTK hook (token compression)
        └── SSH → Linux server
              └── tmux sessions
                    ├── development
                    ├── monitoring
                    └── deployment
```

ga ada IDE. ga ada fancy GUI. terminal, MCP, dan AI yang ngerti konteks lo.

---

## buat yang baru mulai

kalau lo baru mulai pake AI buat coding dan bingung mau mulai dari mana:

1. **install Claude Code** — `npm install -g @anthropic-ai/claude-code`
2. **mulai dari tanpa MCP** — Claude Code udah powerful sendiri. biasain dulu workflow-nya
3. **tambahin MCP satu-satu** — Context7 paling gampang buat start, tinggal `npx ctx7 setup`
4. **jangan ikut-ikutan hype tool** — serius, open-claw dan sejenisnya itu mostly wrapper di atas API yang sama. lo ga butuh 15 layer abstraction. lo butuh tool yang KERJA.
5. **pake `--dangerously-skip-permissions` kalau lo tau apa yang lo lakuin** — ini bukan buat pemula, tapi kalau lo udah ngerti risikonya, workflow jadi 10x lebih smooth

yang penting: **jadiin AI sebagai partner, bukan magic wand.** lo tetep harus ngerti code-nya. AI cuma bikin lo lebih cepet sampe sana.

---

gw akan terus update setup MCP gw. kalau ada tool baru yang worth it, gw tulis lagi. kalau ada yang sampah, gw bilang juga.

stay terminal, stay sane. ✌️
