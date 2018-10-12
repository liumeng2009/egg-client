export class User {
  constructor(
    public id: string,
    public realname: string,
    public password: string,
    public age: number,
    public role: any,
    public avatar: string,
    public avatarUseImg: string,
    public mobile: string
  ) {  }
}
