import { NextRequest, NextResponse } from "next/server";
import { generateTopicsFromPDF } from "@/ai/flows/generate-topics-from-PDF";
import pdf from "pdf-parse";

async function getPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await pdf(buffer);
    return data.text;
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
        }

        const textContent = await getPdfText(file);

        if (!textContent.trim()) {
            return NextResponse.json({ error: "Não foi possível extrair texto do PDF." }, { status: 400 });
        }
        
        const result = await generateTopicsFromPDF({ textContent });
        
        const response = NextResponse.json({ topics: result.topics || [] });
        
        return response;

    } catch (err) {
        console.error("Erro ao processar PDF:", err);
        const errorMessage = err instanceof Error ? err.message : "Falha ao processar o PDF.";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
