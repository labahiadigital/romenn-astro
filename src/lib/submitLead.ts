import { CRM_API_URL, EMAIL_API_URL } from "@/lib/config";

export interface SubmitLeadOptions {
  // Payload enviado a /api/send-email. Debe incluir `formType`.
  email: Record<string, unknown>;
  // Payload del lead para el CRM. Si se omite, no se crea lead
  // (formularios solo-email, p. ej. reseñas o "trabaja con nosotros").
  // Los parámetros UTM se añaden automáticamente.
  crm?: Record<string, unknown>;
}

// Coreografía única de envío de formularios de la web:
//   1. POST a /api/send-email (Brevo) → devuelve el token HMAC.
//   2. (opcional) POST del lead al CRM con cabeceras X-Form-Token + UTM.
//
// Lanza si el envío del email falla. El fallo del CRM no es bloqueante: se
// registra como warning para no romper la confirmación al usuario.
export async function submitLead({ email, crm }: SubmitLeadOptions): Promise<void> {
  const emailRes = await fetch(EMAIL_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(email),
  });

  if (!emailRes.ok) {
    throw new Error(`Email API respondió con status ${emailRes.status}`);
  }

  if (!crm) return;

  const emailResult = (await emailRes
    .json()
    .catch(() => ({}))) as { hmacToken?: string; hmacTimestamp?: string };

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (emailResult.hmacToken) {
    headers["X-Form-Token"] = emailResult.hmacToken;
    headers["X-Form-Timestamp"] = emailResult.hmacTimestamp ?? "";
  }

  await fetch(`${CRM_API_URL}/public/leads`, {
    method: "POST",
    headers,
    body: JSON.stringify({ ...crm, ...getUtmParams() }),
  }).catch((err) => console.warn("CRM lead creation failed:", err));
}

function getUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source") || "",
    utm_medium: p.get("utm_medium") || "",
    utm_campaign: p.get("utm_campaign") || "",
  };
}
