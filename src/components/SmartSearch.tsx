import { useState } from "react";
import { Search, Sun, School, Train, Shield, Heart, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

const lifestyleTags = [
  { id: "luz", label: "Mucha Luz Natural", icon: Sun },
  { id: "colegios", label: "Cerca de Colegios", icon: School },
  { id: "transporte", label: "Movilidad / Metro", icon: Train },
  { id: "seguridad", label: "Privacidad Total", icon: Shield },
  { id: "familia", label: "Vida Familiar", icon: Heart },
  { id: "teletrabajo", label: "Espacio Office", icon: Briefcase },
];

const SmartSearch = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId));
    } else {
      setSelectedTags([...selectedTags, tagId]);
    }
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      window.location.href = `/propiedades?tags=${selectedTags.join(',')}`;
    }, 1500);
  };

  return (
    <div className="w-full bg-muted/30 border-y border-border py-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-2xl md:text-3xl font-serif mb-8">¿Qué es innegociable para usted?</h3>
        
        <div className="flex flex-wrap justify-center gap-4 mb-10">
            {lifestyleTags.map((tag) => (
                <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-sm border transition-all duration-300 group ${
                        selectedTags.includes(tag.id)
                        ? "bg-primary text-white border-primary shadow-lg scale-105"
                        : "bg-white border-border hover:border-accent hover:text-accent"
                    }`}
                >
                    <tag.icon className={`w-5 h-5 ${selectedTags.includes(tag.id) ? "text-accent" : "text-muted-foreground group-hover:text-accent"}`} />
                    <span className={`text-sm uppercase tracking-widest font-bold ${selectedTags.includes(tag.id) ? "text-white" : "text-muted-foreground group-hover:text-accent"}`}>
                        {tag.label}
                    </span>
                </button>
            ))}
        </div>

        <div className="relative h-16 max-w-md mx-auto">
             <Button 
                onClick={handleSearch}
                disabled={selectedTags.length === 0 || isSearching}
                className={`w-full h-full text-sm tracking-widest uppercase font-bold transition-all duration-500 ${
                    selectedTags.length > 0 ? "btn-premium" : "bg-gray-200 text-gray-400 cursor-not-allowed hover:bg-gray-200"
                }`}
             >
                {isSearching ? (
                    <span className="animate-pulse">Buscando su hogar ideal...</span>
                ) : (
                    <span className="flex items-center justify-center gap-3">
                        <Search className="w-4 h-4" /> Ver Resultados ({selectedTags.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0})
                    </span>
                )}
             </Button>
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
