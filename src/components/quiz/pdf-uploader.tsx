"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, X, Loader2 } from "lucide-react";
import { generateQuizFromPdf } from "@/app/quiz/actions";

export default function PdfUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
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
    formData.append("pdf", file);

    try {
      const { quizId, error } = await generateQuizFromPdf(formData);
      if (error) {
        throw new Error(error);
      }
      // Armazenamos o ID do quiz para buscar na próxima página
      router.push(`/quiz?quizId=${quizId}`);

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
            Gerando...
          </>
        ) : (
          "Gerar Quiz do PDF"
        )}
      </Button>
    </div>
  );
}
