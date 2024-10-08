import React, { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/components/AuthProvider';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Configuração do Supabase
const supabaseUrl = 'https://xjrtfyyqxyjcffgdudnm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcnRmeXlxeHlqY2ZmZ2R1ZG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc3MzQ3MzAsImV4cCI6MjA0MzMxMDczMH0.3fgnS2EX2dEunQ7y_lXYd869UtdId4oJktXTgQgf4ko';
const supabase = createClient(supabaseUrl, supabaseKey);

const BodyCapturaFoto = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { user } = useAuth();

  // Função para iniciar a câmera
  const startCamera = async () => {
    setIsLoading(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast({
        title: "Câmera iniciada",
        description: "A câmera foi iniciada com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao acessar a câmera:', error);
      toast({
        title: "Erro",
        description: "Não foi possível acessar a câmera. Por favor, verifique as permissões.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Função para capturar a foto
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
        setCapturedImage(imageDataUrl);
        toast({
          title: "Foto capturada",
          description: "A foto foi capturada com sucesso.",
        });
      }
    }
  };

  // Função para salvar a foto no Supabase
  const savePhoto = async () => {
    if (!capturedImage || !user) {
      toast({
        title: "Erro",
        description: "Nenhuma imagem capturada ou usuário não autenticado.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Converter base64 para blob
      const res = await fetch(capturedImage);
      const blob = await res.blob();

      // Gerar um nome único para o arquivo
      const fileName = `${user.id}_${Date.now()}.jpg`;

      // Fazer upload da imagem para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('user_photos')
        .upload(`${user.id}/${fileName}`, blob, {
          contentType: 'image/jpeg'
        });

      if (error) throw error;

      // Obter a URL pública da imagem
      const { data: publicUrlData } = supabase.storage
        .from('user_photos')
        .getPublicUrl(`${user.id}/${fileName}`);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error('Falha ao obter a URL pública da imagem');
      }

      // Salvar a referência da imagem no banco de dados
      const { error: dbError } = await supabase
        .from('user_photos')
        .insert({ user_id: user.id, photo_url: publicUrlData.publicUrl });

      if (dbError) throw dbError;

      toast({
        title: "Sucesso",
        description: "Foto salva com sucesso!",
      });

      // Limpar a imagem capturada
      setCapturedImage(null);
    } catch (error) {
      console.error('Erro ao salvar a foto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a foto. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar o stream da câmera quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <Button onClick={startCamera} className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isLoading ? "Iniciando..." : "Tirar Foto"}
          </Button>
          
          {stream && (
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full rounded-lg"
              />
              <Button 
                onClick={capturePhoto} 
                className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
                disabled={isLoading}
              >
                Capturar
              </Button>
            </div>
          )}

          {capturedImage && (
            <div className="space-y-2">
              <img 
                src={capturedImage} 
                alt="Foto capturada" 
                className="w-full rounded-lg"
              />
              <Button onClick={savePhoto} className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? "Salvando..." : "Salvar Foto"}
              </Button>
            </div>
          )}

          <canvas ref={canvasRef} style={{ display: 'none' }} width="640" height="480" />
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyCapturaFoto;