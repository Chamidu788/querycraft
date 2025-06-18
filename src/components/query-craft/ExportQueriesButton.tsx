"use client";

import type React from 'react';
import type { SavedQuery } from '@/types';
import { Button } from '@/components/ui/button';
import { DownloadIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface ExportQueriesButtonProps {
  savedQueries: SavedQuery[];
}

const ExportQueriesButton: React.FC<ExportQueriesButtonProps> = ({ savedQueries }) => {
  const { toast } = useToast();

  const handleExport = () => {
    if (savedQueries.length === 0) {
      toast({ title: "Nothing to export", description: "There are no saved queries to export.", duration: 3000 });
      return;
    }

    const fileContent = savedQueries.map(sq => 
      `-- Query Name: ${sq.name || `Query for ${sq.tableName}`}\n` +
      `-- Saved At: ${format(new Date(sq.createdAt), "yyyy-MM-dd HH:mm:ss")}\n` +
      `${sq.query}\n\n`
    ).join('');

    const blob = new Blob([fileContent], { type: 'text/sql;charset=utf-8' });
    const fileName = `query_backup_${format(new Date(), "yyyy-MM-dd")}.sql`;
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({ title: "Export Successful!", description: `Queries exported to ${fileName}.`, duration: 3000 });
  };

  return (
    <Button 
      onClick={handleExport} 
      disabled={savedQueries.length === 0}
      className="bg-accent hover:bg-accent/90 text-accent-foreground w-full md:w-auto"
      aria-label="Export all saved queries"
    >
      <DownloadIcon className="mr-2 h-5 w-5" /> Export All Saved Queries
    </Button>
  );
};

export default ExportQueriesButton;
