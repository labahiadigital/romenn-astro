import { Phone, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  currentPath?: string;
}

const Header = ({ currentPath = "/" }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = currentPath === "/";
  const isTransparent = isHome && !isScrolled;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      isTransparent 
        ? "bg-transparent border-transparent shadow-none pt-4" 
        : "bg-white/80 backdrop-blur-md border-b border-border/50 shadow-sm pt-0"
    )}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo - 50% bigger */}
          <a href="/" className="flex items-center gap-3 group">
            <img 
              src="/romenn-logo.svg" 
              alt="Römenn Logo" 
              width="96"
              height="96"
              className={cn(
                "h-24 w-auto object-contain transition-all duration-500 brightness-0",
                isTransparent ? "invert" : ""
              )} 
            />
          </a>

          {/* Navigation Desktop */}
          <NavigationMenu className="hidden xl:flex">
            <NavigationMenuList className="gap-2">
              <NavigationMenuItem>
                <a href="/" className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md bg-transparent px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                    isTransparent 
                      ? "text-white hover:bg-white/10 hover:text-white" 
                      : "hover:bg-accent/10 hover:text-accent data-[active]:bg-accent/10 data-[state=open]:bg-accent/10"
                  )}>
                  Inicio
                </a>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "text-xs uppercase tracking-widest bg-transparent",
                  isTransparent 
                    ? "text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white" 
                    : "hover:bg-accent/10 hover:text-accent data-[state=open]:bg-accent/10 data-[active]:bg-accent/10"
                )}>La Firma</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-4">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md group hover:bg-accent transition-colors"
                          href="/experiencia"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium font-serif text-primary group-hover:text-white transition-colors">
                            Experiencia Römenn
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground font-light group-hover:text-white/90 transition-colors">
                            Descubra nuestra metodología única y el mapa emocional de Rivas.
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/manifiesto" title="Manifiesto">
                      Nuestra declaración de intenciones y valores.
                    </ListItem>
                    <ListItem href="/compromiso" title="Nuestro Compromiso">
                      Un pacto de honor con cada cliente.
                    </ListItem>
                    <ListItem href="/nosotros" title="Quiénes Somos">
                      Conozca al equipo boutique detrás de la marca.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "text-xs uppercase tracking-widest bg-transparent",
                  isTransparent 
                    ? "text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white" 
                    : "hover:bg-accent/10 hover:text-accent data-[state=open]:bg-accent/10 data-[active]:bg-accent/10"
                )}>Servicios</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/servicios" title="Servicios 360°">
                      Ecosistema completo: Jurídico, Financiero, Reformas...
                    </ListItem>
                    <ListItem href="/estudio-financiero" title="Estudio Financiero">
                      Análisis gratuito de su capacidad de inversión.
                    </ListItem>
                    <ListItem href="/cronogramas" title="Blueprints">
                      Cronogramas animados de su operación.
                    </ListItem>
                    <ListItem href="/riesgos-ocultos" title="Riesgos Ocultos">
                      Lo que nadie le cuenta del mercado.
                    </ListItem>
                    <ListItem href="/metodologia" title="Metodología">
                      Ciencia de datos aplicada a la venta.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "text-xs uppercase tracking-widest bg-transparent",
                  isTransparent 
                    ? "text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white" 
                    : "hover:bg-accent/10 hover:text-accent data-[state=open]:bg-accent/10 data-[active]:bg-accent/10"
                )}>Propiedades</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/propiedades" title="Portfolio Exclusivo">
                      Selección curada de hogares con alma.
                    </ListItem>
                    <ListItem href="/vender" title="Vende con nosotros">
                      Maximice el valor de su patrimonio.
                    </ListItem>
                    <ListItem href="/compradores" title="Personal Shopper">
                      Encontramos lo que no está en portales.
                    </ListItem>
                    <ListItem href="/valoracion" title="Valoración">
                      Tasación inteligente y emocional.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "text-xs uppercase tracking-widest bg-transparent",
                  isTransparent 
                    ? "text-white hover:bg-white/10 hover:text-white data-[state=open]:bg-white/10 data-[state=open]:text-white" 
                    : "hover:bg-accent/10 hover:text-accent data-[state=open]:bg-accent/10 data-[active]:bg-accent/10"
                )}>Comunidad</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <ListItem href="/boca-boca" title="Club de Embajadores">
                      Programa de referidos exclusivo.
                    </ListItem>
                    <ListItem href="/resenas" title="Experiencias">
                      Lo que dicen nuestros clientes.
                    </ListItem>
                    <ListItem href="/casos-reales" title="Historias Reales">
                      Documentales de éxito inmobiliario.
                    </ListItem>
                    <ListItem href="/blog" title="Journal">
                      Tendencias y noticias del sector.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-6">
            <a href="tel:+34600000000" className={cn(
              "flex items-center gap-2 text-xs tracking-widest transition-colors font-bold",
              isTransparent ? "text-white hover:text-white/80" : "text-primary hover:text-accent"
            )}>
              <Phone className="w-3 h-3" />
              <span>600 000 000</span>
            </a>
            {/* Button changed from Private Area to Contact */}
            <Button className={cn(
                "rounded-none h-10 px-6 transition-all duration-500",
                isTransparent 
                    ? "bg-white text-primary hover:bg-white/90 border-none hover:shadow-lg"
                    : "btn-premium"
            )} asChild>
                <a href="/contacto">Contacto</a>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <button 
                className={cn(
                  "xl:hidden p-2 transition-colors rounded-md",
                  isTransparent ? "text-white hover:bg-white/10" : "hover:bg-muted"
                )}
                aria-label="Menú principal"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto bg-white/95 backdrop-blur-xl border-l border-border/50">
              <SheetHeader className="mb-8 text-left border-b border-border/50 pb-6">
                <SheetTitle className="text-left">
                    <img src="/romenn-logo.svg" alt="Römenn" className="h-16 w-auto object-contain" />
                </SheetTitle>
                <SheetDescription className="text-left font-light text-xs tracking-widest uppercase text-muted-foreground mt-4">
                    Inmobiliaria Boutique Internacional
                </SheetDescription>
              </SheetHeader>
              
              <div className="flex flex-col gap-6">
                <a href="/" className="text-sm font-bold uppercase tracking-widest hover:text-accent transition-colors py-2 border-b border-border/30">
                    Inicio
                </a>

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="la-firma" className="border-b border-border/30">
                        <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:text-accent py-4">La Firma</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-1 pl-4 pb-4">
                                <SheetClose asChild><a href="/experiencia" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Experiencia Römenn</a></SheetClose>
                                <SheetClose asChild><a href="/manifiesto" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Manifiesto</a></SheetClose>
                                <SheetClose asChild><a href="/compromiso" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Nuestro Compromiso</a></SheetClose>
                                <SheetClose asChild><a href="/nosotros" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Quiénes Somos</a></SheetClose>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    
                    <AccordionItem value="servicios" className="border-b border-border/30">
                        <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:text-accent py-4">Servicios</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-1 pl-4 pb-4">
                                <SheetClose asChild><a href="/servicios" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Servicios 360°</a></SheetClose>
                                <SheetClose asChild><a href="/estudio-financiero" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Estudio Financiero</a></SheetClose>
                                <SheetClose asChild><a href="/cronogramas" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Blueprints</a></SheetClose>
                                <SheetClose asChild><a href="/riesgos-ocultos" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Riesgos Ocultos</a></SheetClose>
                                <SheetClose asChild><a href="/metodologia" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Metodología</a></SheetClose>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="propiedades" className="border-b border-border/30">
                        <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:text-accent py-4">Propiedades</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-1 pl-4 pb-4">
                                <SheetClose asChild><a href="/propiedades" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Portfolio Exclusivo</a></SheetClose>
                                <SheetClose asChild><a href="/vender" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Vende con nosotros</a></SheetClose>
                                <SheetClose asChild><a href="/compradores" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Personal Shopper</a></SheetClose>
                                <SheetClose asChild><a href="/valoracion" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Valoración</a></SheetClose>
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="comunidad" className="border-b border-border/30">
                        <AccordionTrigger className="text-sm font-bold uppercase tracking-widest hover:text-accent py-4">Comunidad</AccordionTrigger>
                        <AccordionContent>
                            <div className="flex flex-col gap-1 pl-4 pb-4">
                                <SheetClose asChild><a href="/boca-boca" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Club de Embajadores</a></SheetClose>
                                <SheetClose asChild><a href="/resenas" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Experiencias</a></SheetClose>
                                <SheetClose asChild><a href="/casos-reales" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Historias Reales</a></SheetClose>
                                <SheetClose asChild><a href="/blog" className="text-sm font-serif text-muted-foreground hover:text-primary transition-colors py-3 block min-h-[48px]">Journal</a></SheetClose>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <div className="mt-8 space-y-6">
                    <a href="tel:+34600000000" className="flex items-center gap-3 text-xs tracking-widest hover:text-accent transition-colors font-bold text-primary">
                        <div className="w-8 h-8 rounded-full border border-primary/20 flex items-center justify-center">
                            <Phone className="w-4 h-4" />
                        </div>
                        <span>600 000 000</span>
                    </a>
                    <SheetClose asChild>
                        <Button className="btn-premium w-full h-14 text-xs" asChild>
                            <a href="/contacto">Contacto</a>
                        </Button>
                    </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-4 min-h-[48px] leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium font-serif leading-none mb-1 group-hover:text-white transition-colors">{title}</div>
          <p className="line-clamp-2 text-xs leading-snug text-muted-foreground font-light group-hover:text-white/90 transition-colors">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default Header;
