"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, FileText, Loader2 } from "lucide-react";

const FormSchema = z.object({
    topic: z.string().min(2, {
        message: "O tópico deve ter pelo menos 2 caracteres.",
    }),
});

export default function Home() {
    const router = useRouter();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            topic: "",
        },
    });

    // Estado para upload de PDF
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [topics, setTopics] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Função para envio do quiz por texto
    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.push(`/quiz?topic=${encodeURIComponent(data.topic)}`);
    }

    // Função para upload de PDF
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
            setTopics(Array.isArray(data.topics?.topics) ? data.topics.topics : []);
        } catch (err: any) {
            console.error("Erro:", err);
            setError(err.message || "Falha ao processar o PDF.");
        } finally {
            setLoading(false);
        }
    }

    // Redireciona para o quiz com o tópico selecionado
    function handleTopicClick(topic: string) {
        router.push(`/quiz?topic=${encodeURIComponent(topic)}`);
    }

    return (
        <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
            {/* Fundo */}
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
                        Crie questionários personalizados com o poder da inteligência artificial.
                    </p>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Campo de tópico + botão Gerar Quiz */}
                            <FormField
                                control={form.control}
                                name="topic"
                                render={({ field }) => (
                                    <FormItem>
                                        <p className="text-muted-foreground mb-2">
                                            Crie seu quiz a partir de um tópico
                                        </p>
                                        <FormLabel className="sr-only">Tópico</FormLabel>
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <FormControl className="flex-1">
                                                <Input
                                                    placeholder="ex: O Império Romano, Hooks do React.js, Fotossíntese"
                                                    {...field}
                                                    className="text-center text-lg h-14"
                                                />
                                            </FormControl>
                                            <Button
                                                type="submit"
                                                className="text-lg h-14 font-bold sm:w-48"
                                                size="lg"
                                            >
                                                Gerar Quiz
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* 🔹 Linha pontilhada com "OU" */}
                            <div className="relative my-8 flex items-center justify-center">
                                <div className="w-full border-t border-dashed border-muted-foreground"></div>
                                <span className="absolute bg-background px-4 text-muted-foreground font-medium">
                  ou
                </span>
                            </div>

                            {/* Upload de PDF */}
                            <FormItem>
                                <p className="text-muted-foreground mb-2">
                                    Crie seu quiz a partir de um arquivo PDF
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <FormControl className="flex-1">
                                        <Input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => {
                                                setFile(e.target.files?.[0] || null);
                                                setTopics([]);
                                                setError(null);
                                            }}
                                            className="text-center text-lg h-14"
                                        />
                                    </FormControl>
                                    <Button onClick={handleUpload} disabled={loading} className="text-lg h-14 font-bold sm:w-48">
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin w-4 h-4 mr-2" /> Processando...
                                            </>
                                        ) : (
                                            "Upload PDF"
                                        )}
                                    </Button>
                                </div>
                                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                            </FormItem>

                            {/* Tópicos extraídos do PDF */}
                            {topics.length > 0 && (
                                <div className="bg-gray-100 rounded-lg p-4 text-black text-sm">
                                    <h3 className="font-bold text-lg mb-3 text-primary">Tópicos encontrados:</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        {topics.map((t, i) => (
                                            <Card
                                                key={i}
                                                onClick={() => handleTopicClick(t)}
                                                className="shadow-md hover:shadow-lg transition-shadow border border-gray-200 cursor-pointer hover:bg-accent/10"
                                            >
                                                <CardContent className="p-4 text-center">
                                                    <p className="font-medium text-gray-800">{t}</p>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}