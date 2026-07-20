import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicPages = [
  ["home", "/", /Sewn into/],
  ["reviews", "/reviews", /Customer Stories/],
  ["privacy", "/privacy", /Privacy Policy/],
  ["not found", "/missing-page-for-test", /couldn't find that page/i],
] as const;

for (const [name, path, heading] of publicPages) {
  test(`${name} page is accessible and fits the viewport`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    await page.addStyleTag({
      content:
        "*,*::before,*::after{animation:none!important;transition:none!important}[data-reveal]{opacity:1!important;transform:none!important}",
    });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const seriousViolations = results.violations.filter(({ impact }) =>
      ["critical", "serious"].includes(impact ?? ""),
    );
    expect(seriousViolations).toEqual([]);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("contact form has usable fields and a non-JavaScript fallback", async ({ page }) => {
  await page.goto("/#contact");
  const form = page.getByTestId("contact-form");
  await expect(form).toHaveAttribute("name", "contact");
  await expect(form).toHaveAttribute("method", "POST");
  await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute("type", "email");
  await expect(page.getByLabel("What are you looking for?")).toBeVisible();
  await expect(page.getByTestId("contact-form-submit")).toBeEnabled();
});

test("gallery lightbox traps focus, closes with Escape, and restores focus", async ({ page }) => {
  await page.goto("/#gallery");
  const firstImage = page.getByTestId("gallery-image-0");
  await firstImage.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByTestId("lightbox-close")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(firstImage).toBeFocused();
});

test("mobile navigation opens without obscuring its controls", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only interaction");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation menu" });
  await menu.click();
  await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Gallery", exact: true })).toBeVisible();
});
