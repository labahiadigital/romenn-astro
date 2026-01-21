import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const questions = [
  {
    id: "type",
    question: "¿Qué tipo de propiedad busca?",
    subtitle: "Puede seleccionar varias opciones",
    options: [
      { label: "Chalet Independiente", value: "chalet_independiente" },
      { label: "Chalet Adosado", value: "chalet_adosado" },
      { label: "Ático con Terraza", value: "atico" },
      { label: "Piso de Diseño", value: "piso" },
      { label: "Dúplex", value: "duplex" },
      { label: "Inversión", value: "inversion" },
    ],
    multiple: true
  },
  {
    id: "zones",
    question: "¿En qué zonas le gustaría vivir?",
    subtitle: "Seleccione todas las que le interesen",
    options: [
      { label: "Rivas Futura", value: "rivas_futura" },
      { label: "Covibar", value: "covibar" },
      { label: "Santa Mónica", value: "santa_monica" },
      { label: "Pablo Iglesias", value: "pablo_iglesias" },
      { label: "Casco Antiguo", value: "casco_antiguo" },
      { label: "Otras zonas de Madrid", value: "otras_madrid" },
    ],
    multiple: true
  },
  {
    id: "budget",
    question: "¿Cuál es su presupuesto máximo?",
    subtitle: "Incluyendo gastos de compra",
    options: [
      { label: "Hasta 200.000 €", value: "hasta_200k" },
      { label: "200.000 - 350.000 €", value: "200k_350k" },
      { label: "350.000 - 500.000 €", value: "350k_500k" },
      { label: "500.000 - 800.000 €", value: "500k_800k" },
      { label: "Más de 800.000 €", value: "mas_800k" },
    ],
    multiple: false
  },
  {
    id: "bedrooms",
    question: "¿Cuántas habitaciones necesita?",
    subtitle: "Mínimo requerido",
    options: [
      { label: "1 habitación", value: "1" },
      { label: "2 habitaciones", value: "2" },
      { label: "3 habitaciones", value: "3" },
      { label: "4 habitaciones", value: "4" },
      { label: "5+ habitaciones", value: "5+" },
    ],
    multiple: false
  },
  {
    id: "timeline",
    question: "¿Cuándo le gustaría mudarse?",
    subtitle: "Tiempo estimado",
    options: [
      { label: "Lo antes posible", value: "urgente" },
      { label: "En 1-3 meses", value: "1_3_meses" },
      { label: "En 3-6 meses", value: "3_6_meses" },
      { label: "En 6-12 meses", value: "6_12_meses" },
      { label: "Sin prisa, busco la ideal", value: "sin_prisa" },
    ],
    multiple: false
  },
  {
    id: "financing",
    question: "¿Cómo financiará la compra?",
    subtitle: "Esto nos ayuda a buscar mejor",
    options: [
      { label: "100% hipoteca", value: "100_hipoteca" },
      { label: "Hipoteca + ahorros", value: "hipoteca_ahorros" },
      { label: "Al contado", value: "contado" },
      { label: "Aún no lo sé", value: "no_se" },
    ],
    multiple: false
  }
];

const BuyerTest = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: ""
  });

  const currentQuestion = questions[step];
  const totalSteps = questions.length + 1; // +1 for contact form

  const handleOptionClick = (value: string) => {
    const question = questions[step];
    
    if (question.multiple) {
      const currentAnswers = (answers[question.id] as string[]) || [];
      if (currentAnswers.includes(value)) {
        setAnswers({ 
          ...answers, 
          [question.id]: currentAnswers.filter(v => v !== value) 
        });
      } else {
        setAnswers({ 
          ...answers, 
          [question.id]: [...currentAnswers, value] 
        });
      }
    } else {
      setAnswers({ ...answers, [question.id]: value });
      // Auto-advance for single selection
      setTimeout(() => {
        if (step < questions.length - 1) {
          setStep(step + 1);
        } else {
          setStep(step + 1); // Move to contact form
        }
      }, 300);
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedPrivacy) {
      toast.error("Debe aceptar la política de privacidad para continuar.");
      return;
    }

    setIsSubmitting(true);
    
    // Preparar datos para el CRM
    const leadData = {
      ...contactData,
      preferences: answers,
      origen: "web_personal_shopper",
      tipo: "comprador"
    };

    try {
      // TODO: Conectar con API del CRM
      console.log("Lead data:", leadData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsCompleted(true);
      toast.success("Perfil de comprador creado. Su Personal Shopper le contactará pronto.");
    } catch (error) {
      toast.error("Error al enviar. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedMultiple = () => {
    if (!currentQuestion) return true;
    if (currentQuestion.multiple) {
      const currentAnswers = answers[currentQuestion.id] as string[];
      return currentAnswers && currentAnswers.length > 0;
    }
    return !!answers[currentQuestion.id];
  };

  const isContactStep = step === questions.length;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/90 p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="text-xl font-serif">Personal Shopper Inmobiliario</h3>
        </div>
        <p className="text-white/70 text-sm">
          {isCompleted 
            ? "¡Perfil completado!" 
            : `Paso ${step + 1} de ${totalSteps}`
          }
        </p>
        {/* Progress bar */}
        {!isCompleted && (
          <div className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all duration-500"
              style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-8 md:p-10 min-h-[450px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {/* Questions */}
          {!isCompleted && !isContactStep && currentQuestion && (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h4 className="text-2xl md:text-3xl font-serif text-foreground mb-2">
                  {currentQuestion.question}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {currentQuestion.subtitle}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = currentQuestion.multiple
                    ? ((answers[currentQuestion.id] as string[]) || []).includes(option.value)
                    : answers[currentQuestion.id] === option.value;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(option.value)}
                      className={`
                        flex items-center gap-4 p-5 border-2 rounded-xl transition-all duration-300 text-left group
                        ${isSelected 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-slate-200 hover:border-primary/30 hover:bg-slate-50'
                        }
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                        ${isSelected 
                          ? 'border-primary bg-primary' 
                          : 'border-slate-300 group-hover:border-primary/50'
                        }
                      `}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation for multiple selection */}
              {currentQuestion.multiple && (
                <div className="flex justify-between pt-6">
                  {step > 0 && (
                    <Button variant="outline" onClick={handlePrev} className="gap-2">
                      <ArrowLeft className="w-4 h-4" /> Anterior
                    </Button>
                  )}
                  <Button 
                    onClick={handleNext}
                    disabled={!canProceedMultiple()}
                    className="gap-2 ml-auto bg-primary hover:bg-primary/90"
                  >
                    Siguiente <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* Contact Form */}
          {!isCompleted && isContactStep && (
            <motion.form
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-2xl font-serif mb-2">Último paso</h4>
                <p className="text-muted-foreground text-sm">
                  Para enviarle las propiedades que encajan con su búsqueda
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Nombre completo *</Label>
                  <Input 
                    required 
                    value={contactData.name}
                    onChange={(e) => setContactData({...contactData, name: e.target.value})}
                    className="mt-2" 
                    placeholder="Su nombre"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Teléfono *</Label>
                    <Input 
                      type="tel" 
                      required 
                      value={contactData.phone}
                      onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                      className="mt-2" 
                      placeholder="600 000 000"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input 
                      type="email" 
                      required 
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      className="mt-2" 
                      placeholder="su@email.com"
                    />
                  </div>
                </div>
                <div>
                  <Label>¿Algo más que debamos saber?</Label>
                  <Textarea 
                    value={contactData.notes}
                    onChange={(e) => setContactData({...contactData, notes: e.target.value})}
                    className="mt-2" 
                    placeholder="Requisitos especiales, situación actual..."
                  />
                </div>

                {/* Privacy */}
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                  <Checkbox 
                    id="privacy-buyer"
                    checked={acceptedPrivacy}
                    onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
                  />
                  <Label htmlFor="privacy-buyer" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                    Acepto la <a href="/privacidad" className="text-primary underline">política de privacidad</a> y 
                    consiento que Römenn me contacte con propiedades que encajen con mi búsqueda.
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={handlePrev} className="gap-2">
                  <ArrowLeft className="w-4 h-4" /> Anterior
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !acceptedPrivacy}
                  className="gap-2 bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Activar Personal Shopper <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}

          {/* Completed */}
          {isCompleted && (
            <motion.div
              key="completed"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h4 className="text-3xl font-serif">¡Perfil Completado!</h4>
              <p className="text-muted-foreground max-w-md mx-auto">
                Hemos activado su búsqueda personalizada. Nuestro algoritmo ya está 
                rastreando propiedades que encajan con sus criterios, incluyendo 
                oportunidades Off-Market.
              </p>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 max-w-md mx-auto">
                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
                  Próximos pasos
                </p>
                <p className="text-sm text-muted-foreground">
                  Un Personal Shopper especializado le contactará en menos de 2 horas 
                  para afinar su búsqueda y mostrarle las primeras opciones.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BuyerTest;
