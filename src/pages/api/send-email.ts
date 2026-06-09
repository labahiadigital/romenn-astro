export const prerender = false;

import type { APIRoute } from "astro";

// ────────────────────────────────────────────
// Types
// ────────────────────────────────────────────

interface BasePayload {
  formType: string;
  name: string;
  email: string;
  phone: string;
}

interface ContactPayload extends BasePayload {
  formType: "contacto";
  subject?: string;
  message?: string;
}

interface ValoracionPayload extends BasePayload {
  formType: "valoracion";
  propertyType?: string;
  address?: string;
  sqmBuilt?: string;
  sellReason?: string;
  timeline?: string;
  additionalInfo?: string;
}

interface EstudioPayload extends BasePayload {
  formType: "estudio_financiero";
  situation?: string;
  income?: string;
  savings?: string;
  monthlyLoans?: string;
  timeline?: string;
}

interface TrabajaPayload extends BasePayload {
  formType: "trabaja-con-nosotros";
  message?: string;
  attachment?: { name: string; content: string; type: string };
}

interface ResenasPayload {
  formType: "resenas";
  name: string;
  email: string;
  rating: string;
  feedback: string;
}

interface OffMarketPayload extends BasePayload {
  formType: "off_market";
  opportunityTypes?: string;
  zone?: string;
  budget?: string;
  profitability?: string;
  horizon?: string;
  tenantAccepted?: string;
  comments?: string;
}

interface PersonalShopperPayload extends BasePayload {
  formType: "personal_shopper";
  propertyType?: string;
  zones?: string;
  budget?: string;
  bedrooms?: string;
  timeline?: string;
  financing?: string;
  notes?: string;
}

type FormPayload =
  | ContactPayload
  | ValoracionPayload
  | EstudioPayload
  | TrabajaPayload
  | ResenasPayload
  | OffMarketPayload
  | PersonalShopperPayload;

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

function escapeHtml(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function truncate(str: string | undefined | null, max = 2000): string {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) + "…" : str;
}

async function generateHmacToken(
  secret: string,
  formType: string,
): Promise<{ token: string; timestamp: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const message = `${timestamp}:${formType}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(message),
  );
  const token = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return { token, timestamp };
}

// ────────────────────────────────────────────
// Brevo email sender
// ────────────────────────────────────────────

async function sendBrevoEmail(
  apiKey: string,
  to: string,
  subject: string,
  htmlContent: string,
  senderEmail: string,
  senderName: string,
  replyTo?: string,
  attachments?: Array<{ name: string; content: string }>,
): Promise<boolean> {
  const payload: Record<string, unknown> = {
    sender: { name: senderName, email: senderEmail },
    to: [{ email: to }],
    subject,
    htmlContent,
  };
  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }
  if (attachments?.length) {
    payload.attachment = attachments;
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

// ────────────────────────────────────────────
// Email HTML templates
// ────────────────────────────────────────────

function wrapTemplate(title: string, bodyHtml: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
body{font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;margin:0;padding:0;background:#f4f4f5;color:#1e293b}
.container{max-width:600px;margin:0 auto;padding:20px}
.header{background:linear-gradient(135deg,#10b981,#059669);color:#fff;padding:24px;text-align:center;border-radius:12px 12px 0 0}
.header h1{margin:0;font-size:20px}
.content{background:#fff;padding:24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px}
table.data{width:100%;border-collapse:collapse;margin:16px 0}
table.data td{padding:8px 12px;border-bottom:1px solid #f1f5f9;vertical-align:top}
table.data td:first-child{font-weight:600;color:#64748b;width:40%;font-size:13px;text-transform:uppercase}
.footer{text-align:center;padding:16px;font-size:12px;color:#94a3b8}
</style></head><body><div class="container">
<div class="header"><h1>${title}</h1></div>
<div class="content">${bodyHtml}</div>
<div class="footer">&copy; ${new Date().getFullYear()} R&ouml;menn Inmobiliaria</div>
</div></body></html>`;
}

function buildNotificationRows(rows: Array<[string, string]>): string {
  return `<table class="data">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;
}

// ────────────────────────────────────────────
// Registro por tipo de formulario
// Todo lo que distingue a un formulario (etiqueta, título de la notificación
// interna, filas que se muestran y email de confirmación al cliente) vive en
// una sola entrada. Añadir un formulario = añadir su interface + una entrada aquí.
// ────────────────────────────────────────────

interface FormSpec {
  // Prefijo del asunto en la notificación interna ([Web] <label>: <nombre>).
  label: string;
  // Título de la cabecera del email de notificación interno.
  notificationTitle: string;
  // Filas (clave/valor) que se listan en la notificación interna.
  rows: (data: FormPayload) => Array<[string, string]>;
  // Email de confirmación que recibe el cliente (omitido en formularios anónimos).
  confirmation: { subject: string; body: (name: string) => string };
}

const FORM_SPECS: Record<string, FormSpec> = {
  contacto: {
    label: "Contacto",
    notificationTitle: "Nuevo mensaje de contacto",
    rows: (data) => {
      const d = data as ContactPayload;
      return [
        ["Nombre", d.name],
        ["Email", d.email],
        ["Teléfono", d.phone],
        ["Asunto", d.subject || ""],
        ["Mensaje", truncate(d.message)],
      ];
    },
    confirmation: {
      subject: "Hemos recibido tu consulta - Römenn Inmobiliaria",
      body: (name) => `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido tu mensaje correctamente. Nuestro equipo lo revisará y se pondrá en contacto contigo a la mayor brevedad posible.</p>
        <p>Si tu consulta es urgente, puedes llamarnos al <strong>747 488 562</strong>.</p>`,
    },
  },
  valoracion: {
    label: "Valoración",
    notificationTitle: "Solicitud de valoración",
    rows: (data) => {
      const d = data as ValoracionPayload;
      return [
        ["Nombre", d.name],
        ["Email", d.email],
        ["Teléfono", d.phone],
        ["Tipo inmueble", d.propertyType || ""],
        ["Dirección", d.address || ""],
        ["Metros construidos", d.sqmBuilt || ""],
        ["Motivo venta", d.sellReason || ""],
        ["Plazo", d.timeline || ""],
        ["Info adicional", truncate(d.additionalInfo)],
      ];
    },
    confirmation: {
      subject: "Solicitud de valoración recibida - Römenn Inmobiliaria",
      body: (name) => `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido tu solicitud de valoración de inmueble. Un asesor especializado en tu zona analizará los datos y se pondrá en contacto contigo <strong>en menos de 24 horas</strong>.</p>
        <p>Prepararemos un informe de valoración detallado basado en datos actuales de mercado, totalmente sin compromiso.</p>`,
    },
  },
  estudio_financiero: {
    label: "Estudio Financiero",
    notificationTitle: "Solicitud de estudio financiero",
    rows: (data) => {
      const d = data as EstudioPayload;
      return [
        ["Nombre", d.name],
        ["Email", d.email],
        ["Teléfono", d.phone],
        ["Situación", d.situation || ""],
        ["Ingresos", d.income || ""],
        ["Ahorros", d.savings || ""],
        ["Préstamos mensuales", d.monthlyLoans || ""],
        ["Plazo compra", d.timeline || ""],
      ];
    },
    confirmation: {
      subject: "Solicitud de estudio financiero recibida - Römenn Inmobiliaria",
      body: (name) => `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido tu solicitud de estudio financiero. Nuestro equipo analizará tu situación y se pondrá en contacto contigo <strong>en las próximas 48 horas</strong> con las mejores opciones de financiación.</p>
        <p>El estudio es completamente gratuito y sin compromiso.</p>`,
    },
  },
  "trabaja-con-nosotros": {
    label: "Candidatura",
    notificationTitle: "Nueva candidatura (Trabaja con nosotros)",
    rows: (data) => {
      const d = data as TrabajaPayload;
      const r: Array<[string, string]> = [
        ["Nombre", d.name],
        ["Email", d.email],
        ["Teléfono", d.phone],
        ["Mensaje", truncate(d.message)],
      ];
      if (d.attachment?.name) {
        r.push(["CV adjunto", d.attachment.name]);
      }
      return r;
    },
    confirmation: {
      subject: "Candidatura recibida - Römenn Inmobiliaria",
      body: (name) => `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido tu candidatura correctamente. Nuestro equipo de Recursos Humanos revisará tu perfil y, si encaja con alguna de nuestras vacantes, nos pondremos en contacto contigo.</p>
        <p>Agradecemos tu interés en formar parte del equipo Römenn.</p>`,
    },
  },
  resenas: {
    label: "Reseña",
    notificationTitle: "Nueva reseña web",
    rows: (data) => {
      const d = data as ResenasPayload;
      return [
        ["Nombre", d.name],
        ["Email", d.email],
        ["Valoración", `${d.rating}/5`],
        ["Feedback", truncate(d.feedback)],
      ];
    },
    confirmation: {
      subject: "Gracias por tu opinión - Römenn Inmobiliaria",
      body: (name) => `<p>Hola <strong>${name}</strong>,</p>
        <p>Gracias por tomarte el tiempo de dejarnos tu opinión. Tu feedback es muy valioso para nosotros y nos ayuda a mejorar continuamente.</p>`,
    },
  },
  off_market: {
    label: "Off-Market",
    notificationTitle: "Nuevo inversor Off-Market",
    rows: (data) => {
      const d = data as OffMarketPayload;
      return [
        ["Nombre", d.name],
        ["Email", d.email],
        ["Teléfono", d.phone],
        ["Tipo de oportunidad", d.opportunityTypes || ""],
        ["Zona de interés", d.zone || ""],
        ["Presupuesto", d.budget || ""],
        ["Rentabilidad buscada", d.profitability || ""],
        ["Horizonte inversión", d.horizon || ""],
        ["Acepta inquilino", d.tenantAccepted || ""],
        ["Comentarios", truncate(d.comments)],
      ];
    },
    confirmation: {
      subject: "Bienvenido al círculo Off-Market - Römenn Inmobiliaria",
      body: (name) => `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido tu perfil de inversor y ya formas parte de nuestro círculo Off-Market. Te tendremos presente: cuando llegue a nuestras manos una oportunidad que encaje contigo, te la presentaremos de forma personal y directa.</p>
        <p>Sin escaparate y sin ruido.</p>`,
    },
  },
  personal_shopper: {
    label: "Personal Shopper",
    notificationTitle: "Nuevo perfil de comprador (Personal Shopper)",
    rows: (data) => {
      const d = data as PersonalShopperPayload;
      return [
        ["Nombre", d.name],
        ["Email", d.email],
        ["Teléfono", d.phone],
        ["Tipo de propiedad", d.propertyType || ""],
        ["Zonas", d.zones || ""],
        ["Presupuesto", d.budget || ""],
        ["Habitaciones", d.bedrooms || ""],
        ["Plazo mudanza", d.timeline || ""],
        ["Financiación", d.financing || ""],
        ["Notas", truncate(d.notes)],
      ];
    },
    confirmation: {
      subject: "Tu Personal Shopper está en marcha - Römenn Inmobiliaria",
      body: (name) => `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos activado tu búsqueda personalizada. Nuestro algoritmo ya está rastreando propiedades que encajan con tus criterios, incluyendo oportunidades Off-Market.</p>
        <p>Un Personal Shopper especializado se pondrá en contacto contigo muy pronto para afinar la búsqueda y mostrarte las primeras opciones.</p>`,
    },
  },
};

const VALID_FORM_TYPES = new Set(Object.keys(FORM_SPECS));

function buildNotificationEmail(data: FormPayload, ip: string): string {
  const now = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  const spec = FORM_SPECS[data.formType];
  const title = spec?.notificationTitle ?? "Nuevo contacto web";
  const rows = spec ? spec.rows(data) : [];

  rows.push(["Fecha", now], ["IP", ip]);

  return wrapTemplate(
    title,
    `<p>Se ha recibido un nuevo formulario desde la web:</p>${buildNotificationRows(rows)}`,
  );
}

function buildClientConfirmationEmail(data: FormPayload): { subject: string; html: string } {
  const name = escapeHtml("name" in data ? data.name : "");
  const t = (FORM_SPECS[data.formType] ?? FORM_SPECS.contacto).confirmation;

  const html = wrapTemplate(
    "Confirmación de recepción",
    `${t.body(name)}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
    <p style="font-size:13px;color:#64748b;">Este es un mensaje automático. Por favor, no respondas a este correo.</p>
    <p style="font-size:13px;color:#64748b;"><strong>Römenn Inmobiliaria</strong><br>
    Tel: 747 488 562<br>
    <a href="https://romenninmobiliaria.es" style="color:#10b981;">romenninmobiliaria.es</a></p>`,
  );

  return { subject: t.subject, html };
}

// ────────────────────────────────────────────
// API Route Handler
// ────────────────────────────────────────────

export const POST: APIRoute = async (context) => {
  const { request } = context;

  let cfEnv: Record<string, string> = {};
  try {
    const { env } = await import("cloudflare:workers");
    cfEnv = env as unknown as Record<string, string>;
  } catch {
    // Fallback for non-Cloudflare environments (dev without workerd)
  }
  const getEnv = (key: string): string =>
    cfEnv[key] || (import.meta.env?.[key] as string) || "";

  const BREVO_API_KEY = getEnv("BREVO_API_KEY");
  const SENDER_EMAIL = getEnv("BREVO_SENDER_EMAIL") || "noreply@romenn.es";
  const SENDER_NAME = "Römenn Inmobiliaria";
  const NOTIFICATION_EMAIL = getEnv("NOTIFICATION_EMAIL") || "romenn.inmo@gmail.com";
  const HMAC_SECRET = getEnv("FORM_HMAC_SECRET");

  if (!BREVO_API_KEY) {
    console.error("BREVO_API_KEY not configured");
    return new Response(
      JSON.stringify({ success: false, error: "Email service not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let body: FormPayload;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  if (!body.formType || !VALID_FORM_TYPES.has(body.formType)) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid form type" }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const requiresContact = body.formType !== "resenas";
  if (requiresContact) {
    const b = body as BasePayload;
    // El email es opcional (p. ej. la landing de captación /vender-tu-casa pide
    // solo nombre + teléfono). El correo de confirmación al cliente y el replyTo
    // ya están condicionados a que exista email más abajo.
    if (!b.name || !b.phone) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (b.name.length > 255 || (b.email && b.email.length > 255) || b.phone.length > 50) {
      return new Response(
        JSON.stringify({ success: false, error: "Field too long" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  const clientIp =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  try {
    const notificationHtml = buildNotificationEmail(body, clientIp);
    const subjectPrefix = FORM_SPECS[body.formType]?.label || body.formType;

    const attachments: Array<{ name: string; content: string }> | undefined =
      body.formType === "trabaja-con-nosotros" &&
      (body as TrabajaPayload).attachment?.content
        ? [
            {
              name: (body as TrabajaPayload).attachment!.name,
              content: (body as TrabajaPayload).attachment!.content,
            },
          ]
        : undefined;

    const clientEmail = "email" in body ? body.email : undefined;
    const replyTo = clientEmail || undefined;

    const notifOk = await sendBrevoEmail(
      BREVO_API_KEY,
      NOTIFICATION_EMAIL,
      `[Web] ${subjectPrefix}: ${"name" in body ? body.name : "Anónimo"}`,
      notificationHtml,
      SENDER_EMAIL,
      SENDER_NAME,
      replyTo,
      attachments,
    );

    let clientOk = true;
    if (clientEmail) {
      const confirmation = buildClientConfirmationEmail(body);
      clientOk = await sendBrevoEmail(
        BREVO_API_KEY,
        clientEmail,
        confirmation.subject,
        confirmation.html,
        SENDER_EMAIL,
        SENDER_NAME,
      );
    }

    let hmacToken: string | undefined;
    let hmacTimestamp: string | undefined;
    if (HMAC_SECRET && body.formType !== "resenas") {
      const hmac = await generateHmacToken(HMAC_SECRET, body.formType);
      hmacToken = hmac.token;
      hmacTimestamp = hmac.timestamp;
    }

    return new Response(
      JSON.stringify({
        success: notifOk,
        clientEmailSent: clientOk,
        hmacToken,
        hmacTimestamp,
      }),
      { status: notifOk ? 200 : 500, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Send email error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};
