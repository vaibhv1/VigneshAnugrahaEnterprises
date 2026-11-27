import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { legacyPaths, routes, siteUrl } from "./scripts/seo-routes.mjs";

function escapeAttr(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;");
}

function withHead(html: string, route: { title: string; description: string; canonical: string }, robots: string) {
  const title = escapeAttr(route.title);
  const description = escapeAttr(route.description);
  const canonical = escapeAttr(route.canonical);
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, `$1${robots}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${canonical}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${canonical}$2`);
}

export default defineConfig({
  // vigneshanugrahaenterprises.in is served from the site root.
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "github-pages-spa-fallback",
      apply: "build",
      closeBundle() {
        const dist = resolve("dist");
        const template = readFileSync(resolve(dist, "index.html"), "utf8");
        for (const route of routes) {
          const canonical = `${siteUrl}${route.path === "/" ? "/" : route.path}`;
          const html = withHead(template, { ...route, canonical }, "index, follow");
          if (route.path === "/") {
            writeFileSync(resolve(dist, "index.html"), html);
            continue;
          }
          const file = resolve(dist, `.${route.path}`, "index.html");
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, html);
        }
        for (const alias of legacyPaths) {
          const target = routes.find((route) => route.path === alias.canonical);
          if (!target) continue;
          const html = withHead(
            template,
            { ...target, canonical: `${siteUrl}${alias.canonical}` },
            "index, follow",
          );
          const file = resolve(dist, `.${alias.path}`, "index.html");
          mkdirSync(dirname(file), { recursive: true });
          writeFileSync(file, html);
        }
        const missing = withHead(
          template,
          {
            title: "Page not found | Vignesh Anugraha Enterprises",
            description: "The address may be mistyped. The company pages are linked from the home page.",
            canonical: `${siteUrl}/`,
          },
          "noindex, follow",
        );
        writeFileSync(resolve(dist, "404.html"), missing);
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
});
