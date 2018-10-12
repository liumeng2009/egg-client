import {EquipType} from "./equipType";
import {Equipment} from "./equipment";
import {Order} from "./order";
import {BusinessContent} from "./businessContent";

//工单模型
export class WorkOrder {
  constructor(
    public id:string,

    public no:string,

    //订单建立时间
    public incoming_date_timestamp:number,

    public incoming_date:Date,

    public important:boolean,

    //工单建立时间
    public create_time:number,

    //响应时间
    public arrive_date_timestamp:number,

    public arrive_date:string,


    //完成时间
    public finish_date_timestamp:number,

    public finish_date:string,

    public worker:string,

    public type:EquipType,

    public equipment:Equipment,

    public op:BusinessContent,

    public checked:boolean,

    public showArriveDate:boolean,

    public showFinishDate:boolean,

    public showWorker:boolean,

    public remark:string,

    //指派工程师时间
    public call_date_timestamp:number,

    public call_date:Date,

    public isCompleteOperation:boolean,

    public select:boolean,

    public order:string

  ) {  }
}
