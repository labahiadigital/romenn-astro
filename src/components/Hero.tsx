import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

interface HeroProps {
  videoSrc: string;
  posterSrc: string;
}

const Hero = ({ videoSrc, posterSrc }: HeroProps) => {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="none"
          poster={posterSrc}
          className="w-full h-full object-cover scale-105"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center text-center text-white px-4">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="uppercase tracking-[0.3em] text-xs md:text-sm font-light mb-6 text-gray-300"
        >
          Inmobiliaria Boutique Internacional
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif mb-8 tracking-tight"
        >
          El verdadero lujo <br />
          <span className="italic text-gray-200">es sentirse en casa.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <a href="#experiencia" className="group flex flex-col items-center gap-2 text-xs tracking-widest uppercase hover:text-accent transition-colors duration-300">
            Descubre Römenn
            <ArrowDown className="w-4 h-4 animate-bounce mt-2" />
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
