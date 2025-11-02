'use server';
/**
 * @fileOverview AI quiz generator flow from PDF text content.
 *
 * - generateQuizFromPdfText - A function that handles quiz generation from PDF text.
 */

import {ai} from '@/ai/genkit';
import { GenerateQuizFromPdfTextInput, GenerateQuizFromPdfTextInputSchema, GenerateQuizFromPdfTextOutput, GenerateQuizFromPdfTextOutputSchema } from '@/lib/types';


const prompt = ai.definePrompt({
  name: 'generateQuizFromPdfTextPrompt',
  input: {schema: GenerateQuizFromPdfTextInputSchema},
  output: {schema: GenerateQuizFromPdfTextOutputSchema},
  prompt: `Você é um especialista em analisar conteúdo e gerar quizzes. Analise o texto abaixo, extraído de um documento.

Primeiro, identifique o tópico principal do texto.
Depois, com base nesse conteúdo, gere um quiz em português do Brasil com 10 questões.

Cada questão deve ter 4 respostas possíveis.
Garanta que uma das opções seja a resposta correta e que todas as informações (perguntas, opções e respostas) sejam extraídas ou baseadas fielmente no texto fornecido.

Texto do Documento:
"""
{{{textContent}}}
"""

Gere um objeto JSON com a propriedade "topic" contendo o tópico principal identificado, e a propriedade "quiz" que seja um array de objetos de questão (com "question", "options", e "answer").
`,
});

const generateQuizFromPdfTextFlow = ai.defineFlow(
  {
    name: 'generateQuizFromPdfTextFlow',
    inputSchema: GenerateQuizFromPdfTextInputSchema,
    outputSchema: GenerateQuizFromPdfTextOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function generateQuizFromPdfText(
  input: GenerateQuizFromPdfTextInput
): Promise<GenerateQuizFromPdfTextOutput> {
  return generateQuizFromPdfTextFlow(input);
}
