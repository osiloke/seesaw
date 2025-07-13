"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { type RequestDetail } from '@/lib/types';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/use-debounce";
import { Copy, Trash2, Webhook, Shuffle } from 'lucide-react';
import RequestDetails from './request-details';
import { cn } from '@/lib/utils';

export default function InspectorPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const debouncedSessionId = useDebounce(sessionId, 500);
  const [requests, setRequests] = useState<RequestDetail[]>([]);
  const { toast } = useToast();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    setSessionId(crypto.randomUUID());
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const endpointUrl = useMemo(() => {
    if (typeof window !== 'undefined' && debouncedSessionId) {
      return `${window.location.origin}/api/inspect/${debouncedSessionId}`;
    }
    return '';
  }, [debouncedSessionId]);

  const baseUrl = useMemo(() => {
    return '/api/inspect/';
  }, []);

  const handleGenerateRandom = useCallback(() => {
    const newId = crypto.randomUUID();
    setSessionId(newId);
    setRequests([]);
    toast({
      title: "New Session ID Generated",
      description: "A new random session ID has been created.",
    });
  }, [toast]);

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
    
    eventSource.onerror = () => {
        eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [debouncedSessionId]);

  const handleCopy = () => {
    if (!endpointUrl) return;
    navigator.clipboard.writeText(endpointUrl).then(() => {
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
    <div className="flex flex-col min-h-screen bg-background text-foreground">
        <header className="p-4 md:p-8 border-b">
            <div className="container mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-primary font-headline">Seesaw</h1>
                <p className="text-muted-foreground mt-2">Your ephemeral HTTP request inspector.</p>
            </div>
        </header>

        <div className={cn(
            "sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b transition-all duration-300 ease-in-out",
            isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
        )}>
            <div className="container mx-auto p-4">
                 <div className="flex items-center gap-4 p-2 bg-muted/30 rounded-lg">
                    <code className="flex-grow text-sm md:text-base break-all font-code truncate">
                        {endpointUrl || '...'}
                    </code>
                    <Button onClick={handleCopy} disabled={!endpointUrl} size="sm">
                        <Copy className="mr-2 h-4 w-4" /> Copy URL
                    </Button>
                </div>
            </div>
        </div>

        <main className="flex-grow container mx-auto p-4 md:p-8">
            <Card className="mb-8 shadow-md">
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
                    <p className="text-xs text-muted-foreground mt-2">Use the generated URL to send any HTTP request to it to see it appear below.</p>
                </CardContent>
            </Card>

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
                        <p className="text-sm text-muted-foreground mt-1">Send a request to your unique URL to begin.</p>
                    </div>
                ) : (
                    requests.map(req => <RequestDetails key={req.id} request={req} />)
                )}
            </div>
        </main>
        <footer className="text-center p-4 text-sm text-muted-foreground border-t">
            <p>All data is ephemeral and will be lost when you close this page.</p>
        </footer>
    </div>
  );
}
