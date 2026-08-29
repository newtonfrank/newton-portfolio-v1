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
