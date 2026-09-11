import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import purgecss from 'astro-purgecss';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://romenninmobiliaria.es',
  trailingSlash: 'always',
  adapter: cloudflare({
    imageService: 'compile',
  }),
  integrations: [
    react(),
    sitemap({
      changefreq: 'weekly',
      lastmod: new Date(),
      filter: (page) => !page.includes('/404'),
      serialize(item) {
        const highPriority = ['/', '/inmuebles/', '/vender/', '/valoracion/', '/contacto/', '/compradores/', '/calculadora-gastos-venta/'];
        const medPriority = ['/alquiler/', '/off-market/', '/estudio-financiero/', '/financiacion/', '/servicios/', '/extranjeria/', '/blog/'];
        const lowPriority = ['/privacidad/', '/aviso-legal/'];

        const path = item.url.replace('https://romenninmobiliaria.es', '');

        if (highPriority.includes(path)) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (medPriority.includes(path)) {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (lowPriority.includes(path)) {
          item.priority = 0.3;
          item.changefreq = 'monthly';
        } else if (path.startsWith('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        } else {
          item.priority = 0.6;
          item.changefreq = 'weekly';
        }
        return item;
      },
    }),
    robotsTxt({
      sitemap: true,
      sitemapBaseFileName: 'sitemap-index',
      policy: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/404', '/api/', '/og/'],
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
          /line-clamp/,
          /aspect-/,
          /grid-cols/,
          /col-span/,
          /row-span/,
          /gap-/,
          /rounded-/,
          /shadow-/,
          /overflow-/,
          /sticky/,
          /top-/,
          /whitespace-/,
          /ring-/,
          /scale-/,
          /opacity-/,
          /brightness-/,
          /animate-spin/,
          /scrollbar-hide/,
          /backdrop-blur/,
          /select-none/,
          /shrink-/,
          /inset-/,
          /fixed/,
          /z-\[/,
          /tabular-nums/,
          /green-/,
          /blue-/,
          /amber-/,
        ],
      },
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Manrope",
      cssVariable: "--font-manrope",
      fallbacks: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      options: {
        variants: [
          { weight: 300, style: "normal", src: ["./src/assets/fonts/manrope-latin-300-normal.woff2"] },
          { weight: 400, style: "normal", src: ["./src/assets/fonts/manrope-latin-400-normal.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/manrope-latin-500-normal.woff2"] },
          { weight: 600, style: "normal", src: ["./src/assets/fonts/manrope-latin-600-normal.woff2"] },
          { weight: 700, style: "normal", src: ["./src/assets/fonts/manrope-latin-700-normal.woff2"] },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Playfair Display",
      cssVariable: "--font-playfair",
      fallbacks: ["Georgia", "Times New Roman", "serif"],
      options: {
        variants: [
          { weight: 400, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-400-normal.woff2"] },
          { weight: 400, style: "italic", src: ["./src/assets/fonts/playfair-display-latin-400-italic.woff2"] },
          { weight: 500, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-500-normal.woff2"] },
          { weight: 600, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-600-normal.woff2"] },
          { weight: 700, style: "normal", src: ["./src/assets/fonts/playfair-display-latin-700-normal.woff2"] },
        ],
      },
    },
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
        'react-dom/server': 'react-dom/server.edge',
      },
    },
    ssr: {
      noExternal: ['@radix-ui/*'],
    },
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/compile',
    },
  },
  build: {
    inlineStylesheets: 'always',
  },
});
