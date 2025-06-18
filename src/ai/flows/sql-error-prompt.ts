// use server'
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating SQL CREATE TABLE prompts based on detected SQL errors, particularly missing table errors.
 *
 * - generateTableCreationPrompt - A function that takes an SQL error message and a table name and returns a suggested CREATE TABLE statement.
 * - TableCreationInput - The input type for the generateTableCreationPrompt function.
 * - TableCreationOutput - The return type for the generateTableCreationPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TableCreationInputSchema = z.object({
  sqlError: z.string().describe('The SQL error message encountered.'),
  tableName: z.string().describe('The name of the table that caused the error.'),
});

export type TableCreationInput = z.infer<typeof TableCreationInputSchema>;

const TableCreationOutputSchema = z.object({
  tableCreationPrompt: z.string().describe('A suggested SQL CREATE TABLE statement based on the error and table name.'),
});

export type TableCreationOutput = z.infer<typeof TableCreationOutputSchema>;

export async function generateTableCreationPrompt(input: TableCreationInput): Promise<TableCreationOutput> {
  return tableCreationFlow(input);
}

const tableCreationPrompt = ai.definePrompt({
  name: 'tableCreationPrompt',
  input: {schema: TableCreationInputSchema},
  output: {schema: TableCreationOutputSchema},
  prompt: `You are an SQL expert. Given the following SQL error message and table name, generate a suitable SQL CREATE TABLE statement to fix the error.

SQL Error: {{{sqlError}}}
Table Name: {{{tableName}}}

Consider common column types and a basic primary key setup.  The generated SQL should be executable and fix the missing table error.

Ensure that your response only includes the CREATE TABLE statement, and nothing else. Do not include any explanation.

Here is the CREATE TABLE statement:
`,
});

const tableCreationFlow = ai.defineFlow(
  {
    name: 'tableCreationFlow',
    inputSchema: TableCreationInputSchema,
    outputSchema: TableCreationOutputSchema,
  },
  async input => {
    const {output} = await tableCreationPrompt(input);
    return output!;
  }
);
