import { test, expect } from '@playwright/test';

test('app load sanity check', async ({ page }) => {
  // Navigate to baseURL (http://localhost:4173)
  await page.goto('/');
  // Verify main brand name is present
  await expect(page.locator('body')).toContainText('MindMitra');
});
