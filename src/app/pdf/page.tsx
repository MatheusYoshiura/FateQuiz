"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, FileText } from "lucide-react";

export default function PDFUploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter(); // ✅ Adicionado

    async function handleUpload() {
        if (!file) {
            setError("Selecione um arquivo PDF antes de enviar.");
            return;
        }

        setLoading(true);
        setError(null);
        setTopics([]);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/pdf/topics", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Resposta de erro do servidor:", text);
                throw new Error(`Erro ${res.status}: falha ao processar o PDF.`);
            }

            const data = await res.json();
            console.log("Resposta completa do backend:", data);
            console.log("Array que será definido em state:", data.topics);

            setTopics(Array.isArray(data.topics?.topics) ? data.topics.topics : []);
        } catch (err: any) {
            console.error("Erro:", err);
            setError(err.message || "Falha ao processar o PDF.");
        } finally {
            setLoading(false);
        }
    }

    // ✅ Função para redirecionar para o quiz
    function handleTopicClick(topic: string) {
        router.push(`/quiz?topic=${encodeURIComponent(topic)}`);
    }

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="w-full max-w-3xl z-10 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <FileText className="w-7 h-7 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                        Extrair Tópicos do PDF - FateQuiz
                    </CardTitle>
                    <p className="text-muted-foreground">
                        Faça upload de um arquivo PDF e veja os tópicos extraídos pela IA.
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => {
                                setFile(e.target.files?.[0] || null);
                                setTopics([]);
                                setError(null);
                            }}
                        />
                        <Button onClick={handleUpload} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-4 h-4 mr-2" /> Processando...
                                </>
                            ) : (
                                "Extrair Tópicos"
                            )}
                        </Button>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="bg-gray-100 rounded-lg p-4 text-black text-sm">
                        {topics.length > 0 ? (
                            <>
                                <h3 className="font-bold text-lg mb-3 text-primary">Tópicos encontrados:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {topics.map((t, i) => (
                                        <Card
                                            key={i}
                                            onClick={() => handleTopicClick(t)} // ✅ Clique leva ao quiz
                                            className="shadow-md hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer hover:bg-accent/10"
                                        >
                                            <CardContent className="p-4 text-center">
                                                <p className="font-medium text-gray-800">{t}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-500">Nenhum tópico extraído ainda.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}