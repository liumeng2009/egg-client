export class User {
  constructor(
    public id: string,
    public realname: string,
    public password: string,
    public age: number,
    public roleId: any,
    public avatar: string,
    public avatarUseSys: number,
    public mobile: string,
  ) {  }
}
