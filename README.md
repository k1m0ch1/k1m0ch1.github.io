# k1m0ch1.github.io

Personal blog built with **Jekyll** and Ruby gems.

## Run locally (Gem/Jekyll)

### 1) Prerequisites

- Ruby (tested here with `ruby 3.2.10`)
- RubyGems
- Bundler

> On this Windows environment, `bundle` shim can fail. Use `ruby -S bundle ...` commands (shown below).

### 2) Install dependencies

```bash
make install
```

### 3) Build the site (sanity check)

```bash
make build
```

### 4) Start local server

```bash
make serve
```

Then open:

- http://127.0.0.1:4001

> Optional: change bind host/port
>
> ```bash
> make serve HOST=127.0.0.1 PORT=4001
> ```

---

## Verified status

I already tested this project locally in this repo:

- `make install` completed
- `make build` completed
- local server responds with **HTTP 200** at `http://127.0.0.1:4001`

So you should be able to open that URL and see the site.

---

## Common issues

### `bundle: No such file or directory` (Windows shim issue)
Use `make` targets (they already use `ruby -S bundle` internally):

```bash
make install
make serve
```

### `Permission denied - bind ... 127.0.0.1:4000`
Port `4000` may be blocked on your machine. Use another port (for example `4001`):

```bash
make serve PORT=4001
```

---

## Project structure

```text
k1m0ch1.github.io/
├─ _config.yml              # Jekyll site configuration
├─ Makefile                 # Cross-platform dev commands (Windows/Linux)
├─ Gemfile                  # Ruby gem dependencies
├─ Gemfile.lock             # Locked dependency versions
├─ thinkspace.gemspec       # Theme/spec gem definition used by Gemfile
├─ _layouts/                # Page/post layouts
├─ _includes/               # Reusable template partials
├─ _posts/
│  └─ blogs/                # Blog posts (YYYY-MM-DD-title.md)
├─ assets/
│  └─ scss/                 # Stylesheets
├─ images/                  # Static images
├─ index.html               # Home page
├─ blogs.html               # Blog listing page
├─ about.md                 # About page
└─ _site/                   # Generated output (created by Jekyll)
```

---

## Makefile commands

```bash
make help          # show all available targets
make install       # install gems
make build         # build site into _site/
make serve         # run local server (HOST=127.0.0.1 PORT=4001)
make serve-drafts  # run server including _drafts
make clean         # remove generated files/cache
```

## Content workflow

1. Add a new post under `_posts/blogs/` with filename format:
   `YYYY-MM-DD-title.md`
2. Run build:
   ```bash
   make build
   ```
3. Run local server and preview:
   ```bash
   make serve
   ```
