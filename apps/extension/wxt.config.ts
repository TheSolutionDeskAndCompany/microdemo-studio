import { defineConfig } from "wxt";
import { resolve } from "node:path";

// Get the STUDIO_BASE_URL from environment or use default
const STUDIO_BASE_URL = process.env.STUDIO_BASE_URL || "http://localhost:3001";

export default defineConfig({
  vite: () => ({
    resolve: {
      alias: {
        "@microdemo/utils": resolve(__dirname, "../../packages/utils/src"),
      },
    },
  }),
  manifest: {
    version: "0.1.0",
    permissions: ["activeTab", "scripting", "tabs", "storage"],
    host_permissions: Array.from(new Set([
      "http://localhost:3000/*",
      "http://localhost:3001/*",
      // Add the configured STUDIO_BASE_URL to host permissions
      new URL(STUDIO_BASE_URL).origin + '/*'
    ]))
  }
});
