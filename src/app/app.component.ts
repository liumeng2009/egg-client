import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {en_US, NzI18nService, zh_CN} from 'ng-zorro-antd';
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
    const pathname = location.pathname;
    if (pathname.indexOf('/zh/') > -1) {
      this.nzI18nService.setLocale(zh_CN);
    } else if (pathname.indexOf('/en/') > -1) {
      this.nzI18nService.setLocale(en_US);
    } else {
      this.nzI18nService.setLocale(zh_CN);
    }
  }
}
