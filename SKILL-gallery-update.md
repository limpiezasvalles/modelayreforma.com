# SKILL — Gallery Update (modelayreforma.com)

A repeatable process for adding new project photos to the homepage gallery and
running a local-SEO sanity check. Reference this file to repeat the whole flow.

> **Project:** `modela_web/` — static site (HTML/CSS/JS) for *Modela y Reforma*,
> a reform company in the **Sabadell / Vallès Occidental (Barcelona)** area.
> Deployed via GitHub Pages (CNAME → modelayreforma.com).

---

## Prerequisites / environment

- **ImageMagick 7** (`convert` / `magick`) with **WebP** and **HEIC** delegates.
  Verify: `convert -list format | grep -iE 'webp|heic'`.
- No `cwebp`, no Python PIL needed — `convert` does everything.
- Work from the repo root: `/home/hector/webs/modela_web`.

---

## Project map (where things live)

| Thing                | Location |
|----------------------|----------|
| Homepage + gallery   | `index.html` → `<section id="proyectos">` |
| Gallery grid         | `<div class="gallery__grid" id="gallery-grid">` |
| Gallery filters      | `<div class="gallery__filters">` (data-filter buttons) |
| Filter JS            | `js/main.js` (reads `data-category` / `data-filter`) |
| Styles               | `css/styles.css` (`.gallery__*` classes) |
| Images               | `images/` (+ per-project subfolders) |
| Other pages          | `privacidad.html` |
| SEO/meta             | `<head>` of each HTML file; `sitemap.xml`, `robots.txt` |

### Gallery categories (data-filter values)
`all` · `cocinas` · `banos` · `integrales` · `diseno`

### Gallery item HTML structure (copy EXACTLY — match indentation)
```html
<div class="gallery__item" data-category="CATEGORY" data-animate="fade-up" data-animate-delay="100">
  <img src="images/PATH.webp"
       alt="DESCRIPTIVE SPANISH ALT, SEO-FRIENDLY, MENTIONS SERVICE + LOCATION"
       width="600" height="400" loading="lazy">
  <div class="gallery__overlay">
    <span class="gallery__project">Reforma de X</span>
    <span class="gallery__category">X</span>
  </div>
</div>
```
- `data-animate-delay` cycles `""` / `100` / `200` for the stagger effect.
- `data-category` MUST be one of the filter values above, or the item won't show
  under its filter.

---

## The process (phases)

### Phase 1 — This file
Create/refresh `SKILL-gallery-update.md` describing the process.

### Phase 2 — Analyze
1. Read the gallery section of `index.html`.
2. Note the exact item structure, categories, and CSS classes.
3. List `images/` and all subfolders.

### Phase 3 — Detect new images
```bash
# All image paths referenced anywhere in the site:
grep -rhoE 'images/[^"'"'"')]+\.(jpg|jpeg|png|webp|heic)' index.html privacidad.html css js -i | sort -u
# All image files on disk (skip System Volume Information):
find images -type f -not -path '*/System Volume Information/*' \
  \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' -o -iname '*.heic' \) | sort
```
The set difference = candidate new images. Then:
- Drop duplicates (`md5sum` the suspects — folders often duplicate root files).
- Drop the logo and any non-gallery assets.
- For each candidate record: filename, format, dimensions
  (`identify -format '%f %wx%h %[orientation]\n' FILE`), needs-conversion?,
  likely service type (view the image to classify cocina/baño/integral/diseño —
  folder names are street/project names, NOT service types, so visual inspection
  is required for accurate categorization + alt text).

### Phase 4 — Process each new image
WebP, max 1200px wide, quality 85, EXIF orientation baked in, original kept as `.bak`:
```bash
SRC="images/SUBFOLDER/FILE.jpg"
DST="images/project-name-NN.webp"           # follow naming convention below
cp "$SRC" "$SRC.bak"                          # backup original
convert "$SRC" -auto-orient -resize '1200x1200>' -quality 85 "$DST"
identify -format '%f %wx%h\n' "$DST"          # verify
```
- `-auto-orient` is REQUIRED — many phone photos have rotated EXIF orientation.
- `-resize '1200x1200>'` caps the long edge at 1200px, only shrinks (never upscales),
  preserves aspect ratio.
- HEIC inputs work the same way (`convert IMG.HEIC ...`).

#### Naming convention
- New gallery images: **`<project-or-room>-NN.webp`**, kebab-case, no spaces/accents
  (e.g. `copenhaguen-cocina-01.webp`, `nostrallar-salon-02.webp`).
- Avoid spaces and uppercase in NEW filenames (legacy files have them; don't rename
  legacy files — only name new outputs cleanly).

### Phase 5 — Add to gallery
- Insert one `gallery__item` block per new image into `#gallery-grid`, grouped
  under the matching `<!-- CATEGORY -->` comment.
- `src` → the `.webp`; `alt` → descriptive Spanish, SEO-friendly, mentions service
  + (where natural) location; `data-category` → correct filter value.
- Do **not** modify existing items.

### Phase 6 — SEO audit (report only — do NOT auto-apply)
Audit local SEO (Sabadell + nearby), technical SEO, content gaps. Produce a
numbered top-10 priority fix list with exact code. Owner decides what to apply.

### Phase 7 — Report
Summary of: images processed, exact HTML blocks added, SEO findings + priority
list. Remind to `git add` / `commit` / `push`.

---

## Conventions & guardrails
- **Never** touch existing gallery items or legacy filenames.
- Keep originals as `.bak` (and consider `.gitignore` for `*.bak` if not wanted in repo).
- WebP browser support is universal — plain `<img src="*.webp">` is fine, no
  `<picture>` fallback needed. (Note: existing gallery still uses raw JPG; migrating
  those to WebP is an optional separate optimization task.)
- Classify by **looking at the image**, not the folder name.
- SEO fixes are reported, never applied automatically.
