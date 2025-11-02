"use server";

import { summarizeQuizResults, type SummarizeQuizResultsInput } from "@/ai/flows/summarize-quiz-results";
import { generateQuizFromPdfText } from "@/ai/flows/generate-quiz-from-pdf-text";
import { QuizData } from "@/lib/types";
import pdf from 'pdf-parse';

// Usaremos um cache em memória simples para armazenar os quizzes gerados por PDF.
// Em uma aplicação de produção, isso seria um banco de dados como Firestore ou Redis.
const quizCache = new Map<string, QuizData>();

export async function getQuizSummary(input: SummarizeQuizResultsInput): Promise<{summary: string}> {
    try {
        const result = await summarizeQuizResults(input);
        return result;
    } catch(error) {
        console.error("Erro na ação do servidor getQuizSummary:", error);
        return { summary: "Desculpe, não conseguimos gerar um resumo para seus resultados no momento." };
    }
}

export async function generateQuizFromPdf(formData: FormData): Promise<{ quizId?: string; error?: string }> {
  const file = formData.get("pdf") as File | null;

  if (!file) {
    return { error: "Nenhum arquivo PDF encontrado." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const data = await pdf(buffer);
    const textContent = data.text;

    if (!textContent.trim()) {
      throw new Error("O conteúdo do PDF está vazio ou não pôde ser lido.");
    }

    const quizData = await generateQuizFromPdfText({ textContent });

    const quizId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    quizCache.set(quizId, quizData);

    return { quizId };

  } catch (error: any) {
    console.error("Erro ao processar PDF e gerar quiz:", error);
    if (error.message && error.message.includes('429')) {
      return { error: "Você atingiu o limite de requisições. Por favor, aguarde um minuto antes de tentar gerar um novo quiz." };
    }
    return { error: "Falha ao extrair informações do PDF ou gerar o quiz. O arquivo pode estar corrompido, vazio ou ser muito complexo." };
  }
}

export async function getQuizFromCache(quizId: string): Promise<QuizData | null> {
  return quizCache.get(quizId) ?? null;
}
