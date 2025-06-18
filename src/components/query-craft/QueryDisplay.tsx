"use client";

import React, { useState } from 'react'; // Added React and useState import
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface QueryDisplayProps {
  query: string;
}

const QueryDisplay: React.FC<QueryDisplayProps> = ({ query }) => {
  const [copied, setCopied] = useState(false); // Changed from React.useState to useState
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(query);
      setCopied(true);
      toast({ title: "Copied!", description: "SQL query copied to clipboard.", duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({ title: "Error", description: "Failed to copy query.", variant: "destructive", duration: 2000 });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="font-headline text-2xl text-primary">Generated SQL Query</CardTitle>
            <CardDescription>Review and copy the generated SQL statement below.</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleCopy} variant="ghost" size="icon" className="text-primary hover:bg-primary/10" aria-label="Copy SQL query">
                  {copied ? <CheckIcon className="h-5 w-5 text-accent" /> : <CopyIcon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "Copied!" : "Copy to clipboard"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 md:h-64 w-full rounded-md border bg-muted/30 p-1">
          <pre className="p-3 text-sm font-code whitespace-pre-wrap break-all leading-relaxed">
            <code>{query || "-- Your generated SQL query will appear here."}</code>
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default QueryDisplay;
