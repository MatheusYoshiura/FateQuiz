// SummarizeQuizResults story implementation.
'use server';

/**
 * @fileOverview Summarizes the quiz results to provide a quick understanding of user performance.
 *
 * - summarizeQuizResults - A function that summarizes the quiz results.
 * - SummarizeQuizResultsInput - The input type for the summarizeQuizResults function.
 * - SummarizeQuizResultsOutput - The return type for the summarizeQuizResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeQuizResultsInputSchema = z.object({
  topic: z.string().describe('The topic of the quiz.'),
  score: z.number().describe('The user\'s score on the quiz.'),
  totalQuestions: z.number().describe('The total number of questions in the quiz.'),
  correctAnswers: z.number().describe('The number of questions the user answered correctly.'),
  incorrectAnswers: z.number().describe('The number of questions the user answered incorrectly.'),
});
export type SummarizeQuizResultsInput = z.infer<typeof SummarizeQuizResultsInputSchema>;

const SummarizeQuizResultsOutputSchema = z.object({
  summary: z.string().describe('A summary of the quiz results.'),
});
export type SummarizeQuizResultsOutput = z.infer<typeof SummarizeQuizResultsOutputSchema>;

export async function summarizeQuizResults(input: SummarizeQuizResultsInput): Promise<SummarizeQuizResultsOutput> {
  return summarizeQuizResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeQuizResultsPrompt',
  input: {schema: SummarizeQuizResultsInputSchema},
  output: {schema: SummarizeQuizResultsOutputSchema},
  prompt: `Você é um sumarizador de quizzes de IA. Com base nos resultados do quiz a seguir, forneça um resumo conciso em português do Brasil do desempenho do usuário.

Tópico: {{{topic}}}
Pontuação: {{{score}}}
Total de Questões: {{{totalQuestions}}}
Respostas Corretas: {{{correctAnswers}}}
Respostas Incorretas: {{{incorrectAnswers}}}

O resumo deve ser encorajador e amigável.

Resumo:`,
});

const summarizeQuizResultsFlow = ai.defineFlow(
  {
    name: 'summarizeQuizResultsFlow',
    inputSchema: SummarizeQuizResultsInputSchema,
    outputSchema: SummarizeQuizResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
