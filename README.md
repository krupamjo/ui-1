# Krupamjo UI

Angular 21 frontend for the Krupamjo application. Manages pets and authenticates via OIDC.

## Prerequisites

- Node.js 22+
- A running instance of the API (`https://localhost:7240` in development)
- A running OIDC identity provider (`https://localhost:7261` in development)

## Development

```bash
npm install
npm start        # dev server at http://localhost:4200
npm run build    # production build to dist/
```

The development configuration uses `src/environments/environment.development.ts`. Production URLs are defined in `src/environments/environment.ts`.

## Testing

```bash
npm test                 # unit tests (Vitest via Angular CLI)
npm run test:coverage    # unit tests with v8 coverage report

npm run test:e2e         # Playwright e2e tests — auto-starts the dev server
npm run test:e2e:headed  # same, with browser visible
npm run test:e2e:debug   # same, in Playwright debug mode
```

E2e tests do not require the API or OIDC server to be running — all external requests are intercepted with `page.route()` mocks.

## Scaffolding

```bash
ng generate component <name>
```
