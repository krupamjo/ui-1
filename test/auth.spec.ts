import { test, expect } from '@playwright/test';

const OIDC_AUTHORITY = 'https://localhost:7261';

test.describe('Auth', () => {
  test('unauthenticated visit to /pets triggers OIDC authentication flow', async ({ page }) => {
    // signinRedirect() first GETs the discovery document to resolve authorization_endpoint.
    // Mock it so oidc-client can build the full authorization URL.
    await page.route(`${OIDC_AUTHORITY}/.well-known/openid-configuration`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          issuer: OIDC_AUTHORITY,
          authorization_endpoint: `${OIDC_AUTHORITY}/connect/authorize`,
        }),
      }),
    );

    // page.waitForRequest resolves before the route handler runs, so we can
    // capture the full authorization URL (including query params) then abort
    // the navigation to prevent an actual redirect away from the app.
    const authorizeRequestPromise = page.waitForRequest((req) =>
      req.url().includes('/connect/authorize'),
    );
    await page.route(/\/connect\/authorize/, (route) => route.abort('aborted'));

    await page.goto('/pets').catch(() => {});

    const authorizeRequest = await authorizeRequestPromise;
    const url = new URL(authorizeRequest.url());
    expect(url.searchParams.get('client_id')).toBe('krupamjo-ui-1');
    expect(url.searchParams.get('redirect_uri')).toContain('login-callback');
  });
});
