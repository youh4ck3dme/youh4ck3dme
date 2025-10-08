/**
 * Playwright end-to-end test describing a happy path rezervácie.
 * Spustenie: npx playwright test e2e/booking.e2e-spec.ts
 */
import { test, expect } from '@playwright/test';

test('happy path rezervácie', async ({ page }) => {
  await page.goto('http://localhost:4200/');
  await page.getByRole('link', { name: /rezervácia/i }).click();
  await page.getByLabel('Precision couture cut').check();
  await page.getByLabel('Sofia Kováčová').check();
  await page.getByRole('button', { name: /2024-07-02/ }).first().click();
  await page.getByLabel('Meno').fill('Test Tester');
  await page.getByLabel('Telefón').fill('+421905000000');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Poznámka pre tím').fill('Teším sa.');
  await page.getByRole('button', { name: /odoslať/i }).click();
  await expect(page.getByText(/Rezervácia uložená/i)).toBeVisible();
});
