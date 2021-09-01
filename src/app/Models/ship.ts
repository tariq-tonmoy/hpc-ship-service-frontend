import { Dimension } from "./dimension";

export interface Ship {
  shipId: string;
  shipName: string;
  code: string;
  dimensions: Dimension[]
}
