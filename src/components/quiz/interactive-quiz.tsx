"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { getQuizSummary } from "@/app/quiz/actions";
import type { QuizData, QuizQuestion } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Award, BookOpen, Repeat, Home } from "lucide-react";
import { StarBurst } from "./confetti";

type QuizState = "ongoing" | "answered" | "completed";
type UserAnswer = { question: string; answer: string; isCorrect: boolean; correctAnswer: string; };

function playCorrectSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.02);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioContext.currentTime + 0.1); // C6

    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.25);
  } catch (error) {
    console.error("Não foi possível reproduzir o som:", error);
  }
}

export default function InteractiveQuiz({
                                          quizData,
                                          topic,
                                          isFromPdf = false, // 👈 novo prop para controlar a origem do quiz
                                        }: {
  quizData: QuizData;
  topic: string;
  isFromPdf?: boolean;
}) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizState, setQuizState] = useState<QuizState>("ongoing");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const currentQuestion: QuizQuestion = quizData.quiz[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.quiz.length) * 100;
  
  const score = useMemo(() => userAnswers.filter(a => a.isCorrect).length, [userAnswers]);

  const handleOptionSelect = (option: string) => {
    if (quizState === "ongoing") {
      const isCorrect = option === currentQuestion.answer;
      setSelectedOption(option);
      setUserAnswers([
        ...userAnswers,
        {
          question: currentQuestion.question,
          answer: option,
          isCorrect,
          correctAnswer: currentQuestion.answer,
        },
      ]);
      setQuizState("answered");

      if (isCorrect) {
        setShowBurst(true);
        playCorrectSound();
      }

      setTimeout(() => {
        setShowBurst(false);
        if (currentQuestionIndex < quizData.quiz.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setQuizState("ongoing");
          setSelectedOption(null);
        } else {
          setQuizState("completed");
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (quizState === "completed") {
      setIsSummaryLoading(true);
      const results = {
        topic: topic,
        score: (score / quizData.quiz.length) * 100,
        totalQuestions: quizData.quiz.length,
        correctAnswers: score,
        incorrectAnswers: quizData.quiz.length - score,
      };
      getQuizSummary(results)
          .then((res) => setSummary(res.summary))
          .catch((err) => console.error("Erro ao buscar o resumo:", err))
          .finally(() => setIsSummaryLoading(false));
    }
  }, [quizState, score, quizData.quiz.length, topic]);

  if (quizState === "completed") {
    return (
        <Card className="w-full max-w-3xl animate-in fade-in-50 duration-500">
          <CardHeader className="text-center">
            <Award className="mx-auto h-16 w-16 text-accent" />
            <CardTitle className="text-3xl font-headline">Quiz Concluído!</CardTitle>
            <CardDescription className="text-lg">Tópico: {topic}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center p-6 bg-secondary/50 rounded-lg">
              <p className="text-xl font-medium text-secondary-foreground">Sua Pontuação</p>
              <p className="text-6xl font-bold text-primary">
                {score}
                <span className="text-3xl text-muted-foreground">
                /{quizData.quiz.length}
              </span>
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Resumo da IA
              </h3>
              {isSummaryLoading ? (
                  <p className="text-muted-foreground italic">Gerando feedback...</p>
              ) : (
                  <p className="text-foreground">{summary}</p>
              )}
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Revise Suas Respostas</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {userAnswers.map((answer, index) => (
                        <div key={index} className="p-3 rounded-md bg-muted/50">
                          <p className="font-semibold">
                            {index + 1}. {answer.question}
                          </p>
                          <p
                              className={cn(
                                  "text-sm",
                                  answer.isCorrect ? "text-green-600" : "text-red-600"
                              )}
                          >
                            Sua resposta: {answer.answer}
                            {answer.isCorrect ? (
                                <CheckCircle2 className="inline ml-2 h-4 w-4" />
                            ) : (
                                <XCircle className="inline ml-2 h-4 w-4" />
                            )}
                          </p>
                          {!answer.isCorrect && (
                              <p className="text-sm text-primary">
                                Resposta correta: {answer.correctAnswer}
                              </p>
                          )}
                        </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-2">
            <Button
                onClick={() => {
                  window.location.href = `/quiz?topic=${encodeURIComponent(topic)}`;
                }}
                className="w-full"
            >
              <Repeat className="mr-2" /> Tentar Novamente
            </Button>

            {/* 👇 Só mostra este botão se o quiz veio do PDF */}
            {isFromPdf && (
                <Button onClick={() => router.push(`/pdf`)} className="w-full">
                  <Repeat className="mr-2" /> Escolher Outro Tópico
                </Button>
            )}

            <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="w-full"
            >
              <Home className="mr-2" /> Início
            </Button>
          </CardFooter>
        </Card>
    );
  }

  return (
      <>
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <Progress value={progress} className="mb-2" />
            <CardDescription>
              Pergunta {currentQuestionIndex + 1} de {quizData.quiz.length}
            </CardDescription>
            <CardTitle className="text-2xl font-headline">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
              const isCorrectAnswer = option === currentQuestion.answer;
              const isSelected = option === selectedOption;

              let buttonClass = "bg-secondary text-secondary-foreground hover:bg-secondary/80";
              if (quizState === "answered") {
                if (isCorrectAnswer) {
                  buttonClass =
                      "bg-green-500 text-white animate-in zoom-in-105 shadow-lg shadow-green-500/50";
                } else if (isSelected) {
                  buttonClass = "bg-red-500 text-white";
                } else {
                  buttonClass = "bg-secondary text-muted-foreground opacity-50";
                }
              }

              return (
                  <Button
                      key={index}
                      onClick={() => handleOptionSelect(option)}
                      disabled={quizState === "answered"}
                      className={cn(
                          "relative h-auto min-h-[4rem] whitespace-normal justify-start p-4 text-left transition-all duration-300",
                          buttonClass
                      )}
                  >
                    <Badge variant="outline" className="mr-4 text-lg bg-background">
                      {String.fromCharCode(65 + index)}
                    </Badge>
                    {option}
                    {quizState === "answered" && isCorrectAnswer && showBurst && <StarBurst />}
                  </Button>
              );
            })}
          </CardContent>
        </Card>
      </>
  );
}
