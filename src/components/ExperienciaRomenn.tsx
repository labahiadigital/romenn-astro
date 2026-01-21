import { Button } from "@/components/ui/button";
import { 
  Star,
  ArrowRight,
  MapPin
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

// Firmas de éxito - datos de ejemplo (conectar con CRM)
const successStats = [
  { number: "150+", label: "Familias acompañadas" },
  { number: "98%", label: "Clientes satisfechos" },
  { number: "45", label: "Días de venta media" },
];

// Reseñas destacadas (conectar con Google Reviews API)
const featuredReviews = [
  {
    name: "María G.",
    context: "Venta por separación",
    rating: 5,
    text: "Nos ayudaron en un momento muy difícil. Gestionaron todo con discreción y profesionalidad. Vendimos en el tiempo que necesitábamos.",
  },
  {
    name: "Carlos y Ana",
    context: "Compra de primera vivienda",
    rating: 5,
    text: "Nos encontraron una casa que no estaba en ningún portal. El proceso fue transparente y nos sentimos acompañados en todo momento.",
  },
  {
    name: "Roberto F.",
    context: "Herencia",
    rating: 5,
    text: "Gestionaron toda la herencia de mi madre con una sensibilidad increíble. Me quitaron un peso enorme de encima.",
  }
];

const ExperienciaRomenn = () => {
  return (
    <section id="experiencia" className="relative overflow-hidden">
      
      {/* Part 1: Sobre RÖMENN - Extracto */}
      <div className="py-24 md:py-32 bg-slate-50">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-6 block">
              Sobre RÖMENN
            </span>
          </FadeIn>

          <FadeIn className="space-y-8 text-center">
            <p className="text-2xl md:text-3xl lg:text-4xl font-serif text-foreground leading-relaxed">
              Un proyecto construido con respeto, con cuidado y con la voluntad de hacer las cosas bien hechas, <span className="italic text-primary">sin ruido innecesario.</span>
            </p>
            
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Rivas-Vaciamadrid</span>
            </div>
          </FadeIn>

          <FadeIn delay={300} className="mt-12 text-center">
            <a href="/experiencia">
              <Button variant="outline" className="border-slate-200 hover:border-primary hover:text-primary group">
                Conocer nuestra historia
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </FadeIn>
        </div>
      </div>

      {/* Part 2: Cifras */}
      <div className="py-16 bg-primary text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {successStats.map((stat, index) => (
              <FadeIn
                key={index}
                delay={index * 100}
                className="py-4"
              >
                <div className="text-4xl md:text-5xl font-serif mb-2">{stat.number}</div>
                <div className="text-white/60 text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* Part 3: Reseñas de Clientes */}
      <div className="py-24 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <span className="text-xs uppercase tracking-[0.3em] text-primary/60 font-medium mb-4 block">
              Voces de confianza
            </span>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">
              Lo que dicen quienes han trabajado con nosotros
            </h2>
            <p className="text-muted-foreground font-light text-sm">
              Reseñas verificadas de Google
            </p>
          </FadeIn>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {featuredReviews.map((review, index) => (
              <FadeIn
                key={index}
                delay={index * 100}
                className="bg-slate-50 p-8 rounded-lg"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className="text-foreground/80 leading-relaxed mb-6 font-light">
                  "{review.text}"
                </p>
                
                {/* Author */}
                <div>
                  <div className="font-medium text-foreground text-sm">{review.name}</div>
                  <div className="text-xs text-muted-foreground">{review.context}</div>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA to see all reviews */}
          <FadeIn className="text-center">
            <a href="/resenas">
              <Button variant="outline" className="border-slate-200 hover:border-primary hover:text-primary group">
                Ver todas las reseñas
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

export default ExperienciaRomenn;
