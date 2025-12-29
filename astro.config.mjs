// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://trasciendegym.com",

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
        "https://trasciendegym.com/",
        "https://trasciendegym.com/nosotros",
        "https://trasciendegym.com/links",
      ],
      serialize(item) {
        // Prioridad personalizada por página
        if (item.url === "https://trasciendegym.com/") {
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
