import {WorkOrder} from "./workOrder";
import {Corporation} from "./Corporation";
import {Operation} from "./operation";
export class Order {
  constructor(
    public id:string,
    public no:string,
    public incoming_time: number,
    public incoming_time_show:string,
    public custom_name:string,
    public custom_phone:string,
    public corporation:Corporation,
    public custom_position:string,
    public operations:Operation[],
    public workerOrders:WorkOrder[]
  ) {  }
}
