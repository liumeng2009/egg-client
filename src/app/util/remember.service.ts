import {Injectable} from '@angular/core';
import {User} from '../bean/user';
@Injectable()
export class RememberService {

  private user: User;
  private channelId = 1;
  private categoryId = 0;
  private lang = 'zh';
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
  setCategory(categoryId: number) {
    this.categoryId = categoryId;
  }
  getCategory() {
    return this.categoryId;
  }
  setLang(lang: string) {
    this.lang = lang;
  }
  getLang() {
    return this.lang;
  }
}

