export class AuthList {
  constructor(
    public id: number,
    public name: string,
    public level: number,
    public ops: any[],
  ) {  }
}
export class Auth {
  constructor(
    public roleId: number,
    public authId: number,
  ) {  }
}
