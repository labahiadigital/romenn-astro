import { Check, X, Minus } from "lucide-react";

const ComparisonTable = () => {
  const features = [
    { name: "Reportaje Fotográfico", traditional: "Básico / Móvil", romenn: "Editorial Magazine", traditionalBad: true },
    { name: "Home Staging", traditional: "No incluido", romenn: "Diseño Sensorial Completo", traditionalBad: true },
    { name: "Estrategia de Precio", traditional: "Basada en m²", romenn: "Valoración Emocional + Big Data", traditionalBad: false },
    { name: "Filtrado de Visitas", traditional: "Cualquiera que llame", romenn: "Solo Compradores Cualificados", traditionalBad: false },
    { name: "Reportes de Estado", traditional: "Esporádicos", romenn: "Dashboard Semanal", traditionalBad: false },
    { name: "Seguridad Jurídica", traditional: "Gestoría externa", romenn: "Equipo Jurídico In-House", traditionalBad: false },
    { name: "Alcance", traditional: "Portales Locales", romenn: "Red Internacional & Off-Market", traditionalBad: false },
  ];

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-hidden rounded-sm border border-border bg-white shadow-xl">
        <div className="grid grid-cols-3 bg-muted/50 p-4 lg:p-6 text-center">
          <div className="text-left pl-2 lg:pl-4 text-muted-foreground text-xs lg:text-sm uppercase tracking-widest">Característica</div>
          <div className="text-sm lg:text-lg opacity-50">Agencia Tradicional</div>
          <div className="text-sm lg:text-lg text-primary font-semibold">Römenn Boutique</div>
        </div>

        {features.map((feature, index) => (
          <div 
            key={index}
            className={`grid grid-cols-3 p-4 lg:p-6 items-center border-t border-border hover:bg-muted/20 transition-colors duration-300 ${index === features.length - 1 ? 'bg-primary/5' : ''}`}
          >
            <div className="font-semibold text-foreground pl-2 lg:pl-4 text-sm lg:text-base">{feature.name}</div>
            
            <div className="text-center text-muted-foreground flex flex-col items-center justify-center gap-1 lg:gap-2">
              <span className="text-xs lg:text-sm">{feature.traditional}</span>
              {feature.traditionalBad ? (
                <X className="w-4 h-4 text-red-300" />
              ) : (
                <Minus className="w-4 h-4 text-gray-300" />
              )}
            </div>
            
            <div className="text-center text-primary font-semibold flex flex-col items-center justify-center gap-1 lg:gap-2 relative">
              {index === features.length - 1 && (
                <div className="absolute inset-0 bg-accent/10 blur-xl -z-10" />
              )}
              <span className="text-xs lg:text-sm uppercase tracking-wide">{feature.romenn}</span>
              <Check className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {features.map((feature, index) => (
          <div 
            key={index}
            className={`bg-white rounded-lg border border-border shadow-sm overflow-hidden ${index === features.length - 1 ? 'ring-2 ring-accent/20' : ''}`}
          >
            <div className="bg-muted/50 px-4 py-3">
              <h3 className="font-semibold text-foreground text-sm">{feature.name}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Tradicional</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{feature.traditional}</span>
                  {feature.traditionalBad ? (
                    <X className="w-4 h-4 text-red-300 flex-shrink-0" />
                  ) : (
                    <Minus className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}
                </div>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between">
                <span className="text-xs text-primary uppercase tracking-wide font-semibold">Römenn</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-semibold">{feature.romenn}</span>
                  <Check className="w-4 h-4 text-accent flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ComparisonTable;
