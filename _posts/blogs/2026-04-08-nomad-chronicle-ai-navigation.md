---
layout: post
title:  "Install Nomad Multi-Region di chronicle.rip: Full AI Navigation dari Nol"
date:   2026-04-08 14:00:00 +0700
categories: nomad infrastructure devops ai claudecode blogs blog
comments: true
---

gw baru aja selesai build Nomad cluster multi-region buat [chronicle.rip](https://chronicle.rip) — mapping platform yang serve user di 86 negara. 3 region (Singapore, Australia, US), 6 VM, federated Nomad cluster, Headscale VPN mesh, zero public IP, dan semuanya di-navigate pake AI.

bukan hyperbole. literally setiap keputusan arsitektur, setiap command, setiap config — gw navigate pake Claude Code.

ini ceritanya.

---

## masalahnya

chronicle.rip itu pake Docker Compose di GCP VM. kuno. setiap deploy harus SSH ke server, pull image, restart container. scaling? tambah VM manual. monitoring? Prometheus yang di-scrape lewat CDN (iya, gw tau, ini bodoh — ceritanya panjang).

dan yang paling parah: **US user kena 6.35 detik P99** karena load balancer cuma point ke Australia. US server udah jalan, udah bayar $250/bulan, tapi GA PERNAH DI-CONNECT ke backend service. 💀

waktunya migrate ke something proper.

---

## kenapa Nomad, bukan Kubernetes?

ini keputusan pertama yang gw navigate pake Claude Code. gw kasih konteks:

```
"gw punya 4 VM sekarang, mau scale ke 6. 
workload-nya Django API, Angular frontend, Redis, Elasticsearch.
budget terbatas. tim cuma gw doang. 
compare Nomad vs Kubernetes buat case ini"
```

dan AI kasih analysis yang jujur:

**Kubernetes:**
- butuh minimum 3 master node
- etcd, CRD, operator — complexity tinggi
- overhead resource ~30% dari total capacity
- great ecosystem tapi overkill buat 6 node

**Nomad:**
- single binary, server + client
- native Docker support, ga perlu containerd config
- GPU scheduling built-in (buat BIRT workers)
- operational complexity rendah — satu orang bisa maintain

keputusan: **Nomad**. dan ini bukan keputusan yang salah.

---

## keputusan kedua: Consul atau engga?

ini menarik. semua tutorial HashiCorp bilang "pake Consul buat service discovery". gw tanya Claude Code:

```
"Nomad 1.11 udah punya native service discovery. 
chronicle cuma butuh inter-service communication dalam satu region. 
ga butuh service mesh. ga butuh cross-region service calls.
masih perlu Consul?"
```

jawabannya: **ga perlu.**

alasannya clear:
- Nomad 1.11 punya `nomadService` template function — cukup buat discover service dalam cluster
- Consul nambah 5 port firewall per node
- nambah satu cluster lagi yang harus di-maintain
- buat 6 node tanpa service mesh requirement, overkill

gw dokumentasiin keputusan ini di `01-DECISION.md` — biar kalau nanti ada yang tanya "kok ga pake Consul?", jawabannya udah ada.

---

## arsitektur yang di-build

```
nomad-vpc (global)
├── nomad-subnet-sg   10.20.1.0/24   (Singapore)
│   ├── nomad-server-sg   10.20.1.2    ← Headscale server
│   └── nomad-client-sg   10.20.1.3    ← Workload runner
├── nomad-subnet-aus  10.20.2.0/24   (Australia)
│   ├── nomad-server-aus  10.20.2.2
│   └── nomad-client-aus  10.20.2.3
└── nomad-subnet-us   10.20.3.0/24   (US Central)
    ├── nomad-server-us   10.20.3.2
    └── nomad-client-us   10.20.3.3
```

6 VM. 3 server (Nomad control plane), 3 client (workload execution). semua TANPA public IP — akses cuma lewat GCP IAP tunnel atau Headscale VPN.

kenapa Headscale? karena gw butuh overlay network antar region yang:
- encrypted (WireGuard)
- ga butuh VPC peering
- bisa diakses dari laptop developer
- free (self-hosted Tailscale control server)

satu Global HTTP Load Balancer di depan buat expose Nomad UI dan Headscale endpoint.

---

## full AI navigation: gimana prosesnya

ini bagian yang paling menarik buat diceritain.

### fase 1: planning

gw ga langsung build. gw minta Claude Code bikin architecture document dulu:

```
"bikin architecture document buat multi-region Nomad cluster.
requirement: 3 region (SG, AUS, US), GCP, 
no public IP, Headscale VPN, federated cluster.
include: VPC layout, firewall rules, VM specs, 
software stack, deployment pipeline"
```

dia generate `02-ARCHITECTURE.md` — document lengkap yang jadi blueprint. gw review, revisi, approve.

### fase 2: provisioning

semua resource GCP di-create lewat Claude Code executing `gcloud` commands:

```
"create VPC, subnets di 3 region, firewall rules sesuai architecture doc,
6 VM dengan spec yang udah di-define. no public IP, IAP access only"
```

dia execute step by step. VPC → subnet → firewall → VM → SSH keys. kalau ada error (dan PASTI ada error, terutama firewall rules), dia baca error-nya dan fix sendiri.

total: 6 VM, 3 subnet, 6 firewall rules, 3 Cloud NAT, 3 Cloud Router, 1 Load Balancer — semua dari terminal.

### fase 3: software installation

SSH ke tiap VM lewat IAP tunnel, install Nomad, Docker, Tailscale:

```
"SSH ke nomad-server-sg via IAP, install Nomad 1.11.3, Docker, 
Tailscale. configure Nomad as server, region sg, 
datacenter dc-sg. enable ACL."
```

6 VM × setup sequence = banyak command. tapi karena pattern-nya sama, Claude Code bikin reusable script yang di-adapt per region.

### fase 4: cluster federation

ini bagian yang tricky. 3 Nomad server harus join jadi satu federated cluster via WAN gossip. tapi WAN gossip jalan di atas Headscale overlay network, bukan GCP internal network.

```
"federate nomad-server-aus dan nomad-server-us 
ke nomad-server-sg via Headscale IP (100.64.0.x). 
verify dengan nomad server members"
```

pertama kali gagal karena gossip port ga di-allow di firewall Headscale. Claude Code diagnose dari error log, suggest fix, dan retry. second attempt: federated. ✅

### fase 5: deploy BIRT

BIRT itu data processing service chronicle — 9 worker groups, pull dari Harbor registry, connect ke MySQL via socat proxy.

ini dimana fun stuff happen:
- 5 worker images MISSING boto3/botocore dependency → Claude Code patch in-place dengan `docker commit`
- nginx job naming quirk: production nginx ternyata job `nginx-test`, bukan `nginx` → Claude Code discover ini dari allocation list dan WARN gw buat ga stop `nginx-test`
- database connectivity lewat socat proxy over Headscale mesh → Claude Code set up end-to-end

---

## hasil akhir

| Metric | Sebelum (Docker Compose) | Sesudah (Nomad) |
|--------|------------------------|-----------------|
| Deploy method | SSH + pull + restart | `nomad job run` |
| Multi-region | Manual per VM | Federated cluster |
| Service discovery | Hardcoded ports | `nomadService` dynamic |
| Scaling | Tambah VM manual | Nomad allocation |
| Monitoring | Prometheus lewat CDN 😅 | Nomad UI + health checks |
| Security | Public IP di semua VM | Zero public IP, IAP only |

total waktu build: **~3 hari kerja** buat production-grade multi-region cluster.

tanpa AI navigation? estimasi gw: **2-3 minggu** minimum, considering gw baru pertama kali setup Nomad multi-region.

---

## yang gw pelajari

### 1. AI navigation bukan berarti AI yang decide

setiap keputusan arsitektur (Nomad vs K8s, no Consul, Headscale vs VPN, region layout) — gw yang decide. Claude Code provide analysis, comparison, trade-offs. tapi decision tetep gw.

### 2. documentation as you go

karena Claude Code jalan di terminal, semua proses ter-documented secara natural. gw punya `ACTIVITY_LOG.md` yang list SEMUA resource yang di-create, `01-DECISION.md` buat keputusan arsitektur, `RESULT.md` buat summary. documentation yang biasanya di-skip karena "nanti aja", sekarang jadi by-product dari workflow.

### 3. error handling jadi cepet

Nomad cluster federation gagal? Claude Code baca log, identify issue (firewall), suggest fix, execute. dependency missing di Docker image? dia suggest `docker commit` buat patch in-place. nginx naming quirk? dia discover dari data dan warn.

dulu error kayak gini bisa makan setengah hari googling Stack Overflow. sekarang menit.

### 4. the compound effect

satu-satu, each AI assist kecil. tapi compound-nya gede: architecture doc + provisioning + installation + configuration + troubleshooting + documentation — semua di-accelerate. 3 hari vs 3 minggu bukan karena satu shortcut, tapi karena puluhan shortcut yang stack.

---

## buat yang mau coba

kalau lo mau setup Nomad cluster dan mau coba navigate pake AI:

1. **mulai dari architecture doc.** jangan langsung build. minta AI bikin blueprint, lo review
2. **satu region dulu.** jangan langsung 3 region. set up SG, pastiin works, baru expand
3. **document decisions.** kenapa Nomad, kenapa no Consul, kenapa Headscale — tulis alasannya
4. **expect errors.** AI ga perfect. firewall rules salah, config typo, dependency missing — normal. yang penting AI bisa help diagnose cepet
5. **keep the human in the loop.** AI navigate, lo drive

cluster gw sekarang jalan. BIRT healthy, 9 groups running, semua region federated. dan gw ga pernah buka satu tutorial YouTube pun.

terminal + AI. that's it.
