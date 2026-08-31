# 01 · Research Report
### Portfolio Audit, Reference Analysis & Competitive Comparison

> Basis of analysis: frame-by-frame study of the two uploaded screen recordings —
> **Newton Frank · The Nexus** (your current portfolio, ~29s) and
> **Anderson Mancini · Creative Developer / Three.js Expert** (~67s) — plus a
> grounded review of **Dennis Snellenberg's** live site (`dennissnellenberg.com`),
> since his video did not arrive in the upload. Where a claim comes from the live
> site rather than a video, it is marked *[live site]*.

---

## Part A — Existing Portfolio Audit: *The Nexus*

### A.1 What the site currently is

A single-page, dark-themed developer/designer portfolio built around a "Nexus"
concept. Near-black background, high-contrast white type, one accent, large bold
display headings, and a conventional top-to-bottom section stack: hero → intro/
statement → work/projects → skills → contact/footer. It reads as **competent and
clean**, but it currently sits in the large family of "dark-mode dev portfolios"
that look broadly similar to one another. The craft is there; the *distinctiveness*
and *motion identity* are not yet.

### A.2 Dimension-by-dimension evaluation

| Dimension | Observation | Verdict |
|---|---|---|
| **Visual design** | Dark base, single accent, big grotesque headings, generous type sizes. Coherent but familiar; little that couldn't be a template. | ★★★☆☆ |
| **Information architecture** | Standard linear scroll. Sections are legible but undifferentiated — every section is "a heading + content on the same dark plane." | ★★★☆☆ |
| **Typography** | Strong display sizes, but a single visual voice. No editorial contrast, no monospace/technical texture, hierarchy carried mostly by size alone. | ★★★☆☆ |
| **Color palette** | Near-black + white + one accent. Safe. No warm/cool tension, no surface layering to create depth. | ★★☆☆☆ |
| **Components** | Functional cards/list, nav, buttons. Little sign of a reusable system — spacing and treatments look bespoke per section. | ★★★☆☆ |
| **Animations** | Scroll reveals and fades present. Serviceable but generic; timing/easing feels default rather than authored. No signature motion. | ★★☆☆☆ |
| **UX** | Easy to follow, nothing confusing. Also nothing memorable — low "moment" density. | ★★★☆☆ |
| **Navigation** | Wordmark + links, standard. No overlay menu drama, no state-rich transitions between areas. | ★★★☆☆ |
| **Responsiveness** | Recording is desktop only — mobile behavior unverified (flagged as a gap). | ? |
| **Performance** | Can't measure from video, but the light DOM/no-heavy-WebGL approach likely performs fine. This is an asset to *preserve*. | ★★★★☆ (assumed) |
| **Branding** | "Nexus" is a good hook but currently expressed mostly through *naming*, not through a visual system that embodies "a nexus." | ★★☆☆☆ |
| **Storytelling** | The site presents facts (role, work, skills) but doesn't build a narrative arc or a point of view. | ★★☆☆☆ |
| **Developer credibility** | Implied by the "developer" label and the fact it's a custom build, but not *demonstrated* — no visible depth on systems, engineering, or technical craft. | ★★☆☆☆ |
| **Designer credibility** | Same — the layout is clean, but there's no showcase of design thinking, process, or interaction craft that proves the "designer" half. | ★★☆☆☆ |

### A.3 Strengths (keep these)

1. **Restraint and legibility.** It never becomes noisy. That's a real asset —
   the redesign should add richness without losing this.
2. **A memorable concept name.** "The Nexus" is ownable. Most portfolios are
   "Firstname Lastname." You have a brand hook; it's just underused.
3. **Confident type scale.** You're already comfortable with large display type —
   the redesign leans *into* that rather than teaching it from scratch.
4. **Presumed light performance footprint.** No heavyweight effects means a fast
   baseline to protect as WebGL is introduced.

### A.4 Weaknesses

1. **Undifferentiated visual language.** Reads as one of many dark dev templates.
2. **Single typographic voice.** Hierarchy = size only; no editorial or technical
   contrast.
3. **Flat color system.** No surface layering, no warm/cool tension, no depth.
4. **Generic motion.** Reveals feel default; no authored easing or signature
   moment.
5. **Concept not carried through.** "Nexus" lives in the name, not the pixels.
6. **Dual identity unexpressed.** "Developer × Designer" is claimed, not staged —
   nothing visually encodes the duality.

### A.5 Missed opportunities

- No **WebGL/3D signature** — the single most powerful differentiator available to
  a "developer × designer," and the exact thing the Anderson reference exploits.
- No **case-study depth** — projects appear as cards/links, not as stories that
  prove capability.
- No **"playground"/experiments** area — the natural place for a creative dev to
  show range and prove the "developer" claim.
- No **custom cursor / magnetic interactions** — cheap-to-add signals of craft.
- No **authored loading experience** — a missed first-impression beat.
- No **process / point of view** — nothing that makes *you* legible as a person.

### A.6 UX issues

- Low moment-density: the scroll is smooth but "even," with no peaks to remember.
- Sections lack transitional identity — you always know you're on "the dark page,"
  never that you've *entered a new space*.
- Navigation gives no spatial model of the site (where am I / what else is here).

### A.7 Technical issues (inferred — to verify in repo)

- Motion appears CSS/library-default rather than centrally tokenized (no evidence
  of a shared easing/duration system).
- No visible smooth-scroll layer (the reference sites both use one).
- Mobile behavior unverified — must be validated and, likely, rebuilt with intent.

### A.8 Visual inconsistencies to watch

- Section rhythm (vertical spacing) looks eyeballed rather than gridded.
- Emphasis relies almost entirely on scale; weight, color, and mono-texture are
  unused levers.

---

## Part B — Reference Analysis

### B.1 Anderson Mancini — *Creative Developer & Three.js Expert*  *(from video)*

**One-line read:** a **cinematic, WebGL-first** portfolio where 3D is the identity,
not decoration — deliberate pacing, scene-like transitions, and a strong personal
brand.

| Element | What it does | Why it works |
|---|---|---|
| **Hero** | Large stylized name/title over a live WebGL background (particles/shader field). Immediately signals "I build the thing this site is made of." | The medium *is* the proof. A Three.js expert opening on Three.js is self-evidencing — no "I know WebGL" claim needed. |
| **Navigation** | Minimal, gets out of the way; the 3D and type carry attention. | Lets the spectacle breathe; nav as utility, not ornament. |
| **Layout system** | Big negative space, few elements per view, large type anchored to a clear grid. | Cinematic framing — each screen is *composed*, so it feels authored, not assembled. |
| **Typography** | Restrained families, large display sizes, high contrast against dark. | Type stays "quiet" so motion and 3D can be "loud" — a deliberate hierarchy of attention. |
| **White space** | Generous, intentional, load-bearing. | Space signals confidence and premium positioning; it also gives the eye rest between motion beats. |
| **Motion principles** | Slow, weighted, eased entrances; nothing snappy or "UI-fast." Movement feels physical. | Weight = quality. Cinematic timing (600–1200ms, expo/quart easing) reads as craft; fast defaults read as template. |
| **Scroll animations** | Scroll drives reveals and 3D state — camera/displacement/opacity respond to position. | Scroll becomes a *narrative timeline*, not just pagination. The user "plays" the story by scrolling. |
| **Scene transitions** | Sections change like scene cuts — masks, scaling, morphs — not plain fades. | Creates the sense of *moving through spaces*, dramatically raising moment-density. |
| **Three.js / WebGL** | Point clouds / shader fields / distortion reacting to the pointer; a coherent visual world. | It's the differentiator and the credibility, fused. This is the lesson to steal (in spirit, not in form). |
| **Interactive elements** | Pointer-reactive 3D, hover states with feedback, likely a custom cursor. | Interactivity everywhere makes the site feel *alive* and responsive to *you*. |
| **Project showcase** | Large imagery with smooth reveal/hover; work framed as feature moments. | Fewer, bigger, better — quality over quantity signals seniority. |
| **About** | Personal, integrated into the visual world rather than a plain bio block. | Keeps the crafted atmosphere continuous; the person stays inside the brand. |
| **Contact / Footer** | Strong closing CTA, large type, on-brand. | Ends on a peak and a clear next step. |
| **Mobile** | Not shown in the recording (desktop capture). | (Assume graceful degradation of 3D is required, not optional.) |

**Transferable lessons:** (1) make WebGL your *identity*, not an effect; (2) slow,
weighted motion reads as craft; (3) transitions should feel like *entering spaces*;
(4) compose every screen; (5) fewer, larger, better.

### B.2 Dennis Snellenberg — *Freelance Designer & Developer*  *[live site]*

**One-line read:** **minimal, editorial, buttery-smooth.** Black-and-white
restraint, huge type, immaculate micro-interactions, and storytelling through work.

His site positions the intersection itself as the value:
*[live site]* — <cite index="1-1">the combination of passion for design, code
& interaction places him in a unique place in the web design world</cite>, with
a simple **Work · About · Contact · Menu** structure and projects listed as
**Design & Development** entries by year.

| Element | What it does | Why it works |
|---|---|---|
| **Hero** | Large type, minimal chrome, immediate name + positioning statement. | Confidence through subtraction; the type *is* the design. |
| **Navigation** | Work / About / Contact + a **Menu** overlay. | Tiny surface, big transitions — the menu becomes a designed moment. |
| **Layout system** | Strict grid, black & white, large-type editorial composition. | Reads like a design magazine — instantly signals "designer." |
| **White space** | Vast and deliberate. | Premium, calm, and lets each project breathe. |
| **Motion principles** | Smooth, refined micro-animations; parallax; weighted transitions. | *[live site]* Built with <cite index="3-1">GSAP, Barba.js and Locomotive Scroll for micro-animations, parallax and transitions</cite> — every interaction feels considered. |
| **Scroll** | Locomotive/Lenis smooth scroll with parallax layers. | The "buttery" feel is a signature; it makes the whole site feel expensive. |
| **Page transitions** | Barba.js route transitions — no hard reloads; content animates in/out. | The site feels like *one continuous surface*, a key premium tell. |
| **Project showcase** | Work list with rollover image reveals; projects as case studies. | *[live site]* <cite index="2-1">Clean, minimal rollover</cite> interactions turn a list into an experience. |
| **About** | Personal narrative + credibility (Awwwards judge, client roster). | Story + proof; positions him, not just his pixels. |
| **Contact / Footer** | Clear, warm, on-brand close. | Frictionless next step. |
| **Palette** | *[live site]* Predominantly <cite index="9-1">#000, #fff, with a warm accent</cite>. | Monochrome + one warm note = timeless and distinctive at once. |

**Transferable lessons:** (1) restraint and huge type read as *designer*; (2)
smooth scroll + page transitions make a site feel premium; (3) turn lists into
interactions (rollover reveals); (4) tell a story and show proof; (5) one warm
accent against monochrome goes a long way.

---

## Part C — Competitive Comparison

**Legend:** ●●●●● strong · ●●●○○ moderate · ●○○○○ weak. "Nexus (now)" =
your current site; "Nexus (target)" = where the redesign aims.

| Axis | Anderson Mancini | Dennis Snellenberg | **Nexus (now)** | **Nexus (target)** |
|---|---|---|---|---|
| **Layout craft** | ●●●●○ cinematic framing | ●●●●● editorial grid | ●●●○○ standard stack | ●●●●● composed, grid-driven |
| **Motion** | ●●●●● weighted, scene-based | ●●●●● smooth, micro-detailed | ●●○○○ generic reveals | ●●●●● authored + tokenized |
| **Branding** | ●●●●○ 3D-world identity | ●●●●○ monochrome signature | ●●○○○ name only | ●●●●● duality-driven system |
| **Personality** | ●●●●○ | ●●●●● | ●●○○○ | ●●●●○ |
| **Developer positioning** | ●●●●● (WebGL = proof) | ●●●●○ (build quality) | ●●○○○ (claimed) | ●●●●● (WebGL + playground + case depth) |
| **Designer positioning** | ●●●○○ | ●●●●● (editorial) | ●●○○○ | ●●●●○ (editorial + interaction craft) |
| **Performance** | ●●●○○ (heavy 3D cost) | ●●●●○ | ●●●●○ (light) | ●●●●○ (fast *with* 3D via budgets) |
| **Accessibility** | ●●○○○ (motion/3D risk) | ●●●○○ | ●●●○○ | ●●●●○ (reduced-motion, semantic, AA) |
| **User engagement** | ●●●●● | ●●●●○ | ●●○○○ | ●●●●● |
| **Technical complexity** | ●●●●● | ●●●●○ | ●●○○○ | ●●●●○ (ambitious but budgeted) |

### C.1 Reading of the comparison

- **Anderson** wins on spectacle and developer proof but pays in performance/a11y.
- **Dennis** wins on taste, editorial design, and smoothness with a lighter cost.
- **Your target should be the synthesis neither fully occupies:** Dennis's
  editorial restraint and buttery motion, *plus* Anderson's WebGL identity and
  developer proof — held together by a concept (the "nexus" of design and code)
  that is genuinely yours, and kept fast and accessible by explicit budgets.

### C.2 The strategic gap to own

Anderson is "the 3D guy." Dennis is "the taste guy." **The Nexus can be "the
intersection" — the person who proves both halves and makes the *meeting point*
the whole brand.** That positioning is defensible, on-brand with your existing
name, and not crowded. The rest of this package builds toward it.

---

*Next: `02-STRATEGY.md` — redesign strategy, full site architecture, and UX flow.*
