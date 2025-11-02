'use server';
/**
 * @fileOverview AI quiz generator flow from a topic.
 *
 * - generateQuizFromTopic - A function that handles the quiz generation process.
 * - GenerateQuizFromTopicInput - The input type for the generateQuizFromTopic function.
 * - GenerateQuizFromTopicOutput - The return type for the generateQuizFromTopic function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateQuizFromTopicInputSchema = z.object({
  topic: z.string().describe('The topic to generate the quiz about.'),
  numQuestions: z.number().default(10).describe('The number of questions to generate.'),
});
export type GenerateQuizFromTopicInput = z.infer<
  typeof GenerateQuizFromTopicInputSchema
>;

const GenerateQuizFromTopicOutputSchema = z.object({
  quiz: z.array(
    z.object({
      question: z.string().describe('The quiz question.'),
      options: z.array(z.string()).describe('The possible answers.'),
      answer: z.string().describe('The correct answer.'),
    })
  ).describe('The generated quiz questions.'),
});
export type GenerateQuizFromTopicOutput = z.infer<
  typeof GenerateQuizFromTopicOutputSchema
>;

export async function generateQuizFromTopic(
  input: GenerateQuizFromTopicInput
): Promise<GenerateQuizFromTopicOutput> {
  return generateQuizFromTopicFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizFromTopicPrompt',
  input: {schema: GenerateQuizFromTopicInputSchema},
  output: {schema: GenerateQuizFromTopicOutputSchema},
  prompt: `Você é um especialista em gerar quizzes. Gere um quiz em português do Brasil com as seguintes propriedades:

Tópico: {{{topic}}}
Número de Questões: {{{numQuestions}}}

Cada questão deve ter 4 respostas possíveis.
Garanta que uma das opções seja a resposta correta e que a alternativa da resposta não seja a mesma da questão anterior.

Gere um objeto JSON que seja um array de questões, onde cada questão tem as propriedades "question", "options", e "answer".
`,
});

const generateQuizFromTopicFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTopicFlow',
    inputSchema: GenerateQuizFromTopicInputSchema,
    outputSchema: GenerateQuizFromTopicOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
