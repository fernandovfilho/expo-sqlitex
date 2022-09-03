import { QueryBuilder } from "./QueryBuilder";
import { Entity } from "./types/Entity";
import { IFindOptions } from "./types/Find";

export class SQLiteRepository {
  static async createTable(connection: any, entity: Entity) {
    const sql = QueryBuilder.createTable(entity);
    return SQLiteRepository.executeBulkSql(connection, [sql]);
  }

  static async dropTable(connection: any, entity: Entity) {
    const sql = QueryBuilder.dropTable(entity);
    return SQLiteRepository.executeBulkSql(connection, [sql]);
  }

  static async deleteAll(connection: any, entity: Entity) {
    const sql = QueryBuilder.deleteAll(entity);
    return SQLiteRepository.executeBulkSql(connection, [sql]);
  }

  static async save(connection: any, entity: Entity, obj: any) {
    let entityObj = this.modelToEntity(entity, obj);
    const sql = QueryBuilder.save(entity, entityObj);
    return SQLiteRepository.executeBulkSql(
      connection,
      [sql],
      [Object.values(entityObj)]
    );
  }

  static modelToEntity(entity: Entity, obj: any): any {
    let newEntity: any = {};
    Object.keys(obj).forEach((key) => {
      if (entity.columns.find((column) => column.name === key)) {
        if (typeof obj[key] === "object") {
          newEntity[key] = JSON.stringify(obj[key]);
        } else {
          newEntity[key] = obj[key];
        }
      }
    });
    return newEntity;
  }

  static async multipleInsert(connection: any, entity: Entity, objs: any[]) {
    let savedObjs = [];
    for (const obj of objs) {
      savedObjs.push(await this.save(connection, entity, obj));
    }
    return savedObjs;
  }

  static async executeBulkSql(
    connection: any,
    sqls: any[],
    params: any[] = []
  ) {
    return new Promise((txResolve, txReject) => {
      connection.transaction((tx: any) => {
        Promise.all(
          sqls.map((sql, index) => {
            return new Promise((sqlResolve, sqlReject) => {
              tx.executeSql(
                sql,
                params[index],
                (_: any, { rows, insertId }: any) => {
                  sqlResolve({ rows: rows._array, insertId });
                },
                (_: any, error: any) => {
                  sqlReject(error);
                }
              );
            });
          })
        )
          .then(txResolve)
          .catch(txReject);
      });
    });
  }

  static async selectAll(connection: any, entity: Entity) {
    const sql = QueryBuilder.selectAll(entity);
    return SQLiteRepository.executeBulkSql(connection, [sql]);
  }

  static async findById(connection: any, entity: Entity, id: string | number) {
    const pkColumn = entity.columns.find((column) => column.primaryKey);
    const sql = QueryBuilder.findById(entity, pkColumn!, id);
    return SQLiteRepository.executeBulkSql(connection, [sql]);
  }

  static async find(connection: any, entity: Entity, options: IFindOptions) {
    const sql = QueryBuilder.find(entity, options);
    return SQLiteRepository.executeBulkSql(connection, [sql]);
  }
}
