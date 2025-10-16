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
        <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-grid-black/[0.2] dark:bg-grid-white/[0.2] pointer-events-none"></div>
        <Card className="w-full max-w-lg z-10 shadow-2xl">
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
              Digite um tópico ou faça upload de um arquivo PDF e nós geraremos um quiz para você!
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
                          <FormLabel className="sr-only">Tópico</FormLabel>
                          <FormControl>
                            <Input
                                placeholder="ex: O Império Romano, Hooks do React.js, Fotossíntese"
                                {...field}
                                className="text-center text-lg h-14"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Botão normal para gerar quiz */}
                <Button
                    type="submit"
                    className="w-full text-lg h-12 font-bold"
                    size="lg"
                >
                  Gerar Quiz
                </Button>

                {/* Novo botão para ir para a página de upload PDF */}
                <Button
                    type="button"
                    onClick={() => router.push("/pdf")}
                    variant="outline"
                    className="w-full text-lg h-12 font-bold"
                >
                  Upload PDF
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
  );
}
