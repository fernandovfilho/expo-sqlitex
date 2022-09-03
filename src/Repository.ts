import { SQLiteRepository } from "./SQLiteRepository";
import { Entity } from "./types/Entity";
import { IFindOptions } from "./types/Find";

export class Repository<T> {
  entity: Entity;
  connection: any;
  constructor(connection: any, entity: Entity) {
    this.entity = entity;
    this.connection = connection;
  }

  getId(obj: any) {
    const idColumn = this.entity.columns.find((column) => column.primaryKey);
    return obj[idColumn?.name!];
  }

  async createTable(): Promise<boolean> {
    try {
      await SQLiteRepository.createTable(this.connection, this.entity);
      return true;
    } catch (error) {
      return false;
    }
  }

  async dropTable() {
    return await SQLiteRepository.dropTable(this.connection, this.entity);
  }

  async save(obj: T): Promise<T> {
    await SQLiteRepository.save(this.connection, this.entity, obj);
    return await this.findById(this.getId(obj));
  }

  async rawQuery(rawSql: string) {
    return await SQLiteRepository.executeBulkSql(this.connection, [rawSql]);
  }

  async multipleInsert(objs: T[]) {
    return await SQLiteRepository.multipleInsert(
      this.connection,
      this.entity,
      objs
    );
  }

  async deleteAll() {
    return await SQLiteRepository.deleteAll(this.connection, this.entity);
  }

  async selectAll(): Promise<T[]> {
    const results = (await SQLiteRepository.selectAll(
      this.connection,
      this.entity
    )) as any[];
    return results[0].rows as unknown as T[];
  }

  async findById(id: string | number): Promise<T> {
    const obj = (await SQLiteRepository.findById(
      this.connection,
      this.entity,
      id
    )) as any[];
    return obj[0].rows[0] as unknown as T;
  }

  async find(options: IFindOptions): Promise<T[]> {
    const results = (await SQLiteRepository.find(
      this.connection,
      this.entity,
      options
    )) as any[];
    return results[0].rows as unknown as T[];
  }
}
