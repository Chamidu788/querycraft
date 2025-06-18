
"use client";

import React, { useState } from 'react';
import type { ColumnDefinition } from '@/types';
import { generateSqlFromNaturalLanguage } from '@/app/actions';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CopyIcon, CheckIcon, Wand2Icon, Loader2Icon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface NaturalLanguageQueryInputProps {
  tableName: string;
  columns: ColumnDefinition[];
}

const NaturalLanguageQueryInput: React.FC<NaturalLanguageQueryInputProps> = ({ tableName, columns }) => {
  const [naturalLanguageInput, setNaturalLanguageInput] = useState<string>('');
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerateSql = async () => {
    if (!naturalLanguageInput.trim()) {
      toast({ title: "Input Required", description: "Please enter your query in natural language.", variant: "destructive" });
      return;
    }
    if (!tableName.trim()) {
      toast({ title: "Table Name Required", description: "Please ensure a table name is set in the builder.", variant: "destructive" });
      return;
    }
     if (columns.filter(col => col.name && col.name.trim() !== '').length === 0) {
      toast({ title: "Columns Required", description: "Please define columns for the table.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setGeneratedSql('');
    try {
      const sql = await generateSqlFromNaturalLanguage(naturalLanguageInput, tableName, columns);
      setGeneratedSql(sql);
      if (sql.startsWith("Error:")) {
        toast({ title: "AI Error", description: sql, variant: "destructive", duration: 5000 });
      } else {
        toast({ title: "SQL Generated!", description: "AI has generated an SQL query from your text.", duration: 3000 });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
      setGeneratedSql(`Error: ${errorMessage}`);
      toast({ title: "Generation Failed", description: errorMessage, variant: "destructive", duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySql = async () => {
    if (!generatedSql || generatedSql.startsWith("Error:")) {
      toast({ title: "Nothing to copy", description: "No valid SQL query to copy.", variant: "destructive" });
      return;
    }
    try {
      await navigator.clipboard.writeText(generatedSql);
      setCopied(true);
      toast({ title: "Copied!", description: "Generated SQL query copied to clipboard.", duration: 2000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({ title: "Copy Failed", description: "Could not copy SQL to clipboard.", variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Wand2Icon className="mr-2 h-6 w-6" /> Natural Language to SQL
            </CardTitle>
            <CardDescription>Describe what you want in plain English, and AI will write the SQL for you. (Uses current table & columns)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="e.g., Show all users with emails ending in @example.com, or, Add a new product with name 'Awesome Gadget', price 49.99, and stock 100"
            value={naturalLanguageInput}
            onChange={(e) => setNaturalLanguageInput(e.target.value)}
            rows={4}
            className="text-sm leading-relaxed"
            aria-label="Natural language query input"
            disabled={isLoading}
          />
        </div>
        <Button onClick={handleGenerateSql} disabled={isLoading || !tableName.trim() || columns.filter(col => col.name && col.name.trim() !== '').length === 0} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          {isLoading ? (
            <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Wand2Icon className="mr-2 h-5 w-5" />
          )}
          Generate SQL from Text
        </Button>

        {(generatedSql || isLoading) && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-primary-foreground">Generated SQL:</h4>
              {generatedSql && !generatedSql.startsWith("Error:") && (
                 <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={handleCopySql} variant="ghost" size="icon" className="text-primary hover:bg-primary/10" aria-label="Copy generated SQL query">
                          {copied ? <CheckIcon className="h-5 w-5 text-accent" /> : <CopyIcon className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copied ? "Copied!" : "Copy SQL"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
              )}
            </div>
            <ScrollArea className="h-36 md:h-40 w-full rounded-md border bg-muted/30 p-1">
              <pre className="p-3 text-sm font-code whitespace-pre-wrap break-all leading-relaxed">
                {isLoading && !generatedSql ? <span className="animate-pulse">AI is thinking...</span> : <code>{generatedSql || "-- Your AI-generated SQL query will appear here."}</code>}
              </pre>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NaturalLanguageQueryInput;
