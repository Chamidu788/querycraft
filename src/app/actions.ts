// src/app/actions.ts
'use server';
import { generateTableCreationPrompt, type TableCreationInput } from '@/ai/flows/sql-error-prompt';
import { generateSqlFromNaturalLanguage as generateSqlFromNLFlow, type NaturalLanguageToSqlInput } from '@/ai/flows/natural-language-to-sql-flow';
import type { ColumnDefinition } from '@/types';


export async function getSqlFixSuggestion(input: TableCreationInput): Promise<string> {
  try {
    const result = await generateTableCreationPrompt(input);
    return result.tableCreationPrompt;
  } catch (error) {
    console.error("Error generating SQL fix suggestion:", error);
    return `Error: Could not generate suggestion. Details: ${error instanceof Error ? error.message : String(error)}`;
  }
}

export async function generateSqlFromNaturalLanguage(
  naturalLanguageQuery: string,
  tableName: string,
  columns: ColumnDefinition[]
): Promise<string> {
  try {
    const input: NaturalLanguageToSqlInput = {
      naturalLanguageQuery,
      tableName,
      columns,
    };
    const result = await generateSqlFromNLFlow(input);
    return result.generatedSql;
  } catch (error) {
    console.error("Error generating SQL from natural language:", error);
    return `Error: Could not generate SQL from natural language. Details: ${error instanceof Error ? error.message : String(error)}`;
  }
}
