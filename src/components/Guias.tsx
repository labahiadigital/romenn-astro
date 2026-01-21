import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuidesProps {
  propertyImage: string;
}

const guides = [
  {
    title: "Guía de Venta Premium",
    subtitle: "Cómo maximizar el valor de su patrimonio en 2024",
    category: "Vendedores"
  },
  {
    title: "Fiscalidad & Herencias",
    subtitle: "Manual de protección patrimonial y sucesiones",
    category: "Legal"
  },
  {
    title: "El Arte de Comprar",
    subtitle: "Claves para detectar oportunidades Off-Market",
    category: "Compradores"
  },
  {
    title: "VPO: Guía Definitiva",
    subtitle: "Todo lo que necesita saber sobre normativa actual",
    category: "Normativa"
  }
];

const Guias = ({ propertyImage }: GuidesProps) => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-accent mb-4 block">Conocimiento Römenn</span>
            <h2 className="text-3xl md:text-5xl font-serif mb-6">Guías Exclusivas</h2>
            <p className="text-muted-foreground font-light max-w-2xl mx-auto">
                Acceda a nuestro repositorio de conocimiento experto. Documentación clara para decisiones complejas.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guides.map((guide, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative bg-background border border-border overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500"
                >
                    <div className="aspect-[3/4] relative overflow-hidden">
                        <img 
                            src={propertyImage} 
                            alt={guide.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                        
                        <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur text-primary text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                {guide.category}
                            </span>
                        </div>
                    </div>

                    <div className="p-6 relative">
                        <h3 className="text-xl font-serif mb-2 group-hover:text-accent transition-colors">{guide.title}</h3>
                        <p className="text-sm text-muted-foreground font-light mb-6 line-clamp-2">
                            {guide.subtitle}
                        </p>
                        <Button variant="ghost" className="p-0 h-auto text-xs font-bold uppercase tracking-widest hover:bg-transparent hover:text-accent flex items-center gap-2 group/btn">
                            Descargar PDF <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Guias;
