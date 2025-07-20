/// <reference types="vitest/config" />

import tailwind from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import viteTsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  base: "./",
  plugins: [tailwind(), react(), viteTsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/testing/setup-tests.ts",
    exclude: ["**/node_modules/**"],
    coverage: {
      include: ["src/**"],
    },
  },
})
