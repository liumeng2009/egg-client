import {Equipment} from "./equipment";
import {EquipType} from "./equipType";
import {BusinessContent} from "./businessContent";
export class Needs {
  constructor(
    public equipment:Equipment,
    public type:EquipType,
    public op: BusinessContent,
    public no: number,
    public edit:boolean,
    public forget:boolean
  ) {  }
}
