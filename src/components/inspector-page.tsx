"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { type RequestDetail } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { Copy, Trash2, Webhook, Shuffle } from 'lucide-react';
import RequestDetails from './request-details';
import { cn } from '@/lib/utils';
import { copyToClipboard } from '@/lib/clipboard';

function generateUUID(): string {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Fallback for non-secure contexts (HTTP)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function InspectorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>('');
  const debouncedSessionId = useDebounce(sessionId, 500);
  const [requests, setRequests] = useState<RequestDetail[]>([]);
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const initialSessionId = searchParams.get('sessionId');
    if (initialSessionId) {
      setSessionId(initialSessionId);
    } else {
      const newId = generateUUID();
      router.replace(`?sessionId=${newId}`, { scroll: false });
    }
  }, []);

  useEffect(() => {
    const newId = searchParams.get('sessionId');
    if(newId) {
      setSessionId(newId);
    }
  }, [searchParams]);

  const updateUrl = useCallback((id: string) => {
    router.replace(`?sessionId=${id}`, { scroll: false });
  }, [router]);

  useEffect(() => {
    if (debouncedSessionId && debouncedSessionId !== searchParams.get('sessionId')) {
      updateUrl(debouncedSessionId);
    }
  }, [debouncedSessionId, searchParams, updateUrl]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const endpointUrl = useMemo(() => {
    if (typeof window !== 'undefined' && sessionId) {
      return `${window.location.origin}/api/inspect/${sessionId}`;
    }
    return '';
  }, [sessionId]);

  const baseUrl = useMemo(() => {
    return '/api/inspect/';
  }, []);

  const handleGenerateRandom = useCallback(() => {
    const newId = generateUUID();
    setSessionId(newId);
    setRequests([]);
    updateUrl(newId);
    toast({
      title: "New Session ID Generated",
      description: "A new random session ID has been created.",
    });
  }, [toast, updateUrl]);

  useEffect(() => {
    if (!debouncedSessionId) return;

    setRequests([]); 

    const eventSource = new EventSource(`/api/events/${debouncedSessionId}`);

    eventSource.onmessage = (event) => {
        if (event.data.startsWith('{')) {
            const newRequest = JSON.parse(event.data);
            setRequests(prev => [newRequest, ...prev]);
        }
    };
    
    eventSource.onerror = (error) => {
        console.error("EventSource encountered an error:", error);
        // The EventSource will automatically try to reconnect on most errors.
        // We can choose to close it explicitly on certain conditions if needed.
    };

    return () => {
      eventSource.close();
    };
  }, [debouncedSessionId]);

  const handleCopy = () => {
    if (!endpointUrl) return;
    copyToClipboard(endpointUrl).then(() => {
      toast({
        title: "Copied to Clipboard",
        description: "The endpoint URL is ready to use.",
      });
    });
  };

  const handleClear = () => {
    setRequests([]);
    toast({
        title: "Requests Cleared",
        description: "All captured requests have been removed.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen text-foreground relative">
        <header className="p-4 border-b bg-background/40 backdrop-blur-md">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-primary font-headline">Seesaw</h1>
                <p className="text-sm text-muted-foreground mt-1">Ephemeral HTTP request inspector.</p>
            </div>
        </header>

        <div className={cn(
            "sticky top-0 z-10 bg-background/60 backdrop-blur-xl border-b transition-all duration-500 ease-spring",
            isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        )}>
            <div className="container mx-auto p-2">
                 <div className="flex items-center gap-4 p-2 bg-muted/40 rounded-lg">
                    <code className="flex-grow text-sm md:text-base break-all font-code truncate">
                        {endpointUrl || '...'}
                    </code>
                    <Button onClick={handleCopy} disabled={!endpointUrl} size="sm">
                        <Copy className="mr-2 h-4 w-4" /> Copy URL
                    </Button>
                </div>
            </div>
        </div>

        <main className="flex-grow container mx-auto p-4">
            <Card className="mb-6 shadow-md bg-card/60 backdrop-blur-md border-white/10 dark:border-white/5">
                <CardHeader>
                    <CardTitle className="text-lg">Your Unique Endpoint</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row items-center gap-2">
                            <div className="flex flex-grow items-center rounded-md border border-input w-full">
                                <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-2 border-r whitespace-nowrap">
                                    {baseUrl}
                                </span>
                                <Input 
                                    type="text"
                                    value={sessionId}
                                    onChange={(e) => setSessionId(e.target.value)}
                                    placeholder="Enter or generate a session ID"
                                    className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-code flex-grow"
                                    aria-label="Session ID"
                                />
                            </div>
                           <Button onClick={handleGenerateRandom} variant="outline" className="flex-shrink-0">
                                <Shuffle className="mr-2 h-4 w-4"/> Generate Random
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                            <code className="flex-grow text-sm md:text-base break-all font-code">
                                {endpointUrl || 'Enter or generate a session ID to create a URL'}
                            </code>
                            <Button onClick={handleCopy} disabled={!endpointUrl}>
                                <Copy className="mr-2 h-4 w-4" /> Copy URL
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Send an HTTP request to your URL to see it appear.</p>
                </CardContent>
            </Card>

            {/* How It Works Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-card/40 backdrop-blur-sm border-dashed border-white/10 dark:border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold">1</span>
                            Generate URL
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Set a Session ID. Copy the endpoint URL.
                    </CardContent>
                </Card>
                <Card className="bg-card/40 backdrop-blur-sm border-dashed border-white/10 dark:border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold">2</span>
                            Send Requests
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Trigger requests via curl, Postman, or webhooks.
                    </CardContent>
                </Card>
                <Card className="bg-card/40 backdrop-blur-sm border-dashed border-white/10 dark:border-white/5">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-semibold flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs text-primary font-bold">3</span>
                            Inspect Real-Time
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        Watch requests stream. View headers and payloads instantly.
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold font-headline">Captured Requests ({requests.length})</h2>
                <Button variant="outline" onClick={handleClear} disabled={requests.length === 0}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear All
                </Button>
            </div>
            
            <div className="space-y-4">
                {requests.length === 0 ? (
                    <div className="text-center py-16 border-2 border-dashed border-border rounded-lg flex flex-col items-center">
                        <Webhook className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground font-semibold">Waiting for requests...</p>
                        <p className="text-sm text-muted-foreground mt-1 mb-6">Send a request to your unique URL to begin.</p>
                        <div className="bg-muted/30 p-4 rounded-md text-left w-full max-w-2xl overflow-x-auto relative group">
                            <Button 
                                size="icon" 
                                variant="ghost" 
                                className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                    const curlCmd = `curl -X POST ${endpointUrl || 'https://seesaw.osiloke.com/api/inspect/example'} \\\n  -H "Content-Type: application/json" \\\n  -d '{"hello": "world"}'`;
                                    copyToClipboard(curlCmd).then(() => {
                                        toast({
                                            title: "Copied to Clipboard",
                                            description: "Example curl command copied.",
                                        });
                                    });
                                }}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                            <pre className="text-xs font-code text-muted-foreground">
                                <code>
{`curl -X POST ${endpointUrl || '...'} \\
  -H "Content-Type: application/json" \\
  -d '{"hello": "world"}'`}
                                </code>
                            </pre>
                        </div>
                    </div>
                ) : (
                    requests.map(req => <RequestDetails key={req.id} request={req} />)
                )}
            </div>
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t">
            <p>All data is ephemeral and will be lost when you close this page.</p>
            <p className="mt-1">
              Created by <a href="https://github.com/osiloke" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">osiloke</a> • Star the project on <a href="https://github.com/osiloke/seesaw" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">GitHub</a>
            </p>
            {process.env.NEXT_PUBLIC_COMMIT_SHA && (
              <p className="mt-1 font-mono text-[10px]">
                Commit: {process.env.NEXT_PUBLIC_COMMIT_SHA.length === 40 ? process.env.NEXT_PUBLIC_COMMIT_SHA.substring(0, 7) : process.env.NEXT_PUBLIC_COMMIT_SHA}
              </p>
            )}
        </footer>
    </div>
  );
}
