"use server";

import { summarizeQuizResults, type SummarizeQuizResultsInput } from "@/ai/flows/summarize-quiz-results";

export async function getQuizSummary(input: SummarizeQuizResultsInput): Promise<{summary: string}> {
    try {
        const result = await summarizeQuizResults(input);
        return result;
    } catch(error) {
        console.error("Error in getQuizSummary server action:", error);
        return { summary: "Sorry, we couldn't generate a summary for your results at this time." };
    }
}
