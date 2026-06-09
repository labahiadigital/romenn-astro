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
import { CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trackFormSubmit } from "@/lib/gtm";
import { submitLead } from "@/lib/submitLead";

// "¿Qué quieres vender?" — campo corto exigido por el informe de Google Ads.
const propertyOptions = [
  { value: "piso", label: "Piso / Apartamento" },
  { value: "chalet", label: "Chalet / Adosado / Pareado" },
  { value: "atico", label: "Ático" },
  { value: "duplex", label: "Dúplex" },
  { value: "estudio", label: "Estudio / Loft" },
  { value: "local", label: "Local / Garaje / Otro" },
];

/**
 * Formulario de captación de la landing /vender-tu-casa.
 *
 * Máximo 4 campos (Nombre · Teléfono · ¿Qué quieres vender? · Email opcional)
 * + consentimiento RGPD, según el informe de campaña. Al enviarse con éxito
 * dispara `dataLayer.push({event:'formulario_enviado'})` vía `trackFormSubmit`
 * para que Google Ads registre la conversión.
 */
const VenderLeadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [data, setData] = useState({
    name: "",
    phone: "",
    propertyType: "",
    email: "",
  });

  const update = (field: keyof typeof data, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canSubmit =
    data.name.trim() !== "" &&
    data.phone.trim() !== "" &&
    data.propertyType !== "" &&
    acceptedPrivacy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Completa nombre, teléfono, qué quieres vender y acepta la política.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({
        email: {
          formType: "valoracion",
          name: data.name,
          email: data.email,
          phone: data.phone,
          propertyType: data.propertyType,
        },
        crm: {
          nombre: data.name,
          email: data.email || null,
          telefono: data.phone,
          formulario: "valoracion",
          tipo_inmueble: data.propertyType,
          origen: "landing_vender_tu_casa",
        },
      });

      // SOLO tras respuesta OK del backend → conversión en Google Ads.
      trackFormSubmit("vender-tu-casa");
      setIsCompleted(true);
      toast.success("¡Solicitud enviada! Te contactamos enseguida.");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar. Inténtalo de nuevo o llámanos al 747 488 562.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 md:p-10 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-serif mb-3">¡Solicitud recibida!</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Un asesor de Römenn especializado en Rivas te contactará en menos de
          2 horas laborables. Sin compromiso.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 space-y-5"
    >
      <div>
        <Label htmlFor="vl-name">Nombre *</Label>
        <Input
          id="vl-name"
          value={data.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Tu nombre"
          autoComplete="name"
          className="mt-2"
          required
        />
      </div>

      <div>
        <Label htmlFor="vl-phone">Teléfono *</Label>
        <Input
          id="vl-phone"
          type="tel"
          inputMode="tel"
          value={data.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="600 000 000"
          autoComplete="tel"
          className="mt-2"
          required
        />
      </div>

      <div>
        <Label>¿Qué quieres vender? *</Label>
        <Select value={data.propertyType} onValueChange={(v) => update("propertyType", v)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Selecciona el tipo de inmueble" />
          </SelectTrigger>
          <SelectContent>
            {propertyOptions.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="vl-email">Email (opcional)</Label>
        <Input
          id="vl-email"
          type="email"
          value={data.email}
          onChange={(e) => update("email", e.target.value)}
          placeholder="tu@email.com"
          autoComplete="email"
          className="mt-2"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted-foreground cursor-pointer">
        <Checkbox
          id="vl-privacy"
          checked={acceptedPrivacy}
          onCheckedChange={(c) => setAcceptedPrivacy(c as boolean)}
          className="mt-0.5"
        />
        <span>
          He leído y acepto la{" "}
          <a href="/privacidad" target="_blank" className="text-primary underline">
            política de privacidad
          </a>
          .
        </span>
      </label>

      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full bg-primary hover:bg-primary/90 text-base py-6 gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            Quiero mi valoración gratis <Sparkles className="w-4 h-4" />
          </>
        )}
      </Button>

      <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-4 h-4" />
        Sin compromiso · Respuesta en menos de 2 horas laborables
      </p>
    </form>
  );
};

export default VenderLeadForm;
