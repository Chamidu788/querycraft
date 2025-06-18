"use client";

import React, { useState } from 'react'; // Added React and useState import
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CopyIcon, CheckIcon, AlertTriangleIcon, LightbulbIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

interface SQLErrorDisplayProps {
  error: string;
  fixSuggestion: string;
  isLoadingFix: boolean;
  onSimulateError: () => void;
  tableName: string; // Needed for error simulation context
}

const SQLErrorDisplay: React.FC<SQLErrorDisplayProps> = ({ error, fixSuggestion, isLoadingFix, onSimulateError, tableName }) => {
  const [copied, setCopied] = useState(false); // Changed from React.useState to useState
  const { toast } = useToast();

  const handleCopyFix = async () => {
    if (!fixSuggestion || fixSuggestion.startsWith("Error:")) {
      toast({ title: "Nothing to copy", description: "No valid fix suggestion available.", variant: "destructive", duration: 2000 });
      return;
    }
    try {
      await navigator.clipboard.writeText(fixSuggestion);
      setCopied(true);
      toast({ title: "Copied!", description: "Fix suggestion copied to clipboard.", duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy fix: ', err);
      toast({ title: "Error", description: "Failed to copy fix suggestion.", variant: "destructive", duration: 2000 });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <AlertTriangleIcon className="mr-2 h-6 w-6 text-destructive" />
          SQL Error Helper
        </CardTitle>
        <CardDescription>
          Simulate common SQL errors and get AI-powered suggestions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={onSimulateError} disabled={!tableName || isLoadingFix} variant="outline" className="w-full">
          {isLoadingFix ? "Getting Suggestion..." : `Simulate "Table Not Found" for '${tableName || '...'}'`}
        </Button>

        {error && (
          <div className="p-3 border border-destructive/50 rounded-md bg-destructive/10">
            <h4 className="font-semibold text-destructive mb-1">Simulated Error:</h4>
            <p className="text-sm text-destructive font-code">{error}</p>
          </div>
        )}

        {isLoadingFix && (
          <div className="p-3 border rounded-md bg-muted/50 text-center">
            <p className="text-sm text-muted-foreground animate-pulse">Generating fix suggestion...</p>
          </div>
        )}

        {fixSuggestion && !isLoadingFix && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-semibold text-accent flex items-center">
                <LightbulbIcon className="mr-2 h-5 w-5" />
                AI Fix Suggestion:
              </h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleCopyFix} variant="ghost" size="icon" className="text-accent hover:bg-accent/10" aria-label="Copy fix suggestion">
                      {copied ? <CheckIcon className="h-5 w-5" /> : <CopyIcon className="h-5 w-5" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? "Copied!" : "Copy fix"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ScrollArea className="h-36 w-full rounded-md border bg-muted/30 p-1">
              <pre className="p-3 text-sm font-code whitespace-pre-wrap break-all leading-relaxed">
                <code>{fixSuggestion}</code>
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SQLErrorDisplay;
