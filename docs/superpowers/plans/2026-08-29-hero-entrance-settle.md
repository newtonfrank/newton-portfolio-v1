# Hero Entrance ("Settle") Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the site a first-load entrance in which the hero's scroll-driven name marquee arrives at speed and decelerates into a register-locked rest while the portrait resolves in place — with no loading screen, no invented progress, and no cost to LCP.

**Architecture:** Two decoupled systems. The portrait and chrome resolve via autonomous CSS `@keyframes` that need no JavaScript. The marquee is driven by a single rAF loop in a new `useHeroEntrance` hook, which cruises at constant velocity until real readiness signals land (`document.fonts.ready` + the portrait's `onLoad`, capped by the existing `duration.loader` token), then eases to a landing offset quantized to a whole marquee unit so the resting composition is identical on every load, then hands off to the pre-existing scroll-driven behaviour.

**Tech Stack:** Next 15 App Router · React 19 · TypeScript strict · CSS Modules + custom-property tokens · Playwright (test runner added by Task 1)

**Spec:** `docs/superpowers/specs/2026-08-29-hero-entrance-settle-design.md`

## Global Constraints

- **Tokens are law** (BUILD_GUIDE golden rule). No literal colour, space, type size, duration, or easing in a CSS module or component. Every new magnitude gets a custom property in `src/styles/tokens.css`.
- **No new runtime dependencies.** `@playwright/test` is a `devDependency` only. Do not add GSAP usage, animation libraries, or state libraries.
- **The portrait must never be masked, clipped, or given `opacity` below 1.** It is the LCP element (`src/components/sections/hero/Hero.tsx:85`). `filter` and `transform` are permitted; anything that removes it from paint is not.
- **No scroll lock.** Scroll input must remain live throughout the entrance.
- **No `sessionStorage` "seen" flag.** The entrance replays on every load by design.
- Import alias is `@/*` → `./src/*`.
- Every task ends green on `npm run typecheck` and `npm run lint`.
- Commit messages end with the trailer:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- Scope is the Hero section only. Do not wire `motion/Reveal` or `motion/SplitText` into any section.

## File Structure

| File | Responsibility |
|---|---|
| `playwright.config.ts` | **new** — test runner config; builds and serves the app |
| `tests/hero-entrance.spec.ts` | **new** — the four behavioural assertions |
| `src/styles/tokens.css` | **modify** — entrance tokens |
| `src/components/sections/hero/Hero.module.css` | **modify** — develop + chrome keyframes, ghost plates |
| `src/hooks/useSiteReady.ts` | **new** — resolves on fonts + a registered asset, capped |
| `src/components/sections/hero/useHeroEntrance.ts` | **new** — the single rAF loop: cruise → decelerate → scroll |
| `src/components/sections/hero/Hero.tsx` | **modify** — loses its inline effect; renders ghosts, wires refs |

`useSiteReady` knows nothing about the hero and lives in the shared hooks folder. `useHeroEntrance` is colocated with the only component that will ever use it, and owns *all* marquee motion so exactly one loop touches the offset.

---

### Task 1: Playwright harness

The repo has `playwright` (the library) but not `@playwright/test` (the runner), no config, and no tests. This task establishes the test cycle every later task depends on.

**Files:**
- Modify: `package.json`
- Create: `playwright.config.ts`
- Create: `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: nothing
- Produces: `npm run test:e2e` runs Playwright against a production build on `http://127.0.0.1:3000`. Later tasks append tests to `tests/hero-entrance.spec.ts`.

- [ ] **Step 1: Install the test runner**

```bash
npm install --save-dev @playwright/test@^1.61.1
npx playwright install chromium
```

- [ ] **Step 2: Add the config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against a production build, not `next dev` — the entrance is timing
 * sensitive and dev-mode compilation makes readiness signals meaningless.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:3000",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
```

- [ ] **Step 3: Add the npm script**

In `package.json`, add to `"scripts"`:

```json
"test:e2e": "playwright test"
```

- [ ] **Step 4: Write the smoke test**

Create `tests/hero-entrance.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

const PORTRAIT = "#hero img";

test("the hero portrait is present in the initial paint", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(PORTRAIT)).toBeVisible();
  const box = await page.locator(PORTRAIT).boundingBox();
  expect(box!.height).toBeGreaterThan(200);
});
```

- [ ] **Step 5: Run it and verify it passes**

Run: `npm run test:e2e`
Expected: 1 passed. (If the build fails, fix the build — do not weaken the test.)

- [ ] **Step 6: Ignore Playwright output**

Append to `.gitignore`:

```
/test-results/
/playwright-report/
```

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json playwright.config.ts tests/hero-entrance.spec.ts .gitignore
git commit -m "test: add Playwright harness and a hero smoke test

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Portrait develop and chrome entry (CSS only)

Pure CSS, no JavaScript. Delivers a complete, shippable half of the entrance on its own.

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/components/sections/hero/Hero.module.css`
- Modify: `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: nothing
- Produces: the CSS custom properties `--entrance-blur`, `--entrance-saturate`, `--entrance-rise`, `--entrance-chrome-rise`, `--entrance-portrait-delay`, `--entrance-chrome-delay`, `--smear-opacity-signal`, `--smear-opacity-ember`. Task 6 uses the last two.

- [ ] **Step 1: Write the failing tests**

Append to `tests/hero-entrance.spec.ts`:

```ts
test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the portrait carries no filter", async ({ page }) => {
    await page.goto("/");
    const filter = await page
      .locator(PORTRAIT)
      .evaluate((img) => getComputedStyle(img.parentElement!).filter);
    expect(filter).toBe("none");
  });
});

// `animation-fill-mode: both` holds the final keyframe, so a filter is always
// computed once the animation exists — asserting literal "none" here would be
// unreachable. Assert *unblurred* instead.
test("the portrait resolves to an unblurred state", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(
      async () => {
        const filter = await page
          .locator(PORTRAIT)
          .evaluate((img) => getComputedStyle(img.parentElement!).filter);
        return filter === "none" || /blur\(0px\)/.test(filter);
      },
      { timeout: 5000 },
    )
    .toBe(true);
});
```

- [ ] **Step 2: Run them to verify the reduced-motion one passes vacuously and both are meaningful**

Run: `npm run test:e2e`
Expected: both PASS. There is no filter yet, so these are a baseline that must
*survive* the feature rather than precede it — which is the right shape for a
reduced-motion guard. If either fails now, something else is wrong; stop and
report it.

- [ ] **Step 3: Add the entrance tokens**

In `src/styles/tokens.css`, inside the `:root` block, immediately after the `--ease-back` line:

```css
  /* ─── Hero entrance ("Settle") ─── */
  --entrance-blur: 12px;
  --entrance-saturate: 0.4;
  --entrance-rise: 2.5%;
  --entrance-chrome-rise: 8px;
  --entrance-portrait-delay: 120ms;
  --entrance-chrome-delay: 1000ms;
  --smear-opacity-signal: 0.22;
  --smear-opacity-ember: 0.18;
```

- [ ] **Step 4: Animate the portrait and chrome**

In `src/components/sections/hero/Hero.module.css`, add to the existing `.portrait` rule:

```css
  animation: hero-develop var(--duration-scene) var(--ease-out)
    var(--entrance-portrait-delay) both;
```

Add these keyframes after the `.image` rule:

```css
/* The subject resolves in place. Never masked or faded — the portrait is the
   LCP element and must be painted whole from the first frame. `filter` and
   `transform` do not remove it from paint; `opacity` and `clip-path` would. */
@keyframes hero-develop {
  from {
    filter: blur(var(--entrance-blur)) saturate(var(--entrance-saturate));
    transform: translateY(var(--entrance-rise));
  }
  to {
    filter: blur(0) saturate(1);
    transform: translateY(0);
  }
}
```

Add to the existing `.locate, .role` rule (the one that sets `position: absolute`):

```css
  animation: hero-chrome var(--duration-base) var(--ease-out)
    var(--entrance-chrome-delay) both;
```

And the keyframes:

```css
@keyframes hero-chrome {
  from {
    opacity: 0;
    transform: translateY(var(--entrance-chrome-rise));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 5: Extend the reduced-motion block**

Replace the existing block in `Hero.module.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .globe svg {
    animation: none;
  }
}
```

with:

```css
@media (prefers-reduced-motion: reduce) {
  .globe svg,
  .portrait,
  .locate,
  .role {
    animation: none;
  }
}
```

- [ ] **Step 6: Run the tests**

Run: `npm run test:e2e`
Expected: all PASS. The reduced-motion test proves the override lands at first paint; the resolve test proves the animation completes.

- [ ] **Step 7: Verify by eye**

Run: `npm run dev`, hard-reload `http://localhost:3000`. The portrait should arrive slightly soft and low, resolving over ~1.1s; the location pill and role should fade up last.

- [ ] **Step 8: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/styles/tokens.css src/components/sections/hero/Hero.module.css tests/hero-entrance.spec.ts
git commit -m "feat(hero): resolve the portrait and chrome on load

Autonomous CSS keyframes with no JS in the loop, so the initial state is
correct at first paint and the portrait still resolves if the bundle
never loads. The portrait is filtered, never masked — it is the LCP
element and must stay painted.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: `useSiteReady`

**Files:**
- Create: `src/hooks/useSiteReady.ts`
- Modify: `src/components/sections/hero/Hero.tsx`
- Modify: `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: `duration` from `@/lib/motion`
- Produces: `useSiteReady(): { ready: boolean; markAssetReady: () => void }`. Task 5 passes `ready` into `useHeroEntrance`.

- [ ] **Step 1: Write the failing test**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("the hero reports readiness within the loader cap", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('#hero[data-ready="true"]')).toBeAttached({
    timeout: 4000,
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL — `#hero[data-ready="true"]` never attaches.

- [ ] **Step 3: Write the hook**

Create `src/hooks/useSiteReady.ts`:

```ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { duration } from "@/lib/motion";

/**
 * Resolves when the page's hero-critical work has actually landed: the web
 * fonts (which the marquee must be measured against) and one caller-registered
 * asset.
 *
 * `duration.loader` is a ceiling, not a target. If either signal never arrives
 * — a decode that fails, an `onLoad` a cached image never fires — readiness is
 * declared anyway, so nothing downstream can strand.
 */
export function useSiteReady(): { ready: boolean; markAssetReady: () => void } {
  const [ready, setReady] = useState(false);
  const assetLanded = useRef(false);
  const fontsLanded = useRef(false);

  const settle = useCallback(() => {
    if (assetLanded.current && fontsLanded.current) setReady(true);
  }, []);

  const markAssetReady = useCallback(() => {
    assetLanded.current = true;
    settle();
  }, [settle]);

  useEffect(() => {
    let alive = true;

    void document.fonts.ready.then(() => {
      if (!alive) return;
      fontsLanded.current = true;
      settle();
    });

    const cap = window.setTimeout(() => {
      if (alive) setReady(true);
    }, duration.loader * 1000);

    return () => {
      alive = false;
      window.clearTimeout(cap);
    };
  }, [settle]);

  return { ready, markAssetReady };
}
```

- [ ] **Step 4: Wire it into the Hero**

In `src/components/sections/hero/Hero.tsx`, add the import:

```tsx
import { useSiteReady } from "@/hooks/useSiteReady";
```

Inside `Hero()`, add below the existing `trackRef` declaration:

```tsx
  const { ready, markAssetReady } = useSiteReady();
```

Change the opening `<section>` tag to:

```tsx
    <section id="hero" className={styles.hero} data-ready={ready ? "true" : "false"}>
```

Add `onLoad` to the `<Image>`:

```tsx
        <Image
          src="/newton-cutout-v2.webp"
          alt="Newton Frank"
          fill
          priority
          sizes="100vw"
          className={styles.image}
          onLoad={markAssetReady}
        />
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npm run test:e2e`
Expected: all PASS.

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/hooks/useSiteReady.ts src/components/sections/hero/Hero.tsx tests/hero-entrance.spec.ts
git commit -m "feat: add useSiteReady, gated on fonts and the hero portrait

Caps on duration.loader so a cached image whose onLoad never fires
cannot strand the entrance.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Extract the marquee loop into `useHeroEntrance` — no behaviour change

A pure refactor, deliberately isolated from new motion so a reviewer can reject it independently. It carries two fixes to the code it moves.

**Files:**
- Create: `src/components/sections/hero/useHeroEntrance.ts`
- Modify: `src/components/sections/hero/Hero.tsx:24-70` (delete the inline effect), `:121` (the track element)
- Modify: `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: nothing yet (the `ready` flag is wired in Task 5)
- Produces: `useHeroEntrance(containerRef: RefObject<HTMLElement | null>): void`. The hook finds its own elements via `[data-track="main"]` inside the container, so `Hero.tsx` must set that attribute.

Two fixes folded in, both required by later tasks:

1. `Hero.tsx:58` currently does `setTimeout(measure, 400)` to "re-measure once web fonts land". `document.fonts.ready` is the actual signal; the timeout is a guess.
2. `Hero.tsx:39` wraps on `scrollWidth / 2`. The strip is four identical units repeated twice, so the pattern actually repeats every **unit**. Wrapping on unit width is equally seamless, keeps the numbers an order of magnitude smaller, and is what Task 5's register lock needs.

- [ ] **Step 1: Write the failing test**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("scrolling down carries the marquee left", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(2500);
  // An untransformed element computes to "none", which the DOMMatrix
  // constructor rejects — guard before parsing.
  const read = () =>
    page.locator('[data-track="main"]').evaluate((el) => {
      const t = getComputedStyle(el).transform;
      return t === "none" ? 0 : new DOMMatrixReadOnly(t).m41;
    });
  const before = await read();
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(400);
  expect(await read()).not.toBe(before);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL — no element matches `[data-track="main"]`.

- [ ] **Step 3: Write the hook**

Create `src/components/sections/hero/useHeroEntrance.ts`:

```ts
"use client";

import { useEffect, type RefObject } from "react";

/** Marquee px per scrolled px. Unchanged from the original inline effect. */
const SCROLL_SPEED = 0.85;

/**
 * Owns every transform applied to the name marquee. There is exactly one rAF
 * loop touching the offset, so scroll-driven motion and (from Task 5) the
 * load-time settle can never disagree about position.
 *
 * Reduced motion is checked synchronously here rather than via
 * `useReducedMotion`, which returns `false` on the first render and corrects
 * after mount — enough to leak a frame of motion to someone who asked for none.
 */
export function useHeroEntrance(containerRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const main = container.querySelector<HTMLElement>('[data-track="main"]');
    if (!main) return;

    // Width of one repeated unit. The strip is identical units end to end, so
    // wrapping on this is seamless — and keeps the offset small.
    let unit = 0;
    let scrollPos = 0;
    let lastScrollY = window.scrollY;
    let frame = 0;
    let alive = true;

    const measure = () => {
      const first = main.firstElementChild as HTMLElement | null;
      unit = first?.offsetWidth ?? 0;
    };

    const paint = () => {
      const pos = unit > 0 ? ((scrollPos % unit) + unit) % unit : scrollPos;
      main.style.transform = `translate3d(${-pos}px, 0, 0)`;
    };

    const step = () => {
      frame = 0;
      if (!alive) return;
      if (!unit) measure();
      const y = window.scrollY;
      scrollPos += (y - lastScrollY) * SCROLL_SPEED;
      lastScrollY = y;
      paint();
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };

    measure();
    // The real signal for "the type has its final metrics", replacing a 400ms
    // guess. The register lock in Task 5 is wrong if this is measured early.
    void document.fonts.ready.then(() => {
      if (alive) measure();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, [containerRef]);
}
```

- [ ] **Step 4: Gut the inline effect from `Hero.tsx`**

Delete the entire `useEffect` block (`Hero.tsx:28-70`), the `trackRef` declaration, the `const reduced = useReducedMotion();` line, and the now-unused imports of `useEffect`, `useRef` (re-added below), `useReducedMotion`.

The top of the file becomes:

```tsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { hero } from "@/content/site";
import { useSiteReady } from "@/hooks/useSiteReady";
import { cn } from "@/lib/utils";
import { useHeroEntrance } from "./useHeroEntrance";
import styles from "./Hero.module.css";
```

And the body opens:

```tsx
export function Hero() {
  const marqueeRef = useRef<HTMLDivElement>(null);
  const { ready, markAssetReady } = useSiteReady();
  useHeroEntrance(marqueeRef);
```

- [ ] **Step 5: Move the refs onto the markup**

Replace the marquee block at the bottom of the JSX:

```tsx
      <div className={styles.marquee} ref={marqueeRef} aria-hidden="true">
        <div className={styles.track} data-track="main">
          {strip.map((text, i) => (
            <span key={`a${i}`} className={styles.word}>
              {text}
              <span className={styles.sep}> — </span>
            </span>
          ))}
          {strip.map((text, i) => (
            <span key={`b${i}`} className={styles.word}>
              {text}
              <span className={styles.sep}> — </span>
            </span>
          ))}
        </div>
      </div>
```

- [ ] **Step 6: Update the component's doc comment**

Replace the sentence "The portrait is `priority` — it's the LCP element." block's neighbouring marquee description so it no longer claims the offset logic lives here. Change the paragraph beginning "Immersive minimal hero" to end with:

```
 * The marquee's offset is owned entirely by `useHeroEntrance`; this component
 * only supplies the markup and the container ref.
```

- [ ] **Step 7: Run the tests**

Run: `npm run test:e2e`
Expected: all PASS, including the new scroll test and every test from Tasks 1–3.

- [ ] **Step 8: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/components/sections/hero/useHeroEntrance.ts src/components/sections/hero/Hero.tsx tests/hero-entrance.spec.ts
git commit -m "refactor(hero): move the marquee loop into useHeroEntrance

No behaviour change, two fixes: document.fonts.ready replaces a 400ms
re-measure guess, and the wrap is on unit width rather than half the
strip. Reduced motion is now read synchronously, closing a one-frame
leak that useReducedMotion's post-mount correction allowed.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: The settle — cruise, decelerate, register lock

**Files:**
- Modify: `src/components/sections/hero/useHeroEntrance.ts`
- Modify: `src/components/sections/hero/Hero.tsx`
- Modify: `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: `useSiteReady()`'s `ready` (Task 3); `duration` from `@/lib/motion`
- Produces: the signature becomes `useHeroEntrance(containerRef: RefObject<HTMLElement | null>, options: { ready: boolean }): void`. On rest the hook sets `data-marquee="rest"` on the container — Task 6's CSS keys off it.

- [ ] **Step 1: Write the failing test**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("the marquee comes to rest on a whole-unit boundary", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-marquee="rest"]')).toBeAttached({
    timeout: 6000,
  });
  const drift = await page.locator('[data-track="main"]').evaluate((track) => {
    const unit = (track.firstElementChild as HTMLElement).offsetWidth;
    const t = getComputedStyle(track).transform;
    const x = Math.abs(t === "none" ? 0 : new DOMMatrixReadOnly(t).m41);
    const phase = ((x % unit) + unit) % unit;
    return Math.min(phase, unit - phase);
  });
  expect(drift).toBeLessThan(1);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL — `[data-marquee="rest"]` never attaches.

- [ ] **Step 3: Add the entrance constants**

At the top of `useHeroEntrance.ts`, below the `SCROLL_SPEED` constant:

```ts
import { duration } from "@/lib/motion";

/** Whole marquee units travelled during the settle. Must be an integer, or
 *  the strip lands out of register and the resting frame shifts per load. */
const SETTLE_UNITS = 1;

/** Never jump-cut a warm cache; there is always a visible settle. */
const MIN_SPIN_MS = 250;

/**
 * `easeOutCubic`'s velocity at t=0 is exactly 3·distance/duration. Deriving
 * cruise speed from that makes the hand-off velocity-continuous, so the
 * marquee only ever slows down. Picking cruise independently would make it
 * visibly *accelerate* at the moment it starts to settle.
 *
 * This is the one place the JS departs from `--ease-out` (an expo curve, whose
 * ~6.9 multiplier would demand an absurd cruise speed). The CSS beats use it.
 */
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const CRUISE_UNITS_PER_SEC = (3 * SETTLE_UNITS) / duration.scene;
```

- [ ] **Step 4: Add the phase machine to the loop**

Change the hook signature and body. Replace the whole `useEffect` contents from the state declarations down to the `step` function with:

```ts
    let unit = 0;
    let entrancePos = 0; // driven by cruise / decel
    let scrollPos = 0; // driven by the wheel
    let phase: "cruise" | "decel" | "rest" = "cruise";
    let decelStart = 0;
    let startPos = 0;
    let targetPos = 0;
    let lastScrollY = window.scrollY;
    let prev = performance.now();
    const t0 = prev;
    let frame = 0;
    let alive = true;

    const measure = () => {
      const first = main.firstElementChild as HTMLElement | null;
      unit = first?.offsetWidth ?? 0;
    };

    const paint = () => {
      const total = entrancePos + scrollPos;
      const pos = unit > 0 ? ((total % unit) + unit) % unit : total;
      main.style.transform = `translate3d(${-pos}px, 0, 0)`;
    };

    const step = () => {
      frame = 0;
      if (!alive) return;
      const now = performance.now();
      // Clamped so a backgrounded tab cannot fling the marquee on return.
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      if (!unit) measure();

      // Scroll always applies. The entrance never locks the page.
      const y = window.scrollY;
      scrollPos += (y - lastScrollY) * SCROLL_SPEED;
      lastScrollY = y;

      if (phase === "cruise") {
        entrancePos += unit * CRUISE_UNITS_PER_SEC * dt;
        if (unit > 0 && readyRef.current && now - t0 >= MIN_SPIN_MS) {
          phase = "decel";
          decelStart = now;
          startPos = entrancePos;
          targetPos = entrancePos + unit * SETTLE_UNITS;
        }
      } else if (phase === "decel") {
        const t = Math.min((now - decelStart) / (duration.scene * 1000), 1);
        entrancePos = startPos + (targetPos - startPos) * easeOutCubic(t);
        if (t >= 1) {
          phase = "rest";
          entrancePos = targetPos;
          container.dataset.marquee = "rest";
        }
      }

      paint();
      // Free-running only during the entrance; at rest the scroll listener
      // schedules single frames, exactly as before.
      if (phase !== "rest") frame = requestAnimationFrame(step);
    };
```

- [ ] **Step 5: Read `ready` through a ref so it cannot restart the entrance**

Change the hook's opening to:

```ts
export function useHeroEntrance(
  containerRef: RefObject<HTMLElement | null>,
  { ready }: { ready: boolean },
): void {
  // Mirrored into a ref: `ready` flipping must not re-run the effect, which
  // would tear down a settle already in progress and start it over.
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useEffect(() => {
```

Add `useRef` to the React import. Keep the dependency array as `[containerRef]`.

- [ ] **Step 6: Kick the loop on mount**

In the same effect, replace the bare `measure();` / listener registration block's ordering so the loop starts immediately:

```ts
    measure();
    void document.fonts.ready.then(() => {
      if (alive) measure();
    });

    frame = requestAnimationFrame(step);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
```

- [ ] **Step 7: Pass `ready` from the component**

In `Hero.tsx`, change the call to:

```tsx
  useHeroEntrance(marqueeRef, { ready });
```

- [ ] **Step 8: Run the tests**

Run: `npm run test:e2e`
Expected: all PASS. The register-lock test is the one that matters — a drift over 1px means the settle is landing mid-unit and the resting frame will vary per load.

- [ ] **Step 9: Verify by eye**

Run `npm run dev` and hard-reload. The name should sweep past at speed for a beat, then slow smoothly to a stop. It must never appear to speed up as it begins slowing — if it does, `CRUISE_UNITS_PER_SEC` has been decoupled from the ease.

- [ ] **Step 10: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/components/sections/hero/useHeroEntrance.ts src/components/sections/hero/Hero.tsx tests/hero-entrance.spec.ts
git commit -m "feat(hero): the marquee settles into register on load

Cruises at constant velocity until fonts and the portrait land, then
eases one whole unit into a register-locked rest, so the name's resting
frame is identical on every load. Cruise speed is derived from the
ease's initial velocity, making the hand-off continuous.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Misregistration plates

Two tinted ghost copies trailing the main track, offset and opacity scaled by velocity. Compositor-only — transform and opacity, no filters.

**Files:**
- Modify: `src/components/sections/hero/Hero.tsx`
- Modify: `src/components/sections/hero/Hero.module.css`
- Modify: `src/components/sections/hero/useHeroEntrance.ts`
- Modify: `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: `--smear-opacity-signal` / `--smear-opacity-ember` (Task 2); `data-marquee="rest"` (Task 5)
- Produces: nothing downstream.

- [ ] **Step 1: Write the failing test**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("the plates are hidden once the marquee is at rest", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-marquee="rest"]')).toBeAttached({
    timeout: 6000,
  });
  const displays = await page
    .locator('[data-track="ghost"]')
    .evaluateAll((els) => els.map((el) => getComputedStyle(el).display));
  expect(displays).toHaveLength(2);
  expect(displays.every((d) => d === "none")).toBe(true);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test:e2e`
Expected: FAIL — expected length 2, received 0.

- [ ] **Step 3: Extract the strip markup and render the plates**

In `Hero.tsx`, replace the `strip` constant and the marquee JSX. Above the `return`:

```tsx
  // One marquee unit; rendered enough times to overflow, then the whole strip
  // is duplicated so the wrap loops seamlessly.
  const unit = hero.name.join(" — ");
  const strip = Array.from({ length: 4 }, () => unit);
  const renderStrip = (key: string) =>
    [...strip, ...strip].map((text, i) => (
      <span key={`${key}${i}`} className={styles.word}>
        {text}
        <span className={styles.sep}> — </span>
      </span>
    ));
```

And the marquee:

```tsx
      <div className={styles.marquee} ref={marqueeRef} aria-hidden="true">
        <div className={styles.ghost} data-track="ghost" data-plate="signal">
          {renderStrip("s")}
        </div>
        <div className={styles.ghost} data-track="ghost" data-plate="ember">
          {renderStrip("e")}
        </div>
        <div className={styles.track} data-track="main">
          {renderStrip("m")}
        </div>
      </div>
```

- [ ] **Step 4: Style the plates**

In `Hero.module.css`, after the `.track` rule:

```css
/* Offset-print misregistration. Two plates trail the main track while it moves
   and come into register as it stops, so the Signal/Ember duality appears for
   the length of the settle and then resolves into a single charcoal name.
   Transform and opacity only — never a blur, which on 20rem type is both
   expensive and reads foggy rather than fast. */
.ghost {
  position: absolute;
  inset-block-start: 0;
  inset-inline-start: 0;
  display: inline-flex;
  inline-size: max-content;
  white-space: nowrap;
  pointer-events: none;
  will-change: transform, opacity;
}

.ghost[data-plate="signal"] {
  color: var(--signal);
  opacity: calc(var(--smear, 0) * var(--smear-opacity-signal));
}

.ghost[data-plate="ember"] {
  color: var(--ember);
  opacity: calc(var(--smear, 0) * var(--smear-opacity-ember));
}

/* The plates inherit the tint rather than `.word`'s charcoal. */
.ghost .word,
.ghost .sep {
  color: inherit;
}

/* Once in register the plates have no job. */
[data-marquee="rest"] .ghost {
  display: none;
}
```

- [ ] **Step 5: Drive the plates from the loop**

In `useHeroEntrance.ts`, collect the ghosts after `main` is found:

```ts
    const ghosts = Array.from(
      container.querySelectorAll<HTMLElement>('[data-track="ghost"]'),
    );
```

Replace `paint()` with a version that takes the frame's travel:

```ts
    const paint = (travel: number) => {
      const total = entrancePos + scrollPos;
      const pos = unit > 0 ? ((total % unit) + unit) % unit : total;
      main.style.transform = `translate3d(${-pos}px, 0, 0)`;

      if (phase === "rest") return;

      // Normalised against cruise speed, so the smear reads the same at any
      // viewport width: full strength while cruising, fading as it settles.
      const cruisePerFrame = (unit * CRUISE_UNITS_PER_SEC) / 60;
      const smear =
        cruisePerFrame > 0 ? Math.min(1, Math.abs(travel) / cruisePerFrame) : 0;
      container.style.setProperty("--smear", smear.toFixed(3));

      ghosts.forEach((ghost, i) => {
        const trail = travel * (i + 1) * 0.5;
        ghost.style.transform = `translate3d(${-pos + trail}px, 0, 0)`;
      });
    };
```

In `step()`, track the frame's travel and pass it. Record the position before the phase machine runs and hand the delta to `paint`:

```ts
      const before = entrancePos;

      if (phase === "cruise") {
        // ... unchanged
      } else if (phase === "decel") {
        // ... unchanged
      }

      paint(entrancePos - before);
```

Replace the existing bare `paint();` call with the above.

- [ ] **Step 6: Run the tests**

Run: `npm run test:e2e`
Expected: all PASS.

- [ ] **Step 7: Verify by eye**

Run `npm run dev` and hard-reload. During the sweep the name should carry faint blue and orange edges that converge as it slows, gone entirely at rest. If they read as chromatic aberration rather than print misregistration, lower `--smear-opacity-signal` / `--smear-opacity-ember`; setting both plates to a neutral grey is the documented fallback.

- [ ] **Step 8: Confirm the portrait is still uncovered**

Append the last assertion:

```ts
test("nothing overlays the portrait", async ({ page }) => {
  await page.goto("/");
  const box = await page.locator(PORTRAIT).boundingBox();
  const inHero = await page.evaluate(
    ([x, y]) => Boolean(document.elementFromPoint(x, y)?.closest("#hero")),
    [box!.x + box!.width / 2, box!.y + box!.height / 3] as const,
  );
  expect(inHero).toBe(true);
});
```

Run: `npm run test:e2e`
Expected: all PASS.

- [ ] **Step 9: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/components/sections/hero/Hero.tsx src/components/sections/hero/Hero.module.css src/components/sections/hero/useHeroEntrance.ts tests/hero-entrance.spec.ts
git commit -m "feat(hero): add misregistration plates to the settle

Two tinted ghost tracks trail the marquee and come into register as it
stops. Transform and opacity only, hidden at rest.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Done when

- `npm run typecheck`, `npm run lint`, and `npm run test:e2e` all pass.
- A hard reload shows: the name sweeping and slowing to a stop in the same frame every time, the portrait resolving from soft to sharp, chrome arriving last.
- With reduced motion forced, the page is fully resolved at first paint and nothing moves.
- Nothing ever covers the portrait.
