import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'node22',
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/__tests__/**',
        '**/*.config.ts',
        '**/*.config.js',
      ],
    },
  },
});

