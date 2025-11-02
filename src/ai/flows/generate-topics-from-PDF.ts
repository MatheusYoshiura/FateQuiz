'use server';
import fs from 'fs';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { pdfjsLib } from '@/lib/pdfjs-node';

const GenerateTopicsFromPDFInputSchema = z.object({
    filePath: z.string().describe('Path to the uploaded PDF file.'),
});

const GenerateTopicsFromPDFOutputSchema = z.object({
    topics: z.array(z.string()).describe('List of main topics found in the PDF.'),
});

export type GenerateTopicsFromPDFInput = z.infer<typeof GenerateTopicsFromPDFInputSchema>;
export type GenerateTopicsFromPDFOutput = z.infer<typeof GenerateTopicsFromPDFOutputSchema>;

export async function generateTopicsFromPDF(
    input: GenerateTopicsFromPDFInput
): Promise<GenerateTopicsFromPDFOutput> {
    const dataBuffer = fs.readFileSync(input.filePath);
    const uint8Array = new Uint8Array(dataBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    console.log("Número de páginas do PDF:", pdf.numPages);

    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        console.log(`Página ${i} trecho:`, pageText.slice(0, 100));
        fullText += `\n--- Página ${i} ---\n${pageText}`;
    }

    const cleanText = fullText.replace(/\s+/g, ' ').trim();
    const textSample = cleanText.slice(0, 5000);

    const prompt = ai.definePrompt({
        name: 'extractTopicsFromPDFPrompt',
        input: { schema: z.object({ text: z.string() }) },
        output: { schema: z.object({ topics: z.array(z.string()) }) },
        prompt: `
          Você é um especialista em análise de materiais didáticos. Leia o texto a seguir e a partir da analise do conteudo identifique os principais temas ou assuntos tratados.
          Ignore elementos irrelevantes como numeração de páginas, instruções de exercício, palavras desconexas ou metadados de slides.
          Resuma os tópicos de forma clara e coerente, mantendo a linguagem técnica.
          Responda apenas com uma lista JSON de temas em português.

          Texto:
          "{{{text}}}"
        `,
    });

    const { output } = await prompt({ text: textSample });

    console.log("Resposta da IA:", output);

    // ✅ Garante que sempre retorne array
    const topics = Array.isArray(output?.topics) ? output.topics : [];
    return { topics };
}
