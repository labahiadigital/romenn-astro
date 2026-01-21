import { ArrowDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

// Usar video y frame desde public para que coincida con el preload
const heroVideo = "/video_hero.mp4";
const heroFrame = "/hero-frame.webp";

const Hero = () => {
  const [videoReady, setVideoReady] = useState(false);
  const [animationsReady, setAnimationsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Activar animaciones después del primer paint
    requestAnimationFrame(() => {
      setAnimationsReady(true);
    });
  }, []);

  // Manejar cuando el video está listo para reproducirse
  const handleVideoCanPlay = () => {
    setVideoReady(true);
    videoRef.current?.play();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background - Primer frame del video como imagen */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        
        {/* Imagen del primer frame - siempre visible hasta que el video esté listo */}
        <img 
          src={heroFrame}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
          fetchPriority="high"
          loading="eager"
          decoding="sync"
        />
        
        {/* Video - se carga en background y se muestra cuando está listo */}
        <video 
          ref={videoRef}
          loop 
          muted 
          playsInline 
          preload="auto"
          onCanPlay={handleVideoCanPlay}
          className={`absolute inset-0 w-full h-full object-cover scale-105 transition-opacity duration-500 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
      </div>

      {/* Content - LCP optimizado: H1 visible inmediatamente */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <span 
            className={`uppercase tracking-[0.3em] text-xs md:text-sm font-light mb-6 text-gray-300 transition-all duration-1000 ${animationsReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
            style={{ transitionDelay: '0.3s' }}
        >
            Inmobiliaria Boutique Internacional
        </span>
        
        {/* H1 es el elemento LCP - NO usar opacity:0 inicial */}
        <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-tight"
        >
            El verdadero lujo <br />
            <span className="italic text-gray-200">es sentirse en casa.</span>
        </h1>

        <div
            className={`transition-opacity duration-1000 ${animationsReady ? 'opacity-100' : 'opacity-0'}`}
            style={{ transitionDelay: '0.8s' }}
        >
            <a href="#experiencia" className="group flex flex-col items-center gap-2 text-xs tracking-widest uppercase hover:text-accent transition-colors duration-300">
                Descubre Römenn
                <ArrowDown className="w-4 h-4 animate-bounce mt-2" />
            </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;
