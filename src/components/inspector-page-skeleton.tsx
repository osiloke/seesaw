import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Webhook } from 'lucide-react';

export default function InspectorPageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="p-4 md:p-8 border-b">
        <div className="container mx-auto">
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-5 w-72" />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-8">
        <Card className="mb-8 shadow-md">
          <CardHeader>
            <Skeleton className="h-6 w-52" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-48 flex-shrink-0" />
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <Skeleton className="h-5 flex-grow" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
            <Skeleton className="h-4 w-3/4 mt-2" />
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="text-center py-16 border-2 border-dashed border-border rounded-lg flex flex-col items-center">
          <Webhook className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground font-semibold">Loading...</p>
          <p className="text-sm text-muted-foreground mt-1">
            Getting your session ready.
          </p>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        <div className="container mx-auto flex flex-col items-center gap-2">
            <Skeleton className="h-4 w-96 max-w-full" />
            <Skeleton className="h-4 w-64 max-w-full" />
        </div>
      </footer>
    </div>
  );
}
