import type { z } from "zod";

// Mantendo a definição original por Tópico
import type { generateQuizFromTopic } from "@/ai/flows/generate-quiz-from-topic";
type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
export type QuizDataFromTopic = Awaited<ReturnType<typeof generateQuizFromTopic>>;

// Adicionando a nova definição por PDF
import type { generateQuizFromPdfText } from "@/ai/flows/generate-quiz-from-pdf-text";
export type QuizDataFromPdf = Awaited<ReturnType<typeof generateQuizFromPdfText>>;

// Tipo unificado para o quiz
export type QuizData = (QuizDataFromTopic | QuizDataFromPdf) & { topic?: string };

export type QuizQuestion = QuizData["quiz"][0];
