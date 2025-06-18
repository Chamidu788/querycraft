import type { ColumnDefinition, QueryType } from '@/types';

export function generateQuery(
  tableName: string,
  columns: ColumnDefinition[],
  queryType: QueryType
): string {
  if (!tableName.trim()) return "-- Please enter a table name.";
  if (columns.some(col => !col.name.trim())) return "-- Please ensure all columns have names.";

  const columnNames = columns.map(col => `\`${col.name}\``).join(", ");
  const activeColumns = columns.filter(col => col.name.trim());

  switch (queryType) {
    case "SELECT":
      if (activeColumns.length === 0) return `SELECT * FROM \`${tableName}\` LIMIT 0, 25;`;
      return `SELECT ${columnNames} FROM \`${tableName}\` LIMIT 0, 25;`;
    
    case "INSERT":
      if (activeColumns.length === 0) return `-- Please add columns to generate an INSERT query.`;
      const sampleValues = activeColumns.map(col => {
        const val = col.sampleValue.trim();
        if (!val) {
          if (col.type.startsWith('VARCHAR') || col.type === 'TEXT' || col.type === 'DATE' || col.type === 'DATETIME') return "'sample_value'";
          if (col.type === 'INT' || col.type === 'FLOAT' || col.type.startsWith('DECIMAL')) return "0";
          if (col.type === 'BOOLEAN') return "TRUE";
        }
        if (col.type === 'INT' || col.type === 'FLOAT' || col.type.startsWith('DECIMAL') || col.type === 'BOOLEAN') {
          return val; // Numeric types don't need quotes if sampleValue is valid
        }
        return `'${val.replace(/'/g, "''")}'`; // Escape single quotes for string types
      }).join(", ");
      return `INSERT INTO \`${tableName}\` (${columnNames}) VALUES (${sampleValues});`;

    case "UPDATE":
      if (activeColumns.length === 0) return `-- Please add columns to generate an UPDATE query.`;
      const setClauses = activeColumns.map(col => {
        const val = col.sampleValue.trim();
        if (!val) {
           if (col.type.startsWith('VARCHAR') || col.type === 'TEXT' || col.type === 'DATE' || col.type === 'DATETIME') return `\`${col.name}\` = 'new_value'`;
           if (col.type === 'INT' || col.type === 'FLOAT' || col.type.startsWith('DECIMAL')) return `\`${col.name}\` = 0`;
           if (col.type === 'BOOLEAN') return `\`${col.name}\` = TRUE`;
        }
        if (col.type === 'INT' || col.type === 'FLOAT' || col.type.startsWith('DECIMAL') || col.type === 'BOOLEAN') {
          return `\`${col.name}\` = ${val}`;
        }
        return `\`${col.name}\` = '${val.replace(/'/g, "''")}'`;
      }).join(",\n  ");
      return `UPDATE \`${tableName}\`\nSET\n  ${setClauses}\nWHERE /* your condition here (e.g., id = 1) */;\n-- Note: Always use a WHERE clause for UPDATE statements to avoid unintended data changes.`;

    case "DELETE":
      return `DELETE FROM \`${tableName}\` WHERE /* your condition here (e.g., id = 1) */;\n-- Note: Always use a WHERE clause for DELETE statements to avoid unintended data loss.`;
    
    default:
      return "-- Invalid query type.";
  }
}

export function generateCreateTableQuery(tableName: string, columns: ColumnDefinition[]): string {
  if (!tableName.trim()) return "-- Please enter a table name.";
  if (columns.length === 0 || columns.every(col => !col.name.trim())) return `-- Please add and define columns for table ${tableName}.`;

  const columnDefinitions = columns
    .filter(col => col.name.trim())
    .map(col => {
      let definition = `\`${col.name}\` ${col.type}`;
      if (col.constraints.length > 0) {
        definition += ` ${col.constraints.join(" ")}`;
      }
      return definition;
    })
    .join(",\n  ");

  return `CREATE TABLE IF NOT EXISTS \`${tableName}\` (\n  ${columnDefinitions}\n);`;
}

export const COLUMN_DATA_TYPES: ColumnDataType[] = [
  "INT", 
  "VARCHAR(255)", 
  "TEXT", 
  "DATE", 
  "DATETIME", 
  "BOOLEAN", 
  "FLOAT", 
  "DECIMAL(10,2)"
];

export const COLUMN_CONSTRAINTS_OPTIONS: ColumnConstraint[] = [
  "PRIMARY KEY", 
  "NOT NULL", 
  "UNIQUE", 
  "AUTO_INCREMENT"
];
