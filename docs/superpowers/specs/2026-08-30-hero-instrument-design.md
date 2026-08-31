# Hero instrument — replacing the portrait

**Date:** 2026-08-30
**Route:** `/` (Hero section)
**Supersedes:** the cut-out portrait introduced by
`2026-07-12-hero-split-layout-design.md`, and the portrait half of
`2026-08-29-hero-entrance-settle-design.md`.

## Motivation

The page shows the design half of the work and only *asserts* the engineering
half. `WorkGrid` is posters and brand work. `ProjectList` is titles. `Capabilities`
is a list. Nothing on the site demonstrates that Newton builds real-time
interfaces — which is the strongest item on the CV (a 10-second-refresh
industrial IoT dashboard: vibration, temperature, audio).

The hero is the only place left to fix that, and it is currently spending its
whole surface on a studio portrait. So the portrait comes out and an instrument
goes in: a live, honestly-labelled readout of the page it is running on. It says
"I build real-time interfaces" by *being* one, before a word has been read.

Newton's face does not leave the site — `newton-portrait.webp` stays in the
Contact section, where a face beside "Let's work together" reads as a handshake
rather than a headshot.

## Design

### The channels

Every value is real and about the visitor. Nothing is simulated.

| Row | Source | Format | Range |
|---|---|---|---|
| `FRAME` | `requestAnimationFrame` delta | `16.7ms`, 1 decimal | fixed 0–33ms (two 60Hz budgets) |
| `CURSOR` | `pointermove` velocity | `412px/s`, integer | autoscaled to running max, floor 200 |
| `SCROLL` | `window.scrollY` delta velocity | `0px/s`, integer | autoscaled to running max, floor 200 |
| `VIEWPORT` | `resize` | `1440×900` | no trace — a value alone, closing the block |

`CURSOR` and `SCROLL` **decay exponentially toward zero when idle.** Without
that they freeze at their last value and read as broken.

The `CURSOR` row is hidden on coarse pointers via
`@media (pointer: coarse)` in CSS — not via `useFinePointer`, which returns
`false` on the server and first client render and would therefore either cause a
hydration mismatch or flash the row. A CSS media query applies at first paint.
The row is *hidden*, never faked with touch data.

### The Ember moment

The traces run `--signal`. The `FRAME` trace turns `--ember` for any segment
whose frame time exceeds **20ms** — a genuinely dropped frame at 60Hz, with
tolerance, and still a real stutter on a 120Hz display.

This is the duality doing work rather than decorating: Signal is the normal
state, Ember is the alarm. It is also honest to the point of being
self-critical — the instrument reports the page's own jank.

### Rendering

**DOM carries the text; canvas carries only the traces.** Labels and values are
real mono text — selectable, crisp, tokenised. Each row's trace is its own
`<canvas>`, sized to `devicePixelRatio` so hairlines stay sharp, kept in sync by
a `ResizeObserver` on the row.

Each channel holds a fixed **180-sample ring buffer** (≈3s at 60Hz, ≈1.5s at
120Hz — sample-count rather than time-windowed, accepted for simplicity). Newest
sample at the right; the trace scrolls right-to-left.

**Traces redraw at 60fps; the numeric readouts throttle to 8Hz (125ms).** A
number changing sixty times a second is unreadable noise — real instruments damp
their displays for this reason.

### Cost control

This is a permanent loop on a page people leave open. The loop suspends:

- when the tab is hidden (`visibilitychange`)
- when the hero leaves the viewport (`IntersectionObserver`)

Under `prefers-reduced-motion: reduce` it draws **one static frame and stops** —
no loop at all. Read synchronously via `matchMedia` inside the effect, matching
the pattern established in `useHeroEntrance`.

### Accessibility

The whole instrument is `aria-hidden="true"`. It is ambient telemetry that
updates continuously; exposing it would either be noise or, as a live region,
actively hostile. The accessible name and role already live in the
visually-hidden `h1` that the hero renders today.

### The entrance

The name marquee, the settle, the register lock, and the misregistration plates
are **untouched**. Only the beat the portrait owned changes.

Instead of a develop, the rules **draw in from the left**, staggered row by row —
a spec sheet being typeset. `clip-path: inset(0 100% 0 0)` → `inset(0 0 0 0)`
over `--duration-base`, staggered by a new `--entrance-row-stagger: 90ms`,
following the `calc(var(--i) * …)` pattern already used in `MenuOverlay`.

**A bug this must not introduce.** `useSiteReady` currently gates on
`document.fonts.ready` *and* the portrait's `onLoad` calling `markAssetReady`.
Delete the portrait and nothing ever calls it, so readiness would silently fall
through to the `duration.loader` cap on every load — a 2-second stall before the
marquee could settle, on every visit. The instrument's **first drawn frame**
becomes the new signal. Same hook, same shape, honest meaning.

### The field, and what it lets us delete

The flat `#d0d0d0` hero field existed to sit with the portrait's studio light.
With no portrait it has no reason to exist, and it makes the hero a grey island
above a bone page. The hero moves onto the page's own surface (`--ink` under
`data-theme="light"`).

That cascades: the two chrome colours in `Hero.module.css` were hard-coded
*specifically* because the grey field could not flip with the theme
(`.locate`'s `#131318` / `#f4f3ee`, and `.role`'s `#131318`). Once the hero sits
on the themed surface they become tokens. **Four of the sixteen hard-coded
colours tracked against the golden rule disappear**, in a file this work already
opens.

`app/layout.tsx`'s `viewport.themeColor` follows the field from `#d0d0d0` to
`#f4f3ee`.

Also deleted: `public/newton-cutout-v2.webp` (~200kB), the `hero-develop`
keyframes, and the four now-dead tokens `--entrance-blur`,
`--entrance-saturate`, `--entrance-rise`, and `--entrance-portrait-delay`.
`--entrance-chrome-rise` and `--entrance-chrome-delay` stay — the chrome still
fades up as the last beat.

**Considered and deliberately not done:** `.word`'s `#33363d` and `.sep`'s
`rgba(51, 54, 61, 0.5)` are also hard-coded, but they belong to the marquee,
which this work does not touch. The soft charcoal was chosen to sit *below* full
ink so the name does not compete; promoting it to `--bone` (`#14141a` under the
light theme) would be a visual change, not a refactor. It reads correctly against
the new lighter field, so it stays as-is and remains on the tracked debt list.

## Structure

| File | Responsibility |
|---|---|
| `src/components/sections/hero/Instrument.tsx` | **new** — rows, labels, values, canvas elements |
| `src/components/sections/hero/Instrument.module.css` | **new** — spec-sheet layout, draw-in, coarse-pointer rule |
| `src/components/sections/hero/useInstrument.ts` | **new** — sampler, ring buffers, canvas draw, suspension |
| `src/components/sections/hero/Hero.tsx` | portrait out, `Instrument` in |
| `src/components/sections/hero/Hero.module.css` | develop keyframes and portrait rules out; field and chrome to tokens |
| `src/styles/tokens.css` | three dead entrance tokens out; instrument tokens in |
| `src/app/layout.tsx` | `viewport.themeColor` |
| `tests/hero-entrance.spec.ts` | the two portrait tests rewritten |

`useInstrument` runs its **own** rAF loop rather than sharing `useHeroEntrance`'s.
They have different lifetimes — the entrance stops permanently at `rest`, the
instrument suspends and resumes — and merging them would tangle two unrelated
concerns inside the file that holds the register lock.

## Verification

Rewriting the two portrait-dependent tests, and adding coverage for the new
surface:

1. **Reduced motion:** the instrument's canvases have drawn (non-blank) but the
   readout values do not change across a 1s window — proving one static frame,
   no loop.
2. **Live:** with motion allowed, the `FRAME` readout changes within 1s, and
   moving the pointer changes the `CURSOR` readout — proving the data is real
   and not a canned animation.
3. **Suspension:** hiding the tab stops the readouts advancing.
4. **Rewritten:** "nothing overlays the portrait" becomes "nothing overlays the
   marquee", which is now the LCP element.
5. **Unchanged and must stay green:** the register-lock test, the settle tests,
   and the reduced-motion transform test.

## Risks

- **It reads as generic tech wallpaper.** The mitigation is the composition: full
  width spec-sheet rules with mono labels and live values inherit the hairline
  language already dividing the project rows, rather than presenting as a boxed
  dashboard widget in a page that has no other boxes. If the built result still
  reads as decoration, the documented fallback is the type-only masthead.
- **The permanent loop costs battery.** Mitigated by both suspension paths;
  reduced motion opts out entirely.
- **LCP moves to the marquee text.** This is an improvement — text with a
  preloaded font paints faster than a 200kB image — but it is a change to the
  metric the previous spec was built to protect, and should be measured, not
  assumed.

## Out of scope

The `Intro`, `ProjectList`, `WorkGrid`, `Capabilities`, `Experience`, and
`Contact` sections. The Contact portrait. Copy changes. The marquee, settle,
register lock, and plates. The remaining twelve hard-coded colours elsewhere in
the codebase.
