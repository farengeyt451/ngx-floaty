import { expect, test } from '@playwright/test';

import { expectNoA11yViolations } from './a11y';

test.describe('demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the app', async ({ page }) => {
    await expect(page).toHaveTitle('ngx-floaty demo');
    await expect(page.getByRole('heading', { level: 1, name: 'ngx-floaty' })).toBeVisible();
  });

  test('has no accessibility violations', async ({ page }) => {
    await expectNoA11yViolations(page);
  });
});
