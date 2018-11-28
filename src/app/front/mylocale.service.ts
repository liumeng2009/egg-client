import {Injectable} from '@angular/core';
@Injectable()
export class MyLocaleService {
  private myLocale = {};
  setMylocale(myLocale: any) {
    this.myLocale = myLocale;
  }
  getMyLocale() {
    return this.myLocale;
  }
}

