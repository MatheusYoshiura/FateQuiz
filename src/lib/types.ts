import type { generateQuizFromTopic } from "@/ai/flows/generate-quiz-from-topic";
import { z } from 'zod';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

// --- Tipos para Geração por Tópico ---
export type QuizData = Awaited<ReturnType<typeof generateQuizFromTopic>> & { topic?: string };
export type QuizQuestion = QuizData["quiz"][0];


// --- Tipos para Geração por PDF ---

// Input para o flow que gera o quiz a partir do texto do PDF
export const GenerateQuizFromPdfTextInputSchema = z.object({
  textContent: z.string().describe("O conteúdo de texto completo extraído do PDF."),
});
export type GenerateQuizFromPdfTextInput = z.infer<typeof GenerateQuizFromPdfTextInputSchema>;


// Output do flow que gera o quiz a partir do texto do PDF
export const GenerateQuizFromPdfTextOutputSchema = z.object({
  topic: z.string().describe("O tópico principal identificado a partir do texto do PDF."),
  quiz: z
    .array(
      z.object({
        question: z.string().describe('A pergunta do quiz.'),
        options: z.array(z.string()).describe('As respostas possíveis.'),
        answer: z.string().describe('A resposta correta.'),
      })
    )
    .describe('As questões do quiz geradas.'),
});
export type GenerateQuizFromPdfTextOutput = z.infer<typeof GenerateQuizFromPdfTextOutputSchema>;
