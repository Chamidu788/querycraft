
"use client";

import type React from 'react';
import type { ColumnDefinition, ColumnConstraint, ColumnDataType } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { XIcon, GripVerticalIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { COLUMN_DATA_TYPES, COLUMN_CONSTRAINTS_OPTIONS } from '@/lib/query-builder';

interface ColumnInputProps {
  column: ColumnDefinition;
  onUpdate: (id: string, updates: Partial<ColumnDefinition>) => void;
  onRemove: (id: string) => void;
  isDraggable?: boolean;
}

const ColumnInput: React.FC<ColumnInputProps> = ({ column, onUpdate, onRemove, isDraggable = false }) => {
  const handleConstraintChange = (constraint: ColumnConstraint, checked: boolean) => {
    const newConstraints = checked
      ? [...column.constraints, constraint]
      : column.constraints.filter(c => c !== constraint);
    onUpdate(column.id, { constraints: newConstraints });
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 p-4 border border-border rounded-lg shadow-sm bg-card hover:shadow-md transition-shadow duration-200 relative mb-3">
      {isDraggable && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="cursor-grab p-1 absolute left-1 top-1/2 -translate-y-1/2 md:static md:translate-y-0 md:mr-2 text-muted-foreground hover:text-foreground">
                <GripVerticalIcon size={18} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag to reorder</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-grow w-full">
        <div className="space-y-1">
          <Label htmlFor={`colName-${column.id}`} className="text-sm font-medium">Name</Label>
          <Input
            id={`colName-${column.id}`}
            type="text"
            placeholder="e.g., user_id"
            value={column.name}
            onChange={(e) => onUpdate(column.id, { name: e.target.value })}
            className="h-9 text-sm"
            aria-label={`Column name for ${column.id}`}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`colType-${column.id}`} className="text-sm font-medium">Type</Label>
          <Select
            value={column.type}
            onValueChange={(value: ColumnDataType) => onUpdate(column.id, { type: value })}
          >
            <SelectTrigger id={`colType-${column.id}`} className="h-9 text-sm" aria-label={`Column type for ${column.id}`}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {COLUMN_DATA_TYPES.map(type => (
                <SelectItem key={type} value={type} className="text-sm">{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1">
          <Label htmlFor={`colSample-${column.id}`} className="text-sm font-medium">Example Value (for INSERT)</Label>
          <Input
            id={`colSample-${column.id}`}
            type="text"
            placeholder="e.g., John Doe or 123"
            value={column.sampleValue}
            onChange={(e) => onUpdate(column.id, { sampleValue: e.target.value })}
            className="h-9 text-sm"
            aria-label={`Example value for ${column.id}`}
          />
        </div>
      </div>

      <div className="mt-3 md:mt-0 md:ml-3">
        <Label className="text-sm font-medium mb-1 block">Constraints</Label>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {COLUMN_CONSTRAINTS_OPTIONS.map(constraint => (
            <div key={constraint} className="flex items-center space-x-2">
              <Checkbox
                id={`${column.id}-${constraint}`}
                checked={column.constraints.includes(constraint)}
                onCheckedChange={(checked) => handleConstraintChange(constraint, !!checked)}
                aria-label={`${constraint} constraint for column ${column.name || column.id}`}
              />
              <Label htmlFor={`${column.id}-${constraint}`} className="text-sm font-normal cursor-pointer">{constraint}</Label>
            </div>
          ))}
        </div>
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(column.id)}
              className="text-destructive hover:bg-destructive/10 ml-auto md:ml-3 h-9 w-9 self-center shrink-0"
              aria-label={`Remove column ${column.name || column.id}`}
            >
              <XIcon size={18} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Remove column</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ColumnInput;
