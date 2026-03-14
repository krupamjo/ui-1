# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start              # dev server at http://localhost:4200 (uses development environment)
npm run build          # production build to dist/
npm test               # run unit tests via Angular CLI (Vitest under the hood)
npm run test:vitest    # run unit tests directly with Vitest
npm run test:coverage  # run unit tests with v8 coverage report
npm run test:e2e       # run Playwright e2e tests (headless, auto-starts dev server)
npm run test:e2e:headed   # run Playwright e2e tests with browser visible
npm run test:e2e:debug    # run Playwright e2e tests in debug mode
ng generate component <name>   # scaffold a new component
```

The dev server defaults to the `development` configuration, which uses `environment.development.ts`:
- API: `https://localhost:7240`
- Auth (OIDC): `https://localhost:7261`

Production (`environment.ts`) points to `https://krupamjo-api.azurewebsites.net` and `https://crgolden-identity.azurewebsites.net`.

## Architecture

Angular 21 standalone-component app using the `@angular/build:application` builder (esbuild-based). Styling via Bootstrap 5.

**Auth flow (OIDC via `oidc-client`):** `AuthService` wraps `UserManager` (implicit flow, scopes: `openid profile email krupamjo-api-1`). On a guarded route, `AuthGuard` checks `AuthService.user$` (a `BehaviorSubject<User | null>`); if not authenticated it calls `authService.login()`, which triggers `signinRedirect()`. After the IdP redirects back, `LoginCallbackComponent` calls `authService.loginCallback()` which processes the callback, updates `user$`, and navigates to `returnUrl` (stored in `sessionStorage`) or `/`. Signing out is handled via `signoutRedirect()`.

**HTTP interceptors** (registered in `app.config.ts` via `withInterceptors`):
- `authInterceptor` — attaches `Authorization: Bearer <access_token>` when a non-expired user exists.
- `errorInterceptor` — on 401 triggers `authService.login()`; on 403 navigates to `/`.

**App initializer (`app.config.ts`):** Calls `authService.getUser()` on startup and pushes the result into `user$` so any existing OIDC session is restored before rendering.

**Routing (`app.routes.ts`):**
- `/login-callback` → `LoginCallbackComponent` (public, handles OIDC redirect)
- `/pets` → `PetsComponent` (guarded by `AuthGuard`, data pre-fetched by `petsResolver`)
- `/` → redirects to `/pets`

**Data layer:** `PetsService` (`providedIn: 'root'`) uses `inject(HttpClient)` and `environment.apiUrl`. `petsResolver` (`ResolveFn<Pet[]>`) pre-fetches pets data; it's available in `ActivatedRoute.snapshot.data['pets']`.

**Model:** `src/pets/pet.ts` — `Pet` class with `id`, `name`, `dateOfBirth`.

**Account menu:** `AccountMenuComponent` (`src/account-menu/`) surfaces login/logout actions and `user$`/`isLoggedIn$` from `AuthService`.

## Testing

**Unit tests** use Vitest with jsdom. A custom plugin in `vitest.config.ts` inlines `templateUrl`/`styleUrls` at transform time so Angular components work without the Angular compiler.

**E2e tests** use Playwright (config at `test/playwright.config.ts`, specs in `test/`). The `webServer` option auto-starts `ng serve` when no server is already running.

Since the app uses OIDC, e2e tests bypass the IdP by injecting a fake `oidc-client` `User` object directly into `sessionStorage` before Angular boots (via `context.addInitScript`). The storage key is `oidc.user:<authority>:<client_id>`. API calls are intercepted with `page.route()`. The `authenticatedPage` fixture in `test/fixtures.ts` wires this up — use it for any test that requires an authenticated user.

## Code style

Prettier is configured in `package.json`: 100-char print width, single quotes, Angular HTML parser for `.html` files.
