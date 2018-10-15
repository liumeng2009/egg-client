import {Injectable} from '@angular/core';
import {User} from '../../bean/user';
@Injectable()
export class RememberService {

  private user: User;
  setUser(user: User) {
    this.user = user;
  }
  getUser() {
    return this.user;
  }
}

