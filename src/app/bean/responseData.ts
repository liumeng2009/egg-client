export class ResponseData {
  constructor(
    public status: number,
    public message:string,
    public data:any,
    public total:number
  ) {  }
}
