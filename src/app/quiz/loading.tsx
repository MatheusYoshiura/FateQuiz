import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="flex items-center space-x-2 text-lg text-muted-foreground animate-pulse mb-4">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p className="font-headline">Gerando seu quiz, por favor aguarde...</p>
        </div>
        <Card className="w-full max-w-2xl">
            <CardHeader className="space-y-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </CardContent>
        </Card>
    </div>
  );
}
