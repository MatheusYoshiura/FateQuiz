"use server";

import { summarizeQuizResults, type SummarizeQuizResultsInput } from "@/ai/flows/summarize-quiz-results";

export async function getQuizSummary(input: SummarizeQuizResultsInput): Promise<{summary: string}> {
    try {
        const result = await summarizeQuizResults(input);
        return result;
    } catch(error) {
        console.error("Erro na ação do servidor getQuizSummary:", error);
        return { summary: "Desculpe, não conseguimos gerar um resumo para seus resultados no momento." };
    }
}
