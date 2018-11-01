export class User {
  constructor(
    public id: number,
    public realname: string,
    public password: string,
    public age: number,
    public roleId: any,
    public role: any,
    public avatar: string,
    public avatarUseSys: number,
    public mobile: string,
    public checked: boolean,
  ) {  }
}
