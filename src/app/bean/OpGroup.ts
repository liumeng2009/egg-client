import {Operation} from "./operation";
export class OperationGroup {
  constructor(
    public hour: number,
    public hour_name: string,
    public opList:Operation[]
  ) {  }
}
