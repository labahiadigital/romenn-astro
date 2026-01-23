import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Shield } from "lucide-react";
import { toast } from "sonner";

// API URLs
const CRM_API_URL = import.meta.env.PUBLIC_CRM_API_URL || "https://api.romenn.es/api/v1";
const EMAIL_API_URL = "/api/send-email";

const ContactForm = () => {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!acceptedPrivacy) {
      toast.error("Debe aceptar la política de privacidad para continuar.");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    // Obtener UTM params de la URL
    const urlParams = new URLSearchParams(window.location.search);
    
    const leadData = {
      nombre: formData.get("name") as string,
      email: formData.get("email") as string,
      telefono: formData.get("phone") as string,
      asunto: formData.get("subject") as string,
      mensaje: formData.get("message") as string,
      formulario: "contacto",
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
    };
    
    try {
      // Send to CRM
      const crmPromise = fetch(`${CRM_API_URL}/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }).catch(err => console.log("CRM error:", err));

      // Send emails via Brevo
      const emailData = {
        formType: "contacto",
        name: leadData.nombre,
        email: leadData.email,
        phone: leadData.telefono,
        subject: leadData.asunto,
        message: leadData.mensaje,
      };

      const emailPromise = fetch(EMAIL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      }).catch(err => console.log("Email error:", err));

      await Promise.all([crmPromise, emailPromise]);
      
      toast.success("Mensaje enviado correctamente. Le contactaremos pronto.");
      (e.target as HTMLFormElement).reset();
      setAcceptedPrivacy(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error de conexión. Por favor, inténtelo de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-serif mb-2">Envíenos un mensaje</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Complete el formulario y le responderemos a la mayor brevedad.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nombre completo *</Label>
            <Input 
              id="name" 
              name="name"
              placeholder="Su nombre" 
              className="mt-2" 
              required 
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel" 
              placeholder="747 488 562" 
              className="mt-2" 
              required 
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="su@email.com" 
            className="mt-2" 
            required 
          />
        </div>

        <div>
          <Label htmlFor="subject">Asunto</Label>
          <Input 
            id="subject" 
            name="subject"
            placeholder="¿En qué podemos ayudarle?" 
            className="mt-2" 
          />
        </div>

        <div>
          <Label htmlFor="message">Mensaje *</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Cuéntenos su situación..."
            className="mt-2 min-h-[150px]"
            required
          />
        </div>

        {/* Privacy Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox 
            id="privacy" 
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
          />
          <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            He leído y acepto la <a href="/privacidad" className="text-primary underline">política de privacidad</a> y 
            consiento el tratamiento de mis datos personales.
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 text-base bg-primary hover:bg-primary/90 rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Enviar mensaje <Send className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Legal Info */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p><strong>Responsable:</strong> CONSULTING INMOBILIARIO RIVAS VACIAMADRID SLU</p>
            <p><strong>Finalidad:</strong> Gestionar su consulta y enviarle información comercial sobre nuestros servicios.</p>
            <p><strong>Legitimación:</strong> Consentimiento del interesado.</p>
            <p><strong>Destinatarios:</strong> No se cederán datos a terceros, salvo obligación legal.</p>
            <p><strong>Derechos:</strong> Acceso, rectificación, supresión, oposición y portabilidad de los datos.</p>
            <p><strong>Info adicional:</strong> Puede consultar información adicional en nuestra <a href="/privacidad" className="text-primary underline">Política de Privacidad</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
