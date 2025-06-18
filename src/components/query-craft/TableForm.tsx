
"use client";

import type React from 'react';
import type { ColumnDefinition } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import ColumnInput from './ColumnInput';
import { PlusCircleIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TableFormProps {
  tableName: string;
  setTableName: (name: string) => void;
  columns: ColumnDefinition[];
  setColumns: React.Dispatch<React.SetStateAction<ColumnDefinition[]>>;
}

const TableForm: React.FC<TableFormProps> = ({ tableName, setTableName, columns, setColumns }) => {
  const addColumn = () => {
    setColumns(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: '', type: 'INT', constraints: [], sampleValue: '' }
    ]);
  };

  const updateColumn = (id: string, updates: Partial<ColumnDefinition>) => {
    setColumns(prev => prev.map(col => col.id === id ? { ...col, ...updates } : col));
  };

  const removeColumn = (id: string) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Table & Column Builder</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="tableName" className="text-lg font-medium text-primary">Table Name</Label>
          <Input
            id="tableName"
            type="text"
            placeholder="e.g., users"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="mt-1 text-base p-2.5 border-2 border-transparent focus:border-primary transition-colors"
            aria-label="Table Name"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-lg font-medium text-primary">Columns</Label>
          {columns.length > 0 && (
            <ScrollArea className="h-[max(200px,calc(100vh-600px))] pr-3 border border-border rounded-md">
               <div className="p-1">
                {columns.map((col) => (
                  <ColumnInput
                    key={col.id}
                    column={col}
                    onUpdate={updateColumn}
                    onRemove={removeColumn}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
           <Button onClick={addColumn} variant="outline" className="w-full border-dashed border-accent text-accent hover:bg-accent/10 hover:text-accent">
            <PlusCircleIcon className="mr-2 h-5 w-5" /> Add New Column
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableForm;
