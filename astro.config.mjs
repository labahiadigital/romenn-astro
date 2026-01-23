import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import purgecss from 'astro-purgecss';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://romenninmobiliaria.es',
  adapter: cloudflare({
    mode: 'directory',
    functionPerRoute: true,
  }),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/404'),
    }),
    robotsTxt({
      sitemap: true,
      sitemapBaseFileName: 'sitemap-index',
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/404'],
        },
      ],
    }),
    purgecss({
      keyframes: false,
      safelist: {
        standard: [
          'dark',
          /^bg-/,
          /^text-/,
          /^border-/,
          /^hover:/,
          /^focus:/,
          /^group-/,
          /^data-/,
          /^animate-/,
          /^transition-/,
          /^w-\[/,
          /^h-\[/,
          /^min-/,
          /^max-/,
        ],
        greedy: [
          /astro/,
          /radix/,
          /sonner/,
        ],
      },
    }),
  ],
  experimental: {
    fonts: [
      {
        provider: "local",
        name: "Manrope",
        cssVariable: "--font-manrope",
        fallbacks: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        variants: [
          { weight: 300, style: "normal", src: ["./src/assets/fonts/manrope-latin-300-normal.woff2"] },
          { weight: 400, style: "normal", src: ["./src/assets/fonts/manrope-latin-400-normal.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/manrope-latin-500-normal.woff2"] },
          { weight: 600, style: "normal", src: ["./src/assets/fonts/manrope-latin-600-normal.woff2"] },
          { weight: 700, style: "normal", src: ["./src/assets/fonts/manrope-latin-700-normal.woff2"] },
        ],
      },
      {
        provider: "local",
        name: "Playfair Display",
        cssVariable: "--font-playfair",
        fallbacks: ["Georgia", "Times New Roman", "serif"],
        variants: [
          { weight: 400, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-400-normal.woff2"] },
          { weight: 400, style: "italic", src: ["./src/assets/fonts/playfair-display-latin-400-italic.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-500-normal.woff2"] },
          { weight: 600, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-600-normal.woff2"] },
          { weight: 700, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-700-normal.woff2"] },
        ],
      },
    ],
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    ssr: {
      noExternal: ['@radix-ui/*'],
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  output: 'static',
  build: {
    // CSS inline para mejor rendimiento - PurgeCSS lo optimiza primero
    inlineStylesheets: 'always',
  },
});
