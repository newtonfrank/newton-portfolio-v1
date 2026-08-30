import { expect, test } from "@playwright/test";

const PORTRAIT = "#hero img";

test("the hero portrait is present in the initial paint", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(PORTRAIT)).toBeVisible();
  const box = await page.locator(PORTRAIT).boundingBox();
  expect(box!.height).toBeGreaterThan(200);
});

test.describe("reduced motion", () => {
  // `reducedMotion` is not a top-level test option in @playwright/test 1.62.1;
  // it lives on the browser context.
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("the portrait carries no filter", async ({ page }) => {
    await page.goto("/");
    const filter = await page
      .locator(PORTRAIT)
      .evaluate((img) => getComputedStyle(img.parentElement!).filter);
    expect(filter).toBe("none");
  });

  test("the marquee track carries no transform", async ({ page }) => {
    await page.goto("/");
    const transform = await page
      .locator('[data-track="main"]')
      .evaluate((track) => getComputedStyle(track).transform);
    expect(transform).toBe("none");
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
      { timeout: 5000 }
    )
    .toBe(true);
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

test("nothing overlays the portrait", async ({ page }) => {
  await page.goto("/");
  const box = await page.locator(PORTRAIT).boundingBox();
  // Sample the upper third: the marquee legitimately overlaps the lower part
  // of the portrait, but nothing should cover the LCP element up here.
  const point = [box!.x + box!.width / 2, box!.y + box!.height / 3] as const;
  const unobstructed = await page.locator(PORTRAIT).evaluate((img, [x, y]) => {
    const el = document.elementFromPoint(x, y);
    if (!el) return false;
    return el === img || img.contains(el) || el.contains(img);
  }, point);
  expect(unobstructed).toBe(true);
});
