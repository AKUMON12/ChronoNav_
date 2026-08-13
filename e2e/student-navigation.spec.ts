import { test, expect } from "@playwright/test";

test.describe("ChronoNav Student Navigation E2E Flow", () => {
  test("should allow student login, navigate to map, and render Dijkstra path", async ({ page }) => {
    // 1. Visit Login Page
    await page.goto("/login");
    await expect(page).toHaveTitle(/ChronoNav/i);

    // 2. Click 1-Click Demo Student Fill & Submit
    await page.click("button:has-text('Student')");
    await page.click("button[type='submit']");

    // 3. Navigate to Interactive SVG Map
    await page.goto("/map");
    await expect(page.locator("h1")).toContainText("ChronoNav Map");

    // 4. Select Origin & Destination
    await page.selectOption("select >> nth=0", { label: "Floor 1: Gate 1 CCS Main Entrance" });
    await page.selectOption("select >> nth=1", { label: "Floor 3: CCS Dean’s Office Suite" });

    // 5. Verify SVG Map & Turn-by-Turn Directions
    await expect(page.locator("svg[aria-label*='Floor 1']")).toBeVisible();
    await expect(page.locator("ol")).toContainText("Turn-by-Turn Directions");
    await expect(page.locator("text=ESTIMATED DISTANCE")).toBeVisible();
  });
});
