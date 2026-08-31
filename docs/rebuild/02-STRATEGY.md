# 02 · Redesign Strategy, Site Architecture & UX Flow

---

## Part A — Redesign Strategy

### A.1 The core idea: *The Nexus is the meeting point*

Your differentiator is not "dark" or "3D" or "minimal." It's the **intersection of
design and engineering**, made literal. Every strategic decision below serves one
sentence:

> **"The Nexus is where craft and code converge — and this site is proof of both."**

We keep the name (it's ownable) but upgrade it from a *space theme* to a *conceptual
system*: a **nexus** is a point where lines meet. We encode that everywhere — a
warm/cool dual-accent system (design vs. code), a hero object that visibly resolves
two states into one, section numbering in monospace (the "engineer's hand") beside
expressive display type (the "designer's hand"), and case studies that always show
*both* the crafted surface and the built system underneath.

### A.2 Design philosophy (five principles)

1. **Prove, don't claim.** Never write "I know WebGL / I design well." *Show* the
   WebGL running, *show* the design decisions. The site itself is the portfolio
   piece.
2. **Weight = quality.** Motion is slow, eased, and physical (expo/quart curves,
   600–1200ms for reveals). Nothing snaps. This is the single biggest lever moving
   you from "template" to "senior."
3. **Compose every screen.** Borrow Anderson's cinematic framing: few elements,
   large type, load-bearing negative space, deliberate focal points.
4. **Restraint with one warm note.** Borrow Dennis's discipline: near-monochrome
   depth, huge type, then a single warm accent used sparingly for energy and CTAs.
5. **Fast and accessible on purpose.** Ambition is budgeted. WebGL is one scene,
   lazy-loaded, with a static fallback and a `prefers-reduced-motion` path. Craft
   includes performance and accessibility.

### A.3 Visual identity direction

- **Mood:** cinematic, precise, premium, quietly futuristic. Think "design studio
  meets engineering lab," not "gamer dark theme."
- **Duality as a system:** cool accent (**Signal**, electric blue) = the *code/
  build* axis; warm accent (**Ember**, coral) = the *craft/design* axis. They meet
  at the nexus. This gives every color choice a *reason*.
- **Texture of the engineer:** monospace metadata — section indices (`01 / 05`),
  coordinates, timestamps, tech tags — sits beside expressive display type. The two
  typographic voices *are* the duality.
- **Depth via surface layering:** not one flat black plane but ink → elevated →
  raised surfaces with hairline borders, so sections feel like distinct spaces.

*(Exact tokens — colors, type, spacing, motion curves — are specified in
`03-DESIGN-SYSTEM.md`.)*

### A.4 UX improvements (mapped to audit findings)

| Audit problem | Strategic fix |
|---|---|
| Undifferentiated dark plane | Surface layering + per-section transitions so each section feels like *entering a space*. |
| Single typographic voice | Display + mono duality; hierarchy by weight/color/texture, not size alone. |
| Generic motion | Centrally tokenized easing/duration; one signature scroll-driven hero moment; authored reveals. |
| Low moment-density | Deliberately place 4–5 "peaks": loader reveal, hero resolve, work-hover, a case-study scroll moment, contact CTA. |
| Dual identity unexpressed | Warm/cool system, "Build/Craft" framing in About & case studies, a Playground that proves the dev half. |
| No case depth | Full case-study template with problem → craft → build → outcome. |
| No spatial model | Overlay menu that shows the whole site map with live previews; persistent progress indicator. |

### A.5 Personal branding & storytelling strategy

- **A point of view, stated once, boldly.** The hero and About should contain a
  real thesis about how you work (e.g., "design and engineering shouldn't be
  handed off between people"). Opinions make you legible and memorable.
- **A narrative arc across the page**, not a list of sections:
  1. *Hook* (hero): who + the thesis, with the signature object.
  2. *Credibility* (intro/manifesto): the one-paragraph argument for the nexus.
  3. *Proof* (selected work): the strongest 3–4 projects, each provable.
  4. *Range* (playground): experiments proving technical depth and play.
  5. *Person* (about): story, process, both-halves framing, trust signals.
  6. *Invitation* (contact): a warm, confident close.
- **Show the seams as a feature.** For a design×code person, revealing *how* things
  are made (a shader tweak, a grid decision, a performance win) is credibility.
  Case studies and Playground should expose process.

---

## Part B — Complete Site Architecture

**Model:** a hybrid. A **narrative single-page Home** that tells the arc, plus
**dedicated routes** for depth (`/work`, `/work/[slug]`, `/about`, `/playground`,
`/contact`). This gives Dennis-style multi-page depth without losing the
single-scroll story on the landing page. Routes use animated page transitions so
the site still feels like one continuous surface.

```
/                     Home (narrative single page)
├─ #hero
├─ #manifesto         (intro / thesis)
├─ #work              (selected work — links into /work/[slug])
├─ #playground        (teaser — links into /playground)
├─ #about             (teaser — links into /about)
└─ #contact
/work                 All projects (index/grid)
/work/[slug]          Case study template
/about                Full about (story, process, skills, experience, timeline)
/playground           Experiments / WebGL demos / code toys
/contact              Full contact page (form + channels)
404                   On-brand lost-in-the-nexus page
```

**Optional / later:** `/services` (if freelancing), `/blog` or `/notes`
(if you'll write), `/uses` (tools). Scaffolded but not required for v1.

### Global chrome (persistent across all routes)
- **Header:** wordmark (`NEXUS ◆`) left; **Menu** trigger right; availability pill
  (`◦ Available for work`) optional.
- **Overlay menu:** full-screen; large animated link list (Work / Playground /
  About / Contact) with hover image/scene previews; socials; email; a small live
  clock/locale line (engineer texture).
- **Custom cursor:** dot + ring, lerp-follow, grows/labels on interactives,
  magnetic on buttons. Hidden from assistive tech; disabled for touch + reduced
  motion.
- **Smooth scroll:** Lenis, site-wide, synced to GSAP ScrollTrigger.
- **Scroll progress:** thin indicator + current-section label (mono).
- **Footer:** big "let's build" CTA, nav repeat, socials, colophon (built with…),
  © + year + locale.

---

## Part C — Text Wireframes (section by section)

> Notation: `[ ]` = element/box, `▮▮▮` = display type, `···` = mono/meta text,
> `◆` = accent mark, `>>` = magnetic button, `⬚` = image/media, `◉` = WebGL canvas.
> Layouts described desktop-first; responsive collapse noted per section.

### C.1 Loader (first paint only)
```
┌──────────────────────────────────────────────┐
│                                              │
│                                              │
│                 ▮ N E X U S ▮                │  ← wordmark draws in
│                                              │
│                 ··· 0 → 100 ···              │  ← mono counter, real asset progress
│                                              │
│         ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ (progress)     │  ← Ember→Signal gradient fill
│                                              │
└──────────────────────────────────────────────┘
        ↓ on complete: mask wipe reveals Hero (the object is already "warming up")
```
- Counter is tied to *real* asset/font/WebGL-ready progress, not a fake timer.
- Exit = clip-path/mask wipe (Ember → Signal sweep) revealing the hero beneath.
- Reduced-motion: instant fade, no counter animation.

### C.2 Hero
```
┌──────────────────────────────────────────────┐
│ NEXUS ◆                         [ Menu ]     │
│                                              │
│ ··· 01 / DESIGN × ENGINEERING ···            │  ← mono eyebrow (the duality, stated)
│                                              │
│  ▮▮▮ NEWTON FRANK ▮▮▮                        │  ← display XL, split-line reveal
│  ▮▮ I design and build the web ▮▮            │
│                                     ◉◉◉◉     │  ← WebGL "nexus object" (pointer-reactive)
│  ··· Creative Developer · Designer ···       │      resolves warm↔cool into one form
│  [ ◦ Available ]         [ >> See work ↓ ]   │
└──────────────────────────────────────────────┘
```
- **Signature moment:** the WebGL object visibly holds two states (a warm cloud and
  a cool lattice) that converge into one form — literal "nexus." Reacts to pointer;
  on scroll it settles/disperses to hand off to the manifesto.
- Type reveals line-by-line (clip mask + translate, staggered).
- **Mobile:** object moves behind/above the type at reduced particle count (or
  static poster); type stacks; CTA full-width.

### C.3 Manifesto / Intro (the thesis)
```
┌──────────────────────────────────────────────┐
│ ··· 02 / APPROACH ···                        │
│                                              │
│  ▮ Design and engineering shouldn't be       │  ← large statement, word-by-word
│    handed off between people. I do both,     │     reveal on scroll
│    so the idea and the build never drift. ▮  │
│                                              │
│   [Craft ◆warm]        [Build ◆cool]          │  ← two columns encode the duality
│   ··· visual · motion   ··· systems · perf    │
│   · interaction ···     · WebGL · a11y ···    │
└──────────────────────────────────────────────┘
```
- The two columns literally split into the warm (design) and cool (code) axes.
- **Mobile:** columns stack; statement stays large.

### C.4 Selected Work (on Home)
```
┌──────────────────────────────────────────────┐
│ ··· 03 / SELECTED WORK ···      [ All work → ]│
│                                              │
│  ──────────────────────────────────────────  │
│  01  ▮ FABRIC — VC PLATFORM ▮        ⬚ hover │  ← row list; hover reveals preview
│      ··· Design & Development · 2025 ···  →  │     image/scene that follows cursor
│  ──────────────────────────────────────────  │
│  02  ▮ AANSTEKELIJK — BRAND SITE ▮   ⬚ hover │
│      ··· Design & Development · 2024 ···  →  │
│  ──────────────────────────────────────────  │
│  03  ▮ PROJECT PARALLAX ▮            ⬚ hover │
│      ··· Interaction & Dev · 2024 ···     →  │
│  ──────────────────────────────────────────  │
└──────────────────────────────────────────────┘
```
- **Dennis-style rollover:** hovering a row summons a floating preview
  (image/short video/live scene) that tracks the cursor; row text shifts + accent
  underline sweeps. Click → animated transition into `/work/[slug]`.
- **Mobile:** rows become cards with a static thumbnail (no cursor-follow); tap →
  case study.

### C.5 Playground teaser (on Home)
```
┌──────────────────────────────────────────────┐
│ ··· 04 / PLAYGROUND ···        [ Enter → ]    │
│  ▮ Experiments, shaders, and things I build   │
│    to learn. ▮                                │
│  [◉ demo]  [◉ demo]  [◉ demo]  (marquee/grid) │  ← autoplaying WebGL/CSS toys
└──────────────────────────────────────────────┘
```
- Proves the "developer" half with live technical play. Marquee of live tiles
  (throttled) or a grid of looping captures that link to interactive versions.

### C.6 About teaser (on Home)
```
┌──────────────────────────────────────────────┐
│ ··· 05 / ABOUT ···             [ More → ]     │
│  ⬚ portrait / abstract    ▮ Short bio with a  │
│                             point of view. ▮  │
│                             ··· Based in … ···│
│                             ··· Awards / trust│
└──────────────────────────────────────────────┘
```

### C.7 Contact (on Home + full page)
```
┌──────────────────────────────────────────────┐
│ ··· 06 / CONTACT ···                          │
│                                              │
│      ▮▮ LET'S BUILD SOMETHING ▮▮             │  ← display XL, magnetic
│      [ >> hello@…  ]   [ ◦ Available ]       │
│                                              │
│  ··· Twitter · GitHub · LinkedIn · Read ···  │
│  ─────────────────────────────────────────── │
│  NEXUS ◆   © 2025 · Bengaluru · Built with…  │  ← footer colophon (engineer texture)
└──────────────────────────────────────────────┘
```

### C.8 Overlay Menu (global)
```
┌──────────────────────────────────────────────┐
│ NEXUS ◆                          [ Close ✕ ] │
│                                              │
│   ▮ Work ▮ ─────────────────  ⬚ preview      │  ← each link reveals a preview panel
│   ▮ Playground ▮ ───────────  ⬚ preview      │
│   ▮ About ▮ ────────────────  ⬚ preview      │
│   ▮ Contact ▮ ──────────────  ⬚ preview      │
│                                              │
│  ··· hello@…    ··· 12:04 IST    Socials →   │
└──────────────────────────────────────────────┘
```
- Opens with a masked panel reveal + staggered link entrance. Links are magnetic;
  hovering shows the destination preview. Closes in reverse. Locks scroll; traps
  focus; ESC closes.

### C.9 Work Index (`/work`)
```
┌──────────────────────────────────────────────┐
│ ··· WORK / 12 PROJECTS ···   [filter: all ▾] │
│                                              │
│  ⬚ FABRIC          ⬚ AANSTEKELIJK            │  ← 2-col staggered/asymmetric grid
│  ··· 2025 · D&D      ··· 2024 · D&D           │     images scale-in on scroll
│  ⬚ PARALLAX        ⬚ ALFRED                  │
│  ··· 2024 · Interaction  ··· 2023 · D&D       │
│  …                                            │
└──────────────────────────────────────────────┘
```
- Optional filters (Design & Development / Interaction / Playground). Hover =
  image scale + title shift. **Mobile:** single column.

### C.10 Case Study (`/work/[slug]`)
```
┌──────────────────────────────────────────────┐
│ ▮ FABRIC ▮                                    │  ← hero title + big cover ⬚ (scale-in)
│ ··· Role · Year · Stack · Live ↗ ···          │
│ ──────────────────────────────────────────── │
│ ▮ The problem ▮   (large, spacious)           │
│ ··· 1–2 paragraphs, your own words ···        │
│ ──────────────────────────────────────────── │
│ [Craft ◆warm]                                 │  ← DESIGN half: UI, type, motion
│  ⬚ full-bleed shots · ⬚ detail · pull-quote   │
│ ──────────────────────────────────────────── │
│ [Build ◆cool]                                 │  ← CODE half: architecture, perf, WebGL
│  ··· stack · challenges · a snippet/diagram ···│
│ ──────────────────────────────────────────── │
│ ▮ Outcome ▮  ··· metrics / result ···         │
│ [ ← Prev project ]            [ Next → ]      │  ← animated inter-project transition
└──────────────────────────────────────────────┘
```
- Every case study proves **both halves** — this is the brand made concrete.
- Reusable content blocks (see design system): FullBleedImage, TwoUp, Detail,
  PullQuote, StackList, CodeSnippet, MetricRow, VideoBlock.

### C.11 About (`/about`)
```
┌──────────────────────────────────────────────┐
│ ▮ I'm Newton — I design and build … ▮         │  ← manifesto restated, fuller
│  ⬚ portrait                                   │
│ ── Story ── ··· narrative, POV, why the nexus │
│ ── How I work ── [Craft ◆] [Build ◆]          │
│ ── Skills ── (grouped chips: Design / Front-  │
│    end / WebGL / Tooling)                      │
│ ── Experience ── (timeline: role · org · yrs) │
│ ── Recognition ── (awards / features / trust) │
│ ── CTA ── [ >> Let's talk ]                   │
└──────────────────────────────────────────────┘
```

### C.12 Playground (`/playground`)
```
┌──────────────────────────────────────────────┐
│ ▮ PLAYGROUND ▮  ··· experiments & shaders ··· │
│  ◉ live demo ─ title ─ ··· tech · date ···    │  ← grid of interactive/looping tiles
│  ◉ live demo ─ …                              │     click → fullscreen interactive
│  (perf-guarded: pause offscreen, cap dpr)     │
└──────────────────────────────────────────────┘
```

### C.13 404
```
┌──────────────────────────────────────────────┐
│  ··· 404 / OFF THE GRID ···                   │
│  ▮ This node doesn't exist. ▮   ◉ drifting object
│  [ >> Back to the Nexus → ]                   │
└──────────────────────────────────────────────┘
```

---

## Part D — UX Flow

### D.1 Primary journeys

**J1 — Recruiter / hiring manager (skim, 60–90s):**
Loader → Hero (gets "who + both halves" in 3s) → scans Selected Work rows → hovers
one, clicks → Case Study (reads Problem + Outcome, skims Craft/Build) → Contact.
*Design requirement:* the top of every page must answer "who is this / is he good"
within one viewport, no scrolling required.

**J2 — Peer / creative dev (explore, 3–5min):**
Hero (notices the WebGL object, inspects it) → Manifesto → Playground (the hook for
this persona) → a technical case study's **Build** half → About (process) → Contact.
*Design requirement:* Playground and the Build halves must have real technical
substance (snippets, stack, perf notes), not marketing gloss.

**J3 — Prospective client (evaluate trust, 2–4min):**
Hero → Selected Work (quality signal) → a polished case study (Craft half + Outcome
metrics) → About (Recognition / trust) → Contact form.
*Design requirement:* outcomes/metrics and trust signals must be visible and
credible.

**J4 — Mobile visitor (majority of traffic):**
Every above journey must work with: static/low-cost hero visual, tap targets ≥44px,
no cursor-dependent interactions, and no jank. Mobile is a first-class design pass,
not a shrink of desktop.

### D.2 Flow diagram (states)

```
        ┌─────────┐   assets+fonts ready    ┌──────────┐
        │ LOADER  │ ──────────────────────▶ │  HOME    │
        └─────────┘   (mask wipe reveal)     │ (scroll) │
                                             └────┬─────┘
             menu (any page) ◀────────────────────┤
                   │                               │ scroll cues
          ┌────────▼────────┐              ┌───────▼────────────────────┐
          │  OVERLAY MENU   │              │ hero→manifesto→work→        │
          │ (map+previews)  │              │ playground→about→contact    │
          └────────┬────────┘              └───────┬────────────────────┘
                   │ pick                          │ click work row / teaser
     ┌─────────────┼───────────────┬───────────────┼──────────────┐
     ▼             ▼               ▼               ▼              ▼
 /work        /playground       /about         /work/[slug]    /contact
  (grid)      (live tiles)     (story…)        (case study)     (form)
     │             │               │               │              │
     └──── animated page transitions (no hard reload) between all routes ────┘
```

### D.3 Interaction principles (apply everywhere)
- **Feedback within 100ms** on every interactive (cursor grows, color shifts,
  magnetic pull) so the site always feels alive.
- **Reveal, don't pop:** content enters via masked translate/opacity on scroll,
  never appears instantly (except under reduced-motion).
- **One peak per screen:** each viewport should have a single clear focal moment,
  not competing animations.
- **Escape hatches:** ESC closes menu/overlays; skip-to-content link; visible focus
  states; back/prev-next on case studies.
- **Graceful degradation:** touch, reduced-motion, and low-perf devices each get a
  first-class (not broken) version — defined in `03-DESIGN-SYSTEM.md`.

---

*Next: `03-DESIGN-SYSTEM.md` — full visual system (color, type, spacing, grid,
components) and the complete motion system (curves, durations, patterns, WebGL).*
