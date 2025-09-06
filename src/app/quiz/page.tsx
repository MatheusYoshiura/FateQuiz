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
    console.error("Failed to generate quiz:", error);
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Alert variant="destructive" className="max-w-lg">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Error Generating Quiz</AlertTitle>
                <AlertDescription>
                    We couldn't generate a quiz for the topic "{topic}". Please try another topic or check back later.
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
                <AlertTitle>No Questions Found</AlertTitle>
                <AlertDescription>
                    The AI couldn't create any questions for "{topic}". This can happen with very niche or abstract topics. Please try a different one.
                </AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6">
      <Suspense fallback={<div>Loading quiz...</div>}>
        <InteractiveQuiz quizData={quizData} topic={topic} />
      </Suspense>
    </main>
  );
}
