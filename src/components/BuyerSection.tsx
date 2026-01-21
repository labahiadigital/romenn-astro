import { Button } from "@/components/ui/button";
import { 
  Search, 
  Calculator, 
  FileCheck, 
  Home,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useState, useEffect } from "react";

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

const buyerFeatures = [
  {
    icon: Search,
    title: "Personal Shopper Inmobiliario",
    description: "Buscamos por usted lo que no está en los portales. Acceso a propiedades Off-Market y preventa exclusiva.",
    link: "/compradores"
  },
  {
    icon: Calculator,
    title: "Estudio Financiero Gratuito",
    description: "Antes de buscar, sepa exactamente cuánto puede invertir. Analizamos su capacidad real sin compromiso.",
    link: "/estudio-financiero"
  },
  {
    icon: FileCheck,
    title: "Due Diligence Completa",
    description: "Investigamos cada propiedad antes de que firme. Cargas, vicios ocultos, urbanismo... todo al descubierto.",
    link: "/riesgos-ocultos"
  }
];

const BuyerSection = () => {
  return (
    <section id="compradores" className="py-24 md:py-32 bg-slate-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <FadeIn className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-sky-400 font-bold mb-6">
            <Home className="w-4 h-4" />
            Para Compradores
          </span>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 tracking-tight">
            Encontramos el hogar que <span className="italic text-accent">merece</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light max-w-2xl mx-auto leading-relaxed">
            No pierda el tiempo en portales. Cuéntenos qué busca y activaremos 
            nuestra red para encontrar su hogar ideal.
          </p>
        </FadeIn>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          {buyerFeatures.map((feature, index) => (
            <FadeIn
              key={index}
              delay={index * 150}
              className="group"
            >
              <a href={feature.link} className="block h-full">
                <div className="h-full p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 hover:border-accent/30 transition-all duration-500">
                  <div className="w-14 h-14 bg-accent/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent/30 transition-colors">
                    <feature.icon className="w-7 h-7 text-accent" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-serif mb-3 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 font-light leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-sky-400 font-medium group-hover:gap-3 transition-all">
                    Saber más <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* CTA */}
        <FadeIn className="text-center">
          <a href="/compradores">
            <Button className="bg-accent hover:bg-accent/90 text-white px-10 py-6 text-sm tracking-widest uppercase font-bold rounded-xl shadow-lg shadow-accent/20 group">
              <Sparkles className="w-4 h-4 mr-2" />
              Activar Personal Shopper
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>
          <p className="text-white/40 text-sm mt-4">
            Servicio gratuito · Sin compromiso
          </p>
        </FadeIn>
      </div>
    </section>
  );
};

export default BuyerSection;
