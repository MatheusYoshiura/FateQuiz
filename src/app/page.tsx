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
import { Lightbulb } from "lucide-react";

const TopicFormSchema = z.object({
  topic: z.string().min(2, {
    message: "O tópico deve ter pelo menos 2 caracteres.",
  }),
  numQuestions: z.string(),
});

export default function Home() {
  const router = useRouter();

  const form = useForm<z.infer<typeof TopicFormSchema>>({
    resolver: zodResolver(TopicFormSchema),
    defaultValues: {
      topic: "",
      numQuestions: "10",
    },
  });

  function onSubmit(data: z.infer<typeof TopicFormSchema>) {
    router.push(`/quiz?topic=${encodeURIComponent(data.topic)}&numQuestions=${data.numQuestions}`);
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
            Crie um quiz sobre qualquer tópico instantaneamente!
          </p>
        </CardHeader>
        <CardContent>
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

              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Perguntas</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="text-lg h-12">
                          <SelectValue placeholder="Selecione o número de perguntas" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">5 Perguntas</SelectItem>
                        <SelectItem value="10">10 Perguntas</SelectItem>
                        <SelectItem value="15">15 Perguntas</SelectItem>
                        <SelectItem value="20">20 Perguntas</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-lg h-12 font-bold" size="lg">
                Gerar Quiz
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
