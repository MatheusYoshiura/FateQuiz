'use server';
/**
 * @fileOverview Extract main topics from a PDF using AI.
 *
 * - generate-topics-from-PDF - Reads a PDF and asks AI to identify key themes.
 */

import fs from 'fs';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// importa com require
const pdf = require('pdf-parse');


const GenerateTopicsFromPDFInputSchema = z.object({
    filePath: z.string().describe('Path to the uploaded PDF file.'),
});

const GenerateTopicsFromPDFOutputSchema = z.object({
    topics: z.array(z.string()).describe('List of main topics found in the PDF.'),
});

export type GenerateTopicsFromPDFInput = z.infer<
    typeof GenerateTopicsFromPDFInputSchema
>;
export type GenerateTopicsFromPDFOutput = z.infer<
    typeof GenerateTopicsFromPDFOutputSchema
>;

export async function generateTopicsFromPDF(
    input: GenerateTopicsFromPDFInput
): Promise<GenerateTopicsFromPDFOutput> {
    // 1️⃣ Ler o arquivo PDF
    const buffer = fs.readFileSync(input.filePath);
    const data = await pdf(buffer);

    // 2️⃣ Limpar o texto
    const cleanText = data.text.replace(/\s+/g, ' ').trim();

    // 3️⃣ Limitar o tamanho para evitar prompt muito longo
    const textSample = cleanText.slice(0, 5000); // primeiros 5000 caracteres

    // 4️⃣ Pedir à IA para identificar temas
    const prompt = ai.definePrompt({
        name: 'extractTopicsFromPDFPrompt',
        input: { schema: z.object({ text: z.string() }) },
        output: { schema: z.object({ topics: z.array(z.string()) }) },
        prompt: `
      Leia o texto a seguir e identifique os principais temas ou assuntos tratados.
      Responda apenas com uma lista JSON de temas em português.
      Exemplo de resposta: ["Educação infantil", "Uso de tecnologia", "Atenção e foco"]

      Texto:
      "{{{text}}}"
    `,
    });

    const { output } = await prompt({ text: textSample });
    return { topics: output?.topics ?? [] };
}
