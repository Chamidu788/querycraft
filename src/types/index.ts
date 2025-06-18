export type ColumnConstraint = "PRIMARY KEY" | "NOT NULL" | "UNIQUE" | "AUTO_INCREMENT";

export type ColumnDataType = 
  | "INT" 
  | "VARCHAR(255)" 
  | "TEXT" 
  | "DATE" 
  | "DATETIME" 
  | "BOOLEAN" 
  | "FLOAT" 
  | "DECIMAL(10,2)";

export interface ColumnDefinition {
  id: string;
  name: string;
  type: ColumnDataType;
  constraints: ColumnConstraint[];
  sampleValue: string;
}

export type QueryType = "SELECT" | "INSERT" | "UPDATE" | "DELETE";

export interface SavedQuery {
  id: string;
  name: string;
  query: string;
  tableName: string;
  columns: ColumnDefinition[];
  queryType: QueryType;
  createdAt: string;
}
