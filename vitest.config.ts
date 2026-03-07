/// <reference types="node" />
import { defineConfig, Plugin } from 'vitest/config';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';

function angularInlineTemplates(): Plugin {
  return {
    name: 'angular-inline-templates',
    transform(code, id) {
      if (!id.endsWith('.ts') || id.endsWith('.spec.ts')) return null;

      let changed = false;
      let result = code;

      result = result.replace(/templateUrl:\s*['"]([^'"]+)['"]/g, (_match, url) => {
        try {
          const content = readFileSync(resolve(dirname(id), url), 'utf-8');
          changed = true;
          return `template: \`${content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``;
        } catch {
          return _match;
        }
      });

      result = result.replace(/styleUrl:\s*['"]([^'"]+)['"]/g, (_match, url) => {
        try {
          const content = readFileSync(resolve(dirname(id), url), 'utf-8');
          changed = true;
          return `styles: [\`${content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\`]`;
        } catch {
          return _match;
        }
      });

      result = result.replace(/styleUrls:\s*\[([^\]]+)\]/g, (_match, urlsString) => {
        const urls = [...urlsString.matchAll(/['"]([^'"]+)['"]/g)].map((m) => m[1]);
        const styles = urls.map((url) => {
          try {
            const content = readFileSync(resolve(dirname(id), url), 'utf-8');
            return `\`${content.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``;
          } catch {
            return '""';
          }
        });
        changed = true;
        return `styles: [${styles.join(', ')}]`;
      });

      return changed ? { code: result, map: null } : null;
    },
  };
}

export default defineConfig({
  plugins: [angularInlineTemplates()],
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'vmThreads',
    setupFiles: ['src/test-setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.spec.ts',
        '**/index.ts',
        'src/main.ts',
        'src/environments/',
      ],
    },
  },
});
