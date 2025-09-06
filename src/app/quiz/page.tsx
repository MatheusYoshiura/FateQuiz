import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { generateQuizFromTopic } from '@/ai/flows/generate-quiz-from-topic';
import InteractiveQuiz from '@/components/quiz/interactive-quiz';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

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
  } catch (error) {
    console.error("Falha ao gerar o quiz:", error);
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Erro ao Gerar o Quiz</AlertTitle>
                <AlertDescription>
                    Não conseguimos gerar um quiz para o tópico "{topic}". Por favor, tente outro tópico ou volte mais tarde.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!quizData || !quizData.quiz || quizData.quiz.length === 0) {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Nenhuma Pergunta Encontrada</AlertTitle>
                <AlertDescription>
                    A IA não conseguiu criar nenhuma pergunta para "{topic}". Isso pode acontecer com tópicos muito específicos ou abstratos. Por favor, tente um diferente.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6">
      <Suspense fallback={<div>Carregando quiz...</div>}>
        <InteractiveQuiz quizData={quizData} topic={topic} />
      </Suspense>
    </main>
  );
}
