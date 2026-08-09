import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trackFormSubmit } from "@/lib/gtm";
import { submitLead } from "@/lib/submitLead";

const opportunityOptions = [
  { label: "Vivienda para reformar", value: "vivienda_reformar" },
  { label: "Local o nave", value: "local_nave" },
  { label: "Cambio de uso (de local a vivienda)", value: "cambio_uso" },
  { label: "Negocio en traspaso", value: "negocio_traspaso" },
  { label: "Edificio completo", value: "edificio" },
  { label: "Suelo o terreno", value: "suelo" },
  { label: "Vivienda alquilada (con inquilino)", value: "vivienda_alquilada" },
  { label: "Vivienda ocupada", value: "vivienda_ocupada" },
  { label: "Nuda propiedad", value: "nuda_propiedad" },
  { label: "Otras oportunidades", value: "otras" },
];

const budgetOptions = [
  "Hasta 100.000 €",
  "100.000 - 250.000 €",
  "250.000 - 500.000 €",
  "500.000 - 1.000.000 €",
  "Más de 1.000.000 €",
];

const OffMarketForm = () => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [horizon, setHorizon] = useState("");
  const [tenant, setTenant] = useState("");
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleType = (value: string) => {
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!acceptedPrivacy) {
      toast.error("Debes aceptar la política de privacidad para continuar.");
      return;
    }
    if (selectedTypes.length === 0) {
      toast.error("Indica al menos un tipo de oportunidad que buscas.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const zone = formData.get("zone") as string;
    const budget = formData.get("budget") as string;
    const profitability = formData.get("profitability") as string;
    const comments = formData.get("comments") as string;

    const opportunityTypes = selectedTypes
      .map((v) => opportunityOptions.find((o) => o.value === v)?.label || v)
      .join(", ");

    try {
      await submitLead({
        email: {
          formType: "off_market",
          name,
          email,
          phone,
          opportunityTypes,
          zone,
          budget,
          profitability,
          horizon,
          tenantAccepted: tenant,
          comments,
        },
        crm: {
          nombre: name,
          email,
          telefono: phone,
          asunto: "Inversor Off-Market",
          mensaje: comments,
          formulario: "off_market",
          tipo: "inversor",
          tipo_oportunidad: opportunityTypes,
          zona: zone,
          presupuesto: budget,
          rentabilidad: profitability,
          horizonte: horizon,
          acepta_inquilino: tenant,
        },
      });

      trackFormSubmit("off_market");
      toast.success("Bienvenido al círculo Off-Market. Te tendremos presente.");
      (e.target as HTMLFormElement).reset();
      setSelectedTypes([]);
      setHorizon("");
      setTenant("");
      setAcceptedPrivacy(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar. Por favor, inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectClass =
    "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Tipo de oportunidad */}
        <div>
          <Label className="text-base">¿Qué tipo de oportunidad buscas? *</Label>
          <p className="text-sm text-muted-foreground mb-4">Puedes seleccionar varias.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {opportunityOptions.map((option) => {
              const isSelected = selectedTypes.includes(option.value);
              return (
                <button
                  type="button"
                  key={option.value}
                  onClick={() => toggleType(option.value)}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl text-left transition-all duration-300 ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-primary/30 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "border-primary bg-primary" : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </span>
                  <span className={`text-sm ${isSelected ? "text-primary font-medium" : "text-foreground"}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="zone">Zona de interés</Label>
            <Input id="zone" name="zone" placeholder="Rivas, Madrid, alrededores..." className="mt-2" />
          </div>
          <div>
            <Label htmlFor="budget">Presupuesto aproximado</Label>
            <select id="budget" name="budget" className={selectClass} defaultValue="">
              <option value="" disabled>Selecciona un rango</option>
              {budgetOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="profitability">Rentabilidad buscada (orientativa)</Label>
            <Input id="profitability" name="profitability" placeholder="Ej. 6-8% anual" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="horizon">Horizonte de la inversión</Label>
            <select
              id="horizon"
              name="horizon"
              className={selectClass}
              value={horizon}
              onChange={(e) => setHorizon(e.target.value)}
            >
              <option value="" disabled>Selecciona</option>
              <option value="corto">Corto plazo</option>
              <option value="medio">Medio plazo</option>
              <option value="largo">Largo plazo</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="tenant">¿Aceptarías un inmueble con inquilino dentro?</Label>
          <select
            id="tenant"
            name="tenant"
            className={selectClass}
            value={tenant}
            onChange={(e) => setTenant(e.target.value)}
          >
            <option value="" disabled>Selecciona</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
            <option value="segun_caso">Según el caso</option>
          </select>
        </div>

        <div className="h-px bg-slate-100" />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nombre *</Label>
            <Input id="name" name="name" placeholder="Tu nombre" className="mt-2" required />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input id="phone" name="phone" type="tel" placeholder="747 488 562" className="mt-2" required />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input id="email" name="email" type="email" placeholder="tu@email.com" className="mt-2" required />
        </div>

        <div>
          <Label htmlFor="comments">Comentarios (opcional)</Label>
          <Textarea
            id="comments"
            name="comments"
            placeholder="Cuéntanos qué buscas exactamente..."
            className="mt-2 min-h-[120px]"
          />
        </div>

        {/* Privacy */}
        <div className="flex items-start gap-3">
          <Checkbox
            id="privacy-offmarket"
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
          />
          <Label htmlFor="privacy-offmarket" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            He leído y acepto la <a href="/privacidad/" className="text-primary underline">política de privacidad</a> y
            consiento el tratamiento de mis datos personales.
          </Label>
        </div>

        <div className="text-center">
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
                Entrar en el círculo Off-Market <Sparkles className="w-4 h-4" />
              </span>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-4">Sin coste y sin compromiso.</p>
        </div>
      </form>

      {/* Legal Info */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p><strong>Responsable:</strong> CONSULTING INMOBILIARIO RIVAS VACIAMADRID SLU</p>
            <p><strong>Finalidad:</strong> Gestionar tu perfil de inversor y presentarte oportunidades Off-Market acordes a tu perfil.</p>
            <p><strong>Legitimación:</strong> Consentimiento del interesado.</p>
            <p><strong>Destinatarios:</strong> No se cederán datos a terceros, salvo obligación legal.</p>
            <p><strong>Derechos:</strong> Acceso, rectificación, supresión, oposición y portabilidad de los datos.</p>
            <p><strong>Info adicional:</strong> Puedes consultar información adicional en nuestra <a href="/privacidad/" className="text-primary underline">Política de Privacidad</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OffMarketForm;
