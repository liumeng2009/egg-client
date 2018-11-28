import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {en_US, NzI18nInterface, NzI18nService, zh_CN} from 'ng-zorro-antd';
import {appZh} from '../locale/zh';
import {appEn} from '../locale/en';
import {MyLocaleService} from './front/mylocale.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private nzI18nService: NzI18nService,
    private myLocaleService: MyLocaleService,
  ) {}
  ngOnInit() {
    this.initLang();
  }
  initLang() {
    console.log(this.nzI18nService.getLocale());
    const lang = this.cookieService.get('lang');
    switch (lang) {
      case 'zh-cn':
        this.nzI18nService.setLocale(zh_CN);
        this.myLocaleService.setMylocale(appZh);
        break;
      case 'en':
        this.nzI18nService.setLocale(en_US);
        this.myLocaleService.setMylocale(appEn);
        break;
      default:
        this.nzI18nService.setLocale(zh_CN);
        this.myLocaleService.setMylocale(appZh);
    }
  }
}
