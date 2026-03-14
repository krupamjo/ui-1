import { test as base, expect, Page } from '@playwright/test';

// Must match environment.development.ts values
const OIDC_AUTHORITY = 'https://localhost:7261';
const CLIENT_ID = 'krupamjo-ui-1';
const API_URL = 'https://localhost:7240';

// oidc-client v1 stores users under this sessionStorage key
export const OIDC_STORAGE_KEY = `oidc.user:${OIDC_AUTHORITY}:${CLIENT_ID}`;

export const MOCK_PETS = [
  { id: 1, name: 'Buddy', dateOfBirth: '2020-01-15T00:00:00' },
  { id: 2, name: 'Whiskers', dateOfBirth: '2019-06-20T00:00:00' },
];

// A fake OIDC User object accepted by oidc-client's UserManager.getUser().
// expires_at is set far in the future so user.expired === false.
export const MOCK_USER = {
  id_token: 'mock.id.token',
  access_token: 'mock.access.token',
  token_type: 'Bearer',
  scope: 'openid profile email krupamjo-api-1',
  profile: {
    sub: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
    iss: OIDC_AUTHORITY,
    aud: CLIENT_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: 9_999_999_999,
  },
  expires_at: 9_999_999_999,
};

type Fixtures = {
  /** A page that is pre-authenticated and has the pets API mocked. */
  authenticatedPage: Page;
};

export const test = base.extend<Fixtures>({
  authenticatedPage: async ({ page, context }, use) => {
    // Inject the fake OIDC user into sessionStorage before Angular boots,
    // so AuthService.getUser() returns a valid non-expired user on startup.
    await context.addInitScript(
      ({ key, user }) => sessionStorage.setItem(key, JSON.stringify(user)),
      { key: OIDC_STORAGE_KEY, user: MOCK_USER },
    );

    await page.route(`${API_URL}/pets`, (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_PETS),
      }),
    );

    await use(page);
  },
});

export { expect };
