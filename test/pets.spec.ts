import { test, expect, MOCK_PETS, MOCK_USER } from './fixtures';

test.describe('Pets page', () => {
  test('shows the pets list', async ({ authenticatedPage: page }) => {
    await page.goto('/pets');

    await expect(page.getByRole('heading', { name: 'Pets' })).toBeVisible();
    for (const pet of MOCK_PETS) {
      await expect(page.getByText(pet.name)).toBeVisible();
    }
  });

  test('shows empty state when there are no pets', async ({ authenticatedPage: page, context }) => {
    // Override the default mock with an empty response for this test only
    await page.route('https://localhost:7240/pets', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
    );

    await page.goto('/pets');

    await expect(page.getByText('No pets found.')).toBeVisible();
  });

  test('root redirects to /pets', async ({ authenticatedPage: page }) => {
    await page.goto('/');

    await expect(page).toHaveURL('/pets');
  });

  test('shows logged-in user email in account menu', async ({ authenticatedPage: page }) => {
    await page.goto('/pets');

    await expect(page.getByText(MOCK_USER.profile.email)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });
});
