import { OGImageRoute } from 'astro-og-canvas';

// Definición manual de páginas con títulos y descripciones para generar imágenes OG
const pages: Record<string, { title: string; description: string }> = {
  'index': {
    title: 'Römenn Inmobiliaria',
    description: 'Inmobiliaria Boutique Internacional en Rivas-Vaciamadrid',
  },
  'nosotros': {
    title: 'Quiénes Somos',
    description: 'Más de 10 años cuidando de tus nuevos comienzos',
  },
  'servicios': {
    title: 'Servicios 360°',
    description: 'Ecosistema completo: Jurídico, Financiero, Reformas y más',
  },
  'vender': {
    title: 'Vender con Römenn',
    description: 'El arte de vender su propiedad al mejor precio',
  },
  'compradores': {
    title: 'Personal Shopper Inmobiliario',
    description: 'Encontramos lo que no está en los portales',
  },
  'propiedades': {
    title: 'Portfolio Exclusivo',
    description: 'Selección curada de propiedades con alma',
  },
  'valoracion': {
    title: 'Valoración Inteligente',
    description: 'Tasación emocional y análisis Big Data gratuito',
  },
  'contacto': {
    title: 'Contacto',
    description: 'Hablemos sobre su próximo hogar',
  },
  'experiencia': {
    title: 'Experiencia Römenn',
    description: 'Descubra nuestra metodología única',
  },
  'manifiesto': {
    title: 'Manifiesto',
    description: 'Nuestra declaración de intenciones y valores',
  },
  'compromiso': {
    title: 'Nuestro Compromiso',
    description: 'Un pacto de honor con cada cliente',
  },
  'metodologia': {
    title: 'Metodología Römenn',
    description: 'Ciencia de datos aplicada a la venta inmobiliaria',
  },
  'estudio-financiero': {
    title: 'Estudio Financiero',
    description: 'Análisis gratuito de su capacidad de inversión',
  },
  'cronogramas': {
    title: 'Blueprints',
    description: 'Cronogramas animados de su operación inmobiliaria',
  },
  'riesgos-ocultos': {
    title: 'Riesgos Ocultos',
    description: 'Lo que nadie le cuenta del mercado inmobiliario',
  },
  'extranjeria': {
    title: 'Extranjería',
    description: 'NIE, TIE y permisos de residencia',
  },
  'boca-boca': {
    title: 'Club de Embajadores',
    description: 'Programa de referidos exclusivo',
  },
  'resenas': {
    title: 'Experiencias',
    description: 'Lo que dicen nuestros clientes',
  },
  'casos-reales': {
    title: 'Historias Reales',
    description: 'Documentales de éxito inmobiliario',
  },
  'blog': {
    title: 'Journal',
    description: 'Tendencias y noticias del sector inmobiliario',
  },
  'trabaja-con-nosotros': {
    title: 'Trabaja con Nosotros',
    description: 'Únete al equipo Römenn',
  },
  'financiacion': {
    title: 'Financiación',
    description: 'Soluciones financieras para tu hogar',
  },
  'privacidad': {
    title: 'Política de Privacidad',
    description: 'Protección de datos y privacidad',
  },
  'aviso-legal': {
    title: 'Aviso Legal',
    description: 'Términos y condiciones de uso',
  },
  // Blog posts
  'blog/guia-compra-primera-vivienda': {
    title: 'Guía para Comprar tu Primera Vivienda',
    description: 'Todo lo que necesitas saber antes de comprar',
  },
  'blog/rivas-vaciamadrid-mejor-zona-para-vivir': {
    title: 'Rivas-Vaciamadrid: La Mejor Zona para Vivir',
    description: 'Descubre por qué Rivas es el lugar ideal',
  },
  'blog/tendencias-mercado-inmobiliario-2026': {
    title: 'Tendencias del Mercado Inmobiliario 2026',
    description: 'Lo que viene en el sector inmobiliario',
  },
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages: pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    logo: {
      path: './public/romenn-logo.png',
      size: [80],
    },
    bgGradient: [[26, 54, 93]], // #1a365d - Primary color (Azul Noche Profundo)
    border: {
      color: [59, 130, 246], // Accent color (Cobalto)
      width: 20,
      side: 'inline-start',
    },
    padding: 80,
    font: {
      title: {
        color: [255, 255, 255],
        size: 72,
        weight: 'Bold',
        lineHeight: 1.2,
      },
      description: {
        color: [200, 200, 220],
        size: 36,
        lineHeight: 1.4,
      },
    },
  }),
});
