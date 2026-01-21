# Römenn - Astro + React

Sitio web de Römenn International Realty, migrado de React/Vite a **Astro** con **islas de React** para optimización máxima.

## Stack Tecnológico

- **[Astro](https://astro.build/)** - Framework de generación estática con hidratación parcial
- **[React](https://react.dev/)** - Componentes interactivos (islas)
- **[Tailwind CSS](https://tailwindcss.com/)** - Estilos utilitarios
- **[Radix UI](https://www.radix-ui.com/)** - Componentes accesibles (shadcn/ui)
- **[Framer Motion](https://www.framer.com/motion/)** - Animaciones
- **[Lucide React](https://lucide.dev/)** - Iconos

## Ventajas de la Migración

### Rendimiento
- **0 JS por defecto** - Las páginas estáticas no envían JavaScript al cliente
- **Hidratación parcial** - Solo los componentes interactivos cargan JS
- **Optimización de imágenes** - Sharp integrado para procesamiento de imágenes
- **CSS crítico inline** - Estilos críticos embebidos en HTML

### SEO
- **SSG (Static Site Generation)** - HTML pre-renderizado para cada página
- **View Transitions** - Navegación fluida nativa del navegador
- **Meta tags optimizados** - Open Graph y SEO configurados

### DX (Developer Experience)
- **TypeScript estricto** - Tipado completo
- **Hot Module Replacement** - Recarga instantánea en desarrollo
- **Estructura clara** - Separación de componentes estáticos e interactivos

## Estructura del Proyecto

```
src/
├── assets/          # Imágenes y videos (procesados por Astro)
├── components/      # Componentes React (islas interactivas)
│   └── ui/          # Componentes shadcn/ui
├── layouts/         # Layouts Astro
├── lib/             # Utilidades (cn, etc.)
├── pages/           # Rutas (file-based routing)
└── styles/          # CSS global
```

## Comandos

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Verificar tipos
npm run check
```

## Componentes Interactivos (Islas)

Los siguientes componentes se hidratan en el cliente:

- `Header.tsx` - Navegación con menú móvil y scroll detection
- `Hero.tsx` - Animaciones de entrada con Framer Motion
- `SmartSearch.tsx` - Filtros interactivos de búsqueda
- `Guias.tsx` - Animaciones de scroll con Framer Motion
- Componentes UI de shadcn/ui (Button, Tooltip, etc.)

## Directivas de Hidratación

```astro
<!-- Hidrata inmediatamente (componentes críticos) -->
<Header client:load />

<!-- Hidrata cuando es visible (lazy loading) -->
<SmartSearch client:visible />

<!-- Hidrata cuando el navegador está idle -->
<Guias client:idle />
```

## Migración desde React/Vite

Este proyecto fue migrado desde `capital-home-beginnings` (React + Vite).

### Cambios principales:
1. **Router** - De React Router a file-based routing de Astro
2. **Componentes estáticos** - Convertidos a `.astro` (Footer, PropertyCard, etc.)
3. **Componentes interactivos** - Mantenidos como `.tsx` con directivas `client:*`
4. **Estilos** - Misma configuración de Tailwind, sin cambios
5. **Assets** - Procesados por Astro Image para optimización automática

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El servidor se ejecuta en `http://localhost:3000`

## Producción

```bash
# Generar build estático
npm run build

# Los archivos se generan en ./dist/
```

## Notas

- Los componentes de shadcn/ui se mantienen como React para preservar la interactividad
- Las páginas estáticas (Nosotros, Manifiesto, etc.) son 100% Astro sin JS
- El video del Hero se carga con `preload="none"` para optimizar el LCP
