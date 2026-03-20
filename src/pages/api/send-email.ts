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

type FormPayload =
  | ContactPayload
  | ValoracionPayload
  | EstudioPayload
  | TrabajaPayload
  | ResenasPayload;

const VALID_FORM_TYPES = new Set([
  "contacto",
  "valoracion",
  "estudio_financiero",
  "trabaja-con-nosotros",
  "resenas",
]);

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

function buildNotificationEmail(data: FormPayload, ip: string): string {
  const now = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  let rows: Array<[string, string]> = [];
  let title = "Nuevo contacto web";

  if (data.formType === "contacto") {
    title = "Nuevo mensaje de contacto";
    const d = data as ContactPayload;
    rows = [
      ["Nombre", d.name],
      ["Email", d.email],
      ["Teléfono", d.phone],
      ["Asunto", d.subject || ""],
      ["Mensaje", truncate(d.message)],
    ];
  } else if (data.formType === "valoracion") {
    title = "Solicitud de valoración";
    const d = data as ValoracionPayload;
    rows = [
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
  } else if (data.formType === "estudio_financiero") {
    title = "Solicitud de estudio financiero";
    const d = data as EstudioPayload;
    rows = [
      ["Nombre", d.name],
      ["Email", d.email],
      ["Teléfono", d.phone],
      ["Situación", d.situation || ""],
      ["Ingresos", d.income || ""],
      ["Ahorros", d.savings || ""],
      ["Préstamos mensuales", d.monthlyLoans || ""],
      ["Plazo compra", d.timeline || ""],
    ];
  } else if (data.formType === "trabaja-con-nosotros") {
    title = "Nueva candidatura (Trabaja con nosotros)";
    const d = data as TrabajaPayload;
    rows = [
      ["Nombre", d.name],
      ["Email", d.email],
      ["Teléfono", d.phone],
      ["Mensaje", truncate(d.message)],
    ];
    if (d.attachment?.name) {
      rows.push(["CV adjunto", d.attachment.name]);
    }
  } else if (data.formType === "resenas") {
    title = "Nueva reseña web";
    const d = data as ResenasPayload;
    rows = [
      ["Nombre", d.name],
      ["Email", d.email],
      ["Valoración", `${d.rating}/5`],
      ["Feedback", truncate(d.feedback)],
    ];
  }

  rows.push(["Fecha", now], ["IP", ip]);

  return wrapTemplate(
    title,
    `<p>Se ha recibido un nuevo formulario desde la web:</p>${buildNotificationRows(rows)}`,
  );
}

function buildClientConfirmationEmail(data: FormPayload): { subject: string; html: string } {
  const name = escapeHtml("name" in data ? data.name : "");

  const templates: Record<string, { subject: string; body: string }> = {
    contacto: {
      subject: "Hemos recibido su consulta - Römenn Inmobiliaria",
      body: `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido su mensaje correctamente. Nuestro equipo lo revisará y se pondrá en contacto con usted a la mayor brevedad posible.</p>
        <p>Si su consulta es urgente, puede llamarnos al <strong>747 488 562</strong>.</p>`,
    },
    valoracion: {
      subject: "Solicitud de valoración recibida - Römenn Inmobiliaria",
      body: `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido su solicitud de valoración de inmueble. Un asesor especializado en su zona analizará los datos y se pondrá en contacto con usted <strong>en menos de 24 horas</strong>.</p>
        <p>Prepararemos un informe de valoración detallado basado en datos actuales de mercado, totalmente sin compromiso.</p>`,
    },
    estudio_financiero: {
      subject: "Solicitud de estudio financiero recibida - Römenn Inmobiliaria",
      body: `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido su solicitud de estudio financiero. Nuestro equipo analizará su situación y se pondrá en contacto con usted <strong>en las próximas 48 horas</strong> con las mejores opciones de financiación.</p>
        <p>El estudio es completamente gratuito y sin compromiso.</p>`,
    },
    "trabaja-con-nosotros": {
      subject: "Candidatura recibida - Römenn Inmobiliaria",
      body: `<p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido su candidatura correctamente. Nuestro equipo de Recursos Humanos revisará su perfil y, si encaja con alguna de nuestras vacantes, nos pondremos en contacto con usted.</p>
        <p>Agradecemos su interés en formar parte del equipo Römenn.</p>`,
    },
    resenas: {
      subject: "Gracias por su opinión - Römenn Inmobiliaria",
      body: `<p>Hola <strong>${name}</strong>,</p>
        <p>Gracias por tomarse el tiempo de dejarnos su opinión. Su feedback es muy valioso para nosotros y nos ayuda a mejorar continuamente.</p>`,
    },
  };

  const t = templates[data.formType] || templates.contacto;
  const html = wrapTemplate(
    "Confirmación de recepción",
    `${t.body}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0">
    <p style="font-size:13px;color:#64748b;">Este es un mensaje automático. Por favor, no responda a este correo.</p>
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
    if (!b.name || !b.email || !b.phone) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
    if (b.name.length > 255 || b.email.length > 255 || b.phone.length > 50) {
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
    const formTypeLabel: Record<string, string> = {
      contacto: "Contacto",
      valoracion: "Valoración",
      estudio_financiero: "Estudio Financiero",
      "trabaja-con-nosotros": "Candidatura",
      resenas: "Reseña",
    };
    const subjectPrefix = formTypeLabel[body.formType] || body.formType;

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
