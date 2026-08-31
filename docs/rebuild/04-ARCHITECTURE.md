# 04 · Technical Architecture, Folder Structure & Roadmap

> Assumption: the redesign lands in your **existing repository** as a modern React
> stack. I recommend **Next.js (App Router) + TypeScript** because it gives you
> RSC/SSR for SEO and speed, first-class image/font optimization, and clean routing
> for `/work/[slug]`, while still hosting React Three Fiber for WebGL. If your repo
> is currently Vite/CRA/plain-React, the component/design/motion systems below port
> 1:1; only the routing/data layer changes. **Share the repo and I'll tailor the
> migration precisely.**

---

## Part A — Recommended Stack

| Concern | Choice | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router, RSC) + TypeScript | SEO/SSR, routing, image/font optimization, Vercel-native. |
| **Styling** | CSS custom properties (tokens) as source of truth + **Tailwind v4** mapped to them via `@theme`, *or* CSS Modules | Token-first keeps design consistent; Tailwind gives velocity. Pick one and be consistent (see A.1). |
| **3D / WebGL** | React Three Fiber + `@react-three/drei` (+ `@react-three/postprocessing` sparingly) | Declarative Three.js in React; drei gives perf helpers (AdaptiveDpr, PerformanceMonitor). |
| **Scroll-linked / timeline motion** | **GSAP** + ScrollTrigger | Best-in-class scroll animation, scrubbing, pinning, SplitText. |
| **Smooth scroll** | **Lenis** | The "buttery" feel; syncs cleanly with ScrollTrigger. |
| **Component/state motion** | **Framer Motion** (`motion`) | Ergonomic enter/exit, `AnimatePresence` for page/menu transitions. |
| **State** | **Zustand** (small, transient) | Menu open, cursor state, loader/scroll progress, theme — no boilerplate. |
| **Content** | Local typed content (**MDX** or `content/*.ts`), option to graduate to **Sanity** later | Fastest for a personal site; typed and version-controlled; CMS only if you'll edit often. |
| **Forms** | Server action / API route + a provider (Resend / Formspree) | Progressive-enhanced, spam-guarded contact. |
| **Analytics** | Vercel Analytics + Speed Insights (privacy-friendly) | Real-user perf + traffic without cookies. |
| **Hosting** | **Vercel** | Next-native, preview deploys, edge, OG image gen. |
| **Quality** | ESLint + Prettier + TypeScript strict + Husky + lint-staged | Guardrails; enforce conventions on commit. |

### A.1 Styling decision (pick one, don't mix paradigms)
- **Option A — Tailwind v4 + tokens (recommended for velocity):** define brand
  tokens once in CSS `@theme`, use utilities for layout, escape to component CSS for
  bespoke/animated pieces. Fast, but watch class noise on complex components.
- **Option B — CSS Modules + tokens (recommended for a bespoke, hand-crafted feel):**
  every component gets a `.module.css`, tokens via CSS vars. More files, cleaner
  markup, closer to a design-studio codebase.
- Either way: **CSS custom properties are the single source of truth for
  color/space/type** so the design system holds.

### A.2 Rendering strategy
- Static-first: Home, About, Work index, and case studies are **statically
  generated** (fast, SEO-friendly). WebGL, cursor, menu, and scroll logic are
  **client components** loaded via `dynamic(() => …, { ssr: false })`.
- Keep the client bundle lean: the heavy trio (R3F/GSAP/Lenis) loads only where used;
  case-study prose is server-rendered.

---

## Part B — Component Architecture

Principle: **primitives → patterns → sections → pages.** Small, typed, single-
responsibility components compose upward. Fixes the audit's "no reusable system."

- **Primitives (`components/ui`)**: Button, Link, Badge, Chip, Marquee, Container,
  Grid, Divider, Field. No business logic; pure, prop-driven, themeable.
- **Motion primitives (`components/motion`)**: `Reveal`, `SplitText`, `MagneticButton`,
  `ScrollProgress`, `ParallaxLayer`. Wrap children; own their GSAP/Framer logic;
  respect reduced-motion internally so consumers don't have to.
- **Patterns (`components/project`, `components/layout`)**: ProjectCard, ProjectRow,
  case-study blocks; Header, Nav, Menu, Footer.
- **Sections (`components/sections`)**: Hero, Manifesto, WorkList, PlaygroundTeaser,
  AboutTeaser, Contact — composed from primitives + patterns; receive typed content.
- **WebGL (`webgl/`)**: isolated from DOM components; one shared Canvas; scenes and
  materials/shaders live here so 3D never leaks into layout code.
- **Pages (`app/`)**: thin; assemble sections + set metadata. No layout logic.

### B.1 Animation architecture
- **Tokens in `lib/motion.ts`** (curves/durations/stagger/lerp) — imported by every
  animated component (single source of truth for timing).
- **GSAP context per component** (`gsap.context()` + cleanup in `useGSAP`/effect) so
  animations are scoped and torn down on unmount — no leaks, no double-binding.
- **Lenis provider** (`lib/lenis.tsx`) at the root; exposes scroll to ScrollTrigger
  and to a Zustand `scrollProgress`.
- **Reduced-motion** read once in a provider and distributed via context/store; every
  motion primitive checks it.

### B.2 State (Zustand slices)
`ui` (menuOpen, theme) · `cursor` (variant, label) · `scroll` (progress, direction,
section) · `webgl` (ready, quality tier) · `loader` (progress, done, seenThisSession).
Keep it tiny; most state stays local.

---

## Part C — Folder Structure

```
portfolio/
├─ app/
│  ├─ layout.tsx                # root: fonts, providers (Lenis, Cursor, Store), <head> defaults
│  ├─ template.tsx              # page-transition wrapper (AnimatePresence)
│  ├─ page.tsx                  # HOME (assembles sections)
│  ├─ globals.css               # imports tokens/reset/typography
│  ├─ work/
│  │  ├─ page.tsx               # work index (grid)
│  │  └─ [slug]/page.tsx        # case study (generateStaticParams + metadata)
│  ├─ about/page.tsx
│  ├─ playground/page.tsx
│  ├─ contact/page.tsx
│  ├─ not-found.tsx             # on-brand 404
│  ├─ sitemap.ts
│  ├─ robots.ts
│  └─ api/
│     ├─ contact/route.ts       # form handler (Resend/Formspree)
│     └─ og/route.tsx           # dynamic Open Graph images
│
├─ components/
│  ├─ ui/                       # Button, Link, Badge, Chip, Marquee, Container, Grid, Field, Divider
│  ├─ layout/                   # Header, Nav, MenuOverlay, Footer
│  ├─ motion/                   # Reveal, SplitText, MagneticButton, ScrollProgress, ParallaxLayer
│  ├─ cursor/                   # CustomCursor
│  ├─ sections/                 # Hero, Manifesto, WorkList, PlaygroundTeaser, AboutTeaser, Contact
│  └─ project/                  # ProjectCard, ProjectRow, blocks/ (FullBleedImage, TwoUp, Detail,
│                               #   PullQuote, StackList, CodeSnippet, MetricRow, VideoBlock)
│
├─ webgl/
│  ├─ Canvas.tsx                # shared R3F canvas + AdaptiveDpr + PerformanceMonitor + Suspense
│  ├─ scenes/
│  │  ├─ NexusHero/             # index.tsx, geometry.ts, useNexusMix.ts, poster.jpg
│  │  └─ playground/            # one folder per demo
│  ├─ materials/                # material components wrapping shaders
│  ├─ shaders/                  # *.vert / *.frag / *.glsl (via vite-plugin-glsl or raw-loader)
│  └─ hooks/                    # usePointer, useScrollUniform, usePerfTier
│
├─ lib/
│  ├─ gsap.ts                   # register GSAP plugins (ScrollTrigger, etc.)
│  ├─ lenis.tsx                 # Lenis provider + ScrollTrigger sync
│  ├─ motion.ts                 # ease / duration / stagger / lerp tokens (TS)
│  ├─ store.ts                  # Zustand slices
│  ├─ seo.ts                    # metadata + JSON-LD helpers
│  ├─ breakpoints.ts            # TS mirror of CSS breakpoints
│  └─ utils.ts                  # cn(), lerp(), clamp(), mapRange()
│
├─ content/
│  ├─ site.ts                   # nav, socials, availability, meta defaults
│  ├─ about.ts                  # bio, skills, experience, recognition
│  └─ projects/                 # per-project MDX or TS (frontmatter: title, slug, year,
│                               #   discipline, roles, stack, cover, gallery, metrics, live)
│
├─ styles/
│  ├─ tokens.css                # ← source of truth: color/space/type/breakpoints
│  ├─ typography.css            # type role classes
│  └─ reset.css                 # modern reset
│
├─ hooks/                       # useMediaQuery, useReducedMotion, useMousePosition, useInView, useDimensions
├─ types/                       # Project, SiteConfig, etc.
├─ public/
│  ├─ fonts/                    # self-hosted (Clash Display, General Sans, JetBrains Mono)
│  ├─ images/                   # optimized raster; project media
│  ├─ models/                   # draco-compressed glTF
│  ├─ og/                       # static OG fallbacks
│  └─ favicons/
│
├─ next.config.ts               # images, glsl loader, headers (caching/security)
├─ tsconfig.json                # strict; path aliases (@/components, @/lib, @/webgl…)
├─ .eslintrc / .prettierrc
├─ package.json
├─ README.md
├─ TASKS.md                     # ← progress tracker (see file 05)
└─ BUILD_GUIDE.md               # ← engineering handbook (see file 06)
```

### C.1 Asset management
- **Fonts:** self-host via `next/font/local`, subset weights, `display: swap` off in
  favor of preloading critical faces (avoid FOUT on the hero).
- **Images:** `next/image` everywhere; AVIF/WebP; explicit sizes; blur placeholders;
  lazy below the fold. Case-study media pre-sized and compressed.
- **Video:** poster + `preload="none"`, autoplay-muted-loop only when in view.
- **3D:** Draco glTF + KTX2 textures; preload only hero assets; lazy playground.
- **Icons:** inline SVG components (tree-shakeable), no icon-font.

---

## Part D — Performance, SEO & Accessibility Architecture

### D.1 Performance targets (budgets)
- **Lighthouse (mobile):** Performance ≥ 90, Best Practices ≥ 95, SEO 100,
  Accessibility ≥ 95.
- **Core Web Vitals:** LCP < 2.5s, INP < 200ms, CLS < 0.05.
- **JS budget:** initial route JS < ~180KB gzip *excluding* the WebGL chunk, which
  is dynamically imported and only on pages that use it.
- **Techniques:** RSC by default; `dynamic({ ssr:false })` for WebGL/cursor;
  route-level code splitting; preload critical fonts + hero poster; defer non-critical
  JS; `content-visibility: auto` for long case studies; cap `dpr` and particle count.

### D.2 SEO
- Next **Metadata API** per route (title, description, canonical, OG/Twitter).
- **Dynamic OG images** via `app/api/og` (per project + default).
- `sitemap.ts` + `robots.ts`; semantic HTML landmarks (`header/nav/main/section/
  article/footer`), one `<h1>` per page.
- **JSON-LD**: `Person` (you) on Home/About; `CreativeWork`/`WebSite` for projects.
- Real, descriptive alt text on all media; meaningful link text (no "click here").

### D.3 Accessibility (WCAG 2.2 AA)
- Full keyboard operability; **visible focus** (`:focus-visible` ring) on every
  interactive; logical tab order; focus trapping + return in menu/modals.
- **Skip-to-content** link; ESC closes overlays.
- Color contrast per `03-DESIGN-SYSTEM.md` (AA); never signal state by color alone.
- **Custom cursor is `aria-hidden`** and never replaces real focus states.
- `prefers-reduced-motion` fully honored (Lenis off, cursor off, WebGL static,
  reveals instant).
- Respect `prefers-reduced-data`/save-data → posters over WebGL.
- Test with keyboard-only, VoiceOver/NVDA, and axe/Lighthouse.

---

## Part E — Development Roadmap

Phased so the site is **shippable at the end of each phase** (deploy early, iterate
in public). Each task lists **Priority** (P0 critical → P2 polish), **Complexity**
(S/M/L), **Dependencies**, and **Outcome**.

### Phase 0 — Foundation & Setup
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| Audit existing repo; decide migrate-in-place vs. fresh Next app | P0 | M | — | Clear migration path; content inventory preserved |
| Init Next 15 + TS strict, ESLint/Prettier, Husky, path aliases | P0 | S | above | Clean, guard-railed baseline |
| Install stack (R3F, drei, GSAP, Lenis, Framer, Zustand) | P0 | S | init | Dependencies ready |
| Deploy skeleton to Vercel (preview + prod) | P0 | S | init | Live URL from day one |
| Port/organize existing copy & assets into `content/` | P0 | M | init | Existing content preserved & structured |

### Phase 1 — Design System & Primitives
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| `styles/tokens.css` (color/space/type/breakpoints) | P0 | S | Ph0 | Single source of truth live |
| `typography.css` + self-hosted fonts via `next/font/local` | P0 | M | tokens | Type system, no layout shift |
| `lib/motion.ts` (curves/durations/stagger/lerp) | P0 | S | Ph0 | Motion tokens ready |
| Reduced-motion provider + `useReducedMotion` | P0 | S | motion | A11y contract wired in from the start |
| UI primitives: Button, Link, Badge, Chip, Container, Grid, Field | P0 | M | tokens | Reusable component base |
| Motion primitives: `Reveal`, `SplitText`, `MagneticButton` | P0 | M | motion | Authored reveals available everywhere |
| (Optional) a `/styleguide` route rendering all tokens/components | P1 | M | above | Visual QA + living documentation |

### Phase 2 — Layout Shell
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| Root layout: providers (Store, Lenis, Cursor), globals | P0 | M | Ph1 | App shell |
| Lenis smooth scroll + ScrollTrigger sync | P0 | M | motion | Buttery scroll site-wide |
| Header + Nav (transparent→glass on scroll) | P0 | M | primitives | Persistent chrome |
| Overlay Menu (mask reveal, stagger, focus trap, ESC, previews) | P0 | L | Header | Signature nav moment; site map |
| Custom Cursor (states, magnetic, touch/reduced-motion guards) | P1 | M | Store | Craft signal; degrades gracefully |
| Footer (CTA, nav, socials, colophon, clock) | P1 | S | primitives | Consistent close on every page |
| Page-transition template (AnimatePresence / GSAP overlay) | P1 | L | layout | "One continuous surface" routing |

### Phase 3 — Loader & Hero (the first impression)
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| Loader (asset-tracked counter, gradient fill, mask-wipe exit) | P0 | M | Ph2 | Authored first beat; session "seen" flag |
| R3F Canvas shell (AdaptiveDpr, PerformanceMonitor, Suspense) | P0 | M | Ph2 | Safe WebGL foundation |
| **Nexus hero object** (shader point-cloud, warm↔cool `uMix`, pointer) | P0 | L | Canvas | Signature WebGL identity |
| Hero poster + no-WebGL/reduced-motion/mobile fallbacks | P0 | M | Nexus | Fast + accessible + resilient |
| Hero DOM (eyebrow, display line-reveals, CTAs, availability) | P0 | M | motion prims | Hero answers "who + both halves" in 3s |
| Scroll handoff (hero disperses → manifesto) | P1 | M | Hero+Lenis | Cohesive scene transition |

### Phase 4 — Home Sections
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| Manifesto (word-reveal statement, Craft/Build split) | P0 | M | Ph3 | The thesis; duality staged |
| WorkList rows (rollover cursor-follow preview, transition to slug) | P0 | L | primitives | Dennis-style work moment |
| Playground teaser (live/looping tiles, marquee/grid) | P1 | M | primitives | Proves the developer half |
| About teaser | P1 | S | primitives | Bridge to /about |
| Contact section (magnetic CTA, channels) | P0 | M | primitives | Clear, warm close |

### Phase 5 — Work Index & Case Studies
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| `content/projects` schema + typed loader (MDX/TS) | P0 | M | Ph1 | Structured, authorable projects |
| `/work` index grid (staggered reveals, optional filters) | P0 | M | schema | Browsable full portfolio |
| Case-study blocks (FullBleed, TwoUp, Detail, PullQuote, Stack, Code, Metric, Video) | P0 | L | schema | Reusable storytelling kit |
| `/work/[slug]` template (Problem→Craft→Build→Outcome, prev/next) | P0 | L | blocks | Both-halves proof per project |
| Migrate 3–4 strongest projects into case studies | P0 | L | template | Real proof shipped |

### Phase 6 — About
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| `/about` (story, POV, Craft/Build, skills chips) | P0 | M | Ph1 | Person made legible |
| Experience Timeline component | P1 | M | primitives | Credibility, animated |
| Recognition/trust block (awards, features, clients) | P1 | S | primitives | Client-trust signal |

### Phase 7 — Playground
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| `/playground` grid + fullscreen viewer | P1 | M | Ph3 | Range + technical depth |
| 2–3 real demos (shader/generative/physics), perf-guarded | P1 | L | Canvas | Live proof of WebGL skill |

### Phase 8 — Motion Polish & Micro-interactions
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| Global reveal/parallax pass (tune curves, stagger, pinning) | P1 | M | all sections | Cohesive, weighted motion |
| Hover/cursor/magnetic detailing across components | P1 | M | cursor | High-craft feel |
| Section transitions (enter-a-space treatment) | P1 | M | sections | Moment-density up |
| Sound (optional, muted-by-default toggle) | P2 | M | — | Optional delight (Dennis-style) |

### Phase 9 — Performance, SEO & Accessibility
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| Perf pass to hit budgets (code-split, image/font/3D optimization) | P0 | L | all | Fast *with* WebGL |
| Metadata API + dynamic OG images + JSON-LD + sitemap/robots | P0 | M | pages | Discoverable & shareable |
| A11y pass (keyboard, SR, focus, contrast, reduced-motion audit) | P0 | L | all | WCAG 2.2 AA |
| Analytics + Speed Insights | P2 | S | deploy | Real-user monitoring |

### Phase 10 — QA, Cross-Device & Launch
| Task | Pri | Cx | Deps | Outcome |
|---|---|---|---|---|
| Cross-browser/device matrix (Safari iOS incl. WebGL fallbacks) | P0 | M | Ph9 | Works everywhere |
| Responsive audit at 375/768/1440 (+320/1920 edges) | P0 | M | all | No breakpoints broken |
| Content proofread + real project outcomes/metrics | P0 | S | Ph5 | Credible, typo-free |
| Lighthouse/axe CI gate + final polish | P0 | M | Ph9 | Quality locked |
| Production launch + redirects from old URLs | P0 | S | all | Shipped |

### E.1 Suggested sequencing note
Phases 0–5 get you a **launchable v1** (shell + hero + home + work). Phases 6–10 are
depth and polish that can ship incrementally after go-live. Treat P0 as the critical
path; P1/P2 are enhancements you can defer without blocking launch.

---

*Next: `TASKS.md` (progress tracker) and `BUILD_GUIDE.md` (engineering handbook).*
