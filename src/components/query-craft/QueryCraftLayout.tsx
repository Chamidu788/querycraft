
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { ColumnDefinition, QueryType, SavedQuery } from '@/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { generateQuery, generateCreateTableQuery } from '@/lib/query-builder';
import { getSqlFixSuggestion } from '@/app/actions';

import TableForm from './TableForm';
import QueryTypeSelector from './QueryTypeSelector';
import QueryDisplay from './QueryDisplay';
import SQLErrorDisplay from './SQLErrorDisplay';
import SavedQueriesList from './SavedQueriesList';
import ExportQueriesButton from './ExportQueriesButton';
import AboutModal from './AboutModal';
import NaturalLanguageQueryInput from './NaturalLanguageQueryInput';
import ThemeToggle from './ThemeToggle'; // Import ThemeToggle

import { Button } from '@/components/ui/button';
import { SaveIcon, FileTextIcon, HelpCircleIcon, DatabaseIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


const QueryCraftLayout: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [tableName, setTableName] = useLocalStorage<string>('qc-tableName', 'my_table');
  const [columns, setColumns] = useLocalStorage<ColumnDefinition[]>('qc-columns', [
    { id: crypto.randomUUID(), name: 'id', type: 'INT', constraints: ['PRIMARY KEY', 'AUTO_INCREMENT'], sampleValue: '1' },
    { id: crypto.randomUUID(), name: 'name', type: 'VARCHAR(255)', constraints: ['NOT NULL'], sampleValue: 'John Doe' },
    { id: crypto.randomUUID(), name: 'email', type: 'VARCHAR(255)', constraints: ['UNIQUE'], sampleValue: 'john.doe@example.com' },
    { id: crypto.randomUUID(), name: 'created_at', type: 'DATETIME', constraints: [], sampleValue: 'NOW()' },
  ]);
  const [selectedQueryType, setSelectedQueryType] = useLocalStorage<QueryType>('qc-queryType', 'SELECT');
  const [generatedQuery, setGeneratedQuery] = useState<string>('');
  const [savedQueries, setSavedQueries] = useLocalStorage<SavedQuery[]>('qc-savedQueries', []);
  
  const [currentQueryName, setCurrentQueryName] = useState<string>('');
  const [editingQueryId, setEditingQueryId] = useState<string | null>(null);

  const [simulatedError, setSimulatedError] = useState<string>('');
  const [fixSuggestion, setFixSuggestion] = useState<string>('');
  const [isLoadingFix, setIsLoadingFix] = useState<boolean>(false);

  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const regenerateQuery = useCallback(() => {
    if(!isMounted) return;
    const query = generateQuery(tableName, columns, selectedQueryType);
    setGeneratedQuery(query);
  }, [tableName, columns, selectedQueryType, isMounted]);

  useEffect(() => {
    regenerateQuery();
  }, [regenerateQuery]);

  const handleSaveQuery = () => {
    if (!generatedQuery || generatedQuery.startsWith("--") || generatedQuery.startsWith("Error:")) {
      toast({ title: "Cannot Save", description: "Query is empty or invalid.", variant: "destructive", duration: 3000 });
      return;
    }
    const name = currentQueryName.trim() || `Query for ${tableName} (${selectedQueryType})`;
    
    if (editingQueryId) {
      setSavedQueries(prev => prev.map(sq => 
        sq.id === editingQueryId 
        ? { ...sq, name, query: generatedQuery, tableName, columns, queryType: selectedQueryType, createdAt: new Date().toISOString() }
        : sq
      ));
      toast({ title: "Query Updated!", description: `"${name}" has been updated.`, duration: 3000 });
      setEditingQueryId(null);
    } else {
      const newSavedQuery: SavedQuery = {
        id: crypto.randomUUID(),
        name,
        query: generatedQuery,
        tableName,
        columns,
        queryType: selectedQueryType,
        createdAt: new Date().toISOString(),
      };
      setSavedQueries(prev => [newSavedQuery, ...prev]);
      toast({ title: "Query Saved!", description: `"${name}" has been saved.`, duration: 3000 });
    }
    setCurrentQueryName('');
  };
  
  const handleEditQueryName = (queryId: string) => {
    const queryToEdit = savedQueries.find(sq => sq.id === queryId);
    if (queryToEdit) {
      const newName = prompt("Enter new name for the query:", queryToEdit.name);
      if (newName !== null && newName.trim() !== "") {
        setSavedQueries(prev => prev.map(sq => sq.id === queryId ? {...sq, name: newName.trim()} : sq));
        toast({title: "Name Updated", description: "Query name changed.", duration: 2000});
      }
    }
  };

  const handleDeleteQuery = (queryId: string) => {
    setSavedQueries(prev => prev.filter(sq => sq.id !== queryId));
    toast({ title: "Query Deleted", description: "The selected query has been removed.", duration: 3000 });
    if (editingQueryId === queryId) {
      setEditingQueryId(null);
      setCurrentQueryName('');
    }
  };

  const loadQueryToBuilder = (queryToLoad: SavedQuery) => {
    setTableName(queryToLoad.tableName);
    setColumns(queryToLoad.columns);
    setSelectedQueryType(queryToLoad.queryType);
    setGeneratedQuery(queryToLoad.query); 
    setCurrentQueryName(queryToLoad.name);
    setEditingQueryId(queryToLoad.id); 
    toast({ title: "Query Loaded", description: `"${queryToLoad.name}" loaded into builder.`, duration: 2000 });
  };

  const handleSimulateError = async () => {
    if (!tableName) {
      toast({ title: "Table Name Required", description: "Please enter a table name to simulate an error.", variant: "destructive" });
      return;
    }
    const errorMsg = `#1146 - Table 'your_database.${tableName}' doesn't exist`;
    setSimulatedError(errorMsg);
    setIsLoadingFix(true);
    setFixSuggestion('');
    try {
      const suggestion = await getSqlFixSuggestion({ sqlError: errorMsg, tableName });
      setFixSuggestion(suggestion);
       if (suggestion.startsWith("Error:")) {
        toast({ title: "AI Error", description: "Failed to get fix suggestion from AI.", variant: "destructive" });
      }
    } catch (e) {
      setFixSuggestion("Error: Could not fetch suggestion.");
      toast({ title: "AI Error", description: "Failed to get fix suggestion from AI.", variant: "destructive" });
    } finally {
      setIsLoadingFix(false);
    }
  };

  const handleGenerateCreateTable = () => {
    const createTableQuery = generateCreateTableQuery(tableName, columns);
    setGeneratedQuery(createTableQuery);
    if (createTableQuery.startsWith("--")) {
      toast({ title: "Info", description: createTableQuery.substring(3), variant: "default", duration: 4000 });
    } else {
      toast({ title: "CREATE TABLE Generated", description: "CREATE TABLE statement is ready in the query display.", duration: 3000 });
    }
  };

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-primary text-xl font-headline animate-pulse">Loading QueryCraft...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      <header className="text-center space-y-3 mb-10 md:mb-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <DatabaseIcon className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-primary">
              QueryCraft <span className="text-accent">SQL</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <ThemeToggle />
            <AboutModal />
          </div>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Visually design, generate, and manage your SQL queries. Use AI to create queries from natural language or get help with errors.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="space-y-6 md:space-y-8">
          <TableForm tableName={tableName} setTableName={setTableName} columns={columns} setColumns={setColumns} />
          <QueryTypeSelector selectedQueryType={selectedQueryType} setSelectedQueryType={setSelectedQueryType} />
        </section>

        <section className="space-y-6 md:space-y-8">
          <QueryDisplay query={generatedQuery} />
          <Card className="shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <Label htmlFor="queryName" className="font-medium">Query Name (Optional for Saving)</Label>
                <Input 
                  id="queryName"
                  placeholder="e.g., Get All Users" 
                  value={currentQueryName} 
                  onChange={(e) => setCurrentQueryName(e.target.value)}
                  className="text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSaveQuery} className="w-full sm:w-auto flex-grow bg-primary hover:bg-primary/90 text-primary-foreground">
                  <SaveIcon className="mr-2 h-5 w-5" /> {editingQueryId ? 'Update Saved Query' : 'Save Query'}
                </Button>
                 <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={handleGenerateCreateTable} variant="outline" className="w-full sm:w-auto flex-grow">
                        <FileTextIcon className="mr-2 h-5 w-5" /> Generate CREATE TABLE
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Generate a CREATE TABLE statement based on current table & columns.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
          
          <NaturalLanguageQueryInput tableName={tableName} columns={columns} />

          <SQLErrorDisplay 
            error={simulatedError} 
            fixSuggestion={fixSuggestion} 
            isLoadingFix={isLoadingFix}
            onSimulateError={handleSimulateError}
            tableName={tableName}
          />
        </section>
      </div>

      <Separator className="my-8 md:my-12"/>

      <section className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="text-3xl font-bold font-headline text-primary">Saved Queries Management</h2>
          <ExportQueriesButton savedQueries={savedQueries} />
        </div>
        <SavedQueriesList 
          savedQueries={savedQueries} 
          onEditQuery={handleEditQueryName} 
          onDeleteQuery={handleDeleteQuery}
          onLoadQueryToBuilder={loadQueryToBuilder}
        />
      </section>

      <footer className="text-center py-8 mt-8 border-t border-border">
        <p className="text-sm text-muted-foreground">
          QueryCraft SQL - &copy; {new Date().getFullYear()}. Built with Next.js, ShadCN, Tailwind CSS & Genkit AI.
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a href="https://github.com/firebase/firebase-genkit" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm text-primary hover:text-accent mt-2">
                <HelpCircleIcon className="mr-1 h-4 w-4" />
                View on GitHub (Genkit)
              </a>
            </TooltipTrigger>
            <TooltipContent>
              <p>This is a demo app. Visit the Genkit GitHub repository.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </footer>
    </div>
  );
};

export default QueryCraftLayout;
