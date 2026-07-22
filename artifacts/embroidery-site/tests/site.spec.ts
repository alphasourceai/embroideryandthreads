import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicPages = [
  ["home", "/", /Sewn into/],
  ["pricing", "/pricing", /Custom Embroidery Pricing/],
  ["reviews", "/reviews", /Customer Stories/],
  ["faq", "/faq", /Frequently Asked Questions/],
  ["privacy", "/privacy", /Privacy Policy/],
  ["not found", "/missing-page-for-test", /couldn't find that page/i],
] as const;

for (const [name, path, heading] of publicPages) {
  test(`${name} page is accessible and fits the viewport`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
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
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("contact form has usable fields and a non-JavaScript fallback", async ({
  page,
}) => {
  await page.goto("/#contact");
  const form = page.getByTestId("contact-form");
  await expect(form).toHaveAttribute("name", "contact");
  await expect(form).toHaveAttribute("method", "POST");
  await expect(page.getByLabel("Name", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email", { exact: true })).toHaveAttribute(
    "type",
    "email",
  );
  await expect(page.getByLabel("I'm interested in")).toBeVisible();
  await expect(page.getByLabel("I'm interested in")).toHaveAttribute(
    "required",
    "",
  );
  await expect(page.getByLabel("What are you looking for?")).toBeVisible();
  await expect(
    page.getByRole("checkbox", {
      name: /Save my inquiry if I leave before sending/,
    }),
  ).toHaveCount(0);
  await expect(page.getByTestId("privacy-banner")).toBeVisible();
  await expect(form).toHaveAttribute("data-netlify-recaptcha", "true");
  await expect(page.getByTestId("captcha-modal")).toBeHidden();
  await expect(page.getByTestId("contact-form-submit")).toBeEnabled();
});

test("anonymous form analytics never include typed contact values", async ({
  page,
}) => {
  const analyticsBodies: string[] = [];
  await page.route("**/.netlify/functions/analytics-event", async (route) => {
    analyticsBodies.push(route.request().postData() ?? "");
    await route.fulfill({ status: 204, body: "" });
  });

  await page.goto("/#contact");
  expect(analyticsBodies).toHaveLength(0);
  await expect(page.locator("#cloudflare-web-analytics")).toHaveCount(0);
  await page.getByRole("button", { name: "Allow all" }).click();
  await expect(page.locator("#cloudflare-web-analytics")).toHaveAttribute(
    "src",
    "https://static.cloudflareinsights.com/beacon.min.js",
  );
  await page.getByLabel("Name", { exact: true }).fill("Private Form Name");
  await page.getByLabel("Email", { exact: true }).fill("private@example.com");
  await page.getByLabel("I'm interested in").selectOption("Apparel");
  await page
    .getByLabel("What are you looking for?")
    .fill("Private message content");
  await expect
    .poll(() =>
      analyticsBodies.some((body) => body.includes('"type":"form_progress"')),
    )
    .toBe(true);

  const transmitted = analyticsBodies.join("\n");
  expect(transmitted).not.toContain("Private Form Name");
  expect(transmitted).not.toContain("private@example.com");
  expect(transmitted).not.toContain("Private message content");
  expect(transmitted).toContain('"type":"form_progress"');
});

test("unfinished inquiry contents are saved only after privacy preference consent", async ({
  page,
}) => {
  const draftBodies: string[] = [];
  await page.route("**/.netlify/functions/contact-draft", async (route) => {
    draftBodies.push(route.request().postData() ?? "");
    await route.fulfill({
      status: 202,
      contentType: "application/json",
      body: JSON.stringify({ saved: true }),
    });
  });

  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("Consent Test");
  await page.getByLabel("Email", { exact: true }).fill("consent@example.com");
  await page
    .getByLabel("What are you looking for?")
    .fill("Saved only by choice");
  expect(draftBodies).toHaveLength(0);

  await page.getByRole("button", { name: "Configure preferences" }).click();
  await expect(page.getByTestId("privacy-preferences-dialog")).toBeVisible();
  await page.getByRole("switch", { name: "Saved inquiry follow-up" }).click();
  await page.getByRole("button", { name: "Save preferences" }).click();
  await page.getByLabel("Email", { exact: true }).press("Tab");
  await expect.poll(() => draftBodies.length).toBeGreaterThan(0);
  expect(draftBodies.at(-1)).toContain("consent@example.com");
  expect(draftBodies.at(-1)).toContain('"consent":true');
});

test("privacy choices can reject optional collection and reopen from the footer", async ({
  page,
}) => {
  const analyticsBodies: string[] = [];
  const draftBodies: string[] = [];
  await page.route("**/.netlify/functions/analytics-event", async (route) => {
    analyticsBodies.push(route.request().postData() ?? "");
    await route.fulfill({ status: 204, body: "" });
  });
  await page.route("**/.netlify/functions/contact-draft", async (route) => {
    if (route.request().method() === "POST") {
      draftBodies.push(route.request().postData() ?? "");
    }
    await route.fulfill({ status: 204, body: "" });
  });

  await page.goto("/#contact");
  await page.getByRole("button", { name: "Configure preferences" }).click();
  await page.getByRole("button", { name: "Reject optional" }).click();
  await page.getByLabel("Name", { exact: true }).fill("No Collection");
  await page.getByLabel("Email", { exact: true }).fill("none@example.com");
  await page
    .getByLabel("What are you looking for?")
    .fill("Do not retain this text");
  await page.waitForTimeout(1_100);

  expect(analyticsBodies).toHaveLength(0);
  expect(draftBodies).toHaveLength(0);

  await page
    .locator("footer")
    .getByRole("button", { name: "Privacy choices" })
    .click();
  await expect(page.getByTestId("privacy-preferences-dialog")).toBeVisible();
  await expect(
    page.getByRole("switch", { name: "Site analytics" }),
  ).not.toBeChecked();
  await expect(
    page.getByRole("switch", { name: "Saved inquiry follow-up" }),
  ).not.toBeChecked();
});

test("contact deep links settle at the contact section", async ({ page }) => {
  await page.goto("/#contact");

  await expect
    .poll(() =>
      page
        .locator("#contact")
        .evaluate((section) => Math.round(section.getBoundingClientRect().top)),
    )
    .toBeGreaterThanOrEqual(60);
  await expect
    .poll(() =>
      page
        .locator("#contact")
        .evaluate((section) => Math.round(section.getBoundingClientRect().top)),
    )
    .toBeLessThanOrEqual(130);
});

test("pricing page presents every approved category and a clear order path", async ({
  page,
}) => {
  await page.goto("/pricing");

  for (const heading of [
    "Apparel",
    "Baby & Kids",
    "Gifts & Personalized",
    "Matching & Gift Sets",
    "Bags & Totes",
    "Custom Embroidery",
    "Add-ons",
  ]) {
    await expect(
      page.getByRole("heading", { level: 2, name: heading }),
    ).toBeVisible();
  }

  await expect(page.getByText("$15-$35", { exact: true })).toBeVisible();
  await expect(page.getByText("+$10-$20", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Request an Order" }),
  ).toHaveAttribute("href", "/#contact");
});

test("Netlify's generated CAPTCHA is mounted in the visible form", async ({
  page,
}) => {
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

test("contact form opens its security challenge only when submitted", async ({
  page,
}) => {
  let submitted = false;
  await page.route("/", async (route) => {
    if (route.request().method() === "POST") submitted = true;
    await route.continue();
  });

  await page.goto("/#contact");
  await page.getByLabel("Name", { exact: true }).fill("Form Test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("I'm interested in").selectOption("Apparel");
  await page
    .getByLabel("What are you looking for?")
    .fill("Testing CAPTCHA enforcement.");
  await page.getByTestId("contact-form-submit").click();

  await expect(page.getByTestId("captcha-modal")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Confirm you're human" }),
  ).toBeVisible();
  await expect(page.getByTestId("captcha-close")).toBeFocused();
  expect(submitted).toBe(false);
});

test("contact form submits automatically after the security challenge", async ({
  page,
}) => {
  let submittedBody = "";
  await page.route("/", async (route) => {
    if (route.request().method() === "POST") {
      submittedBody = route.request().postData() ?? "";
      await route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "ok",
      });
      return;
    }
    await route.continue();
  });

  await page.goto("/#contact");
  await page.evaluate(() => {
    const generatedCaptcha = document.createElement("div");
    generatedCaptcha.className = "g-recaptcha";
    document.querySelector(".netlify-form-detection")?.append(generatedCaptcha);
  });
  await page.getByLabel("Name", { exact: true }).fill("Form Test");
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("I'm interested in").selectOption("Apparel");
  await page
    .getByLabel("What are you looking for?")
    .fill("Testing modal CAPTCHA submission.");
  await page.getByTestId("contact-form-submit").click();
  await expect(page.getByTestId("captcha-modal")).toBeVisible();

  await page.evaluate(() => {
    const response = document.createElement("textarea");
    response.name = "g-recaptcha-response";
    response.value = "test-token";
    document.querySelector(".g-recaptcha")?.append(response);
  });

  await expect(page.getByTestId("contact-form-status")).toHaveText(
    "Thank you. Your message has been sent.",
  );
  await expect(page.getByTestId("captcha-modal")).toBeHidden();
  expect(submittedBody).toContain("g-recaptcha-response=test-token");
});

test("public images use deployment-versioned URLs and decode successfully", async ({
  page,
}) => {
  await page.goto("/");
  const images = page.locator("img");

  for (let index = 0; index < (await images.count()); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded();
  }

  await expect
    .poll(async () =>
      images.evaluateAll((elements) =>
        elements.every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBe(true);

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
  await expect
    .poll(() => logo.evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);
  expect(failedFirstRequest).toBe(true);
});

test("gallery album supports navigation, closes with Escape, and restores focus", async ({
  page,
}) => {
  await page.goto("/#gallery");
  const galleryTrigger = page.getByTestId("gallery-image-2");
  await galleryTrigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Seasonal & Holiday" }),
  ).toBeVisible();
  await expect(page.getByTestId("lightbox-close")).toBeFocused();
  await expect(page.getByText(/^1 of \d+$/)).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByText(/^2 of \d+$/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(galleryTrigger).toBeFocused();
});

test("mobile navigation opens without obscuring its controls", async ({
  page,
}, testInfo) => {
  test.skip(
    !testInfo.project.name.startsWith("mobile"),
    "Mobile-only interaction",
  );
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open navigation menu" });
  await menu.click();
  await expect(
    page.getByRole("button", { name: "Close navigation menu" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Gallery", exact: true }),
  ).toBeVisible();
});
