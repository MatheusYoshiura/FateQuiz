'use server';
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateTopicsFromPDFInputSchema = z.object({
  textContent: z.string().describe('O conteúdo de texto completo extraído do PDF.'),
});

const GenerateTopicsFromPDFOutputSchema = z.object({
  topics: z.array(z.string()).describe('Lista de temas principais encontrados no texto do PDF.'),
});

export type GenerateTopicsFromPDFInput = z.infer<typeof GenerateTopicsFromPDFInputSchema>;
export type GenerateTopicsFromPDFOutput = z.infer<typeof GenerateTopicsFromPDFOutputSchema>;

const extractTopicsPrompt = ai.definePrompt({
  name: 'extractTopicsFromPDFPrompt',
  input: { schema: z.object({ text: z.string() }) },
  output: { schema: z.object({ topics: z.array(z.string()) }) },
  prompt: `
      Você é um especialista em análise de materiais didáticos. Leia o texto a seguir e, a partir da análise do conteúdo, identifique os principais temas ou assuntos tratados.
      Ignore elementos irrelevantes como numeração de páginas, instruções de exercício, palavras desconexas ou metadados de slides.
      Resuma os tópicos de forma clara e coerente, mantendo a linguagem técnica quando apropriado.
      Responda apenas com uma lista JSON de temas em português do Brasil.

      Texto:
      "{{{text}}}"
    `,
});

const generateTopicsFlow = ai.defineFlow(
  {
    name: 'generateTopicsFromPdfTextFlow',
    inputSchema: GenerateTopicsFromPDFInputSchema,
    outputSchema: GenerateTopicsFromPDFOutputSchema,
  },
  async ({ textContent }) => {
    // A IA pode ter um limite de caracteres, então pegamos uma amostra representativa.
    const textSample = textContent.replace(/\s+/g, ' ').trim().slice(0, 8000);

    const { output } = await extractTopicsPrompt({ text: textSample });
    
    // Garante que a saída seja sempre um array, mesmo que a IA falhe.
    const topics = Array.isArray(output?.topics) ? output.topics : [];
    
    return { topics };
  }
);


export async function generateTopicsFromPDF(
  input: GenerateTopicsFromPDFInput
): Promise<GenerateTopicsFromPDFOutput> {
  return generateTopicsFlow(input);
}
