import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {en_US, NzI18nService, zh_CN} from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private cookieService: CookieService,
    private nzI18nService: NzI18nService,
  ) {}
  ngOnInit() {
    this.initLang();
  }
  initLang() {
    const lang = this.cookieService.get('lang');
    switch (lang) {
      case 'zh-cn':
        this.nzI18nService.setLocale(zh_CN);
        break;
      case 'en-us':
        this.nzI18nService.setLocale(en_US);
        break;
      default:
        this.nzI18nService.setLocale(zh_CN);
    }
  }
}
