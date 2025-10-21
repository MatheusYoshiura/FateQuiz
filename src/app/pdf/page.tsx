"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

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
        <main className="min-h-screen p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Tópicos extraídos do PDF</h1>

            {topics.length === 0 ? (
                <p>Nenhum tópico encontrado.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-4xl">
                    {topics.map((topic, i) => (
                        <Card
                            key={i}
                            className="shadow-md border border-gray-200 cursor-pointer hover:bg-accent/10"
                            onClick={() => handleTopicClick(topic)}
                        >
                            <CardContent className="p-4 text-center">{topic}</CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </main>
    );
}