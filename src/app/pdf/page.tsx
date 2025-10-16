"use client";

import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, FileText } from "lucide-react";

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

export default function PDFReaderPage() {
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        setFile(event.target.files?.[0] || null);
        setText(null);
        setError(null);
    }

    async function handleReadPDF() {
        if (!file) {
            setError("Por favor, selecione um arquivo PDF primeiro.");
            return;
        }

        setLoading(true);
        setError(null);
        setText(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                fullText += `\n--- Página ${i} ---\n` + pageText;
            }

            setText(fullText);
        } catch (err) {
            console.error("Erro ao ler PDF:", err);
            setError("Falha ao ler o arquivo PDF. Verifique o formato e tente novamente.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            <div className="absolute pointer-events-none inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] pointer-events-none"></div>

            <Card className="w-full max-w-3xl z-10 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <FileText className="w-7 h-7 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                        Leitor de PDF - FateQuiz
                    </CardTitle>
                    <p className="text-muted-foreground">
                        Faça upload de um arquivo PDF e clique em "Ler PDF".
                    </p>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Input type="file" accept="application/pdf" onChange={handleFileSelect} />
                        <Button onClick={handleReadPDF} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin w-4 h-4 mr-2" /> Lendo PDF...
                                </>
                            ) : (
                                "Ler PDF"
                            )}
                        </Button>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {text && (
                        <div className="bg-muted rounded-lg p-4 max-h-[400px] overflow-y-auto text-sm whitespace-pre-wrap">
                            {text}
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}