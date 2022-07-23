import { Entity } from "./Entity";
import { SQLiteRepository } from "./SQLiteRepository";

export class Repository<T> {
  entity: Entity;
  connection: any;
  constructor(connection: any, entity: Entity) {
    this.entity = entity;
    this.connection = connection;
  }

  async createTable(): Promise<boolean> {
    try {
      await SQLiteRepository.createTable(this.connection, this.entity);
      console.log("Table created:", this.entity.tableName);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async dropTable(): Promise<boolean> {
    console.log("drop table", this.entity);
    return true;
  }

  async save(obj: T): Promise<T> {
    const currentObj = obj as any;
    currentObj.id = "teste";
    return currentObj as T;
  }
}
