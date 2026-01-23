import type { APIRoute } from 'astro';

export const prerender = false;

// Brevo (Sendinblue) API configuration
const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const RECIPIENT_EMAIL = 'romenn.inmo@gmail.com';
const SENDER_EMAIL = 'no-reply@romenninmobiliaria.es';
const SENDER_NAME = 'Römenn Inmobiliaria';

interface FormData {
  formType: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  [key: string]: string | undefined;
}

// Templates for different form types
const getEmailTemplate = (data: FormData): { subject: string; htmlContent: string } => {
  const { formType, name, email, phone, ...rest } = data;
  
  const baseStyles = `
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #1a365d; color: white; padding: 30px; text-align: center; }
      .content { padding: 30px; background: #f8fafc; }
      .field { margin-bottom: 15px; }
      .label { font-weight: 600; color: #374151; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
      .value { color: #111827; margin-top: 5px; }
      .footer { padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
    </style>
  `;

  let subject = '';
  let specificContent = '';

  switch (formType) {
    case 'contacto':
      subject = `Nuevo contacto de ${name}`;
      specificContent = `
        <div class="field">
          <div class="label">Asunto</div>
          <div class="value">${rest.subject || 'Sin especificar'}</div>
        </div>
        <div class="field">
          <div class="label">Mensaje</div>
          <div class="value">${rest.message || 'Sin mensaje'}</div>
        </div>
      `;
      break;

    case 'estudio_financiero':
      subject = `Nueva solicitud de Estudio Financiero - ${name}`;
      specificContent = `
        <div class="field">
          <div class="label">Situación</div>
          <div class="value">${rest.situation || 'No especificada'}</div>
        </div>
        <div class="field">
          <div class="label">Ingresos mensuales</div>
          <div class="value">${rest.income || 'No especificado'}</div>
        </div>
        <div class="field">
          <div class="label">Ahorros disponibles</div>
          <div class="value">${rest.savings || 'No especificado'}</div>
        </div>
        <div class="field">
          <div class="label">Gastos en préstamos al mes</div>
          <div class="value">${rest.monthlyLoans || 'No especificado'}</div>
        </div>
        <div class="field">
          <div class="label">Plazo de compra</div>
          <div class="value">${rest.timeline || 'No especificado'}</div>
        </div>
      `;
      break;

    case 'valoracion':
      subject = `Nueva solicitud de Valoración - ${name}`;
      specificContent = `
        <div class="field">
          <div class="label">Tipo de inmueble</div>
          <div class="value">${rest.propertyType || 'No especificado'}</div>
        </div>
        <div class="field">
          <div class="label">Dirección</div>
          <div class="value">${rest.address || 'No especificada'}</div>
        </div>
        <div class="field">
          <div class="label">Metros construidos</div>
          <div class="value">${rest.sqmBuilt || 'No especificado'} m²</div>
        </div>
        <div class="field">
          <div class="label">Motivo de venta</div>
          <div class="value">${rest.sellReason || 'No especificado'}</div>
        </div>
        <div class="field">
          <div class="label">Plazo deseado</div>
          <div class="value">${rest.timeline || 'No especificado'}</div>
        </div>
        ${rest.additionalInfo ? `
        <div class="field">
          <div class="label">Información adicional</div>
          <div class="value">${rest.additionalInfo}</div>
        </div>
        ` : ''}
      `;
      break;

    case 'resenas':
      subject = `Nuevo feedback de cliente - ${name}`;
      specificContent = `
        <div class="field">
          <div class="label">Valoración</div>
          <div class="value">${rest.rating || 'No especificada'} estrellas</div>
        </div>
        <div class="field">
          <div class="label">Comentario</div>
          <div class="value">${rest.feedback || 'Sin comentarios'}</div>
        </div>
      `;
      break;

    default:
      subject = `Nuevo formulario de ${name}`;
      specificContent = Object.entries(rest)
        .filter(([_, value]) => value)
        .map(([key, value]) => `
          <div class="field">
            <div class="label">${key}</div>
            <div class="value">${value}</div>
          </div>
        `).join('');
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      ${baseStyles}
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">Römenn Inmobiliaria</h1>
          <p style="margin: 10px 0 0; opacity: 0.8;">Nuevo formulario recibido</p>
        </div>
        <div class="content">
          <h2 style="margin-top: 0; color: #1a365d;">Datos del contacto</h2>
          <div class="field">
            <div class="label">Nombre</div>
            <div class="value">${name}</div>
          </div>
          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${email}">${email}</a></div>
          </div>
          ${phone ? `
          <div class="field">
            <div class="label">Teléfono</div>
            <div class="value"><a href="tel:${phone}">${phone}</a></div>
          </div>
          ` : ''}
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          
          <h2 style="color: #1a365d;">Detalles del formulario</h2>
          ${specificContent}
        </div>
        <div class="footer">
          <p>Este email ha sido enviado automáticamente desde el formulario de la web.</p>
          <p>© ${new Date().getFullYear()} Römenn Inmobiliaria</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { subject, htmlContent };
};

// Template for confirmation email to client
const getConfirmationTemplate = (data: FormData): { subject: string; htmlContent: string } => {
  const { formType, name, email } = data;
  
  let message = '';
  switch (formType) {
    case 'contacto':
      message = 'Hemos recibido su mensaje y le responderemos a la mayor brevedad posible.';
      break;
    case 'estudio_financiero':
      message = 'Hemos recibido su solicitud de estudio financiero. Un asesor especializado le contactará en menos de 48 horas para analizar su situación.';
      break;
    case 'valoracion':
      message = 'Hemos recibido su solicitud de valoración. Un experto en su zona le contactará en menos de 24 horas para concretar los siguientes pasos.';
      break;
    case 'resenas':
      message = 'Gracias por compartir su experiencia con nosotros. Su opinión es muy valiosa para seguir mejorando.';
      break;
    default:
      message = 'Hemos recibido su solicitud y le contactaremos lo antes posible.';
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1a365d; color: white; padding: 40px 30px; text-align: center; }
        .content { padding: 40px 30px; background: #ffffff; }
        .footer { padding: 30px; text-align: center; font-size: 12px; color: #6b7280; background: #f8fafc; }
        .btn { display: inline-block; background: #1a365d; color: white !important; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; }
      </style>
    </head>
    <body style="background: #f1f5f9; margin: 0; padding: 20px;">
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">Römenn</h1>
          <p style="margin: 10px 0 0; opacity: 0.8; font-size: 14px;">Inmobiliaria Boutique Internacional</p>
        </div>
        <div class="content">
          <h2 style="margin-top: 0; color: #1a365d;">¡Gracias por contactarnos, ${name}!</h2>
          <p style="color: #374151; line-height: 1.6; font-size: 16px;">
            ${message}
          </p>
          <p style="color: #374151; line-height: 1.6; font-size: 16px;">
            Mientras tanto, puede explorar nuestros servicios o llamarnos directamente si tiene alguna urgencia.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://romenninmobiliaria.es" class="btn">Visitar nuestra web</a>
          </div>
          <p style="color: #6b7280; font-size: 14px;">
            Si tiene cualquier pregunta, no dude en llamarnos al <strong>747 488 562</strong> o escribirnos a <a href="mailto:romenn.inmo@gmail.com">romenn.inmo@gmail.com</a>
          </p>
        </div>
        <div class="footer">
          <p style="margin: 0;">CONSULTING INMOBILIARIO RIVAS VACIAMADRID SLU</p>
          <p style="margin: 5px 0;">Plaza León Felipe 6, posterior, local 2, 28522 Rivas-Vaciamadrid, Madrid</p>
          <p style="margin: 15px 0 0;">© ${new Date().getFullYear()} Römenn Inmobiliaria. Todos los derechos reservados.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return { 
    subject: `Hemos recibido su solicitud - Römenn Inmobiliaria`,
    htmlContent 
  };
};

export const POST: APIRoute = async ({ request }) => {
  try {
    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY not configured');
      return new Response(JSON.stringify({ error: 'Email service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data: FormData = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.formType) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Send notification to business
    const businessEmail = getEmailTemplate(data);
    const businessResponse = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: RECIPIENT_EMAIL, name: 'Römenn Inmobiliaria' }],
        replyTo: { email: data.email, name: data.name },
        subject: businessEmail.subject,
        htmlContent: businessEmail.htmlContent
      })
    });

    if (!businessResponse.ok) {
      const errorText = await businessResponse.text();
      console.error('Brevo business email error:', errorText);
      throw new Error('Failed to send business notification');
    }

    // Send confirmation to client
    const confirmationEmail = getConfirmationTemplate(data);
    const confirmationResponse = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: SENDER_NAME, email: SENDER_EMAIL },
        to: [{ email: data.email, name: data.name }],
        subject: confirmationEmail.subject,
        htmlContent: confirmationEmail.htmlContent
      })
    });

    if (!confirmationResponse.ok) {
      console.error('Brevo confirmation email error:', await confirmationResponse.text());
      // Don't fail the request if confirmation email fails
    }

    return new Response(JSON.stringify({ success: true, message: 'Emails sent successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Email API error:', error);
    return new Response(JSON.stringify({ error: 'Failed to send email' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
