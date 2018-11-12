import {Injectable} from '@angular/core';
import {User} from '../../bean/user';
@Injectable()
export class RememberService {

  private user: User;
  private channelId = 1;
  setUser(user: User) {
    this.user = user;
  }
  getUser() {
    return this.user;
  }
  setChannel(channelId: number) {
    this.channelId = channelId;
  }
  getChannel() {
    return this.channelId;
  }
}

