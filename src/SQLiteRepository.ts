import { Entity } from "./Entity";
import { QueryBuilder } from "./QueryBuilder";

export class SQLiteRepository {
  static async createTable(connection: any, entity: Entity): Promise<boolean> {
    const sql = QueryBuilder.createTable(entity);
    return new Promise((res, rej) => {
      connection.transaction((tAction: any) => {
        tAction.executeSql(
          sql,
          () => res(true),
          (e: any) => rej(e)
        );
      });
    });
  }
}
