export interface Entity {
  tableName: string;
  columns: Column[];
}

export interface Column {
  name: string;
  type: DataTypes;
  autoincrement?: boolean;
  primaryKey?: boolean;
  notNull?: boolean;
  unique?: boolean;
}

export enum DataTypes {
  TEXT = "TEXT",
  INTEGER = "INTEGER",
  REAL = "REAL",
  BLOB = "BLOB",
  NULL = "NULL",
}

export interface InsertEntity {
  column: string;
  value: any;
}
