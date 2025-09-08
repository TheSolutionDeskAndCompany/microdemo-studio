import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/player.ts",
      name: "MicrodemoPlayer",
      fileName: (format) => `player.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    }
  }
});
