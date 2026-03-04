# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # dev server at http://localhost:4200 (uses development environment)
npm run build      # production build to dist/
npm test           # run unit tests with Vitest
ng generate component <name>   # scaffold a new component
```

The dev server defaults to the `development` configuration, which replaces `environment.ts` with `environment.development.ts` (API at `https://localhost:7240`). Production points to `https://krupamjo-api.azurewebsites.net`.

## Architecture

Angular 21 standalone-component app using the `@angular/build:application` builder (esbuild-based).

**Auth flow:** `LoginComponent` → `AuthService` (posts to `/api/auth/login`, stores JWT in `localStorage`) → `AuthGuard` (checks `AuthService.isLoggedIn$` BehaviorSubject, redirects to `/login` with `returnUrl` query param on failure).

**Routing (`app.routes.ts`):**
- `/login` → `LoginComponent` (public)
- `/pets` → `PetsComponent` (guarded by `AuthGuard`)
- `/` → redirects to `/login`

**Data layer:** `PetsService` uses `inject(HttpClient)` and reads the base URL from `environment.apiUrl`. It is registered as a provider in `app.config.ts` (not `@Injectable({ providedIn: 'root' })`), so it must stay there when new services follow this pattern.

**Models:** `src/app/models/pet.ts` — `Pet` class with `id`, `name`, `dateOfBirth`.

## Code style

Prettier is configured in `package.json`: 100-char print width, single quotes, Angular HTML parser for `.html` files.
