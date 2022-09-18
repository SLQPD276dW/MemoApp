import { test, expect } from "@playwright/test";

/* test("homepage has Playwright in title and get started link linking to the intro page", async ({
    page,
}) => {
    await page.goto("https://playwright.dev/");

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Playwright/);

    // create a locator
    const getStarted = page.locator("text=Get Started");

    // Expect an attribute "to be strictly equal" to the value.
    await expect(getStarted).toHaveAttribute("href", "/docs/intro");

    // Click the get started link.
    await getStarted.click();

    // Expects the URL to contain intro.
    await expect(page).toHaveURL(/.*intro/);
}); */

test("display memo app", async ({ page }) => {
    await page.goto("http://localhost:3000/");

    await page.locator("button").click();

    await page.locator("button[data-test=github]").click();

    await page.locator("input[name=login]").type("username");
    await page.locator("input[name=password]").type("password");
    await page.locator("input[name=commit]").click();
});
