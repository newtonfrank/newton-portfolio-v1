# Hero Instrument Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's cut-out portrait with a live, honestly-labelled instrument that reads the page it is running on — frame time, cursor and scroll velocity, viewport — composed as full-width spec-sheet rules under the existing name marquee.

**Architecture:** DOM carries the text (mono labels and values, selectable and crisp); one `<canvas>` per row carries only the trace, DPR-scaled. A single `requestAnimationFrame` loop in `useInstrument` samples into fixed ring buffers, redraws traces every frame, and damps the numeric readouts to 8Hz. The loop suspends when the tab is hidden or the hero leaves the viewport, and never starts at all under reduced motion, which draws one static frame instead.

**Tech Stack:** Next 15 App Router · React 19 · TypeScript strict · CSS Modules + custom-property tokens · Canvas 2D (no libraries) · Playwright

**Spec:** `docs/superpowers/specs/2026-08-30-hero-instrument-design.md`

## Global Constraints

- **Tokens are law.** No literal colour, space, type size, duration, or easing in a CSS module. Canvas stroke colours are read from computed custom properties (`--signal`, `--ember`), never hard-coded in JS.
- **Measurement thresholds are not design tokens.** `ALARM_MS`, `WINDOW`, `READOUT_MS` and the autoscale floor live as named constants in `useInstrument.ts`. They are instrument calibration, not visual magnitudes.
- No new dependencies. Canvas 2D only — no charting library, no GSAP.
- TypeScript strict; `@typescript-eslint/no-explicit-any` enforced. **No `as any`, no eslint-disable comments.** If something does not typecheck, find the correct typed form or report the blocker.
- **Every value displayed must be real.** Nothing simulated, nothing canned. A channel with no data shows `—`, never a plausible-looking number.
- The instrument is `aria-hidden="true"` in its entirety.
- **Do not touch the marquee, the settle, the register lock, or the misregistration plates.** `useHeroEntrance.ts` is off-limits in every task of this plan.
- Import alias is `@/*` → `./src/*`.
- Commit messages end with a blank line then: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

## Verification protocol (applies to every task)

Before `npm run test:e2e`, clear port 3000 (`lsof -ti:3000 | xargs kill -9`) — the Playwright config sets `reuseExistingServer`, so a stale server silently serves an OLD bundle and returns a meaningless green. If the build errors with ENOENT on a `.nft.json` trace file, `rm -rf .next` and retry. `npm run typecheck`, `npm run lint`, `npm run build`, and the full Playwright suite must all be genuinely green. Paste real output in the report; never report success you have not observed.

## File Structure

| File | Responsibility |
|---|---|
| `src/components/sections/hero/Instrument.tsx` | **new** — the channel list and the row markup; owns `CHANNELS` |
| `src/components/sections/hero/Instrument.module.css` | **new** — spec-sheet layout, draw-in entrance, coarse-pointer rule |
| `src/components/sections/hero/useInstrument.ts` | **new** — sampling, ring buffers, canvas drawing, suspension |
| `src/components/sections/hero/Hero.tsx` | portrait out, `Instrument` in |
| `src/components/sections/hero/Hero.module.css` | portrait rules and develop keyframes out; field and chrome to tokens |
| `src/styles/tokens.css` | four dead entrance tokens out; instrument tokens in |
| `src/app/layout.tsx` | `viewport.themeColor` |
| `tests/hero-entrance.spec.ts` | portrait tests rewritten; instrument tests added |

`useInstrument` finds its elements by `data-` attribute inside a root ref — the same pattern `useHeroEntrance` uses for `[data-track]` — so the component owns markup and the hook owns behaviour, with no prop drilling of refs.

---

### Task 1: The instrument, static — swap out the portrait

One atomic change: the portrait cannot be removed without rehoming the readiness signal it carries, and the instrument cannot be added without removing the portrait, since they occupy the same slot.

**Files:**
- Create: `src/components/sections/hero/Instrument.tsx`, `src/components/sections/hero/Instrument.module.css`
- Modify: `src/components/sections/hero/Hero.tsx`, `src/components/sections/hero/Hero.module.css`, `src/styles/tokens.css`, `tests/hero-entrance.spec.ts`
- Delete: `public/newton-cutout-v2.webp`

**Interfaces:**
- Consumes: `useSiteReady()` → `{ ready, markAssetReady }`, already wired in `Hero.tsx`
- Produces: `<Instrument onFirstFrame={() => void} />`; the exported `CHANNELS` array; the DOM contract later tasks query — `[data-trace="frame"|"cursor"|"scroll"]` for canvases, `[data-value="<id>"]` for readouts, `[data-channel="<id>"]` on each row

- [ ] **Step 1: Write the failing tests**

In `tests/hero-entrance.spec.ts`, **delete** these three tests entirely (the portrait they assert on no longer exists):
- `"the hero portrait is present in the initial paint"`
- `"the portrait carries no filter"` (inside the `reduced motion` describe)
- `"the portrait resolves to an unblurred state"`

Also delete the now-unused `const PORTRAIT = "#hero img";` at the top of the file.

Keep `"the marquee track carries no transform"` inside the `reduced motion` describe — that one still applies.

Replace `"nothing overlays the portrait"` with this, and add the new instrument test:

```ts
test("nothing overlays the marquee", async ({ page }) => {
  await page.goto("/");
  const track = page.locator('[data-track="main"]');
  const box = await track.boundingBox();
  const covered = await page.evaluate(
    ([x, y]) => {
      const el = document.elementFromPoint(x, y);
      const track = document.querySelector('[data-track="main"]');
      return !(el && track && (track.contains(el) || el.contains(track)));
    },
    [box!.x + box!.width / 4, box!.y + box!.height / 2] as const,
  );
  expect(covered).toBe(false);
});

test("the instrument renders every channel", async ({ page }) => {
  await page.goto("/");
  const rows = page.locator("[data-channel]");
  await expect(rows).toHaveCount(4);
  const labels = await page.locator("[data-channel] [data-label]").allInnerTexts();
  expect(labels).toEqual(["FRAME", "CURSOR", "SCROLL", "VIEWPORT"]);
  // Three traces; VIEWPORT is a value with no trace.
  await expect(page.locator("[data-trace]")).toHaveCount(3);
});

test("the instrument is hidden from the accessibility tree", async ({ page }) => {
  await page.goto("/");
  const hidden = await page
    .locator("[data-instrument]")
    .evaluate((el) => el.getAttribute("aria-hidden"));
  expect(hidden).toBe("true");
});
```

- [ ] **Step 2: Run to verify the new tests fail**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: the two new instrument tests FAIL (no `[data-channel]` elements); everything else passes.

- [ ] **Step 3: Add the instrument tokens, remove the dead ones**

In `src/styles/tokens.css`, **delete** these four lines from the `Hero entrance ("Settle")` block — they belonged to the portrait develop, which is going away:

```css
  --entrance-blur: 12px;
  --entrance-saturate: 0.4;
  --entrance-rise: 2.5%;
  --entrance-portrait-delay: 120ms;
```

Keep `--entrance-chrome-rise`, `--entrance-chrome-delay`, `--smear-opacity-signal`, `--smear-opacity-ember`. Then add, immediately after that block:

```css
  /* ─── Hero instrument ─── */
  --instrument-row-gap: clamp(1.25rem, 3vh, 2.5rem);
  --instrument-trace-h: 1.75rem;
  --instrument-label-w: 7ch;
  --instrument-value-w: 9ch;
  --instrument-gap: var(--space-5);
  --entrance-row-stagger: 90ms;
```

- [ ] **Step 4: Write the component**

Create `src/components/sections/hero/Instrument.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useInstrument } from "./useInstrument";
import styles from "./Instrument.module.css";

export interface Channel {
  id: "frame" | "cursor" | "scroll" | "viewport";
  label: string;
  /** VIEWPORT is a value alone — it has no time series to draw. */
  trace: boolean;
}

export const CHANNELS: Channel[] = [
  { id: "frame", label: "FRAME", trace: true },
  { id: "cursor", label: "CURSOR", trace: true },
  { id: "scroll", label: "SCROLL", trace: true },
  { id: "viewport", label: "VIEWPORT", trace: false },
];

/**
 * A live readout of the page it is running on, composed as spec-sheet rules:
 * mono label at the left margin, trace across the middle, value at the right.
 *
 * Every number is real and about the visitor — nothing here is simulated. A
 * channel with no data yet reads `—` rather than a plausible-looking figure.
 *
 * `aria-hidden` in its entirety: this is ambient telemetry that updates
 * continuously, and exposing it would be noise at best and, as a live region,
 * actively hostile. The accessible name and role live in the hero's `h1`.
 */
export function Instrument({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  useInstrument(rootRef);

  // The hero's readiness signal. One frame after mount the row rules have been
  // laid out and painted, which is the honest moment to call the hero ready.
  useEffect(() => {
    if (!onFirstFrame) return;
    const id = requestAnimationFrame(() => onFirstFrame());
    return () => cancelAnimationFrame(id);
  }, [onFirstFrame]);

  return (
    <div className={styles.instrument} data-instrument ref={rootRef} aria-hidden="true">
      {CHANNELS.map((channel, i) => (
        <div
          key={channel.id}
          className={styles.row}
          data-channel={channel.id}
          style={{ ["--i" as string]: i }}
        >
          <span className={cn(styles.label, "mono")} data-label>
            {channel.label}
          </span>
          {channel.trace ? (
            <canvas className={styles.trace} data-trace={channel.id} />
          ) : (
            <span className={styles.rule} />
          )}
          <span className={cn(styles.value, "mono")} data-value={channel.id}>
            —
          </span>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Write the hook stub**

Create `src/components/sections/hero/useInstrument.ts`. Task 3 fills this in; for now it only sizes the canvases so the layout is real rather than collapsed:

```ts
"use client";

import { useEffect, type RefObject } from "react";

/**
 * Owns everything the instrument does at runtime: canvas sizing now, and from
 * Task 3 the sampling, ring buffers, drawing, and suspension.
 *
 * Finds its elements by `data-` attribute inside the root, matching the pattern
 * `useHeroEntrance` uses for `[data-track]` — the component owns the markup,
 * the hook owns the behaviour, and no refs are drilled between them.
 */
export function useInstrument(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const canvases = Array.from(root.querySelectorAll<HTMLCanvasElement>("[data-trace]"));

    // Canvases have no intrinsic size. Match the backing store to the CSS box
    // times DPR, or the hairlines render soft.
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      for (const canvas of canvases) {
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(rect.width * dpr));
        canvas.height = Math.max(1, Math.round(rect.height * dpr));
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);

    return () => observer.disconnect();
  }, [rootRef]);
}
```

- [ ] **Step 6: Write the component styles**

Create `src/components/sections/hero/Instrument.module.css`:

```css
/* Spec-sheet rules: label at the left margin, trace across the middle, value at
   the right — the same hairline language that divides the project rows, rather
   than a boxed dashboard widget in a page that has no other boxes. */
.instrument {
  position: absolute;
  inset-inline: var(--container-pad);
  top: 24%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--instrument-row-gap);
  pointer-events: none;
}

.row {
  display: grid;
  grid-template-columns: var(--instrument-label-w) 1fr var(--instrument-value-w);
  align-items: center;
  gap: var(--instrument-gap);

  /* The beat the portrait's develop used to own: the rules typeset themselves
     in from the left, one after another. */
  clip-path: inset(0 100% 0 0);
  animation: instrument-draw var(--duration-base) var(--ease-out) forwards;
  animation-delay: calc(var(--i) * var(--entrance-row-stagger));
}

@keyframes instrument-draw {
  to {
    clip-path: inset(0 0 0 0);
  }
}

.label {
  color: var(--bone-muted);
  letter-spacing: var(--ls-mono);
}

.value {
  color: var(--bone);
  text-align: end;
  font-variant-numeric: tabular-nums;
}

.trace {
  inline-size: 100%;
  block-size: var(--instrument-trace-h);
  display: block;
}

/* VIEWPORT has no series; it gets the hairline the others' traces stand in for. */
.rule {
  block-size: 1px;
  background: var(--line);
}

/* No cursor, no CURSOR row. Hidden in CSS rather than via `useFinePointer`,
   which returns false on the server and first client render and would flash the
   row in and out. A media query is correct at first paint. */
@media (pointer: coarse) {
  .row[data-channel="cursor"] {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .row {
    animation: none;
    clip-path: none;
  }
}
```

- [ ] **Step 7: Swap the portrait for the instrument in `Hero.tsx`**

Remove the `import Image from "next/image";` line and add `import { Instrument } from "./Instrument";`.

Replace this block entirely:

```tsx
      <div className={styles.portrait}>
        <Image
          src="/newton-cutout-v2.webp"
          alt="Newton Frank"
          fill
          priority
          sizes="100vw"
          className={styles.image}
          onLoad={markAssetReady}
        />
      </div>
```

with:

```tsx
      <Instrument onFirstFrame={markAssetReady} />
```

- [ ] **Step 8: Strip the portrait from `Hero.module.css`**

Delete the `.portrait` rule, the `.image` rule, the `@keyframes hero-develop` block, and the `.image` override inside the `@media (max-width: 48rem)` block at the bottom of the file.

In the `@media (prefers-reduced-motion: reduce)` block, remove `.portrait` from the selector list, leaving:

```css
@media (prefers-reduced-motion: reduce) {
  .globe svg,
  .locate,
  .role {
    animation: none;
  }
}
```

- [ ] **Step 9: Delete the unused asset**

```bash
git rm public/newton-cutout-v2.webp
```

`public/newton-portrait.webp` **stays** — the Contact section still uses it (`Contact.tsx:37`).

- [ ] **Step 10: Run the tests**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: all PASS. Confirm the register-lock and plates tests are still green — the marquee must be untouched.

- [ ] **Step 11: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add -A src/components/sections/hero src/styles/tokens.css tests/hero-entrance.spec.ts public
git commit -m "feat(hero): replace the portrait with a live instrument

The page demonstrated the design half of the work and only asserted the
engineering half. The hero is now a readout of the page it runs on,
composed as spec-sheet rules. Static in this commit; the loop lands next.

The portrait carried useSiteReady's asset signal, so the instrument's
first painted frame takes it over — without that the hero would stall to
the loader cap on every load.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Retheme the hero onto the page surface

The flat `#d0d0d0` field existed to sit with the portrait's studio light. With no portrait it makes the hero a grey island above a bone page — and it is why the chrome colours were hard-coded in the first place.

**Files:**
- Modify: `src/components/sections/hero/Hero.module.css`, `src/app/layout.tsx`, `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: nothing from Task 1 beyond the portrait already being gone
- Produces: nothing downstream

- [ ] **Step 1: Write the failing test**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("the hero shares the page surface rather than its own field", async ({ page }) => {
  await page.goto("/");
  const [hero, page_] = await page.evaluate(() => {
    const hero = document.querySelector("#hero")!;
    const wrapper = hero.closest('[data-theme="light"]')!;
    return [getComputedStyle(hero).backgroundColor, getComputedStyle(wrapper).backgroundColor];
  });
  expect(hero).toBe(page_);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: FAIL — the hero is `rgb(208, 208, 208)` and the wrapper is `rgb(244, 243, 238)`.

- [ ] **Step 3: Move the field onto the theme**

In `src/components/sections/hero/Hero.module.css`, replace the `.hero` background declaration and its comment:

```css
  /* Flat neutral field. The cut-out portrait sits on this uniform ground so the
     name reads in a single colour across the whole width. Kept a light warm grey
     (not near-white) so it sits with the portrait's warm studio light while still
     holding tone against the subject's white shirt. */
  background-color: #d0d0d0;
```

with:

```css
  /* The hero sits on the page's own surface. It had a flat grey field of its own
     while it held a studio portrait; without one, that field only made the hero
     an island above a bone page — and it was the reason the chrome below had to
     hard-code its colours to resist the theme. */
  background-color: var(--ink);
```

- [ ] **Step 4: Tokenise the chrome**

In the `.locate` rule, replace:

```css
  /* Hard-coded: the hero field is a fixed literal, so the chrome must not flip
     with the page theme tokens (which invert under data-theme="light"). */
  background: #131318;
  color: #f4f3ee;
```

with:

```css
  background: var(--bone);
  color: var(--ink);
```

In the `.role` rule, replace `color: #131318;` with `color: var(--bone);`.

- [ ] **Step 5: Follow the field with the browser chrome colour**

In `src/app/layout.tsx`, replace:

```tsx
export const viewport = {
  // Matches the hero's flat field so mobile browser chrome blends into the
  // first paint rather than banding against it.
  themeColor: "#d0d0d0",
};
```

with:

```tsx
export const viewport = {
  // Matches the light editorial surface the hero now shares, so mobile browser
  // chrome blends into the first paint rather than banding against it.
  themeColor: "#f4f3ee",
};
```

- [ ] **Step 6: Run the tests**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: all PASS.

- [ ] **Step 7: Verify by eye**

Run `npm run dev` and load the page. The hero should now flow continuously into the Intro section below with no visible seam, the location pill should still be a dark pill with light text, and the role label should still be dark.

- [ ] **Step 8: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/components/sections/hero/Hero.module.css src/app/layout.tsx tests/hero-entrance.spec.ts
git commit -m "refactor(hero): move the hero onto the page surface

Removes four hard-coded colours. The grey field existed for the portrait,
and the chrome colours were hard-coded specifically to resist the theme
flip that field imposed — once the hero sits on the themed surface, both
reasons are gone.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

Note: `.globe`'s `rgba(255, 255, 255, 0.14)` is a fifth hard-coded value in this file. It is an alpha overlay on the pill with no matching token, and inventing one is out of scope here. It stays on the tracked debt list.

---

### Task 3: `useInstrument` — live traces and readouts

**Files:**
- Modify: `src/components/sections/hero/useInstrument.ts`, `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: the DOM contract from Task 1 — `[data-trace="frame"|"cursor"|"scroll"]`, `[data-value="<id>"]`
- Produces: named constants `ALARM_MS`, `WINDOW`, `READOUT_MS` in `useInstrument.ts`; Task 4 uses `ALARM_MS`, Task 5 extends the loop's lifecycle

- [ ] **Step 1: Write the failing tests**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("the instrument reports real frame times", async ({ page }) => {
  await page.goto("/");
  const read = () => page.locator('[data-value="frame"]').innerText();
  await expect.poll(read, { timeout: 3000 }).not.toBe("—");
  const first = await read();
  await expect.poll(read, { timeout: 3000 }).not.toBe(first);
  expect(await read()).toMatch(/^\d+\.\d+ms$/);
});

test("the instrument responds to the pointer", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.locator('[data-value="cursor"]').innerText(), {
    timeout: 3000,
  }).not.toBe("—");
  await page.mouse.move(200, 300);
  await page.mouse.move(900, 500);
  await page.mouse.move(300, 700);
  await expect
    .poll(() => page.locator('[data-value="cursor"]').innerText(), { timeout: 3000 })
    .not.toBe("0px/s");
});

test("the instrument reports the real viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto("/");
  await expect(page.locator('[data-value="viewport"]')).toHaveText("1200×800");
});

Add this one **inside the existing `test.describe("reduced motion", …)` block**
alongside `"the marquee track carries no transform"` — do not open a second
describe with the same name:

```ts
  test("the instrument draws once and does not animate", async ({ page }) => {
    await page.goto("/");
    await expect.poll(() => page.locator('[data-value="frame"]').innerText(), {
      timeout: 3000,
    }).not.toBe("—");
    const first = await page.locator('[data-value="frame"]').innerText();
    await page.waitForTimeout(1000);
    expect(await page.locator('[data-value="frame"]').innerText()).toBe(first);
  });
```

- [ ] **Step 2: Run to verify they fail**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: the four new tests FAIL — every readout is stuck at `—`.

- [ ] **Step 3: Write the hook**

Replace the whole body of `src/components/sections/hero/useInstrument.ts`:

```ts
"use client";

import { useEffect, type RefObject } from "react";

/**
 * Frame time above which a sample counts as a dropped frame, in ms. A real
 * stutter at 60Hz with tolerance, and still a real one at 120Hz.
 *
 * Not a CSS token: this is instrument calibration, not a design magnitude.
 */
export const ALARM_MS = 20;

/** Samples retained per channel (~3s at 60Hz). */
export const WINDOW = 180;

/**
 * Readout refresh, ms. Traces redraw every frame, but the numbers damp to 8Hz —
 * a value changing sixty times a second is unreadable noise, which is why real
 * instruments damp their displays.
 */
export const READOUT_MS = 125;

/** Velocity channels fall back toward zero when idle, or they freeze at their
 *  last value and read as broken. Multiplier per millisecond. */
const DECAY_PER_MS = 0.994;

/** Autoscale floor for velocity channels, px/s — stops idle noise filling the
 *  trace height. */
const VELOCITY_FLOOR = 200;

/** Trace stroke width in CSS px, before DPR scaling. */
const LINE_PX = 1.25;

type TraceId = "frame" | "cursor" | "scroll";
const TRACES: TraceId[] = ["frame", "cursor", "scroll"];

interface Series {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  samples: Float32Array;
  /** Fixed ceiling (frame), or autoscaled running max (velocities). */
  fixedMax: number | null;
}

/**
 * Owns everything the instrument does at runtime: sampling the page, holding
 * the ring buffers, drawing the traces, and formatting the readouts.
 *
 * Finds its elements by `data-` attribute inside the root, matching the pattern
 * `useHeroEntrance` uses for `[data-track]` — the component owns the markup,
 * the hook owns the behaviour, and no refs are drilled between them.
 *
 * Reduced motion is read synchronously here rather than via `useReducedMotion`,
 * which returns `false` on the first render and corrects after mount — enough to
 * leak a frame of motion to someone who asked for none.
 */
export function useInstrument(rootRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const series = new Map<TraceId, Series>();
    for (const id of TRACES) {
      const canvas = root.querySelector<HTMLCanvasElement>(`[data-trace="${id}"]`);
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) continue;
      series.set(id, {
        canvas,
        ctx,
        samples: new Float32Array(WINDOW),
        fixedMax: id === "frame" ? ALARM_MS * 1.65 : null,
      });
    }

    const values = new Map<string, HTMLElement>();
    for (const el of root.querySelectorAll<HTMLElement>("[data-value]")) {
      values.set(el.dataset.value ?? "", el);
    }

    // Stroke colours come from the tokens, never from a literal in JS.
    const styles = getComputedStyle(root);
    const signal = styles.getPropertyValue("--signal").trim();

    let head = 0;
    let cursorV = 0;
    let scrollV = 0;
    let lastY = window.scrollY;
    let lastPointer: { x: number; y: number; t: number } | null = null;
    let prev = performance.now();
    let lastReadout = 0;
    let frame = 0;
    let alive = true;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      for (const s of series.values()) {
        const rect = s.canvas.getBoundingClientRect();
        s.canvas.width = Math.max(1, Math.round(rect.width * dpr));
        s.canvas.height = Math.max(1, Math.round(rect.height * dpr));
      }
      const viewport = values.get("viewport");
      if (viewport) viewport.textContent = `${window.innerWidth}×${window.innerHeight}`;
    };

    const onPointerMove = (event: PointerEvent) => {
      const now = performance.now();
      if (lastPointer) {
        const dt = now - lastPointer.t;
        if (dt > 0) {
          const dx = event.clientX - lastPointer.x;
          const dy = event.clientY - lastPointer.y;
          cursorV = (Math.hypot(dx, dy) / dt) * 1000;
        }
      }
      lastPointer = { x: event.clientX, y: event.clientY, t: now };
    };

    const scaleFor = (s: Series) => {
      if (s.fixedMax !== null) return s.fixedMax;
      let max = VELOCITY_FLOOR;
      for (const v of s.samples) if (v > max) max = v;
      return max;
    };

    const drawTrace = (s: Series) => {
      const { ctx, canvas, samples } = s;
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width;
      const h = canvas.height;
      const line = LINE_PX * dpr;
      const max = scaleFor(s);
      const stepX = w / (WINDOW - 1);
      const yOf = (v: number) =>
        h - line / 2 - (Math.min(v, max) / max) * (h - line);

      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = line;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = signal;
      ctx.beginPath();
      for (let i = 0; i < WINDOW; i++) {
        // Oldest sample at the left, newest at the right.
        const v = samples[(head + i) % WINDOW];
        const x = i * stepX;
        if (i === 0) ctx.moveTo(x, yOf(v));
        else ctx.lineTo(x, yOf(v));
      }
      ctx.stroke();
    };

    const writeReadouts = () => {
      const frameEl = values.get("frame");
      const cursorEl = values.get("cursor");
      const scrollEl = values.get("scroll");
      const frameSeries = series.get("frame");
      if (frameEl && frameSeries) {
        const latest = frameSeries.samples[(head - 1 + WINDOW) % WINDOW];
        frameEl.textContent = `${latest.toFixed(1)}ms`;
      }
      if (cursorEl) cursorEl.textContent = `${Math.round(cursorV)}px/s`;
      if (scrollEl) scrollEl.textContent = `${Math.round(scrollV)}px/s`;
    };

    const sample = (dt: number) => {
      const y = window.scrollY;
      if (dt > 0) scrollV = (Math.abs(y - lastY) / dt) * 1000;
      lastY = y;

      const decay = Math.pow(DECAY_PER_MS, dt);
      cursorV *= decay;
      scrollV *= decay;

      series.get("frame")!.samples[head] = dt;
      series.get("cursor")!.samples[head] = cursorV;
      series.get("scroll")!.samples[head] = scrollV;
      head = (head + 1) % WINDOW;
    };

    const step = () => {
      if (!alive) return;
      const now = performance.now();
      // Clamped so a backgrounded tab cannot spike the frame trace on return.
      const dt = Math.min(now - prev, 100);
      prev = now;

      sample(dt);
      for (const s of series.values()) drawTrace(s);
      if (now - lastReadout >= READOUT_MS) {
        writeReadouts();
        lastReadout = now;
      }
      frame = requestAnimationFrame(step);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    window.addEventListener("resize", resize);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // One honest frame, then nothing. No loop, no pointer listener.
      sample(1000 / 60);
      for (const s of series.values()) drawTrace(s);
      writeReadouts();
      return () => {
        observer.disconnect();
        window.removeEventListener("resize", resize);
      };
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(step);

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [rootRef]);
}
```

- [ ] **Step 4: Run the tests**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: all PASS.

- [ ] **Step 5: Verify by eye**

Run `npm run dev`. `FRAME` should hover near `16.7ms`, its trace nearly flat. Moving the mouse should spike `CURSOR` and its trace; stopping should let it fall smoothly back toward `0px/s` rather than freezing. Scrolling should spike `SCROLL`. The numbers must be readable — if they flicker illegibly, `READOUT_MS` is not being honoured.

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/components/sections/hero/useInstrument.ts tests/hero-entrance.spec.ts
git commit -m "feat(hero): make the instrument live

Samples frame time, pointer and scroll velocity into fixed ring buffers,
redraws traces every frame, and damps the readouts to 8Hz because a
number changing sixty times a second is unreadable.

Velocity channels decay toward zero when idle rather than freezing at
their last value. Under reduced motion the loop never starts: one honest
frame is drawn and that is all.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: The Ember alarm

The one Ember moment: the frame trace reports the page's own jank, in the brand's alarm colour.

**Files:**
- Modify: `src/components/sections/hero/useInstrument.ts`, `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: `ALARM_MS`, the `Series` shape, and `drawTrace` from Task 3
- Produces: `data-alarm="true"` on `[data-channel="frame"]` while the window holds an over-budget sample

- [ ] **Step 1: Write the failing test**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("the frame channel raises an alarm on real jank", async ({ page }) => {
  await page.goto("/");
  const row = page.locator('[data-channel="frame"]');
  await expect.poll(() => row.getAttribute("data-alarm"), { timeout: 3000 }).toBe(null);

  // Block the main thread long enough to guarantee a dropped frame.
  await page.evaluate(() => {
    const until = performance.now() + 120;
    while (performance.now() < until) {
      /* deliberate jank */
    }
  });

  await expect.poll(() => row.getAttribute("data-alarm"), { timeout: 3000 }).toBe("true");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: FAIL — `data-alarm` is never set.

- [ ] **Step 3: Give each series its row and its ember colour**

In `useInstrument.ts`, extend the `Series` interface with a `row` field:

```ts
interface Series {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  row: HTMLElement | null;
  samples: Float32Array;
  /** Fixed ceiling (frame), or autoscaled running max (velocities). */
  fixedMax: number | null;
}
```

and populate it in the setup loop, alongside the existing fields:

```ts
      series.set(id, {
        canvas,
        ctx,
        row: root.querySelector<HTMLElement>(`[data-channel="${id}"]`),
        samples: new Float32Array(WINDOW),
        fixedMax: id === "frame" ? ALARM_MS * 1.65 : null,
      });
```

Read the ember token next to the signal one:

```ts
    const signal = styles.getPropertyValue("--signal").trim();
    const ember = styles.getPropertyValue("--ember").trim();
```

- [ ] **Step 4: Overstroke the over-budget segments**

At the end of `drawTrace`, after the existing `ctx.stroke();`, add:

```ts
      if (s.fixedMax === null) return;

      // The frame channel is the only one with a budget to blow. Redraw just the
      // segments that exceeded it in the alarm colour, and flag the row so the
      // condition is observable without reading pixels.
      let alarming = false;
      ctx.strokeStyle = ember;
      for (let i = 1; i < WINDOW; i++) {
        const a = samples[(head + i - 1) % WINDOW];
        const b = samples[(head + i) % WINDOW];
        if (a < ALARM_MS && b < ALARM_MS) continue;
        alarming = true;
        ctx.beginPath();
        ctx.moveTo((i - 1) * stepX, yOf(a));
        ctx.lineTo(i * stepX, yOf(b));
        ctx.stroke();
      }
      if (s.row) {
        if (alarming) s.row.dataset.alarm = "true";
        else delete s.row.dataset.alarm;
      }
```

- [ ] **Step 5: Run the tests**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: all PASS.

- [ ] **Step 6: Verify by eye**

Run `npm run dev`, open devtools, and scroll hard or throttle the CPU. The `FRAME` trace should show orange spikes where frames were dropped, clearing back to blue as the window advances.

- [ ] **Step 7: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/components/sections/hero/useInstrument.ts tests/hero-entrance.spec.ts
git commit -m "feat(hero): flag dropped frames in the alarm colour

The frame trace turns Ember for any segment over the 20ms budget, so the
duality reports real jank rather than decorating. The row carries
data-alarm alongside it, which makes the condition observable without
sampling canvas pixels.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Suspend when nobody is looking

A permanent 60fps loop on a page people leave open is a battery cost with no upside once the hero is off screen.

**Note on the test:** the spec calls for asserting that *hiding the tab* stops the
readouts. Playwright cannot reliably background a tab, so the test drives the
`IntersectionObserver` path instead by scrolling the hero away. Both gates feed
the same `sync()` function, so this covers the suspension logic; the
`visibilitychange` listener itself is verified by eye in Step 5.

**Files:**
- Modify: `src/components/sections/hero/useInstrument.ts`, `tests/hero-entrance.spec.ts`

**Interfaces:**
- Consumes: the loop and its `frame` / `alive` handles from Task 3
- Produces: nothing downstream

- [ ] **Step 1: Write the failing test**

Append to `tests/hero-entrance.spec.ts`:

```ts
test("the instrument suspends when the hero scrolls away", async ({ page }) => {
  await page.goto("/");
  await expect.poll(() => page.locator('[data-value="frame"]').innerText(), {
    timeout: 3000,
  }).not.toBe("—");

  // Well past the hero, so the IntersectionObserver has certainly fired.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
  await page.waitForTimeout(600);

  const first = await page.locator('[data-value="frame"]').innerText();
  await page.waitForTimeout(800);
  expect(await page.locator('[data-value="frame"]').innerText()).toBe(first);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: FAIL — the readout keeps advancing off screen.

- [ ] **Step 3: Add the suspension gates**

In `useInstrument.ts`, replace the block that starts the loop:

```ts
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(step);

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
```

with:

```ts
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // A permanent 60fps loop on a page people leave open is a battery cost with
    // no upside once nobody can see it.
    let onScreen = true;
    const wanted = () => onScreen && document.visibilityState === "visible";

    const sync = () => {
      if (!alive) return;
      if (wanted() && !frame) {
        // Reset the clock, or the first frame back reports the whole gap.
        prev = performance.now();
        frame = requestAnimationFrame(step);
      } else if (!wanted() && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };

    const visible = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    visible.observe(root);
    document.addEventListener("visibilitychange", sync);

    sync();

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      visible.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
```

Then, in `step()`, replace the tail `frame = requestAnimationFrame(step);` with:

```ts
      frame = wanted() ? requestAnimationFrame(step) : 0;
```

so a suspension that lands mid-frame does not immediately reschedule.

- [ ] **Step 4: Run the tests**

Run: `lsof -ti:3000 | xargs kill -9; npm run test:e2e`
Expected: all PASS. In particular the Task 3 liveness tests must still pass — they run with the hero on screen and the tab visible.

- [ ] **Step 5: Verify by eye**

Run `npm run dev` with devtools' Performance monitor open. Scrolling the hero out of view should drop the page to near-zero scripting; scrolling back should resume it, and the `FRAME` readout must not spike to the length of the gap on the first frame back.

- [ ] **Step 6: Typecheck, lint, commit**

```bash
npm run typecheck && npm run lint
git add src/components/sections/hero/useInstrument.ts tests/hero-entrance.spec.ts
git commit -m "perf(hero): suspend the instrument when nobody is looking

The loop stops when the tab is hidden or the hero leaves the viewport,
and resets its clock on resume so the first frame back does not report
the whole gap as one enormous frame time.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Done when

- `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:e2e` all pass.
- The hero shows four spec-sheet rules that flow into the page with no seam, the name marquee still sweeps and settles into register, and the plates still appear and clear.
- `FRAME` sits near 16.7ms and turns orange on real jank; `CURSOR` and `SCROLL` respond to the visitor and decay back to zero.
- Under reduced motion the rules are drawn once and nothing moves.
- Scrolling away or hiding the tab stops the loop.
