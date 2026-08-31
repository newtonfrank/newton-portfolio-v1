# M2 · Dark Shell & Home Spine — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy light Tailwind homepage with the dark, token-driven,
CSS-Modules design system — building every new section on a temporary `/preview`
route so `/` keeps working, then swapping in one commit and deleting Tailwind.

**Architecture:** Sections are built fresh, not reskinned. The target Home in
`02-STRATEGY.md · Part B` is a different page from today's: Hero → Manifesto →
Selected Work → Playground teaser → About teaser → Contact. Today's `About`
(education/experience), `TechnicalProjects`, `DesignWork`, and `Skills` are *not*
on it — they belong to `/about` and `/work`, which are M5/M6. Restyling them
would be discarded work, so we don't.

Content already lives in typed `src/content/` modules (M0), so the new sections
consume the same data the old ones did. Nothing is retyped.

**Tech Stack:** Next 15 (App Router, RSC), React 19, TypeScript strict, CSS
Modules, GSAP + ScrollTrigger, Lenis, framer-motion (exit animations only).

## Global Constraints

- **`/` must render correctly after every single commit.** New sections are
  composed on `/preview` (noindex) until Task 9 swaps them in. No task before 9
  may touch `src/app/page.tsx`.
- **CSS Modules only.** `BUILD_GUIDE.md §6`: never mix paradigms. Do not add a
  Tailwind class to any new file. Tailwind stays installed only until Task 9.
- **Tokens are law.** Every color, space, radius, duration, and type size comes
  from `styles/tokens.css` or `lib/motion.ts`. No hex, no `px` gap, no `0.3s`.
- **Animate `transform` and `opacity` only.** Never `width`/`height`/`top`/`left`
  or filters in a scroll path (`BUILD_GUIDE.md §5.8`).
- **Every animation ships a reduced-motion path.** No exceptions
  (`03-DESIGN-SYSTEM.md · E.7`). Reveals collapse to instant; Lenis is disabled;
  magnetic and parallax are skipped.
- **Server by default.** Add `"use client"` only for state, effects, browser
  APIs, GSAP, Lenis, or framer-motion. Keep client islands small and low in the
  tree. Today 100% of components are client; that is the thing being fixed.
- **No test framework exists** and M2 does not add one. The verification cycle is
  `npm run typecheck` → `npm run lint` → `npm run build`, each exiting 0, plus a
  `curl` of `/` and `/preview` for a 200, plus the named `grep` assertions. Read
  the exit code directly (`cmd > log 2>&1; echo $?`) — piping to `tail` reports
  `tail`'s status, not the command's.
- **Accent budget:** at most one Ember or Signal moment per viewport
  (`03-DESIGN-SYSTEM.md · A.3`). Ember = craft/CTA. Signal = build/links/focus.
- **Commit style:** Conventional Commits. The pre-commit hook runs lint-staged.

## Blocked — needs Newton, not code

| Blocker | Why it blocks | Task |
|---|---|---|
| **Manifesto copy.** A real thesis, 2–3 sentences, stating how you work (`02-STRATEGY.md:68-73` suggests *"design and engineering shouldn't be handed off between people"*). | It is your point of view. Inventing it would be putting words in your mouth on your own portfolio. | Task 10, deferred |
| **Playground has no demos.** `/playground` and its Home teaser need at least one working demo. | No content exists. | Deferred to M7 |
| **Where the design gallery lives.** 17 pieces in `content/design.ts`. Target Home has no design section; `02-STRATEGY.md` implies `/work` filtered by `discipline`. | Changes the IA. | Task 6 proposes an answer; confirm before merging |

Task 9 (the swap) does **not** depend on any of these. Home ships without a
Manifesto and gains one when the copy exists.

---

## File Structure

**Created:**
- `src/styles/reset.css` — modern reset, replaces Tailwind preflight (Task 1)
- `src/styles/typography.css` — type role classes (Task 1)
- `src/app/preview/page.tsx`, `page.module.css` — scratch route (Task 1, deleted in Task 9)
- `src/lib/gsap.ts` — plugin registration, once (Task 2)
- `src/components/motion/Reveal.tsx` + `.module.css` (Task 2)
- `src/components/motion/SplitText.tsx` + `.module.css` (Task 2)
- `src/components/layout/Header.tsx` + `.module.css` (Task 3)
- `src/components/layout/SkipLink.tsx` + `.module.css` (Task 3)
- `src/components/layout/SmoothScroll.tsx` — Lenis + ScrollTrigger sync (Task 2)
- `src/components/sections/hero/Hero.tsx` + `.module.css` (Task 4)
- `src/components/sections/work/WorkList.tsx`, `ProjectRow.tsx` + `.module.css` (Task 5)
- `src/components/sections/design/DesignGrid.tsx` + `.module.css` (Task 6)
- `src/components/sections/about/AboutTeaser.tsx` + `.module.css` (Task 7)
- `src/components/sections/contact/Contact.tsx` + `.module.css` (Task 7)
- `src/components/layout/Footer.tsx` + `.module.css` (Task 8)

**Deleted (Task 9):**
- All seven `src/components/sections/*.tsx` legacy files
- `src/components/ui/smooth-scroll.tsx` (superseded by `layout/SmoothScroll.tsx`)
- `tailwind.config.js`, `postcss.config.js` Tailwind plugin entry
- `@fontsource/londrina-*`, `tailwindcss`, `autoprefixer`, `postcss` (if unused)
- `src/app/preview/`

---

### Task 1: CSS foundation and the `/preview` scratch route

Tailwind's preflight is still active, so `reset.css` cannot be applied globally
yet — two resets would fight. It is scoped to `/preview` via a wrapper, then
promoted to global in Task 9.

**Files:**
- Create: `src/styles/reset.css`, `src/styles/typography.css`
- Create: `src/app/preview/page.tsx`, `src/app/preview/page.module.css`

**Interfaces:**
- Produces: type role classes `.displayXl .displayL .h1 .h2 .h3 .bodyL .body .small .mono`, consumed by every later section via `import type` of the CSS module — no, they are **global** classes in `typography.css`, applied as plain strings. Sections use them directly.
- Produces: `/preview` route, where Tasks 3–8 mount each new component.

- [ ] **Step 1: Write `src/styles/reset.css`**

```css
/* Modern reset. Applied globally in Task 9, once Tailwind preflight is gone. */

*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
}

html {
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body {
  min-height: 100dvh;
  line-height: var(--lh-normal);
  -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
}

input,
button,
textarea,
select {
  font: inherit;
  color: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
  overflow-wrap: break-word;
}

ul[role="list"],
ol[role="list"] {
  list-style: none;
  padding: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

:target {
  scroll-margin-block: var(--space-8);
}

/* Non-negotiable reduced-motion floor. 03-DESIGN-SYSTEM.md E.7 */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Write `src/styles/typography.css`**

Global type role classes. `03-DESIGN-SYSTEM.md · B.3`. Tabular figures on mono so
counters and years do not jitter mid-animation (`B.4`).

```css
.displayXl {
  font-family: var(--font-display);
  font-size: var(--fs-display-xl);
  font-weight: 600;
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-display);
}

.displayL {
  font-family: var(--font-display);
  font-size: var(--fs-display-l);
  font-weight: 500;
  line-height: var(--lh-tight);
  letter-spacing: var(--ls-display);
}

.h1 {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: 500;
  line-height: var(--lh-snug);
  letter-spacing: var(--ls-tight);
}

.h2 {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: 500;
  line-height: var(--lh-snug);
  letter-spacing: var(--ls-tight);
}

.h3 {
  font-family: var(--font-display);
  font-size: var(--fs-h3);
  font-weight: 500;
  line-height: var(--lh-snug);
}

.bodyL {
  font-family: var(--font-sans);
  font-size: var(--fs-body-l);
  line-height: var(--lh-normal);
}

.body {
  font-family: var(--font-sans);
  font-size: var(--fs-body);
  line-height: var(--lh-normal);
}

.small {
  font-family: var(--font-sans);
  font-size: var(--fs-small);
  line-height: var(--lh-normal);
}

.mono {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  text-transform: uppercase;
  letter-spacing: var(--ls-mono);
  font-feature-settings: "tnum";
}

/* Long-form prose caps at ~68ch. 03-DESIGN-SYSTEM.md B.4 */
.prose {
  max-width: 68ch;
  line-height: var(--lh-relaxed);
}
```

- [ ] **Step 3: Create the `/preview` route**

`src/app/preview/page.module.css`:

```css
.page {
  min-height: 100dvh;
  background-color: var(--ink);
  color: var(--bone);
  font-family: var(--font-sans);
}
```

`src/app/preview/page.tsx`:

```tsx
import type { Metadata } from "next";
import "@/styles/reset.css";
import "@/styles/typography.css";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Preview",
  robots: { index: false, follow: false },
};

/**
 * Scratch route for building the new Home. Sections are mounted here in order
 * as they land; Task 9 moves this composition into app/page.tsx and deletes
 * this route. Keeps `/` working while the rewrite is in flight.
 */
export default function PreviewPage() {
  return (
    <div className={styles.page}>
      <p className="mono">Preview — new sections mount here</p>
    </div>
  );
}
```

Importing `reset.css` inside a route file scopes it to that route's CSS chunk.
It will still leak globally in dev because Next hoists all CSS, so **verify `/`
is unaffected in a production build**, not in `next dev`.

- [ ] **Step 4: Verify**

```bash
npm run typecheck > /tmp/t.log 2>&1; echo "typecheck: $?"
npm run lint > /tmp/l.log 2>&1; echo "lint: $?"
npm run build > /tmp/b.log 2>&1; echo "build: $?"
```

All three must print `0`. Then confirm `/` still ships its Tailwind styles and
`/preview` exists:

```bash
grep -c "spectrum-divider" .next/server/app/index.html   # expect >= 1
ls .next/server/app/preview.html                          # must exist
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(styles): add reset + typography roles, scaffold /preview route"
```

---

### Task 2: GSAP, Lenis, and the reveal primitives

**Files:**
- Create: `src/lib/gsap.ts`, `src/components/layout/SmoothScroll.tsx`
- Create: `src/components/motion/Reveal.tsx`, `Reveal.module.css`
- Create: `src/components/motion/SplitText.tsx`, `SplitText.module.css`

**Interfaces:**
- Consumes: `duration`, `stagger`, `gsapEase` from `@/lib/motion`; `useReducedMotion` from `@/hooks/useReducedMotion`.
- Produces:
  - `registerGsap(): void` — idempotent plugin registration.
  - `<SmoothScroll>{children}</SmoothScroll>` — client, Lenis + ScrollTrigger.
  - `<Reveal as?: "div"|"section" delay?: number>{children}</Reveal>`
  - `<SplitText text: string, as?: "h1"|"h2"|"p", className?: string />` — splits on words.

- [ ] **Step 1: Install GSAP**

```bash
npm install gsap @gsap/react
```

**License note, verified against the npm registry, not memory:** `gsap@3.15` ships
under the *Standard "no charge" license* (<https://gsap.com/standard-license>), and
`@gsap/react` says `SEE LICENSE AT` the same URL. Neither is MIT or OSI-approved
open source. Free to use here — ScrollTrigger requires no club membership — but if
this repo ever goes public or gets reused commercially, read the terms first.

- [ ] **Step 2: Write `src/lib/gsap.ts`**

```ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

let registered = false;

/** Idempotent. Safe to call from every client island. */
export function registerGsap(): void {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  registered = true;
}

export { gsap, ScrollTrigger, useGSAP };
```

- [ ] **Step 3: Write `src/components/layout/SmoothScroll.tsx`**

Drives Lenis from GSAP's ticker so ScrollTrigger and Lenis never disagree about
scroll position. Disabled entirely under reduced motion — native scroll instead.

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    registerGsap();

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
```

- [ ] **Step 4: Write `src/components/motion/Reveal.tsx` and its module**

`Reveal.module.css`:

```css
.root {
  will-change: transform, opacity;
}
```

`Reveal.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { duration, gsapEase } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./Reveal.module.css";

interface RevealProps {
  children: React.ReactNode;
  /** Seconds. */
  delay?: number;
  className?: string;
}

/**
 * Standard scroll reveal: fade + rise, fires once at 85% viewport.
 * Under reduced motion the element is simply visible — no animation, no delay.
 * Prefer this over ad-hoc ScrollTriggers in sections (BUILD_GUIDE.md 5.7).
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      registerGsap();
      gsap.from(root.current, {
        opacity: 0,
        y: 32,
        duration: duration.slow,
        ease: gsapEase.out,
        delay,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div ref={root} className={className ? `${styles.root} ${className}` : styles.root}>
      {children}
    </div>
  );
}
```

`useGSAP` reverts everything on unmount, which is what stops ScrollTrigger ghosts
after client-side navigation.

- [ ] **Step 5: Write `src/components/motion/SplitText.tsx` and its module**

Splits on words (not characters — 60 chars of display type is 60 ScrollTriggers).
Each word sits in an `overflow: hidden` mask; the inner span translates up.

`SplitText.module.css`:

```css
.word {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
}

.inner {
  display: inline-block;
  will-change: transform;
}

.space {
  display: inline-block;
  width: 0.25em;
}
```

`SplitText.tsx`:

```tsx
"use client";

import { useRef } from "react";
import { gsap, useGSAP, registerGsap } from "@/lib/gsap";
import { duration, gsapEase, stagger } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./SplitText.module.css";

interface SplitTextProps {
  text: string;
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
}

/**
 * Word-by-word masked reveal. Under reduced motion it renders the plain string
 * with no wrapper spans at all, so screen readers and text selection behave
 * normally.
 */
export function SplitText({ text, as: Tag = "span", className }: SplitTextProps) {
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;
      registerGsap();
      gsap.from(root.current.querySelectorAll(`.${styles.inner}`), {
        yPercent: 110,
        duration: duration.slow,
        ease: gsapEase.out,
        stagger: stagger.base,
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag ref={root as never} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`} aria-hidden="true">
          <span className={styles.word}>
            <span className={styles.inner}>{word}</span>
          </span>
          {i < words.length - 1 && <span className={styles.space} />}
        </span>
      ))}
    </Tag>
  );
}
```

`aria-label` on the container plus `aria-hidden` on the fragments means assistive
tech reads one clean string, not 40 disconnected words.

- [ ] **Step 6: Mount both on `/preview` and verify**

Add to `src/app/preview/page.tsx` inside the wrapper:

```tsx
<SplitText as="h1" text="Design and engineering, one hand" className="displayL" />
<Reveal>
  <p className="bodyL prose">Revealed on scroll.</p>
</Reveal>
```

with `import { Reveal } from "@/components/motion/Reveal";` and
`import { SplitText } from "@/components/motion/SplitText";`.

```bash
npm run typecheck > /tmp/t.log 2>&1; echo "typecheck: $?"
npm run build > /tmp/b.log 2>&1; echo "build: $?"
```

Both `0`. Then confirm the accessible label survived and words were split:

```bash
grep -o 'aria-label="Design and engineering, one hand"' .next/server/app/preview.html
grep -c 'aria-hidden="true"' .next/server/app/preview.html   # expect 5 (one per word)
```

Then run `npm run dev`, open `/preview`, and confirm: the headline animates in,
and with macOS System Settings → Accessibility → Display → Reduce Motion **on**,
it appears instantly with no split spans in the DOM.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(motion): add gsap setup, SmoothScroll, Reveal and SplitText primitives"
```

---

### Task 3: Header and SkipLink

**Files:**
- Create: `src/components/layout/Header.tsx`, `Header.module.css`
- Create: `src/components/layout/SkipLink.tsx`, `SkipLink.module.css`

**Interfaces:**
- Consumes: `site`, `navLinks` from `@/content/site`.
- Produces: `<Header />`, `<SkipLink />`. Header is a client component (it reads scroll); SkipLink is a server component.

Spec: `03-DESIGN-SYSTEM.md · D.3` — transparent, gaining `--glass` + blur after
the hero. The overlay menu (`D.4`) is **deferred**; the Header ships with plain
anchor links to the Home section ids, which is what `navLinks` already holds.

- [ ] **Step 1: `SkipLink.module.css`**

```css
.link {
  position: absolute;
  inset-inline-start: var(--space-4);
  inset-block-start: calc(-1 * var(--space-10));
  z-index: var(--z-cursor);

  padding: var(--space-3) var(--space-5);
  background-color: var(--ink-raised);
  color: var(--bone);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-sm);

  transition: transform var(--duration-fast) var(--ease-out);
}

.link:focus-visible {
  transform: translateY(calc(100% + var(--space-10)));
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
```

- [ ] **Step 2: `SkipLink.tsx`**

```tsx
import styles from "./SkipLink.module.css";

export function SkipLink() {
  return (
    <a href="#main" className={`${styles.link} mono`}>
      Skip to content
    </a>
  );
}
```

- [ ] **Step 3: `Header.module.css`**

```css
.header {
  position: fixed;
  inset-block-start: 0;
  inset-inline: 0;
  z-index: var(--z-header);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);

  padding: var(--space-4) var(--container-pad);

  background-color: transparent;
  border-block-end: 1px solid transparent;
  transition:
    background-color var(--duration-fast) var(--ease-out),
    border-color var(--duration-fast) var(--ease-out),
    backdrop-filter var(--duration-fast) var(--ease-out);
}

.scrolled {
  background-color: var(--glass);
  border-block-end-color: var(--line);
  backdrop-filter: blur(var(--blur-glass));
  -webkit-backdrop-filter: blur(var(--blur-glass));
}

.wordmark {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: var(--fs-h3);
  letter-spacing: var(--ls-tight);
  color: var(--bone);
}

.nav {
  display: none;
  gap: var(--space-6);
}

@media (min-width: 48rem) {
  .nav {
    display: flex;
  }
}

.navLink {
  color: var(--bone-muted);
  transition: color var(--duration-micro) var(--ease-out);
}

.navLink:hover {
  color: var(--bone);
}

.navLink:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
  border-radius: var(--radius-sm);
}
```

- [ ] **Step 4: `Header.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { navLinks, site } from "@/content/site";
import { cn } from "@/lib/utils";
import styles from "./Header.module.css";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={cn(styles.header, scrolled && styles.scrolled)}>
      <a href="#hero" className={styles.wordmark}>
        {site.name}
      </a>
      <nav className={styles.nav} aria-label="Primary">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className={cn(styles.navLink, "mono")}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
```

The scroll listener is `passive` so it never blocks the compositor, and it toggles
a class rather than writing inline styles, so the transition stays in CSS.

- [ ] **Step 5: Mount on `/preview`, verify, commit**

Add `<SkipLink />` and `<Header />` above the existing preview content. Then:

```bash
npm run typecheck > /tmp/t.log 2>&1; echo "typecheck: $?"
npm run build > /tmp/b.log 2>&1; echo "build: $?"
grep -o 'aria-label="Primary"' .next/server/app/preview.html
grep -o 'href="#main"' .next/server/app/preview.html
```

Both greps must match. Tab into the page in a browser: the skip link must appear
on first Tab and move focus to `#main` on Enter.

```bash
git add -A
git commit -m "feat(layout): add Header with glass-on-scroll and a skip link"
```

---

### Task 4: Hero

**Files:**
- Create: `src/components/sections/hero/Hero.tsx`, `Hero.module.css`
- Modify: `src/content/site.ts` (add `heroEyebrow`), `src/types/content.ts` (add the field)

**Interfaces:**
- Consumes: `site` from `@/content/site`; `SplitText`; `Button`.
- Produces: `<Hero />` — server component wrapping a `SplitText` client island.

Spec: `02-STRATEGY.md · C.2`. Mono eyebrow, display headline with line reveals,
magnetic CTAs, availability pill. The WebGL Nexus object is **M3** — the hero
ships without it and gains it later. Magnetic pull is deferred with the cursor.

- [ ] **Step 1: Extend the site content type and data**

In `src/types/content.ts`, add to `SiteConfig`:

```ts
  /** Mono eyebrow above the hero headline, e.g. "01 / DESIGN × ENGINEERING". */
  heroEyebrow: string;
  /** Shown in the availability pill. */
  availability: string;
```

In `src/content/site.ts`, add to `site`:

```ts
  heroEyebrow: "01 / Design × Engineering",
  availability: "Available for work",
```

- [ ] **Step 2: `Hero.module.css`**

```css
.hero {
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-6);
  padding: var(--space-10) var(--container-pad) var(--space-8);
}

.eyebrow {
  color: var(--bone-subtle);
}

.headline {
  color: var(--bone);
  max-width: 18ch;
}

.tagline {
  color: var(--bone-muted);
  max-width: 52ch;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-4);
  margin-block-start: var(--space-4);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius-full);
  color: var(--bone-muted);
}

.dot {
  width: var(--space-2);
  height: var(--space-2);
  border-radius: var(--radius-full);
  background-color: var(--success);
}

.meta {
  margin-block-start: auto;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  color: var(--bone-subtle);
}
```

- [ ] **Step 3: `Hero.tsx`**

Ember on the primary CTA is this viewport's single accent moment; the availability
dot uses `--success`, which is semantic, not an accent.

```tsx
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { SplitText } from "@/components/motion/SplitText";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <p className={`${styles.eyebrow} mono`}>{site.heroEyebrow}</p>

      <SplitText
        as="h1"
        text={`${site.headlineTop} ${site.headlineBottom}`}
        className={`${styles.headline} displayXl`}
      />

      <p className={`${styles.tagline} bodyL`}>{site.tagline}</p>

      <div className={styles.actions}>
        <Button href="#work" variant="primary" size="lg">
          Selected work
        </Button>
        <Button href={`mailto:${site.email}`} variant="secondary" size="lg">
          Get in touch
        </Button>
        <span className={`${styles.pill} mono`}>
          <span className={styles.dot} aria-hidden="true" />
          {site.availability}
        </span>
      </div>

      <div className={`${styles.meta} mono`}>
        {site.heroTech.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Mount on `/preview`, verify, commit**

```bash
npm run typecheck > /tmp/t.log 2>&1; echo "typecheck: $?"
npm run build > /tmp/b.log 2>&1; echo "build: $?"
grep -o "Available for work" .next/server/app/preview.html
grep -o "01 / Design" .next/server/app/preview.html
```

Both must match — the Hero is a server component, so its text is in the
prerendered HTML. That is the point: today's hero is not.

```bash
git add -A
git commit -m "feat(hero): dark hero with split headline, CTAs, availability pill"
```

---

### Task 5: Selected Work rows

**Files:**
- Create: `src/components/sections/work/WorkList.tsx`, `ProjectRow.tsx`, `WorkList.module.css`, `ProjectRow.module.css`
- Modify: `src/types/content.ts` — add `year` and `discipline` to `Project`
- Modify: `src/content/projects.ts` — populate the new fields

**Interfaces:**
- Consumes: `projects` from `@/content/projects`; `Reveal`.
- Produces: `<WorkList />`, `<ProjectRow project year index />`.

Spec: `03-DESIGN-SYSTEM.md · D.6`. A list, not a grid: mono index, display title,
underline sweep, row lift on hover. Cursor-follow image preview is deferred with
the custom cursor; hover shows the cover inline instead.

- [ ] **Step 1: Extend the `Project` type**

```ts
export type Discipline = "engineering" | "design" | "both";

export interface Project {
  title: string;
  description: string;
  image: string;
  tags: string[];
  href?: string;
  /** Four-digit year, for the mono meta column. */
  year: string;
  discipline: Discipline;
}
```

- [ ] **Step 2: Populate the fields in `src/content/projects.ts`**

Add to each entry, in the existing order:

```ts
// Unipix
year: "2024", discipline: "both",
// Secure Healthcare Data Sharing with Blockchain
year: "2024", discipline: "engineering",
// Industrial IoT Live Monitoring Dashboard
year: "2025", discipline: "both",
// Component-Based Client Web Platform
year: "2023", discipline: "engineering",
```

Years are taken from `content/about.ts`: the IIoT dashboard is the Smartchakra
internship (Feb–Jun 2025); the component-based platform is Scyara (May–Jul 2023).
**Confirm the two remaining years with Newton before merging** — they are inferred,
not sourced.

- [ ] **Step 3: `ProjectRow.module.css`**

```css
.row {
  display: grid;
  grid-template-columns: 3rem 1fr auto;
  align-items: baseline;
  gap: var(--space-5);

  padding-block: var(--space-6);
  border-block-start: 1px solid var(--line);

  transition: transform var(--duration-fast) var(--ease-out);
}

.row:hover {
  transform: translateX(var(--space-2));
}

.row:focus-within {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}

.index {
  color: var(--bone-subtle);
}

.title {
  color: var(--bone);
  position: relative;
  display: inline-block;
}

/* Underline sweep: scaleX from left. Transform-only, compositor-safe. */
.title::after {
  content: "";
  position: absolute;
  inset-inline: 0;
  inset-block-end: -0.1em;
  height: 1px;
  background-color: var(--ember);

  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--duration-fast) var(--ease-out);
}

.row:hover .title::after,
.row:focus-within .title::after {
  transform: scaleX(1);
}

.description {
  color: var(--bone-muted);
  grid-column: 2;
  margin-block-start: var(--space-3);
}

.meta {
  color: var(--bone-subtle);
  text-align: end;
}

.link::after {
  content: "";
  position: absolute;
  inset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .row:hover {
    transform: none;
  }
}
```

- [ ] **Step 4: `ProjectRow.tsx`**

```tsx
import type { Project } from "@/types/content";
import styles from "./ProjectRow.module.css";

interface ProjectRowProps {
  project: Project;
  index: number;
}

export function ProjectRow({ project, index }: ProjectRowProps) {
  const label = String(index + 1).padStart(2, "0");

  return (
    <article className={styles.row}>
      <span className={`${styles.index} mono`}>{label}</span>

      <h3 className={`${styles.title} h2`}>
        {project.href ? (
          <a
            href={project.href}
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            {project.title}
          </a>
        ) : (
          project.title
        )}
      </h3>

      <span className={`${styles.meta} mono`}>{project.year}</span>

      <p className={`${styles.description} body`}>{project.description}</p>
    </article>
  );
}
```

The `.link::after` full-bleed pseudo-element makes the whole row clickable while
keeping exactly one anchor in the tab order — no nested interactive elements.

- [ ] **Step 5: `WorkList.module.css` and `WorkList.tsx`**

```css
.section {
  padding: var(--section-y) var(--container-pad);
  max-width: var(--container-max);
  margin-inline: auto;
}

.heading {
  color: var(--bone);
  margin-block-end: var(--space-7);
}

.eyebrow {
  color: var(--bone-subtle);
  margin-block-end: var(--space-3);
}

.list {
  border-block-end: 1px solid var(--line);
}
```

```tsx
import { projects } from "@/content/projects";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectRow } from "./ProjectRow";
import styles from "./WorkList.module.css";

export function WorkList() {
  return (
    <section id="work" className={styles.section}>
      <p className={`${styles.eyebrow} mono`}>02 / Selected work</p>
      <h2 className={`${styles.heading} displayL`}>Proof, not promises</h2>

      <div className={styles.list}>
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.06}>
            <ProjectRow project={project} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Verify and commit**

```bash
npm run typecheck > /tmp/t.log 2>&1; echo "typecheck: $?"
npm run build > /tmp/b.log 2>&1; echo "build: $?"
grep -c "ProjectRow_row" .next/server/app/preview.html   # expect 4
grep -o "Unipix - Unified Free Stock Image Search" .next/server/app/preview.html
```

```bash
git add -A
git commit -m "feat(work): selected work rows with underline sweep and index"
```

---

### Task 6: Design gallery

**Decision to confirm:** the target Home has no design section. The 17 pieces in
`content/design.ts` are real work and should not vanish. This task puts them on
Home as a compact grid linking to nothing yet; M5 moves them into `/work` filtered
by `discipline: "design"`. **If Newton prefers they go straight to `/work`, skip
this task entirely** — nothing else depends on it.

**Files:**
- Create: `src/components/sections/design/DesignGrid.tsx`, `DesignGrid.module.css`

**Interfaces:**
- Consumes: `designProjects` from `@/content/design`; `next/image`.
- Produces: `<DesignGrid />` — server component.

- [ ] **Step 1: `DesignGrid.module.css`**

```css
.section {
  padding: var(--section-y) var(--container-pad);
  max-width: var(--container-max);
  margin-inline: auto;
}

.eyebrow {
  color: var(--bone-subtle);
  margin-block-end: var(--space-3);
}

.heading {
  color: var(--bone);
  margin-block-end: var(--space-7);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: var(--gutter);
}

.tile {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background-color: var(--ink-elevated);
  aspect-ratio: 4 / 5;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--duration-base) var(--ease-out);
}

.tile:hover .image {
  transform: scale(1.03);
}

@media (prefers-reduced-motion: reduce) {
  .tile:hover .image {
    transform: none;
  }
}
```

- [ ] **Step 2: `DesignGrid.tsx`**

Uses `next/image` — the legacy `DesignWork.tsx` used raw `<img>`, which is one of
the three `no-img-element` lint warnings. `sizes` is required or Next serves the
largest candidate to every viewport.

```tsx
import Image from "next/image";
import { designProjects } from "@/content/design";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./DesignGrid.module.css";

export function DesignGrid() {
  return (
    <section id="design" className={styles.section}>
      <p className={`${styles.eyebrow} mono`}>03 / Craft</p>
      <h2 className={`${styles.heading} displayL`}>Things made by hand</h2>

      <div className={styles.grid}>
        {designProjects.map((piece, i) => (
          <Reveal key={piece.image} delay={(i % 4) * 0.06}>
            <div className={styles.tile}>
              <Image
                src={piece.image}
                alt={piece.title}
                width={piece.width}
                height={piece.height}
                sizes="(min-width: 64rem) 22vw, (min-width: 48rem) 33vw, 50vw"
                className={styles.image}
                loading="lazy"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
npm run build > /tmp/b.log 2>&1; echo "build: $?"
grep -c "DesignGrid_tile" .next/server/app/preview.html   # expect 17
grep -c "no-img-element" /tmp/b.log                        # must not increase
```

```bash
git add -A
git commit -m "feat(design): design gallery grid using next/image"
```

---

### Task 7: About teaser and Contact

**Files:**
- Create: `src/components/sections/about/AboutTeaser.tsx`, `AboutTeaser.module.css`
- Create: `src/components/sections/contact/Contact.tsx`, `Contact.module.css`

**Interfaces:**
- Consumes: `experience` from `@/content/about`; `site`, `socials` from `@/content/site`; `Button`, `Reveal`.
- Produces: `<AboutTeaser />` (server), `<Contact />` (server).

**The contact form stays non-functional in this task and the markup must not
pretend otherwise.** The legacy form fakes success (`Contact.tsx:10-14`). Rather
than reproduce that lie, this section ships a mailto CTA and the channels list.
A real form with a Resend/Formspree route is M4.

- [ ] **Step 1: `AboutTeaser.module.css`**

```css
.section {
  padding: var(--section-y) var(--container-pad);
  max-width: var(--container-max);
  margin-inline: auto;
}

.eyebrow {
  color: var(--bone-subtle);
  margin-block-end: var(--space-3);
}

.statement {
  color: var(--bone);
  margin-block-end: var(--space-7);
}

.roles {
  display: grid;
  gap: var(--space-5);
}

@media (min-width: 48rem) {
  .roles {
    grid-template-columns: 1fr 1fr;
  }
}

.role {
  padding: var(--space-5);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background-color: var(--ink-elevated);
}

.roleMeta {
  color: var(--bone-subtle);
}

.roleTitle {
  color: var(--bone);
  margin-block: var(--space-2);
}

.roleCompany {
  color: var(--bone-muted);
}
```

- [ ] **Step 2: `AboutTeaser.tsx`**

```tsx
import { experience } from "@/content/about";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./AboutTeaser.module.css";

export function AboutTeaser() {
  return (
    <section id="about" className={styles.section}>
      <p className={`${styles.eyebrow} mono`}>04 / Person</p>
      <h2 className={`${styles.statement} displayL`}>
        I build the thing I designed.
      </h2>

      <div className={styles.roles}>
        {experience.map((role, i) => (
          <Reveal key={role.company} delay={i * 0.06}>
            <article className={styles.role}>
              <p className={`${styles.roleMeta} mono`}>{role.date}</p>
              <h3 className={`${styles.roleTitle} h3`}>{role.role}</h3>
              <p className={`${styles.roleCompany} body`}>{role.company}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <div style={{ marginBlockStart: "var(--space-7)" }}>
        <Button href="#contact" variant="secondary">
          Work with me
        </Button>
      </div>
    </section>
  );
}
```

The inline `style` above is a token reference, not a magic number, and exists
because a one-off margin does not earn a class. If a second use appears, promote
it to `.cta` in the module.

- [ ] **Step 3: `Contact.module.css`**

```css
.section {
  padding: var(--section-y) var(--container-pad);
  max-width: var(--container-max);
  margin-inline: auto;
  text-align: center;
}

.eyebrow {
  color: var(--bone-subtle);
  margin-block-end: var(--space-3);
}

.headline {
  color: var(--bone);
  margin-block-end: var(--space-6);
}

.channels {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-5);
  margin-block-start: var(--space-7);
}

.channel {
  color: var(--bone-muted);
  transition: color var(--duration-micro) var(--ease-out);
}

.channel:hover {
  color: var(--signal);
}

.channel:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
  border-radius: var(--radius-sm);
}
```

- [ ] **Step 4: `Contact.tsx`**

```tsx
import { site, socials } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { SplitText } from "@/components/motion/SplitText";
import styles from "./Contact.module.css";

export function Contact() {
  return (
    <section id="contact" className={styles.section}>
      <p className={`${styles.eyebrow} mono`}>05 / Invitation</p>

      <SplitText
        as="h2"
        text="Let's build something worth shipping"
        className={`${styles.headline} displayL`}
      />

      <Button href={`mailto:${site.email}`} variant="primary" size="lg">
        {site.email}
      </Button>

      <div className={styles.channels}>
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target={social.href.startsWith("http") ? "_blank" : undefined}
            rel={social.href.startsWith("http") ? "noreferrer" : undefined}
            className={`${styles.channel} mono`}
          >
            {social.label}
          </a>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Verify and commit**

```bash
npm run build > /tmp/b.log 2>&1; echo "build: $?"
grep -o "newtonfrank@outlook.in" .next/server/app/preview.html | head -1
grep -o "Smartchakra Private Limited" .next/server/app/preview.html
```

```bash
git add -A
git commit -m "feat(sections): about teaser and contact, mailto CTA over a fake form"
```

---

### Task 8: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`, `Footer.module.css`

**Interfaces:**
- Consumes: `site`, `socials` from `@/content/site`; `Github`, `Linkedin` from `@/components/ui/BrandIcons`; `Mail` from `lucide-react`.
- Produces: `<Footer />` — server component.

- [ ] **Step 1: `Footer.module.css`**

```css
.footer {
  padding: var(--space-8) var(--container-pad);
  border-block-start: 1px solid var(--line);
  background-color: var(--ink);
}

.inner {
  max-width: var(--container-max);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: center;
}

@media (min-width: 48rem) {
  .inner {
    flex-direction: row;
    justify-content: space-between;
  }
}

.colophon {
  color: var(--bone-subtle);
  text-align: center;
}

.socials {
  display: flex;
  gap: var(--space-3);
}

.social {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--line);
  border-radius: var(--radius-full);
  color: var(--bone-muted);
  transition:
    color var(--duration-micro) var(--ease-out),
    border-color var(--duration-micro) var(--ease-out);
}

.social:hover {
  color: var(--signal);
  border-color: var(--line-strong);
}

.social:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}
```

44×44 is the touch-target floor from `BUILD_GUIDE.md §9`.

- [ ] **Step 2: `Footer.tsx`**

```tsx
import { Mail } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/BrandIcons";
import { site, socials } from "@/content/site";
import styles from "./Footer.module.css";

const iconFor: Record<string, React.ComponentType<{ size?: number }>> = {
  GitHub: Github,
  LinkedIn: Linkedin,
  Email: Mail,
};

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={`${styles.colophon} mono`}>
          © {new Date().getFullYear()} {site.name} — {site.location}
        </p>

        <div className={styles.socials}>
          {socials.map((social) => {
            const Icon = iconFor[social.label];
            return (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className={styles.social}
                aria-label={social.label}
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
```

`new Date().getFullYear()` in a server component is evaluated at build time, not
request time. This page is statically generated, so the year freezes at the last
deploy. That is acceptable for a portfolio that redeploys often; if it ever
matters, move the year into `content/site.ts`.

- [ ] **Step 3: Verify and commit**

```bash
npm run build > /tmp/b.log 2>&1; echo "build: $?"
grep -o 'aria-label="GitHub"' .next/server/app/preview.html
```

```bash
git add -A
git commit -m "feat(layout): dark footer with brand icons and colophon"
```

---

### Task 9: The swap — promote `/preview` to `/`, delete Tailwind

This is the only task that changes what a visitor sees. Everything before it was
additive.

**Files:**
- Modify: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`
- Delete: all seven legacy `src/components/sections/*.tsx`, `src/components/ui/smooth-scroll.tsx`, `src/app/preview/`, `tailwind.config.js`
- Modify: `postcss.config.js`, `package.json`

- [ ] **Step 1: Rewrite `src/app/page.tsx`**

Note what is gone: `"use client"`, and every `dynamic(..., { ssr: false })`. The
whole page is now server-rendered. `SmoothScroll` is the only client island, and
it wraps rather than replaces.

```tsx
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/hero/Hero";
import { WorkList } from "@/components/sections/work/WorkList";
import { DesignGrid } from "@/components/sections/design/DesignGrid";
import { AboutTeaser } from "@/components/sections/about/AboutTeaser";
import { Contact } from "@/components/sections/contact/Contact";

export default function Home() {
  return (
    <SmoothScroll>
      <SkipLink />
      <Header />
      <main id="main">
        <Hero />
        <WorkList />
        <DesignGrid />
        <AboutTeaser />
        <Contact />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
```

- [ ] **Step 2: Rewrite `src/app/globals.css`**

Everything Tailwind and every legacy custom property goes. What remains is the
global CSS the new system needs.

```css
@import "./../styles/reset.css";
@import "./../styles/typography.css";

body {
  background-color: var(--ink);
  color: var(--bone);
  font-family: var(--font-sans);
  font-size: var(--fs-body);
}

::selection {
  background-color: var(--ember);
  color: var(--ink);
}

:focus-visible {
  outline: var(--focus-ring);
  outline-offset: var(--focus-offset);
}

/* Lenis */
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
```

`tokens.css` is still imported first from `layout.tsx`, so `@import` order here
does not need to include it.

- [ ] **Step 3: Strip the legacy fonts from `layout.tsx`**

Remove the `Inter`, `Poppins`, and both `@fontsource/londrina-*` imports and their
`.variable` entries from the `<body>` className. Keep `JetBrains_Mono`. Set
`preload: true` on `clashDisplay` and `generalSans` in `src/lib/fonts.ts` — the
hero now renders in Clash Display, so it is a critical face.

Update `viewport.themeColor` to the dark base:

```ts
export const viewport = {
  themeColor: "#0B0B0E",
};
```

- [ ] **Step 4: Delete the legacy tree**

```bash
git rm src/components/sections/Hero.tsx \
       src/components/sections/About.tsx \
       src/components/sections/TechnicalProjects.tsx \
       src/components/sections/DesignWork.tsx \
       src/components/sections/Skills.tsx \
       src/components/sections/Contact.tsx \
       src/components/sections/Footer.tsx \
       src/components/ui/smooth-scroll.tsx \
       tailwind.config.js
git rm -r src/app/preview
```

`content/skills.ts` is now unreferenced but **must not be deleted** — `/about`
(M6) consumes it. Leave it; note it in `TASKS.md`.

- [ ] **Step 5: Remove Tailwind from the toolchain**

`postcss.config.js` — drop the `tailwindcss` plugin, keep `autoprefixer`:

```js
export default {
  plugins: {
    autoprefixer: {},
  },
};
```

```bash
npm uninstall tailwindcss @fontsource/londrina-solid @fontsource/londrina-outline
```

- [ ] **Step 6: Verify — the real test**

```bash
npm run typecheck > /tmp/t.log 2>&1; echo "typecheck: $?"
npm run lint > /tmp/l.log 2>&1; echo "lint: $?"
npm run build > /tmp/b.log 2>&1; echo "build: $?"
```

All `0`. Now assert the three things this whole plan exists to achieve.

**1. The homepage is server-rendered.** It currently is not — `section-container`
appears 0 times in today's prerendered HTML.

```bash
grep -c "Hero_hero" .next/server/app/index.html          # expect >= 1
grep -o "Available for work" .next/server/app/index.html # must match
grep -c "ProjectRow_row" .next/server/app/index.html     # expect 4
```

**2. Tailwind is gone.**

```bash
grep -rq "tailwind" src/ && echo "FAIL: tailwind refs remain" || echo "PASS"
grep -c "no-img-element" /tmp/l.log   # expect 0 — the raw <img> tags are gone
```

**3. The bundle did not regress.** GSAP is new weight; the budget is 180 kB.

```bash
grep -E "^┌|First Load JS shared" /tmp/b.log
```

Record the number. If `/` exceeds 180 kB gzip, stop and investigate before
merging — do not wave it through.

Then, in a browser:
- `/` renders dark, in Clash Display, with no flash of the old light theme.
- Tab order: skip link → wordmark → nav → hero CTAs → rows → footer.
- With Reduce Motion on: no reveals animate, Lenis is off, scroll is native.
- 320px wide: no horizontal scroll.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: replace the legacy light homepage with the dark design system

Home is now server-rendered. Tailwind, the legacy sections, and the
Inter/Poppins/Londrina faces are gone."
```

---

### Task 10 (deferred): Manifesto

**Blocked on Newton.** Needs 2–3 sentences of real thesis — the argument for why
design and engineering belong in one head. `02-STRATEGY.md:68-73`.

When the copy exists: add `manifesto` to `content/site.ts`, build
`sections/manifesto/Manifesto.tsx` with a `SplitText` word reveal and the
Craft (Ember) / Build (Signal) split columns from `02-STRATEGY.md · C.3`, and
insert it between `<Hero />` and `<WorkList />` in `page.tsx`.

---

## Deferred out of M2

| Item | Milestone | Why not now |
|---|---|---|
| Overlay menu (`D.4`) | M2 cont. | Header ships with anchor links; the menu needs focus trap, scroll lock, and hover previews — its own task |
| Custom cursor (`D.14`) | M2 cont. | Needs Zustand state and touch/reduced-motion guards |
| MagneticButton | M2 cont. | Depends on the cursor's pointer state |
| Page transitions | M2 cont. | Only one route exists; meaningless until `/work` and `/about` land |
| WebGL Nexus hero | M3 | Hero ships without it; `three` + R3F reinstall at that point |
| Scroll progress | M8 | Polish |
| Working contact form | M4 | Needs Resend/Formspree key and a `/api/contact` route |
| `/work`, `/work/[slug]`, `/about`, `/playground` | M5–M7 | Each needs content that does not exist |

---

## Self-Review

**Spec coverage.** M2 in `TASKS.md` lists: root layout providers ✅ (Task 9),
Lenis + ScrollTrigger sync ✅ (Task 2), Header ✅ (Task 3), overlay menu ❌
(deferred, above), custom cursor ❌ (deferred), Footer ✅ (Task 8), page
transitions ❌ (deferred — one route), skip link ✅ (Task 3). Four of eight land;
the four that do not are listed with reasons rather than silently dropped. The
plan also completes M1's `reset.css`/`typography.css` (Task 1) and pulls M4's Home
sections forward, because deleting Tailwind requires replacing every section that
uses it — there is no smaller coherent unit.

**Placeholder scan.** No `TBD`. Every code step contains the code. Every verify
step contains the command and its expected output. The two places I could not
supply content — the Manifesto thesis and two project years — are called out as
requiring Newton, not filled with invention.

**Type consistency.** `Project` gains `year: string` and `discipline: Discipline`
in Task 5 Step 1; both are consumed in Task 5 Step 4 (`project.year`) under those
exact names. `SiteConfig` gains `heroEyebrow` and `availability` in Task 4 Step 1;
both are consumed in Task 4 Step 3. `DesignProject` (`title`, `image`, `width`,
`height`) is unchanged from M0 and consumed in Task 6. `iconFor` is keyed on
`SocialLink.label` in Task 8, matching the values in `content/site.ts`
(`GitHub`, `LinkedIn`, `Email`).

**Known deviation from the writing-plans skill.** No TDD cycle: this repo has no
test framework, and M2 does not add one. Each task's deliverable is verified by
typecheck + lint + build + `grep` assertions against the prerendered HTML, plus a
named browser check where the deliverable is visual or interactive. Reveals,
focus order, and reduced-motion cannot be asserted by `grep` and are listed as
explicit manual checks in Tasks 2, 3, and 9.
