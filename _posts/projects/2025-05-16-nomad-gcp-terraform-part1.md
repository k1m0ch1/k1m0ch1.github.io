---
layout: post
title:  "Nomad Playground draft-1"
date:   2025-05-16 22:01:00 +0700
categories: projects project notes
comments: true
---

I just curious on how to setup the proper nomad with a proper terraform, and this is actually a notes not a dedicated project page, so this page kinda like a draft page for a proper project part, a gibberish and dump to my playground.


so here we go, I really wanted to know if I install nomad in GCP with a proper terraform


in summary this is what I learn today :

1. setup neovim is fucking hard, but really satisfying
2. setup neovim with claude-code is easy and better but fucking hard to setup and expensive
3. using chatgpt and claude for testing the both performance of AI, so I use strict rule where chatgpt for asking the code terraform and claude for the learning assistance
4. setup terraform to connect with gcp simply setup gcloud
5. terraform is kinda like setup the server inventory, gibberish and like dump truck
6. terraform is a nice tools
7. I just found out infracost are better to calculate "ONLY" the instance part
8. terraform plan is important 


now letsstart from the begining


yea, setup neovim is kinda hard and kinda embarassing, its been like almost a year, I'm using neovim for all of the work I did, and I still forget on how to add new plugin, so I kinda struggle to add this new plugin called claude-code so it would be easy to talk with claude, and it start I explore the `~/.config/nvim` directory ask the chatgpt how to add this, add new file called `claude-code.lua` in dir `~/.config/nvim/lua/plugins/`, and I remember now how to setup it, so I start using `:Lazy` command and it show all the loaded or not loaded plugin, and the I just update the plugin


> ![load the plugin](https://k1m0ch1.github.io/images/1a4346e1-e2fd-4363-b751-341a851a14d3.png)


I just restart it and it just broke fucking everything, this tooks the time, restart the wsl, restart the neovim, change this change that, and it turn out the neovim is outdated and the updated plugin isn't supported anymore, so I just simply resolve this by just update


> ![broke](https://k1m0ch1.github.io/images/065936a5-f171-4dd1-b590-4312defbb31e.png)


and now it actually work, but I need to setup claudecode, so I just download claude code, setup the pricing plan, the plan, setup in the CLI, and this is how it looks like


> ![claude cli code](https://k1m0ch1.github.io/images/claude-code-nvim.png)


I just mention I use chatgpt to help generate the code and claude for the assistance, so here is the rule

1. I will generate the code using chatgpt, but I will rewrite it by typing it not by copy paste

2. I believe if I typing it, I will understand the line of the terraform code, so it won't waste my mind

3. now here is come the claude code part, because it interactive within neovim UI, so I will ask the fundamental of the code.



to setup the terraform and connect using google or gcp provider you need gcloud cli installed, and setup the account within your CLI, so the terraform really need the gcloud is setup, and I still wonder how to setup this on CI/CD, well lets think that later then, here is what it look like after I complete setup the terraform


> ![terraform](https://k1m0ch1.github.io/images/setup-terraform.png)


after I see the terraform code, I just believe this terraform is kinda automated server inventory, and to setup the code is fucking worse, its like you setup data static, I wonder if there is a better way to manage terraform, just wonder if I setup 1000 machine, how many long code I have.


but beside that, terraform is best tools for infra community, it has a big community and it mean you could be easily to resolve your problem



so the last part, I just add this infracost, you need to install the infracost, pick the plan of $0.99/month, and 30 days trial, install the CLI, integrate within your CLI, and it would be look like this


> ![infracost](https://k1m0ch1.github.io/images/infracost.png)


thats it for today

lets see if I could deploy for tomorrow
