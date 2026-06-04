// Fuente única de verdad para los endpoints que usan los formularios y la API pública.
// Importar desde aquí en lugar de redeclarar las URLs en cada componente.

const API_BASE = import.meta.env.PUBLIC_API_URL || "https://api.romenninmobiliaria.es";

// Endpoint interno de Astro: envía los emails (Brevo) y firma el token HMAC.
export const EMAIL_API_URL = "/api/send-email";

// Backend/CRM público. Por defecto comparte host con la API de propiedades
// (mismo patrón /api/v1/public/*). PUBLIC_CRM_API_URL tiene prioridad si se define.
export const CRM_API_URL = import.meta.env.PUBLIC_CRM_API_URL || `${API_BASE}/api/v1`;
