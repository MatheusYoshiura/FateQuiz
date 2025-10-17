import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { generateTopicsFromPDF } from "@/ai/flows/generate-topics-from-PDF";


export async function POST(req: NextRequest) {
    try {
        // 1️⃣ Receber o arquivo enviado pelo frontend
        const data = await req.formData();
        const file = data.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "Nenhum arquivo enviado" },
                { status: 400 }
            );
        }

        // 2️⃣ Criar diretório temporário se não existir
        const tmpDir = path.join(process.cwd(), "tmp");
        fs.mkdirSync(tmpDir, { recursive: true });

        // 3️⃣ Salvar arquivo temporariamente
        const tempPath = path.join(tmpDir, file.name);
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(tempPath, buffer);

        // 4️⃣ Chamar função que lê PDF e extrai tópicos
        const topics = await generateTopicsFromPDF({ filePath: tempPath });

        // 5️⃣ Remover arquivo temporário após processar
        fs.unlinkSync(tempPath);

        // 6️⃣ Retornar os tópicos em JSON
        return NextResponse.json({ topics });
    } catch (err) {
        console.error("Erro ao processar PDF:", err);

        // Retornar erro de forma clara para o frontend
        return NextResponse.json(
            { error: "Falha ao processar o PDF. Tente novamente." },
            { status: 500 }
        );
    }
}