import { expect, test, type Page } from "@playwright/test";

/**
 * The design gallery renders in one of two modes and both have to hold up.
 *
 * `scene` is the WebGL card field, pinned so vertical scroll drives it
 * sideways. `rail` is the native horizontal scroller that SSR emits and that
 * every touch, reduced-motion and no-WebGL visitor keeps. The DOM piece list is
 * the *same markup* in both — clipped in scene mode, visible in rail mode — so
 * these tests exercise it either way.
 */

const PIECES = 17;

/** Scroll the section to the top of the viewport and let the pin engage. */
async function enterSection(page: Page): Promise<number> {
  const top = await page.evaluate(() => {
    const section = document.querySelector("#design")!;
    return window.scrollY + section.getBoundingClientRect().top;
  });
  await page.evaluate((y) => window.scrollTo(0, y), top);
  await page.waitForTimeout(600);
  return top;
}

test.describe("the design gallery", () => {
  test("exposes every piece as a focusable control with a real name", async ({ page }) => {
    await page.goto("/");

    const cards = page.locator("#design button[style*='aspect-ratio']");
    await expect(cards).toHaveCount(PIECES);

    // The old grid announced "Design Exploration 07". Nothing may regress to that.
    const names = await cards.evaluateAll((nodes) =>
      nodes.map((node) => node.textContent?.trim() ?? "")
    );
    expect(names.filter(Boolean)).toHaveLength(PIECES);
    expect(names.some((name) => /Design Exploration/i.test(name))).toBe(false);
    expect(names).toContain("Nike Air Jordan 1 — Mid Fire Red");
  });

  test("pins the stage and advances the counter as you scroll", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("#design");
    await expect(section).toHaveAttribute("data-mode", "scene");

    const top = await enterSection(page);

    // Not `section > div`: ScrollTrigger wraps the pinned element in its own
    // `.pin-spacer`, so the first child is the spacer — which scrolls normally
    // and would make a working pin look broken.
    const stageTop = () =>
      page.evaluate(() => {
        const stage = document.querySelector("#design .pin-spacer > div");
        return stage ? Math.round(stage.getBoundingClientRect().top) : null;
      });

    // The stage is held at the top of the viewport for the length of the runway.
    expect(await stageTop()).toBeLessThan(2);

    const counter = section.locator("[class*='counter']");
    await expect(counter).toHaveText(`01 / ${PIECES}`);

    await page.evaluate((y) => window.scrollTo(0, y + 1800), top);
    await page.waitForTimeout(600);

    expect(await stageTop()).toBeLessThan(2);
    await expect(counter).not.toHaveText(`01 / ${PIECES}`);
  });

  test("mounts a canvas only once the section is near", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#design canvas")).toHaveCount(0);

    await enterSection(page);
    await expect(page.locator("#design canvas")).toHaveCount(1, { timeout: 10_000 });
  });

  test("opens a piece, pages it, and returns focus on close", async ({ page }) => {
    await page.goto("/");
    await enterSection(page);

    // Reach the list the way a keyboard user does, not by clicking a mesh.
    const second = page.locator("#design button[style*='aspect-ratio']").nth(1);
    await second.evaluate((node: HTMLElement) => {
      node.focus();
      node.click();
    });

    const dialog = page.locator("dialog[open]");
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("[class*='counter']")).toHaveText(`02 / ${PIECES}`);

    await page.keyboard.press("ArrowRight");
    await expect(dialog.locator("[class*='counter']")).toHaveText(`03 / ${PIECES}`);

    await page.keyboard.press("Escape");
    await expect(page.locator("dialog[open]")).toHaveCount(0);
    await expect(second).toBeFocused();
  });

  test.describe("on a phone", () => {
    // A real coarse pointer, not just a narrow window: `useFinePointer` gates on
    // `(pointer: fine)` and `(hover: hover)`, which a resized desktop still
    // reports. Spelled out rather than spread from `devices[...]`, whose
    // `defaultBrowserType` cannot be set inside a describe block.
    test.use({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    });

    test("falls back to a rail that does not widen the document", async ({ page }) => {
      await page.goto("/");

      const section = page.locator("#design");
      await expect(section).toHaveAttribute("data-mode", "rail");
      await expect(page.locator("#design canvas")).toHaveCount(0);

      await expect(page.locator("#design button[style*='aspect-ratio']")).toHaveCount(PIECES);

      await page.addStyleTag({ content: "html, body { overflow-x: visible !important; }" });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
      );
      expect(overflow).toBeLessThanOrEqual(1);
    });
  });
});
