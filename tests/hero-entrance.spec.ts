import { expect, test } from "@playwright/test";

test.describe("reduced motion", () => {
  // `reducedMotion` is not a top-level test option in @playwright/test 1.62.1;
  // it lives on the browser context.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the marquee track carries no transform", async ({ page }) => {
    await page.goto("/");
    const transform = await page
      .locator('[data-track="main"]')
      .evaluate((track) => getComputedStyle(track).transform);
    expect(transform).toBe("none");
  });

  test("the instrument draws once and does not animate", async ({ page }) => {
    await page.goto("/");
    await expect
      .poll(() => page.locator('[data-value="frame"]').innerText(), {
        timeout: 3000,
      })
      .not.toBe("—");
    const first = await page.locator('[data-value="frame"]').innerText();
    await page.waitForTimeout(1000);
    expect(await page.locator('[data-value="frame"]').innerText()).toBe(first);
  });
});

test("the hero reports readiness within the loader cap", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('#hero[data-ready="true"]')).toBeAttached({
    timeout: 4000,
  });
});

test("scrolling down carries the marquee left", async ({ page }) => {
  await page.goto("/");
  // Wait for the entrance to finish before measuring scroll-driven movement;
  // otherwise the transform could still be changing from the settle itself,
  // and the assertion below would prove nothing.
  await expect(page.locator('[data-marquee="rest"]')).toBeAttached({
    timeout: 6000,
  });
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

// Sample the marquee's clipped WRAPPER, not the track: the track is
// `max-content` wide and overflows the viewport by roughly an order of
// magnitude, so a point derived from its own box lands off-screen and
// `elementFromPoint` returns null there.
test("nothing overlays the marquee", async ({ page }) => {
  await page.goto("/");
  const covered = await page.evaluate(() => {
    const track = document.querySelector('[data-track="main"]');
    const wrapper = track?.parentElement;
    if (!wrapper) return true;
    const box = wrapper.getBoundingClientRect();
    const el = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return !(el && (wrapper.contains(el) || el.contains(wrapper)));
  });
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

test("the hero shares the page surface rather than its own field", async ({ page }) => {
  await page.goto("/");
  const [hero, page_] = await page.evaluate(() => {
    const hero = document.querySelector("#hero")!;
    const wrapper = hero.closest('[data-theme="light"]')!;
    return [getComputedStyle(hero).backgroundColor, getComputedStyle(wrapper).backgroundColor];
  });
  expect(hero).toBe(page_);
});

// FRAME gets a FORMAT assertion only. At a steady 60fps `dt.toFixed(1)` is
// "16.7ms" frame after frame, so "the readout changed" is not a property this
// channel reliably has — asserting it would be flaky by construction.
test("the instrument reports real frame times", async ({ page }) => {
  await page.goto("/");
  const read = () => page.locator('[data-value="frame"]').innerText();
  await expect.poll(read, { timeout: 3000 }).not.toBe("—");
  expect(await read()).toMatch(/^\d+\.\d+ms$/);
});

// Liveness lives here instead: scrolling drives a deterministic 0 → hundreds
// transition, and all three readouts are written by the same loop, so a dead
// loop fails this too.
test("the instrument tracks scroll velocity", async ({ page }) => {
  await page.goto("/");
  const read = () => page.locator('[data-value="scroll"]').innerText();
  await expect.poll(read, { timeout: 3000 }).toBe("0px/s");
  await page.evaluate(() => window.scrollBy(0, 400));
  await expect.poll(read, { timeout: 2000 }).not.toBe("0px/s");
});

test("the instrument responds to the pointer", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(() => page.locator('[data-value="cursor"]').innerText(), {
      timeout: 3000,
    })
    .not.toBe("—");
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

test("the frame channel raises an alarm on real jank, then clears", async ({ page }) => {
  test.setTimeout(30_000);
  await page.goto("/");
  const row = page.locator('[data-channel="frame"]');
  await expect
    .poll(() => page.locator('[data-value="frame"]').innerText(), {
      timeout: 3000,
    })
    .not.toBe("—");

  // Block the main thread long enough to guarantee a dropped frame.
  await page.evaluate(() => {
    const until = performance.now() + 120;
    while (performance.now() < until) {
      /* deliberate jank */
    }
  });

  await expect.poll(() => row.getAttribute("data-alarm"), { timeout: 3000 }).toBe("true");

  // Once the ring buffer has advanced past the jank the alarm must clear on its
  // own — proving it tracks a moving window rather than latching forever.
  await expect.poll(() => row.getAttribute("data-alarm"), { timeout: 12_000 }).toBe(null);
});

test("the instrument suspends when the hero scrolls away", async ({ page }) => {
  await page.goto("/");
  await expect
    .poll(() => page.locator('[data-value="frame"]').innerText(), {
      timeout: 3000,
    })
    .not.toBe("—");

  // Well past the hero, so the IntersectionObserver has certainly fired.
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
  await page.waitForTimeout(600);

  // FRAME is unusable here: at a steady 60fps `dt.toFixed(1)` prints "16.7ms"
  // frame after frame, so an unchanged FRAME readout is not proof the loop
  // stopped — a still-running loop would pass just as easily. SCROLL doesn't
  // have that problem: scrolling again after suspension has settled drives a
  // real, measurable delta that only a running loop can report.
  const first = await page.locator('[data-value="scroll"]').innerText();
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(800);
  expect(await page.locator('[data-value="scroll"]').innerText()).toBe(first);
});
