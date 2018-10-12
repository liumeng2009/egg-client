import {EquipOp} from "./equipOp";
import {EquipType} from "./equipType";
export class BusinessContent {
  constructor(
    public id:string,
    public equipment: string,
    public equipType:EquipType,
    public equipOp:EquipOp
  ) {  }
}
