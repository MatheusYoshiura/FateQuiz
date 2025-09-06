import type { generateQuizFromTopic } from "@/ai/flows/generate-quiz-from-topic";
import type { z } from "zod";

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export type QuizData = Awaited<ReturnType<typeof generateQuizFromTopic>>;
export type QuizQuestion = QuizData["quiz"][0];
