// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://strong-nasturtium-2ec0f6.netlify.app",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    preact(),
    sitemap({
      changefreq: "weekly",
      priority: 0.7,
      lastmod: new Date(),
      // Configuración personalizada de URLs
      customPages: [
        "https://strong-nasturtium-2ec0f6.netlify.app/",
        "https://strong-nasturtium-2ec0f6.netlify.app/nosotros",
        "https://strong-nasturtium-2ec0f6.netlify.app/links",
      ],
      serialize(item) {
        // Prioridad personalizada por página
        if (item.url === "https://strong-nasturtium-2ec0f6.netlify.app/") {
          item.priority = 1.0;
        }
        if (item.url.includes("/nosotros")) {
          item.priority = 0.9;
        }
        return item;
      },
    }),
  ],
});
