const comparisonItems = [
  {
    traditional: "Web básica / móvil",
    traditionalDesc: "Diseño funcional, sin narrativa ni experiencia de marca.",
    romenn: "Editorial Magazine",
    romennDesc: "Cada vivienda se presenta como una pieza única, con narrativa y estética.",
  },
  {
    traditional: "Sin diseño sensorial",
    traditionalDesc: "La vivienda se muestra tal cual, sin preparación ni puesta en escena.",
    romenn: "Diseño sensorial completo",
    romennDesc: "Cuidamos luz, espacios y percepción para maximizar el impacto emocional.",
  },
  {
    traditional: "Valoración basada en m²",
    traditionalDesc: "Precio genérico sin análisis emocional ni estratégico.",
    romenn: "Valoración emocional + análisis de datos",
    romennDesc: "Precio definido por mercado real, contexto y demanda.",
  },
  {
    traditional: "Cualquiera que llame",
    traditionalDesc: "Sin filtro previo de solvencia ni perfil del comprador.",
    romenn: "Solo compradores cualificados",
    romennDesc: "Filtramos capacidad financiera y motivación antes de cada visita.",
  },
  {
    traditional: "Seguimiento esporádico",
    traditionalDesc: "Información puntual, sin control ni visión de conjunto.",
    romenn: "Panel de seguimiento semanal",
    romennDesc: "Información clara y continua sobre visitas e interés.",
  },
  {
    traditional: "Gestoría externa",
    traditionalDesc: "Procesos jurídicos delegados, sin control directo.",
    romenn: "Equipo jurídico propio",
    romennDesc: "Control legal y fiscal desde el inicio hasta la firma.",
  },
  {
    traditional: "Portales locales",
    traditionalDesc: "Difusión limitada al mercado más cercano.",
    romenn: "Red internacional y fuera de mercado",
    romennDesc: "Acceso a compradores que no buscan en portales.",
  },
];

const ComparisonTable = () => {
  return (
    <>
      {/* Desktop: Two columns */}
      <div className="hidden md:grid md:grid-cols-2 gap-0">
        {/* Left Column Header - Tradicional */}
        <div className="p-6 lg:p-8 border-b border-r border-slate-200">
          <h3 className="text-lg lg:text-xl font-serif text-foreground/50">Agencia tradicional</h3>
          <p className="text-xs text-muted-foreground mt-1">(modelo generalista orientado a volumen)</p>
        </div>
        {/* Right Column Header - Römenn */}
        <div className="p-6 lg:p-8 border-b border-slate-200 bg-primary/[0.02]">
          <h3 className="text-lg lg:text-xl font-serif text-primary font-medium">RÖMENN Boutique</h3>
          <p className="text-xs text-primary/60 mt-1">(modelo boutique orientado a valor y protección del patrimonio)</p>
        </div>

        {comparisonItems.map((item, index) => (
          <>
            {/* Traditional */}
            <div
              key={`trad-${index}`}
              className={`p-6 lg:p-8 border-r border-slate-200 ${index < comparisonItems.length - 1 ? 'border-b' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-muted-foreground/40 mt-0.5">–</span>
                <div>
                  <p className="text-sm text-foreground/60">{item.traditional}</p>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-light leading-relaxed">{item.traditionalDesc}</p>
                </div>
              </div>
            </div>
            {/* Römenn */}
            <div
              key={`rom-${index}`}
              className={`p-6 lg:p-8 bg-primary/[0.02] ${index < comparisonItems.length - 1 ? 'border-b border-slate-200' : ''}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-primary mt-0.5">–</span>
                <div>
                  <p className="text-sm text-primary font-medium">{item.romenn}</p>
                  <p className="text-xs text-primary/50 mt-1 font-light leading-relaxed">{item.romennDesc}</p>
                </div>
              </div>
            </div>
          </>
        ))}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-6">
        {comparisonItems.map((item, index) => (
          <div key={index} className="border border-slate-100 rounded-xl overflow-hidden">
            <div className="p-5 bg-slate-50/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Agencia tradicional</p>
              <p className="text-sm text-foreground/60">{item.traditional}</p>
              <p className="text-xs text-muted-foreground/50 mt-1 font-light">{item.traditionalDesc}</p>
            </div>
            <div className="p-5 bg-primary/[0.03] border-t border-slate-100">
              <p className="text-xs text-primary uppercase tracking-wider font-medium mb-2">RÖMENN Boutique</p>
              <p className="text-sm text-primary font-medium">{item.romenn}</p>
              <p className="text-xs text-primary/50 mt-1 font-light">{item.romennDesc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ComparisonTable;
