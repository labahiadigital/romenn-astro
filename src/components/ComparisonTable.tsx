import { Check, X, Minus } from "lucide-react";
import { motion } from "framer-motion";

const ComparisonTable = () => {
  const features = [
    { name: "Reportaje Fotográfico", traditional: "Básico / Móvil", romenn: "Editorial Magazine" },
    { name: "Home Staging", traditional: "No incluido", romenn: "Diseño Sensorial Completo" },
    { name: "Estrategia de Precio", traditional: "Basada en m²", romenn: "Valoración Emocional + Big Data" },
    { name: "Filtrado de Visitas", traditional: "Cualquiera que llame", romenn: "Solo Compradores Cualificados" },
    { name: "Reportes de Estado", traditional: "Esporádicos", romenn: "Dashboard Semanal en Tiempo Real" },
    { name: "Seguridad Jurídica", traditional: "Gestoría externa", romenn: "Equipo Jurídico In-House" },
    { name: "Alcance", traditional: "Portales Locales", romenn: "Red Internacional & Off-Market" },
  ];

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-white shadow-xl">
      <div className="grid grid-cols-3 bg-muted/50 p-6 text-center font-serif text-lg md:text-xl font-bold text-foreground">
        <div className="text-left pl-4 text-muted-foreground text-base font-sans font-normal uppercase tracking-widest">Característica</div>
        <div className="opacity-50">Agencia Tradicional</div>
        <div className="text-primary">Römenn Boutique</div>
      </div>

      {features.map((feature, index) => (
        <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`grid grid-cols-3 p-6 items-center border-t border-border hover:bg-muted/20 transition-colors duration-300 ${index === features.length -1 ? 'bg-primary/5' : ''}`}
        >
            <div className="font-bold font-serif text-foreground pl-4">{feature.name}</div>
            
            <div className="text-center text-muted-foreground font-light flex flex-col items-center justify-center gap-2">
                <span className="text-sm">{feature.traditional}</span>
                {feature.traditional.includes("No") || feature.traditional.includes("Básico") ? (
                    <X className="w-4 h-4 text-red-300" />
                ) : (
                    <Minus className="w-4 h-4 text-gray-300" />
                )}
            </div>
            
            <div className="text-center text-primary font-bold flex flex-col items-center justify-center gap-2 relative">
                {index === features.length -1 && (
                    <div className="absolute inset-0 bg-accent/10 blur-xl -z-10" />
                )}
                <span className="text-sm uppercase tracking-wide">{feature.romenn}</span>
                <Check className="w-5 h-5 text-accent" />
            </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ComparisonTable;
