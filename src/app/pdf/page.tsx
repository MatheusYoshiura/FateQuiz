"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PdfPage() {
    const [topics, setTopics] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const stored = sessionStorage.getItem("pdfTopics");
        if (stored) {
            setTopics(JSON.parse(stored));
        } else {
            router.push("/"); // redireciona se não houver tópicos
        }
    }, [router]);

    const handleTopicClick = (topic: string) => {
        router.push(`/quiz?topic=${encodeURIComponent(topic)}`);
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            {/* Fundo igual ao da página inicial */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.2] dark:bg-grid-white/[0.2] pointer-events-none"></div>

            {/* Card principal */}
            <Card className="w-full max-w-3xl z-10 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="flex justify-center items-center gap-2 mb-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Lightbulb className="w-8 h-8 text-primary-foreground" />
                        </div>
                    </div>
                    <CardTitle className="text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                        FateQuiz IA Generator
                    </CardTitle>
                    <p className="text-muted-foreground">
                        Selecione um dos tópicos extraídos do seu arquivo PDF para gerar um quiz.
                    </p>
                </CardHeader>

                <CardContent>
                    {topics.length === 0 ? (
                        <p className="text-center text-muted-foreground">
                            Nenhum tópico encontrado.
                        </p>
                    ) : (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {topics.map((topic, i) => (
                                    <Card
                                        key={i}
                                        onClick={() => handleTopicClick(topic)}
                                        className="shadow-md transition-shadow border border-gray-200 cursor-pointer hover:shadow-lg hover:bg-accent/10"
                                    >
                                        <CardContent className="p-4 text-center">
                                            <p className="font-medium text-gray-800">{topic}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex justify-center">
                                <Button
                                    variant="secondary"
                                    onClick={() => router.push("/")}
                                    className="h-12 px-8 text-lg font-semibold"
                                >
                                    Enviar outro PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}