import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import {
  ArrowRight,
  ArrowLeft,
  Calculator,
  Home,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  Shield,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { trackFormSubmit, pushDataLayer } from "@/lib/gtm";
import { submitLead } from "@/lib/submitLead";
import {
  MADRID_MUNICIPALITIES,
  MINOR_COSTS_FIXED,
  AGENCY_FEE,
  PRIVACY_URL,
  CALCULATION_VERSION,
  calculate,
  formatCurrency,
  roundToHundreds,
} from "@/lib/calculadora-config";
import type { CalculationResult } from "@/lib/calculadora-config";

// ---- Helpers ----

const currentYear = new Date().getFullYear();

function parseCurrency(raw: string): number {
  return Number(raw.replace(/[^0-9]/g, "")) || 0;
}

function formatInputCurrency(raw: string): string {
  const num = parseCurrency(raw);
  if (num === 0) return "";
  return new Intl.NumberFormat("es-ES").format(num);
}

// ---- Types ----

type Step = "intro" | "data" | "lead" | "result";

type FormData = {
  salePrice: string;
  purchasePrice: string;
  municipality: string;
  purchaseYear: string;
  isMainHome: boolean | null;
  age65Plus: boolean | null;
  fullReinvestment: boolean | null;
  leadName: string;
  leadEmail: string;
  leadPhone: string;
  privacyAccepted: boolean;
};

const initialFormData: FormData = {
  salePrice: "",
  purchasePrice: "",
  municipality: "",
  purchaseYear: "",
  isMainHome: null,
  age65Plus: null,
  fullReinvestment: null,
  leadName: "",
  leadEmail: "",
  leadPhone: "",
  privacyAccepted: false,
};
// ---- Yes/No Selector component ----

function YesNoSelector({
  value,
  onChange,
  yesLabel = "Si",
  noLabel = "No",
}: {
  value: boolean | null;
  onChange: (v: boolean) => void;
  yesLabel?: string;
  noLabel?: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`py-3 px-4 rounded-lg border-2 text-center font-medium transition-all ${
          value === true
            ? "border-primary bg-primary/10 text-primary"
            : "border-slate-200 text-muted-foreground hover:border-slate-300"
        }`}
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`py-3 px-4 rounded-lg border-2 text-center font-medium transition-all ${
          value === false
            ? "border-primary bg-primary/10 text-primary"
            : "border-slate-200 text-muted-foreground hover:border-slate-300"
        }`}
      >
        {noLabel}
      </button>
    </div>
  );
}

// ---- Municipality search selector ----

function MunicipalitySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!search) return MADRID_MUNICIPALITIES;
    const lower = search.toLowerCase();
    return MADRID_MUNICIPALITIES.filter((m) =>
      m.toLowerCase().includes(lower),
    );
  }, [search]);

  return (
    <div className="relative">
      <Input
        value={value || search}
        onChange={(e) => {
          setSearch(e.target.value);
          if (value) onChange("");
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Busca tu municipio..."
        className="mt-2"
      />
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => { if (e.key === "Escape") setIsOpen(false); }}
            role="presentation"
          />
          <div className="absolute z-20 mt-1 w-full max-h-60 overflow-auto bg-white border border-slate-200 rounded-lg shadow-lg">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                No se encontro ningun municipio
              </div>
            ) : (
              filtered.map((m) => (
                <button
                  type="button"
                  key={m}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    onChange(m);
                    setSearch("");
                    setIsOpen(false);
                  }}
                >
                  {m}
                </button>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ---- Result breakdown row ----

function ResultRow({
  label,
  value,
  isRange,
  highlight,
  positive,
}: {
  label: string;
  value: string;
  isRange?: boolean;
  highlight?: boolean;
  positive?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-3 ${
        highlight
          ? "border-t-2 border-primary pt-4 mt-2"
          : "border-b border-slate-100"
      }`}
    >
      <span
        className={`text-sm ${highlight ? "font-semibold text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <span
        className={`font-medium tabular-nums ${
          highlight
            ? "text-lg font-bold text-primary"
            : positive
              ? "text-green-700"
              : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ---- Main Component ----

const CalculadoraGastos = () => {
  const [step, setStep] = useState<Step>("intro");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const update = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const showReinvestment =
    formData.isMainHome === true && formData.age65Plus === false;

  const canProceedData = useMemo(() => {
    const sp = parseCurrency(formData.salePrice);
    const pp = parseCurrency(formData.purchasePrice);
    const yr = Number(formData.purchaseYear);
    if (sp <= 0 || pp <= 0 || !formData.municipality) return false;
    if (!formData.purchaseYear || yr < 1900 || yr > currentYear) return false;
    if (formData.isMainHome === null || formData.age65Plus === null) return false;
    if (showReinvestment && formData.fullReinvestment === null) return false;
    return true;
  }, [formData, showReinvestment]);

  const canProceedLead = useMemo(() => {
    if (!formData.leadName.trim()) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.leadEmail)) return false;
    if (!formData.privacyAccepted) return false;
    return true;
  }, [formData.leadName, formData.leadEmail, formData.privacyAccepted]);

  const doCalculate = useCallback(() => {
    const r = calculate({
      salePrice: parseCurrency(formData.salePrice),
      purchasePrice: parseCurrency(formData.purchasePrice),
      municipality: formData.municipality,
      purchaseYear: Number(formData.purchaseYear),
      isMainHome: formData.isMainHome === true,
      age65Plus: formData.age65Plus === true,
      fullReinvestment: formData.fullReinvestment === true,
    });
    setResult(r);
  }, [formData]);

  const handleGoToLead = useCallback(() => {
    doCalculate();
    pushDataLayer({ event: "calculator_step", step: "lead" });
    setStep("lead");
  }, [doCalculate]);

  const handleSubmitLead = useCallback(async () => {
    if (!canProceedLead || !result) return;
    setIsSubmitting(true);
    try {
      const payload = {
        sale_price: parseCurrency(formData.salePrice),
        purchase_price: parseCurrency(formData.purchasePrice),
        municipality: formData.municipality,
        purchase_year: Number(formData.purchaseYear),
        is_main_home: formData.isMainHome,
        age_65_plus: formData.age65Plus,
        full_reinvestment: formData.fullReinvestment,
        available_low: result.availableLow,
        available_high: result.availableHigh,
        calculation_version: CALCULATION_VERSION,
      };
      await submitLead({
        email: {
          formType: "calculadora_gastos",
          name: formData.leadName,
          email: formData.leadEmail,
          phone: formData.leadPhone || "",
          ...payload,
        },
        crm: {
          nombre: formData.leadName,
          email: formData.leadEmail,
          telefono: formData.leadPhone || null,
          formulario: "calculadora_gastos",
          precio_venta: payload.sale_price,
          precio_compra: payload.purchase_price,
          municipio: payload.municipality,
          resultado_min: result.availableLow,
          resultado_max: result.availableHigh,
        },
      });
      trackFormSubmit("calculadora_gastos");
      pushDataLayer({ event: "lead_submit" });
      setLeadSubmitted(true);
      pushDataLayer({ event: "result_view" });
      setStep("result");
    } catch {
      toast.error("Error al enviar. Intentalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  }, [canProceedLead, result, formData]);

  const handleRecalculate = useCallback(() => {
    setStep("data");
    setResult(null);
    setLeadSubmitted(false);
  }, []);

  const progressSteps = [
    { key: "data", label: "Datos" },
    { key: "lead", label: "Contacto" },
    { key: "result", label: "Resultado" },
  ];
  const currentStepIdx =
    step === "data" ? 0 : step === "lead" ? 1 : step === "result" ? 2 : -1;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress bar */}
      {step !== "intro" && (
        <div className="flex items-center justify-center gap-4 mb-10">
          {progressSteps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-3">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                    currentStepIdx >= i
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {currentStepIdx > i ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span className="text-[11px] text-muted-foreground hidden sm:block">
                  {s.label}
                </span>
              </div>
              {i < progressSteps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mb-4 sm:mb-0 ${
                    currentStepIdx > i ? "bg-primary" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <motion.div
        layout
        className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {/* ---- INTRO ---- */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 md:p-12 text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">
                ¿Cuanto te costara vender tu casa?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-4">
                Calcula una estimacion de los gastos e impuestos y descubre
                cuanto recibirias antes de cancelar una posible hipoteca.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8">
                <Info className="w-3.5 h-3.5" />
                <span>Solo necesitas 2 minutos</span>
              </div>
              <Button
                className="gap-2 bg-primary hover:bg-primary/90 px-10 py-6 text-base"
                onClick={() => {
                  pushDataLayer({ event: "calculator_start" });
                  setStep("data");
                }}
              >
                Calcular mi venta <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          )}

          {/* ---- DATA STEP ---- */}
          {step === "data" && (
            <motion.div
              key="data"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif">Datos de la venta</h2>
                  <p className="text-muted-foreground text-sm">
                    Responde estas preguntas sobre tu vivienda
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Sale price */}
                <div>
                  <Label>Precio de venta *</Label>
                  <div className="relative mt-2">
                    <Input
                      inputMode="numeric"
                      value={formatInputCurrency(formData.salePrice)}
                      onChange={(e) => update("salePrice", e.target.value)}
                      placeholder="400.000"
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      &euro;
                    </span>
                  </div>
                </div>

                {/* Purchase price */}
                <div>
                  <Label>Precio de compra *</Label>
                  <div className="relative mt-2">
                    <Input
                      inputMode="numeric"
                      value={formatInputCurrency(formData.purchasePrice)}
                      onChange={(e) => update("purchasePrice", e.target.value)}
                      placeholder="250.000"
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      &euro;
                    </span>
                  </div>
                </div>

                {/* Municipality */}
                <div>
                  <Label>Municipio (Comunidad de Madrid) *</Label>
                  <MunicipalitySelector
                    value={formData.municipality}
                    onChange={(v) => update("municipality", v)}
                  />
                </div>

                {/* Purchase year */}
                <div>
                  <Label>Ano de compra *</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={1900}
                    max={currentYear}
                    value={formData.purchaseYear}
                    onChange={(e) => update("purchaseYear", e.target.value)}
                    placeholder="2015"
                    className="mt-2"
                  />
                </div>

                {/* Is main home */}
                <div>
                  <Label className="mb-3 block">
                    ¿Es tu vivienda habitual? *
                  </Label>
                  <YesNoSelector
                    value={formData.isMainHome}
                    onChange={(v) => {
                      update("isMainHome", v);
                      if (!v) update("fullReinvestment", null);
                    }}
                    yesLabel="Si, es mi vivienda habitual"
                    noLabel="No"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    La vivienda donde has residido de forma continuada durante al
                    menos los ultimos 3 anos.
                  </p>
                </div>

                {/* Age 65+ */}
                <div>
                  <Label className="mb-3 block">
                    ¿Tienes 65 anos o mas? *
                  </Label>
                  <YesNoSelector
                    value={formData.age65Plus}
                    onChange={(v) => {
                      update("age65Plus", v);
                      if (v) update("fullReinvestment", null);
                    }}
                  />
                </div>

                {/* Full reinvestment - conditional */}
                {showReinvestment && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label className="mb-3 block">
                      ¿Reinvertiras todo el importe en otra vivienda habitual? *
                    </Label>
                    <YesNoSelector
                      value={formData.fullReinvestment}
                      onChange={(v) => update("fullReinvestment", v)}
                      yesLabel="Si, reinvertire todo"
                      noLabel="No"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      La reinversion debe ser del importe total obtenido en la
                      compra de otra vivienda habitual.
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-10 pt-8 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setStep("intro")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Atras
                </Button>
                <Button
                  onClick={() => {
                    pushDataLayer({ event: "calculator_step", step: "data_complete" });
                    handleGoToLead();
                  }}
                  disabled={!canProceedData}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  Ver resultado <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ---- LEAD CAPTURE ---- */}
          {step === "lead" && (
            <motion.div
              key="lead"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-serif">
                    Un ultimo paso
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Dejanos tu contacto para ver el desglose completo y
                    enviartelo por email
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <Label>Nombre *</Label>
                  <Input
                    value={formData.leadName}
                    onChange={(e) => update("leadName", e.target.value)}
                    placeholder="Tu nombre"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Correo electronico *</Label>
                  <Input
                    type="email"
                    value={formData.leadEmail}
                    onChange={(e) => update("leadEmail", e.target.value)}
                    placeholder="tu@email.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>
                    Telefono{" "}
                    <span className="text-muted-foreground font-normal">
                      (opcional)
                    </span>
                  </Label>
                  <Input
                    type="tel"
                    value={formData.leadPhone}
                    onChange={(e) => update("leadPhone", e.target.value)}
                    placeholder="600 000 000"
                    className="mt-2"
                  />
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Checkbox
                    id="calc-privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) =>
                      update("privacyAccepted", checked as boolean)
                    }
                  />
                  <Label
                    htmlFor="calc-privacy"
                    className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
                  >
                    He leido y acepto la{" "}
                    <a
                      href={PRIVACY_URL}
                      className="text-primary underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      politica de privacidad
                    </a>
                    . Consiento el tratamiento de mis datos para recibir la
                    estimacion y contacto comercial relacionado.
                  </Label>
                </div>

                {/* Legal info */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-start gap-3 text-xs text-muted-foreground">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p>
                        <strong>Responsable:</strong> CONSULTING INMOBILIARIO
                        RIVAS VACIAMADRID SLU
                      </p>
                      <p>
                        <strong>Finalidad:</strong> Enviar la estimacion
                        solicitada e informacion comercial.
                      </p>
                      <p>
                        <strong>Legitimacion:</strong> Consentimiento del
                        interesado.
                      </p>
                      <p>
                        <strong>Derechos:</strong> Acceso, rectificacion,
                        supresion, oposicion y portabilidad.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-10 pt-8 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => setStep("data")}
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Atras
                </Button>
                <Button
                  onClick={handleSubmitLead}
                  disabled={!canProceedLead || isSubmitting}
                  className="gap-2 bg-primary hover:bg-primary/90 px-8"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Ver mi estimacion <Send className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* ---- RESULT ---- */}
          {step === "result" && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif mb-3">
                  Tu estimacion de venta
                </h2>
                <p className="text-muted-foreground text-sm max-w-lg mx-auto">
                  Si vendes por{" "}
                  <strong>{formatCurrency(result.salePrice)}</strong>, estimamos
                  que dispondrias de entre{" "}
                  <strong className="text-primary">
                    {formatCurrency(result.availableLow)}
                  </strong>{" "}
                  y{" "}
                  <strong className="text-primary">
                    {formatCurrency(result.availableHigh)}
                  </strong>{" "}
                  antes de cancelar cualquier hipoteca pendiente.
                </p>
              </div>

              {/* Breakdown */}
              <div className="bg-slate-50 rounded-xl p-6 mb-6">
                <ResultRow
                  label="Precio de venta"
                  value={`+ ${formatCurrency(result.salePrice)}`}
                  positive
                />
                <ResultRow
                  label="Honorarios de venta e IVA"
                  value={`- ${formatCurrency(result.feeTotal)}`}
                />
                <ResultRow
                  label="Plusvalia municipal estimada"
                  value={
                    result.plusvaliaMin === result.plusvaliaMax
                      ? `- ${formatCurrency(result.plusvaliaMin)}`
                      : `- ${formatCurrency(result.plusvaliaMin)} a ${formatCurrency(result.plusvaliaMax)}`
                  }
                  isRange={result.plusvaliaMin !== result.plusvaliaMax}
                />
                <ResultRow
                  label="IRPF estimado"
                  value={
                    result.irpfExempt
                      ? "0 \u20AC (exento)"
                      : result.irpfMin === result.irpfMax
                        ? `- ${formatCurrency(result.irpfMin)}`
                        : `- ${formatCurrency(result.irpfMin)} a ${formatCurrency(result.irpfMax)}`
                  }
                />
                <ResultRow
                  label="Otros gastos de venta"
                  value={`- ${formatCurrency(MINOR_COSTS_FIXED)}`}
                />
                <ResultRow
                  label="Importe estimado antes de hipoteca"
                  value={
                    result.availableLow === result.availableHigh
                      ? formatCurrency(result.availableLow)
                      : `${formatCurrency(result.availableLow)} - ${formatCurrency(result.availableHigh)}`
                  }
                  highlight
                />
              </div>

              {/* Conditional messages */}
              <div className="space-y-3 mb-8">
                {result.exemptionReason === "age_65" && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-lg p-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">
                      No hemos incluido IRPF porque has indicado que tienes 65
                      anos o mas y vendes tu vivienda habitual.
                    </p>
                  </div>
                )}
                {result.exemptionReason === "reinvestment" && (
                  <div className="flex items-start gap-3 bg-green-50 border border-green-100 rounded-lg p-4">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">
                      No hemos incluido IRPF porque has indicado que
                      reinvertiras todo el importe obtenido en otra vivienda
                      habitual.
                    </p>
                  </div>
                )}
                {result.noGain && (
                  <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-800">
                      No estimamos ganancia patrimonial positiva. La operacion
                      puede seguir sujeta a obligaciones de declaracion.
                    </p>
                  </div>
                )}
                {!result.municipalityConfigured && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-lg p-4">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      La plusvalia se ha estimado con una horquilla general.
                      Romenn puede calcularla con mayor precision.
                    </p>
                  </div>
                )}

                {/* Mandatory disclaimer */}
                <div className="flex items-start gap-3 bg-slate-100 rounded-lg p-4">
                  <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">
                    Esta estimacion no descuenta ninguna hipoteca pendiente y no
                    tiene valor fiscal ni contractual. {AGENCY_FEE.disclaimer}
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center">
                <h3 className="text-xl font-serif mb-2">
                  ¿Quieres conocer la cifra real?
                </h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                  Esta estimacion es orientativa. En Romenn revisamos tu caso y
                  te explicamos claramente cuanto podrias obtener con la venta.
                </p>
                <a
                  href="https://wa.me/34747488562?text=Hola%2C%20he%20usado%20la%20calculadora%20de%20gastos%20de%20venta%20y%20me%20gustar%C3%ADa%20conocer%20mi%20cifra%20real."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  onClick={() =>
                    pushDataLayer({ event: "contact_cta_click" })
                  }
                >
                  Quiero calcular mi cifra real
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

              {/* Recalculate link */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  className="text-sm text-primary underline hover:no-underline"
                  onClick={handleRecalculate}
                >
                  Modificar datos y recalcular
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default CalculadoraGastos;
