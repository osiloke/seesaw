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

function tryFormat(body: string, headers: Record<string, string>): string {
    const contentType = headers['content-type'] || '';
    if (contentType.includes('application/json') && body) {
        try {
            return JSON.stringify(JSON.parse(body), null, 2);
        } catch (e) {
            return body;
        }
    }
    return body;
}

export default function RequestDetails({ request }: { request: RequestDetail }) {
  const formattedTimestamp = format(new Date(request.timestamp), "PP p");
  const formattedBody = request.body ? tryFormat(request.body, request.headers) : '';
  const queryString = Object.keys(request.query).length > 0 ? `?${new URLSearchParams(request.query).toString()}` : '';

  return (
    <Card className="overflow-hidden animate-in fade-in-0 slide-in-from-top-4 duration-500">
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
              <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto font-code">
                {JSON.stringify(request.query, null, 2)}
              </pre>
            </AccordionContent>
          </AccordionItem>
        )}
        <AccordionItem value="headers" className="border-b">
          <AccordionTrigger className="px-4 py-3 font-medium hover:no-underline">Headers</AccordionTrigger>
          <AccordionContent className="px-4 pb-3">
            <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto font-code">
              {JSON.stringify(request.headers, null, 2)}
            </pre>
          </AccordionContent>
        </AccordionItem>
        {request.body && (
          <AccordionItem value="body" className="border-b-0">
            <AccordionTrigger className="px-4 py-3 font-medium hover:no-underline">Body</AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto font-code">
                {formattedBody}
              </pre>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </Card>
  );
}
