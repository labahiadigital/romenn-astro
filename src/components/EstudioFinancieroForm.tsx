import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Home, Users, Shield } from "lucide-react";

// API URLs
const CRM_API_URL = import.meta.env.PUBLIC_CRM_API_URL || "https://api.romenn.es/api/v1";
const EMAIL_API_URL = "/api/send-email";

const EstudioFinancieroForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    situation: "",
    income: "",
    savings: "",
    monthlyLoans: "",
    timeline: ""
  });

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedPrivacy) {
      toast.error("Debe aceptar la política de privacidad para continuar.");
      return;
    }

    setIsSubmitting(true);
    
    // Obtener UTM params de la URL
    const urlParams = new URLSearchParams(window.location.search);
    
    const leadData = {
      nombre: formData.name,
      email: formData.email,
      telefono: formData.phone,
      formulario: "estudio_financiero",
      situacion_laboral: formData.situation,
      ingresos: formData.income,
      ahorros: formData.savings,
      gastos_prestamos_mensuales: formData.monthlyLoans,
      timeline: formData.timeline,
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
    };
    
    try {
      // Enviar al CRM
      const crmPromise = fetch(`${CRM_API_URL}/public/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadData),
      }).catch(err => console.log("CRM error:", err));

      // Enviar emails via Brevo (worker)
      const emailData = {
        formType: "estudio_financiero",
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        situation: formData.situation,
        income: formData.income,
        savings: formData.savings,
        monthlyLoans: formData.monthlyLoans,
        timeline: formData.timeline,
      };

      const emailPromise = fetch(EMAIL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      }).catch(err => console.log("Email error:", err));

      await Promise.all([crmPromise, emailPromise]);
      
      setIsCompleted(true);
      toast.success("¡Solicitud enviada! Le contactaremos pronto.");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-lg border border-slate-100 text-center">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-serif mb-4">¡Solicitud recibida!</h3>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Hemos recibido su solicitud de estudio financiero. 
          Un asesor especializado le contactará en menos de 48 horas.
        </p>
        <div className="bg-slate-50 rounded-xl p-6 max-w-md mx-auto">
          <p className="text-sm text-muted-foreground mb-4">Mientras tanto, puede:</p>
          <div className="flex flex-col gap-3">
            <a href="/propiedades">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Ver propiedades
              </Button>
            </a>
            <a href="/compradores">
              <Button variant="outline" className="w-full gap-2">
                <Users className="w-4 h-4" />
                Activar Personal Shopper
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100"
    >
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Nombre completo *</Label>
            <Input
              required
              value={formData.name}
              onChange={(e) => updateFormData("name", e.target.value)}
              className="mt-2"
              placeholder="Su nombre"
            />
          </div>
          <div>
            <Label>Teléfono *</Label>
            <Input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData("phone", e.target.value)}
              className="mt-2"
              placeholder="747 488 562"
            />
          </div>
        </div>

        <div>
          <Label>Email *</Label>
          <Input
            required
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            className="mt-2"
            placeholder="su@email.com"
          />
        </div>

        <div>
          <Label>¿Cuál es su situación? *</Label>
          <Select value={formData.situation} onValueChange={(v) => updateFormData("situation", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="primera_vivienda">Primera vivienda</SelectItem>
              <SelectItem value="cambio_vivienda">Cambio de vivienda</SelectItem>
              <SelectItem value="inversion">Inversión</SelectItem>
              <SelectItem value="segunda_residencia">Segunda residencia</SelectItem>
              <SelectItem value="otro">Otro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>Ingresos netos mensuales (aprox.)</Label>
            <Select value={formData.income} onValueChange={(v) => updateFormData("income", v)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Seleccione rango" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hasta_2000">Hasta 2.000 €</SelectItem>
                <SelectItem value="2000_3000">2.000 - 3.000 €</SelectItem>
                <SelectItem value="3000_4000">3.000 - 4.000 €</SelectItem>
                <SelectItem value="4000_5000">4.000 - 5.000 €</SelectItem>
                <SelectItem value="mas_5000">Más de 5.000 €</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ahorros disponibles (aprox.)</Label>
            <Select value={formData.savings} onValueChange={(v) => updateFormData("savings", v)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Seleccione rango" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hasta_20000">Hasta 20.000 €</SelectItem>
                <SelectItem value="20000_40000">20.000 - 40.000 €</SelectItem>
                <SelectItem value="40000_60000">40.000 - 60.000 €</SelectItem>
                <SelectItem value="60000_100000">60.000 - 100.000 €</SelectItem>
                <SelectItem value="mas_100000">Más de 100.000 €</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>¿Cuánto paga mensualmente en otros préstamos? (coche, personales, tarjetas...)</Label>
          <Select value={formData.monthlyLoans} onValueChange={(v) => updateFormData("monthlyLoans", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleccione rango" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sin_prestamos">No tengo otros préstamos</SelectItem>
              <SelectItem value="hasta_200">Hasta 200 €/mes</SelectItem>
              <SelectItem value="200_400">200 - 400 €/mes</SelectItem>
              <SelectItem value="400_600">400 - 600 €/mes</SelectItem>
              <SelectItem value="600_1000">600 - 1.000 €/mes</SelectItem>
              <SelectItem value="mas_1000">Más de 1.000 €/mes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>¿Cuándo le gustaría comprar?</Label>
          <Select value={formData.timeline} onValueChange={(v) => updateFormData("timeline", v)}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Seleccione plazo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inmediato">Lo antes posible</SelectItem>
              <SelectItem value="3_meses">En los próximos 3 meses</SelectItem>
              <SelectItem value="6_meses">En los próximos 6 meses</SelectItem>
              <SelectItem value="1_ano">En el próximo año</SelectItem>
              <SelectItem value="solo_info">Solo quiero información</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Privacy */}
        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
          <Checkbox
            id="privacy"
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
          />
          <Label htmlFor="privacy" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
            He leído y acepto la <a href="/privacidad" className="text-primary underline">política de privacidad</a>. 
            Consiento el tratamiento de mis datos para recibir el estudio financiero y contacto comercial relacionado.
          </Label>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 text-base bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Solicitar estudio gratuito
              <ArrowRight className="w-4 h-4" />
            </span>
          )}
        </Button>

        {/* Legal Info */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3 text-xs text-muted-foreground">
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <p><strong>Responsable:</strong> CONSULTING INMOBILIARIO RIVAS VACIAMADRID SLU</p>
              <p><strong>Finalidad:</strong> Gestionar su solicitud de estudio financiero y enviarle información comercial sobre nuestros servicios.</p>
              <p><strong>Legitimación:</strong> Consentimiento del interesado.</p>
              <p><strong>Destinatarios:</strong> No se cederán datos a terceros, salvo obligación legal.</p>
              <p><strong>Derechos:</strong> Acceso, rectificación, supresión, oposición y portabilidad de los datos.</p>
              <p><strong>Info adicional:</strong> Puede consultar información adicional en nuestra <a href="/privacidad" className="text-primary underline">Política de Privacidad</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EstudioFinancieroForm;
