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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const FormSchema = z.object({
  topic: z.string().min(2, {
    message: "O tópico deve ter pelo menos 2 caracteres.",
  }),
});

export default function Home() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    router.push(`/quiz?topic=${encodeURIComponent(data.topic)}`);
  }

  return (
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
        {/* Fundo */}
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.2] dark:bg-grid-white/[0.2] pointer-events-none"></div>

        {/* Card principal ampliado */}
        <Card className="w-full max-w-3xl z-10 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-2">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Lightbulb className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
              FateQuiz IA Generator
            </CardTitle>
            <p className="text-muted-foreground">
              Crie questionários personalizados com o poder da inteligência artificial.
            </p>
          </CardHeader>

          <CardContent>
              <CardTitle className="mb-20">
              </CardTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Campo de tópico + botão Gerar Quiz */}
                <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                        <FormItem>
                          <p className="text-muted-foreground mb-2">
                            Crie seu quiz a partir de um tópico
                          </p>
                          <FormLabel className="sr-only">Tópico</FormLabel>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <FormControl className="flex-1">
                              <Input
                                  placeholder="ex: O Império Romano, Hooks do React.js, Fotossíntese"
                                  {...field}
                                  className="text-center text-lg h-14"
                              />
                            </FormControl>
                            <Button
                                type="submit"
                                className="text-lg h-14 font-bold sm:w-48"
                                size="lg"
                            >
                              Gerar Quiz
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                {/* 🔹 Linha pontilhada com "OU" no centro */}
                <div className="relative my-8 flex items-center justify-center">
                  <div className="w-full border-t border-dashed border-muted-foreground"></div>
                  <span className="absolute bg-background px-4 text-muted-foreground font-medium">
                  ou
                </span>
                </div>

                  {/* Campo de tópico + botão Gerar Quiz */}
                  <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                          <FormItem>
                              <p className="text-muted-foreground mb-2">
                                  Crie seu quiz a partir de um arquivo
                              </p>
                              <FormLabel className="sr-only">Tópico</FormLabel>
                              <div className="flex flex-col sm:flex-row gap-4">
                                  <FormControl className="flex-1">
                                      <Input
                                          placeholder="ex:"
                                          {...field}
                                          className="text-center text-lg h-14"
                                      />
                                  </FormControl>
                                  <Button
                                      type="submit"
                                      className="text-lg h-14 font-bold sm:w-48"
                                      size="lg"
                                      onClick={() => router.push("/pdf")}
                                  >
                                      Upload PDF
                                  </Button>
                              </div>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
  );
}
