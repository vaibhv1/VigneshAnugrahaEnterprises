import { copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const repository = "VigneshAnugrahaEnterprises";

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? `/${repository}/` : "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "github-pages-spa-fallback",
      apply: "build",
      closeBundle() {
        const dist = resolve("dist");
        copyFileSync(resolve(dist, "index.html"), resolve(dist, "404.html"));
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
