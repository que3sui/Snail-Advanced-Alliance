import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

const GITHUB_PAGES = process.env.GITHUB_PAGES === "true";

export default defineConfig({
  site: GITHUB_PAGES ? "https://que3sui.github.io" : "https://advancedguide.cn",
  base: GITHUB_PAGES ? "/Snail-Advanced-Alliance/" : "/",
  output: "static",
  adapter: cloudflare(),

  i18n: {
    defaultLocale: "zh",
    locales: ["zh", "en"],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [sitemap()],

  markdown: {
    shikiConfig: {
      theme: "github-dark",
    },
  },
});
