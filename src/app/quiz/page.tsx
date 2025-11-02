import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { generateQuizFromTopic } from '@/ai/flows/generate-quiz-from-topic';
import InteractiveQuiz from '@/components/quiz/interactive-quiz';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Clock, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function QuizPage({
  searchParams,
}: {
  searchParams: { topic?: string };
}) {
  const topic = searchParams.topic;

  if (!topic) {
    redirect('/');
  }

  let quizData;

  try {
    quizData = await generateQuizFromTopic({ topic: topic, numQuestions: 10 });
  } catch (error: any) {
    console.error("Falha ao gerar o quiz:", error);

    // Verifica se é um erro de limite de taxa (429)
    if (error.message && error.message.includes('429')) {
       return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <Alert variant="destructive" className="max-w-lg">
                <Clock className="h-4 w-4" />
                <AlertTitle>Muitas Requisições</AlertTitle>
                <AlertDescription>
                    Você atingiu o limite de requisições. Por favor, aguarde um minuto antes de tentar gerar um novo quiz.
                </AlertDescription>
            </Alert>
            <Button asChild variant="link" className="mt-4">
              <Link href="/">Voltar para o Início</Link>
            </Button>
        </div>
       )
    }

    // Erro genérico
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro ao Gerar o Quiz</AlertTitle>
                <AlertDescription>
                    Não conseguimos gerar um quiz para o tópico "{topic}". Por favor, tente outro tópico ou volte mais tarde.
                </AlertDescription>
            </Alert>
             <Button asChild variant="link" className="mt-4">
              <Link href="/">Voltar para o Início</Link>
            </Button>
        </div>
    );
  }

  if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
            <Alert variant="destructive" className="max-w-lg">
                <FileQuestion className="h-4 w-4" />
                <AlertTitle>Nenhuma Pergunta Encontrada</AlertTitle>
                <AlertDescription>
                    A IA não conseguiu criar nenhuma pergunta para "{topic}". Isso pode acontecer com tópicos muito específicos ou abstratos. Por favor, tente um diferente.
                </AlertDescription>
            </Alert>
            <Button asChild variant="link" className="mt-4">
              <Link href="/">Voltar para o Início</Link>
            </Button>
        </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-6">
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] pointer-events-none"></div>
        <Suspense fallback={<div>Carregando quiz...</div>}>
            <InteractiveQuiz quizData={quizData} topic={topic} />
        </Suspense>
    </main>
  );
}
