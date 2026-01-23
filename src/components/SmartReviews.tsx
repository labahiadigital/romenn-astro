import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const SmartReviews = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleStarClick = (score: number) => {
    setRating(score);
  };

  const handleSubmitInternal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // En un sitio de producción, esto enviaría al backend/CRM
    setIsSubmitted(true);
    toast.success("Gracias por su feedback. Nos pondremos en contacto con usted.");
  };

  const openGoogleReviews = () => {
    // Replace with actual Google Review link
    window.open("https://search.google.com/local/writereview?placeid=YOUR_PLACE_ID", "_blank");
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-border p-8 md:p-12 shadow-lg rounded-sm">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif mb-3">Su opinión es vital</h3>
        <p className="text-muted-foreground font-light text-sm">
          Ayúdenos a mantener la excelencia. Valore su experiencia con Römenn.
        </p>
      </div>

      {!isSubmitted ? (
        <>
          <div className="flex justify-center gap-2 mb-10">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleStarClick(star)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 md:w-10 md:h-10 transition-colors duration-300 ${
                    star <= (hoverRating || rating)
                      ? "fill-accent text-accent"
                      : "fill-transparent text-gray-300"
                  }`}
                  strokeWidth={1.5}
                />
              </button>
            ))}
          </div>

          {rating > 0 && rating <= 3 && (
            <form
              onSubmit={handleSubmitInternal}
              className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              <div className="bg-muted/30 p-6 rounded-sm border border-border">
                <p className="text-sm text-foreground font-medium mb-4">
                  Lamentamos no haber cumplido todas sus expectativas. <br/>
                  ¿Qué podemos mejorar?
                </p>
                <div className="space-y-4">
                  <Input 
                    placeholder="Su nombre" 
                    className="bg-white border-border" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required 
                  />
                  <Input 
                    placeholder="Su email" 
                    type="email" 
                    className="bg-white border-border"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                  />
                  <textarea 
                    placeholder="Cuéntenos su experiencia..." 
                    className="w-full bg-white border border-border rounded-md p-3 min-h-[100px] text-sm"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required 
                  />
                  <Button type="submit" className="w-full btn-premium">
                    Enviar Feedback Privado
                  </Button>
                </div>
              </div>
            </form>
          )}

          {(rating === 4 || rating === 5) && (
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-green-50 border border-green-100 p-6 rounded-sm mb-6">
                <p className="text-green-800 font-medium mb-2">¡Nos alegra inmensamente!</p>
                <p className="text-green-700 text-sm">
                  Sería un honor si pudiera compartir su experiencia públicamente en Google.
                </p>
              </div>
              <Button 
                onClick={openGoogleReviews}
                className="btn-premium w-full flex items-center justify-center gap-2"
              >
                Publicar en Google <Send className="w-4 h-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 animate-in fade-in duration-300">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-xl font-serif mb-2">Gracias por ayudarnos a mejorar</h4>
          <p className="text-muted-foreground text-sm">Su mensaje ha sido enviado directamente a la dirección.</p>
        </div>
      )}
    </div>
  );
};

export default SmartReviews;
