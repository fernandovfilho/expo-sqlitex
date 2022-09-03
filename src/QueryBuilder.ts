import { Column, Entity } from "./types/Entity";
import { IFindOptions } from "./types/Find";

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

  static dropTable(entity: Entity): string {
    return `DROP TABLE IF EXISTS ${entity.tableName}`;
  }

  static saveColumns(obj: any): string {
    let columns: string[] = [];
    Object.keys(obj).forEach((column) => {
      columns.push(column);
    });
    return columns.join(",");
  }

  static saveValues(obj: any): string {
    let values: string[] = [];
    Object.values(obj).forEach((val) => {
      values.push(`?`);
    });
    return values.join(",");
  }

  static save(entity: Entity, obj: any): string {
    let query = `INSERT INTO ${entity.tableName} (${this.saveColumns(
      obj
    )}) VALUES (${this.saveValues(obj)});`;

    return query;
  }

  static deleteAll(entity: Entity): string {
    let query = `DELETE FROM ${entity.tableName}`;
    return query;
  }

  static selectAll(entity: Entity): string {
    return `SELECT * FROM ${entity.tableName}`;
  }

  static findById(
    entity: Entity,
    pkColumn: Column,
    id: string | number
  ): string {
    return `SELECT * FROM ${entity.tableName} WHERE ${pkColumn.name} = '${id}'`;
  }

  static find(entity: Entity, options: IFindOptions): string {
    return `SELECT ${this.generateFindColumns(options)} FROM ${
      entity.tableName
    } ${this.generateFindWhere(options)} ${this.generateFindOrderBy(options)}`;
  }

  static generateFindColumns(options: IFindOptions): string {
    let columns = "*";

    if (options.columns && options.columns.length) {
      columns = options.columns.join(",");
    }

    return columns;
  }

  static generateFindOrderBy(options: IFindOptions): string {
    let orderByParts: string[] = [];

    if (options.orderBy && options.orderBy.length) {
      options.orderBy.forEach((item) => {
        orderByParts.push(`ORDER BY ${item.column} ${item.direction}`);
      });
    }

    return orderByParts.join(",");
  }

  static generateFindWhere(options: IFindOptions): string {
    let whereStr = "WHERE 1=1 ";

    if (options.where && options.where.length) {
      options.where.forEach((item) => {
        if (
          ["=", "!=", ">", "<", "<=", ">=", "LIKE"].includes(item.condition)
        ) {
          whereStr += ` AND ${item.column} ${
            item.condition
          } ${this.valueHandling(item.value)}`;
        } else if (
          ["IN", "NOT IN"].includes(item.condition) &&
          Array.isArray(item.value) &&
          item.value.length
        ) {
          whereStr += ` AND ${item.column} ${item.condition} (${item.value
            .map((val) => this.valueHandling(val))
            .join(",")})`;
        }
      });
    }

    return whereStr;
  }

  static valueHandling(val: any) {
    if (typeof val === "string") {
      return `'${val}'`;
    }

    return val;
  }
}
