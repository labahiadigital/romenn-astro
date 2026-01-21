import { ArrowDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Usar video y frame desde public
const heroVideo = "/video_hero.mp4";
const heroFrame = "/hero-frame.webp";

const Hero = () => {
  const [videoReady, setVideoReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleCanPlayThrough = () => {
        setVideoReady(true);
        video.play().catch(console.error);
      };

      if (video.readyState >= 3) {
        handleCanPlayThrough();
      } else {
        video.addEventListener('canplaythrough', handleCanPlayThrough);
        video.addEventListener('loadeddata', () => {
          if (video.readyState >= 2) {
            handleCanPlayThrough();
          }
        });
      }

      video.load();

      return () => {
        video.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: '100svh' }}>
      {/* 
        Background container - usa aspect-ratio para reservar espacio y evitar CLS
        El contenedor tiene posición absoluta para no afectar el layout
      */}
      <div className="absolute inset-0">
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* 
          Imagen del poster - SIEMPRE presente como fondo base
          No usamos transiciones de opacity para evitar CLS
        */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${heroFrame})`,
            transform: 'scale(1.05)'
          }}
          aria-hidden="true"
        />
        
        {/* 
          Video - se posiciona encima de la imagen cuando está listo
          Usamos visibility en lugar de opacity para evitar CLS
        */}
        <video 
          ref={videoRef}
          loop 
          muted 
          playsInline
          autoPlay
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ 
            transform: 'scale(1.05)',
            visibility: videoReady ? 'visible' : 'hidden'
          }}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Content - Todo visible desde el inicio para evitar CLS */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <span className="uppercase tracking-[0.3em] text-xs md:text-sm font-light mb-6 text-gray-300">
          Inmobiliaria Boutique Internacional
        </span>
        
        {/* H1 es el elemento LCP */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-tight">
          El verdadero lujo <br />
          <span className="italic text-gray-200">es sentirse en casa.</span>
        </h1>

        <a 
          href="#experiencia" 
          className="group flex flex-col items-center gap-2 text-xs tracking-widest uppercase hover:text-accent transition-colors duration-300"
        >
          Descubre Römenn
          <ArrowDown className="w-4 h-4 animate-bounce mt-2" />
        </a>
      </div>
    </section>
  );
};

export default Hero;
