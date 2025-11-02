'use server';
/**
 * @fileOverview AI quiz generator flow from PDF text content.
 *
 * - generateQuizFromPdfText - A function that handles quiz generation from PDF text.
 * - GenerateQuizFromPdfTextInput - The input type for the function.
 * - GenerateQuizFromPdfTextOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import pdf from 'pdf-parse';

// Nota: O input real será um Buffer, mas para o schema da IA, tratamos como string.
export const GenerateQuizFromPdfTextInputSchema = z.object({
  pdfContent: z.any().describe('The buffer content of the PDF file.'),
});
export type GenerateQuizFromPdfTextInput = z.infer<typeof GenerateQuizFromPdfTextInputSchema>;

export const GenerateQuizFromPdfTextOutputSchema = z.object({
  topic: z.string().describe('The main topic identified from the PDF content.'),
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers.'),
      answer: z.string().describe('The correct answer.'),
    })
  ).describe('The generated quiz questions.'),
});
export type GenerateQuizFromPdfTextOutput = z.infer<typeof GenerateQuizFromPdfTextOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generateQuizFromPdfTextPrompt',
  input: {schema: z.object({
    textContent: z.string()
  })},
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

export const generateQuizFromPdfTextFlow = ai.defineFlow(
  {
    name: 'generateQuizFromPdfTextFlow',
    inputSchema: GenerateQuizFromPdfTextInputSchema,
    outputSchema: GenerateQuizFromPdfTextOutputSchema,
  },
  async (input) => {
    // Extrai o texto do buffer do PDF
    const data = await pdf(input.pdfContent);
    const textContent = data.text;

    if (!textContent.trim()) {
      throw new Error("O conteúdo do PDF está vazio ou não pôde ser lido.");
    }
    
    // Chama a IA com o texto extraído
    const {output} = await prompt({ textContent });
    return output!;
  }
);


export async function generateQuizFromPdfText(
  input: GenerateQuizFromPdfTextInput
): Promise<GenerateQuizFromPdfTextOutput> {
  return generateQuizFromPdfTextFlow(input);
}
