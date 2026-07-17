"use client";

import JsonView from '@uiw/react-json-view';
import { darkTheme } from '@uiw/react-json-view/dark';
import { copyToClipboard } from '@/lib/clipboard';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface JsonBodyProps {
  data: unknown;
  raw: string;
}

const customTheme = {
  ...darkTheme,
  '--w-rjv-background-color': 'transparent',
  '--w-rjv-font-family': 'var(--font-code)',
  '--w-rjv-key-string': '#a78bfa',
  '--w-rjv-curlybraces-color': '#a78bfa',
  '--w-rjv-brackets-color': '#a78bfa',
  '--w-rjv-type-string-color': '#86efac',
  '--w-rjv-type-int-color': '#93c5fd',
  '--w-rjv-type-float-color': '#fcd34d',
  '--w-rjv-type-boolean-color': '#f472b6',
  '--w-rjv-type-null-color': '#f87171',
  '--w-rjv-copied-color': '#a78bfa',
  '--w-rjv-copied-success-color': '#86efac',
  '--w-rjv-line-color': '#3f3f46',
  '--w-rjv-arrow-color': '#a1a1aa',
};

export default function JsonBody({ data, raw }: JsonBodyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    let pretty = raw;
    try {
      pretty = JSON.stringify(JSON.parse(raw), null, 2);
    } catch {}
    copyToClipboard(pretty).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (typeof data !== 'object' || data === null) {
    return (
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
          title="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
        <pre className="text-xs p-4 bg-muted rounded-md overflow-x-auto font-code">
          {typeof data === 'string' ? `"${data}"` : String(data)}
        </pre>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
        title="Copy"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <div className="text-xs p-4 bg-muted rounded-md overflow-x-auto font-code">
        <JsonView
          value={data as object}
          collapsed={3}
          enableClipboard={false}
          displayObjectSize={true}
          displayDataTypes={false}
          indentWidth={14}
          shortenTextAfterLength={50}
          style={customTheme as React.CSSProperties}
        />
      </div>
    </div>
  );
}
