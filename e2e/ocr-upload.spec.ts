import { test, expect } from "@playwright/test";

test.describe("ChronoNav OCR Study Load Upload E2E Flow", () => {
  test("should open OCR modal, extract study load, render editable verification table, and confirm schedule", async ({ page }) => {
    // 1. Visit Schedule Page
    await page.goto("/schedule");
    await expect(page.locator("h1")).toContainText("Class Schedule & Study Load");

    // 2. Open OCR Modal
    await page.click("button:has-text('Upload Study Load (OCR)')");
    await expect(page.locator("text=Study Load OCR Scanner")).toBeVisible();

    // 3. Trigger File Selection / Upload
    const fileChooserPromise = page.waitForEvent("filechooser");
    await page.click("text=Drag & Drop Study Load PDF or Image here");
    const fileChooser = await fileChooserPromise;

    // Create virtual study load test file
    await fileChooser.setFiles({
      name: "study_load_test.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("UNIVERSITY OF CEBU STUDY LOAD TEST"),
    });

    // 4. Verify Scanning Animation & Verification Table
    await expect(page.locator("text=Extracted 5 Classes Successfully")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("table")).toBeVisible();

    // 5. Confirm & Save Schedule
    await page.click("button:has-text('Confirm & Save Schedule')");

    // 6. Assert Notification Banner & Updated Schedule Table
    await expect(page.locator("text=Successfully imported 5 classes")).toBeVisible();
  });
});
