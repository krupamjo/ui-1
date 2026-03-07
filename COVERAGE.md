# Test Coverage Reporting

This project uses Vitest with v8 coverage provider to generate test coverage reports.

## Commands

```bash
npm test              # Run tests without coverage
npm run test:coverage # Run tests with coverage report
```

## Coverage Reports

When you run `npm run test:coverage`, Vitest generates multiple coverage report formats:

- **text**: Console output showing coverage summary
- **html**: Interactive HTML report in `coverage/` directory
- **json**: Machine-readable JSON format
- **lcov**: LCOV format (compatible with CI/CD tools)

## Viewing Coverage Reports

### HTML Report (Recommended)
After running `npm run test:coverage`, open the HTML report:
```bash
# On Windows:
start coverage/index.html

# On macOS:
open coverage/index.html

# On Linux:
xdg-open coverage/index.html
```

The HTML report provides:
- Overall coverage statistics
- File-by-file breakdown
- Line-by-line coverage visualization
- Interactive navigation between files

## Coverage Thresholds

The project enforces these coverage minimums (in `vitest.config.ts`):
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

Tests will fail if coverage drops below these thresholds.

## Configuration

Coverage settings in `vitest.config.ts`:
- **Provider**: v8 (modern, fast coverage provider)
- **Reporting**: text, json, html, lcov
- **Excluded files**: `node_modules/`, `dist/`, `*.spec.ts`, `main.ts`, `environments/`
- **All files**: All source files are analyzed (not just tested ones)

## CI/CD Integration

The LCOV format report can be integrated with CI/CD tools:
- **GitHub Actions**: Use [codecov-action](https://github.com/codecov/codecov-action)
- **GitLab CI**: Built-in coverage support
- **Azure DevOps**: Coverage reports via task

Example for GitHub Actions:
```yaml
- name: Generate coverage report
  run: npm run test:coverage

- name: Upload to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Notes

- Coverage reports are gitignored (added to `.gitignore`)
- The `reportOnFailure: true` setting ensures coverage data is generated even if tests fail
- Use `npm run test:coverage -- --reporter=verbose` for detailed test output with coverage
