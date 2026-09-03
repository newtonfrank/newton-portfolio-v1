import { expect, test, type Page } from "@playwright/test";

/**
 * The site ships `body { overflow-x: hidden }` (styles/reset.css), which clips
 * horizontal overflow instead of surfacing it — so measuring scrollWidth as-is
 * would prove nothing. These tests neutralise that one guard and measure
 * underneath it.
 *
 * The hero's name marquee is deliberately far wider than the viewport, but it
 * carries its own `overflow: hidden` (Hero.module.css `.marquee`), so lifting
 * the body clip leaves it contained and exposes only real overflow.
 */
async function unclip(page: Page): Promise<void> {
  await page.addStyleTag({
    content: "html, body { overflow-x: visible !important; }",
  });
}

const VIEWPORTS = {
  "320 — the narrowest supported width": { width: 320, height: 568 },
  "375 — a phone": { width: 375, height: 667 },
  "768 — a tablet": { width: 768, height: 1024 },
  "844×390 — a phone held sideways": { width: 844, height: 390 },
  "1440 — the design anchor": { width: 1440, height: 900 },
} as const;

for (const [name, viewport] of Object.entries(VIEWPORTS)) {
  test.describe(name, () => {
    test.use({ viewport });

    test("the page does not scroll sideways", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator('#hero[data-ready="true"]')).toBeAttached({
        timeout: 6000,
      });
      await unclip(page);

      const overflow = await page.evaluate(() => {
        const root = document.documentElement;
        return root.scrollWidth - root.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(1);
    });
  });
}

test.describe("the hero stack on a phone", () => {
  test.use({ viewport: VIEWPORTS["375 — a phone"] });

  test("the instrument, the role and the pill do not overlap", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('#hero[data-ready="true"]')).toBeAttached({
      timeout: 6000,
    });

    const boxes = await page.evaluate(() => {
      const pick = (selector: string) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const { top, bottom, left, right } = el.getBoundingClientRect();
        return { top, bottom, left, right };
      };
      const hero = document.querySelector("#hero");
      // The chrome spans are the only two children of the chrome wrapper; the
      // instrument marks itself with a data attribute.
      const chrome = hero?.querySelectorAll(":scope > div > span") ?? [];
      return {
        instrument: pick("[data-instrument]"),
        role: chrome[0]?.getBoundingClientRect().toJSON() ?? null,
        locate: chrome[1]?.getBoundingClientRect().toJSON() ?? null,
      };
    });

    expect(boxes.instrument).not.toBeNull();
    expect(boxes.role).not.toBeNull();
    expect(boxes.locate).not.toBeNull();

    // Stacked in reading order: role, then instrument, then the pill.
    expect(boxes.role!.bottom).toBeLessThanOrEqual(boxes.instrument!.top + 1);
    expect(boxes.instrument!.bottom).toBeLessThanOrEqual(boxes.locate!.top + 1);
  });
});

test.describe("touch targets", () => {
  test.use({ viewport: VIEWPORTS["375 — a phone"] });

  test("navigation and footer controls clear 44px", async ({ page }) => {
    await page.goto("/");
    await page.locator("header button").click();

    const undersized = await page.evaluate(() => {
      const selector = "header a, header button, #menu-overlay a, footer a";
      return [...document.querySelectorAll(selector)]
        .filter((el) => {
          const { width, height } = el.getBoundingClientRect();
          return width > 0 && height > 0 && (width < 44 || height < 44);
        })
        .map((el) => {
          const { width, height } = el.getBoundingClientRect();
          return `${el.textContent?.trim().slice(0, 24)} — ${Math.round(width)}×${Math.round(height)}`;
        });
    });

    expect(undersized).toEqual([]);
  });
});

test.describe("the menu on a short screen", () => {
  test.use({ viewport: VIEWPORTS["844×390 — a phone held sideways"] });

  test("every link can be reached", async ({ page }) => {
    await page.goto("/");
    await page.locator("header button").click();

    const overlay = page.locator("#menu-overlay");
    await expect(overlay).toHaveAttribute("aria-hidden", "false");

    const last = overlay.locator("nav a").last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport();
  });

  test("the page behind the menu is frozen", async ({ page }) => {
    await page.goto("/");
    await page.locator("header button").click();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe("hidden");

    await page.keyboard.press("Escape");
    await expect(page.locator("#menu-overlay")).toHaveAttribute("aria-hidden", "true");
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).not.toBe("hidden");
  });
});
