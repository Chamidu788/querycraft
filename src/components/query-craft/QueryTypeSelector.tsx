"use client";

import type React from 'react';
import type { QueryType } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface QueryTypeSelectorProps {
  selectedQueryType: QueryType;
  setSelectedQueryType: (type: QueryType) => void;
}

const queryTypes: { value: QueryType; label: string; description: string }[] = [
  { value: "SELECT", label: "SELECT", description: "Retrieve data from your table." },
  { value: "INSERT", label: "INSERT", description: "Add new rows of data to your table." },
  { value: "UPDATE", label: "UPDATE", description: "Modify existing data in your table." },
  { value: "DELETE", label: "DELETE", description: "Remove data from your table." },
];

const QueryTypeSelector: React.FC<QueryTypeSelectorProps> = ({ selectedQueryType, setSelectedQueryType }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Query Type</CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="queryType" className="sr-only">Select Query Type</Label>
        <Select value={selectedQueryType} onValueChange={(value: QueryType) => setSelectedQueryType(value)}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger id="queryType" className="text-base p-2.5 h-auto" aria-label="Select SQL query type">
                  <SelectValue placeholder="Select query type" />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <p>{queryTypes.find(qt => qt.value === selectedQueryType)?.description || "Select a query type"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SelectContent>
            {queryTypes.map((type) => (
              <SelectItem key={type.value} value={type.value} className="text-base">
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedQueryType && (
          <p className="mt-2 text-sm text-muted-foreground">
            {queryTypes.find(qt => qt.value === selectedQueryType)?.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QueryTypeSelector;
