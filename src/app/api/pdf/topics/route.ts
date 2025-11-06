import { NextRequest, NextResponse } from "next/server";
import { generateTopicsFromPDF } from "@/ai/flows/generate-topics-from-PDF";
import { pdfjsLib } from "@/lib/pdfjs-node";

async function getPdfText(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += `\n--- Página ${i} ---\n${pageText}`;
    }
    return fullText;
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
        
        // Armazena o texto completo na sessão para uso posterior na geração do quiz
        // Esta é uma abordagem que precisa de um armazenamento de sessão configurado.
        // Se a sessão não estiver disponível, o texto pode ser passado de outra forma.
        const response = NextResponse.json({ topics: result.topics || [] });
        
        // Para passar o texto para a próxima página, vamos usar um cabeçalho
        // ou você pode optar por armazenar em um cache temporário do lado do servidor (ex: Redis)
        // Por simplicidade aqui, vamos assumir que o cliente irá lidar com isso.
        // O cliente salvará o texto completo no sessionStorage.
        
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
