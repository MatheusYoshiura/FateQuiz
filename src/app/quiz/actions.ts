"use server";

import { summarizeQuizResults, type SummarizeQuizResultsInput } from "@/ai/flows/summarize-quiz-results";
import { generateQuizFromPdfText, type GenerateQuizFromPdfTextInput } from "@/ai/flows/generate-quiz-from-pdf-text";
import { generateQuizFromTopic, type GenerateQuizFromTopicInput } from "@/ai/flows/generate-quiz-from-topic";
import type { QuizData } from "@/lib/types";

export async function getQuizSummary(input: SummarizeQuizResultsInput): Promise<{summary: string}> {
    try {
        const result = await summarizeQuizResults(input);
        return result;
    } catch(error) {
        console.error("Erro na ação do servidor getQuizSummary:", error);
        return { summary: "Desculpe, não conseguimos gerar um resumo para seus resultados no momento." };
    }
}

type GenerateQuizInput = 
  | ({ type: 'topic' } & GenerateQuizFromTopicInput)
  | ({ type: 'pdf' } & GenerateQuizFromPdfTextInput);


export async function generateQuiz(input: GenerateQuizInput): Promise<QuizData> {
  try {
    if (input.type === 'topic') {
      return await generateQuizFromTopic(input);
    } else {
      const result = await generateQuizFromPdfText(input);
      // O tipo QuizData espera um array de quiz, o que já temos.
      // E adicionamos a propriedade `topic` que vem do resultado.
      return {
        topic: result.topic,
        quiz: result.quiz,
      };
    }
  } catch (error) {
    console.error(`Erro ao gerar quiz do tipo ${input.type}:`, error);
    // Lançar o erro para que a página possa tratá-lo
    throw error;
  }
}
