export class Operation {
  constructor(
    public id:string,
    public no: string,
    public create_time: number,
    public progress_time:number,
    public progress_name:string,
    public progress_status_code:number,
    public actions:any[],
    public signString:string
  ) {  }
}
