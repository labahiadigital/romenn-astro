import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Scale, 
  Home, 
  Clock, 
  Briefcase, 
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

// Componente de animación CSS sin framer-motion
const FadeIn = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'} ${className}`}
    >
      {children}
    </div>
  );
};

// Situaciones del propietario - conectables al CRM
const sellerSituations = [
  {
    id: "separacion",
    title: "Separación",
    subtitle: "Un cambio que no se ha buscado",
    description: "No todas las ventas se viven igual. Cuando una separación obliga a vender, el proceso necesita discreción, coordinación entre partes y, sobre todo, respeto por el momento.",
    icon: Heart,
    color: "from-rose-500/10 to-rose-600/5",
    iconColor: "text-rose-600",
  },
  {
    id: "herencia",
    title: "Herencia",
    subtitle: "El cierre de una etapa",
    description: "Vender una vivienda heredada implica gestionar emociones además de trámites. Nos ocupamos de todo el proceso legal y fiscal para que usted pueda centrarse en lo importante.",
    icon: Scale,
    color: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600",
  },
  {
    id: "cambio",
    title: "Cambio de etapa",
    subtitle: "Una decisión elegida",
    description: "A veces llega el momento de cambiar. Una nueva ciudad, más espacio, menos metros. Coordinamos la venta y la compra para que la transición sea fluida.",
    icon: Home,
    color: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600",
  },
  {
    id: "urgencia",
    title: "Necesidad de liquidez",
    subtitle: "Cuando el tiempo apremia",
    description: "Hay procesos que necesitan rapidez. Activamos nuestra red de compradores cualificados para cerrar en el menor tiempo posible, sin malvender.",
    icon: Clock,
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600",
  },
  {
    id: "inversion",
    title: "Desinversión",
    subtitle: "Optimizar el patrimonio",
    description: "Vender una propiedad de inversión requiere planificación fiscal y timing. Le asesoramos para maximizar el resultado dentro de la legalidad.",
    icon: Briefcase,
    color: "from-violet-500/10 to-violet-600/5",
    iconColor: "text-violet-600",
  },
  {
    id: "jubilacion",
    title: "Jubilación",
    subtitle: "Con calma y cuidado",
    description: "Acompañamos este proceso con calma, claridad y respeto. Cada paso se explica, cada decisión se toma sin prisa y con la familia.",
    icon: Users,
    color: "from-teal-500/10 to-teal-600/5",
    iconColor: "text-teal-600",
  }
];

const SellerSituations = () => {
  const [selectedSituation, setSelectedSituation] = useState<string | null>(null);
  const [hoveredSituation, setHoveredSituation] = useState<string | null>(null);

  const activeSituation = sellerSituations.find(s => s.id === selectedSituation);

  return (
    <section id="vendedores" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Introducción reflexiva - Editorial Boutique */}
        <FadeIn className="max-w-4xl mx-auto mb-32">
          {/* Etiqueta superior */}
          <span className="text-[11px] uppercase tracking-[0.35em] text-primary/70 font-medium mb-16 block text-center">
            Cuándo tiene sentido vender
          </span>
          
          {/* FRASE MANIFIESTO - Protagonismo máximo */}
          <FadeIn delay={200} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-serif text-foreground leading-[1.15] tracking-tight text-center mb-20">
            Vender una vivienda no siempre<br className="hidden sm:block" /> 
            llega en un momento cómodo.
          </FadeIn>

          {/* Contexto - Texto más ligero */}
          <FadeIn delay={400} className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed">
              A veces es una decisión elegida.
            </p>
            <p className="text-base md:text-lg text-foreground/70 font-light leading-relaxed mt-2">
              Otras, una consecuencia de un cambio que no se ha buscado:<br className="hidden md:block" />
              una separación, una herencia, el cierre de una etapa.
            </p>
          </FadeIn>

          {/* FRASES CLAVE - Destacadas con aire */}
          <FadeIn delay={500} className="text-center space-y-3 mb-20">
            <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground/90 tracking-tight">
              No todas las ventas se viven igual.
            </p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground/90 tracking-tight">
              Ni deberían tratarse igual.
            </p>
          </FadeIn>

          {/* Frases de ritmo - Con pausa y aire */}
          <FadeIn delay={600} className="max-w-xl mx-auto text-center mb-24">
            <p className="text-lg md:text-xl text-foreground/60 font-light leading-loose tracking-wide">
              Hay procesos que necesitan rapidez.
            </p>
            <p className="text-lg md:text-xl text-foreground/60 font-light leading-loose tracking-wide mt-4">
              Y otros que necesitan pausa.
            </p>
          </FadeIn>

          {/* Separador sutil */}
          <div className="flex justify-center mb-20">
            <div className="w-12 h-px bg-slate-200" />
          </div>

          {/* Bloque RÖMENN - Contexto institucional */}
          <FadeIn delay={700} className="max-w-2xl mx-auto text-center space-y-8">
            <p className="text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              En <span className="font-medium text-foreground/80">RÖMENN</span> no intervenimos desde la prisa ni desde la presión.
              <br className="hidden md:block" />
              Leemos el contexto, entendemos el momento y actuamos en consecuencia.
            </p>
            <p className="text-base md:text-lg text-foreground/60 font-light leading-relaxed">
              No trabajamos para forzar decisiones.
              <br className="hidden md:block" />
              Trabajamos para que cada paso tenga sentido dentro de la situación real de cada persona.
            </p>
          </FadeIn>

          {/* CIERRE DE MARCA - Firma elegante */}
          <FadeIn delay={900} className="mt-24 text-center">
            <p className="text-xl md:text-2xl lg:text-3xl font-serif text-primary italic tracking-wide">
              Aquí el tiempo importa.
            </p>
          </FadeIn>
        </FadeIn>

        {/* Separador visual */}
        <div className="flex items-center justify-center mb-20">
          <div className="h-px w-16 bg-slate-200" />
          <div className="w-2 h-2 rounded-full bg-primary/30 mx-4" />
          <div className="h-px w-16 bg-slate-200" />
        </div>

        {/* Header de situaciones */}
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif mb-4 tracking-tight">
            ¿Cuál es su situación?
          </h2>
          <p className="text-muted-foreground font-light max-w-xl mx-auto">
            Cada proceso es diferente. Seleccione la que más se acerque a la suya.
          </p>
        </FadeIn>

        {/* Situations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          {sellerSituations.map((situation, index) => (
            <FadeIn key={situation.id} delay={index * 80}>
              <button
                onClick={() => setSelectedSituation(selectedSituation === situation.id ? null : situation.id)}
                onMouseEnter={() => setHoveredSituation(situation.id)}
                onMouseLeave={() => setHoveredSituation(null)}
                className={`
                  relative w-full p-6 md:p-8 text-left rounded-xl border transition-all duration-500 group
                  ${selectedSituation === situation.id 
                    ? 'border-primary/30 bg-slate-50 shadow-lg' 
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                  }
                `}
              >
                {/* Gradient background on hover/select */}
                <div className={`
                  absolute inset-0 rounded-xl bg-gradient-to-br ${situation.color} 
                  transition-opacity duration-500
                  ${selectedSituation === situation.id || hoveredSituation === situation.id ? 'opacity-100' : 'opacity-0'}
                `} />
                
                <div className="relative z-10">
                  <div className={`
                    w-12 h-12 rounded-lg flex items-center justify-center mb-5 transition-all duration-500
                    ${selectedSituation === situation.id 
                      ? `bg-white shadow ${situation.iconColor}` 
                      : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:shadow-sm'
                    }
                  `}>
                    <situation.icon className={`w-6 h-6 transition-colors duration-500 ${
                      selectedSituation === situation.id || hoveredSituation === situation.id 
                        ? situation.iconColor 
                        : ''
                    }`} strokeWidth={1.5} />
                  </div>
                  
                  <h3 className="text-lg font-medium mb-1 text-foreground group-hover:text-primary transition-colors">
                    {situation.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {situation.subtitle}
                  </p>

                  {/* Selection indicator */}
                  <div className={`
                    absolute top-4 right-4 w-5 h-5 rounded-full border flex items-center justify-center
                    transition-all duration-300
                    ${selectedSituation === situation.id 
                      ? 'border-primary bg-primary' 
                      : 'border-slate-200 group-hover:border-slate-300'
                    }
                  `}>
                    {selectedSituation === situation.id && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </FadeIn>
          ))}
        </div>

        {/* Expanded Detail Panel */}
        {activeSituation && (
          <div className="overflow-hidden transition-all duration-400">
            <div className={`
              bg-gradient-to-br ${activeSituation.color} 
              rounded-xl p-8 md:p-12 border border-slate-100
            `}>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className={`inline-flex items-center gap-2 ${activeSituation.iconColor} text-sm font-medium uppercase tracking-wider mb-4`}>
                    <activeSituation.icon className="w-4 h-4" />
                    {activeSituation.title}
                  </div>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    {activeSituation.description}
                  </p>
                </div>
                <div className="flex flex-col gap-4">
                  <a href="/valoracion">
                    <Button className="w-full py-6 text-base bg-primary hover:bg-primary/90 text-white rounded-lg">
                      Solicitar valoración
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                  <a href="/contacto">
                    <Button variant="outline" className="w-full py-6 text-base border rounded-lg hover:bg-white">
                      Prefiero hablar primero
                    </Button>
                  </a>
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Sin compromiso · Sin presión
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom CTA - Always visible */}
        {!selectedSituation && (
          <FadeIn className="text-center mt-12">
            <p className="text-muted-foreground mb-6 font-light">
              ¿Su situación no encaja en ninguna de estas? No importa.
            </p>
            <a href="/contacto">
              <Button variant="outline" className="border-slate-200 hover:border-primary hover:text-primary group">
                Cuéntenos su caso
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </FadeIn>
        )}
      </div>
    </section>
  );
};

export default SellerSituations;
