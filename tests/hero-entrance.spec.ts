import { expect, test } from "@playwright/test";

const PORTRAIT = "#hero img";

test("the hero portrait is present in the initial paint", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(PORTRAIT)).toBeVisible();
  const box = await page.locator(PORTRAIT).boundingBox();
  expect(box!.height).toBeGreaterThan(200);
});
