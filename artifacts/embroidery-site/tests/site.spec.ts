import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicPages = [
  ["home", "/", /Sewn into/],
  ["reviews", "/reviews", /Customer Stories/],
  ["faq", "/faq", /Frequently Asked Questions/],
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
  await expect(form).toHaveAttribute("data-netlify-recaptcha", "true");
  await expect(page.getByTestId("contact-form-captcha")).toBeVisible();
  await expect(page.getByTestId("contact-form-submit")).toBeEnabled();
});

test("Netlify's generated CAPTCHA is mounted in the visible form", async ({ page }) => {
  await page.goto("/#contact");
  await page.evaluate(() => {
    const generatedCaptcha = document.createElement("div");
    generatedCaptcha.className = "g-recaptcha";
    document.querySelector(".netlify-form-detection")?.append(generatedCaptcha);
  });

  await expect(
    page.getByTestId("contact-form-captcha").locator(".g-recaptcha"),
  ).toHaveCount(1);
  await expect(
    page.locator(".netlify-form-detection .g-recaptcha"),
  ).toHaveCount(0);
});

test("contact form requires a completed security challenge", async ({ page }) => {
  let submitted = false;
  await page.route("/", async (route) => {
    if (route.request().method() === "POST") submitted = true;
    await route.continue();
  });

  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("Form Test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page
    .getByLabel("What are you looking for?")
    .fill("Testing CAPTCHA enforcement.");
  await page.getByTestId("contact-form-submit").click();

  await expect(page.getByTestId("contact-form-status")).toHaveText(
    "Please complete the security check before sending your message.",
  );
  expect(submitted).toBe(false);
});

test("public images use deployment-versioned URLs and decode successfully", async ({ page }) => {
  await page.goto("/");
  const images = page.locator("img");

  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
  }

  await expect.poll(async () =>
    images.evaluateAll((elements) =>
      elements.every((image) => image.complete && image.naturalWidth > 0),
    ),
  ).toBe(true);

  const unversioned = await images.evaluateAll((elements) =>
    elements
      .map((image) => image.getAttribute("src") ?? "")
      .filter((src) => src.startsWith("/") && !src.includes("v=local")),
  );
  expect(unversioned).toEqual([]);
});

test("a failed logo response retries on a fresh URL", async ({ page }) => {
  let failedFirstRequest = false;

  await page.route(/\/logo-b\.jpg\?v=local$/, async (route) => {
    if (!failedFirstRequest) {
      failedFirstRequest = true;
      await route.fulfill({ status: 503, contentType: "text/plain", body: "" });
      return;
    }

    await route.continue();
  });

  await page.goto("/");
  const logo = page.getByTestId("nav-logo").locator("img");
  await expect.poll(() => logo.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);
  expect(failedFirstRequest).toBe(true);
});

test("gallery album supports navigation, closes with Escape, and restores focus", async ({ page }) => {
  await page.goto("/#gallery");
  const galleryTrigger = page.getByTestId("gallery-image-2");
  await galleryTrigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Seasonal & Holiday" })).toBeVisible();
  await expect(page.getByTestId("lightbox-close")).toBeFocused();
  await expect(page.getByText(/^1 of \d+$/)).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText(/^2 of \d+$/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(galleryTrigger).toBeFocused();
});

test("mobile navigation opens without obscuring its controls", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only interaction");
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation menu" });
  await menu.click();
  await expect(page.getByRole("button", { name: "Close navigation menu" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Gallery", exact: true })).toBeVisible();
});
