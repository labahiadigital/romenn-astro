import type { MiddlewareHandler } from "astro";

const BLOCKED_PATH_PREFIXES = [
  "/.env",
  "/.git",
  "/.aws",
  "/.svn",
  "/wp-admin",
  "/wp-login",
  "/wp-content",
  "/wp-includes",
  "/phpinfo",
  "/phpmyadmin",
  "/cgi-bin",
  "/administrator",
  "/admin.php",
  "/solr",
  "/vendor",
  "/actuator",
  "/debug",
  "/console",
  "/telescope",
  "/elfinder",
  "/_ignition",
  "/xmlrpc.php",
  "/config.php",
];

const BLOCKED_EXTENSIONS = [".php", ".asp", ".aspx", ".jsp", ".cgi", ".sql"];

const ALLOWED_ORIGINS = [
  "https://romenninmobiliaria.es",
  "https://www.romenninmobiliaria.es",
];

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "0.0.0.0"
  );
}

function isBlockedPath(path: string): boolean {
  const lower = path.toLowerCase();
  if (lower.includes("..") || lower.includes("%2e%2e") || lower.includes("%00")) {
    return true;
  }
  for (const prefix of BLOCKED_PATH_PREFIXES) {
    if (lower.startsWith(prefix)) return true;
  }
  for (const ext of BLOCKED_EXTENSIONS) {
    if (lower.endsWith(ext)) return true;
  }
  return false;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

export const onRequest: MiddlewareHandler = async (context, next) => {
  const { pathname } = context.url;

  if (isBlockedPath(pathname)) {
    return new Response(null, { status: 404 });
  }

  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(context.request);

    if (!checkRateLimit(ip)) {
      return new Response(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Retry-After": "60" },
      });
    }

    if (context.request.method === "POST") {
      const origin = context.request.headers.get("origin");
      const isDev = import.meta.env.DEV;
      if (
        !isDev &&
        origin &&
        !ALLOWED_ORIGINS.some((o) => origin.startsWith(o))
      ) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        });
      }
    }
  }

  const response = await next();

  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  // Content Security Policy — incluye dominios necesarios para Google Tag Manager,
  // Google Analytics 4 (incluido el endpoint Consent Mode `google.com/ccm/collect`)
  // y la API propia. Se aplica solo a documentos HTML para no romper assets.
  const contentType = response.headers.get("Content-Type") || "";
  if (contentType.includes("text/html")) {
    const csp = [
      "default-src 'self'",
      // 'unsafe-inline' + 'unsafe-eval' los necesita GTM (loader inline y plantillas custom)
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://tagmanager.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net",
      "script-src-elem 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://ssl.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com https://tagmanager.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://*.g.doubleclick.net",
      "style-src 'self' 'unsafe-inline' https://tagmanager.google.com https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // connect-src: dominios solicitados por el cliente + GA4 + Google Ads/Conversions + API propia
      "connect-src 'self' https://www.google.com https://www.googleadservices.com https://googleads.g.doubleclick.net https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.g.doubleclick.net https://www.googletagmanager.com https://*.googletagmanager.com https://api.romenninmobiliaria.es",
      "frame-src 'self' https://www.googletagmanager.com https://www.google.com https://maps.google.com https://td.doubleclick.net https://bid.g.doubleclick.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests",
    ].join("; ");
    response.headers.set("Content-Security-Policy", csp);
  }

  return response;
};
