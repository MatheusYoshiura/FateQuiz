import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateTopicsFromPDF } from "@/ai/flows/generate-topics-from-PDF";


export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file = data.get("file") as any; // mantido 'any' para evitar erro Node/Browser

        if (!file) return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });

        const tmpDir = path.join(process.cwd(), "tmp");
        fs.mkdirSync(tmpDir, { recursive: true });

        const tempPath = path.join(tmpDir, file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(tempPath, buffer);

        const topics = await generateTopicsFromPDF({ filePath: tempPath });

        fs.unlinkSync(tempPath);

        // ✅ Sempre retorna array, mesmo vazio
        return NextResponse.json({ topics: topics || [] });
    } catch (err) {
        console.error("Erro ao processar PDF:", err);
        return NextResponse.json(
            { error: "Falha ao processar o PDF. Tente novamente." },
            { status: 500 }
        );
    }
}