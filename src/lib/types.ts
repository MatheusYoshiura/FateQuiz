import { z } from "zod";

// --- Tipos para Geração por Tópico ---
import type { generateQuizFromTopic } from "@/ai/flows/generate-quiz-from-topic";
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type QuizDataFromTopic = Awaited<ReturnType<typeof generateQuizFromTopic>>;


// --- Tipos e Schemas para Geração por PDF ---
export const GenerateQuizFromPdfTextInputSchema = z.object({
  textContent: z.string().describe('The text content extracted from the PDF file.'),
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
export type QuizDataFromPdf = GenerateQuizFromPdfTextOutput;


// --- Tipos Unificados ---
export type QuizData = (QuizDataFromTopic | QuizDataFromPdf) & { topic?: string };
export type QuizQuestion = QuizData["quiz"][0];
