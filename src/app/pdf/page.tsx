"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2, BookCopy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import * as pdfjsLib from 'pdfjs-dist';

// Simulação de extração de texto para não sobrecarregar a URL
async function getPdfFullText(blob: Blob): Promise<string> {
    
    // Caminho para o worker. Ajuste se o caminho do seu projeto for diferente.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.mjs`;

    const arrayBuffer = await blob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
    }
    return fullText.trim();
}


export default function PdfPage() {
    const [topics, setTopics] = useState<string[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    // Memoize a extração de tópicos para evitar re-execução
    const storedTopics = useMemo(() => {
        if (typeof window !== "undefined") {
            const stored = sessionStorage.getItem("pdfTopics");
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    }, []);

    useEffect(() => {
        if (storedTopics.length > 0) {
            setTopics(storedTopics);
        } else {
            // Se não encontrar tópicos, volta para a página inicial
            router.push("/");
        }
    }, [router, storedTopics]);

    const handleGenerateQuiz = async () => {
        if (selectedTopic) {
            setIsGenerating(true);
            try {
                // A IA gerará o quiz com base no TEMA selecionado, mas usando o CONTEÚDO do PDF.
                // Isso garante que as perguntas sejam fiéis ao documento.
                // A IA é inteligente o suficiente para focar no tópico selecionado dentro do texto completo.
                const fullText = sessionStorage.getItem("pdfFullText");

                if (!fullText) {
                    toast({
                        variant: "destructive",
                        title: "Erro de Conteúdo",
                        description: "Não foi possível encontrar o texto do PDF. Por favor, faça o upload novamente.",
                    });
                    router.push('/');
                    return;
                }
                
                // Passamos o texto completo e o tópico para a página do quiz.
                // A IA usará o tópico para focar e o texto para criar as perguntas.
                const params = new URLSearchParams({
                    topic: selectedTopic,
                    fromPdf: 'true',
                    // O textContent vai na sessão para não estourar a URL
                });
                sessionStorage.setItem('quizTextContent', fullText);

                router.push(`/quiz?${params.toString()}`);

            } catch (error) {
                console.error("Erro ao preparar quiz do PDF:", error);
                toast({
                    variant: "destructive",
                    title: "Erro ao Gerar Quiz",
                    description: "Houve um problema ao preparar os dados do quiz. Tente novamente.",
                });
            } finally {
                setIsGenerating(false);
            }
        }
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-background">
            <Card className="w-full max-w-3xl z-10 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <BookCopy className="w-8 h-8 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-4xl font-headline font-bold">
                        Tópicos do PDF
                    </CardTitle>
                    <p className="text-muted-foreground">
                        Selecione um dos tópicos extraídos para gerar um quiz.
                    </p>
                </CardHeader>

                <CardContent>
                    {topics.length === 0 ? (
                        <div className="flex items-center justify-center p-8">
                           <Loader2 className="h-8 w-8 animate-spin text-primary" />
                           <p className="ml-4 text-muted-foreground">Carregando tópicos...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {topics.map((topic, i) => (
                                    <Card
                                        key={i}
                                        onClick={() => setSelectedTopic(topic)}
                                        className={`shadow-md transition-all duration-200 border-2 cursor-pointer hover:shadow-lg hover:border-primary/80 
                                            ${ selectedTopic === topic
                                                ? "border-primary bg-primary/10"
                                                : "border-border"
                                        }`}
                                    >
                                        <CardContent className="p-4 text-center flex items-center justify-center min-h-[80px]">
                                            <p className="font-medium text-card-foreground">{topic}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/")}
                                    className="text-lg h-14 font-bold sm:w-48"
                                >
                                    Voltar
                                </Button>
                                <Button
                                    onClick={handleGenerateQuiz}
                                    disabled={!selectedTopic || isGenerating}
                                    className="text-lg h-14 font-bold sm:w-48"
                                >
                                     {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Gerando...
                                        </>
                                    ) : "Gerar Quiz"}
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
