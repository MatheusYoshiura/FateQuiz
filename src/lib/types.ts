import type { generateQuizFromTopic } from "@/ai/flows/generate-quiz-from-topic";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

// --- Tipos para Geração por Tópico ---
export type QuizData = Awaited<ReturnType<typeof generateQuizFromTopic>>;
export type QuizQuestion = QuizData["quiz"][0];
