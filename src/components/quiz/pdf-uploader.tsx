"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, X, Loader2 } from "lucide-react";

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      if(selectedFile.size > 10 * 1024 * 1024) { // 10 MB limit
        toast({
          variant: "destructive",
          title: "Arquivo Muito Grande",
          description: "Por favor, selecione um arquivo PDF com menos de 10MB.",
        });
        setFile(null);
        return;
      }
      setFile(selectedFile);
    } else {
      toast({
        variant: "destructive",
        title: "Arquivo Inválido",
        description: "Por favor, selecione um arquivo PDF.",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && droppedFile.type === "application/pdf") {
      if(droppedFile.size > 10 * 1024 * 1024) { // 10 MB limit
        toast({
          variant: "destructive",
          title: "Arquivo Muito Grande",
          description: "Por favor, selecione um arquivo PDF com menos de 10MB.",
        });
        setFile(null);
        return;
      }
      setFile(droppedFile);
    } else {
      toast({
        variant: "destructive",
        title: "Arquivo Inválido",
        description: "Por favor, selecione um arquivo PDF.",
      });
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Nenhum Arquivo",
        description: "Por favor, selecione um arquivo PDF para gerar o quiz.",
      });
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch('/api/pdf/topics', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao processar o PDF.');
      }
      
      const result = await response.json();

      if (result.topics && result.topics.length > 0) {
        sessionStorage.setItem("pdfTopics", JSON.stringify(result.topics));
        router.push(`/pdf`);
      } else {
        toast({
          variant: "destructive",
          title: "Nenhum Tópico Encontrado",
          description: "Não foi possível extrair tópicos do PDF. Tente um arquivo diferente.",
        });
      }

    } catch (error: any) {
      console.error("Erro ao gerar quiz do PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao Gerar Quiz",
        description: error.message || "Não foi possível gerar o quiz a partir do PDF. Tente novamente.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-4">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary/80"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <UploadCloud className="w-12 h-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Arraste e solte um PDF aqui, ou clique para selecionar
          </p>
          <input
            id="file-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between w-full p-4 border rounded-lg bg-secondary/50">
          <div className="flex items-center gap-2">
            <File className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">{file.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setFile(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!file || isUploading}
        className="w-full text-lg h-12 font-bold"
        size="lg"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analisando PDF...
          </>
        ) : (
          "Extrair Tópicos do PDF"
        )}
      </Button>
    </div>
  );
}
