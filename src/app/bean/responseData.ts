export class ResponseData {
  constructor(
    public code: number,
    public error: string,
    public message: string,
    public data: any,
    public total: number,
  ) {  }
}
