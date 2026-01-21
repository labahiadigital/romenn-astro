import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event));
});

// Función para obtener headers de caché según el tipo de archivo
function getCacheHeaders(pathname) {
  // Assets en /assets/ o /_astro/ - todos tienen hash, caché de 1 año
  if (pathname.startsWith('/assets/') || pathname.startsWith('/_astro/')) {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable',
    };
  }
  
  // Imágenes y videos sin hash - caché de 1 semana
  if (pathname.match(/\.(webp|jpg|jpeg|png|gif|svg|mp4|webm)$/i)) {
    return {
      'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
    };
  }
  
  // Fuentes - caché de 1 año
  if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    return {
      'Cache-Control': 'public, max-age=31536000, immutable',
    };
  }
  
  // HTML - sin caché para páginas estáticas (permiten updates rápidos)
  if (pathname.match(/\.html$/) || pathname === '/' || !pathname.match(/\.[a-zA-Z0-9]+$/)) {
    return {
      'Cache-Control': 'public, max-age=0, must-revalidate',
    };
  }
  
  // Por defecto - caché de 1 hora
  return {
    'Cache-Control': 'public, max-age=3600',
  };
}

async function handleRequest(event) {
  try {
    // Intentar servir el asset estático
    const response = await getAssetFromKV(event, {
      mapRequestToAsset: (request) => {
        const url = new URL(request.url);
        
        // Si es un archivo con extensión, servirlo directamente
        if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
          return request;
        }
        
        // Para rutas sin extensión, buscar el archivo .html correspondiente
        // Astro genera archivos como /nosotros/index.html para /nosotros
        let pathname = url.pathname;
        if (pathname.endsWith('/')) {
          pathname += 'index.html';
        } else {
          pathname += '/index.html';
        }
        
        return new Request(`${url.origin}${pathname}`, request);
      },
    });
    
    // Añadir headers de caché
    const url = new URL(event.request.url);
    const cacheHeaders = getCacheHeaders(url.pathname);
    
    const newResponse = new Response(response.body, response);
    Object.entries(cacheHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  } catch (e) {
    // Si no se encuentra el asset, intentar servir 404.html
    try {
      const url = new URL(event.request.url);
      const response = await getAssetFromKV(event, {
        mapRequestToAsset: () => new Request(`${url.origin}/404.html`, event.request),
      });
      
      const newResponse = new Response(response.body, {
        ...response,
        status: 404,
      });
      newResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      
      return newResponse;
    } catch (e) {
      return new Response('Not Found', { status: 404 });
    }
  }
}
