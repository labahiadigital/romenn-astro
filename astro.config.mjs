import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';
import purgecss from 'astro-purgecss';
// astro-font integration removed - using local fonts via CSS instead

// https://astro.build/config
export default defineConfig({
  site: 'https://romenn.es',
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
      keyframes: false, // Mantener keyframes para animaciones
      safelist: {
        // Mantener clases usadas dinámicamente
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
          /^w-\[/,  // Clases de ancho arbitrario como w-[300px]
          /^h-\[/,  // Clases de altura arbitraria
          /^min-/,
          /^max-/,
        ],
        greedy: [
          /astro/,  // View transitions de Astro
          /radix/,  // Componentes Radix UI
          /sonner/, // Toaster
        ],
      },
    }),
    // Inline CSS crítico - debe ir al final
    (await import('@playform/inline')).default(),
  ],
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
    // Necesario para que purgecss funcione correctamente
    inlineStylesheets: 'never',
  },
});
