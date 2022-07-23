import { Column, Entity } from "./Entity";

export class QueryBuilder {
  static createTableColumns(columns: Column[]): string {
    const columnsSQL: string[] = [];

    for (const column of columns) {
      const columnParts = [column.name, column.type];
      if (column.primaryKey) {
        columnParts.push("NOT NULL PRIMARY KEY");
        if (column.autoincrement) {
          columnParts.push("AUTOINCREMENT");
        }
      } else {
        if (column.unique) columnParts.push("UNIQUE");
        if (column.notNull) columnParts.push("NOT NULL");
      }

      columnsSQL.push(columnParts.join(" "));
    }

    return columnsSQL.join(",");
  }

  static createTable(entity: Entity): string {
    let query = `CREATE TABLE IF NOT EXISTS ${
      entity.tableName
    } (${this.createTableColumns(entity.columns)});`;
    return query;
  }
}
