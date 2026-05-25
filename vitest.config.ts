import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "dist/",
        "coverage/",
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "src/vite-env.d.ts",
        "scripts/**",
      ],
      include: ["src/**/*.{ts,tsx}"],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", "dist"],
    testTimeout: 10000,
    isolate: true,
    pool: "forks",
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});