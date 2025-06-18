
"use client";

import type React from 'react';
import type { SavedQuery } from '@/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit3Icon, Trash2Icon, ListChecksIcon, DatabaseZapIcon, DatabaseBackupIcon } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format } from 'date-fns';

interface SavedQueriesListProps {
  savedQueries: SavedQuery[];
  onEditQuery: (queryId: string) => void;
  onDeleteQuery: (queryId: string) => void;
  onLoadQueryToBuilder: (query: SavedQuery) => void;
}

const SavedQueriesList: React.FC<SavedQueriesListProps> = ({ savedQueries, onEditQuery, onDeleteQuery, onLoadQueryToBuilder }) => {
  if (savedQueries.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
             <ListChecksIcon className="mr-3 h-7 w-7" /> Saved Queries
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-10">
          <DatabaseBackupIcon className="h-16 w-16 text-muted-foreground/70 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground font-semibold mb-2">No Queries Saved Yet</p>
          <p className="text-sm text-muted-foreground">Start building and save your first SQL query to see it here!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary flex items-center">
          <ListChecksIcon className="mr-3 h-7 w-7" /> Saved Queries
        </CardTitle>
        <CardDescription>Manage your saved SQL queries. Click a query name to load it, or use actions to edit/delete.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64 md:h-80 pr-3">
          <ul className="space-y-3">
            {savedQueries.map((sq) => (
              <li key={sq.id} className="p-4 border border-border rounded-lg bg-card hover:shadow-lg transition-shadow duration-200 group">
                <div className="flex justify-between items-center">
                  <div className="flex-grow min-w-0">
                    <h4 
                      className="font-semibold text-lg text-primary-foreground cursor-pointer hover:text-accent transition-colors"
                      onClick={() => onLoadQueryToBuilder(sq)}
                      title="Load this query into the builder"
                    >
                      {sq.name || `Query for ${sq.tableName}`}
                    </h4>
                    <p className="text-sm text-muted-foreground font-code truncate" title={sq.query}>{sq.query}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Saved: {format(new Date(sq.createdAt), "MMM d, yyyy 'at' HH:mm")}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 shrink-0 ml-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                           <Button variant="ghost" size="icon" onClick={() => onLoadQueryToBuilder(sq)} className="text-primary hover:bg-primary/10 h-8 w-8">
                            <DatabaseZapIcon size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Load to Builder</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => onEditQuery(sq.id)} className="text-blue-600 hover:bg-blue-600/10 h-8 w-8">
                            <Edit3Icon size={16} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Edit Name</p></TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <AlertDialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 h-8 w-8">
                                <Trash2Icon size={16} />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent><p>Delete Query</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the query: "{sq.name || sq.query}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDeleteQuery(sq.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedQueriesList;
