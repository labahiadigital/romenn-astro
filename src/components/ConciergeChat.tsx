import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

const ConciergeChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const openWhatsApp = () => {
    // Número de WhatsApp de Römenn (actualizar con el número real)
    window.open("https://wa.me/34747488562?text=Hola,%20me%20gustaría%20información%20sobre%20vuestros%20servicios.", "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 bg-white border border-slate-200 shadow-2xl rounded-2xl overflow-hidden w-80 md:w-96"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <MessageCircle className="w-6 h-6 text-[#25D366]" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-lg">Römenn</h4>
                  <p className="text-white/80 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Normalmente respondemos en minutos
                  </p>
                </div>
              </div>
              <button 
                onClick={toggleChat} 
                className="text-white/80 hover:text-white transition-colors p-1"
                aria-label="Cerrar chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 bg-slate-50">
              {/* Chat bubble simulation */}
              <div className="bg-white rounded-2xl rounded-tl-sm p-4 shadow-sm mb-4 relative">
                <div className="absolute -top-1 left-4 w-3 h-3 bg-white transform rotate-45" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  ¡Hola! 👋 Soy el equipo de Römenn. 
                  <br/><br/>
                  ¿En qué podemos ayudarle? Estamos aquí para resolver cualquier duda sobre:
                </p>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
                    Vender su propiedad
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
                    Encontrar su hogar ideal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#25D366] rounded-full" />
                    Valoración gratuita
                  </li>
                </ul>
              </div>

              {/* WhatsApp Button */}
              <button
                onClick={openWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-4 px-6 rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-[#25D366]/20 hover:shadow-xl hover:shadow-[#25D366]/30"
              >
                <MessageCircle className="w-5 h-5" />
                Iniciar conversación
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 bg-white border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                🔒 Conversación privada y segura
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`
          w-16 h-16 rounded-full shadow-2xl flex items-center justify-center 
          transition-all duration-300
          ${isOpen 
            ? "bg-slate-800 rotate-0" 
            : "bg-[#25D366] hover:bg-[#20BA5A]"
          }
        `}
        aria-label={isOpen ? "Cerrar chat" : "Abrir WhatsApp"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-7 h-7 text-white" fill="white" />
              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#25D366] animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip on hover when closed */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-20 bottom-4 bg-slate-800 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap shadow-lg"
        >
          ¿Hablamos? 💬
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-2 bg-slate-800 rotate-45" />
        </motion.div>
      )}
    </div>
  );
};

export default ConciergeChat;
