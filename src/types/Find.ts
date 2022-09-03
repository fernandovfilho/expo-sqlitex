export interface IFindOptions {
  columns?: string[];
  where?: {
    column: string;
    condition: "=" | "!=" | "<" | ">" | "<=" | ">=" | "IN" | "NOT IN" | "LIKE";
    value: string | boolean | number | null | string[] | number[];
  }[];
  orderBy?: [
    {
      column: string;
      direction: "ASC" | "DESC";
    }
  ];
}
