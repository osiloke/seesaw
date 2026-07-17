"use client";

import { type RequestDetail } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from 'date-fns';
import JsonBody from './json-body';

function getMethodClass(method: string): string {
  switch (method.toUpperCase()) {
    case "GET":
      return "bg-chart-2 text-primary-foreground";
    case "POST":
      return "bg-chart-1 text-primary-foreground";
    case "PUT":
      return "bg-chart-4 text-primary-foreground";
    case "DELETE":
      return "bg-destructive text-destructive-foreground";
    case "PATCH":
      return "bg-chart-5 text-primary-foreground";
    default:
      return "bg-muted-foreground text-muted";
  }
}

function isJsonContent(headers: Record<string, string>): boolean {
  const contentType = headers['content-type'] || '';
  return contentType.includes('application/json');
}

function tryParseJson(body: string): unknown {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
}

export default function RequestDetails({ request }: { request: RequestDetail }) {
  const formattedTimestamp = format(new Date(request.timestamp), "PP p");
  const isJson = isJsonContent(request.headers);
  const parsedBody = isJson ? tryParseJson(request.body) : null;
  const queryString = Object.keys(request.query).length > 0 ? `?${new URLSearchParams(request.query).toString()}` : '';

  return (
    <Card className="overflow-hidden animate-in fade-in-0 slide-in-from-top-4 duration-500 bg-card/60 backdrop-blur-md border-white/10 dark:border-white/5 shadow-sm">
        <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-2 justify-between border-b">
            <div className="flex items-center gap-4 flex-wrap">
                <Badge className={`text-xs font-bold w-20 justify-center border-0 ${getMethodClass(request.method)}`}>
                    {request.method}
                </Badge>
                <p className="font-mono text-sm text-foreground break-all">{request.path}{queryString}</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground flex-shrink-0 self-start sm:self-center">
                <span>{request.ip}</span>
                <span>{formattedTimestamp}</span>
            </div>
        </div>

      <Accordion type="multiple" className="w-full text-sm bg-background">
        {Object.keys(request.query).length > 0 && (
          <AccordionItem value="query" className="border-b">
            <AccordionTrigger className="px-4 py-3 font-medium hover:no-underline">Query Parameters</AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <JsonBody data={request.query} raw={JSON.stringify(request.query, null, 2)} />
            </AccordionContent>
          </AccordionItem>
        )}
        <AccordionItem value="headers" className="border-b">
          <AccordionTrigger className="px-4 py-3 font-medium hover:no-underline">Headers</AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <JsonBody data={request.headers} raw={JSON.stringify(request.headers, null, 2)} />
          </AccordionContent>
        </AccordionItem>
        {request.body && (
          <AccordionItem value="body" className="border-b-0">
            <AccordionTrigger className="px-4 py-3 font-medium hover:no-underline">Body</AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              {isJson && parsedBody ? (
                <JsonBody data={parsedBody} raw={request.body} />
              ) : (
                <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto font-code">
                  {request.body}
                </pre>
              )}
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Card>
  );
}
