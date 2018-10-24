export class AuthList {
  constructor(
    public id: number,
    public name: string,
    public ops: any[],
    public children: AuthList[],
  ) {  }
}
export class Auth {
  constructor(
    public roleId: number,
    public authId: number,
  ) {  }
}
