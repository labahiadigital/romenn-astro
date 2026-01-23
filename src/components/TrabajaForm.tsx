import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, Shield, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

// API URL
const EMAIL_API_URL = "/api/send-email";

const TrabajaForm = () => {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. Máximo 5MB.");
        return;
      }
      // Validar tipo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Formato no permitido. Solo PDF o Word.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Extraer solo la parte base64 sin el prefijo data:...
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!acceptedPrivacy) {
      toast.error("Debe aceptar la política de privacidad para continuar.");
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      // Preparar datos del email
      const emailData: Record<string, unknown> = {
        formType: "trabaja-con-nosotros",
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        message: formData.get("message") as string,
      };

      // Si hay archivo adjunto, convertirlo a base64
      if (selectedFile) {
        const base64Content = await fileToBase64(selectedFile);
        emailData.attachment = {
          name: selectedFile.name,
          content: base64Content,
          type: selectedFile.type,
        };
      }

      const response = await fetch(EMAIL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error("Error al enviar");
      }
      
      toast.success("Solicitud enviada correctamente. Revisaremos tu CV y te contactaremos pronto.");
      (e.target as HTMLFormElement).reset();
      setAcceptedPrivacy(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error al enviar la solicitud. Por favor, inténtelo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100">
      <h2 className="text-2xl font-serif mb-2">Únete al equipo</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Cuéntanos sobre ti y adjunta tu CV. Valoramos el talento y la pasión por el sector inmobiliario.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="name">Nombre completo *</Label>
            <Input 
              id="name" 
              name="name"
              placeholder="Tu nombre completo" 
              className="mt-2" 
              required 
            />
          </div>
          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input 
              id="phone" 
              name="phone"
              type="tel" 
              placeholder="Tu teléfono" 
              className="mt-2" 
              required 
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input 
            id="email" 
            name="email"
            type="email" 
            placeholder="tu@email.com" 
            className="mt-2" 
            required 
          />
        </div>

        <div>
          <Label htmlFor="message">Mensaje / Carta de presentación *</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Cuéntanos por qué quieres trabajar con nosotros, tu experiencia en el sector, qué te motiva..."
            className="mt-2 min-h-[150px]"
            required
          />
        </div>

        {/* File Upload */}
        <div>
          <Label>Adjuntar CV (PDF o Word, máx. 5MB)</Label>
          <div className="mt-2">
            {!selectedFile ? (
              <label 
                htmlFor="cv-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Haz clic para subir tu CV</span>
                <span className="text-xs text-muted-foreground mt-1">PDF o Word (máx. 5MB)</span>
                <input
                  ref={fileInputRef}
                  id="cv-upload"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">{selectedFile.name}</p>
                    <p className="text-xs text-green-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-green-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-green-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Privacy Checkbox */}
        <div className="flex items-start gap-3">
          <Checkbox 
            id="privacy" 
            checked={acceptedPrivacy}
            onCheckedChange={(checked) => setAcceptedPrivacy(checked as boolean)}
          />
          <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
            He leído y acepto la <a href="/privacidad" className="text-primary underline">política de privacidad</a> y 
            consiento el tratamiento de mis datos personales para procesos de selección.
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full py-6 text-base bg-primary hover:bg-primary/90 rounded-xl"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Enviar solicitud <Send className="w-4 h-4" />
            </span>
          )}
        </Button>
      </form>

      {/* Legal Info */}
      <div className="mt-8 pt-8 border-t border-slate-100">
        <div className="flex items-start gap-3 text-xs text-muted-foreground">
          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <p><strong>Responsable:</strong> CONSULTING INMOBILIARIO RIVAS VACIAMADRID SLU</p>
            <p><strong>Finalidad:</strong> Gestionar procesos de selección de personal.</p>
            <p><strong>Legitimación:</strong> Consentimiento del interesado.</p>
            <p><strong>Conservación:</strong> Los datos se conservarán durante un máximo de 2 años.</p>
            <p><strong>Derechos:</strong> Acceso, rectificación, supresión, oposición y portabilidad de los datos.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrabajaForm;
