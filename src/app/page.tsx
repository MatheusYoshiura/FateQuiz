"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, FileText } from "lucide-react";
import PdfUploader from "@/components/quiz/pdf-uploader";

const TopicFormSchema = z.object({
  topic: z.string().min(2, {
    message: "O tópico deve ter pelo menos 2 caracteres.",
  }),
  numQuestions: z.string(),
  difficulty: z.string(),
});

export default function Home() {
  const router = useRouter();

  const form = useForm<z.infer<typeof TopicFormSchema>>({
    resolver: zodResolver(TopicFormSchema),
    defaultValues: {
      topic: "",
      numQuestions: "10",
      difficulty: "Médio",
    },
  });

  function onSubmit(data: z.infer<typeof TopicFormSchema>) {
    router.push(`/quiz?topic=${encodeURIComponent(data.topic)}&numQuestions=${data.numQuestions}&difficulty=${data.difficulty}`);
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-lg z-10 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Lightbulb className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-4xl font-headline font-bold">
            FateQuiz
          </CardTitle>
          <p className="text-muted-foreground">
            Crie um quiz sobre qualquer tópico ou a partir de um PDF!
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="topic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="topic">
                <Lightbulb className="mr-2 h-4 w-4" />
                Por Tópico
              </TabsTrigger>
              <TabsTrigger value="pdf">
                <FileText className="mr-2 h-4 w-4" />
                Por PDF
              </TabsTrigger>
            </TabsList>
            <TabsContent value="topic" className="mt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tópico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ex: O Império Romano, Hooks do React.js"
                            {...field}
                            className="text-lg h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="numQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nº de Perguntas</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-lg h-12">
                                <SelectValue placeholder="Número" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="5">5</SelectItem>
                              <SelectItem value="10">10</SelectItem>
                              <SelectItem value="15">15</SelectItem>
                              <SelectItem value="20">20</SelectItem>
                              <SelectItem value="25">25</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dificuldade</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="text-lg h-12">
                                <SelectValue placeholder="Nível" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Fácil">Fácil</SelectItem>
                              <SelectItem value="Médio">Médio</SelectItem>
                              <SelectItem value="Difícil">Difícil</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" className="w-full text-lg h-12 font-bold" size="lg">
                    Gerar Quiz
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="pdf" className="mt-6">
                <PdfUploader />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
}
