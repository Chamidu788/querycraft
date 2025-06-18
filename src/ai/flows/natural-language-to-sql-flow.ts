
'use server';
/**
 * @fileOverview A Genkit flow for converting natural language text into SQL queries.
 *
 * - generateSqlFromNaturalLanguage - A function that takes natural language text, table name, and column definitions, and returns a generated SQL query.
 * - NaturalLanguageToSqlInput - The input type for the generateSqlFromNaturalLanguage function.
 * - NaturalLanguageToSqlOutput - The return type for the generateSqlFromNaturalLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ColumnDefinition } from '@/types'; // Ensure this path is correct

const ColumnDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(), // Simplified to string, as specific enum might be too restrictive for LLM
  constraints: z.array(z.string()),
  sampleValue: z.string(),
});

const NaturalLanguageToSqlInputSchema = z.object({
  naturalLanguageQuery: z.string().describe('The user\'s query in natural language.'),
  tableName: z.string().describe('The name of the database table to query.'),
  columns: z.array(ColumnDefinitionSchema).describe('The definitions of the columns in the table.'),
});

export type NaturalLanguageToSqlInput = z.infer<typeof NaturalLanguageToSqlInputSchema>;

const NaturalLanguageToSqlOutputSchema = z.object({
  generatedSql: z.string().describe('The SQL query generated from the natural language input.'),
});

export type NaturalLanguageToSqlOutput = z.infer<typeof NaturalLanguageToSqlOutputSchema>;

export async function generateSqlFromNaturalLanguage(input: NaturalLanguageToSqlInput): Promise<NaturalLanguageToSqlOutput> {
  // Filter out columns with no name, as they are not useful for SQL generation
  const validColumns = input.columns.filter(col => col.name && col.name.trim() !== '');
  return naturalLanguageToSqlFlow({...input, columns: validColumns});
}

const naturalLanguageToSqlPrompt = ai.definePrompt({
  name: 'naturalLanguageToSqlPrompt',
  input: {schema: NaturalLanguageToSqlInputSchema},
  output: {schema: NaturalLanguageToSqlOutputSchema},
  prompt: `You are an expert SQL generator. Your task is to translate the user's natural language request into a syntactically correct SQL query for the given table and its columns.
Consider the table structure carefully when generating the query.
If the request implies a specific type of query (SELECT, INSERT, UPDATE, DELETE), generate that.
For INSERT or UPDATE, use example values from the column definitions if appropriate, or use placeholders if specific values are not provided in the natural language query.
For SELECT, UPDATE, and DELETE, include a WHERE clause if the user's request implies conditions. If no conditions are obvious for UPDATE or DELETE, add a placeholder comment like '/* your condition here */'.

Table Name: \`{{{tableName}}}\`

Columns (Name, Type, Constraints):
{{#each columns}}
  - \`{{name}}\` ({{type}}){{#if constraints.length}} [{{#each constraints}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}]{{/if}} (Example: '{{sampleValue}}')
{{/each}}

User's Natural Language Query:
"{{{naturalLanguageQuery}}}"

Generated SQL Query (Only output the SQL query. Do not include any surrounding text, explanations, or markdown formatting like \`\`\`sql ... \`\`\`):
`,
});

const naturalLanguageToSqlFlow = ai.defineFlow(
  {
    name: 'naturalLanguageToSqlFlow',
    inputSchema: NaturalLanguageToSqlInputSchema,
    outputSchema: NaturalLanguageToSqlOutputSchema,
  },
  async input => {
    const {output} = await naturalLanguageToSqlPrompt(input);
    if (!output?.generatedSql) {
      throw new Error('AI failed to generate SQL query.');
    }
    // Ensure the output is just the SQL string
    let sql = output.generatedSql.trim();
    if (sql.startsWith('```sql')) {
      sql = sql.substring(6);
    }
    if (sql.endsWith('```')) {
      sql = sql.substring(0, sql.length - 3);
    }
    return { generatedSql: sql.trim() };
  }
);
