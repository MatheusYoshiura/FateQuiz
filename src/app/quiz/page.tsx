import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import InteractiveQuiz from '@/components/quiz/interactive-quiz';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Clock, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { generateQuiz } from './actions';


export default async function QuizPage({
  searchParams,
}: {
  searchParams: { topic?: string; numQuestions?: string; difficulty?: string, fromPdf?: string, textContent?: string };
}) {
  const topic = searchParams.topic;
  const numQuestions = Number(searchParams.numQuestions) || 10;
  const difficulty = searchParams.difficulty || "Médio";
  const isFromPdf = searchParams.fromPdf === 'true';
  // O textContent agora vem do sessionStorage no cliente, não mais pela URL.
  const textContent = searchParams.textContent;


  if (!topic) {
    redirect('/');
  }

  let quizData;

  try {
     if (isFromPdf && textContent) {
        const decodedText = decodeURIComponent(textContent);
        quizData = await generateQuiz({ type: 'pdf', textContent: decodedText });
     } else {
        quizData = await generateQuiz({ type: 'topic', topic, numQuestions, difficulty });
     }
  } catch (error: any) {
    console.error("Falha ao gerar o quiz:", error);

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

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
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
                    A IA não conseguiu criar nenhuma pergunta para "{isFromPdf ? `o tópico do seu PDF` : topic}". Isso pode acontecer com tópicos muito específicos ou abstratos. Por favor, tente um diferente.
                </AlertDescription>
            </Alert>
            <Button asChild variant="link" className="mt-4">
              <Link href="/">Voltar para o Início</Link>
            </Button>
        </div>
    );
  }

  const finalTopic = isFromPdf ? quizData.topic || topic : topic;

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 md:p-6 bg-background">
        <Suspense fallback={<div>Carregando quiz...</div>}>
            <InteractiveQuiz quizData={quizData} topic={finalTopic} isFromPdf={isFromPdf} />
        </Suspense>
    </main>
  );
}
