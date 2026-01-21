import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X, Bed, Bath, Maximize } from "lucide-react";

interface Property {
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  status?: string;
  type: string;
}

interface PropertiesFilterProps {
  properties: Property[];
}

const PropertiesFilter = ({ properties }: PropertiesFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");

  // Filtrar propiedades
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = propertyType === "all" || property.type === propertyType;
    const matchesBedrooms = bedrooms === "all" || property.beds >= parseInt(bedrooms);
    
    // Filtro de precio simplificado
    let matchesPrice = true;
    if (priceRange !== "all") {
      const priceNum = parseInt(property.price.replace(/[^0-9]/g, ''));
      switch (priceRange) {
        case "hasta_300k":
          matchesPrice = priceNum <= 300000;
          break;
        case "300k_500k":
          matchesPrice = priceNum > 300000 && priceNum <= 500000;
          break;
        case "500k_800k":
          matchesPrice = priceNum > 500000 && priceNum <= 800000;
          break;
        case "mas_800k":
          matchesPrice = priceNum > 800000;
          break;
      }
    }
    
    return matchesSearch && matchesType && matchesBedrooms && matchesPrice;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setPropertyType("all");
    setPriceRange("all");
    setBedrooms("all");
  };

  const hasActiveFilters = searchTerm || propertyType !== "all" || priceRange !== "all" || bedrooms !== "all";

  return (
    <div>
      {/* Search & Filters Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por zona, tipo..."
                className="pl-12 h-12 bg-slate-50 border-slate-200"
              />
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </Button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-3">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-40 h-12 bg-slate-50">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="piso">Piso</SelectItem>
                  <SelectItem value="chalet">Chalet</SelectItem>
                  <SelectItem value="atico">Ático</SelectItem>
                  <SelectItem value="duplex">Dúplex</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-44 h-12 bg-slate-50">
                  <SelectValue placeholder="Precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier precio</SelectItem>
                  <SelectItem value="hasta_300k">Hasta 300.000 €</SelectItem>
                  <SelectItem value="300k_500k">300k - 500k €</SelectItem>
                  <SelectItem value="500k_800k">500k - 800k €</SelectItem>
                  <SelectItem value="mas_800k">Más de 800k €</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-36 h-12 bg-slate-50">
                  <SelectValue placeholder="Habitaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquiera</SelectItem>
                  <SelectItem value="1">1+ hab.</SelectItem>
                  <SelectItem value="2">2+ hab.</SelectItem>
                  <SelectItem value="3">3+ hab.</SelectItem>
                  <SelectItem value="4">4+ hab.</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" onClick={clearFilters} className="gap-2 text-muted-foreground">
                  <X className="w-4 h-4" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="md:hidden pt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger className="w-full h-12 bg-slate-50">
                  <SelectValue placeholder="Tipo de propiedad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  <SelectItem value="piso">Piso</SelectItem>
                  <SelectItem value="chalet">Chalet</SelectItem>
                  <SelectItem value="atico">Ático</SelectItem>
                  <SelectItem value="duplex">Dúplex</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-full h-12 bg-slate-50">
                  <SelectValue placeholder="Rango de precio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquier precio</SelectItem>
                  <SelectItem value="hasta_300k">Hasta 300.000 €</SelectItem>
                  <SelectItem value="300k_500k">300k - 500k €</SelectItem>
                  <SelectItem value="500k_800k">500k - 800k €</SelectItem>
                  <SelectItem value="mas_800k">Más de 800k €</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bedrooms} onValueChange={setBedrooms}>
                <SelectTrigger className="w-full h-12 bg-slate-50">
                  <SelectValue placeholder="Habitaciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Cualquiera</SelectItem>
                  <SelectItem value="1">1+ habitaciones</SelectItem>
                  <SelectItem value="2">2+ habitaciones</SelectItem>
                  <SelectItem value="3">3+ habitaciones</SelectItem>
                  <SelectItem value="4">4+ habitaciones</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters} className="w-full gap-2">
                  <X className="w-4 h-4" />
                  Limpiar filtros
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <p className="text-sm text-muted-foreground">
          {filteredProperties.length} {filteredProperties.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
        </p>
      </div>

      {/* Properties Grid - 2 columns as requested */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <article className="group cursor-pointer">
                  <div className="aspect-[4/3] bg-muted overflow-hidden relative mb-6">
                    <img 
                      src={property.image} 
                      alt={property.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {property.status && (
                      <span className="absolute top-4 left-4 bg-accent text-white text-xs uppercase tracking-widest px-4 py-2 font-bold">
                        {property.status}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <span className="text-accent text-xs uppercase tracking-widest font-bold">
                      {property.location}
                    </span>
                    <h3 className="text-2xl font-serif group-hover:text-accent transition-colors">
                      {property.title}
                    </h3>
                    <p className="text-2xl font-serif text-primary">{property.price}</p>
                    
                    <div className="flex items-center gap-6 text-muted-foreground text-sm pt-2 border-t border-border">
                      <span className="flex items-center gap-2">
                        <Bed className="w-4 h-4" />
                        {property.beds} hab.
                      </span>
                      <span className="flex items-center gap-2">
                        <Bath className="w-4 h-4" />
                        {property.baths} baños
                      </span>
                      <span className="flex items-center gap-2">
                        <Maximize className="w-4 h-4" />
                        {property.sqm} m²
                      </span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-serif mb-2">No hay resultados</h3>
            <p className="text-muted-foreground mb-6">
              No encontramos propiedades que coincidan con sus filtros.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif mb-4">
            ¿No encuentra lo que busca?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tenemos acceso a propiedades Off-Market que no aparecen en portales. 
            Active nuestro Personal Shopper y encontraremos su hogar ideal.
          </p>
          <a href="/compradores" className="inline-block btn-premium px-8 py-4">
            Activar Personal Shopper
          </a>
        </div>
      </section>
    </div>
  );
};

export default PropertiesFilter;
