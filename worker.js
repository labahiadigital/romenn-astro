// Worker en formato ES Modules para Cloudflare Workers
// Soporta secrets via env binding

import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const manifest = JSON.parse(manifestJSON);

// Configuración de email
const EMAIL_CONFIG = {
  sender: {
    name: "Römenn Inmobiliaria",
    email: "no-reply@romenninmobiliaria.es"
  },
  businessEmail: "romenn.inmo@gmail.com"
};

// Función para obtener headers de caché según el tipo de archivo
function getCacheHeaders(pathname) {
  if (pathname.startsWith('/assets/') || pathname.startsWith('/_astro/')) {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' };
  }
  if (pathname.match(/\.(webp|jpg|jpeg|png|gif|svg|mp4|webm)$/i)) {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' };
  }
  if (pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    return { 'Cache-Control': 'public, max-age=31536000, immutable' };
  }
  if (pathname.match(/\.html$/) || pathname === '/' || !pathname.match(/\.[a-zA-Z0-9]+$/)) {
    return { 'Cache-Control': 'public, max-age=0, must-revalidate' };
  }
  return { 'Cache-Control': 'public, max-age=3600' };
}

// Plantilla HTML para email al negocio
function getBusinessEmailTemplate(data) {
  const formTypeLabels = {
    contacto: "Formulario de Contacto",
    estudio_financiero: "Estudio Financiero",
    valoracion: "Solicitud de Valoración",
    resenas: "Feedback de Cliente"
  };

  const formLabel = formTypeLabels[data.formType] || "Formulario Web";
  
  let detailsHtml = "";
  
  if (data.formType === "contacto") {
    detailsHtml = `
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Asunto:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.subject || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Mensaje:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.message || "-"}</td></tr>
    `;
  } else if (data.formType === "estudio_financiero") {
    detailsHtml = `
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Situación laboral:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.situation || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Ingresos mensuales:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.income || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Ahorros disponibles:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.savings || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Gastos en préstamos/mes:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.monthlyLoans || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Plazo para comprar:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.timeline || "-"}</td></tr>
    `;
  } else if (data.formType === "valoracion") {
    detailsHtml = `
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Teléfono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.phone || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Tipo de propiedad:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.propertyType || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Dirección:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.address || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Metros construidos:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.sqmBuilt || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Motivo de venta:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.sellReason || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Plazo:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.timeline || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Info adicional:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.additionalInfo || "-"}</td></tr>
    `;
  } else if (data.formType === "resenas") {
    detailsHtml = `
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Nombre:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.name || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.email || "-"}</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Valoración:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.rating || "-"} estrellas</td></tr>
      <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Comentario:</strong></td><td style="padding: 10px; border-bottom: 1px solid #eee;">${data.feedback || "-"}</td></tr>
    `;
  }

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #d4af37; margin: 0; font-size: 24px;">Römenn Inmobiliaria</h1>
    <p style="color: #fff; margin: 10px 0 0 0; font-size: 14px;">${formLabel}</p>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #1a1a2e; margin-top: 0;">Nuevo mensaje recibido</h2>
    <p style="color: #666;">Se ha recibido una nueva solicitud desde la web:</p>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
      ${detailsHtml}
    </table>
    
    <p style="color: #666; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
      Fecha: ${new Date().toISOString()}
    </p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <p style="color: #666; font-size: 12px; margin: 0;">
      © ${new Date().getFullYear()} Römenn Inmobiliaria<br>
      Plaza León Felipe 6, posterior, local 2<br>
      28522 Rivas-Vaciamadrid, Madrid
    </p>
  </div>
</body>
</html>`;
}

// Plantilla HTML para email de confirmación al cliente
function getClientConfirmationTemplate(data) {
  const formTypeMessages = {
    contacto: {
      title: "Hemos recibido tu mensaje",
      message: "Gracias por contactar con Römenn Inmobiliaria. Hemos recibido tu consulta y nos pondremos en contacto contigo lo antes posible."
    },
    estudio_financiero: {
      title: "Solicitud de Estudio Financiero recibida",
      message: "Gracias por solicitar un estudio financiero con Römenn Inmobiliaria. Nuestro equipo analizará tu situación y se pondrá en contacto contigo para ofrecerte las mejores opciones de financiación."
    },
    valoracion: {
      title: "Solicitud de Valoración recibida",
      message: "Gracias por confiar en Römenn Inmobiliaria para valorar tu propiedad. Nuestro equipo de expertos se pondrá en contacto contigo para coordinar una visita y proporcionarte una valoración profesional."
    },
    resenas: {
      title: "Gracias por tu feedback",
      message: "Agradecemos que hayas compartido tu experiencia con nosotros. Tu opinión nos ayuda a mejorar nuestros servicios."
    }
  };

  const content = formTypeMessages[data.formType] || formTypeMessages.contacto;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #d4af37; margin: 0; font-size: 24px;">Römenn Inmobiliaria</h1>
  </div>
  
  <div style="background: #fff; padding: 30px; border: 1px solid #eee; border-top: none;">
    <h2 style="color: #1a1a2e; margin-top: 0;">¡Hola${data.name ? ` ${data.name}` : ''}!</h2>
    
    <h3 style="color: #d4af37;">${content.title}</h3>
    
    <p style="color: #666;">${content.message}</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <p style="margin: 0; color: #333;"><strong>¿Tienes alguna pregunta urgente?</strong></p>
      <p style="margin: 10px 0 0 0; color: #666;">
        Llámanos al <a href="tel:+34747488562" style="color: #d4af37; text-decoration: none;">747 488 562</a><br>
        o escríbenos por <a href="https://wa.me/34747488562" style="color: #25d366; text-decoration: none;">WhatsApp</a>
      </p>
    </div>
    
    <p style="color: #666;">
      Atentamente,<br>
      <strong style="color: #1a1a2e;">El equipo de Römenn Inmobiliaria</strong>
    </p>
  </div>
  
  <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #eee; border-top: none;">
    <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">
      <a href="https://romenn.es" style="color: #d4af37; text-decoration: none;">www.romenn.es</a>
    </p>
    <p style="color: #666; font-size: 12px; margin: 0;">
      © ${new Date().getFullYear()} Römenn Inmobiliaria<br>
      Plaza León Felipe 6, posterior, local 2<br>
      28522 Rivas-Vaciamadrid, Madrid
    </p>
    <p style="color: #999; font-size: 10px; margin: 15px 0 0 0;">
      Este email ha sido enviado automáticamente. Por favor, no respondas a este correo.
    </p>
  </div>
</body>
</html>`;
}

// Función para enviar email mediante Brevo API REST
async function sendEmailWithBrevo(apiKey, to, subject, htmlContent, replyTo = null) {
  const payload = {
    sender: EMAIL_CONFIG.sender,
    to: [{ email: to }],
    subject: subject,
    htmlContent: htmlContent
  };
  
  if (replyTo) {
    payload.replyTo = { email: replyTo };
  }

  console.log("Sending email to Brevo API...");
  console.log("To:", to);
  console.log("Subject:", subject);

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": apiKey,
      "content-type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const responseText = await response.text();
  console.log("Brevo API response status:", response.status);
  console.log("Brevo API response:", responseText);

  if (!response.ok) {
    throw new Error(`Brevo API error: ${response.status} - ${responseText}`);
  }

  return JSON.parse(responseText);
}

// Manejador de la API de envío de emails
async function handleSendEmail(request, env) {
  // Solo permitir POST
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  // Verificar que existe la API key
  const brevoApiKey = env.BREVO_API_KEY;
  console.log("BREVO_API_KEY exists:", !!brevoApiKey);
  
  if (!brevoApiKey) {
    console.error("BREVO_API_KEY not configured in environment");
    return new Response(JSON.stringify({ 
      error: "Email service not configured",
      details: "BREVO_API_KEY secret is not set. Please run: npx wrangler secret put BREVO_API_KEY"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const data = await request.json();
    console.log("Received form data:", JSON.stringify(data));
    
    // Validar datos mínimos
    if (!data.formType || !data.email) {
      return new Response(JSON.stringify({ error: "Missing required fields: formType, email" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const formTypeSubjects = {
      contacto: "Nuevo mensaje de contacto",
      estudio_financiero: "Nueva solicitud de estudio financiero",
      valoracion: "Nueva solicitud de valoración",
      resenas: "Nuevo feedback de cliente"
    };

    const subject = formTypeSubjects[data.formType] || "Nuevo mensaje desde la web";

    // 1. Enviar email al negocio
    console.log("Sending business email...");
    const businessEmailHtml = getBusinessEmailTemplate(data);
    const businessResult = await sendEmailWithBrevo(
      brevoApiKey,
      EMAIL_CONFIG.businessEmail,
      `[Römenn Web] ${subject}`,
      businessEmailHtml,
      data.email
    );
    console.log("Business email sent:", businessResult);

    // 2. Enviar email de confirmación al cliente
    console.log("Sending client confirmation email...");
    const clientEmailHtml = getClientConfirmationTemplate(data);
    const clientSubjects = {
      contacto: "Hemos recibido tu mensaje - Römenn Inmobiliaria",
      estudio_financiero: "Tu solicitud de estudio financiero - Römenn Inmobiliaria",
      valoracion: "Tu solicitud de valoración - Römenn Inmobiliaria",
      resenas: "Gracias por tu feedback - Römenn Inmobiliaria"
    };
    
    const clientResult = await sendEmailWithBrevo(
      brevoApiKey,
      data.email,
      clientSubjects[data.formType] || "Confirmación - Römenn Inmobiliaria",
      clientEmailHtml
    );
    console.log("Client email sent:", clientResult);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Emails enviados correctamente",
      businessMessageId: businessResult.messageId,
      clientMessageId: clientResult.messageId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(JSON.stringify({ 
      error: "Error sending email", 
      details: error.message 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Manejador de CORS preflight
function handleOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}

// Añadir headers CORS a response
function addCorsHeaders(response) {
  const newHeaders = new Headers(response.headers);
  newHeaders.set("Access-Control-Allow-Origin", "*");
  newHeaders.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  newHeaders.set("Access-Control-Allow-Headers", "Content-Type");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  });
}

// Export default handler (ES Modules format)
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return handleOptions();
    }
    
    // API endpoint para enviar emails
    if (url.pathname === "/api/send-email") {
      const response = await handleSendEmail(request, env);
      return addCorsHeaders(response);
    }

    // Servir assets estáticos
    try {
      const response = await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: manifest,
          mapRequestToAsset: (req) => {
            const url = new URL(req.url);
            
            // Si es un archivo con extensión, servirlo directamente
            if (url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
              return req;
            }
            
            // Para rutas sin extensión, buscar el archivo .html correspondiente
            let pathname = url.pathname;
            if (pathname.endsWith('/')) {
              pathname += 'index.html';
            } else {
              pathname += '/index.html';
            }
            
            return new Request(`${url.origin}${pathname}`, req);
          },
        }
      );
      
      // Añadir headers de caché
      const cacheHeaders = getCacheHeaders(url.pathname);
      const newHeaders = new Headers(response.headers);
      Object.entries(cacheHeaders).forEach(([key, value]) => {
        newHeaders.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    } catch (e) {
      // Si no se encuentra el asset, servir 404.html
      try {
        const notFoundResponse = await getAssetFromKV(
          {
            request: new Request(`${url.origin}/404.html`, request),
            waitUntil: ctx.waitUntil.bind(ctx),
          },
          {
            ASSET_NAMESPACE: env.__STATIC_CONTENT,
            ASSET_MANIFEST: manifest,
          }
        );
        
        return new Response(notFoundResponse.body, {
          status: 404,
          headers: notFoundResponse.headers
        });
      } catch (e) {
        return new Response('Not Found', { status: 404 });
      }
    }
  }
};
