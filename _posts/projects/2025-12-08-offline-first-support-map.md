---
layout: post
title:  "RFC - Offline First Support for pinpoint map"
date:   2025-12-08 16:01:00 +0700
categories: projects project
comments: false
cover: /images/og/2025-12-08-offline-first-support-map.png
---

## Problem and Motivation

recently I saw this thread https://x.com/radjathaher/status/1997586237683851343 that talking about supporting the disaster response, especially with disaster related with flood at the sumatera some of the reference of the news you could see it here https://www.tempo.co/politik/situasi-belajar-di-sekolah-terdampak-banjir-sumatera-belum-pulih-2097086. 

![korban banjir](http://k1m0ch1.github.io/images/sedih.jpg)

and some of the survivor having a hardtime to support their family, even for themself, I see some discussion on socmed telling some teenager and some volunteer helping others and sarcificing himself by not eating and drinking until makes their urine become yellow to brown to red, they seeking for help, I'm actually crying to hear about this, while I'm here having a good life, I want to help them, even not giving money is not enough, so I cross upon Radja Thaher thread and he want to do "warga bantu warga"

![invitation letter](http://k1m0ch1.github.io/images/xtweet-radja-thaher.png)

while people on the place having a hardtime to get some internet, this design is to support offline first of the web application

## Proposed design

### Arch design

The design is pretty simple, when user do some action like making a new pinpoint, giving information, every basic CRUD will be stored into indexedDB, for reference you can use this https://github.com/eFishery/pouchy-store the pouchyDB is working kinda like indexedDB, remember pouchDB have not conflict resolution, no built-in conflict resolution logic, pouchyDB is simply edit the same document offline and later sync.

![simple high level](http://k1m0ch1.github.io/images/high-level-arch.png)

remember pouchyDB using document database, while indexedDB structure level is using object stores

### Data Model

searching on internet, for disaster have 2 important data, p2p report and p2p pinpoint place and I get this data from FEMA (https://www.fema.gov/api/open/v2/DisasterDeclarationsSummaries), so for this simple approach I made example of data Model 

1. p2p report 
this is when people want to sent alert, give information, or incident report, here is the basic data model, and people could verify if the report is actually true or not
```
{
  "_id": "report:short-uuid",
  "type": "report",
  "category": "flood",
  "severity": "high",
  "location": {
    "lat": -6.2088,
    "lng": 106.8456
  },
  "description": "Flooded street, water up to knee",
  "status": "active",
  "verifiers": [
    {
      "verifiedBy": "device:userid",
      "status": false,
      "description": "benar kejadian"
    }
  ],
  "createdAt": "2025-01-01T08:00:00Z",
  "updatedAt": "2025-01-01T08:00:00Z",
  "createdBy": "device:abc123",
  "offlineCreated": true
}
```

2. p2p map pinpoint
this is just suggestion for a data model map pinpoint
```
{
  "_id": "place:short-uuid",
  "type": "place",
  "placeType": "shelter",
  "name": "Shelter Pengunsi Masjid Nurul Haq Parupuk Tabing",
  "location": {
    "lat": -0.8817378,
    "lng": 100.3441077
  },
  "capacity": 200,
  "current_capacity": 120,
  "resources": {
    "food": true,
    "water": true,
    "medical": true,
    "bed": false,
  },
  "lastCheckedAt": "2025-01-01T07:30:00Z",
  "verifiedBy": null,
  "createdAt": "2025-01-01T06:00:00Z",
  "updatedAt": "2025-01-01T07:30:00Z"
}
```

3. Sync State document
this data model purpose to track replication statuys
```
{
  "_id": "_local/sync_state",
  "type": "sync_state",
  "lastPushSeq": "3456",
  "lastPullSeq": "3448",
  "lastSyncAt": "2025-01-01T09:30:00Z",
  "conflictsDetected": 2
}
```

### IMPORTANT - Conflict Resolution

we need to make some ruleset on data, to prevent the conflict data, what happen when data conflict happen ? in some cases latest data will be replaced by new data, so to prevent this we need to make some rule based on domain based conflict resolution.

here is some oveview of the data type:

| Data type  | Conflict occurance | Strategy |
| ------------- | ------------- | ------------- |
| Map Pinpoint  | Common | only append, or create only with new lang&lot |
| Report  | Rare  | Field level merge |

1. Append only

why ? multiple people will report the same dissaster, 
what todo ? always create a new one, never edit an existing report, and merging the verifier

2. Field Level merge

why ? user update some field, merge usually safe
what todo? this will be help when new status resource is added

!!IMPORTANT NOTES!! for some notes it possible to make auto resolution, usually by doing scheduled or manually operated by operator.

3 Role based override verification

this feature is also important in order to choose which data is actually true

| Role  | Permission |
| ------------- | ------------- | 
| Anonymous  | Can Report, Can pinpoint |
| volunteer  | update report, update pinpoint  |

simple approach you can using verified=true to set by trusted role 

4. another notes
- avoid trying to merge everything
- proper design data so that conflict rarely occur 
- last write win only when safe 

### Technology

- Offline data layer (indexedDB) usually used by browser native
- service worker
- sync mechanism
  - bi-directional sync (example:https://github.com/mikeal/couchup )
  - retry on failure
- sync trigger
  - app startup
  - network available
  - manual user action
- database couchDB 3.x
  - remember https enabled
  - and secured with credential
- database configuration
  - separate database by domain, report, places, etc
- data integrity
  - timestamp all document
