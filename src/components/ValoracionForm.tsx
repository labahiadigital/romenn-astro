import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Home, 
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Phone
} from "lucide-react";
import { toast } from "sonner";

// API URL del CRM
const CRM_API_URL = import.meta.env.PUBLIC_CRM_API_URL || "https://api.romenn.es/api/v1";

// Tipos de propiedad
const propertyTypes = [
  { value: "piso", label: "Piso / Apartamento" },
  { value: "chalet", label: "Chalet Independiente" },
  { value: "adosado", label: "Chalet Adosado" },
  { value: "pareado", label: "Chalet Pareado" },
  { value: "atico", label: "Ático" },
  { value: "duplex", label: "Dúplex" },
  { value: "estudio", label: "Estudio / Loft" },
  { value: "local", label: "Local Comercial" },
  { value: "otro", label: "Otro" }
];

// Estados del inmueble
const propertyStates = [
  { value: "nuevo", label: "A estrenar" },
  { value: "muy_bueno", label: "Muy buen estado" },
  { value: "bueno", label: "Buen estado" },
  { value: "reformar", label: "Para reformar" },
  { value: "reformado", label: "Recién reformado" }
];

// Motivos de venta
const sellReasons = [
  { value: "cambio", label: "Cambio de vivienda" },
  { value: "inversion", label: "Desinversión" },
  { value: "herencia", label: "Herencia" },
  { value: "divorcio", label: "Separación / Divorcio" },
  { value: "urgencia", label: "Necesidad de liquidez" },
  { value: "jubilacion", label: "Jubilación" },
  { value: "otro", label: "Otro motivo" }
];

const ValoracionForm = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  
  const [formData, setFormData] = useState({
    // Paso 1: Datos del inmueble
    propertyType: "",
    address: "",
    city: "",
    postalCode: "",
    sqmBuilt: "",
    sqmUsable: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    hasElevator: false,
    hasGarage: false,
    hasTerrace: false,
    hasPool: false,
    propertyState: "",
    yearBuilt: "",
    
    // Paso 2: Situación
    sellReason: "",
    timeline: "",
    currentMortgage: "",
    expectedPrice: "",
    additionalInfo: "",
    
    // Paso 3: Contacto
    name: "",
    phone: "",
    email: "",
    preferredContact: "phone",
    bestTime: ""
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
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
      formulario: "valoracion",
      tipo_inmueble: formData.propertyType,
      direccion: `${formData.address}, ${formData.city} ${formData.postalCode}`,
      metros: parseFloat(formData.sqmBuilt) || null,
      habitaciones: parseInt(formData.bedrooms) || null,
      estado_inmueble: formData.propertyState,
      motivo_venta: formData.sellReason,
      precio_esperado: parseFloat(formData.expectedPrice) || null,
      timeline: formData.timeline,
      mensaje: formData.additionalInfo || null,
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
    };
    
    try {
      const response = await fetch(`${CRM_API_URL}/public/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });
      
      if (response.ok) {
        setIsCompleted(true);
        toast.success("¡Solicitud enviada! Le contactaremos pronto.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.detail || "Error al enviar. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error de conexión. Por favor, inténtelo de nuevo más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const canProceed = () => {
    if (step === 1) {
      return formData.propertyType && formData.address && formData.city && formData.sqmBuilt;
    }
    if (step === 2) {
      return formData.sellReason && formData.timeline;
    }
    if (step === 3) {
      return formData.name && formData.phone && formData.email && acceptedPrivacy;
    }
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      {!isCompleted && (
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all
                ${step >= s ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'}
              `}>
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-0.5 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Form Container */}
      <motion.div 
        layout
        className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-8 md:p-12"
            >
              {/* Step 1: Property Details */}
              {step === 1 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif">Datos del Inmueble</h2>
                      <p className="text-muted-foreground text-sm">Cuéntenos sobre su propiedad</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label>Tipo de propiedad *</Label>
                      <Select value={formData.propertyType} onValueChange={(v) => updateFormData("propertyType", v)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2">
                      <Label>Dirección completa *</Label>
                      <Input 
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                        placeholder="Calle, número, piso..." 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Localidad *</Label>
                      <Input 
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        placeholder="Ej: Rivas-Vaciamadrid" 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Código Postal</Label>
                      <Input 
                        value={formData.postalCode}
                        onChange={(e) => updateFormData("postalCode", e.target.value)}
                        placeholder="28522" 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Metros construidos *</Label>
                      <Input 
                        type="number"
                        value={formData.sqmBuilt}
                        onChange={(e) => updateFormData("sqmBuilt", e.target.value)}
                        placeholder="120" 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Metros útiles</Label>
                      <Input 
                        type="number"
                        value={formData.sqmUsable}
                        onChange={(e) => updateFormData("sqmUsable", e.target.value)}
                        placeholder="105" 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Habitaciones</Label>
                      <Input 
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => updateFormData("bedrooms", e.target.value)}
                        placeholder="3" 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Baños</Label>
                      <Input 
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) => updateFormData("bathrooms", e.target.value)}
                        placeholder="2" 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Estado del inmueble</Label>
                      <Select value={formData.propertyState} onValueChange={(v) => updateFormData("propertyState", v)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccione estado" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyStates.map(state => (
                            <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Año de construcción</Label>
                      <Input 
                        type="number"
                        value={formData.yearBuilt}
                        onChange={(e) => updateFormData("yearBuilt", e.target.value)}
                        placeholder="2005" 
                        className="mt-2" 
                      />
                    </div>
                  </div>

                  {/* Extras */}
                  <div>
                    <Label className="mb-4 block">Extras</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { key: "hasElevator", label: "Ascensor" },
                        { key: "hasGarage", label: "Garaje" },
                        { key: "hasTerrace", label: "Terraza" },
                        { key: "hasPool", label: "Piscina" }
                      ].map(extra => (
                        <label key={extra.key} className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors">
                          <Checkbox 
                            checked={formData[extra.key as keyof typeof formData] as boolean}
                            onCheckedChange={(checked) => updateFormData(extra.key, checked as boolean)}
                          />
                          <span className="text-sm">{extra.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Situation */}
              {step === 2 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif">Su Situación</h2>
                      <p className="text-muted-foreground text-sm">Para ofrecerle la mejor estrategia</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label>Motivo de la venta *</Label>
                      <Select value={formData.sellReason} onValueChange={(v) => updateFormData("sellReason", v)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccione motivo" />
                        </SelectTrigger>
                        <SelectContent>
                          {sellReasons.map(reason => (
                            <SelectItem key={reason.value} value={reason.value}>{reason.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿Cuándo le gustaría vender? *</Label>
                      <Select value={formData.timeline} onValueChange={(v) => updateFormData("timeline", v)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccione plazo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgente">Lo antes posible</SelectItem>
                          <SelectItem value="3meses">En los próximos 3 meses</SelectItem>
                          <SelectItem value="6meses">En los próximos 6 meses</SelectItem>
                          <SelectItem value="flexible">Sin prisa, cuando llegue la oferta adecuada</SelectItem>
                          <SelectItem value="informacion">Solo quiero información</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>¿Tiene hipoteca pendiente?</Label>
                      <Input 
                        value={formData.currentMortgage}
                        onChange={(e) => updateFormData("currentMortgage", e.target.value)}
                        placeholder="Ej: 150.000 € aprox." 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>¿Tiene una expectativa de precio?</Label>
                      <Input 
                        value={formData.expectedPrice}
                        onChange={(e) => updateFormData("expectedPrice", e.target.value)}
                        placeholder="Ej: Entre 350.000 y 400.000 €" 
                        className="mt-2" 
                      />
                    </div>

                    <div>
                      <Label>Información adicional</Label>
                      <Textarea 
                        value={formData.additionalInfo}
                        onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                        placeholder="Cuéntenos cualquier detalle relevante sobre su propiedad o situación..."
                        className="mt-2 min-h-[120px]" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Contact */}
              {step === 3 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif">Sus Datos de Contacto</h2>
                      <p className="text-muted-foreground text-sm">Para enviarle la valoración</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <Label>Nombre completo *</Label>
                      <Input 
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                        placeholder="Su nombre" 
                        className="mt-2" 
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label>Teléfono *</Label>
                        <Input 
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          placeholder="600 000 000" 
                          className="mt-2" 
                        />
                      </div>

                      <div>
                        <Label>Email *</Label>
                        <Input 
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          placeholder="su@email.com" 
                          className="mt-2" 
                        />
                      </div>
                    </div>

                    <div>
                      <Label>¿Cuándo prefiere que le contactemos?</Label>
                      <Select value={formData.bestTime} onValueChange={(v) => updateFormData("bestTime", v)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Seleccione horario" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manana">Por la mañana (9:00 - 14:00)</SelectItem>
                          <SelectItem value="tarde">Por la tarde (16:00 - 20:00)</SelectItem>
                          <SelectItem value="cualquiera">Cualquier momento</SelectItem>
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
                      <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        He leído y acepto la <a href="/privacidad" className="text-primary underline">política de privacidad</a>. 
                        Consiento el tratamiento de mis datos para recibir la valoración y contacto comercial relacionado.
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-10 pt-8 border-t border-slate-100">
                {step > 1 ? (
                  <Button variant="outline" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Anterior
                  </Button>
                ) : (
                  <div />
                )}
                
                {step < 3 ? (
                  <Button 
                    onClick={nextStep} 
                    disabled={!canProceed()}
                    className="gap-2 bg-primary hover:bg-primary/90"
                  >
                    Siguiente <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="gap-2 bg-primary hover:bg-primary/90 px-8"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        Solicitar Valoración <Sparkles className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            /* Success State */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-serif mb-4">¡Solicitud Recibida!</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Hemos recibido su solicitud de valoración. Un asesor especializado 
                en su zona le contactará en menos de 24 horas.
              </p>
              <div className="bg-slate-50 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-2">¿Qué ocurrirá ahora?</p>
                <ul className="text-left space-y-3 text-sm">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Analizaremos su propiedad con datos de mercado actualizados</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Le llamaremos para concretar una visita si lo desea</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Recibirá un informe detallado sin compromiso</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default ValoracionForm;
