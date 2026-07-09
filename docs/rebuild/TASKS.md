# TASKS · The Nexus — Portfolio Redesign

Progress tracker for rebuilding **Newton Frank · The Nexus** into a cinematic,
WebGL-forward, editorial developer × designer portfolio. Check items as you go.
Priorities: **P0** critical path · **P1** important · **P2** polish/optional.

> Companion docs: `BUILD_GUIDE.md` (how), `04-ARCHITECTURE.md` (structure/roadmap),
> `03-DESIGN-SYSTEM.md` (tokens), `02-STRATEGY.md` (IA/UX), `01-RESEARCH.md` (why).

---

## 📊 Progress Overview

| Milestone | Status | Target |
|---|---|---|
| M0 · Foundation & deploy skeleton | ⬜ Not started | Week 1 |
| M1 · Design system & primitives | ⬜ Not started | Week 1–2 |
| M2 · Layout shell (nav/menu/cursor/scroll/transitions) | ⬜ Not started | Week 2 |
| M3 · Loader + WebGL hero | ⬜ Not started | Week 3 |
| M4 · Home sections | ⬜ Not started | Week 3–4 |
| M5 · Work index + case studies | ⬜ Not started | Week 4–5 |
| M6 · About | ⬜ Not started | Week 5 |
| M7 · Playground | ⬜ Not started | Week 6 |
| M8 · Motion polish | ⬜ Not started | Week 6 |
| M9 · Perf / SEO / a11y | ⬜ Not started | Week 7 |
| M10 · QA & launch | ⬜ Not started | Week 7 |

**Status key:** ⬜ Not started · 🟡 In progress · ✅ Done · 🔵 Blocked

Overall: `0 / 10 milestones` · `0%`

---

## 🏁 M0 · Foundation & Setup  (P0)

- [x] Audit existing repo; decide **migrate-in-place** vs. fresh Next app
      → Decided: keep the repo, rewrite `src/`. See
      `docs/superpowers/plans/2026-07-09-m0-foundation.md`.
- [x] Inventory & preserve existing copy, projects, and assets
      → Content extracted to typed `src/content/` modules.
- [ ] Init **Next.js 15 (App Router) + TypeScript (strict)**
- [ ] Configure ESLint + Prettier + Husky + lint-staged
- [ ] Set up path aliases (`@/components`, `@/lib`, `@/webgl`, `@/content`, `@/styles`)
- [ ] Install stack: `three @react-three/fiber @react-three/drei @react-three/postprocessing gsap lenis motion zustand`
- [ ] Add GLSL import support (e.g. `vite-plugin-glsl` equivalent / webpack loader)
- [ ] Connect repo to **Vercel**; verify preview + production deploys
- [ ] Commit baseline; protect `main`; set up PR previews

**Exit criteria:** clean typed Next app deployed to a live URL, existing content preserved.

---

## 🎨 M1 · Design System & Primitives  (P0)

**Tokens & foundations**
- [ ] `styles/tokens.css` — color (ink/bone/signal/ember/semantic), spacing, radii, z, shadows
- [ ] `styles/tokens.css` — fluid type scale + line-heights + tracking + breakpoints
- [ ] `styles/reset.css` — modern reset
- [ ] `styles/typography.css` — type role classes (display-xl…mono)
- [ ] Self-host fonts (Clash Display, General Sans, JetBrains Mono) via `next/font/local`, subset weights
- [ ] `lib/motion.ts` — ease / duration / stagger / lerp tokens
- [ ] `lib/breakpoints.ts` — TS mirror of CSS breakpoints
- [ ] `lib/utils.ts` — `cn`, `lerp`, `clamp`, `mapRange`
- [ ] Reduced-motion provider + `useReducedMotion` hook

**UI primitives (`components/ui`)**
- [ ] Button (primary/secondary/ghost/icon · sm/md/lg · all states)
- [ ] Link (inline underline-sweep · nav variant with mono index)
- [ ] Badge / status pill (availability, year)
- [ ] Chip (skills; axis-tinted; interactive)
- [ ] Container / Grid / Divider
- [ ] Field (input/textarea, floating mono label, focus/error/success)
- [ ] Marquee (infinite, GPU, pause-on-hover, reduced-motion aware)

**Motion primitives (`components/motion`)**
- [ ] `Reveal` (masked translate/opacity on scroll, fires once)
- [ ] `SplitText` (line/word/char split; reduced-motion → instant)
- [ ] `MagneticButton` (lerp pull; touch/reduced-motion guards)
- [ ] `ScrollProgress` (bar + section label)
- [ ] `ParallaxLayer` (transform-based, capped, mobile-reduced)

- [ ] (P1) `/styleguide` route rendering every token + component

**Exit criteria:** all primitives themeable, typed, reduced-motion-safe; tokens are the single source of truth.

---

## 🧱 M2 · Layout Shell  (P0/P1)

- [ ] Root `layout.tsx` — providers (Store, Lenis, Cursor), globals, `<head>` defaults
- [ ] **Lenis** smooth scroll + **ScrollTrigger** sync (disabled under reduced-motion)
- [ ] Header + Nav (transparent → `--glass` after hero; wordmark + Menu trigger + availability)
- [ ] **Overlay Menu** — masked reveal, staggered links, magnetic, hover previews, focus trap, ESC, scroll-lock
- [ ] **Custom Cursor** — dot+ring, lerp, hover/media/hold states; hidden on touch + reduced-motion
- [ ] Footer — CTA, nav repeat, socials, colophon, live clock
- [ ] Page-transition template (`AnimatePresence` / GSAP overlay) — no hard reloads
- [ ] Skip-to-content link + landmark structure

**Exit criteria:** navigable multi-route shell with buttery scroll, animated menu, and page transitions.

---

## 🚀 M3 · Loader & WebGL Hero  (P0)

**Loader**
- [ ] Wordmark draw-in
- [ ] Mono counter mapped to **real** asset/font/WebGL-ready progress
- [ ] Ember→Signal progress fill
- [ ] Mask-wipe exit revealing warmed hero
- [ ] Session "seen" flag (skip full loader on subsequent navigations)
- [ ] Reduced-motion → fast fade

**WebGL**
- [ ] R3F `Canvas` shell — `dpr={[1,2]}`, AdaptiveDpr, PerformanceMonitor, Suspense
- [ ] **Nexus hero object** — shader point-cloud, warm↔cool `uMix`, `uPointer`, `uProgress`
- [ ] Device/perf tier → particle-count scaling
- [ ] Hero **poster** still + WebGL-support check + `webglcontextlost` handling
- [ ] Reduced-motion → static frame; save-data/mobile → poster
- [ ] Dispose/teardown on unmount (no leaks)

**Hero DOM**
- [ ] Mono eyebrow (`01 / DESIGN × ENGINEERING`)
- [ ] Display headline with line-reveals
- [ ] CTAs (magnetic) + availability pill
- [ ] Scroll handoff: hero disperses → manifesto

**Exit criteria:** hero communicates "who + both halves" in ~3s, runs at target FPS, and degrades gracefully everywhere.

---

## 📄 M4 · Home Sections  (P0/P1)

- [ ] Manifesto — word-reveal thesis; Craft (Ember) / Build (Signal) split columns
- [ ] Selected Work rows — rollover cursor-follow preview; row lift; underline sweep
- [ ] Work row → animated transition into `/work/[slug]`
- [ ] Playground teaser — live/looping tiles (marquee or grid) → `/playground`
- [ ] About teaser — portrait + short POV bio → `/about`
- [ ] Contact section — display CTA (magnetic), email, availability, channels

**Exit criteria:** the Home page tells the full narrative arc and links into every deep route.

---

## 🗂️ M5 · Work Index & Case Studies  (P0)

- [ ] `content/projects` schema (title, slug, year, discipline, roles, stack, cover, gallery, metrics, live, order)
- [ ] Typed project loader (MDX or TS) + `types/Project`
- [ ] `/work` index grid — staggered scroll reveals, hover scale, optional filters
- [ ] Case-study blocks: FullBleedImage, TwoUp, Detail, PullQuote, StackList, CodeSnippet, MetricRow, VideoBlock
- [ ] `/work/[slug]` template — Problem → **Craft** → **Build** → Outcome, prev/next
- [ ] `generateStaticParams` + per-project metadata + OG image
- [ ] Migrate **project 1** into a full case study
- [ ] Migrate **project 2**
- [ ] Migrate **project 3**
- [ ] (P1) Migrate **project 4**

**Exit criteria:** every shipped case study proves both the design and the engineering half, with real outcomes.

---

## 👤 M6 · About  (P0/P1)

- [ ] `/about` — story + point of view + Craft/Build framing
- [ ] Skills chips grouped by axis (Design / Frontend / WebGL / Tooling)
- [ ] Experience **Timeline** component (animated nodes, drawn rail)
- [ ] Recognition/trust block (awards, features, clients)
- [ ] About CTA → contact

**Exit criteria:** a visitor understands who you are, how you work, and why to trust you.

---

## 🧪 M7 · Playground  (P1)

- [ ] `/playground` grid + fullscreen viewer
- [ ] Demo 1 (shader/generative) — perf-guarded, pauses off-screen
- [ ] Demo 2 (interaction/physics)
- [ ] (P2) Demo 3
- [ ] Teardown/dispose per demo; dpr caps; mobile posters where needed

**Exit criteria:** live, credible proof of technical/creative range.

---

## ✨ M8 · Motion Polish & Micro-interactions  (P1/P2)

- [ ] Global reveal/parallax tuning pass (curves, stagger, pinning)
- [ ] Hover/cursor/magnetic detailing across all components
- [ ] Section "enter-a-space" transitions
- [ ] Consistent easing/duration via `lib/motion.ts` everywhere (no ad-hoc timings)
- [ ] (P2) Optional sound design (muted by default, user toggle)

**Exit criteria:** motion feels weighted, cohesive, and authored — not default.

---

## ♿ Accessibility Checklist  (P0 — M9)

- [ ] Full keyboard operability; logical tab order
- [ ] Visible `:focus-visible` ring on every interactive
- [ ] Focus trap + return-focus in menu/modals; ESC closes overlays
- [ ] Skip-to-content link
- [ ] Semantic landmarks; one `<h1>` per page; correct heading order
- [ ] Color contrast AA (per design system); no color-only state signaling
- [ ] Descriptive `alt` on all meaningful media; empty alt on decorative
- [ ] Custom cursor `aria-hidden`; never replaces focus states
- [ ] `prefers-reduced-motion` fully honored (Lenis off, cursor off, WebGL static, reveals instant)
- [ ] `prefers-reduced-data` / save-data → posters over WebGL
- [ ] Forms: labels, `aria-describedby` errors, `aria-live` status
- [ ] Tested with keyboard-only + VoiceOver/NVDA + axe

---

## ⚡ Performance Checklist  (P0 — M9)

- [ ] Lighthouse mobile: Perf ≥ 90, A11y ≥ 95, BP ≥ 95, SEO 100
- [ ] LCP < 2.5s · INP < 200ms · CLS < 0.05
- [ ] Initial route JS < ~180KB gzip (WebGL chunk dynamically imported, per-page)
- [ ] RSC by default; `dynamic({ssr:false})` for WebGL/cursor
- [ ] Route-level code splitting verified
- [ ] Critical fonts + hero poster preloaded; no FOUT on hero
- [ ] Images: `next/image`, AVIF/WebP, sizes, blur placeholders, lazy below fold
- [ ] Video: poster + `preload=none`, autoplay only in view
- [ ] 3D: Draco glTF + KTX2; dpr cap; particle scaling; PerformanceMonitor drops
- [ ] `content-visibility:auto` on long case studies
- [ ] Only `transform`/`opacity` animated in hot paths
- [ ] Off-screen animations/RAF loops paused or killed

---

## 🔍 SEO Checklist  (P0 — M9)

- [ ] Metadata API per route (title, description, canonical)
- [ ] OG + Twitter tags; dynamic OG images per project + default
- [ ] `sitemap.ts` + `robots.ts`
- [ ] JSON-LD: `Person` (Home/About), `CreativeWork`/`WebSite` (projects)
- [ ] Meaningful link text; descriptive alt; semantic HTML
- [ ] Redirects from old portfolio URLs preserved

---

## 🎯 Feature Completion Checklist

- [ ] Loader
- [ ] WebGL hero (+ fallbacks)
- [ ] Overlay menu with previews
- [ ] Custom cursor
- [ ] Smooth scroll + page transitions
- [ ] Home: hero / manifesto / work / playground teaser / about teaser / contact
- [ ] Work index + filters
- [ ] Case-study template + ≥3 case studies
- [ ] About (story / skills / timeline / recognition)
- [ ] Playground (≥2 demos)
- [ ] Contact form (working + spam-guarded)
- [ ] 404 (on-brand)
- [ ] Footer

---

## 🐛 Bug Checklist  (fill during QA)

- [ ] Safari iOS: WebGL fallback renders correctly
- [ ] No horizontal scroll at 320px
- [ ] No layout shift on font load (hero)
- [ ] Menu scroll-lock releases correctly on close
- [ ] Cursor disabled properly on touch devices
- [ ] Page transitions don't strand focus or scroll position
- [ ] Reduced-motion path verified on every page
- [ ] Forms handle error/empty/success + network failure
- [ ] Back/forward navigation preserves expected state
- [ ] _(add issues as found)_

---

## 💎 Polish Checklist  (P1/P2)

- [ ] Hover states on 100% of interactives
- [ ] Consistent focus styling everywhere
- [ ] Empty/loading/error states designed (not default)
- [ ] Micro-copy tone consistent (confident, specific)
- [ ] Favicons + web manifest + theme-color
- [ ] Custom text selection color (accent)
- [ ] 404 + offline-ish states on-brand
- [ ] Meta/OG preview looks great when shared (test on socials)

---

## 🚢 Deployment Checklist  (P0 — M10)

- [ ] Production env vars set (form provider, analytics)
- [ ] Cross-browser matrix: Chrome, Safari (macOS + iOS), Firefox, Edge
- [ ] Responsive verified at 375 / 768 / 1440 (+320 / 1920 edges)
- [ ] Lighthouse/axe CI gate passing
- [ ] Analytics + Speed Insights live
- [ ] Custom domain + HTTPS + `www`/apex redirect
- [ ] `sitemap.xml` submitted to Search Console
- [ ] 301s from old URLs in place
- [ ] Final content proofread; real metrics in case studies
- [ ] Tag release; announce 🎉

---

_Last updated: <!-- date --> · Maintainer: Newton Frank_
