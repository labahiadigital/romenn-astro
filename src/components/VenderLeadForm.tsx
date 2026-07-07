import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Shield, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { trackFormSubmit } from "@/lib/gtm";
import { submitLead } from "@/lib/submitLead";

// ─── Opciones ────────────────────────────────────────────────────────────────

const TIPOS_VIVIENDA = [
  { value: "piso", label: "🏢 Piso / Apartamento" },
  { value: "atico", label: "🌇 Ático" },
  { value: "chalet_ind", label: "🏡 Chalet Independiente" },
  { value: "chalet_adosado", label: "🏘️ Chalet Adosado o Pareado" },
  { value: "duplex", label: "🏠 Dúplex" },
  { value: "estudio", label: "🛋️ Estudio / Loft" },
  { value: "local", label: "🏪 Local Comercial" },
  { value: "otro", label: "🏗️ Otro" },
];

const ESTADOS = [
  { value: "nuevo", label: "✨ A estrenar" },
  { value: "muy_bueno", label: "👍 Muy buen estado" },
  { value: "bueno", label: "✅ Buen estado" },
  { value: "reformar", label: "🔧 Necesita reforma" },
  { value: "reformado", label: "🎨 Recién reformado" },
];

const METROS = [
  { value: "menos50", label: "< 50 m²" },
  { value: "50_80", label: "50 – 80 m²" },
  { value: "80_120", label: "80 – 120 m²" },
  { value: "120_180", label: "120 – 180 m²" },
  { value: "mas180", label: "+ 180 m²" },
];

// ─── Tipos ───────────────────────────────────────────────────────────────────

type FormData = {
  tipo: string;
  calle: string;
  metros: string;
  estado: string;
  nombre: string;
  email: string;
  telefono: string;
};

// ─── Barra de progreso ───────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const labels = ["Vivienda", "Dirección", "Detalles", "Contacto"];
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span>
          Paso {step} de {total}
        </span>
        <span>{labels[step - 1]}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              n <= step ? "bg-primary" : "bg-slate-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Botón opción ────────────────────────────────────────────────────────────

function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border-2 px-4 py-3.5 text-left text-sm font-medium transition-all duration-150 ${
        selected
          ? "border-primary bg-primary/8 text-primary ring-2 ring-primary/20"
          : "border-slate-200 bg-white text-slate-700 hover:border-primary/40 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

/**
 * Mini-test de 4 pasos para solicitar valoración en /vender-tu-casa.
 * Título: "Conoce el precio de tu vivienda ahora".
 * No muestra horquilla automática: al finalizar aparece un mensaje
 * confirmando que un asesor llamará con la valoración.
 */
const VenderLeadForm = () => {
  const TOTAL_STEPS = 4;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

  const [form, setForm] = useState<FormData>({
    tipo: "",
    calle: "",
    metros: "",
    estado: "",
    nombre: "",
    email: "",
    telefono: "",
  });

  const set = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Validación por paso
  const canContinue = (): boolean => {
    if (step === 1) return form.tipo !== "";
    if (step === 2) return form.calle.trim().length > 5;
    if (step === 3) return form.metros !== "" && form.estado !== "";
    if (step === 4)
      return (
        form.nombre.trim() !== "" &&
        form.telefono.trim() !== "" &&
        form.email.trim() !== "" &&
        acceptedPrivacy
      );
    return false;
  };

  const next = () => {
    if (canContinue() && step < TOTAL_STEPS) setStep((s) => s + 1);
  };
  const prev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinue()) {
      toast.error("Completa todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitLead({
        email: {
          formType: "valoracion",
          name: form.nombre,
          email: form.email,
          phone: form.telefono,
          propertyType: form.tipo,
          address: form.calle,
          sqmRange: form.metros,
          propertyState: form.estado,
        },
        crm: {
          nombre: form.nombre,
          email: form.email || null,
          telefono: form.telefono,
          formulario: "valoracion_steps",
          tipo_inmueble: form.tipo,
          direccion: form.calle,
          estado_inmueble: form.estado,
          origen: "landing_vender_tu_casa",
        },
      });

      trackFormSubmit("vender-tu-casa");
      setIsCompleted(true);
    } catch (err) {
      console.error("Error submitting form:", err);
      toast.error(
        "Error al enviar. Inténtalo de nuevo o llámanos al 747 488 562.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Estado de éxito ────────────────────────────────────────────────────────
  if (isCompleted) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-xl md:p-12">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h3 className="mb-4 font-serif text-2xl text-foreground">
          ¡Solicitud recibida!
        </h3>
        <p className="mx-auto max-w-sm leading-relaxed text-muted-foreground">
          Nuestros asesores especializados en tu zona te llamarán en breve con
          una valoración estimada de tu vivienda.
        </p>
        <p className="mt-5 text-sm font-medium text-primary">
          Sin compromiso · Completamente gratuito
        </p>
      </div>
    );
  }

  // ── Formulario por pasos ───────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-xl">
      {/* Cabecera */}
      <div className="border-b border-slate-100 px-6 pt-7 pb-0 md:px-8">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">
          Valoración gratuita
        </p>
        <h2 className="mb-5 font-serif text-2xl leading-snug text-foreground md:text-3xl">
          Conoce el precio de tu vivienda ahora
        </h2>
        <ProgressBar step={step} total={TOTAL_STEPS} />
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="px-6 py-7 md:px-8">
          {/* ── Paso 1: Tipo de vivienda ─────────────────────────────────── */}
          {step === 1 && (
            <div>
              <p className="mb-5 font-medium text-foreground">
                ¿Qué tipo de vivienda quieres valorar?
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {TIPOS_VIVIENDA.map((t) => (
                  <OptionButton
                    key={t.value}
                    label={t.label}
                    selected={form.tipo === t.value}
                    onClick={() => set("tipo", t.value)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Paso 2: Dirección ────────────────────────────────────────── */}
          {step === 2 && (
            <div>
              <p className="mb-5 font-medium text-foreground">
                ¿Dónde está la vivienda?
              </p>
              <div>
                <Label htmlFor="vl-calle" className="sr-only">
                  Dirección
                </Label>
                <Input
                  id="vl-calle"
                  autoFocus
                  value={form.calle}
                  onChange={(e) => set("calle", e.target.value)}
                  placeholder="Calle, número y localidad (ej: C/ Mayor 12, Rivas-Vaciamadrid)"
                  autoComplete="street-address"
                  className="h-12 text-base"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Con calle y número podemos afinar mejor la valoración.
                </p>
              </div>
            </div>
          )}

          {/* ── Paso 3: Tamaño y estado ──────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-7">
              <div>
                <p className="mb-4 font-medium text-foreground">
                  ¿Cuántos metros tiene aproximadamente?
                </p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {METROS.map((m) => (
                    <OptionButton
                      key={m.value}
                      label={m.label}
                      selected={form.metros === m.value}
                      onClick={() => set("metros", m.value)}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-4 font-medium text-foreground">
                  ¿En qué estado está?
                </p>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {ESTADOS.map((e) => (
                    <OptionButton
                      key={e.value}
                      label={e.label}
                      selected={form.estado === e.value}
                      onClick={() => set("estado", e.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Paso 4: Contacto ─────────────────────────────────────────── */}
          {step === 4 && (
            <div className="space-y-5">
              <p className="font-medium text-foreground">
                ¿A quién le enviamos la valoración?
              </p>

              <div>
                <Label htmlFor="vl-nombre">Nombre *</Label>
                <Input
                  id="vl-nombre"
                  autoFocus
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  className="mt-2"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="vl-email">Email *</Label>
                  <Input
                    id="vl-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="tu@email.com"
                    autoComplete="email"
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="vl-telefono">Teléfono *</Label>
                  <Input
                    id="vl-telefono"
                    type="tel"
                    inputMode="tel"
                    value={form.telefono}
                    onChange={(e) => set("telefono", e.target.value)}
                    placeholder="600 000 000"
                    autoComplete="tel"
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Privacidad */}
              <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4 text-sm text-muted-foreground">
                <Checkbox
                  id="vl-privacy"
                  checked={acceptedPrivacy}
                  onCheckedChange={(c) => setAcceptedPrivacy(c as boolean)}
                  className="mt-0.5 h-5 w-5 min-h-0 min-w-0 flex-shrink-0"
                />
                <Label
                  htmlFor="vl-privacy"
                  className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground"
                >
                  He leído y acepto la{" "}
                  <a
                    href="/privacidad"
                    target="_blank"
                    className="text-primary underline"
                    rel="noreferrer"
                  >
                    política de privacidad
                  </a>
                  . Consiento el tratamiento de mis datos para recibir la
                  valoración.
                </Label>
              </div>

              {/* RGPD */}
              <div className="border-t border-slate-100 pt-4">
                <div className="flex items-start gap-3 text-xs text-muted-foreground">
                  <Shield className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <div className="space-y-1">
                    <p>
                      <strong>Responsable:</strong> CONSULTING INMOBILIARIO
                      RIVAS VACIAMADRID SLU
                    </p>
                    <p>
                      <strong>Finalidad:</strong> Gestionar tu solicitud de
                      valoración y enviarte información comercial.
                    </p>
                    <p>
                      <strong>Legitimación:</strong> Consentimiento del
                      interesado.
                    </p>
                    <p>
                      <strong>Destinatarios:</strong> No se cederán datos a
                      terceros, salvo obligación legal.
                    </p>
                    <p>
                      <strong>Derechos:</strong> Acceso, rectificación,
                      supresión, oposición y portabilidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Botones de navegación ──────────────────────────────────────── */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-5 md:px-8">
          {step > 1 ? (
            <button
              type="button"
              onClick={prev}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Atrás
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <Button
              type="button"
              onClick={next}
              disabled={!canContinue()}
              className="h-12 min-w-36 bg-primary text-base hover:bg-primary/90"
            >
              Siguiente →
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!canContinue() || isSubmitting}
              className="h-12 min-w-48 bg-primary text-base hover:bg-primary/90"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Enviando...
                </span>
              ) : (
                "Quiero mi valoración gratis ✨"
              )}
            </Button>
          )}
        </div>
      </form>

      <p className="flex items-center justify-center gap-2 pb-5 text-center text-xs text-muted-foreground">
        <ShieldCheck className="h-3.5 w-3.5 flex-shrink-0" />
        Sin compromiso · Respuesta en menos de 2 horas laborables
      </p>
    </div>
  );
};

export default VenderLeadForm;
